# KPI & Calculation Reference Guide
## Cisco Customer Success & Commercial Operations Platform

**Purpose**: Complete reference for all KPI calculations, formulas, and relationships. Use as blueprint for similar implementations.

---

## 1. Core Health Score System

### Health Score Formula (Foundation of All Metrics)
```
Overall Health Score = 
  (Usage Health × 40%) + 
  (Engagement Health × 30%) + 
  (Support Health × 20%) + 
  (Business Health × 10%)
```

**Location**: `lib/health-score-calculator.ts`

### Component Calculations

**Usage Health (40%)**:
```javascript
usageScore = min(100, max(0, 
  usagePercentage + (baseHealthScore - 70) × 0.3
))
```

**Engagement Health (30%)**:
```javascript
positiveRatio = positiveEvents / totalEvents
negativeRatio = negativeEvents / totalEvents
adjustment = (positiveRatio × 15) - (negativeRatio × 10)
engagementScore = min(100, max(0, baseHealth + adjustment))
```

**Support Health (20%)**:
```javascript
adjustment = 0
if (ticketCount > 3) adjustment -= (ticketCount - 3) × 3
if (satisfaction > 7) adjustment += (satisfaction - 7) × 2
adjustment -= p1Tickets × 8
supportScore = min(100, max(0, baseHealth + adjustment))
```

**Business Health (10%)**:
```javascript
adjustment = (businessEvents × 3) + (expansionSignals × 8)
businessScore = min(100, max(0, baseHealth + adjustment))
```

### Health Categories (CRITICAL - EXACT RANGES)
```javascript
THRESHOLDS = {
  Thriving: 91-100   // Green
  Healthy: 76-90     // Light Green  
  Stable: 61-75      // Yellow
  At Risk: 46-60     // Orange
  Critical: 0-45     // Red
}

// IMPORTANT: Use <= for upper bound to prevent overlap bug
if (score >= 91 && score <= 100) return 'Thriving'
if (score >= 76 && score <= 90) return 'Healthy'  // NOT just >= 76
```

### Portfolio Health (ARR-Weighted)
```javascript
portfolioHealth = Σ(accountHealth × arr) / Σ(arr)
portfolioUsage = Σ(usageScore × arr) / Σ(arr)
portfolioEngagement = Σ(engagementScore × arr) / Σ(arr)
portfolioSupport = Σ(supportScore × arr) / Σ(arr)
```

---

## 2. Dashboard KPIs by Category

### A. CSM Portfolio Health Dashboard
**Path**: `/app/csm/portfolio-health/`

#### KPI 1: Portfolio Health Score
- **Calc**: ARR-weighted average: `Σ(health × arr) / Σ(arr)`
- **Target**: ≥ 80
- **Color**: Green (76+), Yellow (61-75), Red (0-60)

#### KPI 2: Total Accounts Managed
- **Calc**: `COUNT(accounts)` after filters
- **Breakdown**: By tier (Strategic, Enterprise, Commercial, SMB)

#### KPI 3: Total ARR Managed
- **Calc**: `Σ(account.arr)`
- **Trend**: QoQ comparison
- **Alert**: If single account > 30% of total

#### KPI 4: At-Risk ARR
- **Calc**: `Σ(arr WHERE health < 60)`
- **Outputs**: Dollar amount, count, % of portfolio

#### KPI 5: Renewal Pipeline (90 Days)
- **Calc**: Count accounts with `contract.end_date` in 0-30, 31-60, 61-90 days
- **Source**: `account.contract.end_date` or min(`product.renewal_date`)

#### KPI 6: Expansion Opportunities
- **Calc**: `COUNT WHERE health > 75 AND expansionPotential > 0`
- **Value**: `Σ(estimatedExpansionARR)`

### B. Commercial Executive Dashboard
**Path**: `/app/commercial/executive/`

#### Net Revenue Retention (NRR)
```javascript
NRR = (StartingARR + Expansion - Churn - Contraction) / StartingARR × 100%
Target: > 110%
```

#### Gross Revenue Retention (GRR)
```javascript
GRR = (StartingARR - Churn - Contraction) / StartingARR × 100%
Target: > 95%
```

#### Customer Lifetime Value (CLV)
```javascript
CLV = AvgARR × (1 / ChurnRate) × GrossMargin%
Assumptions: Gross Margin 70-80%, Discount rate applied
```

#### Revenue at Risk
```javascript
revenueAtRisk = Σ(arr WHERE health < 60 AND daysToRenewal < 90)
Alert: > $1M
```

### C. Sales Expansion Command Center
**Path**: `/app/sales-expansion/command-center/`

