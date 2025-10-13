# Customer Success Manager (CSM) KPI Mapping & Data Source Analysis

**Document Purpose:** Map the 10 primary CSM KPIs from the main dashboard design document to:
1. KPI Query SQL files
2. Synthetic data sources in `/src/source_data/`
3. Required data transformations

**Reference Document:** `main _CSMDashboards file to referes.md` - Section 5 (Persona 3: Customer Success Leader)

---

## Executive Summary

This document provides a comprehensive mapping for implementing the **Customer Success Portfolio Dashboard** (Level 1 - Strategic View) with its 10 primary KPIs using the available synthetic data and SQL query templates.

### Dashboard Hierarchy
- **Level 1 (Strategic):** 10 KPI tiles with trends and targets
- **Level 2 (Tactical):** Health decomposition, adoption trends, churn analysis, journey stages  
- **Level 3 (Operational):** Exception reports, at-risk accounts, usage anomalies, overdue activities

---

## PRIMARY CSM KPIs - LEVEL 1 STRATEGIC VIEW

### KPI 1: Gross Revenue Retention (GRR)

**Definition:** % of ARR retained (excluding expansions)  
**Target:** ≥ 95%  
**Calculation:** `(Starting ARR + Churn + Contraction) / Starting ARR × 100`

#### Data Sources
```
✓ KPI Query File: /KPI Query (1)/Gross Revenue Retention.txt
✓ Synthetic Data:
  - /source_data/commercial_operations/subscriptions.json
  - /source_data/commercial_operations/revenue_movements.json
  - /source_data/accounts.json
```

#### SQL Calculation Logic
```sql
-- Level 1: Company-Wide GRR
WITH cohort_base AS (
    SELECT 
        SUM(arr) AS starting_arr
    FROM subscriptions
    WHERE subscription_start_date <= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
        AND (subscription_end_date IS NULL OR 
             subscription_end_date > DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year')
),
cohort_losses AS (
    SELECT 
        SUM(CASE WHEN movement_type = 'churn' THEN arr_change ELSE 0 END) AS churn_arr,
        SUM(CASE WHEN movement_type = 'contraction' THEN arr_change ELSE 0 END) AS contraction_arr
    FROM revenue_movements
    WHERE effective_date BETWEEN DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year' 
        AND DATE_TRUNC('year', CURRENT_DATE)
)
SELECT 
    cb.starting_arr,
    cl.churn_arr,
    cl.contraction_arr,
    (cb.starting_arr + cl.churn_arr + cl.contraction_arr) AS retained_arr,
    ((cb.starting_arr + cl.churn_arr + cl.contraction_arr) * 100.0 / cb.starting_arr) AS grr_pct
FROM cohort_base cb, cohort_losses cl;
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `subscription_start_date` | subscriptions.json | `$.subscription_start_date` |
| `subscription_end_date` | subscriptions.json | `$.subscription_end_date` |
| `arr` | subscriptions.json | `$.arr` |
| `movement_type` | revenue_movements.json | `$.movement_type` |
| `arr_change` | revenue_movements.json | `$.arr_change` |
| `effective_date` | revenue_movements.json | `$.effective_date` |

---

### KPI 2: Portfolio Health Score

**Definition:** Weighted average health score across accounts  
**Target:** ≥ 75  
**Calculation:** `SUM(health_score × arr) / SUM(arr)`

#### Data Sources
```
✓ KPI Query File: /KPI Query (1)/Portfolio Health Score.txt
✓ Synthetic Data:
  - /source_data/accounts.json (health_score field)
  - /source_data/commercial_operations/licenses.json (utilization)
  - /source_data/csm-data/qbr_tracking.json (engagement)
  - Support tickets data (if available)
```

#### SQL Calculation Logic
```sql
-- Level 1: Weighted Portfolio Health
WITH account_health AS (
    SELECT 
        a.id AS customer_id,
        a.name AS customer_name,
        a.arr,
        a.health_score  -- Pre-calculated in accounts.json
    FROM accounts a
    WHERE a.status = 'Active'
)
SELECT 
    SUM(health_score * arr) / SUM(arr) AS weighted_portfolio_health,
    AVG(health_score) AS avg_health_score,
    COUNT(*) AS total_accounts,
    SUM(arr) AS total_arr
FROM account_health;
```

#### Health Score Components (From .md file Section 5.3)
| Component | Weight | Data Source |
|-----------|--------|-------------|
| Usage Health | 40% | `licenses.json` → `utilization` field |
| Engagement Health | 30% | QBR frequency, touchpoints |
| Support Health | 20% | Ticket count, severity |
| Business Outcome | 10% | Value realization metrics |

**Note:** The `accounts.json` already contains pre-calculated `health_score` field (0-100 scale), so this can be used directly for Level 1. For Level 2 decomposition, you'll need to recalculate using component sources.

---

### KPI 3: At-Risk ARR

**Definition:** Total ARR from accounts with health score < 60  
**Target:** Minimize  
**Calculation:** `SUM(arr WHERE health_score < 60)`

#### Data Sources
```
✓ KPI Query File: None (simple aggregation)
✓ Synthetic Data:
  - /source_data/accounts.json
  - /source_data/csm-data/churn_predictions.json (for risk segmentation)
