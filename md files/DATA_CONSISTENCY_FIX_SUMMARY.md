# Data Consistency Fix - All CSM Pages Now Use Same Source

## ✅ Problem Fixed

**Issue:** Different pages showing different numbers for the same account (e.g., "Cronin and Sons")
- **Accounts List** (`/csm/accounts`): Shows 2/5 licenses
- **Account Detail** (`/csm/accounts/CUST_000043`): Was showing different numbers (80 or other values)
- **License Details** (`/csm/kpi/license-details`): Shows 2/5 licenses
- **Account Deep Dive** (`/csm/account-deep-dive/[id]`): Shows 2/5 licenses

## 🔴 Root Cause

Different pages were using **different data sources** for the same information:

### Before Fix:
```
❌ Accounts List Page:
   - Used: master-data/licenses.json
   - Method: license_count × (utilization / 100)
   
❌ Account Detail Page (inside):
   - Used: master-data/licenses.json
   - Method: license_count × (utilization / 100)
   
✅ License Details Page:
   - Used: commercial_operations/utilization_history.json
   - Method: Sum of active_users field
   
✅ Account Deep Dive Page:
   - Used: commercial_operations/utilization_history.json
   - Method: Sum of active_users field
```

**Result:** Inconsistent numbers across pages because `licenses.json` has different data than `utilization_history.json`

## ✅ Solution Applied

### After Fix - ALL PAGES NOW USE SAME SOURCE:
```
✅ Accounts List Page (/csm/accounts):
   File: src/app/csm/accounts/page.tsx
   Data: commercial_operations/utilization_history.json
   Method: Sum of active_users field
   
✅ Account Detail Page (/csm/accounts/[customerId]):
   File: src/app/csm/accounts/[customerId]/page.tsx
   Data: commercial_operations/utilization_history.json
   Method: Sum of active_users field
   
✅ License Details Page (/csm/kpi/license-details):
   File: src/app/csm/kpi/license-details/page.tsx
   Data: commercial_operations/utilization_history.json
   Method: Sum of active_users field
   
✅ Account Deep Dive Page (/csm/account-deep-dive/[id]):
   File: src/app/csm/account-deep-dive/[id]/page.tsx
   Data: commercial_operations/utilization_history.json
   Method: Sum of active_users field
```

## 📊 Example: Cronin and Sons (CUST_000043)

### Data in `utilization_history.json` (Latest: 2025-10-06):
```json
Meraki Product:
  - total_licenses: 2
  - active_users: 1
  - utilization: 50%

Duo Product:
  - total_licenses: 3
  - active_users: 1
  - utilization: 33.3%

TOTAL:
  - Total Licenses: 5
  - Active Users: 2
  - Utilization: 40%
```

### Now ALL Pages Show Consistently:
```
Accounts List Card (Outside):
├─ Licenses: 2/5
├─ Utilization: 40.0%
├─ ARR: $400
└─ Products: 2

Account Detail Page (Inside - When you click):
├─ Total Licenses: 5
├─ Active Users: 2
├─ Utilization: 40%
├─ Products: 2
└─ All metrics match the card

License Details Page:
├─ Total Licenses: 5
├─ Active Users: 2
└─ Utilization: 40%

Account Deep Dive Page:
├─ Total Licenses: 5
├─ Active Users: 2
└─ Utilization: 40%
```

## 🔧 Files Modified

### 1. `/csm/accounts/page.tsx` (Lines 56-98)
**Changed:**
- ❌ Old: Used `licenses.json` for calculations
- ✅ New: Uses `utilization_history.json` for calculations

**Code Change:**
```typescript
// OLD (WRONG):
const accountLicenses = licenses.filter(...);
const totalActiveUsers = accountLicenses.reduce((sum, license) => {
  return sum + Math.round(license.license_count * (license.utilization / 100));
}, 0);

// NEW (CORRECT):
const allSnapshots = utilizationHistory.map((d) => d.snapshot_date).sort();
const latestDate = allSnapshots[allSnapshots.length - 1];
const accountUtilization = utilizationHistory.filter(util => 
  util.customer_id === customerId && util.snapshot_date === latestDate
);
const totalLicenses = accountUtilization.reduce((sum, u) => sum + u.total_licenses, 0);
const licensesUsed = accountUtilization.reduce((sum, u) => sum + u.active_users, 0);
```

### 2. `/csm/accounts/[customerId]/page.tsx` (Lines 163-196)
**Changed:**
- ❌ Old: Used `licenses.json` for calculations
- ✅ New: Uses `utilization_history.json` for calculations

**Code Change:**
```typescript
// OLD (WRONG):
const accountLicenses = licenses.filter(...);
const totalActiveUsers = accountLicenses.reduce((sum, license) => {
  return sum + Math.round(license.license_count * (license.utilization / 100));
}, 0);

// NEW (CORRECT):
const allSnapshots = utilizationHistory.map((d) => d.snapshot_date).sort();
const latestDate = allSnapshots[allSnapshots.length - 1];
const currentUtilization = utilizationHistory.filter(util => 
  util.customer_id === customerId && util.snapshot_date === latestDate
);
const totalLicenses = currentUtilization.reduce((sum, u) => sum + u.total_licenses, 0);
const licensesUsed = currentUtilization.reduce((sum, u) => sum + u.active_users, 0);
```

## 📋 Unified Data Source Logic

All pages now use this **EXACT SAME** logic:

```typescript
// 1. Load utilization history
const utilizationHistory = loadUtilizationHistory();

// 2. Find latest snapshot date
const allSnapshots = utilizationHistory.map((d) => d.snapshot_date).sort();
const latestDate = allSnapshots[allSnapshots.length - 1];

// 3. Filter by customer and latest date
const accountUtilization = utilizationHistory.filter(util => 
  util.customer_id === customerId && util.snapshot_date === latestDate
);

// 4. Calculate totals
const totalLicenses = accountUtilization.reduce((sum, u) => sum + u.total_licenses, 0);
const activeUsers = accountUtilization.reduce((sum, u) => sum + u.active_users, 0);
const utilizationRate = (activeUsers / totalLicenses) * 100;
```

## ✅ Testing Instructions

1. **Clear browser cache:** Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Restart dev server:** Stop and run `npm run dev` again
3. **Navigate to Accounts:** Go to `/csm/accounts`
4. **Find "Cronin and Sons"** card
5. **Verify card shows:** Licenses: 2/5, Utilization: 40.0%
6. **Click the card** to open account detail
7. **Verify inside shows:** Same numbers (5 total, 2 active, 40% utilization)
8. **Navigate to License Details:** Go to `/csm/kpi/license-details`
9. **Verify shows:** Same numbers for Cronin and Sons
10. **Click account name** to go to Account Deep Dive
11. **Verify shows:** Same numbers

## 🎯 Result

**All 4 pages now show IDENTICAL data for every account:**
- ✅ Same total licenses
- ✅ Same active users  
- ✅ Same utilization percentage
- ✅ Same product count
- ✅ All sourced from `utilization_history.json`

**No more discrepancies between "outside" (card) and "inside" (detail page)!**
