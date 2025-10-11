# Critical Actions Update - Live Data Implementation

## ✅ What Changed

### **BEFORE** (Static)
```
🚨 Critical Actions Required

⚕️ 7 accounts in critical health (immediate intervention)
📅 16 accounts with QBRs overdue >30 days
⚠️ 4 renewals at risk in next 90 days ($0.2M ARR)
```
❌ **Fixed numbers that don't change**
❌ **Not based on actual data criticality**
❌ **No prioritization or context**

### **AFTER** (Dynamic)
```
🚨 Critical Actions Required

🚨 5 accounts in CRITICAL health (<45) - $1.8M ARR at risk
💎 3 high-value accounts (>$500K) below health threshold - $2.1M ARR
📅 12 accounts with QBRs overdue >90 days - $4.2M ARR
⚠️ 6 renewals at risk in next 90 days - $0.8M ARR
📉 9 accounts with declining health trend (30-day) - investigate
```
✅ **Real-time calculations from source_data**
✅ **Sorted by severity (critical → high → medium)**
✅ **Shows ARR impact for each action**
✅ **Only displays if count > 0**
✅ **Prioritized by urgency**

---

## 🎯 New Action Types

### 1. **🚨 CRITICAL Health Accounts** (New!)
- **Trigger**: Health Score < 45
- **Severity**: CRITICAL (Red)
- **Shows**: Count + Total ARR at risk
- **Example**: `5 accounts in CRITICAL health (<45) - $1.8M ARR at risk`

### 2. **💎 High-Value At-Risk** (New!)
- **Trigger**: ARR > $500K AND Health < 70
- **Severity**: HIGH (Orange)
- **Shows**: Count + Total ARR
- **Example**: `3 high-value accounts (>$500K) below threshold - $2.1M ARR`

### 3. **📅 Overdue QBRs** (Enhanced!)
- **Trigger**: No QBR in 90+ days (was 30 days)
- **Severity**: HIGH (Orange)
- **Shows**: Count + Total ARR
- **Example**: `12 accounts with QBRs overdue >90 days - $4.2M ARR`

### 4. **⚠️ At-Risk Renewals** (Enhanced!)
- **Trigger**: Renewal in next 90 days with low confidence
- **Severity**: HIGH (Orange)
- **Shows**: Count + Total ARR
- **Example**: `6 renewals at risk in next 90 days - $0.8M ARR`

### 5. **⚕️ At-Risk Health** (New!)
- **Trigger**: Health Score 45-59
- **Severity**: MEDIUM (Yellow)
- **Shows**: Count + guidance
- **Example**: `12 accounts at-risk health (45-59) - proactive engagement`

### 6. **📉 Declining Health Trends** (New!)
- **Trigger**: 30-day health trend is down
- **Severity**: MEDIUM (Yellow)
- **Shows**: Count + action needed
- **Example**: `9 accounts declining health (30d) - investigate root cause`

---

## 🔍 Smart Features

### **Severity-Based Prioritization**
```typescript
// Actions sorted by urgency
severityOrder = { critical: 0, high: 1, medium: 2 }

// Show top 5 most critical
actions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
       .slice(0, 5)
```

### **Dynamic Visibility**
```typescript
// Only show actions with count > 0
if (criticalHealthAccounts.length > 0) {
  actions.push({ ... })
}

// If no issues, show positive message
if (actions.length === 0) {
  actions.push({
    icon: '✅',
    message: 'No critical actions required - portfolio health is strong'
  })
}
```

### **ARR Impact Calculation**
```typescript
// Calculate total ARR at risk for each action
const criticalHealthARR = criticalHealthAccounts.reduce(
  (sum, a) => sum + a.account.arr, 
  0
);

// Display in millions
`$${(criticalHealthARR / 1000000).toFixed(1)}M ARR`
```

---

## 📊 Data Flow

```
source_data/accounts.json
    ↓
getActiveAccounts()
    ↓
Filter by criteria:
- health_score < 45 (critical)
- arr > $500K && health < 70 (high-value)
- health_score_trend === 'down' (declining)
    ↓
Calculate ARR impact
    ↓
Sort by severity
    ↓
Display top 5
```

