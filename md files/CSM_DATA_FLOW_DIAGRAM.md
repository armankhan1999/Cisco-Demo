# CSM Dashboard Data Flow Diagram

**Visual Reference for Data Architecture & KPI Calculations**

---

## 📊 DATA FLOW ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                                  │
│                      (Customer Success Dashboards)                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │   LEVEL 1:       │  │   LEVEL 2:       │  │   LEVEL 3:       │         │
│  │   STRATEGIC      │  │   TACTICAL       │  │   OPERATIONAL    │         │
│  │                  │  │                  │  │                  │         │
│  │  • 10 KPI Tiles  │  │  • Health        │  │  • Exception     │         │
│  │  • Trends        │  │    Decomposition │  │    Reports       │         │
│  │  • Targets       │  │  • Adoption      │  │  • At-Risk       │         │
│  │  • Alerts        │  │    Trends        │  │    Accounts      │         │
│  │                  │  │  • Churn         │  │  • Usage         │         │
│  │                  │  │    Analysis      │  │    Anomalies     │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         CALCULATION LAYER                                   │
│                      (KPI Calculation Functions)                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  KPI Calculation Engine                                             │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │  • calculateGRR()                  • calculateChurnRate()           │  │
│  │  • calculatePortfolioHealth()      • calculateAvgUtilization()     │  │
│  │  • calculateAtRiskARR()            • calculateFeatureAdoption()    │  │
│  │  • calculateRenewalRate()          • calculateEngagementScore()    │  │
│  │  • calculateTTV()                  • calculateQBRCompletion()      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         DATA INTEGRATION LAYER                              │
│                         (JSON Data Loading)                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  Master Data     │  │  Commercial Ops  │  │  CSM-Specific    │         │
│  │  Loader          │  │  Data Loader     │  │  Data Loader     │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         DATA SOURCE LAYER                                   │
│                      (Synthetic JSON Files)                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  /src/source_data/                                                          │
│  │                                                                           │
│  ├─ accounts.json ───────────────────────┐                                  │
│  │   • id, name, tier, arr              │                                  │
│  │   • health_score (PRE-CALCULATED!)   │ ◄─── PRIMARY SOURCE             │
│  │   • renewal_risk_score               │                                  │
│  │   • csm_id, timeline                 │                                  │
│  │                                      │                                  │
│  ├─ commercial_operations/              │                                  │
│  │  │                                   │                                  │
│  │  ├─ subscriptions.json ──────────────┤                                  │
│  │  │   • subscription_id               │                                  │
│  │  │   • arr, mrr                      │ ◄─── PRIMARY SOURCE             │
│  │  │   • renewal_date, renewal_status  │                                  │
│  │  │   • churn_risk_score              │                                  │
│  │  │                                   │                                  │
│  │  ├─ revenue_movements.json ──────────┤                                  │
│  │  │   • movement_type (expansion/     │                                  │
│  │  │     churn/contraction)            │ ◄─── PRIMARY SOURCE             │
│  │  │   • arr_change                    │                                  │
│  │  │   • effective_date                │                                  │
│  │  │                                   │                                  │
│  │  ├─ licenses.json ────────────────────┤                                  │
│  │  │   • utilization (0-100)           │ ◄─── PRIMARY SOURCE             │
│  │  │   • adoption_stage                │                                  │
│  │  │   • implementation_date           │                                  │
│  │  │   • utilization_trend             │                                  │
│  │  │                                   │                                  │
│  │  ├─ utilization_history.json ────────┤                                  │
│  │  │   • Historical trends (90 days)   │ ◄─── TREND DATA                 │
│  │  │                                   │                                  │
│  │  └─ utilization_alerts.json ─────────┤                                  │
│  │      • Alert_id, severity            │ ◄─── ANOMALY DETECTION          │
│  │      • Current vs threshold values   │                                  │
│  │                                      │                                  │
│  └─ csm-data/                           │                                  │
│     │                                   │                                  │
│     ├─ qbr_tracking.json ───────────────┤                                  │
│     │   • account_id, qbr_date          │ ◄─── PRIMARY SOURCE             │
│     │   • qbr_status, qbr_type          │                                  │
│     │                                   │                                  │
│     ├─ churn_predictions.json ──────────┤                                  │
│     │   • churn_probability             │ ◄─── PREDICTIVE ANALYTICS       │
│     │   • risk_factors                  │                                  │
│     │   • mitigation_plan_status        │                                  │
│     │                                   │                                  │
│     ├─ champion_departure_alerts.json ──┤                                  │
│     │   • account_id, status            │ ◄─── RISK SIGNALS               │
│     │                                   │                                  │
│     └─ white_space_analysis.json ───────┘                                  │
│         • Missing products               ◄─── EXPANSION OPPORTUNITIES      │
│         • Estimated opportunity value                                       │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 KPI-TO-DATA SOURCE MAPPING

