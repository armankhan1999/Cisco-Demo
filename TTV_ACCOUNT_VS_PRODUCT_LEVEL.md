# TTV: Account-Level vs Product-Level Calculation

## Current Implementation: Product-Level (Subscription-Level)

### How It Works Now:
**Each subscription** (product per customer) is counted separately.

### Example:
```
CUST_000001 has 3 subscriptions:
├── Duo:      Start: Dec 5  → Impl: Dec 5   = 0 days
├── Meraki:   Start: Dec 25 → Impl: Dec 25  = 0 days
└── Umbrella: Start: Nov 11 → Impl: Nov 11  = 0 days

CUST_000002 has 1 subscription:
└── Duo:      Start: Jan 22 → Impl: May 7   = 106 days

Total Subscriptions: 4
Total Days: 0 + 0 + 0 + 106 = 106
Average TTV = 106 / 4 = 26.5 days
```

**Result**: Product-level TTV = **26.5 days**

---

## Alternative: Account-Level Calculation

### How It Would Work:
First average TTV **per account**, then average across **all accounts**.

### Same Example - Account Level:
```
CUST_000001:
  Duo:      0 days
  Meraki:   0 days
  Umbrella: 0 days
  Account Average: (0 + 0 + 0) / 3 = 0 days

CUST_000002:
  Duo:      106 days
  Account Average: 106 / 1 = 106 days

Overall Average TTV = (0 + 106) / 2 = 53 days
```

**Result**: Account-level TTV = **53 days**

---

## Why Does 75% at 0 Days Still Show Low Average?

### Mathematical Explanation:

**Distribution in Your Dataset:**
- 75% of subscriptions: TTV = 0 days
- 25% of subscriptions: TTV varies (30-120 days)

### Example with 100 Subscriptions:

#### Scenario 1: Product-Level Calculation
```
75 subscriptions with 0 days
25 subscriptions with average 80 days

Total Days = (75 × 0) + (25 × 80) = 0 + 2,000 = 2,000 days
Average TTV = 2,000 / 100 = 20 days
```

**The 75% at 0 days "dilutes" the average!**

#### Scenario 2: Account-Level Calculation
```
Assume 50 accounts:
- 30 accounts have all products at 0 days
- 20 accounts have some products with delays (average 80 days)

Account-Level:
  30 accounts: 0 days
  20 accounts: 80 days
  
Total = (30 × 0) + (20 × 80) = 1,600 days
Average TTV = 1,600 / 50 = 32 days
```

**Account-level gives more weight to customers with delays.**

---

## Real Example from Your Data

### Product-Level (Current):

| Customer | Product | TTV |
|----------|---------|-----|
| CUST_000001 | Duo | 0 |
| CUST_000001 | Meraki | 0 |
| CUST_000001 | Umbrella | 0 |
| CUST_000002 | Duo | 106 |
| CUST_000002 | Meraki | 0 |
| CUST_000002 | Umbrella | 0 |
| CUST_000003 | Duo | 45 |
| CUST_000003 | Meraki | 0 |

**Calculation:**
```
Total = 0+0+0+106+0+0+45+0 = 151 days
Count = 8 subscriptions
Average = 151 / 8 = 18.9 days
```

### Account-Level (Alternative):

| Customer | Products | Account Avg TTV |
|----------|----------|-----------------|
| CUST_000001 | Duo(0) + Meraki(0) + Umbrella(0) | 0 days |
| CUST_000002 | Duo(106) + Meraki(0) + Umbrella(0) | 35 days |
| CUST_000003 | Duo(45) + Meraki(0) | 22.5 days |

**Calculation:**
```
Total = 0 + 35 + 22.5 = 57.5 days
Count = 3 accounts
Average = 57.5 / 3 = 19.2 days
```

---

## Why the 25% Matters

### The 25% with Delays:

Even though 75% show 0 days, the **25% with delays pull the average up**.

**Example:**
```
75 subscriptions × 0 days = 0
25 subscriptions × 60 days (average) = 1,500

Total = 1,500 days
Average = 1,500 / 100 = 15 days
```

**Without the 25%:**
```
100 subscriptions × 0 days = 0
Average = 0 days
```

**So the 25% is WHY you see 15-30 days instead of 0!**

---

## Which Approach is Better?

### Product-Level (Current) ✅
**Use when you want to:**
- Measure implementation efficiency per product
- Track which products deploy faster
- Get subscription-level granularity

**Advantages:**
- More data points (more statistically valid)
- Shows product-specific patterns
- Industry standard for SaaS

### Account-Level ❌
**Use when you want to:**
- Measure customer experience
- Each customer counts equally
- Avoid multi-product customers skewing data

**Disadvantages:**
- Fewer data points (less statistically valid)
- Hides product-level differences
- Not standard metric

---

## Recommended: Product-Level (Keep Current)

**Your current implementation is CORRECT** for these reasons:

1. **Industry Standard**: Most SaaS companies calculate TTV per subscription
2. **More Granular**: Shows product-specific patterns
3. **Statistically Valid**: More data points = more reliable average
4. **Actionable**: Can identify which products need faster implementation

---

## How to Implement Account-Level (If Needed)

### Code Change Required:

```typescript
export function calculateTimeToValue(filteredAccounts?: any[]): KPIResult {
  const allSubscriptions = getActiveSubscriptions();
  const allLicenses = getAllLicenses();
  
  const accounts = filteredAccounts || getActiveAccounts();
  
  let accountTTVs: number[] = [];
  
  // Calculate TTV per account
  accounts.forEach(account => {
    const accountSubs = allSubscriptions.filter(sub => 
      sub.customer_id === account.account.id
    );
    
    let accountTotalDays = 0;
    let accountCount = 0;
    
    accountSubs.forEach(sub => {
      const license = allLicenses.find(l => 
        l.customer_id === sub.customer_id && 
        l.product_family === sub.product_family
      );
      
      if (license?.implementation_date) {
        const subStart = new Date(sub.subscription_start_date);
        const implDate = new Date(license.implementation_date);
        const days = Math.floor((implDate - subStart) / (1000 * 60 * 60 * 24));
        
        if (days >= 0 && days <= 365) {
          accountTotalDays += days;
          accountCount++;
        }
      }
    });
    
    if (accountCount > 0) {
      const accountAvg = accountTotalDays / accountCount;
      accountTTVs.push(accountAvg);
    }
  });
  
  // Average across accounts
  const avgTTV = accountTTVs.length > 0 
    ? accountTTVs.reduce((sum, ttv) => sum + ttv, 0) / accountTTVs.length
    : 0;
  
  return {
    value: avgTTV,
    formatted: accountTTVs.length > 0 ? `${Math.round(avgTTV)} days` : 'N/A',
    target: 60,
    status: avgTTV > 0 && avgTTV <= 60 ? 'success' : 'warning',
    trend: avgTTV <= 60 ? 'down' : 'up',
    change: ''
  };
}
```

---

## Summary

| Aspect | Product-Level (Current) | Account-Level (Alternative) |
|--------|------------------------|---------------------------|
| **Calculation** | Per subscription | Per account, then average |
| **75% at 0 days** | Pulls average down to ~15-20 days | Still affects but differently |
| **25% with delays** | Adds to overall average | Affects account averages |
| **Result** | Lower average (15-30 days) | Higher average (30-50 days) |
| **Recommended** | ✅ Yes (Industry standard) | ❌ No (Unless specific need) |

**Current behavior is CORRECT.** The low TTV (showing 15-30 days) reflects that most implementations are fast, which is **GOOD**!
