# CSM Dashboard Quick Reference Card

**One-Page Cheat Sheet for Implementation**

---

## 📊 10 PRIMARY KPIs

| # | KPI Name | Target | Primary Data Source | Ready? |
|---|----------|--------|---------------------|--------|
| 1 | **Gross Revenue Retention (GRR)** | ≥95% | subscriptions + revenue_movements | ✅ SQL |
| 2 | **Portfolio Health Score** | ≥75 | accounts.json (`health_score`) | ✅ Direct |
| 3 | **At-Risk ARR** | Min | accounts.json (`health_score<60`) | ✅ Filter |
| 4 | **Renewal Rate** | ≥92% | subscriptions.json (`renewal_status`) | ✅ Agg |
| 5 | **Churn Rate** | ≤5% | revenue_movements (`movement_type=churn`) | ✅ SQL |
| 6 | **Avg Utilization Rate** | ≥75% | licenses.json (`utilization`) | ✅ Direct |
| 7 | **Feature Adoption Rate** | ≥60% | licenses.json (`adoption_stage`) | ⚠️ Custom |
| 8 | **Engagement Score** | ≥70 | qbr_tracking + accounts | ⚠️ Composite |
| 9 | **Time to Value (TTV)** | ≤60d | subscriptions + licenses (dates) | ⚠️ Custom |
| 10 | **QBR Completion Rate** | ≥85% | qbr_tracking.json | ✅ Filter |

**Legend:** ✅ = Ready to use | ⚠️ = Needs custom logic

---

## 📁 DATA FILES

### Core Files (Must Have)
```
✓ accounts.json                        → health_score, arr, tier
✓ subscriptions.json                   → renewal_status, arr
✓ licenses.json                        → utilization, adoption_stage
✓ revenue_movements.json               → movement_type, arr_change
✓ qbr_tracking.json                    → qbr_date, account_id
```

### Enhancement Files (Nice to Have)
```
+ churn_predictions.json               → churn_probability, risk_factors
+ utilization_alerts.json              → anomaly detection
+ champion_departure_alerts.json       → risk signals
+ white_space_analysis.json            → expansion opportunities
```

---

## 🔑 KEY FIELDS REFERENCE

### accounts.json
```json
{
  "account": {
    "id": "CUST_000001",
    "name": "TechCorp Industries",
    "tier": "Enterprise",
    "arr": 1522871,
    "health_score": 78,              // ⭐ PRE-CALCULATED!
    "renewal_risk_score": 62,
    "csm_id": "CSM_001"
  }
}
```

### subscriptions.json
```json
{
  "subscription_id": "SUB_...",
  "customer_id": "CUST_...",
  "arr": 9585,
  "renewal_date": "2025-02-25",
  "renewal_status": "renewed",         // renewed | quoted | at_risk
  "product_family": "Duo"
}
```

### licenses.json
```json
{
  "license_id": "LIC_...",
  "customer_id": "CUST_...",
  "product_family": "Duo",
  "utilization": 95,                   // 0-100 scale
  "adoption_stage": "Mature",          // Initial | Developing | Mature | Optimized
  "implementation_date": "2023-12-05"
}
```

### revenue_movements.json
```json
{
  "movement_id": "MOV_...",
  "customer_id": "CUST_...",
  "movement_type": "expansion",        // expansion | churn | contraction
  "arr_change": 180.0,                 // Positive or negative
  "effective_date": "2024-11-04"
}
```

### qbr_tracking.json
```json
{
  "qbr_id": "QBR_...",
  "account_id": "CUST_...",
  "qbr_date": "2025-06-15",
  "qbr_status": "completed"
}
```

---

## 💻 CODE SNIPPETS

### Load Data
```typescript
import accounts from './source_data/accounts.json';
import subscriptions from './source_data/commercial_operations/subscriptions.json';
import licenses from './source_data/commercial_operations/licenses.json';
import revenue_movements from './source_data/commercial_operations/revenue_movements.json';
import qbr_tracking from './source_data/csm-data/qbr_tracking.json';
```

### Calculate Portfolio Health
```typescript
const portfolioHealth = () => {
  const active = accounts.filter(a => a.account.arr > 0);
  const weighted = active.reduce((sum, a) => 
    sum + (a.account.health_score * a.account.arr), 0);
  const totalARR = active.reduce((sum, a) => sum + a.account.arr, 0);
  return Math.round(weighted / totalARR);
};
```

### Calculate At-Risk ARR
```typescript
const atRiskARR = () => {
  return accounts
    .filter(a => a.account.health_score < 60)
    .reduce((sum, a) => sum + a.account.arr, 0);
};
```

### Calculate Avg Utilization
```typescript
const avgUtilization = () => {
  const avg = licenses.reduce((sum, l) => sum + l.utilization, 0) / licenses.length;
  return Math.round(avg);
};
```

### Calculate Renewal Rate
```typescript
const renewalRate = () => {
  const thisQuarter = subscriptions.filter(s => 
    isInQuarter(s.renewal_date, currentQuarter));
  const renewed = thisQuarter.filter(s => s.renewal_status === 'renewed');
  return (renewed.length / thisQuarter.length) * 100;
};
```

---

## 🎯 HEALTH SCORE BREAKDOWN

```
Portfolio Health Score = Weighted Average

Components:
├─ Usage Health (40%)        ← licenses.json → utilization
├─ Engagement Health (30%)   ← qbr_tracking.json → qbr_date
├─ Support Health (20%)      ← support_tickets → count
└─ Business Outcome (10%)    ← value metrics

Categories:
├─ Thriving (91-100)  ✓
├─ Healthy (76-90)    ✓
├─ Stable (61-75)     ~
├─ At Risk (46-60)    ⚠
└─ Critical (0-45)    🔴
```

