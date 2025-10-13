# Accounts Data Structure Analysis

## Executive Summary

The **`accounts.json`** (current) and **`accounts_older_version.json`** files have SIGNIFICANT differences in their data structure and richness. The older version contains **embedded related data** (products, users, stakeholders), while the current version is a **simplified/flattened structure**.

---

## 📊 KEY DIFFERENCES

| Aspect | Current (`accounts.json`) | Older Version (`accounts_older_version.json`) |
|--------|---------------------------|----------------------------------------------|
| **File Size** | 103 KB | 1.7 MB (17x larger) |
| **Accounts** | 50 accounts | 50 accounts |
| **Products** | ❌ NOT included | ✅ Embedded array (avg 3-5 per account) |
| **Users** | ❌ NOT included | ✅ Embedded array (avg 50-70 per account) |
| **Stakeholders** | ❌ NOT included | ✅ Embedded array (avg 4-5 per account) |
| **Contract** | ❌ NOT included | ❌ NOT included |
| **Timeline** | ✅ 3 entries | ✅ 12 entries (fuller history) |
| **Account Fields** | ✅ 23 fields (more billing/finance data) | ✅ 11 fields (basic info) |

---

## 🔍 DETAILED STRUCTURE COMPARISON

### Current `accounts.json` Structure
```json
{
  "account": {
    "id": "CUST_000001",
    "name": "TechCorp Industries",
    "tier": "Enterprise",
    "industry": "Technology",
    "arr": 1522871,
    "csm_id": "CSM_001",
    "story_type": "expansion_success",
    "is_hero_account": true,
    "created_date": "2023-09-14T16:02:56.918Z",
    "geography": { "theater": "EMEA", "region": "Central", ... },
    "hero_features": [...],
    // NEW FIELDS NOT IN OLDER VERSION:
    "mrr": 126905.92,
    "starting_arr": 1309450.83,
    "expansion_arr": 0,
    "churn_arr": 0,
    "contraction_arr": 0,
    "arr_trend": "stable",
    "payment_terms": "Net 45",
    "billing_frequency": "quarterly",
    "renewal_risk_score": 62,
    "health_score": 31,
    "last_invoice_date": "2025-08-26T00:00:00",
    "last_payment_date": "2025-09-19T00:00:00"
  },
  "timeline": [ /* 3 entries */ ]
  // MISSING: products, users, stakeholders
}
```

### Older `accounts_older_version.json` Structure
```json
{
  "account": {
    "id": "CUST_000001",
    "name": "TechCorp Industries",
    "tier": "Enterprise",
    "industry": "Technology",
    "arr": 1522871,
    "csm_id": "CSM_001",
    "story_type": "expansion_success",
    "is_hero_account": true,
    "created_date": "2023-09-14T16:02:56.918Z",
    "geography": { "theater": "EMEA", "region": "Central", ... },
    "hero_features": [...]
  },
  "products": [
    {
      "family": "Duo",
      "licenses": 1065,
      "utilization": 95,
      "adoption_stage": "Mature",
      "implementation_date": "2023-12-05T22:08:39.991Z",
      "renewal_date": "2025-02-25T16:17:04.562Z"
    }
    // ... 2-4 more products
  ],
  "users": [
    {
      "id": "USER_00000001",
      "account_id": "CUST_000001",
      "name": "Dr. Franklin Ryan-Robel",
      "email": "Destany.Rolfson@gmail.com",
      "role": "Global Usability Officer",
      "department": "IT",
      "last_login": "2025-09-16T14:57:27.020Z",
      "activity_level": "Low",
      "features_used": 7,
      "created_date": "2023-08-25T02:35:15.231Z"
    }
    // ... 50-70 more users
  ],
  "stakeholders": [
    {
      "id": "STAKE_000001",
      "name": "Salvador Schuster",
      "role": "CTO",
      "email": "Odell.Balistreri11@gmail.com",
      "influence_level": "Low",
      "engagement_score": 7,
      "last_contact": "2025-07-25T11:44:29.126Z",
      "champion_strength": "Weak",
      "engagement_history": [ /* 10-15 entries */ ],
      "influence_network": [ /* 2-3 connections */ ],
      "communication_preferences": "phone",
      "decision_making_style": "analytical",
      "pain_points": [...],
      "success_metrics": [...]
    }
    // ... 3-5 more stakeholders
  ],
  "timeline": [ /* 12 entries with full year history */ ]
}
```

---

## 🗄️ MASTER-DATA FOLDER FILES

| File | Records | Join Key | Description |
|------|---------|----------|-------------|
| `customers.json` | 51 | `customer_id` | Basic customer metadata |
| `contracts.json` | 60 | `customer_id` | Contract details, dates, terms |
| `licenses.json` | 121 | `customer_id` | Product licenses per customer |
| `users.json` | 3,493 | `account_id` | All users across all accounts |
| `stakeholders.json` | 226 | `customer_id` | Key stakeholders per account |
| `products.json` | 5 | N/A | Product catalog (reference) |

---

## 🔗 DATA JOIN RELATIONSHIPS