```

#### SQL Calculation Logic
```sql
SELECT 
    COUNT(*) AS at_risk_account_count,
    SUM(arr) AS at_risk_arr,
    SUM(arr) * 100.0 / (SELECT SUM(arr) FROM accounts WHERE status = 'Active') AS pct_of_total_arr
FROM accounts
WHERE status = 'Active'
    AND health_score < 60;
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `id` | accounts.json | `$.account.id` |
| `name` | accounts.json | `$.account.name` |
| `health_score` | accounts.json | `$.account.health_score` |
| `arr` | accounts.json | `$.account.arr` |
| `tier` | accounts.json | `$.account.tier` |

---

### KPI 4: Renewal Rate

**Definition:** % of contracts renewed (by count and $)  
**Target:** ≥ 92%  
**Calculation:** `Renewed contracts / Total renewals due × 100`

#### Data Sources
```
✓ KPI Query File: /KPI Query (1)/Renewal Quote Velocity.txt (related)
✓ Synthetic Data:
  - /source_data/commercial_operations/subscriptions.json
  - /source_data/commercial_operations/quotes.json (renewal quotes)
```

#### SQL Calculation Logic
```sql
-- Renewal Rate by Count
WITH renewal_cohort AS (
    SELECT 
        subscription_id,
        customer_id,
        renewal_status,
        renewal_date,
        arr
    FROM subscriptions
    WHERE renewal_date BETWEEN DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '1 quarter'
        AND DATE_TRUNC('quarter', CURRENT_DATE)
)
SELECT 
    COUNT(*) AS total_renewals_due,
    COUNT(CASE WHEN renewal_status = 'renewed' THEN 1 END) AS renewals_completed,
    COUNT(CASE WHEN renewal_status = 'renewed' THEN 1 END) * 100.0 / COUNT(*) AS renewal_rate_by_count,
    SUM(arr) AS total_renewal_arr,
    SUM(CASE WHEN renewal_status = 'renewed' THEN arr ELSE 0 END) AS renewed_arr,
    SUM(CASE WHEN renewal_status = 'renewed' THEN arr ELSE 0 END) * 100.0 / SUM(arr) AS renewal_rate_by_arr
FROM renewal_cohort;
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `subscription_id` | subscriptions.json | `$.subscription_id` |
| `renewal_date` | subscriptions.json | `$.renewal_date` |
| `renewal_status` | subscriptions.json | `$.renewal_status` |
| `arr` | subscriptions.json | `$.arr` |
| `customer_id` | subscriptions.json | `$.customer_id` |

---

### KPI 5: Churn Rate

**Definition:** % of ARR lost to non-renewals  
**Target:** ≤ 5%  
**Calculation:** `Churned ARR / Total ARR × 100`

#### Data Sources
```
✓ KPI Query File: /KPI Query (1)/churn rate.txt
✓ Synthetic Data:
  - /source_data/commercial_operations/revenue_movements.json
  - /source_data/csm-data/churn_predictions.json
```

#### SQL Calculation Logic
```sql
WITH churn_metrics AS (
    SELECT 
        DATE_TRUNC('month', effective_date) AS month,
        SUM(CASE WHEN movement_type = 'churn' THEN ABS(arr_change) ELSE 0 END) AS churned_arr
    FROM revenue_movements
    WHERE fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
        AND fiscal_quarter = 'Q' || EXTRACT(QUARTER FROM CURRENT_DATE)
),
total_arr AS (
    SELECT SUM(arr) AS starting_arr
    FROM subscriptions
    WHERE subscription_status = 'active'
)
SELECT 
    cm.month,
    cm.churned_arr,
    ta.starting_arr,
    (cm.churned_arr * 100.0 / ta.starting_arr) AS churn_rate_pct
FROM churn_metrics cm, total_arr ta
ORDER BY cm.month DESC;
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `movement_type` | revenue_movements.json | `$.movement_type` |
| `arr_change` | revenue_movements.json | `$.arr_change` |
| `effective_date` | revenue_movements.json | `$.effective_date` |
| `reason_code` | revenue_movements.json | `$.reason_code` |

---

### KPI 6: Average Utilization Rate

**Definition:** Average % of licenses actively used  
**Target:** ≥ 75%  
**Calculation:** `AVG(licenses_used / total_licenses) × 100`

#### Data Sources
```
✓ KPI Query File: /KPI Query (1)/License Utilization Rate.txt
✓ Synthetic Data:
  - /source_data/commercial_operations/licenses.json
  - /source_data/commercial_operations/utilization_history.json
  - /source_data/commercial_operations/utilization_alerts.json
```

