# Commercial Operations KPI Calculations & Table Relationships

## Overview
This document provides detailed formulas, SQL queries, and table relationships for calculating all 15 Commercial Operations KPIs.

---

## Table Relationships & Keys

### Primary Relationships

```
accounts (id) ──┬─→ subscriptions (customer_id)
                ├─→ quotes (customer_id)
                ├─→ orders (customer_id)
                ├─→ invoices (customer_id)
                ├─→ payments (customer_id)
                ├─→ amendments (customer_id)
                ├─→ revenue_movements (customer_id)
                ├─→ utilization_history (customer_id)
                └─→ utilization_alerts (customer_id)

licenses (license_id) ──┬─→ subscriptions (license_id)
                        ├─→ utilization_history (license_id)
                        └─→ utilization_alerts (license_id)

quotes (quote_id) ──┬─→ quote_line_items (quote_id)
                    ├─→ orders (quote_id)
                    └─→ quote_to_cash_tracking (quote_id)

orders (order_id) ──┬─→ invoices (order_id)
                    ├─→ amendments (order_id)
                    └─→ quote_to_cash_tracking (order_id)

invoices (invoice_id) ──┬─→ payments (invoice_id)
                        ├─→ revenue_recognition_schedule (invoice_id)
                        └─→ quote_to_cash_tracking (invoice_id)

subscriptions (subscription_id) ──┬─→ invoices (subscription_id)
                                   ├─→ amendments (subscription_id)
                                   ├─→ revenue_movements (subscription_id)
                                   └─→ revenue_recognition_schedule (subscription_id)
```

### Complete Join Paths

```sql
-- Full Quote-to-Cash Flow
SELECT *
FROM quotes q
  LEFT JOIN quote_line_items qli ON q.quote_id = qli.quote_id
  LEFT JOIN orders o ON q.order_id = o.order_id
  LEFT JOIN invoices i ON o.order_id = i.order_id
  LEFT JOIN payments p ON i.invoice_id = p.invoice_id
  LEFT JOIN quote_to_cash_tracking qtc ON q.quote_id = qtc.quote_id
WHERE q.customer_id = 'CUST_000001';

-- Customer Revenue View
SELECT
  a.id,
  a.name,
  a.arr,
  a.mrr,
  s.subscription_id,
  s.product_family,
  rm.movement_type,
  rm.arr_change
FROM accounts a
  LEFT JOIN subscriptions s ON a.id = s.customer_id
  LEFT JOIN revenue_movements rm ON s.subscription_id = rm.subscription_id
WHERE a.id = 'CUST_000001';

-- Utilization & Alerts View
SELECT
  a.id,
  a.name,
  l.product_family,
  uh.utilization_percentage,
  uh.utilization_trend,
  ua.alert_type,
  ua.alert_severity
FROM accounts a
  LEFT JOIN licenses l ON a.id = l.customer_id
  LEFT JOIN utilization_history uh ON l.license_id = uh.license_id
  LEFT JOIN utilization_alerts ua ON l.license_id = ua.license_id
WHERE a.id = 'CUST_000001';
```

---

## KPI Calculations

### 1. Net Revenue Retention (NRR)

**Definition**: Measures revenue retention and expansion from existing customers

**Formula**:
```
NRR = ((Starting ARR + Expansion ARR - Churn ARR - Contraction ARR) / Starting ARR) × 100
```

**SQL Implementation**:
```sql
SELECT
  fiscal_year,
  fiscal_quarter,
  ROUND(
    (SUM(starting_arr) +
     SUM(expansion_arr) -
     SUM(churn_arr) -
     SUM(contraction_arr)
    ) / NULLIF(SUM(starting_arr), 0) * 100,
    2
  ) AS nrr_percentage
FROM accounts
WHERE fiscal_quarter = '2025-Q1'
GROUP BY fiscal_year, fiscal_quarter;
```

**Alternative Using revenue_movements**:
```sql
WITH cohort AS (
  SELECT
    customer_id,
    SUM(CASE WHEN movement_type = 'new' THEN arr_change ELSE 0 END) AS starting_arr
  FROM revenue_movements
  WHERE effective_date BETWEEN '2024-01-01' AND '2024-12-31'
  GROUP BY customer_id
),
movements_2025 AS (
  SELECT
    customer_id,
    SUM(CASE WHEN movement_type = 'expansion' THEN arr_change ELSE 0 END) AS expansion_arr,
    SUM(CASE WHEN movement_type = 'churn' THEN ABS(arr_change) ELSE 0 END) AS churn_arr,
    SUM(CASE WHEN movement_type = 'contraction' THEN ABS(arr_change) ELSE 0 END) AS contraction_arr
  FROM revenue_movements
  WHERE fiscal_year = 2025 AND fiscal_quarter = 'Q1'
  GROUP BY customer_id
)
SELECT
  ROUND(
    (SUM(c.starting_arr) +
     SUM(m.expansion_arr) -
     SUM(m.churn_arr) -
     SUM(m.contraction_arr)
    ) / NULLIF(SUM(c.starting_arr), 0) * 100,
    2
  ) AS nrr_percentage
FROM cohort c
LEFT JOIN movements_2025 m ON c.customer_id = m.customer_id;
```

**Target**: 110-130% (SaaS industry standard)

**Data Sources**:
- `accounts`: starting_arr, expansion_arr, churn_arr, contraction_arr
- `revenue_movements`: movement_type, arr_change, fiscal_quarter

---

### 2. Annual Recurring Revenue (ARR)

**Definition**: Total annualized recurring revenue from subscriptions

**Formula**:
```
Total ARR = SUM(subscription.arr) WHERE subscription_status = 'active'
```

