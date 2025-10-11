# Dynamic Critical Actions System

## Overview
The **Critical Actions Required** section now shows **REAL-TIME, DYNAMIC alerts** based on actual data criticality from your `source_data` folder. No static numbers - everything updates based on current portfolio status.

---

## How It Works

### 1. **Data Analysis** (Real-Time)
The system continuously analyzes your portfolio and identifies:
- Critical health accounts
- High-value at-risk accounts
- Overdue QBRs
- At-risk renewals
- Declining health trends
- Low utilization patterns

### 2. **Severity Classification**
Actions are categorized by urgency:

| Severity | Color | Meaning | Action Required |
|----------|-------|---------|-----------------|
| 🔴 **CRITICAL** | Red | Immediate intervention needed | Act within 24 hours |
| 🟠 **HIGH** | Orange | Action needed soon | Act within 1 week |
| 🟡 **MEDIUM** | Yellow | Monitor closely | Review regularly |

### 3. **Prioritization**
- Shows **top 5 most critical** actions
- Sorted by severity (critical → high → medium)
- Only displays actions with count > 0
- Hides irrelevant alerts

---

## Critical Action Types

### 🚨 **1. CRITICAL HEALTH ACCOUNTS** (CRITICAL)
**Trigger**: Health Score < 45

**What It Shows**:
```
🚨 7 accounts in CRITICAL health (<45) - $2.3M ARR at risk
```

**Why It Matters**:
- Immediate churn risk
- Requires urgent intervention
- High revenue impact

**Action Required**:
1. Review each account immediately
2. Schedule executive engagement
3. Create recovery plan
4. Assign dedicated resources

---

### 💎 **2. HIGH-VALUE AT-RISK** (HIGH)
**Trigger**: ARR > $500K AND Health Score < 70

**What It Shows**:
```
💎 5 high-value accounts (>$500K) below health threshold - $4.2M ARR
```

**Why It Matters**:
- Largest revenue impact
- Strategic accounts at risk
- Loss would significantly hurt metrics

**Action Required**:
1. Escalate to senior leadership
2. Conduct deep-dive analysis
3. Deploy executive sponsor
4. Create tailored success plan

---

### 📅 **3. OVERDUE QBRs** (HIGH)
**Trigger**: No QBR in last 90 days

**What It Shows**:
```
📅 16 accounts with QBRs overdue >90 days - $5.8M ARR
```

**Why It Matters**:
- Lack of engagement visibility
- Relationship deterioration risk
- Value realization not tracked

**Action Required**:
1. Schedule QBRs immediately
2. Prepare value documentation
3. Review account status
4. Update success plans

---

### ⚠️ **4. AT-RISK RENEWALS** (HIGH)
**Trigger**: Renewal in next 90 days with low confidence

**What It Shows**:
```
⚠️ 4 renewals at risk in next 90 days - $0.2M ARR
```

**Why It Matters**:
- Immediate revenue impact
- Limited time to course-correct
- Churn prevention window closing

**Action Required**:
1. Assess renewal likelihood
2. Address blockers immediately
3. Negotiate terms if needed
4. Engage decision-makers

---

### ⚕️ **5. AT-RISK HEALTH ACCOUNTS** (MEDIUM)
**Trigger**: Health Score 45-59

**What It Shows**:
```
⚕️ 12 accounts at-risk health (45-59) - proactive engagement needed
```

**Why It Matters**:
- Early warning signal
- Preventable churn risk
- Easier to recover than critical

**Action Required**:
1. Increase touchpoint frequency
2. Review usage patterns
3. Identify engagement gaps
4. Deploy proactive playbook

---

### 📉 **6. DECLINING HEALTH TRENDS** (MEDIUM)
**Trigger**: 30-day health score trend is down

**What It Shows**:
```
📉 8 accounts with declining health trend (30-day) - investigate root cause
```

**Why It Matters**:
- Early indicator of problems
- Momentum in wrong direction
- Intervention can reverse trend

**Action Required**:
1. Analyze what changed
2. Review recent interactions
3. Check product usage
4. Identify root causes

---

## Real Example Output

### Scenario: Portfolio with Multiple Issues
```
🚨 Critical Actions Required

🚨 5 accounts in CRITICAL health (<45) - $1.8M ARR at risk
   [CRITICAL] Act immediately

💎 3 high-value accounts (>$500K) below health threshold - $2.1M ARR
   [HIGH] Action needed this week

📅 12 accounts with QBRs overdue >90 days - $4.2M ARR
   [HIGH] Schedule QBRs now

⚠️ 6 renewals at risk in next 90 days - $0.8M ARR
   [HIGH] Address renewal blockers

📉 9 accounts with declining health trend (30-day) - investigate root cause
   [MEDIUM] Monitor and engage
```

### Scenario: Healthy Portfolio
```
🚨 Critical Actions Required

✅ No critical actions required - portfolio health is strong

Keep up the excellent work! Continue monitoring key metrics.
```

---

## Calculation Logic

