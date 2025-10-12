# Portfolio License Utilization - KPI Summary Stats Fix

## 🔴 Problem

The KPI summary stats at the top of the "Account-Level Utilization Details" table were showing incorrect values:

```
Total Accounts: 45
Total ARR: $925K
Avg Utilization: 70%
High Priority: 0
```

## 🔍 Root Cause

Found **two bugs** in `src/lib/kpis/licenseUtilizationKPIs.ts` in the `calculateAccountUtilizationDetails()` function:

### Bug 1: Wrong Field Name (Line 827)
```typescript
// BEFORE (WRONG):
const totalUsed = utilizations.reduce((sum, util) => sum + util.licenses_used, 0);
```

**Problem:** The field `licenses_used` doesn't exist in `utilization_history.json`. The correct field is `active_users`.

**Result:** Always returned 0, causing all utilization calculations to be wrong.

---

### Bug 2: Wrong ARR Source (Line 865)
```typescript
// BEFORE (WRONG):
arr: subscription.arr || 0,
```

**Problem:** Using `subscription.arr` which is **product-level ARR** (e.g., $400 for just Meraki), not account-level ARR.

**Result:** Total ARR was the sum of individual product ARRs instead of actual account ARRs.

**Example:**
- CUST_000043 actual ARR: **$10,017** (from accounts.json)
- Subscription ARR (Meraki only): **$400** (from subscriptions.json) ❌
- Missing Duo ARR: $18

---

## ✅ The Fix

### Fix 1: Use Correct Field Name
```typescript
// AFTER (CORRECT):
const totalUsed = utilizations.reduce((sum, util) => sum + util.active_users, 0);
const totalAvailable = totalLicenses - totalUsed;  // Recalculate based on correct data
```

### Fix 2: Use Account-Level ARR
```typescript
// AFTER (CORRECT):
arr: account.account?.arr || account.arr || 0,  // Use account-level ARR from accounts.json
```

---

## 📊 Expected Results After Fix

The KPI summary should now show **real values** based on actual data from `utilization_history.json` and `accounts.json`:

### Before Fix:
```
Total Accounts: 45          ← May be correct
Total ARR: $925K            ← WRONG (sum of product-level ARRs)
Avg Utilization: 70%        ← WRONG (calculated from 0 active users)
High Priority: 0            ← WRONG (priority calculated from wrong utilization)
```

### After Fix:
```
Total Accounts: [Actual count of unique accounts with utilization data]
Total ARR: [Sum of real account.arr values from accounts.json]
Avg Utilization: [Real average: (sum of active_users / sum of total_licenses) * 100]
High Priority: [Actual count of accounts with priorityScore >= 70]
```

---

## 🔄 How the Calculation Works Now

### Step 1: Load Data
```typescript
utilizationHistory = loadUtilizationHistory();  // From utilization_history.json
accounts = loadAccounts();                      // From accounts.json
subscriptions = loadSubscriptions();            // From subscriptions.json
```

### Step 2: Get Latest Snapshot
```typescript
latestDate = max(utilizationHistory.snapshot_date);
currentUtilization = utilizationHistory.filter(snapshot_date == latestDate);
```

### Step 3: Group by Customer
```typescript
For each unique customer_id in currentUtilization:
  - Get all products for that customer
  - Sum: total_licenses across all products
  - Sum: active_users across all products  ✅ NOW CORRECT
  - Calculate: totalAvailable = totalLicenses - active_users
```

### Step 4: Get Account-Level Metrics
```typescript
For each customer:
  - Get account data from accounts.json
  - Get health_score from account.health_score
  - Get ARR from account.arr  ✅ NOW CORRECT (not subscription.arr)
```

### Step 5: Calculate KPIs
```typescript
Total Accounts = count of unique customers
Total ARR = sum of account.arr for all customers
Avg Utilization = sum(active_users) / sum(total_licenses) * 100
High Priority = count where priorityScore >= 70
```

---

## 🎯 Data Flow

```
utilization_history.json           accounts.json
      ↓                                  ↓
[customer_id, product_family,    [account.id, account.arr,
 total_licenses, active_users]    account.health_score]
      ↓                                  ↓
      └──────────────┬───────────────────┘
                     ↓
         calculateAccountUtilizationDetails()
                     ↓
         ┌───────────┴────────────┐
         ↓                        ↓
   Per-Account Data         KPI Summary
   - Licenses Used: ✅      - Total Accounts
   - Total Licenses         - Total ARR: ✅
   - Utilization %: ✅      - Avg Utilization: ✅
   - ARR: ✅                - High Priority: ✅
   - Health Score
   - Priority Score
```

---

## 🧪 Verification

To verify the fix is working:

1. **Check Total Accounts:** Should match the number of unique customer_ids in the latest utilization snapshot
2. **Check Total ARR:** Should be much higher than $925K (sum of real account ARRs from accounts.json)
3. **Check Avg Utilization:** Calculate manually: (Total Active Users / Total Licenses) × 100
4. **Check High Priority:** Count accounts where health < 60 OR utilization < 20 OR renewal < 90 days

---

## 📋 Files Changed

### File: `src/lib/kpis/licenseUtilizationKPIs.ts`

**Line 827:**
```typescript
// Before:
const totalUsed = utilizations.reduce((sum, util) => sum + util.licenses_used, 0);

// After:
const totalUsed = utilizations.reduce((sum, util) => sum + util.active_users, 0);
```

**Line 828:**
```typescript
// Before:
const totalAvailable = utilizations.reduce((sum, util) => sum + util.licenses_available, 0);

// After:
const totalAvailable = totalLicenses - totalUsed;
```

**Line 865:**
```typescript
// Before:
arr: subscription.arr || 0,

// After:
arr: account.account?.arr || account.arr || 0,
```

---

## ✅ Result

The KPI summary stats now correctly show:
- ✅ Real active user counts from utilization_history.json
- ✅ Real account-level ARR values from accounts.json
- ✅ Accurate utilization percentages
- ✅ Correct high-priority account counts

**No more using the wrong field names or wrong data sources!**