#### SQL Calculation Logic
```sql
SELECT 
    AVG(utilization) AS avg_utilization_rate,
    COUNT(*) AS total_licenses,
    COUNT(CASE WHEN utilization >= 75 THEN 1 END) AS licenses_above_target,
    COUNT(CASE WHEN utilization >= 90 THEN 1 END) AS high_utilization_expansion_ready,
    COUNT(CASE WHEN utilization < 50 THEN 1 END) AS low_utilization_at_risk
FROM licenses
WHERE customer_id IN (SELECT id FROM accounts WHERE status = 'Active');

-- By Product Family
SELECT 
    product_family,
    AVG(utilization) AS avg_utilization,
    COUNT(DISTINCT customer_id) AS customer_count,
    COUNT(*) AS license_count
FROM licenses
WHERE customer_id IN (SELECT id FROM accounts WHERE status = 'Active')
GROUP BY product_family
ORDER BY avg_utilization DESC;
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `license_id` | licenses.json | `$.license_id` |
| `customer_id` | licenses.json | `$.customer_id` |
| `product_family` | licenses.json | `$.product_family` |
| `license_count` | licenses.json | `$.license_count` |
| `utilization` | licenses.json | `$.utilization` (0-100 scale) |
| `utilization_trend` | licenses.json | `$.utilization_trend` |

---

### KPI 7: Feature Adoption Rate

**Definition:** % of customers using advanced features  
**Target:** ≥ 60%  
**Calculation:** `Customers with advanced features / Total customers × 100`

#### Data Sources
```
✓ KPI Query File: None (custom calculation)
✓ Synthetic Data:
  - /source_data/licenses.json (adoption_stage field)
  - /source_data/usage-events/ (45 JSON files with telemetry data)
  - /source_data/csm-data/multi_product_readiness.json
```

#### SQL Calculation Logic
```sql
-- Using adoption_stage from licenses
WITH customer_adoption AS (
    SELECT 
        customer_id,
        COUNT(*) AS total_products,
        COUNT(CASE WHEN adoption_stage IN ('Mature', 'Optimized') THEN 1 END) AS advanced_adoption_count
    FROM licenses
    WHERE customer_id IN (SELECT id FROM accounts WHERE status = 'Active')
    GROUP BY customer_id
)
SELECT 
    COUNT(*) AS total_customers,
    COUNT(CASE WHEN advanced_adoption_count > 0 THEN 1 END) AS customers_with_advanced_features,
    COUNT(CASE WHEN advanced_adoption_count > 0 THEN 1 END) * 100.0 / COUNT(*) AS feature_adoption_rate_pct
FROM customer_adoption;
```

#### Adoption Stages (from licenses.json)
- **Initial:** Basic implementation
- **Developing:** Growing usage
- **Mature:** Advanced features adopted ✓
- **Optimized:** Full platform utilization ✓

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `adoption_stage` | licenses.json | `$.adoption_stage` |
| `customer_id` | licenses.json | `$.customer_id` |
| `product_family` | licenses.json | `$.product_family` |

---

### KPI 8: Customer Engagement Score

**Definition:** Composite of touch frequency + QBR + NPS  
**Target:** ≥ 70  
**Calculation:** Weighted composite (touch 40%, QBR 30%, NPS 30%)

#### Data Sources
```
✓ KPI Query File: None (composite metric)
✓ Synthetic Data:
  - /source_data/csm-data/qbr_tracking.json
  - /source_data/accounts.json (engagement events in timeline)
  - NPS data (if available in usage-events)
```

#### SQL Calculation Logic
```sql
WITH engagement_metrics AS (
    SELECT 
        a.id AS customer_id,
        a.name AS customer_name,
        -- Touch Frequency Score (40%)
        CASE 
            WHEN DATEDIFF(day, a.last_touch_date, CURRENT_DATE) <= 30 THEN 90
            WHEN DATEDIFF(day, a.last_touch_date, CURRENT_DATE) <= 60 THEN 70
            WHEN DATEDIFF(day, a.last_touch_date, CURRENT_DATE) <= 90 THEN 50
            ELSE 30
        END * 0.40 AS touch_score_weighted,
        
        -- QBR Score (30%)
        CASE 
            WHEN qbr.days_since_last_qbr <= 90 THEN 95
            WHEN qbr.days_since_last_qbr <= 120 THEN 75
            WHEN qbr.days_since_last_qbr <= 180 THEN 55
            ELSE 35
        END * 0.30 AS qbr_score_weighted,
        
        -- NPS Score (30%) - placeholder, needs actual NPS data
        75 * 0.30 AS nps_score_weighted
        
    FROM accounts a
    LEFT JOIN (
        SELECT 
            account_id,
            DATEDIFF(day, MAX(qbr_date), CURRENT_DATE) AS days_since_last_qbr
        FROM qbr_tracking
        GROUP BY account_id
    ) qbr ON a.id = qbr.account_id
    WHERE a.status = 'Active'
)
SELECT 
    customer_id,
    customer_name,
    (touch_score_weighted + qbr_score_weighted + nps_score_weighted) AS engagement_score,
    AVG(touch_score_weighted + qbr_score_weighted + nps_score_weighted) OVER () AS avg_engagement_score
