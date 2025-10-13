# Persona: Sales Expansion Leader

## Focus Areas & Objectives

**Primary Responsibility**: Drive cross-sell, upsell, and multi-product penetration to maximize share-of-wallet and ARR growth from existing customers

**Key Business Questions**:
- Which customers have the highest expansion potential?
- What white space exists in our product portfolio coverage?
- Which accounts are ready for cross-sell conversations?
- How are we performing on NRR and expansion ARR growth?
- Which product combinations drive the best outcomes?

---

## Level 1 — Strategic View

**Dashboard Name**: Sales Expansion Command Center

**Primary KPIs (10)**:

| KPI | Definition | Target | Data Source |
|-----|------------|--------|-------------|
| **Net Revenue Retention (NRR)** | Revenue retention + expansion from existing cohort | ≥ 110% | `revenue_movements` (expansion - churn) / prior ARR |
| **Expansion ARR** | Total ARR from upsell/cross-sell in period | Growth trend (QoQ +15%) | `revenue_movements WHERE movement_type = 'expansion'` |
| **Multi-Product Penetration Rate** | % of customers with 2+ products | ≥ 40% | `accounts with multiple licenses` |
| **White Space Opportunity Value** | Estimated ARR from identified product gaps | ≥ $8M | Derived from product coverage matrix |
| **Expansion Pipeline ARR** | Value of qualified expansion opportunities | 3x quota coverage | `opportunities WHERE type = 'expansion'` |
| **Cross-Sell Attach Rate** | % of renewals including additional products | ≥ 25% | Renewals with expansion within ±30 days |
| **Expansion Win Rate** | % of expansion opportunities closed-won | ≥ 60% | `opportunities WHERE type = 'expansion' AND closed-won` |
| **Time to Expansion** | Average days from acquisition to first expansion | ≤ 180 days | `amendments` first expansion date - acquisition date |
| **Share-of-Wallet Score** | Estimated % of customer's IT budget captured | Increase trend | Derived (customer spend / estimated budget) |
| **Capacity-Driven Expansion ARR** | ARR from utilization >85% → upsell | Trend monitoring | `utilization_alerts` → closed expansion deals |

---

## Dashboard Implementation

**Location**: Sales Expansion → Expansion Dashboard  
**Sidebar Navigation**: `SE` (Sales Expansion) → `Expansion Dashboard`  
**Component**: `src/components/SalesExpansion/DrillDownDashboard.tsx`

**Available KPIs on Dashboard**:
- ✅ Net Revenue Retention (NRR)
- ✅ Expansion ARR
- ✅ Multi-Product Penetration Rate
- ✅ White Space Opportunity Value
- ✅ Expansion Pipeline ARR
- ✅ Cross-Sell Attach Rate
- ✅ Expansion Win Rate
- ✅ Time to Expansion
- ✅ Share-of-Wallet Score
- ✅ Capacity-Driven Expansion ARR
- ➕ Rep Performance Metrics (Quota Attainment)
- ➕ Expansion-Ready Accounts (Readiness Scoring)
- ➕ Utilization-Driven Expansion Signals (Critical Alert Banner)

---

## Data Sources

### Primary Files
- **expansion-opportunities.json** - Individual deals, ARR, stages, products
- **expansion-pipeline-tracking.json** - Aggregate pipeline metrics
- **licenses.json** - Utilization %, product families, capacity alerts
- **customers.json** - Tier, industry, ARR, product portfolios
- **revenue_movements.json** - Expansion, churn, upsell tracking
- **contracts.json** - Renewal dates, terms, amendment history

### Calculation Methods
```sql
-- Net Revenue Retention (NRR)
(Beginning ARR + Expansion ARR - Churn ARR - Contraction ARR) / Beginning ARR × 100

-- Expansion ARR
SUM(revenue_movements.amount WHERE movement_type = 'expansion' AND period = current_quarter)

-- Multi-Product Penetration
COUNT(DISTINCT customer_id WHERE product_count >= 2) / COUNT(DISTINCT customer_id) × 100

-- White Space Opportunity
SUM(estimated_arr WHERE fit_score > 70 AND product_gap = TRUE)

-- Expansion Pipeline ARR
SUM(opportunities.estimated_arr WHERE type = 'expansion' AND stage IN ('Qualified', 'Engaged', 'Proposed', 'Negotiating'))

-- Cross-Sell Attach Rate
COUNT(renewals with new products within ±30 days) / COUNT(all renewals) × 100

-- Expansion Win Rate
COUNT(opportunities closed-won) / COUNT(opportunities closed-won + closed-lost) × 100 WHERE type = 'expansion'

-- Time to Expansion
AVG(first_expansion_date - customer_acquisition_date)

-- Share-of-Wallet Score
(Customer Annual Spend / Estimated IT Budget) × 100

-- Capacity-Driven Expansion ARR
SUM(expansion_arr WHERE triggered_by_utilization_alert = TRUE AND utilization > 85%)
```