**SQL Implementation**:
```sql
-- Current ARR
SELECT
  SUM(arr) AS total_arr,
  COUNT(DISTINCT customer_id) AS active_customers,
  ROUND(SUM(arr) / COUNT(DISTINCT customer_id), 2) AS arr_per_customer
FROM subscriptions
WHERE subscription_status = 'active';

-- ARR by Product
SELECT
  product_family,
  SUM(arr) AS product_arr,
  COUNT(DISTINCT customer_id) AS customers,
  ROUND(AVG(arr), 2) AS avg_arr_per_customer
FROM subscriptions
WHERE subscription_status = 'active'
GROUP BY product_family
ORDER BY product_arr DESC;

-- ARR by Customer Tier
SELECT
  a.tier,
  SUM(s.arr) AS tier_arr,
  COUNT(DISTINCT s.customer_id) AS customer_count,
  ROUND(AVG(s.arr), 2) AS avg_arr
FROM subscriptions s
JOIN accounts a ON s.customer_id = a.id
WHERE s.subscription_status = 'active'
GROUP BY a.tier
ORDER BY tier_arr DESC;

-- ARR Growth (MoM, QoQ)
WITH monthly_arr AS (
  SELECT
    DATE_TRUNC('month', created_date) AS month,
    SUM(arr) AS total_arr
  FROM subscriptions
  WHERE subscription_status = 'active'
  GROUP BY DATE_TRUNC('month', created_date)
)
SELECT
  month,
  total_arr,
  LAG(total_arr) OVER (ORDER BY month) AS prior_month_arr,
  total_arr - LAG(total_arr) OVER (ORDER BY month) AS arr_change,
  ROUND(
    (total_arr - LAG(total_arr) OVER (ORDER BY month)) /
    NULLIF(LAG(total_arr) OVER (ORDER BY month), 0) * 100,
    2
  ) AS arr_growth_pct
FROM monthly_arr
ORDER BY month DESC;
```

**Data Sources**:
- `subscriptions`: arr, subscription_status, customer_id, product_family
- `accounts`: tier

---

### 3. Days Sales Outstanding (DSO)

**Definition**: Average days to collect payment after invoice

**Formula**:
```
DSO = (Accounts Receivable / Total Credit Sales) × Number of Days
```

**SQL Implementation**:
```sql
-- Overall DSO (Last 30 Days)
WITH period_data AS (
  SELECT
    SUM(amount_outstanding) AS ar_balance,
    SUM(total_amount) AS total_sales,
    30 AS days_in_period
  FROM invoices
  WHERE invoice_date >= CURRENT_DATE - INTERVAL '30 days'
    AND invoice_status IN ('issued', 'sent', 'partially_paid', 'overdue')
)
SELECT
  ROUND(
    (ar_balance / NULLIF(total_sales, 0)) * days_in_period,
    2
  ) AS dso_days
FROM period_data;

-- DSO by Customer
SELECT
  customer_id,
  AVG(days_outstanding) AS avg_dso,
  MAX(days_outstanding) AS max_dso,
  COUNT(*) AS invoice_count
FROM invoices
WHERE invoice_status IN ('issued', 'sent', 'partially_paid', 'overdue')
  AND amount_outstanding > 0
GROUP BY customer_id
HAVING AVG(days_outstanding) > 45  -- Flag customers exceeding target
ORDER BY avg_dso DESC;

-- DSO by Aging Bucket
SELECT
  aging_bucket,
  SUM(amount_outstanding) AS total_ar,
  COUNT(*) AS invoice_count,
  ROUND(SUM(amount_outstanding) / SUM(SUM(amount_outstanding)) OVER () * 100, 2) AS pct_of_total
FROM invoices
WHERE amount_outstanding > 0
GROUP BY aging_bucket
ORDER BY
  CASE aging_bucket
    WHEN 'current' THEN 1
    WHEN '31-60' THEN 2
    WHEN '61-90' THEN 3
    WHEN '90+' THEN 4
  END;

-- DSO Trend Analysis
WITH monthly_dso AS (
  SELECT
    DATE_TRUNC('month', invoice_date) AS month,
    SUM(amount_outstanding) AS ar_balance,
    SUM(total_amount) AS total_sales,
    EXTRACT(DAY FROM (DATE_TRUNC('month', invoice_date) + INTERVAL '1 month' - INTERVAL '1 day')) AS days_in_month
  FROM invoices
  WHERE invoice_date >= CURRENT_DATE - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', invoice_date)
)
SELECT
  month,
  ROUND((ar_balance / NULLIF(total_sales, 0)) * days_in_month, 2) AS dso_days,
  ar_balance,
  total_sales
FROM monthly_dso
ORDER BY month DESC;
```

**Target**: ≤30-45 days

**Data Sources**:
- `invoices`: amount_outstanding, total_amount, invoice_date, days_outstanding, aging_bucket
- `accounts_receivable` (view): total_ar_balance, avg_days_outstanding

---

### 4. Deferred Revenue Balance

**Definition**: Total unearned revenue for future delivery

**Formula**:
```
Deferred Revenue = Total Contract Value - Revenue Recognized to Date
```

**SQL Implementation**:
```sql
-- Current Deferred Revenue Balance
SELECT
  SUM(total_deferred_balance) AS total_deferred_revenue,
  COUNT(DISTINCT customer_id) AS customers_with_deferred,
  ROUND(AVG(total_deferred_balance), 2) AS avg_deferred_per_customer
FROM revenue_recognition_schedule
WHERE total_deferred_balance > 0;

-- Deferred Revenue by Product
SELECT
  s.product_family,
  SUM(rrs.total_deferred_balance) AS deferred_revenue,
  COUNT(DISTINCT rrs.customer_id) AS customer_count
FROM revenue_recognition_schedule rrs
JOIN subscriptions s ON rrs.subscription_id = s.subscription_id
WHERE rrs.total_deferred_balance > 0
GROUP BY s.product_family
ORDER BY deferred_revenue DESC;

-- Deferred Revenue Recognition Schedule (Next 12 Months)
SELECT
  DATE_TRUNC('month', period_date) AS recognition_month,
  SUM(expected_amount) AS expected_recognition,
  SUM(actual_amount) AS actual_recognition,
  SUM(expected_amount - actual_amount) AS variance
FROM revenue_recognition_schedule,
  jsonb_to_recordset(monthly_schedule::jsonb) AS
    x(period text, expected_amount numeric, actual_amount numeric, variance numeric),
  LATERAL (SELECT (period::text)::date AS period_date) pd
WHERE period_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', period_date)
ORDER BY recognition_month;

-- Deferred Revenue Roll-Forward
WITH current_period AS (
  SELECT
    SUM(total_deferred_balance) AS ending_balance
  FROM revenue_recognition_schedule
),
new_bookings AS (
  SELECT
    SUM(total_contract_value) AS new_deferred
  FROM revenue_recognition_schedule
  WHERE created_date >= DATE_TRUNC('quarter', CURRENT_DATE)
),
recognized AS (
  SELECT
    SUM(total_recognized_to_date) AS recognized_this_quarter
  FROM revenue_recognition_schedule
  WHERE revenue_recognition_date >= DATE_TRUNC('quarter', CURRENT_DATE)
)
SELECT
  (SELECT ending_balance FROM current_period) AS current_deferred_balance,
  (SELECT new_deferred FROM new_bookings) AS new_bookings_this_quarter,
  (SELECT recognized_this_quarter FROM recognized) AS revenue_recognized_this_quarter,
  ((SELECT ending_balance FROM current_period) +
   (SELECT new_deferred FROM new_bookings) -
   (SELECT recognized_this_quarter FROM recognized)) AS projected_ending_balance;
```

