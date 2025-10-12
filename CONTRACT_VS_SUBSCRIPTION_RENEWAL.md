# Contract vs Subscription Renewal Dates - Fixed Implementation

## ✅ **Fixed - Now Using Account-Level Contracts!**

You're absolutely correct! We should use **`contracts.json`** instead of **`subscriptions.json`** for calculating days to renewal.

---

## 🎯 **Why Contracts.json is Better:**

### **Problem with subscriptions.json:**
- ❌ **Product-level data** - One account can have multiple subscriptions (Meraki, Duo, Umbrella, etc.)
- ❌ **Different renewal dates per product** - Confusing for account-level view
- ❌ **Doesn't represent the master contract**

**Example:**
```
CUST_000001 has:
  - Meraki subscription ends: 2025-04-04
  - Duo subscription ends: 2025-02-25
  - Umbrella subscription ends: 2025-06-15
```
Which date should we show? ❌ Inconsistent!

---

### **Solution with contracts.json:**
- ✅ **Account-level data** - One contract per customer
- ✅ **Single renewal date** - Represents the master contract
- ✅ **Cleaner for account-level dashboards**

**Example:**
```json
{
  "contract_id": "CONTRACT_CUST_000001",
  "customer_id": "CUST_000001",
  "start_date": "2023-09-14T16:02:56.918Z",
  "end_date": "2026-07-01T16:31:32.673Z",  ← Account-level renewal date
  "arr": 1522871,
  "contract_type": "Renewal",
  "status": "Active"
}
```

---

## 🔧 **What Was Changed:**

### **File:** `src/app/csm/kpi/at-risk-arr/page.tsx`

### **Before (Product-Level):**
```typescript
import { getAllSubscriptions } from '@/lib/data/csmDataLoader';

const subscriptions = getAllSubscriptions();

// Find subscription for renewal date (product-level)
const subscription = subscriptions.find(sub => 
  sub.customer_id === acc.account.id
);

const renewalDate = subscription ? 
  new Date(subscription.subscription_end_date) : null;
```

**Problems:**
- Multiple subscriptions per account
- Inconsistent renewal dates
- Product-level, not account-level

---

### **After (Account-Level):**
```typescript
import contractsData from '@/source_data/master-data/contracts.json';

const contracts = contractsData as any[];

// Find contract for account-level renewal date (not product-level)
const contract = contracts.find(c => 
  c.customer_id === acc.account.id
);

const renewalDate = contract ? 
  new Date(contract.end_date) : null;
```

**Benefits:**
- ✅ One contract per account
- ✅ Single master renewal date
- ✅ Account-level consistency

---

## 📊 **Data Comparison:**

### **TechCorp Industries (CUST_000001):**

#### **Old Way (subscriptions.json):**
```json
Multiple subscriptions:
- Duo ends: "2025-02-25" → -228 days ❌
- Meraki ends: "2025-04-04" → -190 days ❌
- Which one to show? Confusing!
```

#### **New Way (contracts.json):**
```json
Single contract:
{
  "customer_id": "CUST_000001",
  "end_date": "2026-07-01T16:31:32.673Z"  → +264 days ✅
}
```

**Current Date:** October 12, 2025
**Contract End:** July 1, 2026
**Days to Renewal:** +264 days (8.8 months) ✅

---

## 🎯 **Why This is the Right Approach:**

### **1. Account-Level View**
At-Risk ARR page shows **accounts**, not individual products. Using contract-level renewal dates makes sense.

### **2. Master Contract**
The contract represents the **entire relationship** with the customer, not just one product line.

### **3. Business Reality**
Companies typically have a **master contract** with renewal dates that cover all products, even if products were added at different times.

### **4. Consistent with Other Tools**
CRM systems like Salesforce track **contract renewal dates** at the account level.

---

## 📋 **Data Structure:**

### **contracts.json Schema:**
```json
{
  "contract_id": "CONTRACT_CUST_XXXXX",
  "customer_id": "CUST_XXXXX",
  "start_date": "ISO date",
  "end_date": "ISO date",          ← Used for days to renewal
  "arr": 1522871,                  ← Account-level ARR
  "payment_terms": "Net 60",
  "auto_renewal": true,
  "contract_type": "Renewal|New|Amendment",
  "status": "Active|Expired|Pending"
}
```

