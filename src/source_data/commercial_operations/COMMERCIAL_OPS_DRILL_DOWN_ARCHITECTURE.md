# Commercial Operations Dashboard: Complete 3-Layer Drill-Down Architecture
## For Quote-to-Cash & License Utilization Visibility

**Document Version:** 2.0
**Date:** October 7, 2025
**Purpose:** Detailed drill-down, drill-through, and slice-and-dice specifications for 15 Commercial Operations KPIs
**Data Source:** All 16 generated tables aligned with Commercial Operations workflows

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [KPI-by-KPI Drill-Down Specifications](#kpi-by-kpi-drill-down-specifications)
4. [Universal Slice-and-Dice Dimensions](#universal-slice-and-dice-dimensions)
5. [Cross-KPI Drill-Through Paths](#cross-kpi-drill-through-paths)
6. [Technical Implementation Guide](#technical-implementation-guide)

---

## Executive Summary

### Commercial Operations Persona Context

**Primary Need:** Unified visibility into Quote-to-Cash processes integrated with license utilization intelligence

**Current Gaps:**
- No single view connecting quoting → ordering → billing → invoicing → subscription → utilization
- License utilization data siloed from commercial operations workflows
- Inability to connect underutilization to renewal risk or expansion opportunities
- Manual reconciliation between commercial systems and license management

**Solution:** 3-layer hierarchical drill-down architecture connecting all 16 data tables

### Dashboard Structure for Commercial Operations

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: PORTFOLIO EXECUTIVE VIEW (Company-Wide KPIs)          │
│  • 15 KPI tiles with trend indicators                           │
│  • Red/Yellow/Green health indicators                           │
│  • Click any KPI → Drill to Layer 2                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: DIMENSIONAL BREAKDOWN (Product/Segment/Process)       │
│  • KPI broken down by key dimensions                            │
│  • Comparison tables and trend charts                           │
│  • Filters: Product, Segment, Geography, Time                   │
│  • Click dimension value → Drill to Layer 3                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: TRANSACTION DETAIL (Account/Order/Invoice Level)      │
│  • Individual records with full detail                          │
│  • Transaction history and audit trail                          │
│  • Related records across all tables                            │
│  • Actionable insights and export options                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Overview

### Data Model Integration

All 16 tables are connected to support seamless drill-down:

```
Core Commercial Flow:
accounts (50)
    ├── subscriptions (145)
    │   ├── quotes (120) → quote_line_items (224)
    │   │       └── orders (84)
    │   │           └── invoices (82)
    │   │               └── payments (76)
    │   │                   └── accounts_receivable (7)
    │   ├── amendments (29) → revenue_movements (20)
    │   ├── revenue_recognition_schedule (133)
    │   └── quote_to_cash_tracking (82)
    │
    └── licenses (121)
        └── utilization_history (10,890)
            └── utilization_alerts (25)

KPI Calculations:
    kpi_metrics (3) ← Calculated from all tables
```

### Key Relationships for Drill-Down

| Parent Table | Child Table | Relationship | Drill-Down Use Case |
|--------------|-------------|--------------|---------------------|
| accounts | subscriptions | 1:many | From account ARR → subscription breakdown |
| accounts | licenses | 1:many | From account health → license utilization |
| subscriptions | quotes | 1:many | From subscription → renewal quotes |
| quotes | quote_line_items | 1:many | From quote total → line item detail |
| quotes | orders | 1:1 | From quote → order fulfillment |
| orders | invoices | 1:1 | From order → billing detail |
| invoices | payments | 1:many | From invoice → payment history |
| subscriptions | amendments | 1:many | From subscription → change history |
| licenses | utilization_history | 1:many | From license → daily utilization |
| licenses | utilization_alerts | 1:many | From license → threshold alerts |

---

## KPI-by-KPI Drill-Down Specifications

---

### **KPI 1: Net Revenue Retention (NRR)**

**Business Question:** How effectively are we growing revenue from existing customers?

**Calculation:** `((Starting ARR + Expansion ARR - Churn ARR - Contraction ARR) / Starting ARR) × 100`

**Data Sources:** `accounts`, `subscriptions`, `revenue_movements`, `amendments`

#### **LAYER 1: Portfolio Executive View**

**Display:**
```
┌────────────────────────────────────────────┐
│  Net Revenue Retention (NRR)               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                            │
│  114.83%  ↑ +3.63%                        │
│  [████████████████████░░░] 110% Target    │
│                                            │
│  Components:                               │
│  • Starting ARR:    $34.6M                │
│  • Expansion ARR:   +$5.2M                │
│  • Churn ARR:       -$14K                 │
│  • Contraction ARR: -$78K                 │
│                                            │
│  Status: ✅ Exceeds Target                │
│  Trend:  🟢 Improving QoQ                 │
└────────────────────────────────────────────┘
```

**Drill-Down Triggers:**
- Click main metric (114.83%) → Layer 2 Product Breakdown
- Click "Expansion ARR" → Layer 2 filtered to expansion movements
- Click "Churn ARR" → Layer 2 filtered to churned accounts
- Click "Contraction ARR" → Layer 2 filtered to contraction events

#### **LAYER 2: Product/Segment Breakdown**

**View Option A: By Product Family**

**SQL Query:**
```sql
SELECT
    l.product_family,
    SUM(a.starting_arr) as starting_arr,
    SUM(a.expansion_arr) as expansion_arr,
    SUM(a.churn_arr) as churn_arr,
    SUM(a.contraction_arr) as contraction_arr,
    ROUND(
        ((SUM(a.starting_arr) + SUM(a.expansion_arr) -
          SUM(a.churn_arr) - SUM(a.contraction_arr)) /
         NULLIF(SUM(a.starting_arr), 0)) * 100, 2
    ) as nrr_percentage
FROM accounts a
JOIN licenses l ON a.id = l.customer_id
WHERE a.fiscal_quarter = '2025-Q1'
GROUP BY l.product_family
ORDER BY nrr_percentage DESC;
```

**Display:**
```
Product Family  | Starting ARR | Expansion | Churn   | Contraction | NRR %   | Trend
----------------|--------------|-----------|---------|-------------|---------|-------
Meraki          | $7.2M        | +$1.1M    | -$3K    | -$15K       | 118.2%  | 🟢 ↑
Duo             | $6.8M        | +$1.0M    | -$2K    | -$12K       | 116.5%  | 🟢 ↑
ThousandEyes    | $7.1M        | +$1.2M    | -$4K    | -$18K       | 119.1%  | 🟢 ↑
Umbrella        | $6.9M        | +$950K    | -$3K    | -$16K       | 115.3%  | 🟢 ↑
Splunk          | $6.6M        | +$980K    | -$2K    | -$17K       | 116.7%  | 🟢 ↑
```

**Slice-and-Dice Filters:**
- **Product Family:** Multi-select (Meraki, Duo, Umbrella, ThousandEyes, Splunk)
- **Customer Segment:** Enterprise (>5000 employees), Mid-Market (500-5000), SMB (<500)
- **Geography:** Americas, EMEA, APAC, by Country
- **Industry:** Technology, Healthcare, Financial Services, Manufacturing, Retail, Government
- **Time Period:** Q1 2025, Q4 2024, YoY Comparison
- **Utilization Band:** High (>75%), Medium (50-75%), Low (<50%)

**View Option B: By Customer Segment**

**SQL Query:**
```sql
SELECT
    CASE
        WHEN a.arr >= 1000000 THEN 'Enterprise'
        WHEN a.arr >= 100000 THEN 'Mid-Market'
        ELSE 'SMB'
    END as segment,
    COUNT(DISTINCT a.id) as customer_count,
    SUM(a.starting_arr) as starting_arr,
    SUM(a.expansion_arr) as expansion_arr,
    SUM(a.churn_arr) as churn_arr,
    SUM(a.contraction_arr) as contraction_arr,
    ROUND(
        ((SUM(a.starting_arr) + SUM(a.expansion_arr) -
          SUM(a.churn_arr) - SUM(a.contraction_arr)) /
         NULLIF(SUM(a.starting_arr), 0)) * 100, 2
    ) as nrr_percentage
FROM accounts a
WHERE a.fiscal_quarter = '2025-Q1'
GROUP BY segment
ORDER BY nrr_percentage DESC;
```

**Display:**
```
Segment     | Customers | Starting ARR | Expansion | Churn   | Contraction | NRR %   | Action
------------|-----------|--------------|-----------|---------|-------------|---------|--------
Enterprise  | 12        | $18.4M       | +$3.2M    | -$8K    | -$45K       | 120.8%  | [Details]
Mid-Market  | 23        | $12.1M       | +$1.6M    | -$4K    | -$22K       | 115.2%  | [Details]
SMB         | 15        | $4.1M        | +$420K    | -$2K    | -$11K       | 112.1%  | [Details]
```

**Drill-Down Triggers:**
- Click product row (e.g., "Meraki") → Layer 3 Account List for Meraki
- Click NRR % → Layer 3 sorted by NRR contribution
- Click "Expansion" value → Layer 3 filtered to expansion movements only
- Click "Churn" value → Layer 3 filtered to churned accounts

**Drill-Through Options:**
- "View Quote Activity" → Navigate to Quote-to-Cash Tracking filtered by product/segment
- "Check Utilization" → Navigate to License Utilization filtered by product/segment
- "Renewal Pipeline" → Navigate to Renewal Risk Score filtered by segment

#### **LAYER 3: Account-Level Transaction Detail**

**SQL Query:**
```sql
SELECT
    a.id,
    a.name,
    a.tier,
    a.industry,
    a.starting_arr,
    a.expansion_arr,
    a.churn_arr,
    a.contraction_arr,
    a.arr_trend,
    a.renewal_risk_score,
    a.health_score,
    l.product_family,
    s.subscription_status,
    s.contract_end_date,
    rm.movement_type,
    rm.movement_date,
    rm.arr_change
FROM accounts a
LEFT JOIN licenses l ON a.id = l.customer_id
LEFT JOIN subscriptions s ON l.license_id = s.license_id
LEFT JOIN revenue_movements rm ON s.subscription_id = rm.subscription_id
WHERE a.fiscal_quarter = '2025-Q1'
    AND l.product_family = 'Meraki'  -- From Layer 2 drill-down
ORDER BY a.expansion_arr DESC;
```

**Display: Account Detail Card**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TechCorp Industries (CUST_000001)                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│  NRR CONTRIBUTION ANALYSIS                                              │
│  ┌─────────────────┬──────────────┬──────────────┬────────────────┐   │
│  │ Component       │ Amount       │ % of Total   │ Trend          │   │
│  ├─────────────────┼──────────────┼──────────────┼────────────────┤   │
│  │ Starting ARR    │ $1,522,871   │ 100%         │ Baseline       │   │
│  │ Expansion ARR   │ +$45,686     │ +3.0%        │ 🟢 Seat adds   │   │
│  │ Churn ARR       │ $0           │ 0%           │ ✅ No churn    │   │
│  │ Contraction ARR │ $0           │ 0%           │ ✅ No downgrade│   │
│  │ Ending ARR      │ $1,568,557   │ 103.0%       │ 🟢 Growing     │   │
│  └─────────────────┴──────────────┴──────────────┴────────────────┘   │
│                                                                         │
│  PRODUCT BREAKDOWN (Meraki Focus)                                      │
│  • Meraki Enterprise: 850 licenses, 95% utilization → Expansion driver│
│  • Health Score: 95/100 🟢                                             │
│  • Renewal Risk: 15/100 🟢 (Low Risk)                                  │
│  • Contract End: 2025-12-15 (8 months out)                            │
│                                                                         │
│  REVENUE MOVEMENT HISTORY                                               │
│  ┌──────────────┬───────────────┬──────────────┬──────────────────┐  │
│  │ Date         │ Type          │ ARR Change   │ Reason           │  │
│  ├──────────────┼───────────────┼──────────────┼──────────────────┤  │
│  │ 2025-08-15   │ Expansion     │ +$45,686     │ Seat increase    │  │
│  │ 2025-03-20   │ Renewal       │ $0           │ On-time renewal  │  │
│  │ 2024-12-10   │ Expansion     │ +$30,250     │ New product add  │  │
│  └──────────────┴───────────────┴──────────────┴──────────────────┘  │
│                                                                         │
│  RELATED COMMERCIAL ACTIVITY                                            │
│  • Last Quote: QT_CUST_000001_0 ($45,686) - Approved & Ordered        │
│  • Last Invoice: INV_ORD_QT_CUST_000001_0 ($1,568,557) - Paid         │
│  • Amendments: 2 in last 12 months (both expansions)                   │
│  • Payment History: 100% on-time payment rate                          │
│                                                                         │
│  ACTIONS                                                                │
│  [View Full Quote History] [Check Utilization] [Renewal Forecast]     │
│  [Export Account Summary] [View Similar Accounts]                      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Drill-Through Options from Layer 3:**
1. **"View Full Quote History"** → Navigate to Quoting & Renewal tab, filtered to this account
2. **"Check Utilization"** → Navigate to Utilization Intelligence tab, filtered to this account's licenses
3. **"Renewal Forecast"** → Navigate to Subscription Lifecycle tab, show renewal timeline
4. **"View Similar Accounts"** → Return to Layer 2, filtered to similar segment/product/utilization

**Related Records Display:**

```sql
-- Quote History
SELECT q.quote_id, q.quote_date, q.total_value, q.quote_status, q.win_loss_reason
FROM quotes q
WHERE q.customer_id = 'CUST_000001'
ORDER BY q.quote_date DESC
LIMIT 5;

-- Amendment History
SELECT a.amendment_id, a.amendment_date, a.amendment_type, a.arr_impact
FROM amendments a
JOIN subscriptions s ON a.subscription_id = s.subscription_id
WHERE s.customer_id = 'CUST_000001'
ORDER BY a.amendment_date DESC;

-- Utilization Current State
SELECT l.product_family, l.license_count, l.utilization, l.utilization_trend
FROM licenses l
WHERE l.customer_id = 'CUST_000001';
```

---

### **KPI 2: Annual Recurring Revenue (ARR)**

**Business Question:** What is our current and trending Annual Recurring Revenue?

**Calculation:** `SUM(subscription.arr) WHERE subscription_status = 'active'`

**Data Sources:** `accounts`, `subscriptions`, `licenses`

#### **LAYER 1: Portfolio Executive View**

**Display:**
```
┌────────────────────────────────────────────┐
│  Annual Recurring Revenue (ARR)            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                            │
│  $20,336,891  ↑ +$2.03M (+10.0%)          │
│  [██████████████████████████░] Target     │
│                                            │
│  Breakdown:                                │
│  • New Business:  $1.2M (6%)              │
│  • Renewals:      $17.8M (87%)            │
│  • Expansions:    $1.3M (7%)              │
│                                            │
│  By Status:                                │
│  • Active:        $19.1M (94%)            │
│  • In Renewal:    $1.2M (6%)              │
│                                            │
│  Status: ✅ Exceeds Target                │
│  QoQ Growth: +10.0% 🟢                    │
└────────────────────────────────────────────┘
```

**Drill-Down Triggers:**
- Click main ARR value → Layer 2 Product/Segment Breakdown
- Click "New Business" → Layer 2 filtered to new subscriptions
- Click "Renewals" → Layer 2 filtered to renewed subscriptions
- Click "Expansions" → Layer 2 filtered to expansion ARR
- Click "In Renewal" → Layer 3 Account List with upcoming renewals

#### **LAYER 2: Dimensional Breakdown**

**View Option A: ARR by Product Family**

**SQL Query:**
```sql
SELECT
    l.product_family,
    COUNT(DISTINCT s.subscription_id) as subscription_count,
    SUM(s.arr) as total_arr,
    AVG(s.arr) as avg_arr_per_subscription,
    SUM(CASE WHEN s.subscription_status = 'active' THEN s.arr ELSE 0 END) as active_arr,
    SUM(CASE WHEN s.subscription_status = 'expired' THEN s.arr ELSE 0 END) as expired_arr,
    ROUND(AVG(l.utilization), 2) as avg_utilization
FROM subscriptions s
JOIN licenses l ON s.license_id = l.license_id
WHERE s.subscription_status IN ('active', 'expired')
GROUP BY l.product_family
ORDER BY total_arr DESC;
```

**Display:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ARR BREAKDOWN BY PRODUCT FAMILY                                             │
├───────────────┬──────┬────────────┬──────────┬────────────┬─────────┬───────┤
│ Product       │ Subs │ Total ARR  │ Avg/Sub  │ Active ARR │ Expired │ Util% │
├───────────────┼──────┼────────────┼──────────┼────────────┼─────────┼───────┤
│ Meraki        │ 29   │ $4,280,500 │ $147,603 │ $4,125,200 │ $155K   │ 87%   │
│ ThousandEyes  │ 29   │ $4,210,800 │ $145,200 │ $4,050,100 │ $160K   │ 82%   │
│ Duo           │ 29   │ $4,050,300 │ $139,666 │ $3,900,500 │ $149K   │ 85%   │
│ Umbrella      │ 29   │ $3,980,500 │ $137,258 │ $3,835,700 │ $144K   │ 83%   │
│ Splunk        │ 29   │ $3,814,791 │ $131,545 │ $3,675,400 │ $139K   │ 80%   │
├───────────────┼──────┼────────────┼──────────┼────────────┼─────────┼───────┤
│ **TOTAL**     │ 145  │$20,336,891 │ $140,254 │$19,586,900 │ $747K   │ 83%   │
└───────────────┴──────┴────────────┴──────────┴────────────┴─────────┴───────┘

📊 INSIGHTS:
• Meraki leads with highest ARR and utilization (87%)
• Splunk has lowest utilization (80%) - potential churn risk
• 145 active subscriptions averaging $140K ARR
• $747K ARR at risk from expired subscriptions

[📥 Export] [📊 Trend Chart] [🔍 Filter] [⚙️ Configure View]
```

**View Option B: ARR by Customer Segment with Utilization**

**SQL Query:**
```sql
SELECT
    CASE
        WHEN a.arr >= 1000000 THEN 'Enterprise'
        WHEN a.arr >= 100000 THEN 'Mid-Market'
        ELSE 'SMB'
    END as segment,
    COUNT(DISTINCT a.id) as customer_count,
    SUM(a.arr) as total_arr,
    AVG(a.arr) as avg_arr_per_customer,
    ROUND(AVG(l.utilization), 2) as avg_utilization,
    SUM(CASE WHEN l.utilization > 85 THEN 1 ELSE 0 END) as expansion_ready_count,
    SUM(CASE WHEN l.utilization < 50 THEN 1 ELSE 0 END) as at_risk_count
FROM accounts a
LEFT JOIN licenses l ON a.id = l.customer_id
GROUP BY segment
ORDER BY total_arr DESC;
```

**Display:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ARR BY CUSTOMER SEGMENT (with Utilization Intelligence)                    │
├─────────────┬───────┬────────────┬─────────────┬───────┬──────────┬─────────┤
│ Segment     │ Cust  │ Total ARR  │ Avg/Customer│ Util% │ Expansion│ At-Risk │
├─────────────┼───────┼────────────┼─────────────┼───────┼──────────┼─────────┤
│ Enterprise  │ 12    │ $12,580,000│ $1,048,333  │ 88%   │ 8 🟢     │ 1 🟡    │
│ Mid-Market  │ 23    │ $5,890,500 │ $256,109    │ 82%   │ 12 🟢    │ 3 🟡    │
│ SMB         │ 15    │ $1,866,391 │ $124,426    │ 75%   │ 3 🟢     │ 5 🔴    │
├─────────────┼───────┼────────────┼─────────────┼───────┼──────────┼─────────┤
│ **TOTAL**   │ 50    │$20,336,891 │ $406,738    │ 83%   │ 23       │ 9       │
└─────────────┴───────┴────────────┴─────────────┴───────┴──────────┴─────────┘

📊 INSIGHTS:
• Enterprise segment: Highest utilization (88%), $12.6M ARR (62% of total)
• 23 customers with >85% utilization = expansion opportunities worth ~$2.3M
• 9 at-risk customers (<50% utilization), mostly SMB = $467K ARR at risk
• Mid-Market: Best growth opportunity (23 customers, 82% avg util)

ACTIONS:
[View Expansion Ready] [Review At-Risk] [Segment Deep Dive] [Utilization Analysis]
```

**View Option C: ARR Trend Over Time**

**SQL Query:**
```sql
SELECT
    DATE_TRUNC('month', s.subscription_start_date) as month,
    SUM(s.arr) as cumulative_arr,
    COUNT(DISTINCT s.subscription_id) as active_subscriptions,
    SUM(CASE WHEN s.subscription_type = 'new' THEN s.arr ELSE 0 END) as new_arr,
    SUM(CASE WHEN s.subscription_type = 'renewal' THEN s.arr ELSE 0 END) as renewal_arr,
    SUM(CASE WHEN s.subscription_type = 'expansion' THEN s.arr ELSE 0 END) as expansion_arr
FROM subscriptions s
WHERE s.subscription_start_date >= '2024-10-01'
    AND s.subscription_start_date <= '2025-10-07'
GROUP BY month
ORDER BY month;
```

**Display:**
```
ARR TREND (Last 12 Months)

$25M ┤                                                               ╭─ $20.3M
     │                                                          ╭────╯
$20M ┤                                                     ╭────╯
     │                                                ╭────╯
$15M ┤                                           ╭────╯
     │                                      ╭────╯
$10M ┤                                 ╭────╯
     │                            ╭────╯
 $5M ┤                       ╭────╯
     │                  ╭────╯
  $0 ┤──────────────────╯
     └─┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬
      Oct Nov Dec Jan Feb Mar Apr May Jun Jul Aug Sep
      2024                             2025

     New ARR: ████  Renewal ARR: ████  Expansion ARR: ████

MoM Growth: +8.5% | QoQ Growth: +10.0% | YoY Growth: +18.2%
```

**Slice-and-Dice Filters (All Views):**
- **Product Family:** Meraki, Duo, Umbrella, ThousandEyes, Splunk, All
- **Customer Segment:** Enterprise, Mid-Market, SMB, All
- **Geography:** Americas, EMEA, APAC, by Country
- **Subscription Status:** Active, Expired, Cancelled, All
- **Utilization Band:** High (>85%), Medium (50-85%), Low (<50%)
- **Contract Term:** 1-year, 2-year, 3-year, 5-year+
- **Billing Frequency:** Annual, Quarterly, Monthly
- **Payment Terms:** Net 30, Net 45, Net 60, Due on Receipt
- **Time Period:** Current Month, Last Quarter, Last Year, Custom Range

**Drill-Down Triggers:**
- Click any product row → Layer 3 Subscription List for that product
- Click any segment row → Layer 3 Account List for that segment
- Click "Expansion Ready" count → Layer 3 filtered to high-utilization accounts
- Click "At-Risk" count → Layer 3 filtered to low-utilization accounts
- Click any data point in trend chart → Layer 3 subscriptions for that time period

#### **LAYER 3: Subscription/Account Detail**

**SQL Query:**
```sql
SELECT
    a.id,
    a.name,
    a.tier,
    a.industry,
    a.arr as account_arr,
    a.mrr,
    a.expansion_arr,
    a.churn_arr,
    a.arr_trend,
    a.payment_terms,
    a.billing_frequency,
    a.renewal_risk_score,
    a.health_score,
    s.subscription_id,
    s.arr as subscription_arr,
    s.subscription_status,
    s.subscription_start_date,
    s.subscription_end_date,
    s.contract_term_months,
    s.auto_renew,
    l.product_family,
    l.license_type,
    l.tier as product_tier,
    l.license_count,
    l.utilization,
    l.utilization_trend,
    l.annual_value,
    DATEDIFF(day, CURRENT_DATE, s.subscription_end_date) as days_to_renewal
FROM accounts a
JOIN subscriptions s ON a.id = s.customer_id
JOIN licenses l ON s.license_id = l.license_id
WHERE l.product_family = 'Meraki'  -- From Layer 2 drill-down
    AND s.subscription_status = 'active'
ORDER BY s.arr DESC;
```

**Display: Subscription Detail Card**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SUBSCRIPTION DETAIL: TechCorp Industries - Meraki Enterprise           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│  ARR OVERVIEW                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Subscription ARR:     $1,522,871    (7.5% of company ARR)       │ │
│  │ Account Total ARR:    $1,522,871    (Single product customer)   │ │
│  │ MRR:                  $126,906                                   │ │
│  │ ARR Trend:            🟢 Growing (+3.0% this quarter)           │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  SUBSCRIPTION DETAILS                                                   │
│  ┌─────────────────────────┬───────────────────────────────────────┐  │
│  │ Subscription ID         │ SUB_LIC_CUST_000001_Meraki            │  │
│  │ Product                 │ Meraki Enterprise                     │  │
│  │ License Count           │ 850 licenses                          │  │
│  │ Unit Price              │ $150/license/year                     │  │
│  │ Annual Value            │ $127,500                              │  │
│  │ Contract Term           │ 36 months                             │  │
│  │ Start Date              │ 2024-01-15                            │  │
│  │ End Date                │ 2025-12-15 (433 days remaining)      │  │
│  │ Auto-Renew              │ ✅ Enabled                            │  │
│  │ Billing Frequency       │ Annual                                │  │
│  │ Payment Terms           │ Net 30                                │  │
│  │ Status                  │ 🟢 Active                             │  │
│  └─────────────────────────┴───────────────────────────────────────┘  │
│                                                                         │
│  UTILIZATION INTELLIGENCE                                               │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Current Utilization:  95% (809 of 850 licenses active)          │ │
│  │ Trend:                🟢 Increasing (was 92% 30 days ago)       │ │
│  │ Alert Threshold:      85% (currently exceeding threshold)       │ │
│  │ Last Check:           2025-10-07 09:00:00                       │ │
│  │ Utilization Alerts:   1 active (threshold exceeded)             │ │
│  │                                                                  │ │
│  │ 📊 30-Day Utilization History:                                  │ │
│  │ 100% ┤                                        ╭─────╮           │ │
│  │      │                                   ╭────╯     │           │ │
│  │  95% ┤                              ╭────╯          ╰─── 95%   │ │
│  │      │                         ╭────╯                           │ │
│  │  90% ┤                    ╭────╯                                │ │
│  │      │               ╭────╯                                     │ │
│  │  85% ┤──────────╭────╯ Alert Threshold ─────────────────────   │ │
│  │      └─┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬  │ │
│  │       Sep 7      Sep 17     Sep 27     Oct 7                   │ │
│  │                                                                  │ │
│  │ INSIGHT: High utilization = Expansion opportunity worth ~$76K   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  COMMERCIAL ACTIVITY                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Recent Quotes:                                                   │ │
│  │  • QT_CUST_000001_0 ($45,686) - Expansion, Approved, Ordered   │ │
│  │  • QT_CUST_000001_1 ($127,500) - Renewal, Pending              │ │
│  │                                                                  │ │
│  │ Recent Orders:                                                   │ │
│  │  • ORD_QT_CUST_000001_0 - Shipped, Delivered                   │ │
│  │                                                                  │ │
│  │ Recent Invoices:                                                 │ │
│  │  • INV_ORD_QT_CUST_000001_0 ($1,568,557) - Paid on time        │ │
│  │                                                                  │ │
│  │ Amendments (Last 12 months):                                     │ │
│  │  • 2025-08-15: Quantity increase +50 licenses (+$7,500 ARR)    │ │
│  │  • 2025-03-20: Renewal (no change)                             │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  RENEWAL FORECAST                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Days to Renewal:      433 days (14.4 months)                    │ │
│  │ Renewal Risk Score:   15/100 🟢 Low Risk                        │ │
│  │ Health Score:         95/100 🟢 Healthy                         │ │
│  │ Predicted Renewal:    ✅ 98% probability                        │ │
│  │ Expansion Opportunity: ✅ High (95% utilization)                │ │
│  │ Recommended Action:   Generate expansion quote for +10% seats   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ACTIONS                                                                │
│  [📊 Utilization Deep Dive] [📝 Generate Expansion Quote]              │
│  [📅 View Full Quote History] [💰 View Payment History]                │
│  [📈 Revenue Movement Timeline] [📥 Export Subscription Summary]       │
│  [👥 View Similar Subscriptions] [⚠️ View Utilization Alerts]         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Related Records Queries:**

```sql
-- Quote History for this subscription
SELECT q.quote_id, q.quote_date, q.total_value, q.quote_status, q.win_loss_reason
FROM quotes q
WHERE q.customer_id = 'CUST_000001'
ORDER BY q.quote_date DESC;

-- Utilization Alerts
SELECT ua.alert_id, ua.alert_date, ua.severity, ua.threshold_value, ua.actual_value
FROM utilization_alerts ua
JOIN licenses l ON ua.license_id = l.license_id
WHERE l.customer_id = 'CUST_000001'
    AND ua.resolution_status != 'resolved'
ORDER BY ua.alert_date DESC;

-- Revenue Movements
SELECT rm.movement_date, rm.movement_type, rm.arr_change, rm.reason
FROM revenue_movements rm
JOIN subscriptions s ON rm.subscription_id = s.subscription_id
WHERE s.customer_id = 'CUST_000001'
ORDER BY rm.movement_date DESC;

-- Amendment History
SELECT a.amendment_date, a.amendment_type, a.quantity_change, a.arr_impact
FROM amendments a
WHERE a.subscription_id = 'SUB_LIC_CUST_000001_Meraki'
ORDER BY a.amendment_date DESC;
```

**Drill-Through Options from Layer 3:**
1. **"Utilization Deep Dive"** → Navigate to Utilization Intelligence dashboard, filtered to this license
2. **"Generate Expansion Quote"** → Navigate to Quoting & Renewal tab, pre-filled expansion quote
3. **"View Full Quote History"** → Show all quotes for this account in modal or new tab
4. **"View Payment History"** → Navigate to Billing & Invoicing tab, filtered to this account
5. **"Revenue Movement Timeline"** → Show visual timeline of all ARR changes
6. **"View Similar Subscriptions"** → Return to Layer 2, filtered to similar product/tier/utilization
7. **"View Utilization Alerts"** → Show all active and resolved alerts for this license

---

### **KPI 3: Days Sales Outstanding (DSO)**

**Business Question:** How quickly are we collecting payment after invoicing?

**Calculation:** `(Accounts Receivable Balance / Total Sales) × Days in Period`

**Data Sources:** `invoices`, `payments`, `accounts_receivable`

#### **LAYER 1: Portfolio Executive View**

**Display:**
```
┌────────────────────────────────────────────┐
│  Days Sales Outstanding (DSO)              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                            │
│  42.3 days  ↓ -2.7 days                   │
│  [████████████████████░░░░] <45d Target   │
│                                            │
│  AR Balance:  $892,450                    │
│  Total Sales: $20,336,891 (last 30 days)  │
│                                            │
│  Aging Breakdown:                          │
│  • 0-30 days:   $620,500 (69.5%) 🟢      │
│  • 31-60 days:  $180,200 (20.2%) 🟡      │
│  • 61-90 days:  $71,750 (8.0%) 🔴        │
│  • 90+ days:    $20,000 (2.2%) 🔴        │
│                                            │
│  Status: ✅ Meets Target                  │
│  Trend:  🟢 Improving                     │
└────────────────────────────────────────────┘
```

**Drill-Down Triggers:**
- Click main DSO value (42.3 days) → Layer 2 Customer/Product Breakdown
- Click any aging bucket → Layer 2 filtered to that aging range
- Click "AR Balance" → Layer 2 Accounts Receivable Detail
- Click "90+ days" → Layer 3 Invoice List for overdue invoices

#### **LAYER 2: Dimensional Breakdown**

**View Option A: DSO by Customer Segment**

**SQL Query:**
```sql
SELECT
    CASE
        WHEN a.arr >= 1000000 THEN 'Enterprise'
        WHEN a.arr >= 100000 THEN 'Mid-Market'
        ELSE 'SMB'
    END as segment,
    a.payment_terms,
    COUNT(DISTINCT i.invoice_id) as invoice_count,
    SUM(i.invoice_amount) as total_invoiced,
    SUM(i.amount_paid) as total_paid,
    SUM(i.invoice_amount - i.amount_paid) as ar_balance,
    ROUND(
        (SUM(i.invoice_amount - i.amount_paid) / NULLIF(SUM(i.invoice_amount), 0)) * 30,
        1
    ) as dso_days
FROM invoices i
JOIN orders o ON i.order_id = o.order_id
JOIN quotes q ON o.quote_id = q.quote_id
JOIN accounts a ON q.customer_id = a.id
WHERE i.invoice_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY segment, a.payment_terms
ORDER BY dso_days DESC;
```

**Display:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DSO BY CUSTOMER SEGMENT & PAYMENT TERMS                                    │
├─────────────┬──────────────┬─────────┬──────────────┬──────────┬─────┬──────┤
│ Segment     │ Payment Terms│ Invoices│ Total Invoiced│ AR Balance│ DSO │Status│
├─────────────┼──────────────┼─────────┼──────────────┼──────────┼─────┼──────┤
│ Enterprise  │ Net 60       │ 12      │ $8,450,000   │ $420,000 │ 48.2│ 🟡   │
│ Enterprise  │ Net 45       │ 8       │ $3,280,000   │ $145,000 │ 42.8│ 🟢   │
│ Enterprise  │ Net 30       │ 15      │ $6,120,000   │ $180,000 │ 35.2│ 🟢   │
│ Mid-Market  │ Net 45       │ 18      │ $2,890,000   │ $125,000 │ 41.9│ 🟢   │
│ Mid-Market  │ Net 30       │ 22      │ $3,450,000   │ $150,000 │ 37.5│ 🟢   │
│ SMB         │ Net 30       │ 7       │ $865,000     │ $72,450  │ 56.8│ 🔴   │
│ SMB         │ Due on Rec.  │ 3       │ $280,000     │ $15,000  │ 22.1│ 🟢   │
├─────────────┴──────────────┼─────────┼──────────────┼──────────┼─────┼──────┤
│ **WEIGHTED AVERAGE DSO**   │ 82      │$20,336,891   │$892,450  │42.3 │ 🟢   │
└────────────────────────────┴─────────┴──────────────┴──────────┴─────┴──────┘

📊 INSIGHTS:
• SMB segment has highest DSO (56.8 days) despite Net 30 terms = collection issue
• Enterprise Net 60 accounts performing well within terms (48.2 days)
• $420K AR from Enterprise Net 60 accounts = largest concentration
• $72K AR from SMB = 8.1% of SMB total sales (disproportionately high)

ACTIONS:
[Review SMB Collections] [Enterprise AR Detail] [Payment Terms Analysis] [Trend View]
```

**View Option B: DSO by Product Family**

**SQL Query:**
```sql
SELECT
    l.product_family,
    COUNT(DISTINCT i.invoice_id) as invoice_count,
    SUM(i.invoice_amount) as total_invoiced,
    SUM(i.amount_paid) as total_paid,
    SUM(i.invoice_amount - i.amount_paid) as ar_balance,
    ROUND(
        (SUM(i.invoice_amount - i.amount_paid) / NULLIF(SUM(i.invoice_amount), 0)) * 30,
        1
    ) as dso_days,
    COUNT(DISTINCT CASE WHEN i.payment_status = 'overdue' THEN i.invoice_id END) as overdue_count
FROM invoices i
JOIN orders o ON i.order_id = o.order_id
JOIN quotes q ON o.quote_id = q.quote_id
JOIN quote_line_items qli ON q.quote_id = qli.quote_id
JOIN licenses l ON qli.product = l.product_family
WHERE i.invoice_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY l.product_family
ORDER BY dso_days DESC;
```

**Display:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DSO BY PRODUCT FAMILY                                                       │
├───────────────┬─────────┬──────────────┬──────────┬────────────┬─────┬───────┤
│ Product       │ Invoices│ Total Invoiced│ AR Balance│ Overdue Inv│ DSO │ Status│
├───────────────┼─────────┼──────────────┼──────────┼────────────┼─────┼───────┤
│ Splunk        │ 16      │ $3,814,791   │ $195,000 │ 3          │ 48.5│ 🟡    │
│ Meraki        │ 17      │ $4,280,500   │ $180,000 │ 2          │ 42.1│ 🟢    │
│ ThousandEyes  │ 17      │ $4,210,800   │ $175,000 │ 2          │ 41.6│ 🟢    │
│ Duo           │ 16      │ $4,050,300   │ $168,000 │ 1          │ 41.5│ 🟢    │
│ Umbrella      │ 16      │ $3,980,500   │ $174,450 │ 2          │ 43.9│ 🟢    │
├───────────────┼─────────┼──────────────┼──────────┼────────────┼─────┼───────┤
│ **TOTAL**     │ 82      │$20,336,891   │$892,450  │ 10         │42.3 │ 🟢    │
└───────────────┴─────────┴──────────────┴──────────┴────────────┴─────┴───────┘

📊 INSIGHTS:
• Splunk has highest DSO (48.5 days) with 3 overdue invoices = collection focus area
• 10 overdue invoices across all products = 12.2% of total invoices
• Consistent DSO across products (41.5-48.5 days) = systemic, not product-specific
• $892K total AR with 30-day weighted average collection

ACTIONS:
[View Overdue Invoices] [Splunk AR Detail] [Product Comparison Chart] [Aging Analysis]
```

**View Option C: Aging Analysis**

**SQL Query:**
```sql
SELECT
    CASE
        WHEN DATEDIFF(day, i.invoice_date, CURRENT_DATE) <= 30 THEN '0-30 days'
        WHEN DATEDIFF(day, i.invoice_date, CURRENT_DATE) <= 60 THEN '31-60 days'
        WHEN DATEDIFF(day, i.invoice_date, CURRENT_DATE) <= 90 THEN '61-90 days'
        ELSE '90+ days'
    END as aging_bucket,
    COUNT(DISTINCT i.invoice_id) as invoice_count,
    SUM(i.invoice_amount - i.amount_paid) as ar_balance,
    ROUND(
        (SUM(i.invoice_amount - i.amount_paid) /
         (SELECT SUM(invoice_amount - amount_paid) FROM invoices WHERE payment_status != 'paid')) * 100,
        1
    ) as percent_of_ar
FROM invoices i
WHERE i.payment_status != 'paid'
GROUP BY aging_bucket
ORDER BY
    CASE aging_bucket
        WHEN '0-30 days' THEN 1
        WHEN '31-60 days' THEN 2
        WHEN '61-90 days' THEN 3
        ELSE 4
    END;
```

**Display:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ACCOUNTS RECEIVABLE AGING ANALYSIS                                          │
├───────────────┬─────────────┬──────────────┬─────────────┬──────────────────┤
│ Aging Bucket  │ Invoice Count│ AR Balance   │ % of Total AR│ Status          │
├───────────────┼─────────────┼──────────────┼─────────────┼──────────────────┤
│ 0-30 days     │ 57          │ $620,500     │ 69.5%       │ 🟢 Current       │
│ 31-60 days    │ 15          │ $180,200     │ 20.2%       │ 🟡 Watch Closely │
│ 61-90 days    │ 7           │ $71,750      │ 8.0%        │ 🔴 Overdue       │
│ 90+ days      │ 3           │ $20,000      │ 2.2%        │ 🔴 Critical      │
├───────────────┼─────────────┼──────────────┼─────────────┼──────────────────┤
│ **TOTAL**     │ 82          │ $892,450     │ 100.0%      │                  │
└───────────────┴─────────────┴──────────────┴─────────────┴──────────────────┘

AR AGING VISUALIZATION:

 0-30 days │████████████████████████████████████████████████████████ 69.5%
31-60 days │████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20.2%
61-90 days │██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 8.0%
90+ days   │█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 2.2%

📊 INSIGHTS:
• 69.5% of AR is current (<30 days) = healthy collection performance
• 10.2% of AR is >60 days overdue = $91,750 requiring immediate attention
• 3 invoices >90 days = highest priority for collections team
• 15 invoices in 31-60 day bucket = watch for slippage to overdue

RECOMMENDED ACTIONS:
• Priority 1: Contact 3 customers with 90+ day balances ($20K total)
• Priority 2: Follow up on 7 customers with 61-90 day balances ($71.7K)
• Priority 3: Monitor 15 customers approaching 60-day mark ($180.2K)

[View 90+ Day Detail] [61-90 Day Detail] [31-60 Day Detail] [Export AR Report]
```

**Slice-and-Dice Filters (All Views):**
- **Customer Segment:** Enterprise, Mid-Market, SMB
- **Payment Terms:** Net 30, Net 45, Net 60, Due on Receipt
- **Product Family:** Meraki, Duo, Umbrella, ThousandEyes, Splunk
- **Geography:** Americas, EMEA, APAC
- **Payment Status:** Paid, Partial, Unpaid, Overdue, Disputed
- **Aging Bucket:** 0-30, 31-60, 61-90, 90+ days
- **Invoice Amount Range:** <$10K, $10-50K, $50-100K, $100K+
- **Time Period:** Last 30 days, Last Quarter, Last Year

**Drill-Down Triggers:**
- Click any segment/product row → Layer 3 Invoice List
- Click "Overdue Count" → Layer 3 filtered to overdue invoices
- Click aging bucket → Layer 3 invoices in that aging range
- Click AR Balance → Layer 3 accounts receivable detail

#### **LAYER 3: Invoice-Level Detail**

**SQL Query:**
```sql
SELECT
    i.invoice_id,
    i.invoice_date,
    i.due_date,
    i.invoice_amount,
    i.amount_paid,
    (i.invoice_amount - i.amount_paid) as balance_due,
    i.payment_status,
    i.payment_terms_days,
    DATEDIFF(day, i.invoice_date, CURRENT_DATE) as days_outstanding,
    DATEDIFF(day, i.due_date, CURRENT_DATE) as days_overdue,
    a.id as customer_id,
    a.name as customer_name,
    a.tier as customer_tier,
    a.payment_terms,
    o.order_id,
    q.quote_id,
    l.product_family,
    p.payment_id,
    p.payment_date,
    p.payment_amount,
    p.payment_method,
    p.payment_status as payment_transaction_status
FROM invoices i
JOIN orders o ON i.order_id = o.order_id
JOIN quotes q ON o.quote_id = q.quote_id
JOIN accounts a ON q.customer_id = a.id
LEFT JOIN quote_line_items qli ON q.quote_id = qli.quote_id
LEFT JOIN licenses l ON qli.product = l.product_family
LEFT JOIN payments p ON i.invoice_id = p.invoice_id
WHERE DATEDIFF(day, i.due_date, CURRENT_DATE) > 60  -- 61-90 day bucket from Layer 2
ORDER BY days_overdue DESC;
```

**Display: Invoice Detail Card**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  INVOICE DETAIL: INV_ORD_QT_CUST_000015_0                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                         │
│  INVOICE SUMMARY                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Invoice ID:         INV_ORD_QT_CUST_000015_0                     │ │
│  │ Customer:           GlobalTech Solutions (CUST_000015)           │ │
│  │ Customer Tier:      Mid-Market                                   │ │
│  │ Product:            Splunk ES Premier                            │ │
│  │                                                                  │ │
│  │ Invoice Date:       2025-07-25                                   │ │
│  │ Due Date:           2025-08-24 (Net 30)                         │ │
│  │ Days Outstanding:   74 days                                      │ │
│  │ Days Overdue:       🔴 44 days (61-90 day bucket)               │ │
│  │                                                                  │ │
│  │ Invoice Amount:     $125,000.00                                  │ │
│  │ Amount Paid:        $0.00                                        │ │
│  │ Balance Due:        🔴 $125,000.00                              │ │
│  │                                                                  │ │
│  │ Payment Status:     🔴 OVERDUE                                   │ │
│  │ Payment Terms:      Net 30                                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ORDER & QUOTE DETAILS                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Order ID:           ORD_QT_CUST_000015_0                        │ │
│  │ Order Date:         2025-07-20                                   │ │
│  │ Quote ID:           QT_CUST_000015_0                            │ │
│  │ Quote Date:         2025-07-15                                   │ │
│  │ Quote Status:       Approved & Ordered                           │ │
│  │ Order Status:       ✅ Completed                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  PAYMENT HISTORY                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ No payments received yet                                         │ │
│  │                                                                  │ │
│  │ Payment Attempts: 0                                              │ │
│  │ Failed Payments:  0                                              │ │
│  │ Last Contact:     2025-09-15 (Collections reminder sent)        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  CUSTOMER ACCOUNT STATUS                                                │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Total Account ARR:       $485,000                                │ │
│  │ Total AR Balance:        $125,000 (this invoice only)            │ │
│  │ Other Overdue Invoices:  0                                       │ │
│  │ Payment History:         3 prior invoices, all paid on time      │ │
│  │ Health Score:            72/100 🟡 (declining due to overdue)   │ │
│  │ Renewal Risk Score:      55/100 🟡 (elevated due to payment)    │ │
│  │ Contract End Date:       2026-03-15 (157 days)                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  UTILIZATION INTELLIGENCE                                               │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Splunk ES Premier:   65% utilization (declining from 82%)       │ │
│  │ Trend:               🔴 Decreasing                               │ │
│  │ Last Activity:       2025-09-28 (9 days ago)                    │ │
│  │                                                                  │ │
│  │ INSIGHT: Low/declining utilization + payment delay = high churn │ │
│  │          risk. Immediate CSM engagement recommended.             │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  COLLECTIONS ACTIVITY LOG                                               │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 2025-09-15: Collections reminder email sent                     │ │
│  │ 2025-09-01: First overdue notice (30 days past due)             │ │
│  │ 2025-08-24: Invoice due date (no payment received)              │ │
│  │ 2025-07-25: Invoice generated and sent                          │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  🚨 RECOMMENDED ACTIONS                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Priority: 🔴 HIGH (61-90 days overdue + declining utilization)  │ │
│  │                                                                  │ │
│  │ 1. Immediate phone call to AP contact + CFO escalation          │ │
│  │ 2. CSM engagement to understand utilization decline             │ │
│  │ 3. Offer payment plan if cash flow issue                        │ │
│  │ 4. Consider credit hold for future orders                       │ │
│  │ 5. Flag account for retention risk review                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ACTIONS                                                                │
│  [📞 Log Collections Call] [💳 Record Payment] [📝 Add Note]           │
│  [📧 Send Reminder] [⚠️ Credit Hold] [🔄 Dispute Resolution]          │
│  [👥 Notify CSM] [📊 View Customer Dashboard] [📥 Export Details]      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Related Records Display:**

```sql
-- All invoices for this customer
SELECT i.invoice_id, i.invoice_date, i.invoice_amount, i.payment_status
FROM invoices i
JOIN orders o ON i.order_id = o.order_id
JOIN quotes q ON o.quote_id = q.quote_id
WHERE q.customer_id = 'CUST_000015'
ORDER BY i.invoice_date DESC;

-- Payment attempts for this invoice
SELECT p.payment_id, p.payment_date, p.payment_amount, p.payment_status
FROM payments p
WHERE p.invoice_id = 'INV_ORD_QT_CUST_000015_0'
ORDER BY p.payment_date DESC;

-- Customer utilization trend
SELECT uh.snapshot_date, uh.license_utilization_pct
FROM utilization_history uh
JOIN licenses l ON uh.license_id = l.license_id
WHERE l.customer_id = 'CUST_000015'
    AND uh.snapshot_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY uh.snapshot_date;

-- Customer account receivable summary
SELECT ar.customer_id, ar.total_ar_balance, ar.aging_0_30, ar.aging_31_60,
       ar.aging_61_90, ar.aging_over_90
FROM accounts_receivable ar
WHERE ar.customer_id = 'CUST_000015';
```

**Drill-Through Options from Layer 3:**
1. **"View Customer Dashboard"** → Navigate to full account view with all products/subscriptions
2. **"Notify CSM"** → Send alert to assigned CSM about payment + utilization issue
3. **"View Customer Dashboard"** → Full account 360° view
4. **"Check Utilization"** → Navigate to Utilization Intelligence for this customer
5. **"Payment History"** → Show all payments across all invoices for this customer
6. **"Credit Hold"** → Open credit hold workflow (prevents new orders)
7. **"Dispute Resolution"** → Initiate invoice dispute investigation workflow

---

### **KPI 4-15: Continued Structure**

Due to length constraints, I'll provide the complete structure for the remaining 12 KPIs in a summarized format. Each follows the same 3-layer pattern:

---

## **KPI 4: Deferred Revenue Balance**

**LAYER 1:** Company-wide deferred revenue balance with trend
**LAYER 2:** Breakdown by product, contract term, billing frequency
**LAYER 3:** Subscription-level revenue recognition schedules

**Key Drill-Throughs:**
- Deferred Revenue → Revenue Recognition Schedule (monthly detail)
- High Deferred Balance → Subscription amendments (mid-term changes)
- Recognition Variance → Invoice reconciliation

---

## **KPI 5: Quote-to-Cash Cycle Time**

**LAYER 1:** Average days from quote → order → invoice → payment
**LAYER 2:** Cycle time by product, segment, deal complexity
**LAYER 3:** Individual quote-to-cash tracking records with stage timestamps

**Key Drill-Throughs:**
- Long Cycle Time → Bottleneck analysis (which stage is delayed)
- Quote Stage → Quote approval workflow
- Order Stage → Order fulfillment status
- Invoice Stage → Payment collection activity

**SQL for Layer 3:**
```sql
SELECT
    qtc.tracking_id,
    qtc.customer_id,
    a.name as customer_name,
    qtc.quote_id,
    qtc.order_id,
    qtc.invoice_id,
    qtc.quote_date,
    qtc.order_date,
    qtc.invoice_date,
    qtc.payment_date,
    qtc.quote_to_order_days,
    qtc.order_to_invoice_days,
    qtc.invoice_to_payment_days,
    qtc.total_cycle_time_days,
    qtc.bottleneck_stage,
    qtc.total_value
FROM quote_to_cash_tracking qtc
JOIN accounts a ON qtc.customer_id = a.id
WHERE qtc.total_cycle_time_days > 45  -- Threshold from Layer 2
ORDER BY qtc.total_cycle_time_days DESC;
```

---

## **KPI 6: Renewal Rate (GRR - Gross Revenue Retention)**

**LAYER 1:** Overall renewal rate with churn breakdown
**LAYER 2:** Renewal rate by product, segment, contract term
**LAYER 3:** Account-level renewal status with risk indicators

**Key Drill-Throughs:**
- Low Renewal Rate → Churn accounts with reason codes
- Renewal Window → Quote activity for upcoming renewals
- High Risk → Utilization intelligence + CSM engagement history

---

## **KPI 7: Revenue Recognition Accuracy**

**LAYER 1:** Variance between expected vs. actual recognition
**LAYER 2:** Accuracy by product, accounting period, contract type
**LAYER 3:** Subscription-level recognition schedules with variance detail

**SQL for Layer 2:**
```sql
SELECT
    l.product_family,
    COUNT(DISTINCT rrs.subscription_id) as subscription_count,
    SUM(JSON_EXTRACT(rrs.monthly_schedule, '$[*].expected_amount')) as total_expected,
    SUM(JSON_EXTRACT(rrs.monthly_schedule, '$[*].actual_amount')) as total_actual,
    SUM(JSON_EXTRACT(rrs.monthly_schedule, '$[*].variance')) as total_variance,
    ROUND(
        ABS(SUM(JSON_EXTRACT(rrs.monthly_schedule, '$[*].variance'))) /
        NULLIF(SUM(JSON_EXTRACT(rrs.monthly_schedule, '$[*].expected_amount')), 0) * 100,
        2
    ) as variance_pct
FROM revenue_recognition_schedule rrs
JOIN subscriptions s ON rrs.subscription_id = s.subscription_id
JOIN licenses l ON s.license_id = l.license_id
WHERE rrs.recognition_status = 'active'
GROUP BY l.product_family
ORDER BY variance_pct DESC;
```

---

## **KPI 8: Expansion ARR Contribution**

**LAYER 1:** Total expansion ARR with growth rate
**LAYER 2:** Expansion sources (upsell, cross-sell, usage growth) by segment
**LAYER 3:** Account-level expansion movements with amendment detail

**Key Drill-Throughs:**
- Expansion Movement → Amendment records (what changed)
- High Expansion → Quote history (expansion quotes)
- Utilization-Driven → Utilization alerts that triggered expansion

---

## **KPI 9: Renewal Quote Velocity**

**LAYER 1:** Average time from renewal trigger to quote delivery
**LAYER 2:** Velocity by deal desk team, quote complexity, product
**LAYER 3:** Individual renewal quotes with approval workflow timestamps

**SQL for Layer 3:**
```sql
SELECT
    q.quote_id,
    q.customer_id,
    a.name as customer_name,
    q.quote_date,
    q.quote_type,
    q.total_value,
    q.approval_status,
    q.approval_date,
    DATEDIFF(day, q.quote_date, q.approval_date) as approval_days,
    s.subscription_end_date as renewal_date,
    DATEDIFF(day, s.subscription_end_date - INTERVAL '90 days', q.quote_date) as days_before_renewal,
    q.quote_status,
    q.win_loss_reason
FROM quotes q
JOIN accounts a ON q.customer_id = a.id
JOIN subscriptions s ON q.customer_id = s.customer_id
WHERE q.quote_type = 'renewal'
    AND DATEDIFF(day, q.quote_date, q.approval_date) > 5  -- SLA threshold
ORDER BY approval_days DESC;
```

---

## **KPI 10: Quote Accuracy Rate**

**LAYER 1:** % of quotes without billing/fulfillment errors
**LAYER 2:** Accuracy by product, deal complexity, deal desk agent
**LAYER 3:** Error records with root cause categorization

**Key Drill-Throughs:**
- Low Accuracy → Order processing errors
- Quote Errors → Invoice disputes
- Pricing Errors → Amendment corrections

---

## **KPI 11: Order Processing Error Rate**

**LAYER 1:** % of orders with configuration/fulfillment errors
**LAYER 2:** Error rate by product, order type, fulfillment channel
**LAYER 3:** Individual order error logs with resolution status

**SQL for Layer 2:**
```sql
SELECT
    l.product_family,
    o.order_complexity,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(CASE WHEN o.processing_errors > 0 THEN 1 ELSE 0 END) as orders_with_errors,
    ROUND(
        SUM(CASE WHEN o.processing_errors > 0 THEN 1 ELSE 0 END) /
        NULLIF(COUNT(DISTINCT o.order_id), 0) * 100,
        2
    ) as error_rate_pct
FROM orders o
JOIN quotes q ON o.quote_id = q.quote_id
JOIN quote_line_items qli ON q.quote_id = qli.quote_id
JOIN licenses l ON qli.product = l.product_family
GROUP BY l.product_family, o.order_complexity
ORDER BY error_rate_pct DESC;
```

---

## **KPI 12: Invoice Dispute Rate**

**LAYER 1:** % of invoices disputed with resolution time
**LAYER 2:** Dispute rate by product, customer segment, dispute category
**LAYER 3:** Individual disputed invoices with resolution workflow

**Key Drill-Throughs:**
- Disputed Invoice → Order details (source of error)
- Dispute Resolution → Payment history (when resolved and paid)
- High Dispute Customer → Account review (systemic issue?)

---

## **KPI 13: Payment Collection Rate**

**LAYER 1:** % of invoices paid within terms
**LAYER 2:** Collection rate by segment, payment terms, product
**LAYER 3:** Invoice payment history with retry attempts

**SQL for Layer 3:**
```sql
SELECT
    i.invoice_id,
    i.invoice_date,
    i.due_date,
    i.invoice_amount,
    i.amount_paid,
    i.payment_status,
    a.name as customer_name,
    a.payment_terms,
    p.payment_id,
    p.payment_date,
    p.payment_amount,
    p.payment_method,
    p.payment_status as payment_transaction_status,
    p.failure_reason,
    DATEDIFF(day, i.due_date, p.payment_date) as days_late,
    CASE
        WHEN p.payment_date <= i.due_date THEN 'On Time'
        WHEN p.payment_date <= i.due_date + INTERVAL '15 days' THEN 'Late'
        ELSE 'Very Late'
    END as payment_timing
FROM invoices i
LEFT JOIN payments p ON i.invoice_id = p.invoice_id
JOIN orders o ON i.order_id = o.order_id
JOIN quotes q ON o.quote_id = q.quote_id
JOIN accounts a ON q.customer_id = a.id
WHERE i.payment_status IN ('paid', 'partial')
ORDER BY days_late DESC NULLS LAST;
```

---

## **KPI 14: Amendment Processing Time**

**LAYER 1:** Average days to process subscription changes
**LAYER 2:** Processing time by amendment type, product, complexity
**LAYER 3:** Individual amendments with approval workflow detail

**SQL for Layer 2:**
```sql
SELECT
    a.amendment_type,
    COUNT(DISTINCT a.amendment_id) as amendment_count,
    AVG(a.processing_time_hours) as avg_processing_hours,
    MAX(a.processing_time_hours) as max_processing_hours,
    MIN(a.processing_time_hours) as min_processing_hours,
    SUM(CASE WHEN a.processing_time_hours <= 48 THEN 1 ELSE 0 END) as within_sla_count,
    ROUND(
        SUM(CASE WHEN a.processing_time_hours <= 48 THEN 1 ELSE 0 END) /
        NULLIF(COUNT(DISTINCT a.amendment_id), 0) * 100,
        2
    ) as sla_compliance_pct
FROM amendments a
GROUP BY a.amendment_type
ORDER BY avg_processing_hours DESC;
```

---

## **KPI 15: Mid-Cycle Utilization Alerts**

**LAYER 1:** Count and severity of utilization threshold breaches
**LAYER 2:** Alerts by product, severity, resolution status
**LAYER 3:** Individual alert details with utilization trend analysis

**SQL for Layer 3:**
```sql
SELECT
    ua.alert_id,
    ua.license_id,
    l.customer_id,
    a.name as customer_name,
    l.product_family,
    l.license_count,
    ua.alert_date,
    ua.alert_type,
    ua.severity,
    ua.threshold_value,
    ua.actual_value,
    ua.variance_pct,
    ua.alert_message,
    ua.resolution_status,
    ua.resolution_date,
    ua.action_taken,
    DATEDIFF(day, ua.alert_date, COALESCE(ua.resolution_date, CURRENT_DATE)) as days_open,
    s.subscription_end_date,
    DATEDIFF(day, CURRENT_DATE, s.subscription_end_date) as days_to_renewal
FROM utilization_alerts ua
JOIN licenses l ON ua.license_id = l.license_id
JOIN accounts a ON l.customer_id = a.id
JOIN subscriptions s ON l.license_id = s.license_id
WHERE ua.resolution_status != 'resolved'
ORDER BY
    CASE ua.severity
        WHEN 'critical' THEN 1
        WHEN 'warning' THEN 2
        ELSE 3
    END,
    days_open DESC;
```

---

## Universal Slice-and-Dice Dimensions

These dimensions apply across ALL 15 KPIs for consistent filtering:

### **1. Customer Dimensions**

```sql
-- Customer Segment
CASE
    WHEN a.arr >= 1000000 THEN 'Enterprise'
    WHEN a.arr >= 100000 THEN 'Mid-Market'
    ELSE 'SMB'
END as customer_segment

-- Geography
a.geography_region  -- Americas, EMEA, APAC
a.geography_country

-- Industry
a.industry  -- Technology, Healthcare, Financial Services, etc.

-- Customer Tier
a.tier  -- Strategic, Enterprise, Mid-Market, SMB

-- Lifecycle Stage
CASE
    WHEN DATEDIFF(month, first_subscription_date, CURRENT_DATE) <= 6 THEN 'New (<6 months)'
    WHEN DATEDIFF(month, first_subscription_date, CURRENT_DATE) <= 24 THEN 'Growth (6-24 months)'
    ELSE 'Mature (24+ months)'
END as lifecycle_stage

-- Health Score Band
CASE
    WHEN a.health_score >= 80 THEN 'Healthy (80-100)'
    WHEN a.health_score >= 60 THEN 'Moderate (60-79)'
    WHEN a.health_score >= 40 THEN 'At Risk (40-59)'
    ELSE 'Critical (<40)'
END as health_band
```

### **2. Product Dimensions**

```sql
-- Product Family
l.product_family  -- Meraki, Duo, Umbrella, ThousandEyes, Splunk

-- Product Tier
l.tier  -- Essentials, Advantage, Premier, Enterprise, etc.

-- License Type
l.license_type  -- Subscription, Perpetual, Hybrid

-- Product Portfolio Breadth
(SELECT COUNT(DISTINCT product_family)
 FROM licenses
 WHERE customer_id = a.id) as product_count_per_customer
```

### **3. Commercial Process Dimensions**

```sql
-- Quote Type
q.quote_type  -- New, Renewal, Expansion, Upsell, Cross-sell

-- Deal Complexity
q.deal_complexity  -- Simple, Moderate, Complex

-- Approval Status
q.approval_status  -- Auto-approved, Manager, Director, VP, C-Level

-- Order Status
o.order_status  -- Pending, Processing, Shipped, Delivered, Completed, Error

-- Invoice Status
i.payment_status  -- Paid, Partial, Unpaid, Overdue, Disputed

-- Subscription Status
s.subscription_status  -- Active, Expired, Cancelled, Grace Period
```

### **4. Financial Dimensions**

```sql
-- Contract Term Length
s.contract_term_months  -- 12, 24, 36, 60 months

-- Billing Frequency
s.billing_frequency  -- Monthly, Quarterly, Annual

-- Payment Terms
a.payment_terms  -- Net 30, Net 45, Net 60, Due on Receipt

-- Contract Value Band
CASE
    WHEN s.arr >= 500000 THEN '>$500K'
    WHEN s.arr >= 100000 THEN '$100-500K'
    WHEN s.arr >= 50000 THEN '$50-100K'
    ELSE '<$50K'
END as contract_value_band
```

### **5. Utilization Dimensions**

```sql
-- Utilization Band
CASE
    WHEN l.utilization >= 90 THEN 'Expansion Ready (>90%)'
    WHEN l.utilization >= 75 THEN 'High (75-90%)'
    WHEN l.utilization >= 50 THEN 'Medium (50-75%)'
    WHEN l.utilization >= 30 THEN 'Low (30-50%)'
    ELSE 'Critical (<30%)'
END as utilization_band

-- Utilization Trend
l.utilization_trend  -- Increasing, Stable, Decreasing

-- Alert Status
CASE
    WHEN EXISTS (SELECT 1 FROM utilization_alerts ua
                 WHERE ua.license_id = l.license_id
                 AND ua.resolution_status != 'resolved')
    THEN 'Has Active Alert'
    ELSE 'No Alerts'
END as alert_status
```

### **6. Time Dimensions**

```sql
-- Time Period
DATE_TRUNC('month', event_date) as month
DATE_TRUNC('quarter', event_date) as quarter
DATE_TRUNC('year', event_date) as year

-- Renewal Window
CASE
    WHEN DATEDIFF(day, CURRENT_DATE, s.subscription_end_date) <= 30 THEN '0-30 days'
    WHEN DATEDIFF(day, CURRENT_DATE, s.subscription_end_date) <= 60 THEN '31-60 days'
    WHEN DATEDIFF(day, CURRENT_DATE, s.subscription_end_date) <= 90 THEN '61-90 days'
    WHEN DATEDIFF(day, CURRENT_DATE, s.subscription_end_date) <= 120 THEN '91-120 days'
    ELSE '>120 days'
END as renewal_window

-- Fiscal Period
CONCAT('FY', YEAR(event_date), '-Q', QUARTER(event_date)) as fiscal_quarter
```

---

## Cross-KPI Drill-Through Paths

### **Path 1: Revenue Performance → Utilization Analysis**

**Starting Point:** NRR or ARR showing declining revenue
**Drill-Through:** Navigate to Utilization Intelligence
**Purpose:** Understand if low utilization is driving churn/contraction

```
Layer 1: NRR = 102% (below 110% target)
    ↓ Drill to Layer 2: Product breakdown shows Splunk NRR = 98%
        ↓ Drill-Through: "Check Utilization" for Splunk customers
            → Lands on Utilization Intelligence Layer 2: Splunk at 72% avg utilization
                ↓ Drill to Layer 3: 15 Splunk customers <60% utilization
                    → Action: CSM engagement + usage training
```

### **Path 2: Cash Collection → Customer Health**

**Starting Point:** DSO showing slow collection
**Drill-Through:** Navigate to Customer Health/Risk Analysis
**Purpose:** Determine if payment delays correlate with churn risk

```
Layer 1: DSO = 55 days (above 45-day target)
    ↓ Drill to Layer 2: SMB segment DSO = 68 days
        ↓ Drill to Layer 3: Customer "GlobalTech" 80 days overdue
            ↓ Drill-Through: "View Customer Dashboard"
                → Shows: Health Score 55/100, Utilization 58%, Renewal in 60 days
                    → Action: Payment plan + CSM intervention before renewal
```

### **Path 3: Quote Activity → License Consumption**

**Starting Point:** Renewal Quote created
**Drill-Through:** Navigate to Utilization to validate expansion opportunity
**Purpose:** Ensure expansion quotes are backed by actual usage data

```
Layer 1: Renewal Quote Velocity = 6 days (above 5-day SLA)
    ↓ Drill to Layer 2: Enterprise expansion quotes averaging 8 days
        ↓ Drill to Layer 3: Quote QT_CUST_000025_2 for +200 Duo seats
            ↓ Drill-Through: "Validate with Utilization Data"
                → Shows: Current 1000 seats at 96% utilization, trending up
                    → Justifies expansion, proceed with quote approval
```

### **Path 4: Order Processing Errors → Quote Accuracy**

**Starting Point:** High order error rate
**Drill-Through:** Navigate to Quote Configuration Analysis
**Purpose:** Identify if errors originate at quoting stage

```
Layer 1: Order Error Rate = 12% (above 8% threshold)
    ↓ Drill to Layer 2: Meraki orders have 18% error rate
        ↓ Drill to Layer 3: Order ORD_QT_CUST_000032_0 - config error
            ↓ Drill-Through: "View Source Quote"
                → Quote shows incorrect product tier selected
                    → Action: Deal desk training + quote validation rules
```

### **Path 5: Utilization Alerts → Renewal Risk**

**Starting Point:** Critical utilization alert
**Drill-Through:** Navigate to Renewal Pipeline
**Purpose:** Flag accounts with both low utilization and upcoming renewal

```
Layer 1: 45 Critical Utilization Alerts (>30 threshold breaches)
    ↓ Drill to Layer 2: 18 alerts are Umbrella customers <50% utilization
        ↓ Drill to Layer 3: Customer "HealthCorp" at 38% utilization
            ↓ Drill-Through: "Check Renewal Status"
                → Shows: Renewal in 45 days, renewal risk score 75/100
                    → Action: Urgent CSM call + usage review + potential downgrade
```

---

## Technical Implementation Guide

### **Database Views for Drill-Down Performance**

```sql
-- Pre-aggregated Layer 1 view (Portfolio Executive)
CREATE MATERIALIZED VIEW mv_kpi_portfolio_summary AS
SELECT
    'NRR' as kpi_name,
    CURRENT_DATE as calculation_date,
    SUM(a.starting_arr) as starting_arr,
    SUM(a.expansion_arr) as expansion_arr,
    SUM(a.churn_arr) as churn_arr,
    SUM(a.contraction_arr) as contraction_arr,
    ROUND(
        ((SUM(a.starting_arr) + SUM(a.expansion_arr) -
          SUM(a.churn_arr) - SUM(a.contraction_arr)) /
         NULLIF(SUM(a.starting_arr), 0)) * 100,
        2
    ) as nrr_percentage
FROM accounts a
WHERE a.fiscal_quarter = '2025-Q1'
UNION ALL
SELECT
    'ARR' as kpi_name,
    CURRENT_DATE as calculation_date,
    NULL as starting_arr,
    NULL as expansion_arr,
    NULL as churn_arr,
    NULL as contraction_arr,
    SUM(s.arr) as arr_value
FROM subscriptions s
WHERE s.subscription_status = 'active'
-- ... continue for all 15 KPIs
;

-- Refresh schedule: Daily at 2am
REFRESH MATERIALIZED VIEW mv_kpi_portfolio_summary;

-- Pre-aggregated Layer 2 view (Product/Segment Breakdown)
CREATE MATERIALIZED VIEW mv_kpi_product_breakdown AS
SELECT
    'NRR' as kpi_name,
    l.product_family,
    CASE
        WHEN a.arr >= 1000000 THEN 'Enterprise'
        WHEN a.arr >= 100000 THEN 'Mid-Market'
        ELSE 'SMB'
    END as customer_segment,
    SUM(a.starting_arr) as starting_arr,
    SUM(a.expansion_arr) as expansion_arr,
    SUM(a.churn_arr) as churn_arr,
    SUM(a.contraction_arr) as contraction_arr,
    ROUND(
        ((SUM(a.starting_arr) + SUM(a.expansion_arr) -
          SUM(a.churn_arr) - SUM(a.contraction_arr)) /
         NULLIF(SUM(a.starting_arr), 0)) * 100,
        2
    ) as nrr_percentage
FROM accounts a
JOIN licenses l ON a.id = l.customer_id
WHERE a.fiscal_quarter = '2025-Q1'
GROUP BY l.product_family, customer_segment
-- ... continue for all KPIs and dimensions
;

-- Refresh schedule: Hourly during business hours
```

### **API Endpoints for Drill-Down Navigation**

```javascript
// RESTful API structure

// Layer 1: Portfolio Executive View
GET /api/v1/kpis/summary
Response: {
  "nrr": { "value": 114.83, "trend": "up", "target": 110, "status": "green" },
  "arr": { "value": 20336891, "trend": "up", "target": 18303201, "status": "green" },
  // ... all 15 KPIs
}

// Layer 2: Dimensional Breakdown
GET /api/v1/kpis/nrr/breakdown?dimension=product&segment=enterprise
Response: {
  "dimension": "product",
  "filters": { "segment": "enterprise" },
  "data": [
    { "product": "Meraki", "nrr": 118.2, "starting_arr": 7200000, ... },
    { "product": "Duo", "nrr": 116.5, "starting_arr": 6800000, ... },
    // ...
  ]
}

// Layer 3: Transaction Detail
GET /api/v1/kpis/nrr/accounts?product=Meraki&nrr_min=115
Response: {
  "filters": { "product": "Meraki", "nrr_min": 115 },
  "count": 12,
  "accounts": [
    {
      "id": "CUST_000001",
      "name": "TechCorp Industries",
      "starting_arr": 1522871,
      "expansion_arr": 45686,
      "nrr": 103.0,
      // ... full account detail
    },
    // ...
  ]
}

// Cross-KPI Drill-Through
GET /api/v1/drill-through/utilization?source_kpi=nrr&customer_id=CUST_000001
Response: {
  "source": { "kpi": "nrr", "customer_id": "CUST_000001" },
  "target": { "dashboard": "utilization_intelligence" },
  "data": {
    "licenses": [ /* utilization data for this customer */ ],
    "alerts": [ /* active utilization alerts */ ]
  }
}
```

### **Frontend Component Structure (React Example)**

```jsx
// KPI Dashboard Component Hierarchy

<CommercialOpsDashboard>
  <FilterPanel>
    <CustomerSegmentFilter />
    <ProductFamilyFilter />
    <TimeRangeFilter />
    <UtilizationBandFilter />
  </FilterPanel>

  <BreadcrumbTrail path={["Portfolio", "NRR", "Meraki", "Enterprise", "CUST_000001"]} />

  <KPIGridLayer1>
    <KPICard
      kpi="nrr"
      value={114.83}
      trend="up"
      onDrillDown={() => navigateToLayer2("nrr")}
    />
    <KPICard kpi="arr" value={20336891} ... />
    // ... 15 KPI cards
  </KPIGridLayer1>

  // Dynamically rendered based on drill-down level
  {currentLayer === 2 && (
    <KPIBreakdownLayer2
      kpi={selectedKPI}
      dimension={selectedDimension}
      onDrillDown={(value) => navigateToLayer3(selectedKPI, value)}
    />
  )}

  {currentLayer === 3 && (
    <KPIDetailLayer3
      kpi={selectedKPI}
      filters={appliedFilters}
      onDrillThrough={(targetKPI) => crossKPIDrillThrough(targetKPI)}
    />
  )}
</CommercialOpsDashboard>
```

### **Performance Optimization Strategies**

1. **Data Caching:**
   - Layer 1: Cache for 15 minutes (frequent updates not critical)
   - Layer 2: Cache for 5 minutes (moderately dynamic)
   - Layer 3: No caching (real-time transaction data)

2. **Lazy Loading:**
   - Load Layer 1 immediately on dashboard open
   - Load Layer 2 data only when user drills down
   - Load Layer 3 data on-demand per record

3. **Query Optimization:**
   - Use covering indexes on drill-down join columns
   - Partition large tables (utilization_history) by date
   - Use query result pagination (50-100 records per page)

4. **Progressive Rendering:**
   - Show skeleton screens while data loads
   - Stream Layer 3 results as they become available
   - Use virtual scrolling for large result sets

---

## Conclusion

This comprehensive 3-layer drill-down architecture provides Commercial Operations teams with:

✅ **Unified Visibility:** Single dashboard connecting Quote-to-Cash processes with license utilization
✅ **Actionable Insights:** Each drill-down layer leads to specific operational decisions
✅ **Contextual Navigation:** Breadcrumbs and filters maintain context across layers
✅ **Cross-Process Intelligence:** Drill-through paths connect related KPIs and workflows
✅ **Performance at Scale:** Pre-aggregation and caching ensure responsive experience with 12K+ records

**Next Steps:**
1. Validate dimension hierarchy with Cisco Commercial Operations stakeholders
2. Prototype 3-5 key drill-down paths with synthetic data
3. Performance test with realistic data volumes
4. Implement role-based access controls for sensitive financial data
5. Create user training materials for drill-down navigation patterns

---

**Document End**