**Data Sources**:
- `revenue_recognition_schedule`: total_deferred_balance, total_contract_value, total_recognized_to_date
- `invoices`: deferred_revenue_amount
- `subscriptions`: arr

---

### 5. Quote-to-Cash Cycle Time

**Definition**: Average days from quote creation to payment received

**Formula**:
```
Quote-to-Cash Cycle Time = AVG(payment_received_date - quote_created_date)
```

**SQL Implementation**:
```sql
-- Overall Quote-to-Cash Cycle Time
SELECT
  ROUND(AVG(quote_to_cash_days), 2) AS avg_cycle_time_days,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY quote_to_cash_days), 2) AS median_cycle_time,
  MIN(quote_to_cash_days) AS fastest_cycle,
  MAX(quote_to_cash_days) AS slowest_cycle,
  COUNT(*) AS completed_transactions
FROM quote_to_cash_tracking
WHERE is_complete = true
  AND quote_created_date >= CURRENT_DATE - INTERVAL '90 days';

-- Cycle Time Breakdown by Stage
SELECT
  ROUND(AVG(quote_to_order_days), 2) AS avg_quote_to_order,
  ROUND(AVG(order_to_invoice_days), 2) AS avg_order_to_invoice,
  ROUND(AVG(invoice_to_payment_days), 2) AS avg_invoice_to_payment,
  ROUND(AVG(quote_to_cash_days), 2) AS avg_total_cycle
FROM quote_to_cash_tracking
WHERE is_complete = true
  AND quote_created_date >= CURRENT_DATE - INTERVAL '90 days';

-- Cycle Time by Quote Type
SELECT
  q.quote_type,
  COUNT(*) AS transaction_count,
  ROUND(AVG(qtc.quote_to_cash_days), 2) AS avg_cycle_time,
  SUM(CASE WHEN qtc.meets_sla THEN 1 ELSE 0 END) AS met_sla_count,
  ROUND(SUM(CASE WHEN qtc.meets_sla THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS sla_achievement_pct
FROM quote_to_cash_tracking qtc
JOIN quotes q ON qtc.quote_id = q.quote_id
WHERE qtc.is_complete = true
GROUP BY q.quote_type
ORDER BY avg_cycle_time;

-- Cycle Time Trend (Last 6 Months)
SELECT
  DATE_TRUNC('month', quote_created_date) AS month,
  COUNT(*) AS transactions,
  ROUND(AVG(quote_to_cash_days), 2) AS avg_cycle_time,
  ROUND(AVG(quote_to_order_days), 2) AS avg_quote_to_order,
  ROUND(AVG(order_to_invoice_days), 2) AS avg_order_to_invoice,
  ROUND(AVG(invoice_to_payment_days), 2) AS avg_invoice_to_payment
FROM quote_to_cash_tracking
WHERE is_complete = true
  AND quote_created_date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', quote_created_date)
ORDER BY month DESC;

-- SLA Compliance Analysis
SELECT
  CASE
    WHEN meets_sla THEN 'Met SLA'
    ELSE 'Missed SLA'
  END AS sla_status,
  COUNT(*) AS transaction_count,
  ROUND(AVG(quote_to_cash_days), 2) AS avg_actual_days,
  ROUND(AVG(target_cycle_days), 2) AS avg_target_days,
  ROUND(AVG(variance_from_target), 2) AS avg_variance_days
FROM quote_to_cash_tracking
WHERE is_complete = true
GROUP BY meets_sla;
```

**Target**: ≤45 days

**Data Sources**:
- `quote_to_cash_tracking`: All cycle time fields
- `quotes`: quote_type, quote_created_date
- `orders`: order_placed_date, order_fulfilled_date
- `invoices`: invoice_generated_date
- `payments`: payment_received_date

---

### 6. Renewal Rate (Gross Revenue Retention - GRR)

**Definition**: Revenue retained from existing customers (excluding expansion)

**Formula**:
```
GRR = ((Starting ARR - Churn ARR - Contraction ARR) / Starting ARR) × 100
```