---

## 🚨 EXCEPTION REPORTS (Level 3)

### Critical Health Accounts
```typescript
accounts
  .filter(a => a.account.health_score < 45)
  .sort((a, b) => a.account.health_score - b.account.health_score)
  .slice(0, 20);
```

### Overdue QBRs
```typescript
accounts.filter(a => {
  const lastQBR = qbrTracking.find(q => q.account_id === a.account.id);
  return !lastQBR || daysSince(lastQBR.qbr_date) > 120;
});
```

### At-Risk Renewals (Next 90 Days)
```typescript
subscriptions.filter(s => {
  const account = accounts.find(a => a.account.id === s.customer_id);
  return daysUntil(s.renewal_date) <= 90 && account.account.health_score < 70;
});
```

### Usage Anomalies
```typescript
import utilization_alerts from './source_data/commercial_operations/utilization_alerts.json';

utilization_alerts
  .filter(a => a.status === 'open' && a.severity === 'critical')
  .sort((a, b) => b.created_date - a.created_date);
```

---

## 📋 DASHBOARD LEVELS

### Level 1: Strategic (10 KPI Tiles)
- Display: Large numbers, trend indicators, target badges
- Interaction: Click to drill down to Level 2
- Refresh: Daily (2 AM)

### Level 2: Tactical (4 Views)
1. **Health Score Decomposition** - Component breakdown
2. **Adoption & Utilization Trends** - Product-level analysis
3. **Churn Risk Analysis** - Segmented by tier
4. **Customer Journey Stages** - Lifecycle tracking

### Level 3: Operational (4 Reports)
1. **Critical Health Accounts** - Immediate action required
2. **Overdue Success Activities** - QBRs, success plans
3. **At-Risk Renewals** - Next 90 days
4. **Usage Anomaly Alerts** - Real-time monitoring

---

## 🎨 UI COMPONENTS

### KPI Tile
```tsx
<KPITile 
  title="GRR"
  value="96.2%"
  target={95}
  trend="up"
  status="success"
  onClick={() => navigate('/level2/grr-analysis')}
/>
```

### Health Distribution
```tsx
<HealthDistribution 
  accounts={accounts}
  showARR={true}
  onClick={(category) => navigate(`/level3/accounts/${category}`)}
/>
```

### Exception Table
```tsx
<ExceptionTable
  title="Critical Health Accounts"
  data={criticalAccounts}
  columns={['Account', 'Health', 'ARR', 'Risk Factor', 'Days to Renewal']}
  actions={['Launch Save Campaign', 'Schedule Review']}
/>
```

---

## 🔄 IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
✅ Load JSON data  
✅ Calculate simple KPIs (2, 3, 6, 10)  
✅ Build Level 1 dashboard skeleton

### Phase 2: Core Metrics (Week 3-4)
✅ Implement GRR, Churn Rate, Renewal Rate (SQL)  
✅ Add trend indicators  
✅ Connect drill-down navigation

### Phase 3: Advanced KPIs (Week 5-6)
⚠️ Feature Adoption (custom logic)  
⚠️ Engagement Score (composite)  
⚠️ Time to Value (date calculations)

### Phase 4: Operational Views (Week 7-8)
🚨 Build all 4 Level 3 exception reports  
🚨 Add action buttons and workflows  
🚨 Implement alerting system

---

## 🧪 TESTING CHECKLIST

### Data Validation
- [ ] All JSON files load without errors
- [ ] No null values in critical fields
- [ ] Date formats are consistent
- [ ] Numbers are in expected ranges

### KPI Accuracy
- [ ] Portfolio Health = 75-80 (expected range)
- [ ] GRR = 95-97% (healthy SaaS)
- [ ] Churn Rate = 3-5% (target)
- [ ] Utilization = 70-85% (typical)

### UI/UX
- [ ] All 10 KPI tiles render correctly
- [ ] Drill-down navigation works
- [ ] Exception reports load < 2 seconds
- [ ] Mobile responsive

### Business Logic
- [ ] At-risk accounts correctly identified
- [ ] Health categories match definitions
- [ ] Renewal pipeline accurate
- [ ] Alerts prioritize correctly

---

## 🔗 RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| `main _CSMDashboards file to referes.md` | Complete design specification |
| `CSM_KPI_MAPPING_ANALYSIS.md` | Detailed KPI calculations |
| `CSM_DASHBOARD_IMPLEMENTATION_GUIDE.md` | Step-by-step implementation |
| `CSM_DATA_FLOW_DIAGRAM.md` | Visual data architecture |
| `/KPI Query (1)/` | SQL query templates |

---

## 🆘 QUICK TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Health Score always 0 | Check: `accounts.json` → `account.health_score` field exists |
| GRR calculation fails | Verify: `revenue_movements.json` has `movement_type` field |
| No renewals showing | Check: Date filtering logic, `renewal_date` format |
| Utilization not calculating | Ensure: `licenses.json` → `utilization` is 0-100 number |
| QBR completion always 0 | Verify: `qbr_tracking.json` has data for last 120 days |

---

## 📞 SUPPORT

**Implementation Team:** Customer Success Analytics  
**Technical Contact:** Data Engineering Team  
**Business Owner:** VP Customer Success  

**Resources:**
- Data Dictionary: `/source_data/SUMMARY.md`
- KPI Calculations: `/source_data/commercial_operations/KPI_CALCULATIONS.md`
- Architecture: `/source_data/commercial_operations/COMMERCIAL_OPS_DRILL_DOWN_ARCHITECTURE.md`

---

**Version:** 1.0 | **Last Updated:** October 10, 2025 | **Status:** Ready for Implementation

