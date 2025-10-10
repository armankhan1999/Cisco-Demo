# CSM Dashboard Implementation Guide

**Quick Reference for Building Customer Success Dashboards**

Reference: `main _CSMDashboards file to referes.md` Section 5  
Data Mapping: `CSM_KPI_MAPPING_ANALYSIS.md`

---

## 📊 DASHBOARD OVERVIEW

### Three-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LEVEL 1: STRATEGIC VIEW (Customer Success Portfolio)       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 10 KPI Tiles | Trends | Targets | Alerts          │   │
│  │ ✓ GRR  ✓ Health  ✓ At-Risk  ✓ Renewal Rate        │   │
│  └─────────────────────────────────────────────────────┘   │
│                      ↓ DRILL DOWN                           │
│  LEVEL 2: TACTICAL VIEW (Deep Dive Analytics)              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Health Decomposition | Adoption Trends              │   │
│  │ Churn Analysis | Journey Stages                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                      ↓ DRILL DOWN                           │
│  LEVEL 3: OPERATIONAL VIEW (Action Center)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Exception Reports | At-Risk Accounts                │   │
│  │ Usage Anomalies | Overdue Activities                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 10 PRIMARY KPIs - LEVEL 1

| # | KPI | Target | Data Source | Status |
|---|-----|--------|-------------|--------|
| 1 | **Gross Revenue Retention (GRR)** | ≥ 95% | subscriptions.json + revenue_movements.json | ✅ SQL Ready |
| 2 | **Portfolio Health Score** | ≥ 75 | accounts.json (pre-calculated) | ✅ Direct Query |
| 3 | **At-Risk ARR** | Minimize | accounts.json (health_score < 60) | ✅ Simple Query |
| 4 | **Renewal Rate** | ≥ 92% | subscriptions.json (renewal_status) | ✅ SQL Ready |
| 5 | **Churn Rate** | ≤ 5% | revenue_movements.json (movement_type) | ✅ SQL Ready |
| 6 | **Average Utilization Rate** | ≥ 75% | licenses.json (utilization field) | ✅ Direct Query |
| 7 | **Feature Adoption Rate** | ≥ 60% | licenses.json (adoption_stage) | ⚠️ Custom Logic |
| 8 | **Customer Engagement Score** | ≥ 70 | qbr_tracking.json + accounts timeline | ⚠️ Composite |
| 9 | **Time to Value (TTV)** | ≤ 60 days | subscriptions + licenses dates | ⚠️ Custom Logic |
| 10 | **QBR Completion Rate** | ≥ 85% | qbr_tracking.json | ✅ Simple Query |

### Priority Implementation Order

**Week 1-2: Foundation KPIs** (Direct queries, pre-calculated)
- ✅ Portfolio Health Score (accounts.json → health_score)
- ✅ At-Risk ARR (accounts.json → health_score < 60)
- ✅ Avg Utilization Rate (licenses.json → utilization)

**Week 3-4: Core Retention Metrics** (SQL queries available)
- ✅ GRR (KPI Query file exists)
- ✅ Churn Rate (KPI Query file exists)
- ✅ Renewal Rate (subscriptions.json → renewal_status)

**Week 5-6: Engagement & Activity** (Simple aggregations)
- ✅ QBR Completion Rate (qbr_tracking.json)
- ⚠️ Feature Adoption Rate (custom logic on adoption_stage)

**Week 7-8: Advanced Metrics** (Custom composite calculations)
- ⚠️ Customer Engagement Score (composite)
- ⚠️ Time to Value (date calculations)

---

## 📁 DATA SOURCE MAPPING

### Core Data Files

```
/src/source_data/
├── accounts.json                     ⭐ PRIMARY SOURCE
│   └── Fields: id, name, tier, arr, health_score, 
│                renewal_risk_score, csm_id
│
├── commercial_operations/
│   ├── subscriptions.json           ⭐ PRIMARY SOURCE
│   │   └── Fields: subscription_id, customer_id, arr, 
│   │              renewal_date, renewal_status, 
│   │              product_family, churn_risk_score
│   │
│   ├── revenue_movements.json       ⭐ PRIMARY SOURCE
│   │   └── Fields: movement_type (expansion/churn/contraction),
│   │              arr_change, effective_date
│   │
│   ├── licenses.json                ⭐ PRIMARY SOURCE
│   │   └── Fields: license_id, customer_id, product_family,
│   │              utilization (0-100), adoption_stage,
│   │              implementation_date
│   │
│   ├── utilization_history.json     📊 TRENDS
│   └── utilization_alerts.json      🚨 ANOMALIES
│
└── csm-data/
    ├── qbr_tracking.json            ⭐ PRIMARY SOURCE
    │   └── Fields: account_id, qbr_date, qbr_status
    │
    ├── churn_predictions.json       📈 PREDICTIVE
    ├── champion_departure_alerts.json 🚨 RISK SIGNALS
    └── white_space_analysis.json    💡 EXPANSION
```