FROM engagement_metrics;
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `last_touch_date` | accounts.json | `$.account.last_touch_date` or timeline events |
| `qbr_date` | qbr_tracking.json | `$.qbr_date` |
| `account_id` | qbr_tracking.json | `$.account_id` |
| `qbr_status` | qbr_tracking.json | `$.qbr_status` |

---

### KPI 9: Time to Value (TTV)

**Definition:** Days from purchase to productive use  
**Target:** ≤ 60 days  
**Calculation:** `Days between subscription_start and first_value_milestone`

#### Data Sources
```
✓ KPI Query File: None (custom calculation)
✓ Synthetic Data:
  - /source_data/commercial_operations/subscriptions.json
  - /source_data/accounts.json (timeline with business_events)
  - /source_data/licenses.json (implementation_date)
```

#### SQL Calculation Logic
```sql
WITH ttv_metrics AS (
    SELECT 
        s.customer_id,
        s.subscription_id,
        s.product_family,
        s.subscription_start_date,
        l.implementation_date,
        DATEDIFF(day, s.subscription_start_date, l.implementation_date) AS days_to_value,
        CASE 
            WHEN DATEDIFF(day, s.subscription_start_date, l.implementation_date) <= 60 THEN 'On Target'
            WHEN DATEDIFF(day, s.subscription_start_date, l.implementation_date) <= 90 THEN 'Delayed'
            ELSE 'At Risk'
        END AS ttv_status
    FROM subscriptions s
    JOIN licenses l ON s.license_id = l.license_id
    WHERE s.subscription_type = 'new'
        AND s.subscription_start_date >= CURRENT_DATE - INTERVAL '12 months'
)
SELECT 
    AVG(days_to_value) AS avg_ttv_days,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_value) AS median_ttv_days,
    COUNT(CASE WHEN ttv_status = 'On Target' THEN 1 END) * 100.0 / COUNT(*) AS pct_meeting_target,
    product_family,
    AVG(days_to_value) AS avg_ttv_by_product
FROM ttv_metrics
GROUP BY ROLLUP(product_family);
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `subscription_start_date` | subscriptions.json | `$.subscription_start_date` |
| `implementation_date` | licenses.json | `$.implementation_date` |
| `product_family` | subscriptions.json | `$.product_family` |

---

### KPI 10: QBR Completion Rate

**Definition:** % of accounts with QBR in last 120 days  
**Target:** ≥ 85%  
**Calculation:** `Accounts with recent QBR / Total active accounts × 100`

#### Data Sources
```
✓ KPI Query File: None (simple aggregation)
✓ Synthetic Data:
  - /source_data/csm-data/qbr_tracking.json
  - /source_data/accounts.json
```

#### SQL Calculation Logic
```sql
WITH qbr_status AS (
    SELECT 
        a.id AS customer_id,
        a.name AS customer_name,
        a.tier,
        a.arr,
        qbr.qbr_date AS last_qbr_date,
        DATEDIFF(day, qbr.qbr_date, CURRENT_DATE) AS days_since_qbr,
        CASE 
            WHEN qbr.qbr_date >= CURRENT_DATE - INTERVAL '120 days' THEN 1
            ELSE 0
        END AS qbr_compliant
    FROM accounts a
    LEFT JOIN (
        SELECT 
            account_id,
            MAX(qbr_date) AS qbr_date
        FROM qbr_tracking
        GROUP BY account_id
    ) qbr ON a.id = qbr.account_id
    WHERE a.status = 'Active'
)
SELECT 
    COUNT(*) AS total_accounts,
    SUM(qbr_compliant) AS accounts_with_recent_qbr,
    SUM(qbr_compliant) * 100.0 / COUNT(*) AS qbr_completion_rate_pct,
    COUNT(CASE WHEN qbr_compliant = 0 THEN 1 END) AS overdue_qbrs
FROM qbr_status;

-- Segmentation by Tier
SELECT 
    tier,
    COUNT(*) AS total_accounts,
    SUM(qbr_compliant) AS compliant_accounts,
    SUM(qbr_compliant) * 100.0 / COUNT(*) AS qbr_completion_rate_pct
