# Account Detail Page - Data Sources Reference

## 📊 Data Sources Used for Account Detail Page (`/csm/accounts/[customerId]`)

### ✅ All Data Now From Real Files

| Section | Data Source | Field/Calculation |
|---------|-------------|-------------------|
| **Account Info** | `accounts.json` | name, tier, industry, arr, health_score |
| **Total Licenses** | `utilization_history.json` | Sum of `total_licenses` |
| **Active Users** | `utilization_history.json` | Sum of `active_users` |
| **Utilization %** | `utilization_history.json` | (active_users / total_licenses) × 100 |
| **Product Count** | `utilization_history.json` | Unique `product_family` count |
| **Contracts** | `master-data/contracts.json` | All contracts for customer |
| **Stakeholders** | `master-data/stakeholders.json` | All stakeholders for customer |
| **CSM Info** | `master-data/csms.json` | CSM assigned to account |
| **Users** | `master-data/users.json` | All users for customer |

---

## 🚨 Comprehensive Churn Analysis Section

### 1. **Churn Alerts** ✅ Real Data
**Source:** Generated from multiple real data sources
- `churn_predictions.json` → High churn risk alert (if probability > 0.7)
- `champion_departure_alerts.json` → Champion departure alerts
- `revenue_movements.json` → Historical churn alerts

**Logic:**
```typescript
if (churnPrediction.churn_probability > 0.7) {
  alert: 'High Churn Risk' with probability percentage
}
if (championDepartures.length > 0) {
  alert: 'Champion Departure' with count
}
if (historicalChurnEvents.length > 0) {
  alert: 'Historical Churn' with count
}
```

---

### 2. **Champion Departures** ✅ Real Data
**Source:** `csm-data/champion_departure_alerts.json`

**Fields Displayed:**
- `champion_name` - Name of departed champion
- `champion_role` - Their role
- `daysSinceDeparture` - Calculated from `departure_detected_date`
- `impact_score` - Impact score out of 100
- `new_company` - Where they went
- `new_role` - Their new position

**Filter:**
```typescript
championDepartureAlerts.filter(alert => 
  alert.account_id === customerId
)
```

---

### 3. **Historical Churn Events** ✅ Real Data
**Source:** `commercial_operations/revenue_movements.json`

**Filter:**
```typescript
revenueMovements.filter(movement => 
  movement.customer_id === customerId && 
  movement.movement_type === 'churn'
)
```

**Fields Calculated:**
- `churnDate` - From `effective_date`
- `arrLost` - Absolute value of `arr_change`
- `reason` - From `reason_code`
- `preventable` - True if reason is: not_using, competitor, product_fit, support_issues, feature_gaps

---

### 4. **Churn Reasons Analysis** ✅ Real Data
**Source:** Aggregated from `revenue_movements.json`

**Calculation:**
```typescript
// Groups historical churn events by reason_code
// Shows:
- count: Number of times this reason occurred
- arr: Total ARR lost for this reason
- preventable: Whether this reason is preventable
```

---

### 5. **Prevention Strategies** ✅ Real Data
**Source:** Generated from `churn_predictions.json` → `risk_factors`

**Logic:**
```typescript
if (risk_factors.includes('low_usage')) {
  → 'Increase product adoption through training'
}
if (risk_factors.includes('support_issues')) {
  → 'Improve support response time'
}
if (risk_factors.includes('competitor_mentions')) {
  → 'Conduct competitive analysis'
}
if (risk_factors.includes('contract_renewal_risk')) {
  → 'Schedule early renewal discussions'
}
if (championDepartures.length > 0) {
  → 'Develop relationships with new stakeholders'
}
```

---

### 6. **Risk Factors** ✅ Real Data
**Source:** `churn_predictions.json` → `risk_factors` array

**Displays:**
- All risk factors from churn prediction model
- Examples: low_usage, support_issues, competitor_mentions, contract_renewal_risk

---

### 7. **Competitor Threats** ✅ Real Data
**Source:** `accounts.json` → `timeline` → `expansion_signals` and `engagement_events`

**Extraction Logic:**
```typescript
// Searches timeline for competitor mentions:
1. expansion_signals containing "competitor"
2. engagement_events.notes containing "competitor"

// Calculates threat level:
- High: 2+ mentions in last 3 months
- Medium: 1 mention in last 3 months
- Low: Mentions older than 3 months
```

**Fields:**
- `competitor` - "Competitive Activity Detected"
- `threat_level` - high/medium/low (based on frequency)
- `last_mention` - Date of most recent mention
- `mention_count` - Total mentions in timeline
- `recent_mentions` - Mentions in last 3 months

---

### 8. **Churn Trend** ✅ Real Data
**Source:** Calculated from `revenue_movements.json`

**Logic:**
```typescript
// Recent = last 6 months
if (recentChurnEvents.length === 0) → 'stable'
if (recentChurnEvents.length >= 2) → 'increasing'
if (recentChurnEvents.length === 1) → 'moderate'
```

---

### 9. **Intervention Window** ✅ Real Data
**Source:** `churn_predictions.json` → `intervention_window_days`

**Display:**
- Shows number of days to implement prevention strategies
- Only shown if intervention window > 0

---

## 🔄 Data Consistency

### All Metrics Match Across Pages:
```
Accounts List Card (Outside):
├─ Total Licenses: From utilization_history.json
├─ Active Users: From utilization_history.json
└─ Utilization %: Calculated from above

Account Detail (Inside):
├─ Total Licenses: SAME SOURCE (utilization_history.json)
├─ Active Users: SAME SOURCE (utilization_history.json)
└─ Utilization %: SAME CALCULATION

Churn Analysis (Inside):
├─ All data from real JSON files
├─ No hardcoded values
└─ Dynamic based on account's actual data
```

---

## 📁 File Imports Summary

```typescript
// Utilization & Accounts
const accounts = loadAccounts();
const subscriptions = loadSubscriptions();
const utilizationHistory = loadUtilizationHistory();

// Master Data
const contracts = require('master-data/contracts.json');
const licenses = require('master-data/licenses.json');
const stakeholders = require('master-data/stakeholders.json');
const csms = require('master-data/csms.json');
const users = require('master-data/users.json');
const customers = require('master-data/customers.json');

// Churn & Risk Data
const churnPredictions = require('csm-data/churn_predictions.json');
const championDepartureAlerts = require('csm-data/champion_departure_alerts.json');
const revenueMovements = require('commercial_operations/revenue_movements.json');
```

---

## ✅ Verification Checklist

- ✅ Total Licenses from `utilization_history.json`
- ✅ Active Users from `utilization_history.json`
- ✅ Utilization % calculated correctly
- ✅ Champion Departures from `champion_departure_alerts.json`
- ✅ Historical Churn from `revenue_movements.json`
- ✅ Churn Predictions from `churn_predictions.json`
- ✅ Competitor Threats from `accounts.json` timeline
- ✅ Prevention Strategies from risk_factors
- ✅ Churn Alerts dynamically generated
- ✅ All data consistent with other pages

---

## 🎯 Result

**Every metric in the Account Detail page now uses real data from JSON files.**
- No hardcoded values
- No mock data (except when data doesn't exist in files)
- All calculations based on actual data
- Consistent with all other CSM pages