### KPI 1: Gross Revenue Retention (GRR) - 95%

```
┌──────────────────────────┐
│   GRR KPI Tile           │
│   96.2% ✓ Target         │
│   ↗ +1.5pp               │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateGRR()                            │
│  ----------------------------------------  │
│  1. Get starting ARR cohort                │
│  2. Sum churn + contraction movements      │
│  3. Calculate retention percentage         │
└────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────┬─────────────────────┐
│  subscriptions.json  │  revenue_movements  │
│  • subscription_     │  • movement_type    │
│    start_date        │  • arr_change       │
│  • arr               │  • effective_date   │
└──────────────────────┴─────────────────────┘
```

**SQL Query Reference:** `/KPI Query (1)/Gross Revenue Retention.txt`

---

### KPI 2: Portfolio Health Score - 75

```
┌──────────────────────────┐
│  Portfolio Health        │
│  78 ✓ Target             │
│  Weighted Average        │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculatePortfolioHealth()                │
│  ----------------------------------------  │
│  Formula:                                  │
│  SUM(health_score × arr) / SUM(arr)        │
└────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  accounts.json                              │
│  • health_score (PRE-CALCULATED 0-100)      │
│  • arr                                      │
│                                             │
│  Health Score Components:                   │
│  ┌──────────────────────────────────────┐  │
│  │ • Usage Health (40%)                 │  │
│  │   ← licenses.json → utilization      │  │
│  │                                      │  │
│  │ • Engagement Health (30%)            │  │
│  │   ← qbr_tracking.json → qbr_date     │  │
│  │                                      │  │
│  │ • Support Health (20%)               │  │
│  │   ← support_tickets (if available)   │  │
│  │                                      │  │
│  │ • Business Outcome (10%)             │  │
│  │   ← Value realization metrics        │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**SQL Query Reference:** `/KPI Query (1)/Portfolio Health Score.txt`

---

### KPI 3: At-Risk ARR - Minimize

```
┌──────────────────────────┐
│  At-Risk ARR             │
│  $3.2M ⚠ Monitor         │
│  12 accounts             │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateAtRiskARR()                      │
│  ----------------------------------------  │
│  Filter: health_score < 60                 │
│  Aggregate: SUM(arr)                       │
└────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  accounts.json                              │
│  • health_score                             │
│  • arr                                      │
│  • tier (for segmentation)                  │
│                                             │
│  Enhancement with:                          │
│  churn_predictions.json                     │
│  • churn_probability                        │
│  • risk_factors                             │
└─────────────────────────────────────────────┘
```

---

### KPI 4: Renewal Rate - 92%

```
┌──────────────────────────┐
│  Renewal Rate            │
│  94.1% ✓ Target          │
│  ↗ Improvement           │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateRenewalRate()                    │
│  ----------------------------------------  │
│  Count renewals: renewal_status='renewed'  │
│  Total renewals due in period              │
│  Calculate percentage                      │
└────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  subscriptions.json                         │
│  • renewal_date                             │
│  • renewal_status                           │
│    - renewed ✓                              │
│    - quoted                                 │
│    - at_risk                                │
│  • arr (for dollar-based rate)              │
└─────────────────────────────────────────────┘
```

**Related Query:** `/KPI Query (1)/Renewal Quote Velocity.txt`

---

### KPI 5: Churn Rate - ≤5%

```
┌──────────────────────────┐
│  Churn Rate              │
│  4.2% ✓ Target           │
│  ↘ Improving             │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateChurnRate()                      │
│  ----------------------------------------  │
│  Filter: movement_type = 'churn'           │
│  Sum: ABS(arr_change)                      │
│  Divide by: Starting ARR                   │
└────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  revenue_movements.json                     │
│  • movement_type: 'churn'                   │
│  • arr_change (negative value)              │
│  • effective_date                           │
│  • reason_code                              │
│                                             │
│  Plus:                                      │
│  churn_predictions.json                     │
│  • Forward-looking churn probability        │
└─────────────────────────────────────────────┘
```

**SQL Query Reference:** `/KPI Query (1)/churn rate.txt`

---

### KPI 6: Average Utilization Rate - 75%

```
┌──────────────────────────┐
│  Avg Utilization         │
│  82% ✓ Target            │
│  Product-level breakdown │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateAvgUtilization()                 │
│  ----------------------------------------  │
│  AVG(utilization) across all licenses      │
│  Group by product_family                   │
└────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  licenses.json                              │
│  • utilization (0-100 scale)                │
│  • product_family                           │
│  • utilization_trend                        │
│    - increasing ↗                           │
│    - stable →                               │
│    - decreasing ↘                           │
│                                             │
│  Alerts from:                               │
│  utilization_alerts.json                    │
│  • Capacity warnings (>90%)                 │
│  • Low adoption alerts (<50%)               │
└─────────────────────────────────────────────┘
```

**SQL Query Reference:** `/KPI Query (1)/License Utilization Rate.txt`

---

### KPI 7: Feature Adoption Rate - 60%

```
┌──────────────────────────┐
│  Feature Adoption        │
│  68% ✓ Target            │
│  Advanced features       │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateFeatureAdoption()                │
│  ----------------------------------------  │
│  Count customers with:                     │
│  adoption_stage = 'Mature' OR 'Optimized'  │
│  Divide by total customers                 │
└────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  licenses.json                              │
│  • adoption_stage:                          │
│    - Initial (basic)                        │
│    - Developing (growing)                   │
│    - Mature (advanced) ✓                    │
│    - Optimized (full platform) ✓            │
│                                             │
│  Enhancement with:                          │
│  multi_product_readiness.json               │
│  • Product-specific adoption scores         │
└─────────────────────────────────────────────┘
```

---

### KPI 8: Customer Engagement Score - 70

```
┌──────────────────────────┐
│  Engagement Score        │
│  76 ✓ Target             │
│  Composite metric        │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateEngagementScore()                │
│  ----------------------------------------  │
│  Touch Frequency × 40%                     │
│  + QBR Recency × 30%                       │
│  + NPS Score × 30%                         │
└────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────┬──────────────────────┐
│  qbr_tracking.json   │  accounts.json       │
│  • qbr_date          │  • last_touch_date   │
│  • qbr_status        │  • timeline[].       │
│                      │    engagement_events │
└──────────────────────┴──────────────────────┘
```

**Composite Calculation** - No SQL file (custom)

---

### KPI 9: Time to Value (TTV) - 60 days

```
┌──────────────────────────┐
│  Time to Value           │
│  52 days ✓ Target        │
│  Onboarding speed        │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateTTV()                            │
│  ----------------------------------------  │
│  DATEDIFF(                                 │
│    subscription_start_date,                │
│    implementation_date                     │
│  )                                         │
│  Filter: subscription_type = 'new'         │
└────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────┬──────────────────────┐
│  subscriptions.json  │  licenses.json       │
│  • subscription_     │  • implementation_   │
│    start_date        │    date              │
│  • subscription_     │                      │
│    type = 'new'      │                      │
└──────────────────────┴──────────────────────┘
```

---

### KPI 10: QBR Completion Rate - 85%

```
┌──────────────────────────┐
│  QBR Completion          │
│  88% ✓ Target            │
│  Last 120 days           │
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  calculateQBRCompletion()                  │
│  ----------------------------------------  │
│  Count accounts with QBR in last 120 days  │
│  Divide by total active accounts           │
└────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  qbr_tracking.json                          │
│  • account_id                               │
│  • qbr_date                                 │
│  • qbr_status: 'completed'                  │
│  • qbr_type: 'quarterly' or 'annual'        │
│                                             │
│  Cross-reference with:                      │
│  accounts.json                              │
│  • status = 'Active'                        │
└─────────────────────────────────────────────┘
```

---

## 🔍 LEVEL 2 VIEW DATA FLOWS

### Health Score Decomposition

```
┌─────────────────────────────────────────────────────────┐
│  Health Score Breakdown                                 │
│  ┌────────────────┬──────┬───────┬──────────────┐      │
│  │ Component      │Weight│ Score │Contribution  │      │
│  ├────────────────┼──────┼───────┼──────────────┤      │
│  │ Usage Health   │ 40%  │  82   │   32.8       │      │
│  │ Engagement     │ 30%  │  76   │   22.8       │      │
│  │ Support Health │ 20%  │  71   │   14.2       │      │
│  │ Outcome Health │ 10%  │  78   │    7.8       │      │
│  └────────────────┴──────┴───────┴──────────────┘      │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼───────┐  ┌──────▼────────┐
│ licenses.    │  │ qbr_tracking.  │  │ support_      │
│ json         │  │ json           │  │ tickets       │
│              │  │                │  │               │
│ utilization  │  │ qbr_date       │  │ ticket_count  │
└──────────────┘  └────────────────┘  └───────────────┘
```

---

### Adoption & Utilization Trends

```
┌─────────────────────────────────────────────────────────────┐
│  Product Adoption Matrix                                    │
│  ┌────────────┬──────┬──────────┬────────┬────────┐        │
│  │ Product    │ Util │ Adoption │ Trend  │At-Risk │        │
│  ├────────────┼──────┼──────────┼────────┼────────┤        │
│  │ Meraki     │ 84%  │   72%    │  ↗+5%  │   3    │        │
│  │ Duo        │ 78%  │   68%    │  →     │   5    │        │
│  │ Umbrella   │ 71%  │   58%    │  ↘-3%  │   8⚠   │        │
│  └────────────┴──────┴──────────┴────────┴────────┘        │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼───────┐  ┌──────▼────────┐
│ licenses.    │  │ utilization_   │  │ accounts.     │
│ json         │  │ history.json   │  │ json          │
│              │  │                │  │               │
│ utilization  │  │ 90-day trend   │  │ health_score  │
│ adoption_    │  │ data           │  │ <60 (at-risk) │
│ stage        │  │                │  │               │
│ utilization_ │  │                │  │               │
│ trend        │  │                │  │               │
└──────────────┘  └────────────────┘  └───────────────┘
```

---

### Churn Risk Analysis by Segment

```
┌─────────────────────────────────────────────────────────────┐
│  Churn Risk Distribution                                    │
│  ┌──────────┬────────┬──────────┬────────┬──────────┐      │
│  │ Tier     │Tot ARR │At-Risk   │Risk %  │Prob     │      │
│  ├──────────┼────────┼──────────┼────────┼──────────┤      │
│  │Strategic │$10.2M  │ $0.5M    │ 4.9%✓  │Low      │      │
│  │Enterprise│$7.8M   │ $1.2M    │15.4%⚠  │Medium   │      │
│  └──────────┴────────┴──────────┴────────┴──────────┘      │
│                                                             │
│  Primary Churn Drivers:                                     │
│  1. Low utilization (<50%): 8 accounts, $1.4M ARR          │
│  2. Lack of engagement: 6 accounts, $0.9M ARR              │
│  3. Support issues: 4 accounts, $0.5M ARR                  │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼───────┐  ┌──────▼────────┐
│ accounts.    │  │ churn_         │  │ licenses.     │
│ json         │  │ predictions.   │  │ json          │
│              │  │ json           │  │               │
│ health_score │  │                │  │ utilization   │
│ tier         │  │ churn_         │  │ <50 (driver)  │
│ arr          │  │ probability    │  │               │
│              │  │ risk_factors   │  │               │
└──────────────┘  └────────────────┘  └───────────────┘
```

---

## 🚨 LEVEL 3 EXCEPTION REPORT DATA FLOWS

### Critical Health Accounts Report

```
┌────────────────────────────────────────────────────────────────┐
│  Critical Health Accounts (Immediate Action)                   │
│  ┌──────────┬──────┬──────┬──────────┬────────┬─────────┐     │
│  │ Account  │Health│ ARR  │Risk      │Days to │Action   │     │
│  │          │Score │      │Factor    │Renewal │Plan     │     │
│  ├──────────┼──────┼──────┼──────────┼────────┼─────────┤     │
│  │MegaCorp  │  38  │$425K │Low util  │  45    │Exec     │     │
│  │          │      │      │(32%)     │        │escalate │     │
│  └──────────┴──────┴──────┴──────────┴────────┴─────────┘     │
│                                                                │
│  [Launch Save Campaign] [Schedule Exec Review] [View Detail]  │
└────────────────────────────────────────────────────────────────┘
                           ▲
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
┌────▼──────┐  ┌───────────▼───────┐  ┌─────────▼──────┐
│accounts.  │  │licenses.json      │  │subscriptions.  │
│json       │  │                   │  │json            │
│           │  │utilization        │  │                │
│health_    │  │<50 → Primary      │  │renewal_date    │
│score<45   │  │risk factor        │  │→ Days to       │
│           │  │                   │  │renewal         │
└───────────┘  └───────────────────┘  └────────────────┘
                           │
                  ┌────────▼────────┐
                  │churn_           │
                  │predictions.json │
                  │                 │
                  │mitigation_plan_ │
                  │status           │
                  └─────────────────┘