FROM qbr_status
GROUP BY tier
ORDER BY qbr_completion_rate_pct DESC;
```

#### Data Fields Required
| Field | Source Table | JSON Path |
|-------|--------------|-----------|
| `account_id` | qbr_tracking.json | `$.account_id` |
| `qbr_date` | qbr_tracking.json | `$.qbr_date` |
| `qbr_status` | qbr_tracking.json | `$.qbr_status` |
| `qbr_type` | qbr_tracking.json | `$.qbr_type` |

---

## LEVEL 2 - TACTICAL / ANALYTICAL VIEW

### View 1: Health Score Decomposition

**Purpose:** Break down Portfolio Health Score into its 4 components

#### Required Calculations

```sql
WITH account_health AS (
    SELECT 
        a.id AS customer_id,
        a.name AS customer_name,
        a.arr,
        
        -- Usage Health (40%)
        AVG(l.utilization) AS usage_score,
        AVG(l.utilization) * 0.40 AS usage_weighted,
        
        -- Engagement Health (30%)
        CASE 
            WHEN qbr.days_since_qbr <= 90 THEN 90
            WHEN qbr.days_since_qbr <= 120 THEN 75
            ELSE 50
        END AS engagement_score,
        CASE 
            WHEN qbr.days_since_qbr <= 90 THEN 90
            WHEN qbr.days_since_qbr <= 120 THEN 75
            ELSE 50
        END * 0.30 AS engagement_weighted,
        
        -- Support Health (20%) - placeholder
        80 AS support_score,
        80 * 0.20 AS support_weighted,
        
        -- Business Outcome Health (10%) - placeholder
        75 AS outcome_score,
        75 * 0.10 AS outcome_weighted,
        
        -- Total
        (AVG(l.utilization) * 0.40 + 
         (CASE 
            WHEN qbr.days_since_qbr <= 90 THEN 90
            WHEN qbr.days_since_qbr <= 120 THEN 75
            ELSE 50
        END * 0.30) +
         (80 * 0.20) +
         (75 * 0.10)) AS calculated_health_score
        
    FROM accounts a
    LEFT JOIN licenses l ON a.id = l.customer_id
    LEFT JOIN (
        SELECT 
            account_id,
            DATEDIFF(day, MAX(qbr_date), CURRENT_DATE) AS days_since_qbr
        FROM qbr_tracking
        GROUP BY account_id
    ) qbr ON a.id = qbr.account_id
    WHERE a.status = 'Active'
    GROUP BY a.id, a.name, a.arr, qbr.days_since_qbr
)
SELECT 
    -- Portfolio-level averages
    AVG(usage_score) AS avg_usage_health,
    AVG(engagement_score) AS avg_engagement_health,
    AVG(support_score) AS avg_support_health,
    AVG(outcome_score) AS avg_outcome_health,
    AVG(calculated_health_score) AS portfolio_health_score,
    
    -- Weighted by ARR
    SUM(usage_weighted * arr) / SUM(arr) AS weighted_usage_contribution,
    SUM(engagement_weighted * arr) / SUM(arr) AS weighted_engagement_contribution,
    SUM(support_weighted * arr) / SUM(arr) AS weighted_support_contribution,
    SUM(outcome_weighted * arr) / SUM(arr) AS weighted_outcome_contribution
FROM account_health;
```

---

### View 2: Adoption & Utilization Trends

**Purpose:** Track product-level adoption and utilization over time

#### Data Sources
- `licenses.json` (current utilization)
- `utilization_history.json` (90-day trends)

```sql
SELECT 
    l.product_family,
    AVG(l.utilization) AS avg_utilization,
    COUNT(DISTINCT l.customer_id) AS customer_count,
    COUNT(CASE WHEN l.adoption_stage IN ('Mature', 'Optimized') THEN 1 END) * 100.0 / 
        COUNT(*) AS feature_adoption_pct,
    AVG(CASE 
        WHEN l.utilization_trend = 'increasing' THEN 1
        WHEN l.utilization_trend = 'stable' THEN 0
        WHEN l.utilization_trend = 'decreasing' THEN -1
    END) AS trend_score,
    COUNT(CASE WHEN a.health_score < 60 THEN 1 END) AS at_risk_accounts
FROM licenses l
JOIN accounts a ON l.customer_id = a.id
WHERE a.status = 'Active'
GROUP BY l.product_family
ORDER BY avg_utilization DESC;
```

---

### View 3: Churn Risk Analysis by Segment

**Purpose:** Identify churn risk distribution across tiers

#### Data Sources
- `churn_predictions.json`
- `accounts.json`

```sql
SELECT 
    a.tier,
    COUNT(*) AS total_accounts,
    SUM(a.arr) AS total_arr,
    SUM(CASE WHEN a.health_score < 60 THEN a.arr ELSE 0 END) AS at_risk_arr,
    SUM(CASE WHEN a.health_score < 60 THEN a.arr ELSE 0 END) * 100.0 / SUM(a.arr) AS risk_pct,
    AVG(cp.churn_probability) AS avg_churn_probability,
    
    -- Churn drivers
    COUNT(CASE WHEN a.health_score < 60 AND AVG(l.utilization) < 50 THEN 1 END) AS low_utilization_count,
    COUNT(CASE WHEN a.health_score < 60 AND qbr.days_overdue > 30 THEN 1 END) AS low_engagement_count
    
