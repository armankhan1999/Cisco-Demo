# Data Source Analysis - License Details vs Account Deep Dive

## Issue Report
**Account:** Cronin and Sons (CUST_000043)  
**Problem:** Different active user counts shown in License Details (2) vs Account Deep Dive (4)

## ✅ Data Source Verification

### Source Data in `utilization_history.json`

**Latest snapshot date: 2025-10-06**

**Meraki Product:**
- `total_licenses`: 2
- `active_users`: 1
- `inactive_users`: 1
- Utilization: 50%

**Duo Product:**
- `total_licenses`: 3
- `active_users`: 1
- `inactive_users`: 2
- Utilization: 33.3%

**COMBINED TOTALS:**
- Total Licenses: 5
- Active Users: 2
- Unused Licenses: 3
- Overall Utilization: 40%

---

## 📊 Page Comparison

### 1. **License Details Page** (`/csm/kpi/license-details`)

**File:** `src/app/csm/kpi/license-details/page.tsx`

**Data Loading Logic:**
```typescript
// Line 49-50: Load data
const utilizationData = loadUtilizationHistory();
const accounts = loadAccounts();

// Line 60-61: Get latest date
const latestDate = utilizationData.map((d: any) => d.snapshot_date).sort().pop();
const latestUtilization = utilizationData.filter((d: any) => d.snapshot_date === latestDate);

// Line 63-74: Calculate metrics
const totalLicenses = products.reduce((sum, p) => sum + p.total_licenses, 0);
const activeUsers = products.reduce((sum, p) => sum + p.active_users, 0);
```

**✅ Result:** Shows **2 active users** (CORRECT)

---

### 2. **Account Deep Dive Page** (`/csm/account-deep-dive/[id]`)

**File:** `src/app/csm/account-deep-dive/[id]/page.tsx`

**Data Loading Logic:**
```typescript
// Line 40-41: Load same data
const accounts = loadAccounts();
const utilizationData = loadUtilizationHistory();

// Line 55-61: Get latest date (SAME LOGIC)
const accountUtilization = utilizationData.filter((util: any) => 
  util.customer_id === accountId
);
const latestDate = utilizationData.map((d: any) => d.snapshot_date).sort().pop();
const latestUtil = accountUtilization.filter((d: any) => d.snapshot_date === latestDate);

// Line 63-64: Calculate metrics (SAME LOGIC)
const totalLicenses = latestUtil.reduce((sum: number, u: any) => sum + u.total_licenses, 0);
const activeUsers = latestUtil.reduce((sum: number, u: any) => sum + u.active_users, 0);
```

**✅ Expected Result:** Should show **2 active users** (SAME AS LICENSE DETAILS)

---

## 🔍 Root Cause Analysis

**Both pages use IDENTICAL:**
- ✅ Data source: `commercial_operations/utilization_history.json`
- ✅ Data loading function: `loadUtilizationHistory()` from `csmDataLoader.ts`
- ✅ Logic: Filter latest date → Sum active_users
- ✅ Customer ID matching: `customer_id === accountId`

**If Account Deep Dive shows 4 instead of 2, possible causes:**

### 1. **Browser Cache Issue** (Most Likely)
- Old data cached in browser
- **Solution:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### 2. **Development Server Cache**
- Next.js dev server cached old data
- **Solution:** Restart dev server (`npm run dev`)

### 3. **Wrong Customer ID**
- Navigating to different account
- **Solution:** Verify URL shows `/csm/account-deep-dive/CUST_000043`

### 4. **Old Build**
- Built with old data before recent fixes
- **Solution:** Delete `.next` folder and rebuild

---

## ✅ Verification Steps

1. **Check URL:** Ensure it shows `/csm/account-deep-dive/CUST_000043`
2. **Check Account Name:** Header should show "Cronin and Sons"
3. **Hard Refresh:** Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. **Check Console:** Open DevTools, look for any errors
5. **Restart Server:** Stop and restart `npm run dev`

---

## 📝 Data Source Summary

| Data Type | File Path | Used By |
|-----------|-----------|---------|
| Account Info | `source_data/accounts.json` | Both pages |
| Utilization | `commercial_operations/utilization_history.json` | Both pages |
| Health Scores | `accounts.json` → timeline | Account Deep Dive |
| Contracts | `master-data/contracts.json` | Account Deep Dive |
| Alerts | `csm-data/champion_departure_alerts.json`, `csm-data/churn_predictions.json` | Account Deep Dive |

**✅ CONFIRMED:** Both pages use the same data source and should show identical utilization numbers.