**SQL Implementation**:
```sql
-- Overall GRR (Quarterly)
SELECT
  fiscal_year,
  fiscal_quarter,
  ROUND(
    (SUM(starting_arr) - SUM(churn_arr) - SUM(contraction_arr)) /
    NULLIF(SUM(starting_arr), 0) * 100,
    2
  ) AS grr_percentage,
  SUM(starting_arr) AS cohort_starting_arr,
  SUM(churn_arr) AS total_churn,
  SUM(contraction_arr) AS total_contraction
FROM accounts
WHERE fiscal_quarter = '2025-Q1'
GROUP BY fiscal_year, fiscal_quarter;

-- GRR by Customer Segment
SELECT
  a.tier,
  ROUND(
    (SUM(a.starting_arr) - SUM(a.churn_arr) - SUM(a.contraction_arr)) /
    NULLIF(SUM(a.starting_arr), 0) * 100,
    2
  ) AS grr_percentage,
  COUNT(DISTINCT a.id) AS customer_count
FROM accounts a
GROUP BY a.tier
ORDER BY grr_percentage DESC;

-- Renewal Rate by Product
WITH product_renewals AS (
  SELECT
    s.product_family,
    COUNT(DISTINCT CASE
      WHEN s.renewal_status = 'renewed'
        AND s.renewal_date >= CURRENT_DATE - INTERVAL '90 days'
      THEN s.customer_id
    END) AS renewed_customers,
    COUNT(DISTINCT CASE
      WHEN s.renewal_date >= CURRENT_DATE - INTERVAL '90 days'
      THEN s.customer_id
    END) AS total_up_for_renewal
  FROM subscriptions s
  GROUP BY s.product_family
)
SELECT
  product_family,
  renewed_customers,
  total_up_for_renewal,
  ROUND(renewed_customers / NULLIF(total_up_for_renewal, 0) * 100, 2) AS renewal_rate_pct
FROM product_renewals
ORDER BY renewal_rate_pct DESC;

-- Churn Analysis
SELECT
  DATE_TRUNC('month', effective_date) AS churn_month,
  COUNT(DISTINCT customer_id) AS churned_customers,
  SUM(ABS(arr_change)) AS churned_arr,
  STRING_AGG(DISTINCT reason_code, ', ') AS churn_reasons
FROM revenue_movements
WHERE movement_type = 'churn'
  AND effective_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', effective_date)
ORDER BY churn_month DESC;
```

**Target**: 90-95% (SaaS industry standard)

**Data Sources**:
- `accounts`: starting_arr, churn_arr, contraction_arr
- `subscriptions`: renewal_status, renewal_date
- `revenue_movements`: movement_type = 'churn' or 'contraction'

---

### 7. Revenue Recognition Accuracy

**Definition**: Variance between expected and actual recognized revenue

**Formula**:
```
Revenue Recognition Accuracy =
  (1 - (|Actual Revenue - Expected Revenue| / Expected Revenue)) × 100
```

**SQL Implementation**:
```sql
-- Overall Revenue Recognition Accuracy
SELECT
  COUNT(*) AS total_schedules,
  SUM(CASE WHEN is_accurate = true THEN 1 ELSE 0 END) AS accurate_schedules,
  ROUND(
    SUM(CASE WHEN is_accurate = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS accuracy_percentage,
  ROUND(AVG(ABS(variance_percentage)), 2) AS avg_variance_pct,
  SUM(ABS(total_variance)) AS total_variance_amount
FROM revenue_recognition_schedule;

-- Accuracy by Period
WITH monthly_accuracy AS (
  SELECT
    x.period,
    x.expected_amount,
    x.actual_amount,
    x.variance,
    ABS(x.variance) / NULLIF(x.expected_amount, 0) * 100 AS variance_pct
  FROM revenue_recognition_schedule,
    jsonb_to_recordset(monthly_schedule::jsonb) AS
      x(period text, expected_amount numeric, actual_amount numeric, variance numeric)
)
SELECT
  period,
  COUNT(*) AS schedules,
  ROUND(AVG(variance_pct), 2) AS avg_variance_pct,
  SUM(CASE WHEN variance_pct <= 1 THEN 1 ELSE 0 END) AS accurate_count,
  ROUND(
    SUM(CASE WHEN variance_pct <= 1 THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS accuracy_rate
FROM monthly_accuracy
GROUP BY period
ORDER BY period DESC
LIMIT 12;

-- Revenue Recognition Variance Details
SELECT
  rrs.customer_id,
  a.name,
  s.product_family,
  rrs.total_contract_value,
  rrs.total_recognized_to_date,
  rrs.total_deferred_balance,
  rrs.total_variance,
  rrs.variance_percentage,
  rrs.is_accurate
FROM revenue_recognition_schedule rrs
JOIN accounts a ON rrs.customer_id = a.id
JOIN subscriptions s ON rrs.subscription_id = s.subscription_id
WHERE rrs.is_accurate = false
ORDER BY ABS(rrs.total_variance) DESC;
```

**Target**: 99%+ accuracy (variance ≤1%)

**Data Sources**:
- `revenue_recognition_schedule`: monthly_schedule JSON, total_variance, variance_percentage, is_accurate
- `invoices`: revenue_recognized, revenue_recognition_date

---

### 8. Expansion ARR Contribution

**Definition**: Percentage of total ARR from upsells and cross-sells

**Formula**:
```
Expansion ARR Contribution = (Expansion ARR / Total ARR) × 100
```

**SQL Implementation**:
```sql
-- Overall Expansion Contribution
SELECT
  SUM(expansion_arr) AS total_expansion_arr,
  SUM(arr) AS total_arr,
  ROUND(SUM(expansion_arr) / NULLIF(SUM(arr), 0) * 100, 2) AS expansion_contribution_pct
FROM accounts;

-- Expansion by Customer Tier
SELECT
  tier,
  SUM(expansion_arr) AS expansion_arr,
  SUM(arr) AS total_arr,
  ROUND(SUM(expansion_arr) / NULLIF(SUM(arr), 0) * 100, 2) AS expansion_pct,
  COUNT(CASE WHEN expansion_arr > 0 THEN 1 END) AS customers_with_expansion,
  COUNT(*) AS total_customers
FROM accounts
GROUP BY tier
ORDER BY expansion_arr DESC;

-- Expansion by Product
SELECT
  s.product_family,
  SUM(rm.arr_change) AS expansion_arr,
  COUNT(DISTINCT rm.customer_id) AS customers_expanded
FROM revenue_movements rm
JOIN subscriptions s ON rm.subscription_id = s.subscription_id
WHERE rm.movement_type = 'expansion'
  AND rm.fiscal_year = 2025
GROUP BY s.product_family
ORDER BY expansion_arr DESC;

-- Expansion Velocity (Monthly Trend)
SELECT
  DATE_TRUNC('month', effective_date) AS month,
  COUNT(DISTINCT customer_id) AS customers_expanded,
  SUM(arr_change) AS total_expansion_arr,
  ROUND(AVG(arr_change), 2) AS avg_expansion_per_customer
FROM revenue_movements
WHERE movement_type = 'expansion'
  AND effective_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', effective_date)
ORDER BY month DESC;

-- Expansion by Category
SELECT
  movement_category,
  COUNT(*) AS expansion_count,
  SUM(arr_change) AS total_expansion_arr,
  ROUND(AVG(arr_change), 2) AS avg_expansion_value
FROM revenue_movements
WHERE movement_type = 'expansion'
  AND fiscal_year = 2025
GROUP BY movement_category
ORDER BY total_expansion_arr DESC;
```