FROM accounts a
LEFT JOIN churn_predictions cp ON a.id = cp.account_id
LEFT JOIN licenses l ON a.id = l.customer_id
LEFT JOIN (
    SELECT account_id, 
           DATEDIFF(day, MAX(qbr_date), CURRENT_DATE) - 120 AS days_overdue
    FROM qbr_tracking
    GROUP BY account_id
) qbr ON a.id = qbr.account_id
WHERE a.status = 'Active'
GROUP BY a.tier
ORDER BY risk_pct DESC;
```

---

### View 4: Customer Journey Stage Analysis

**Purpose:** Track accounts by lifecycle stage

#### Journey Stages
1. **Implementation (0-30d):** New customers onboarding
2. **Stabilization (30-90d):** Initial usage patterns forming
3. **Optimization (90-180d):** Advanced feature adoption
4. **Maturity (180d+):** Expansion-ready accounts

```sql
WITH customer_tenure AS (
    SELECT 
        a.id AS customer_id,
        a.name AS customer_name,
        a.arr,
        a.health_score,
        MIN(s.subscription_start_date) AS first_subscription_date,
        DATEDIFF(day, MIN(s.subscription_start_date), CURRENT_DATE) AS days_as_customer,
        AVG(l.utilization) AS avg_utilization,
        CASE 
            WHEN DATEDIFF(day, MIN(s.subscription_start_date), CURRENT_DATE) <= 30 THEN 'Implementation (0-30d)'
            WHEN DATEDIFF(day, MIN(s.subscription_start_date), CURRENT_DATE) <= 90 THEN 'Stabilization (30-90d)'
            WHEN DATEDIFF(day, MIN(s.subscription_start_date), CURRENT_DATE) <= 180 THEN 'Optimization (90-180d)'
            ELSE 'Maturity (180d+)'
        END AS journey_stage
    FROM accounts a
    JOIN subscriptions s ON a.id = s.customer_id
    JOIN licenses l ON a.id = l.customer_id
    WHERE a.status = 'Active'
    GROUP BY a.id, a.name, a.arr, a.health_score
)
SELECT 
    journey_stage,
    COUNT(*) AS account_count,
    AVG(health_score) AS avg_health,
    AVG(avg_utilization) AS avg_utilization,
    AVG(days_as_customer) AS avg_days_in_stage,
    CASE 
        WHEN journey_stage = 'Implementation (0-30d)' THEN 'First value realization'
        WHEN journey_stage = 'Stabilization (30-90d)' THEN 'Feature adoption targets'
        WHEN journey_stage = 'Optimization (90-180d)' THEN 'Advanced features enabled'
        ELSE 'Expansion conversations'
    END AS next_milestone
FROM customer_tenure
GROUP BY journey_stage
ORDER BY AVG(days_as_customer);
```

---

## LEVEL 3 - OPERATIONAL / ACTIONABLE VIEW

### Exception Report 1: Critical Health Accounts

```sql
SELECT 
    a.id AS customer_id,
    a.name AS customer_name,
    a.health_score,
    a.arr,
    a.tier,
    a.csm_assigned,
    s.renewal_date,
    DATEDIFF(day, CURRENT_DATE, s.renewal_date) AS days_to_renewal,
    
    -- Primary Risk Factor
    CASE 
        WHEN AVG(l.utilization) < 50 THEN 'Low utilization (' || ROUND(AVG(l.utilization)) || '%)'
        WHEN qbr.days_overdue > 90 THEN 'No engagement (' || qbr.days_overdue || ' days)'
        WHEN support.ticket_count > 5 THEN 'Support escalations (' || support.ticket_count || ')'
        ELSE 'Multiple factors'
    END AS primary_risk_factor,
    
    -- Action Plan Status
    CASE 
        WHEN cp.mitigation_plan_status IS NOT NULL THEN cp.mitigation_plan_status
        ELSE 'No plan yet'
    END AS action_plan_status
    
FROM accounts a
LEFT JOIN subscriptions s ON a.id = s.customer_id
LEFT JOIN licenses l ON a.id = l.customer_id
LEFT JOIN (
    SELECT account_id, DATEDIFF(day, MAX(qbr_date), CURRENT_DATE) - 120 AS days_overdue
    FROM qbr_tracking
    GROUP BY account_id
) qbr ON a.id = qbr.account_id
LEFT JOIN (
    SELECT customer_id, COUNT(*) AS ticket_count
    FROM support_tickets  -- If available
    WHERE status = 'Open'
    GROUP BY customer_id
) support ON a.id = support.customer_id
LEFT JOIN churn_predictions cp ON a.id = cp.account_id
WHERE a.status = 'Active'
    AND a.health_score < 45  -- Critical threshold