#### Expansion Readiness Score
```javascript
score = 
  (productHealth × 30%) +
  (usageGrowth × 25%) +
  (featureAdoption × 20%) +
  (engagement × 15%) +
  (timeSinceExpansion × 10%)

Components:
- productHealth = (utilization × 60%) + (adoptionStage × 40%)
- usageGrowth = 85 if util>80%, 70 if >60%, else 50
- featureAdoption = Mature:100, Growing:75, Early:50
- engagement = Strategic:90, Enterprise:75, Other:60
```

#### Capacity Alerts
```javascript
if (utilization > 80%) {
  daysTo100 = (100 - utilization) / monthlyGrowth × 30
  urgency = daysTo100 < 30 ? 'CRITICAL' : 'WARNING'
}
```

#### White Space Score
```javascript
Product Synergies:
- Duo → Umbrella, Splunk
- Meraki → Umbrella, Thousand Eyes
- Umbrella → Duo, Splunk
- Thousand Eyes → Meraki, Splunk
- Splunk → Umbrella, Thousand Eyes

Qualification: health > 70 AND currentProducts < 3
```

### D. Renewal Pipeline Dashboard
**API**: `/api/commercial/renewal-pipeline/`

#### Weighted Renewal Probability
```javascript
probability = 
  (health / 100 × 40%) +
  (utilization / 100 × 30%) +
  (engagement / 100 × 20%) +
  (contractCompliance × 10%)

weightedProb = Σ(probability × arr) / Σ(arr)
```

#### Risk Categories
```javascript
On Track: health >= 70 AND probability >= 0.8
At Risk: health 45-69 OR probability 0.5-0.79
Critical: health < 45 OR probability < 0.5
```

---

## 3. Key Calculations & Formulas

### Expansion Potential
```javascript
expansionPotential = 
  (utilization × 35%) +
  (health × 30%) +
  (productGaps × 20%) +
  (growthSignals × 15%)

estimatedARR = currentARR × expansionPotential × 0.25
```

### Priority Score (Action Queue)
```javascript
priority = 
  (ARR_Weight × 0.4) +
  (Health_Risk × 0.3) +
  (Renewal_Urgency × 0.2) +
  (Touch_Cadence_Gap × 0.1)

Where:
- ARR_Weight = (accountARR / maxARR) × 100
- Health_Risk = (100 - healthScore)
- Renewal_Urgency = max(0, 100 - daysToRenewal)
- Touch_Cadence_Gap = daysSinceLastTouch / targetCadence × 100
```

### Churn Risk Score
```javascript
timeRisk = days < 30 ? 40 : days < 60 ? 25 : days < 90 ? 15 : 5
healthRisk = (100 - health) × 0.35
engagementRisk = (100 - engagement) × 0.15
utilizationRisk = util < 50 ? 15 : util < 70 ? 8 : 0

churnRisk = timeRisk + healthRisk + engagementRisk + utilizationRisk
```

### Portfolio Concentration
```javascript
// Herfindahl-Hirschman Index
HHI = Σ(accountARR / totalARR)²

Risk Levels:
- HHI > 0.25: High concentration
- HHI 0.15-0.25: Moderate
- HHI < 0.15: Well diversified

// Single account alert
if (maxAccountARR / totalARR > 0.30) → ALERT
```

---

## 4. Data Model & Relationships

### Core Data Structure
```typescript
CustomerAccount {
  id: string              // CUST_000001
  name: string
  tier: string            // Strategic, Enterprise, Commercial, SMB
  arr: number
  csm_id: string
  geography: { theater, region, country }
  timeline: [{
    month: number
    date: string
    health_score: number
    usage_percentage: number
    engagement_events: []
    support_activity: {}
    business_events: []
    expansion_signals: []
  }]
  products: []
  contracts: []
  stakeholders: []
}
```

### Data Sources
```
accounts.json              → Primary enriched data
accounts_merged.json       → Extended with all relationships
master-data/
  ├── customers.json       → Customer master
  ├── contracts.json       → Renewal dates, terms
  ├── licenses.json        → Product utilization
  ├── users.json           → End-user activity
  ├── stakeholders.json    → Key contacts
  └── csms.json            → CSM assignments
```

### KPI Dependencies
```
Portfolio Health Score
├── Account Health Scores
│   ├── Usage (40%) ← timeline.usage_percentage
│   ├── Engagement (30%) ← timeline.engagement_events
│   ├── Support (20%) ← timeline.support_activity
│   └── Business (10%) ← timeline.business_events
├── ARR Weights ← account.arr
└── Filters ← tier, geography, health_category
```

---

## 5. Filter & Aggregation Logic