### Field-Level Mapping

| Dashboard KPI | JSON File | Field Path | Notes |
|---------------|-----------|------------|-------|
| Health Score | accounts.json | `$.account.health_score` | Pre-calculated 0-100 |
| ARR | accounts.json | `$.account.arr` | Current ARR |
| Tier | accounts.json | `$.account.tier` | Enterprise/Commercial/SMB |
| Utilization | licenses.json | `$.utilization` | Percentage 0-100 |
| Adoption Stage | licenses.json | `$.adoption_stage` | Initial/Developing/Mature/Optimized |
| Renewal Status | subscriptions.json | `$.renewal_status` | renewed/quoted/at_risk |
| Movement Type | revenue_movements.json | `$.movement_type` | expansion/churn/contraction |
| ARR Change | revenue_movements.json | `$.arr_change` | Positive or negative |

---

## 🔧 IMPLEMENTATION STEPS

### Step 1: Data Loading

```javascript
// Load JSON data into application
import accounts from './source_data/accounts.json';
import subscriptions from './source_data/commercial_operations/subscriptions.json';
import licenses from './source_data/commercial_operations/licenses.json';
import revenue_movements from './source_data/commercial_operations/revenue_movements.json';
import qbr_tracking from './source_data/csm-data/qbr_tracking.json';
```

### Step 2: Create KPI Calculation Functions

```typescript
// Example: Calculate Portfolio Health Score
export function calculatePortfolioHealth(accounts: Account[]): number {
  const activeAccounts = accounts.filter(a => a.account.arr > 0);
  
  const weightedHealth = activeAccounts.reduce((sum, account) => {
    return sum + (account.account.health_score * account.account.arr);
  }, 0);
  
  const totalARR = activeAccounts.reduce((sum, a) => sum + a.account.arr, 0);
  
  return Math.round(weightedHealth / totalARR);
}

// Example: Calculate At-Risk ARR
export function calculateAtRiskARR(accounts: Account[]): number {
  return accounts
    .filter(a => a.account.health_score < 60)
    .reduce((sum, a) => sum + a.account.arr, 0);
}

// Example: Calculate Average Utilization
export function calculateAvgUtilization(licenses: License[]): number {
  const avgUtil = licenses.reduce((sum, l) => sum + l.utilization, 0) / licenses.length;
  return Math.round(avgUtil);
}
```

### Step 3: Build Level 1 Dashboard UI

```tsx
// Customer Success Portfolio Dashboard - Level 1
export function CSMPortfolioDashboard() {
  // Calculate KPIs
  const grr = calculateGRR(subscriptions, revenue_movements);
  const portfolioHealth = calculatePortfolioHealth(accounts);
  const atRiskARR = calculateAtRiskARR(accounts);
  const renewalRate = calculateRenewalRate(subscriptions);
  
  return (
    <div className="csm-dashboard">
      <h1>Customer Success Portfolio Dashboard</h1>
      
      <div className="kpi-grid">
        {/* Row 1 */}
        <KPITile 
          title="GRR"
          value={`${grr.toFixed(1)}%`}
          target={95}
          trend={grr > 95 ? 'up' : 'down'}
          status={grr >= 95 ? 'success' : 'warning'}
        />
        
        <KPITile 
          title="Portfolio Health"
          value={portfolioHealth}
          target={75}
          trend="up"
          status={portfolioHealth >= 75 ? 'success' : 'warning'}
        />
        
        <KPITile 
          title="At-Risk ARR"
          value={formatCurrency(atRiskARR)}
          target="Minimize"
          trend="down"
          status={atRiskARR < 2000000 ? 'success' : 'danger'}
        />
        
        <KPITile 
          title="Renewal Rate"
          value={`${renewalRate.toFixed(1)}%`}
          target={92}
          trend="up"
          status={renewalRate >= 92 ? 'success' : 'warning'}
        />
        
        {/* Row 2 - Additional KPIs */}
      </div>
      
      <HealthDistribution accounts={accounts} />
      <RenewalPipeline subscriptions={subscriptions} />
      <CriticalActions accounts={accounts} />
    </div>
  );
}
```