### **Key Fields:**
- **`customer_id`** - Links to accounts.json
- **`end_date`** - Master contract renewal date ✅
- **`arr`** - Total account ARR (matches accounts.json)
- **`contract_type`** - New, Renewal, or Amendment
- **`auto_renewal`** - Whether contract auto-renews

---

## 🔢 **New Calculation Logic:**

```typescript
// Step 1: Find account's master contract
const contract = contracts.find(c => 
  c.customer_id === account.id
);

// Step 2: Get contract end date
const contractEndDate = new Date(contract.end_date);

// Step 3: Calculate days to renewal
const today = new Date();
const daysToRenewal = Math.ceil(
  (contractEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
);

// Result:
// Positive number = Days until renewal
// Negative number = Days overdue
```

---

## 📊 **Example Results:**

| Account | Old (Subscription) | New (Contract) | Difference |
|---------|-------------------|----------------|------------|
| TechCorp | -228 days | +264 days | ✅ More accurate |
| Global Premier | -228 days | +254 days | ✅ Shows future renewal |
| Bode-Mayer | -13 days | +105 days | ✅ Contract still active |

---

## 🎨 **Visual Indicators Updated:**

### **Days to Renewal Display:**

**Before (Wrong):**
```
-228 days (Red - looks expired) ❌
```

**After (Correct):**
```
+264 days (8.8 months until renewal) ✅
```

**Color Coding:**
- 🔴 **Red:** < 90 days to renewal (urgent)
- ⚫ **Gray:** ≥ 90 days to renewal (normal)
- 🟢 **Green:** > 180 days (safe)

---

## ✅ **Benefits of This Change:**

### **1. Accuracy**
- Shows actual master contract renewal dates
- Not confused by multiple product subscriptions

### **2. Clarity**
- One renewal date per account
- Easier for CSMs to understand and plan

### **3. Consistency**
- Matches how contracts are typically managed
- Aligns with CRM systems

### **4. Better Planning**
- CSMs can see true renewal timelines
- No confusion about which product renewal to track

---

## 🔗 **Data Flow:**

```
contracts.json (Account-Level)
  ↓
customer_id: "CUST_000001"
  ↓
end_date: "2026-07-01"
  ↓
Calculate: (end_date - today)
  ↓
Result: +264 days
  ↓
Display: "264 days" (gray text - not urgent)
```

vs

```
subscriptions.json (Product-Level) ❌
  ↓
customer_id: "CUST_000001"
  ↓
Multiple subscriptions:
  - Duo: "2025-02-25"
  - Meraki: "2025-04-04"
  - Umbrella: "2025-06-15"
  ↓
Which one to use? ❌ Confusing!
```

---

## 📝 **Real Data Examples:**

### **From contracts.json:**

```json
[
  {
    "contract_id": "CONTRACT_CUST_000001",
    "customer_id": "CUST_000001",
    "end_date": "2026-07-01T16:31:32.673Z",
    "arr": 1522871
  },
  {
    "contract_id": "CONTRACT_CUST_000002",
    "customer_id": "CUST_000002",
    "end_date": "2026-06-22T04:48:33.504Z",
    "arr": 3627162
  },
  {
    "contract_id": "CONTRACT_CUST_000003",
    "customer_id": "CUST_000003",
    "end_date": "2026-01-24T22:32:59.448Z",
    "arr": 804011
  }
]
```

**All contracts end in 2026** - Future renewals, not overdue! ✅

---

## 🎯 **Summary:**

### **You Were Right!**
- ✅ Contracts.json is the correct source for account-level renewal dates
- ✅ Provides single, consistent renewal date per account
- ✅ More accurate than using product-level subscription dates

### **What Changed:**
- ✅ Switched from `subscriptions.json` to `contracts.json`
- ✅ Changed from `subscription_end_date` to `contract.end_date`
- ✅ Now shows account-level master contract renewal dates

### **Impact:**
- ✅ More accurate days to renewal calculations
- ✅ Clearer for CSMs to plan renewal activities
- ✅ Consistent with enterprise contract management practices

**Thank you for catching this! The data is now correctly using account-level contracts instead of product-level subscriptions.** 🎉