ORDER BY a.health_score ASC, s.renewal_date ASC
LIMIT 20;
```

---

### Exception Report 2: Overdue Success Activities

```sql
-- QBRs Overdue
SELECT 
    'QBR' AS activity_type,
    a.id AS account_id,
    a.name AS account_name,
    DATEDIFF(day, MAX(qbr.qbr_date), CURRENT_DATE) - 120 AS days_overdue,
    'High' AS priority,
    CASE 
        WHEN a.health_score < 60 THEN 'Health declining'
        WHEN s.renewal_date < CURRENT_DATE + INTERVAL '90 days' THEN 'Renewal approaching'
        ELSE 'Routine check-in'
    END AS impact,
    a.csm_assigned AS csm,
    'Schedule immediately' AS action_needed
FROM accounts a
LEFT JOIN qbr_tracking qbr ON a.id = qbr.account_id
LEFT JOIN subscriptions s ON a.id = s.customer_id
WHERE a.status = 'Active'
    AND (MAX(qbr.qbr_date) < CURRENT_DATE - INTERVAL '120 days' OR qbr.qbr_date IS NULL)
GROUP BY a.id, a.name, a.health_score, s.renewal_date, a.csm_assigned
HAVING DATEDIFF(day, MAX(qbr.qbr_date), CURRENT_DATE) > 120
ORDER BY days_overdue DESC;
```

---

### Exception Report 3: At-Risk Renewals (Next 90 Days)

```sql
SELECT 
    a.id AS customer_id,
    a.name AS account_name,
    s.renewal_date,
    a.arr,
    CASE 
        WHEN a.health_score >= 70 AND a.renewal_risk_score < 40 THEN 'High'
        WHEN a.health_score >= 60 AND a.renewal_risk_score < 60 THEN 'Medium'
        ELSE 'Low'
    END AS renewal_confidence,
    
    -- Risk Factors
    CONCAT_WS(', ',
        CASE WHEN a.health_score < 60 THEN 'Health ' || a.health_score END,
        CASE WHEN AVG(l.utilization) < 60 THEN 'Util ' || ROUND(AVG(l.utilization)) || '%' END,
        CASE WHEN champion.status = 'departed' THEN 'No champion' END
    ) AS risk_factors,
    
    a.csm_assigned AS csm,
    
    -- Mitigation Plan
    CASE 
        WHEN a.health_score < 50 THEN 'Exec engagement + value audit'
        WHEN AVG(l.utilization) < 50 THEN 'Feature roadmap review + training'
        WHEN qbr.days_overdue > 60 THEN 'Value realization workshop'
        ELSE 'Standard renewal process'
    END AS mitigation_plan
    
FROM accounts a
JOIN subscriptions s ON a.id = s.customer_id
LEFT JOIN licenses l ON a.id = l.customer_id
LEFT JOIN (
    SELECT account_id, status
    FROM champion_departure_alerts  -- From csm-data folder
    WHERE status = 'departed'
) champion ON a.id = champion.account_id
LEFT JOIN (
    SELECT account_id, DATEDIFF(day, MAX(qbr_date), CURRENT_DATE) AS days_overdue
    FROM qbr_tracking
    GROUP BY account_id
) qbr ON a.id = qbr.account_id
WHERE a.status = 'Active'
    AND s.renewal_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
    AND (a.health_score < 70 OR a.renewal_risk_score > 40)
GROUP BY a.id, a.name, s.renewal_date, a.arr, a.health_score, a.renewal_risk_score, 
         a.csm_assigned, champion.status, qbr.days_overdue
ORDER BY s.renewal_date ASC, a.health_score ASC;
```

---

### Exception Report 4: Usage Anomaly Alerts

**Data Source:** `utilization_alerts.json`

```sql
SELECT 
    ua.alert_id,
    a.id AS customer_id,
    a.name AS account_name,
    l.product_family AS product,
    ua.alert_type AS issue,
    ua.severity,
    DATEDIFF(day, ua.created_date, CURRENT_DATE) AS days_active,
    
    -- Recommended Action
    CASE 
        WHEN ua.severity = 'critical' AND DATEDIFF(day, ua.created_date, CURRENT_DATE) > 7 THEN 'Immediate outreach'
        WHEN ua.severity = 'high' THEN 'Check with champion'
        ELSE 'Training recommendation'
    END AS recommended_action,
    
    ua.current_value,
    ua.previous_value,
    ua.threshold_value
    
FROM utilization_alerts ua
JOIN licenses l ON ua.license_id = l.license_id
JOIN accounts a ON l.customer_id = a.id
WHERE ua.status = 'open'
    AND ua.created_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY 
    CASE ua.severity 
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END,
    ua.created_date DESC;