### Step 4: Add Drill-Down Navigation

```tsx
// Click handlers for drilling down
<KPITile 
  title="At-Risk ARR"
  value={formatCurrency(atRiskARR)}
  onClick={() => navigate('/csm/level2/at-risk-analysis')}
/>

// Level 2 Route
<Route path="/csm/level2/at-risk-analysis" element={<AtRiskAnalysis />} />

// Level 3 Route
<Route path="/csm/level3/account/:id" element={<AccountDetail />} />
```

---

## 📊 LEVEL 2 VIEWS - IMPLEMENTATION

### View 1: Health Score Decomposition

```typescript
interface HealthComponent {
  component: string;
  weight: number;
  score: number;
  contribution: number;
}

export function calculateHealthDecomposition(
  account: Account,
  licenses: License[],
  qbrTracking: QBRTracking[]
): HealthComponent[] {
  // Usage Health (40%)
  const avgUtilization = licenses
    .filter(l => l.customer_id === account.account.id)
    .reduce((sum, l) => sum + l.utilization, 0) / licenses.length;
  
  // Engagement Health (30%)
  const lastQBR = qbrTracking
    .filter(q => q.account_id === account.account.id)
    .sort((a, b) => new Date(b.qbr_date) - new Date(a.qbr_date))[0];
  
  const daysSinceQBR = lastQBR 
    ? Math.floor((Date.now() - new Date(lastQBR.qbr_date).getTime()) / (1000 * 60 * 60 * 24))
    : 180;
  
  const engagementScore = daysSinceQBR <= 90 ? 90 : daysSinceQBR <= 120 ? 75 : 50;
  
  return [
    {
      component: 'Usage Health',
      weight: 40,
      score: avgUtilization,
      contribution: avgUtilization * 0.40
    },
    {
      component: 'Engagement Health',
      weight: 30,
      score: engagementScore,
      contribution: engagementScore * 0.30
    },
    {
      component: 'Support Health',
      weight: 20,
      score: 80, // Placeholder
      contribution: 80 * 0.20
    },
    {
      component: 'Business Outcome',
      weight: 10,
      score: 75, // Placeholder
      contribution: 75 * 0.10
    }
  ];
}
```

### View 2: Adoption & Utilization Trends

```typescript
interface ProductAdoption {
  productFamily: string;
  avgUtilization: number;
  featureAdoptionRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  atRiskAccounts: number;
}

export function calculateProductAdoption(
  licenses: License[],
  accounts: Account[]
): ProductAdoption[] {
  const productFamilies = [...new Set(licenses.map(l => l.product_family))];
  
  return productFamilies.map(product => {
    const productLicenses = licenses.filter(l => l.product_family === product);
    
    const avgUtil = productLicenses.reduce((sum, l) => sum + l.utilization, 0) 
                    / productLicenses.length;
    
    const advancedAdoption = productLicenses.filter(
      l => l.adoption_stage === 'Mature' || l.adoption_stage === 'Optimized'
    ).length;
    
    const featureAdoptionRate = (advancedAdoption / productLicenses.length) * 100;
    
    // Determine trend
    const increasingCount = productLicenses.filter(l => l.utilization_trend === 'increasing').length;
    const decreasingCount = productLicenses.filter(l => l.utilization_trend === 'decreasing').length;
    
    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (increasingCount > decreasingCount * 1.5) trend = 'increasing';
    if (decreasingCount > increasingCount * 1.5) trend = 'decreasing';
    
    // At-risk accounts
    const customerIds = [...new Set(productLicenses.map(l => l.customer_id))];
    const atRiskAccounts = accounts.filter(
      a => customerIds.includes(a.account.id) && a.account.health_score < 60
    ).length;
    
    return {
      productFamily: product,
      avgUtilization: Math.round(avgUtil),
      featureAdoptionRate: Math.round(featureAdoptionRate),
      trend,
      atRiskAccounts
    };
  });
}
```

---

## 🚨 LEVEL 3 EXCEPTION REPORTS

### Critical Health Accounts