```

---

### Usage Anomaly Alerts Report

```
┌────────────────────────────────────────────────────────────────┐
│  Usage Anomaly Alerts                                          │
│  ┌──────────┬──────────┬────────┬────────┬────────┬─────┐     │
│  │Alert ID  │Account   │Product │Issue   │Severity│Days │     │
│  ├──────────┼──────────┼────────┼────────┼────────┼─────┤     │
│  │ALT-678   │DataCorp  │Duo     │Usage↓  │🔴Critical│8  │     │
│  │          │          │        │45%     │        │     │     │
│  └──────────┴──────────┴────────┴────────┴────────┴─────┘     │
│                                                                │
│  Recommended Action: Immediate customer outreach               │
│  [Call Now] [Email] [View Usage History] [Log Note]           │
└────────────────────────────────────────────────────────────────┘
                           ▲
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
┌────▼──────────┐  ┌───────▼────────┐  ┌────────▼──────┐
│utilization_   │  │licenses.json   │  │accounts.json  │
│alerts.json    │  │                │  │               │
│               │  │license_id →    │  │customer_id →  │
│alert_id       │  │product_family  │  │name           │
│severity       │  │                │  │               │
│alert_type     │  │                │  │               │
│current_value  │  │                │  │               │
│threshold_value│  │                │  │               │
│created_date   │  │                │  │               │
└───────────────┘  └────────────────┘  └───────────────┘
```

---

## 📋 DATA TRANSFORMATION PIPELINE

### Stage 1: JSON Loading

```javascript
// Load all required data files
const loadCSMData = async () => {
  return {
    accounts: await import('/source_data/accounts.json'),
    subscriptions: await import('/source_data/commercial_operations/subscriptions.json'),
    licenses: await import('/source_data/commercial_operations/licenses.json'),
    revenue_movements: await import('/source_data/commercial_operations/revenue_movements.json'),
    qbr_tracking: await import('/source_data/csm-data/qbr_tracking.json'),
    churn_predictions: await import('/source_data/csm-data/churn_predictions.json'),
    utilization_alerts: await import('/source_data/commercial_operations/utilization_alerts.json')
  };
};
```

### Stage 2: Data Indexing

```javascript
// Create fast lookup indices
const createIndices = (data) => {
  return {
    accountsById: new Map(data.accounts.map(a => [a.account.id, a])),
    subscriptionsByCustomer: groupBy(data.subscriptions, 'customer_id'),
    licensesByCustomer: groupBy(data.licenses, 'customer_id'),
    movementsByCustomer: groupBy(data.revenue_movements, 'customer_id'),
    qbrByAccount: groupBy(data.qbr_tracking, 'account_id')
  };
};
```

### Stage 3: KPI Calculation

```javascript
// Calculate all Level 1 KPIs
const calculateAllKPIs = (data, indices) => {
  return {
    grr: calculateGRR(data.subscriptions, data.revenue_movements),
    portfolioHealth: calculatePortfolioHealth(data.accounts),
    atRiskARR: calculateAtRiskARR(data.accounts),
    renewalRate: calculateRenewalRate(data.subscriptions),
    churnRate: calculateChurnRate(data.revenue_movements),
    avgUtilization: calculateAvgUtilization(data.licenses),
    featureAdoption: calculateFeatureAdoption(data.licenses),
    engagementScore: calculateEngagementScore(data.accounts, data.qbr_tracking),
    ttv: calculateTTV(data.subscriptions, data.licenses),
    qbrCompletion: calculateQBRCompletion(data.accounts, data.qbr_tracking)
  };
};
```

### Stage 4: Dashboard Rendering

```javascript
// Render Level 1 Dashboard
const renderLevel1Dashboard = (kpis) => {
  return (
    <CSMPortfolioDashboard
      grr={kpis.grr}
      portfolioHealth={kpis.portfolioHealth}
      atRiskARR={kpis.atRiskARR}
      renewalRate={kpis.renewalRate}
      churnRate={kpis.churnRate}
      avgUtilization={kpis.avgUtilization}
      featureAdoption={kpis.featureAdoption}
      engagementScore={kpis.engagementScore}
      ttv={kpis.ttv}
      qbrCompletion={kpis.qbrCompletion}
    />
  );
};
```

---

## 🔄 DATA REFRESH STRATEGY

```
┌────────────────────────────────────────────────────────────┐
│  REFRESH SCHEDULE                                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Real-time (Event-driven):                                │
│  • Utilization Alerts → Immediate notification            │
│  • Critical health changes → Real-time update             │
│                                                            │
│  Hourly:                                                   │
│  • Utilization metrics                                     │
│  • Usage trends                                            │
│                                                            │
│  Daily (2 AM):                                             │
│  • GRR, Churn Rate, Renewal Rate                          │
│  • Portfolio Health Score                                  │
│  • At-Risk ARR                                             │
│                                                            │
│  Weekly:                                                   │
│  • Feature Adoption Rate                                   │
│  • Time to Value                                           │
│  • QBR Completion Rate                                     │
│                                                            │
│  On-Demand:                                                │
│  • Exception reports                                       │
│  • Drill-down analyses                                     │
│  • Custom date range queries                               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Data Sources
- [x] accounts.json - **Primary source loaded**
- [x] subscriptions.json - **Primary source loaded**
- [x] licenses.json - **Primary source loaded**
- [x] revenue_movements.json - **Primary source loaded**
- [x] qbr_tracking.json - **Primary source loaded**
- [x] churn_predictions.json - **Available for enhancement**
- [x] utilization_alerts.json - **Available for Level 3**