---

## 🎨 Visual Indicators

### **Severity Colors**

| Severity | Background | Border | Text | Icon |
|----------|-----------|--------|------|------|
| **CRITICAL** | Red-50 | Red-300 | Red-800 | 🚨 |
| **HIGH** | Orange-50 | Orange-300 | Orange-800 | 💎📅⚠️ |
| **MEDIUM** | Yellow-50 | Yellow-300 | Yellow-800 | ⚕️📉 |
| **Success** | Green-50 | Green-300 | Green-800 | ✅ |

---

## 📁 Files Modified

✅ **`src/components/CSM/CSMPortfolioDashboard.tsx`**
- Replaced static action list with dynamic calculations
- Added 7 different action types
- Implemented severity-based sorting
- Added ARR impact calculations
- Added console logging for debugging

✅ **`src/components/CSM/CriticalActions.tsx`**
- Already supported severity levels (no changes needed)

---

## 🚀 Real-Time Behavior

### **Scenario 1: Data Changes**
```
1. Modify accounts.json (change health scores)
2. Refresh dashboard
3. Critical Actions updates automatically
4. New counts and ARR amounts
```

### **Scenario 2: QBR Completed**
```
1. Add QBR record to qbr_tracking.json
2. Refresh dashboard
3. "Overdue QBRs" count decreases
4. Account removed from action list
```

### **Scenario 3: Account Improves**
```
1. Health score changes from 42 → 68
2. Refresh dashboard
3. Removed from "CRITICAL health" action
4. May appear in "At-Risk health" action
5. ARR impact recalculated
```

---

## 🔊 Console Output

When dashboard loads:
```
🚨 === DYNAMIC CRITICAL ACTIONS ===
Total Actions Identified: 6
Showing Top 5 Most Critical
1. [CRITICAL] 5 accounts in CRITICAL health (<45) - $1.8M ARR at risk
2. [HIGH] 3 high-value accounts (>$500K) below health threshold - $2.1M ARR
3. [HIGH] 12 accounts with QBRs overdue >90 days - $4.2M ARR
4. [HIGH] 6 renewals at risk in next 90 days - $0.8M ARR
5. [MEDIUM] 9 accounts with declining health trend (30-day)
==================================================
```

---

## ✨ Benefits

### **For CSMs**
- ✅ Instant visibility into critical issues
- ✅ Clear priority order (what to tackle first)
- ✅ Quantified impact (ARR at risk)
- ✅ No manual analysis needed

### **For Leadership**
- ✅ Real-time portfolio risk assessment
- ✅ Data-driven intervention planning
- ✅ Resource allocation guidance
- ✅ Trend monitoring over time

### **For Operations**
- ✅ Automated alerting system
- ✅ Consistent criteria across team
- ✅ Audit trail via console logs
- ✅ Integration-ready data

---

## 🧪 Testing

### **Verify Dynamic Calculation**
1. Load `/csm/portfolio` dashboard
2. Check "Critical Actions Required" section
3. Open browser console (F12)
4. Look for `🚨 === DYNAMIC CRITICAL ACTIONS ===`
5. Verify counts match console output

### **Test Data Sensitivity**
1. Note current critical action counts
2. Modify `accounts.json` (change health scores)
3. Reload dashboard
4. Verify counts updated
5. Check ARR amounts changed

---

## 📚 Documentation

- **`CRITICAL_ACTIONS_DYNAMIC.md`** - Complete system guide
- **`CRITICAL_ACTIONS_UPDATE.md`** - This summary document

---

## Summary

**Critical Actions is now 100% dynamic:**

| Feature | Before | After |
|---------|--------|-------|
| **Data Source** | ❌ Static | ✅ Live from source_data |
| **Action Types** | 3 fixed | 6+ dynamic |
| **Prioritization** | ❌ None | ✅ By severity |
| **ARR Impact** | ❌ Partial | ✅ All actions |
| **Visibility** | Always shows | Only if count > 0 |
| **Updates** | ❌ Never | ✅ On every load |

**Result**: CSMs see real-time, prioritized actions based on actual data! 🎯