```typescript
interface CriticalAccount {
  customerId: string;
  customerName: string;
  healthScore: number;
  arr: number;
  primaryRiskFactor: string;
  daysToRenewal: number;
  csm: string;
  actionPlanStatus: string;
}

export function getCriticalHealthAccounts(
  accounts: Account[],
  licenses: License[],
  subscriptions: Subscription[],
  qbrTracking: QBRTracking[]
): CriticalAccount[] {
  return accounts
    .filter(a => a.account.health_score < 45)
    .map(account => {
      // Find primary risk factor
      const accountLicenses = licenses.filter(l => l.customer_id === account.account.id);
      const avgUtilization = accountLicenses.reduce((sum, l) => sum + l.utilization, 0) 
                            / accountLicenses.length;
      
      const lastQBR = qbrTracking
        .filter(q => q.account_id === account.account.id)
        .sort((a, b) => new Date(b.qbr_date) - new Date(a.qbr_date))[0];
      
      const daysSinceQBR = lastQBR 
        ? Math.floor((Date.now() - new Date(lastQBR.qbr_date).getTime()) / (1000 * 60 * 60 * 24))
        : 180;
      
      let primaryRiskFactor = 'Multiple factors';
      if (avgUtilization < 50) {
        primaryRiskFactor = `Low utilization (${Math.round(avgUtilization)}%)`;
      } else if (daysSinceQBR > 90) {
        primaryRiskFactor = `No engagement (${daysSinceQBR} days)`;
      }
      
      // Get renewal date
      const subscription = subscriptions.find(s => s.customer_id === account.account.id);
      const daysToRenewal = subscription
        ? Math.floor((new Date(subscription.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
      
      return {
        customerId: account.account.id,
        customerName: account.account.name,
        healthScore: account.account.health_score,
        arr: account.account.arr,
        primaryRiskFactor,
        daysToRenewal,
        csm: account.account.csm_id,
        actionPlanStatus: 'Exec escalation scheduled' // Could pull from churn_predictions
      };
    })
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 20);
}
```

---

## 🎨 UI COMPONENT EXAMPLES

### KPI Tile Component