**Target**: 15-30% of total ARR growth

**Data Sources**:
- `accounts`: expansion_arr, arr
- `revenue_movements`: movement_type = 'expansion', arr_change
- `amendments`: amendment_type, arr_change

---

### 9. Renewal Quote Velocity

**Definition**: Average time from renewal trigger to quote delivery

**Formula**:
```
Renewal Quote Velocity = AVG(quote_sent_date - renewal_trigger_date)
Renewal Trigger = renewal_date - 120 days
```

**SQL Implementation**:
```sql
-- Overall Renewal Quote Velocity
WITH renewal_quotes AS (
  SELECT
    q.quote_id,
    q.customer_id,
    q.quote_created_date,
    q.quote_sent_date,
    s.renewal_date,
    (s.renewal_date - INTERVAL '120 days')::date AS renewal_trigger_date,
    EXTRACT(EPOCH FROM (q.quote_sent_date - (s.renewal_date - INTERVAL '120 days'))) / 86400 AS days_to_quote
  FROM quotes q
  JOIN subscriptions s ON q.customer_id = s.customer_id
  WHERE q.quote_type = 'renewal'
    AND q.quote_sent_date IS NOT NULL
    AND s.renewal_date >= CURRENT_DATE - INTERVAL '12 months'
)
SELECT
  COUNT(*) AS renewal_quotes,
  ROUND(AVG(days_to_quote), 2) AS avg_days_to_quote,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_quote), 2) AS median_days,
  MIN(days_to_quote) AS fastest,
  MAX(days_to_quote) AS slowest,
  SUM(CASE WHEN days_to_quote <= 2 THEN 1 ELSE 0 END) AS quotes_within_48hrs,
  ROUND(
    SUM(CASE WHEN days_to_quote <= 2 THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS pct_within_target
FROM renewal_quotes;

-- Velocity by Quarter
SELECT
  DATE_TRUNC('quarter', quote_created_date) AS quarter,
  COUNT(*) AS quotes,
  ROUND(AVG(EXTRACT(EPOCH FROM (quote_sent_date - quote_created_date)) / 86400), 2) AS avg_days
FROM quotes
WHERE quote_type = 'renewal'
  AND quote_sent_date IS NOT NULL
  AND quote_created_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('quarter', quote_created_date)
ORDER BY quarter DESC;

-- Velocity by Customer Tier
SELECT
  a.tier,
  COUNT(*) AS renewal_quotes,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (q.quote_sent_date - q.quote_created_date)) / 86400),
    2
  ) AS avg_days_to_send
FROM quotes q
JOIN accounts a ON q.customer_id = a.id
WHERE q.quote_type = 'renewal'
  AND q.quote_sent_date IS NOT NULL
GROUP BY a.tier
ORDER BY avg_days_to_send;
```

**Target**: <48 hours (standard), <5 days (complex)

**Data Sources**:
- `quotes`: quote_type, quote_created_date, quote_sent_date
- `subscriptions`: renewal_date

---

### 10. Quote Accuracy Rate

**Definition**: Percentage of quotes without post-submission corrections

**Formula**:
```
Quote Accuracy Rate = (Accurate Quotes / Total Quotes) × 100
```

**SQL Implementation**:
```sql
-- Overall Quote Accuracy
SELECT
  COUNT(*) AS total_quotes,
  SUM(CASE WHEN quote_accuracy_flag = true THEN 1 ELSE 0 END) AS accurate_quotes,
  ROUND(
    SUM(CASE WHEN quote_accuracy_flag = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS accuracy_rate_pct,
  SUM(CASE WHEN requires_amendment = true THEN 1 ELSE 0 END) AS quotes_requiring_amendment,
  SUM(amendment_count) AS total_amendments
FROM quotes
WHERE quote_status IN ('accepted', 'sent')
  AND quote_created_date >= CURRENT_DATE - INTERVAL '90 days';

-- Accuracy by Quote Type
SELECT
  quote_type,
  COUNT(*) AS total_quotes,
  SUM(CASE WHEN quote_accuracy_flag = true THEN 1 ELSE 0 END) AS accurate_quotes,
  ROUND(
    SUM(CASE WHEN quote_accuracy_flag = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS accuracy_rate_pct
FROM quotes
WHERE quote_created_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY quote_type
ORDER BY accuracy_rate_pct DESC;

-- Error Analysis
SELECT
  error_reason,
  COUNT(*) AS occurrence_count,
  ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 2) AS pct_of_errors
FROM (
  SELECT
    quote_id,
    jsonb_array_elements_text(amendment_reasons::jsonb) AS error_reason
  FROM quotes
  WHERE requires_amendment = true
    AND quote_created_date >= CURRENT_DATE - INTERVAL '90 days'
) errors
GROUP BY error_reason
ORDER BY occurrence_count DESC;

-- Accuracy Trend
SELECT
  DATE_TRUNC('month', quote_created_date) AS month,
  COUNT(*) AS quotes,
  ROUND(
    SUM(CASE WHEN quote_accuracy_flag = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS accuracy_rate_pct
FROM quotes
WHERE quote_created_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', quote_created_date)
ORDER BY month DESC;
```

**Target**: 98%+

**Data Sources**:
- `quotes`: quote_accuracy_flag, requires_amendment, amendment_reasons, amendment_count

---

### 11. Order Processing Error Rate

**Definition**: Percentage of orders with processing errors