### KPI Calculations
- [ ] calculateGRR() - **SQL template available**
- [ ] calculatePortfolioHealth() - **Direct from accounts.json**
- [ ] calculateAtRiskARR() - **Simple filter query**
- [ ] calculateRenewalRate() - **Aggregation query**
- [ ] calculateChurnRate() - **SQL template available**
- [ ] calculateAvgUtilization() - **Direct from licenses.json**
- [ ] calculateFeatureAdoption() - **Custom logic needed**
- [ ] calculateEngagementScore() - **Composite calculation**
- [ ] calculateTTV() - **Date diff calculation**
- [ ] calculateQBRCompletion() - **Date filter query**

### Dashboard Views
- [ ] Level 1: Strategic Dashboard (10 KPIs)
- [ ] Level 2: Health Decomposition
- [ ] Level 2: Adoption Trends
- [ ] Level 2: Churn Risk Analysis
- [ ] Level 2: Journey Stage Analysis
- [ ] Level 3: Critical Health Accounts
- [ ] Level 3: Overdue Activities
- [ ] Level 3: At-Risk Renewals
- [ ] Level 3: Usage Anomalies

---

**Document Version:** 1.0  
**Last Updated:** October 10, 2025  
**Related Documents:**
- `CSM_KPI_MAPPING_ANALYSIS.md` - Detailed KPI specifications
- `CSM_DASHBOARD_IMPLEMENTATION_GUIDE.md` - Implementation steps
- `main _CSMDashboards file to referes.md` - Original design document