```
accounts.json (current)
  └─ account.id = CUST_XXXXXX
       │
       ├─ JOIN → contracts.json (customer_id)
       │         └─ Get: contract_id, start_date, end_date, payment_terms
       │
       ├─ JOIN → licenses.json (customer_id)
       │         └─ Get: product_family, license_count, utilization, adoption_stage
       │         └─ GROUP BY customer_id → ARRAY as "products"
       │
       ├─ JOIN → users.json (account_id)
       │         └─ Get: All user records for this account
       │         └─ GROUP BY account_id → ARRAY as "users"
       │
       └─ JOIN → stakeholders.json (customer_id)
                 └─ Get: All stakeholder records for this account
                 └─ GROUP BY customer_id → ARRAY as "stakeholders"
```

---

## 📝 TRANSFORMATION LOGIC

### To Convert: `accounts.json` → `accounts_older_version.json` Structure

```javascript
FOR EACH account IN accounts.json:
  
  // 1. Keep base account structure
  newAccount = {
    account: account.account
  }
  
  // 2. JOIN products from licenses.json
  newAccount.products = licenses
    .filter(l => l.customer_id === account.account.id)
    .map(l => ({
      family: l.product_family,
      licenses: l.license_count,
      utilization: l.utilization,
      adoption_stage: l.adoption_stage,
      implementation_date: l.implementation_date,
      renewal_date: l.renewal_date
    }))
  
  // 3. JOIN users from users.json
  newAccount.users = users
    .filter(u => u.account_id === account.account.id)
  
  // 4. JOIN stakeholders from stakeholders.json
  newAccount.stakeholders = stakeholders
    .filter(s => s.customer_id === account.account.id)
  
  // 5. Optional: JOIN contract from contracts.json
  contract = contracts.find(c => c.customer_id === account.account.id)
  if (contract) {
    newAccount.contract = contract
  }
  
  // 6. Keep timeline from accounts.json OR expand it
  newAccount.timeline = account.timeline
```

---

## 🎯 WHY CSM DASHBOARDS USE `accounts_older_version.json`

### Critical CSM Dashboard Dependencies:

1. **Active User Calculations** 
   - **Requires**: `users` array
   - **Used in**: MAU/DAU/WAU metrics, Login Frequency, Active User Trends
   
2. **Product Adoption Metrics**
   - **Requires**: `products` array with `utilization`, `adoption_stage`
   - **Used in**: Product Adoption Rate, Feature Adoption Depth, Utilization Distribution

3. **License Utilization**
   - **Requires**: `products` array with `licenses` and `utilization`
   - **Used in**: License Utilization Analysis, Overage Alerts

4. **Stakeholder Engagement**
   - **Requires**: `stakeholders` array
   - **Used in**: Engagement tracking, Champion identification

5. **Historical Trends**
   - **Requires**: Longer `timeline` (12 months vs 3 months)
   - **Used in**: All trend calculations (30-day, 90-day)

### What Current `accounts.json` CAN'T Support:
- ❌ Accurate active user counts
- ❌ Product-level utilization metrics
- ❌ Stakeholder engagement tracking
- ❌ Deep user activity analysis
- ❌ Longer historical trend analysis

---

## 🚀 RECOMMENDED APPROACH

### Option 1: **Merge Master-Data into `accounts.json`** (Recommended)
**Pros:**
- Single source of truth
- Matches older version structure
- All CSM dashboards work immediately
- Easier to maintain

**Cons:**
- Larger file size (~1.7 MB)
- More complex data structure

**Implementation:**
```bash
# Run transformation script (see below)
node scripts/merge-accounts-data.js
```

### Option 2: **Keep Separate Files + Runtime JOIN**
**Pros:**
- Smaller individual files
- Normalized data structure
- Easier to update individual entities

**Cons:**
- More complex dashboard queries
- Need to modify all CSM dashboard components
- Potential performance issues
- Risk of missing data if joins fail

**Implementation:**
- Modify `lib/data-service.ts` to load and join all files at runtime
- Update all CSM dashboard components to handle joined data

---

## 📦 COMMERCIAL_OPERATIONS FOLDER

The `commercial_operations` folder contains a **separate copy** of accounts with additional commercial-specific data:

| File | Purpose |
|------|---------|
| `accounts.json` | **Duplicate** of main accounts with commercial metadata |
| `subscriptions.json` | Subscription details |
| `orders.json` | Order history |
| `invoices.json` | Invoice records |
| `payments.json` | Payment transactions |
| `quotes.json` | Sales quotes |
| `revenue_movements.json` | ARR changes over time |

**Note**: This folder is primarily for **Commercial Operations** dashboards, NOT CSM dashboards.

---

## 🎭 HERO-ACCOUNTS.JSON

Special subset of accounts with **rich narrative data**:
- Deep timeline history (12+ months)
- Detailed engagement events
- Expansion signals
- Business milestones
- Support activity details

**Current Usage**: CSM dashboards prioritize hero accounts for richer data when available.

---

## ✅ CONCLUSION

To make `accounts.json` work like `accounts_older_version.json` for CSM dashboards, you MUST:

1. **Join licenses.json** → `products` array
2. **Join users.json** → `users` array  
3. **Join stakeholders.json** → `stakeholders` array
4. **Optionally join contracts.json** → `contract` object
5. **Expand timeline** from 3 to 12 months (if needed)

**The transformation script below automates this process.**