```

---

## DATA SOURCE SUMMARY TABLE

| KPI | Primary Data Source | Supporting Data | KPI Query File |
|-----|-------------------|-----------------|----------------|
| **GRR** | subscriptions.json, revenue_movements.json | accounts.json | Gross Revenue Retention.txt |
| **Portfolio Health Score** | accounts.json (health_score) | licenses.json, qbr_tracking.json | Portfolio Health Score.txt |
| **At-Risk ARR** | accounts.json (health_score, arr) | churn_predictions.json | None (simple query) |
| **Renewal Rate** | subscriptions.json (renewal_status) | quotes.json | Renewal Quote Velocity.txt |
| **Churn Rate** | revenue_movements.json | churn_predictions.json | churn rate.txt |
| **Avg Utilization Rate** | licenses.json (utilization) | utilization_history.json | License Utilization Rate.txt |
| **Feature Adoption Rate** | licenses.json (adoption_stage) | multi_product_readiness.json | None (custom) |
| **Engagement Score** | qbr_tracking.json | accounts.json (timeline) | None (composite) |
| **Time to Value** | subscriptions.json, licenses.json | None | None (custom) |
| **QBR Completion Rate** | qbr_tracking.json | accounts.json | None (simple query) |

---

## IMPLEMENTATION PRIORITY

### Phase 1: Foundation (Week 1-2)
1. ✅ **GRR** - Core retention metric
2. ✅ **Churn Rate** - Critical for CSM focus
3. ✅ **Portfolio Health Score** - Pre-calculated, easy to display
4. ✅ **At-Risk ARR** - Simple aggregation

### Phase 2: Engagement Metrics (Week 3-4)
5. ✅ **Renewal Rate** - Pipeline visibility
6. ✅ **Avg Utilization Rate** - Product adoption
7. ✅ **QBR Completion Rate** - Activity tracking

### Phase 3: Advanced Analytics (Week 5-6)
8. ✅ **Feature Adoption Rate** - Deeper product insights
9. ✅ **Customer Engagement Score** - Composite metric
10. ✅ **Time to Value** - Onboarding efficiency

### Phase 4: Operational Views (Week 7-8)
11. Exception reports
12. Drill-down paths
13. Action workflows

---

## NEXT STEPS

1. **Validate Data Completeness**
   - Check all JSON files for required fields
   - Identify any missing data elements
   - Create data quality report

2. **Build Data Transformation Layer**
   - Load JSON files into PostgreSQL/Snowflake
   - Create views matching SQL queries
   - Implement date dimension for time-series analysis

3. **Create Calculation Engine**
   - Implement KPI calculation functions
   - Schedule daily refresh jobs
   - Store results in `kpi_metrics` table

4. **Build Dashboard UI**
   - Level 1: 10 KPI tiles with trends
   - Level 2: Analytical views with segmentation
   - Level 3: Exception reports with actions

5. **Testing & Validation**
   - Cross-reference with .md file targets
   - Verify calculation accuracy
   - User acceptance testing with CSMs

---

## APPENDIX: Data Field Mapping Reference

### accounts.json Structure
```json
{
  "account": {
    "id": "CUST_000001",
    "name": "TechCorp Industries",
    "tier": "Enterprise",
    "arr": 1522871,
    "health_score": 31,
    "renewal_risk_score": 62,
    "csm_id": "CSM_001",
    "last_invoice_date": "2025-08-26",
    "last_payment_date": "2025-09-19"
  },
  "timeline": [
    {
      "month": 10,
      "health_score": 94,
      "usage_percentage": 92,
      "engagement_events": [...],
      "support_activity": {...}
    }
  ]
}
```

### subscriptions.json Structure
```json
{
  "subscription_id": "SUB_CUST_000001_Duo_1",
  "customer_id": "CUST_000001",
  "product_family": "Duo",
  "subscription_status": "active",
  "arr": 9585,
  "renewal_date": "2025-02-25",
  "renewal_status": "renewed",
  "renewal_probability": 79.09,
  "churn_risk_score": 60.21
}
```

### licenses.json Structure
```json
{
  "license_id": "LIC_CUST_000001_Duo",
  "customer_id": "CUST_000001",
  "product_family": "Duo",
  "license_count": 1065,
  "utilization": 95,
  "adoption_stage": "Mature",
  "implementation_date": "2023-12-05",
  "utilization_trend": "decreasing"
}
```

### revenue_movements.json Structure
```json
{
  "movement_id": "MOV_20241104_1",
  "customer_id": "CUST_000026",
  "movement_type": "expansion",  // or "churn", "contraction"
  "arr_change": 180.0,
  "effective_date": "2024-11-04",
  "reason_code": "customer_requested"
}
```

### qbr_tracking.json Structure
```json
{
  "qbr_id": "QBR_...",
  "account_id": "CUST_...",
  "qbr_date": "2025-06-15",
  "qbr_status": "completed",
  "qbr_type": "quarterly"
}
```

---

**Document Version:** 1.0  
**Last Updated:** October 10, 2025  
**Owner:** Customer Success Analytics Team  
**Status:** Ready for Implementation