### Filter Application Order (CRITICAL)
```javascript
1. Load raw data
2. Apply tier filter
3. Apply geography filter  
4. Apply industry filter
5. Apply health_category filter (EXACT RANGES!)
6. Apply csm_id filter
7. Apply arr_range filter
8. Apply product filter
9. Apply time_period filter
10. Calculate aggregations on filtered set
```

### Health Category Filter (Bug Fix)
```javascript
// WRONG - causes overlap
if (category === 'Healthy' && health >= 76) return true

// CORRECT - exact ranges
if (category === 'Healthy' && health >= 76 && health <= 90) return true
```

### ARR-Weighted Aggregation Pattern
```javascript
function weightedAvg(accounts, metricGetter) {
  const weighted = accounts.reduce((sum, acc) => 
    sum + metricGetter(acc) * acc.arr, 0)
  const totalARR = accounts.reduce((sum, acc) => sum + acc.arr, 0)
  return totalARR > 0 ? weighted / totalARR : 0
}
```

---

## 6. Alert System

### Alert Priority Levels
```javascript
CRITICAL (24h SLA):
- health < 45
- healthDrop > 10 in 7 days
- health < 60 AND daysToRenewal < 30

HIGH (3d SLA):
- health < 60 AND daysToRenewal < 90
- usageDrop > 30% in 30 days
- p1Tickets > 0 AND ticketCount > 5

MEDIUM (7d SLA):
- health < 70 AND engagement < 50
- ticketCount > 5
- daysWithoutTouch > 30

LOW (30d SLA):
- utilization < 40
- health 61-75 (stable but watch)
```

### Renewal Risk Triggers
```javascript
if (daysToRenewal < 90 && health < 70) → At Risk Renewal
if (daysToRenewal < 30 && health < 60) → Critical Renewal
if (daysToRenewal < 90 && renewalProb < 0.7) → High Risk
```

---

## 7. Implementation Constants

### Key Thresholds
```javascript
HEALTH_TARGETS = {
  Portfolio: 80,
  Strategic: 85,
  Enterprise: 80,
  Commercial: 75
}

UTILIZATION_TARGETS = {
  Healthy: 70-85%,
  Alert: > 85% (capacity risk),
  Concern: < 50% (underutilization)
}

ENGAGEMENT_FREQUENCY = {
  Strategic: Weekly,
  Enterprise: Bi-weekly,
  Commercial: Monthly
}

RENEWAL_WINDOWS = {
  Immediate: 0-30 days,
  Planning: 31-60 days,
  Monitoring: 61-90 days
}
```

### Color Codes
```javascript
HEALTH_COLORS = {
  Thriving: '#10B981',   // Green
  Healthy: '#22C55E',    // Light Green
  Stable: '#EAB308',     // Yellow
  AtRisk: '#F59E0B',     // Orange
  Critical: '#EF4444'    // Red
}

TREND_COLORS = {
  Positive: '#10B981',
  Stable: '#6B7280',
  Negative: '#EF4444'
}
```

---

## 8. API Endpoints

### Core APIs
```
GET /api/dashboard/kpis
GET /api/portfolio-health-breakdown
GET /api/commercial/renewal-pipeline
GET /api/expansion/opportunities
GET /api/accounts/{id}
GET /api/usage-trends
GET /api/dashboard/health-distribution
```

### Query Parameters
```
?tier=Strategic,Enterprise
?geography=AMER,EMEA
?health_category=At Risk,Critical
?csm_id=CSM_001
?arr_min=100000&arr_max=5000000
?time_period=90d
?trend_period=90
```

---

## 9. Quick Reference

### Most Important Formulas
1. **Health Score**: Usage(40%) + Engagement(30%) + Support(20%) + Business(10%)
2. **Portfolio Health**: Σ(health × arr) / Σ(arr)
3. **Priority Score**: ARR(40%) + HealthRisk(30%) + RenewalUrgency(20%) + TouchGap(10%)
4. **Expansion Readiness**: ProductHealth(30%) + UsageGrowth(25%) + FeatureAdoption(20%) + Engagement(15%) + TimeSince(10%)
5. **NRR**: (Start + Expansion - Churn - Contraction) / Start × 100%

### Critical Rules
- Always use ARR-weighted averaging for portfolio metrics
- Apply exact range filters for health categories (avoid overlap)
- Filter before aggregation (never aggregate then filter)
- Use latest timeline entry for current metrics
- Calculate trends from timeline history, not synthetic data

### Common Pitfalls
1. ❌ Using >= for upper health category bounds → ✅ Use <= for upper bound
2. ❌ Simple average for portfolio → ✅ ARR-weighted average
3. ❌ Counting products in renewal pipeline → ✅ Count accounts
4. ❌ Hardcoded mock values → ✅ Calculate from timeline data
5. ❌ Filtering after aggregation → ✅ Filter then aggregate