---

## KPI Targets & Current Performance

| KPI | Target | Current Value | Status | Gap |
|-----|--------|---------------|--------|-----|
| **Net Revenue Retention** | ≥110% | 103.8% ($42.24M) | 🔴 Critical | -6.2% |
| **Expansion ARR** | $1.60M+ | $1.32M | 🟡 Warning | -$280K |
| **Multi-Product Penetration** | ≥40% | 36.00% | 🟡 Warning | -4% |
| **White Space Opportunity** | $8M+ | $7.20M | 🟡 Warning | -$800K |
| **Expansion Pipeline ARR** | 3x quota | $33.9M | 🟢 Good | On track |
| **Cross-Sell Attach Rate** | ≥25% | Monitoring | 🟢 Good | TBD |
| **Expansion Win Rate** | ≥60% | Monitoring | 🟢 Good | TBD |
| **Time to Expansion** | ≤180 days | Monitoring | 🟢 Good | TBD |
| **Share-of-Wallet** | Trend ↑ | Monitoring | 🟢 Good | TBD |
| **Capacity-Driven ARR** | Trend | $2.8M potential | 🔴 Critical | 18 alerts |

---

## High-Impact Actions

### Immediate Priorities (Next 30 Days)
1. **$2.8M Capacity Alert Response** - 18 critical alerts requiring outreach
2. **$8.2M Single-Product Cross-Sell** - 30 high-value accounts with 1 product
3. **$4.5M High-Fit White Space** - Top 20 accounts >80% fit score
4. **NRR Recovery Plan** - Close 6.2% gap to reach 110% target

### Pipeline Health
- **Total Pipeline**: $33.9M
- **Weighted Pipeline**: $3.08M
- **Total Opportunities**: 44 active deals
- **68 Expansion-Ready Accounts** with high readiness scores

### Rep Performance
- **Average Quota Attainment**: 92% (target: 100%)
- **Pipeline Coverage**: Monitoring 3x quota requirement
- **Win Rate**: 60%+ target for expansion deals

---

## Success Metrics by Expansion Type

| Expansion Motion | Win Rate | Avg Deal Size | Sales Cycle | Priority |
|------------------|----------|---------------|-------------|----------|
| **Capacity-Driven** | 85% | $65K | 18 days | 🔥 Highest |
| **Upsell** | 72% | $52K | 32 days | High |
| **Cross-Sell** | 65% | $85K | 45 days | Medium |
| **Bundles** | 58% | $125K | 52 days | Strategic |

---

## Customer Tier Strategy

| Tier | ARR Range | Expansion Focus | Avg Deal Size | Motion |
|------|-----------|----------------|---------------|--------|
| **Strategic** | $2M+ | Bundle expansions | $180K | Executive alignment |
| **Enterprise** | $500K-$2M | Cross-sell | $95K | Multi-product adoption |
| **Commercial** | $100K-$500K | Capacity-driven | $45K | Product upsells |
| **SMB** | <$100K | Upsell | $18K | Same product expansion |

---

## Product Synergies & Attach Rates

| Product Combination | Attach Rate | NRR Impact | Strategy |
|---------------------|-------------|------------|----------|
| **Duo → Umbrella** | 45% | +15% NRR | Security suite bundling |
| **Meraki → ThousandEyes** | 38% | +12% NRR | Network visibility package |
| **Any → Splunk** | 28% | +10% NRR | Analytics upsell |
| **Full Suite (3+ products)** | 15% | +20% NRR | Premium customer tier |

---

**Document Version**: 1.0  
**Created**: October 12, 2025  
**Dashboard Status**: ✅ Production Active  
**Data Refresh**: Daily at 6 AM