```tsx
interface KPITileProps {
  title: string;
  value: string | number;
  target: number | string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export function KPITile({ title, value, target, trend, status, onClick }: KPITileProps) {
  const trendIcon = {
    up: '↗',
    down: '↘',
    stable: '→'
  };
  
  const statusColor = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };
  
  return (
    <div 
      className={`kpi-tile ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="kpi-header">{title}</div>
      <div className="kpi-value text-3xl font-bold">{value}</div>
      <div className="kpi-footer flex justify-between items-center">
        <span className={`badge ${statusColor[status || 'success']}`}>
          {typeof target === 'number' ? `Target ${target}` : target}
        </span>
        {trend && (
          <span className="trend">
            {trendIcon[trend]} {trend === 'up' ? '+' : '-'}3.2pp
          </span>
        )}
      </div>
    </div>
  );
}
```

### Health Distribution Chart

```tsx
export function HealthDistribution({ accounts }: { accounts: Account[] }) {
  const distribution = {
    thriving: accounts.filter(a => a.account.health_score >= 91).length,
    healthy: accounts.filter(a => a.account.health_score >= 76 && a.account.health_score < 91).length,
    stable: accounts.filter(a => a.account.health_score >= 61 && a.account.health_score < 76).length,
    atRisk: accounts.filter(a => a.account.health_score >= 46 && a.account.health_score < 61).length,
    critical: accounts.filter(a => a.account.health_score < 46).length
  };
  
  const totalAccounts = accounts.length;
  
  return (
    <div className="health-distribution">
      <h3>Portfolio Health Distribution</h3>
      <table>
        <thead>
          <tr>
            <th>Health Category</th>
            <th>Accounts</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="thriving">
            <td>Thriving (91-100)</td>
            <td>{distribution.thriving}</td>
            <td>{((distribution.thriving / totalAccounts) * 100).toFixed(1)}%</td>
            <td>✓</td>
          </tr>
          <tr className="healthy">
            <td>Healthy (76-90)</td>
            <td>{distribution.healthy}</td>
            <td>{((distribution.healthy / totalAccounts) * 100).toFixed(1)}%</td>
            <td>✓</td>
          </tr>
          <tr className="stable">
            <td>Stable (61-75)</td>
            <td>{distribution.stable}</td>
            <td>{((distribution.stable / totalAccounts) * 100).toFixed(1)}%</td>
            <td>~</td>
          </tr>
          <tr className="at-risk">
            <td>At Risk (46-60)</td>
            <td>{distribution.atRisk}</td>
            <td>{((distribution.atRisk / totalAccounts) * 100).toFixed(1)}%</td>
            <td>⚠</td>
          </tr>
          <tr className="critical">
            <td>Critical (0-45)</td>
            <td>{distribution.critical}</td>
            <td>{((distribution.critical / totalAccounts) * 100).toFixed(1)}%</td>
            <td>🔴</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🔍 TESTING CHECKLIST

### Data Validation
- [ ] All JSON files load correctly
- [ ] No null/undefined values in critical fields
- [ ] Date formats are consistent
- [ ] Numeric calculations are accurate

### KPI Calculations
- [ ] GRR matches manual calculation
- [ ] Portfolio Health Score within expected range (0-100)
- [ ] At-Risk ARR correctly filters health_score < 60
- [ ] Renewal Rate percentages add up to 100%
- [ ] Churn Rate matches revenue_movements data

### UI/UX
- [ ] All 10 KPI tiles display correctly
- [ ] Trend indicators show correct direction
- [ ] Target badges display properly
- [ ] Drill-down navigation works
- [ ] Exception reports load < 2 seconds

### Business Logic
- [ ] Health categories match .md file definitions
- [ ] Renewal pipeline shows correct time buckets
- [ ] Critical actions prioritize correctly
- [ ] Data refreshes on schedule

---

## 📈 PERFORMANCE OPTIMIZATION

### Data Loading Strategies

```typescript
// Option 1: Load all data at once (for prototype)
const data = {
  accounts: await import('./source_data/accounts.json'),
  subscriptions: await import('./source_data/commercial_operations/subscriptions.json'),
  licenses: await import('./source_data/commercial_operations/licenses.json'),
  // ...
};

// Option 2: Lazy load on demand (for production)
const loadAccounts = () => import('./source_data/accounts.json');
const loadSubscriptions = () => import('./source_data/commercial_operations/subscriptions.json');

// Option 3: API endpoints (for real-time)
const fetchKPIs = async () => {
  const response = await fetch('/api/csm/kpis');
  return response.json();
};
```

### Caching Strategy

```typescript
// Cache KPI calculations
const KPI_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCachedKPI(key: string, calculator: () => any) {
  const cached = KPI_CACHE.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }
  
  const value = calculator();
  KPI_CACHE.set(key, { value, timestamp: Date.now() });
  
  return value;
}

// Usage
const grr = getCachedKPI('grr', () => calculateGRR(subscriptions, revenue_movements));
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Launch
- [ ] All 10 Level 1 KPIs implemented
- [ ] 4 Level 2 views functional
- [ ] 4 Level 3 exception reports working
- [ ] Drill-down navigation tested
- [ ] Mobile responsive design verified
- [ ] Cross-browser compatibility checked

### Data Pipeline
- [ ] JSON files accessible
- [ ] Calculation functions tested
- [ ] Error handling implemented
- [ ] Logging configured

### Documentation
- [ ] User guide created
- [ ] KPI definitions documented
- [ ] Data dictionary published
- [ ] Training materials prepared

### Go-Live
- [ ] Pilot user group identified (5-10 CSMs)
- [ ] Feedback mechanism established
- [ ] Support process defined
- [ ] Rollout plan finalized

---

## 📚 RESOURCES

### Key Documents
- `main _CSMDashboards file to referes.md` - Complete dashboard design
- `CSM_KPI_MAPPING_ANALYSIS.md` - Detailed KPI mapping
- `/KPI Query (1)/` - SQL query templates

### Data Files
- `/src/source_data/accounts.json` - Main account data
- `/src/source_data/commercial_operations/` - Financial data
- `/src/source_data/csm-data/` - CSM-specific data

### External References
- Dashboard Design Document Section 5.2: Level 1 KPIs
- Dashboard Design Document Section 5.3: Level 2 Views
- Dashboard Design Document Section 5.4: Level 3 Actions

---

**Implementation Timeline:** 8 weeks  
**Priority:** High  
**Owner:** Customer Success Analytics Team  
**Status:** Ready to Begin

---

*Last Updated: October 10, 2025*