**Formula**:
```
Order Processing Error Rate = (Orders with Errors / Total Orders) × 100
```

**SQL Implementation**:
```sql
-- Overall Error Rate
SELECT
  COUNT(*) AS total_orders,
  SUM(CASE WHEN has_error = true THEN 1 ELSE 0 END) AS orders_with_errors,
  ROUND(
    SUM(CASE WHEN has_error = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS error_rate_pct,
  ROUND(
    AVG(CASE WHEN has_error = true THEN error_resolution_time_hours ELSE NULL END),
    2
  ) AS avg_resolution_time_hours
FROM orders
WHERE order_placed_date >= CURRENT_DATE - INTERVAL '90 days';

-- Errors by Type
SELECT
  error_type,
  COUNT(*) AS error_count,
  ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 2) AS pct_of_errors,
  ROUND(AVG(error_resolution_time_hours), 2) AS avg_resolution_hours
FROM orders
WHERE has_error = true
  AND order_placed_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY error_type
ORDER BY error_count DESC;

-- Errors by Stage
SELECT
  error_stage,
  COUNT(*) AS error_count,
  STRING_AGG(DISTINCT error_type, ', ') AS error_types
FROM orders
WHERE has_error = true
  AND order_placed_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY error_stage
ORDER BY error_count DESC;

-- Error Trend
SELECT
  DATE_TRUNC('month', order_placed_date) AS month,
  COUNT(*) AS total_orders,
  SUM(CASE WHEN has_error = true THEN 1 ELSE 0 END) AS orders_with_errors,
  ROUND(
    SUM(CASE WHEN has_error = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS error_rate_pct
FROM orders
WHERE order_placed_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', order_placed_date)
ORDER BY month DESC;
```

**Target**: <2%

**Data Sources**:
- `orders`: has_error, error_type, error_stage, error_resolution_time_hours

---

### 12. Invoice Dispute Rate

**Definition**: Percentage of invoices generating disputes

**Formula**:
```
Invoice Dispute Rate = (Disputed Invoices / Total Invoices) × 100
```

**SQL Implementation**:
```sql
-- Overall Dispute Rate
SELECT
  COUNT(*) AS total_invoices,
  SUM(CASE WHEN is_disputed = true THEN 1 ELSE 0 END) AS disputed_invoices,
  ROUND(
    SUM(CASE WHEN is_disputed = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS dispute_rate_pct,
  SUM(CASE WHEN is_disputed = true THEN amount_outstanding ELSE 0 END) AS disputed_amount
FROM invoices
WHERE invoice_date >= CURRENT_DATE - INTERVAL '90 days';

-- Disputes by Reason
SELECT
  dispute_reason,
  COUNT(*) AS dispute_count,
  ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 2) AS pct_of_disputes,
  SUM(amount_outstanding) AS disputed_amount,
  ROUND(AVG(EXTRACT(EPOCH FROM (dispute_resolved_date - dispute_raised_date)) / 86400), 2) AS avg_resolution_days
FROM invoices
WHERE is_disputed = true
  AND invoice_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY dispute_reason
ORDER BY dispute_count DESC;

-- Disputes by Invoice Type
SELECT
  invoice_type,
  COUNT(*) AS total_invoices,
  SUM(CASE WHEN is_disputed = true THEN 1 ELSE 0 END) AS disputed_invoices,
  ROUND(
    SUM(CASE WHEN is_disputed = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS dispute_rate_pct
FROM invoices
WHERE invoice_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY invoice_type
ORDER BY dispute_rate_pct DESC;

-- Dispute Trend
SELECT
  DATE_TRUNC('month', invoice_date) AS month,
  COUNT(*) AS total_invoices,
  SUM(CASE WHEN is_disputed = true THEN 1 ELSE 0 END) AS disputed,
  ROUND(
    SUM(CASE WHEN is_disputed = true THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS dispute_rate_pct
FROM invoices
WHERE invoice_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', invoice_date)
ORDER BY month DESC;
```

**Target**: <2%

**Data Sources**:
- `invoices`: is_disputed, dispute_reason, dispute_raised_date, dispute_resolved_date

---

### 13. Payment Collection Rate

**Definition**: Percentage of invoices paid by due date

**Formula**:
```
Payment Collection Rate = (Invoices Paid on Time / Total Due Invoices) × 100
```

**SQL Implementation**:
```sql
-- Overall Collection Rate
SELECT
  COUNT(*) AS total_invoices_due,
  SUM(CASE WHEN payment_received_date <= due_date THEN 1 ELSE 0 END) AS paid_on_time,
  ROUND(
    SUM(CASE WHEN payment_received_date <= due_date THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS on_time_payment_rate_pct,
  SUM(CASE WHEN is_overdue = true THEN 1 ELSE 0 END) AS overdue_invoices,
  SUM(CASE WHEN is_overdue = true THEN amount_outstanding ELSE 0 END) AS overdue_amount
FROM invoices
WHERE due_date >= CURRENT_DATE - INTERVAL '90 days'
  AND invoice_status IN ('paid', 'partially_paid', 'overdue');

-- Collection Rate by Customer Tier
SELECT
  a.tier,
  COUNT(*) AS invoices,
  SUM(CASE WHEN i.payment_received_date <= i.due_date THEN 1 ELSE 0 END) AS paid_on_time,
  ROUND(
    SUM(CASE WHEN i.payment_received_date <= i.due_date THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS collection_rate_pct
FROM invoices i
JOIN accounts a ON i.customer_id = a.id
WHERE i.due_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY a.tier
ORDER BY collection_rate_pct DESC;

-- Collection Rate by Payment Terms
SELECT
  payment_terms,
  COUNT(*) AS invoices,
  ROUND(AVG(days_outstanding), 2) AS avg_days_to_pay,
  ROUND(
    SUM(CASE WHEN payment_received_date <= due_date THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS on_time_pct
FROM invoices
WHERE payment_received_date IS NOT NULL
  AND invoice_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY payment_terms
ORDER BY avg_days_to_pay;

-- Collection Trend
SELECT
  DATE_TRUNC('month', due_date) AS month,
  COUNT(*) AS invoices_due,
  SUM(CASE WHEN payment_received_date <= due_date THEN 1 ELSE 0 END) AS paid_on_time,
  ROUND(
    SUM(CASE WHEN payment_received_date <= due_date THEN 1 ELSE 0 END) / COUNT(*) * 100,
    2
  ) AS collection_rate_pct
FROM invoices
WHERE due_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', due_date)
ORDER BY month DESC;
```