### Critical Health
```typescript
// Health Score < 45 = Critical
const criticalHealthAccounts = accounts.filter(
  a => a.account.health_score < 45
);

// Calculate total ARR at risk
const criticalHealthARR = criticalHealthAccounts.reduce(
  (sum, a) => sum + a.account.arr, 
  0
);

// Only show if count > 0
if (criticalHealthAccounts.length > 0) {
  actions.push({
    icon: '🚨',
    message: `${criticalHealthAccounts.length} accounts in CRITICAL health (<45) - $${(criticalHealthARR / 1000000).toFixed(1)}M ARR at risk`,
    severity: 'critical',
    count: criticalHealthAccounts.length,
    amount: `$${(criticalHealthARR / 1000000).toFixed(1)}M`
  });
}
```

### Overdue QBRs
```typescript
const now = Date.now();
const msPerDay = 24 * 60 * 60 * 1000;
const overdueQBRAccounts = [];

accounts.forEach(account => {
  const accountQBRs = qbrTracking.filter(
    q => q.account_id === account.account.id
  );
  
  if (accountQBRs.length === 0) {
    // Never had QBR
    overdueQBRAccounts.push(account);
  } else {
    const lastQBRDate = Math.max(...accountQBRs.map(
      q => new Date(q.qbr_date).getTime()
    ));
    const daysSinceQBR = Math.floor((now - lastQBRDate) / msPerDay);
    
    if (daysSinceQBR > 90) {
      // QBR overdue by more than 90 days
      overdueQBRAccounts.push(account);
    }
  }
});
```

### At-Risk Renewals
```typescript
// Get renewals in next 90 days (first 3 periods)
const atRiskRenewals = pipeline
  .slice(0, 3)
  .reduce((sum, p) => sum + p.atRisk, 0);

// Calculate total ARR at risk
const atRiskRenewalARR = pipeline
  .slice(0, 3)
  .reduce((sum, p) => {
    const pctAtRisk = p.count > 0 ? p.atRisk / p.count : 0;
    return sum + (p.arr * pctAtRisk);
  }, 0);
```

---

## Data Sources

All calculations use **real data** from:

| Action Type | Data Source | Fields Used |
|------------|-------------|-------------|
| **Critical Health** | `accounts.json` | `health_score`, `arr` |
| **High-Value At-Risk** | `accounts.json` | `arr`, `health_score` |
| **Overdue QBRs** | `qbr_tracking.json` | `account_id`, `qbr_date` |
| **At-Risk Renewals** | `subscriptions.json` | `renewal_date`, `renewal_confidence` |
| **Declining Health** | `accounts.json` | `health_score_trend` |

---

## Console Logging

When dashboard loads, you'll see:
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

## Benefits

### ✅ **Real-Time Awareness**
- Instant visibility into critical issues
- No manual analysis required
- Always up-to-date with current data

### 🎯 **Prioritized Actions**
- Most critical issues shown first
- Clear severity indicators
- Actionable, specific guidance

### 📊 **Data-Driven**
- Based on actual portfolio data
- Quantified impact (ARR at risk)
- Measurable outcomes

### 🚀 **Proactive Management**
- Early warning system
- Prevents small issues from becoming critical
- Enables timely intervention

---

## Customization

### Add New Action Types
```typescript
// Example: Add "No Recent Engagement" alert
const noRecentEngagement = accounts.filter(a => {
  // Custom logic to detect lack of engagement
  return daysSinceLastTouch > 60;
});

if (noRecentEngagement.length > 0) {
  allActions.push({
    icon: '📞',
    message: `${noRecentEngagement.length} accounts with no engagement in 60+ days`,
    severity: 'medium',
    count: noRecentEngagement.length
  });
}
```

### Adjust Thresholds
```typescript
// Change critical health threshold
const criticalHealthAccounts = accounts.filter(
  a => a.account.health_score < 40  // Changed from 45 to 40
);

// Change QBR overdue threshold
if (daysSinceQBR > 120) {  // Changed from 90 to 120
  overdueQBRAccounts.push(account);
}
```

---

## Testing

### Verify Dynamic Behavior
1. ✅ Load dashboard - actions should appear
2. ✅ Check console logs - see detailed breakdown
3. ✅ Compare to source data - counts should match
4. ✅ Reload page - numbers should recalculate
5. ✅ Modify data file - actions should update

### Expected Results
- **If portfolio is healthy**: Few or no critical actions
- **If issues exist**: Multiple prioritized actions
- **If no issues**: Positive confirmation message
- **ARR amounts**: Should match sum of affected accounts

---

## Summary

**The Critical Actions section is now:**
- ✅ **100% Dynamic** - No static numbers
- ✅ **Real-Time** - Updates with data changes
- ✅ **Prioritized** - Shows top 5 by severity
- ✅ **Actionable** - Clear guidance on what to do
- ✅ **Quantified** - Shows ARR impact
- ✅ **Smart** - Only shows relevant alerts

**Result**: CSMs can immediately see what needs attention and take action! 🎯