**Target**: 85%+

**Data Sources**:
- `invoices`: payment_received_date, due_date, is_overdue, amount_outstanding
- `payments`: payment_date, payment_status

---

### 14. Amendment Processing Time

**Definition**: Average time to process subscription amendments

**Formula**:
```
Amendment Processing Time = AVG(amendment_completed_date - amendment_requested_date)
```

**SQL Implementation**:
```sql
-- Overall Amendment Processing Time
SELECT
  COUNT(*) AS total_amendments,
  ROUND(AVG(total_processing_time_hours), 2) AS avg_processing_hours,
  ROUND(AVG(total_processing_time_hours) / 24, 2) AS avg_processing_days,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_processing_time_hours), 2) AS median_hours,
  MIN(total_processing_time_hours) AS fastest_hours,
  MAX(total_processing_time_hours) AS slowest_hours
FROM amendments
WHERE amendment_status = 'completed'
  AND amendment_requested_date >= CURRENT_DATE - INTERVAL '90 days';

-- Processing Time by Amendment Type
SELECT
  amendment_type,
  COUNT(*) AS amendments,
  ROUND(AVG(total_processing_time_hours), 2) AS avg_hours,
  ROUND(AVG(approval_time_hours), 2) AS avg_approval_hours,
  ROUND(AVG(system_update_time_hours), 2) AS avg_system_hours
FROM amendments
WHERE amendment_status = 'completed'
  AND amendment_requested_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY amendment_type
ORDER BY avg_hours DESC;

-- Processing Time Breakdown
SELECT
  ROUND(AVG(approval_time_hours), 2) AS avg_approval_hours,
  ROUND(AVG(system_update_time_hours), 2) AS avg_system_update_hours,
  ROUND(AVG(total_processing_time_hours - approval_time_hours - system_update_time_hours), 2) AS avg_other_time_hours,
  ROUND(AVG(total_processing_time_hours), 2) AS avg_total_hours
FROM amendments
WHERE amendment_status = 'completed'
  AND amendment_requested_date >= CURRENT_DATE - INTERVAL '90 days';

-- Amendments Requiring Approval
SELECT
  requires_approval,
  COUNT(*) AS amendments,
  ROUND(AVG(total_processing_time_hours), 2) AS avg_processing_hours
FROM amendments
WHERE amendment_status = 'completed'
  AND amendment_requested_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY requires_approval;

-- Processing Time Trend
SELECT
  DATE_TRUNC('month', amendment_requested_date) AS month,
  COUNT(*) AS amendments,
  ROUND(AVG(total_processing_time_hours), 2) AS avg_hours,
  ROUND(AVG(total_processing_time_hours) / 24, 2) AS avg_days
FROM amendments
WHERE amendment_status = 'completed'
  AND amendment_requested_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', amendment_requested_date)
ORDER BY month DESC;
```

**Target**: <48 hours

**Data Sources**:
- `amendments`: total_processing_time_hours, approval_time_hours, system_update_time_hours, amendment_type

---

### 15. Mid-Cycle Utilization Alerts

**Definition**: Number and severity of utilization alerts triggered mid-subscription

**Formula**:
```
Alert Volume = COUNT(alerts) WHERE alert_triggered_date BETWEEN contract_start AND contract_end
```

**SQL Implementation**:
```sql
-- Overall Alert Metrics
SELECT
  COUNT(*) AS total_alerts,
  COUNT(DISTINCT customer_id) AS customers_with_alerts,
  COUNT(DISTINCT license_id) AS licenses_with_alerts,
  ROUND(AVG(current_utilization), 2) AS avg_utilization_at_trigger
FROM utilization_alerts
WHERE alert_triggered_date >= CURRENT_DATE - INTERVAL '90 days';

-- Alerts by Type
SELECT
  alert_type,
  COUNT(*) AS alert_count,
  ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 2) AS pct_of_alerts,
  COUNT(DISTINCT customer_id) AS unique_customers
FROM utilization_alerts
WHERE alert_triggered_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY alert_type
ORDER BY alert_count DESC;

-- Alerts by Severity
SELECT
  alert_severity,
  COUNT(*) AS alert_count,
  SUM(CASE WHEN alert_status = 'resolved' THEN 1 ELSE 0 END) AS resolved,
  SUM(CASE WHEN alert_status IN ('new', 'acknowledged') THEN 1 ELSE 0 END) AS open,
  ROUND(AVG(potential_arr_impact), 2) AS avg_arr_impact
FROM utilization_alerts
WHERE alert_triggered_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY alert_severity
ORDER BY
  CASE alert_severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
    WHEN 'info' THEN 5
  END;

-- Alert Response Time
SELECT
  alert_type,
  COUNT(*) AS alerts,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (alert_acknowledged_date - alert_triggered_date)) / 3600),
    2
  ) AS avg_hours_to_acknowledge,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (alert_resolved_date - alert_triggered_date)) / 3600),
    2
  ) AS avg_hours_to_resolve
FROM utilization_alerts
WHERE alert_status = 'resolved'
  AND alert_triggered_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY alert_type
ORDER BY avg_hours_to_resolve DESC;

-- High-Value Alert Opportunities
SELECT
  ua.alert_id,
  ua.customer_id,
  a.name,
  ua.alert_type,
  ua.current_utilization,
  ua.potential_arr_impact,
  ua.alert_status,
  ua.assigned_to
FROM utilization_alerts ua
JOIN accounts a ON ua.customer_id = a.id
WHERE ua.alert_type IN ('expansion_opportunity', 'high_utilization')
  AND ua.alert_status IN ('new', 'acknowledged', 'in_progress')
  AND ua.potential_arr_impact > 10000
ORDER BY ua.potential_arr_impact DESC;

-- Alert Trend
SELECT
  DATE_TRUNC('week', alert_triggered_date) AS week,
  COUNT(*) AS total_alerts,
  SUM(CASE WHEN alert_severity IN ('critical', 'high') THEN 1 ELSE 0 END) AS high_priority_alerts,
  COUNT(DISTINCT customer_id) AS affected_customers
FROM utilization_alerts
WHERE alert_triggered_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('week', alert_triggered_date)
ORDER BY week DESC;
```

**Target**: <5% of customer base with critical alerts per month

**Data Sources**:
- `utilization_alerts`: All fields
- `utilization_history`: Trend data feeding alerts

---

## Summary: Complete KPI Dashboard Query

```sql
-- Executive KPI Dashboard (All 15 KPIs)
SELECT
  -- 1. NRR
  (SELECT ROUND(
    (SUM(starting_arr) + SUM(expansion_arr) - SUM(churn_arr) - SUM(contraction_arr)) /
    NULLIF(SUM(starting_arr), 0) * 100, 2
  ) FROM accounts) AS nrr_percentage,

  -- 2. ARR
  (SELECT SUM(arr) FROM subscriptions WHERE subscription_status = 'active') AS total_arr,

  -- 3. DSO
  (SELECT ROUND(AVG(days_outstanding), 2)
   FROM invoices
   WHERE amount_outstanding > 0) AS dso_days,

  -- 4. Deferred Revenue
  (SELECT SUM(total_deferred_balance)
   FROM revenue_recognition_schedule) AS deferred_revenue,

  -- 5. Quote-to-Cash Cycle Time
  (SELECT ROUND(AVG(quote_to_cash_days), 2)
   FROM quote_to_cash_tracking
   WHERE is_complete = true) AS avg_qtc_days,

  -- 6. GRR
  (SELECT ROUND(
    (SUM(starting_arr) - SUM(churn_arr) - SUM(contraction_arr)) /
    NULLIF(SUM(starting_arr), 0) * 100, 2
  ) FROM accounts) AS grr_percentage,

  -- 7. Revenue Recognition Accuracy
  (SELECT ROUND(
    SUM(CASE WHEN is_accurate THEN 1 ELSE 0 END) / COUNT(*) * 100, 2
  ) FROM revenue_recognition_schedule) AS revenue_accuracy_pct,

  -- 8. Expansion ARR Contribution
  (SELECT ROUND(SUM(expansion_arr) / NULLIF(SUM(arr), 0) * 100, 2)
   FROM accounts) AS expansion_contribution_pct,

  -- 9. Renewal Quote Velocity
  (SELECT ROUND(AVG(
    EXTRACT(EPOCH FROM (quote_sent_date - quote_created_date)) / 86400
  ), 2) FROM quotes WHERE quote_type = 'renewal') AS renewal_quote_velocity_days,

  -- 10. Quote Accuracy Rate
  (SELECT ROUND(
    SUM(CASE WHEN quote_accuracy_flag THEN 1 ELSE 0 END) / COUNT(*) * 100, 2
  ) FROM quotes) AS quote_accuracy_pct,

  -- 11. Order Processing Error Rate
  (SELECT ROUND(
    SUM(CASE WHEN has_error THEN 1 ELSE 0 END) / COUNT(*) * 100, 2
  ) FROM orders) AS order_error_rate_pct,

  -- 12. Invoice Dispute Rate
  (SELECT ROUND(
    SUM(CASE WHEN is_disputed THEN 1 ELSE 0 END) / COUNT(*) * 100, 2
  ) FROM invoices) AS invoice_dispute_rate_pct,

  -- 13. Payment Collection Rate
  (SELECT ROUND(
    SUM(CASE WHEN payment_received_date <= due_date THEN 1 ELSE 0 END) / COUNT(*) * 100, 2
  ) FROM invoices WHERE payment_received_date IS NOT NULL) AS payment_collection_rate_pct,

  -- 14. Amendment Processing Time
  (SELECT ROUND(AVG(total_processing_time_hours) / 24, 2)
   FROM amendments
   WHERE amendment_status = 'completed') AS avg_amendment_days,

  -- 15. Mid-Cycle Utilization Alerts
  (SELECT COUNT(*)
   FROM utilization_alerts
   WHERE alert_triggered_date >= CURRENT_DATE - INTERVAL '30 days'
     AND alert_severity IN ('critical', 'high')) AS critical_alerts_last_30days;
```

---

## Data Quality & Validation

### Key Validation Queries

```sql
-- Verify Quote → Order → Invoice → Payment Chain
SELECT
  q.quote_id,
  q.quote_status,
  o.order_id,
  o.order_status,
  i.invoice_id,
  i.invoice_status,
  p.payment_id,
  p.payment_status
FROM quotes q
LEFT JOIN orders o ON q.order_id = o.order_id
LEFT JOIN invoices i ON o.order_id = i.order_id
LEFT JOIN payments p ON i.invoice_id = p.invoice_id
WHERE q.converted_to_order = true
  AND (o.order_id IS NULL OR i.invoice_id IS NULL OR p.payment_id IS NULL);

-- Verify ARR Calculations
SELECT
  customer_id,
  (SELECT SUM(arr) FROM subscriptions WHERE customer_id = a.id) AS calc_arr,
  a.arr AS reported_arr,
  ABS((SELECT SUM(arr) FROM subscriptions WHERE customer_id = a.id) - a.arr) AS variance
FROM accounts a
HAVING ABS((SELECT SUM(arr) FROM subscriptions WHERE customer_id = a.id) - a.arr) > 100;

-- Verify Revenue Recognition
SELECT
  subscription_id,
  total_contract_value,
  (total_recognized_to_date + total_deferred_balance) AS calculated_tcv,
  ABS(total_contract_value - (total_recognized_to_date + total_deferred_balance)) AS variance
FROM revenue_recognition_schedule
WHERE ABS(total_contract_value - (total_recognized_to_date + total_deferred_balance)) > 1;
```

---

## End of KPI Calculations Document
