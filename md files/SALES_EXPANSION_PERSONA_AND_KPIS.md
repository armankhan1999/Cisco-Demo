# Sales Expansion Persona & KPI Framework

---

## Persona: Sales Expansion Leader

### Primary Responsibility
Drive cross-sell, upsell, and multi-product penetration to maximize share-of-wallet and ARR growth from existing customers.

### Focus Areas & Objectives

**Core Mission**: Maximize revenue from existing customer base through strategic expansion initiatives

**Key Business Questions**:
- Which customers have the highest expansion potential?
- What white space exists in our product portfolio coverage?
- Which accounts are ready for cross-sell conversations?
- How are we performing on NRR and expansion ARR growth?
- Which product combinations drive the best outcomes?

---

## Level 1 — Strategic View

**Dashboard Name**: Sales Expansion Command Center  
**Refresh Frequency**: Daily at 6 AM  
**Audience**: VP Sales, CRO, Executive Leadership

### Primary KPIs (10):

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

## Detailed KPI Breakdown

---

## Primary KPIs (10 Strategic Metrics)

### 1. **Net Revenue Retention (NRR)**
| Attribute | Details |
|-----------|---------|
| **Definition** | Revenue retention + expansion from existing cohort |
| **Target** | ≥ 110% |
| **Current Value** | $42.24M (103.8% NRR rate) |
| **Status** | Critical (Below target) |
| **Data Source** | `revenue_movements` (expansion - churn) / prior ARR |
| **Calculation** | `(Beginning ARR + Expansion - Churn - Contraction) / Beginning ARR × 100` |
| **Business Context** | Measures ability to grow revenue from existing base. Below 110% indicates expansion challenges. |

**Level 2 Drill-Downs**:
- NRR Quarterly Trend
- Expansion vs Churn Waterfall
- NRR by Customer Tier

---

### 2. **Expansion ARR**
| Attribute | Details |
|-----------|---------|
| **Definition** | Total ARR from upsell/cross-sell in period |
| **Target** | ≥ $1.60M (Growth trend QoQ +15%) |
| **Current Value** | $1.32M |
| **Status** | Warning (Below target) |
| **Data Source** | `revenue_movements WHERE movement_type = 'expansion'` |
| **Calculation** | `SUM(expansion_arr) WHERE period = current_quarter` |
| **Business Context** | Key growth driver. Target $5M+ quarterly. Indicates sales effectiveness. |

**Level 2 Drill-Downs**:
- Expansion by Category (upsell, cross-sell, capacity, bundle)
- Expansion by Product Family
- Expansion Deal Size Distribution

---

### 3. **Multi-Product Penetration Rate**
| Attribute | Details |
|-----------|---------|
| **Definition** | % of customers with 2+ products |
| **Target** | ≥ 40% |
| **Current Value** | 36.00% |
| **Status** | Warning (Below target) |
| **Data Source** | `accounts with multiple licenses` |
| **Calculation** | `COUNT(customers with ≥2 products) / COUNT(all customers) × 100` |
| **Business Context** | Indicates successful cross-sell and customer stickiness. Multi-product customers have 15% higher NRR. |

**Level 2 Drill-Downs**:
- Product Penetration Matrix (heatmap of combinations)

---

### 4. **White Space Opportunity Value**
| Attribute | Details |
|-----------|---------|
| **Definition** | Estimated ARR from identified product gaps |
| **Target** | ≥ $8.00M (Trend monitoring) |
| **Current Value** | $7.20M |
| **Status** | Warning |
| **Data Source** | Derived from product coverage matrix |
| **Calculation** | `SUM(estimated_arr WHERE fit_score > 70 AND product_gap = TRUE)` |
| **Business Context** | Represents untapped expansion potential. Prioritize by fit score and customer tier. |

**Level 2 Drill-Downs**:
- White Space by Segment (tier and industry)

---

### 5. **Expansion Pipeline ARR**
| Attribute | Details |
|-----------|---------|
| **Definition** | Value of qualified expansion opportunities |
| **Target** | 3x quota coverage |
| **Current Value** | $33.9M total pipeline |
| **Status** | Monitoring |
| **Data Source** | `opportunities WHERE type = 'expansion'` |
| **Calculation** | `SUM(estimated_arr) WHERE stage IN (qualified_stages)` |
| **Business Context** | Indicates future revenue health. Need 3x coverage to ensure quota attainment. |

**Level 2 Drill-Downs**:
- Pipeline by Stage (funnel analysis)
- Pipeline Velocity by Stage

---

### 6. **Cross-Sell Attach Rate**
| Attribute | Details |
|-----------|---------|
| **Definition** | % of renewals including additional products |
| **Target** | ≥ 25% |
| **Current Value** | Monitoring |
| **Status** | On track |
| **Data Source** | `renewals with expansion within ±30 days` |
| **Calculation** | `COUNT(renewals with new products) / COUNT(all renewals) × 100` |
| **Business Context** | Measures cross-sell effectiveness during renewal motion. High attach rates indicate strong bundling. |

**Level 2 Drill-Downs**:
- Attach Rates by Product Combination
- Attach Rates by Customer Tier

---

### 7. **Expansion Win Rate**
| Attribute | Details |
|-----------|---------|
| **Definition** | % of expansion opportunities closed-won |
| **Target** | ≥ 60% |
| **Current Value** | Monitoring |
| **Status** | On track |
| **Data Source** | `opportunities WHERE type = 'expansion' AND closed-won` |
| **Calculation** | `COUNT(closed-won) / COUNT(closed-won + closed-lost) × 100` |
| **Business Context** | Measures sales effectiveness. Lower rates indicate pricing, competitive, or value proposition issues. |

**Level 2 Drill-Downs**:
- Win Rate by Product
- Win/Loss Root Cause Analysis

---

### 8. **Time to Expansion**
| Attribute | Details |
|-----------|---------|
| **Definition** | Average days from customer acquisition to first expansion |
| **Target** | Minimize (benchmark: ≤180 days) |
| **Current Value** | Monitoring |
| **Status** | On track |
| **Data Source** | `amendments first expansion date - acquisition date` |
| **Calculation** | `AVG(first_expansion_date - acquisition_date)` |
| **Business Context** | Faster expansion indicates product-market fit and customer success effectiveness. |

**Level 2 Drill-Downs**:
- Time to Expansion by Tier
- Time to Expansion by Product

---

### 9. **Share-of-Wallet Score**
| Attribute | Details |
|-----------|---------|
| **Definition** | Estimated % of customer's IT budget captured |
| **Target** | Increase trend |
| **Current Value** | Monitoring |
| **Status** | Trend analysis |
| **Data Source** | `Derived (customer spend / estimated budget)` |
| **Calculation** | `(Customer ARR / Estimated IT Budget) × 100` |
| **Business Context** | Indicates expansion headroom. Low share-of-wallet suggests untapped potential. |

**Level 2 Drill-Downs**:
- Share-of-Wallet by Tier
- Share-of-Wallet by Industry

---

### 10. **Capacity-Driven Expansion ARR**
| Attribute | Details |
|-----------|---------|
| **Definition** | ARR from utilization >85% → upsell |
| **Target** | Trend monitoring |
| **Current Value** | $2.8M potential (18 critical alerts) |
| **Status** | Critical action required |
| **Data Source** | `utilization_alerts → closed expansion deals` |
| **Calculation** | `SUM(expansion_arr WHERE triggered_by = 'utilization_alert')` |
| **Business Context** | Proactive capacity management. Highest win rate (85%) of all expansion types. |

**Level 2 Drill-Downs**:
- Utilization Alert Overview (by severity)
- Alert Response Rate Analysis

---

## Complete KPI Catalog (18 Total)

### Tier 1: Strategic KPIs (10)
1. ✅ Net Revenue Retention (NRR)
2. ✅ Expansion ARR
3. ✅ Multi-Product Penetration Rate
4. ✅ White Space Opportunity Value
5. ✅ Expansion Pipeline ARR
6. ✅ Cross-Sell Attach Rate
7. ✅ Expansion Win Rate
8. ✅ Time to Expansion
9. ✅ Share-of-Wallet Score
10. ✅ Capacity-Driven Expansion ARR

### Dashboard Display KPIs (6 Cards)
1. **Net Revenue Retention** - $42.24M (Critical)
2. **Expansion ARR** - $1.32M (Warning)
3. **Multi-Product Penetration** - 36.00% (Warning)
4. **White Space Opportunity** - $7.20M (Warning)
5. **Rep Performance Metrics** - 92% quota attainment (Warning)
6. **Expansion-Ready Accounts** - 68 accounts (Good)

### Featured Alert Banner
7. **🚨 Utilization-Driven Expansion Signals** - 18 critical alerts, $2.8M potential

### Supporting KPIs (Additional 8)
11. **Rep Performance Metrics** - Quota attainment, pipeline health, win rates
12. **Expansion-Ready Accounts** - Readiness scoring (health + utilization + engagement)
13. **Opportunity Readiness Matrix** - Scatter analysis of readiness vs value
14. **Expansion Type Distribution** - Capacity vs cross-sell vs upsell vs bundles
15. **Exception Alerts** - At-risk accounts, stalled deals, competitive threats
16. **Pipeline Funnel Stages** - Prospecting → Negotiating progression
17. **Cross-Sell ARR Breakdown** - Pie chart of expansion categories
18. **Account White Space Analysis** - Per-account expansion potential

---

## Data Source Summary

### Primary Data Files
| Data Source | Location | Purpose |
|------------|----------|---------|
| **Expansion Opportunities** | `sales-expansion-data/expansion-opportunities.json` | Individual deals, ARR, stages, products |
| **Pipeline Tracking** | `sales-expansion-data/expansion-pipeline-tracking.json` | Aggregate pipeline metrics, weighted ARR |
| **Licenses** | `master-data/licenses.json` | Utilization %, product families, capacity alerts |
| **Customers** | `master-data/customers.json` | Tier, industry, ARR, product portfolios |
| **Revenue Movements** | `commercial_operations/revenue_movements.json` | Expansion, churn, upsell tracking |
| **Contracts** | `master-data/contracts.json` | Renewal dates, terms, amendment history |

### Derived Calculations
- **NRR**: Calculated from revenue movements (expansion - churn) / beginning ARR
- **White Space**: Product gap analysis × customer fit scores × average deal sizes
- **Readiness Score**: Composite of health score + utilization + engagement + budget timing
- **Share-of-Wallet**: Customer ARR / estimated IT budget (from company size + industry benchmarks)

---

## Dashboard Access & Navigation

**Path**: Sales Expansion → Expansion Dashboard

**Sidebar Navigation**:
```
📊 Cisco Analytics
  └─ 🎯 Sales Expansion (SE)
      └─ Expansion Dashboard
```

**Component Location**: `src/components/SalesExpansion/DrillDownDashboard.tsx`

---

## Success Metrics & Targets

### Critical Success Factors
✅ **NRR**: Achieve ≥110% retention rate  
✅ **Expansion ARR**: $1.6M+ quarterly, QoQ growth +15%  
✅ **Multi-Product**: 40%+ customers with 2+ products  
✅ **White Space**: $8M+ identified opportunities  
✅ **Pipeline**: 3x quota coverage maintained  

### High-Impact Opportunities
- **$2.8M** - Capacity alert queue (18 critical, immediate action)
- **$8.2M** - Single-product cross-sell potential
- **$4.5M** - High-fit white space (ready-to-engage)
- **$33.9M** - Total expansion pipeline
- **68 accounts** - Expansion-ready with high scores

### Rep Performance Targets
- **Quota Attainment**: 100% (currently 92%)
- **Pipeline Coverage**: 3x quota (proactive generation)
- **Win Rate**: 60%+ on expansion deals
- **Activity Level**: 20+ customer touches/week

---

## Business Impact Framework

### Expansion Motion Hierarchy (by Win Rate)
1. **Capacity-Driven** (85% win rate) - Utilization >85%, urgent need
2. **Upsell** (72% win rate) - Same product family expansion
3. **Cross-Sell** (65% win rate) - New product family introduction
4. **Bundles** (58% win rate) - Multi-product package deals

### Customer Tier Strategy
- **Strategic** ($2M+ ARR): Bundle expansions, executive alignment, avg $180K deals
- **Enterprise** ($500K-$2M ARR): Cross-sell focus, multi-product adoption, avg $95K deals
- **Commercial** ($100K-$500K ARR): Capacity-driven primary, product upsells, avg $45K deals
- **SMB** (<$100K ARR): Upsell within existing products, avg $18K deals

### Product Synergies
- **Duo → Umbrella**: 45% attach rate (security suite)
- **Meraki → ThousandEyes**: 38% attach rate (network visibility)
- **Any → Splunk**: 28% attach rate (analytics upsell)
- **Full Suite**: 15% of enterprise customers (premium tier)

---

## Operational Playbooks

### Capacity Alert Response (85% Win Rate)
1. **Detection**: Monitor utilization >85% across all licenses
2. **Alert Generation**: Automatic trigger with ARR potential calculation
3. **Rep Assignment**: Route to account owner within 24 hours
4. **Outreach**: Proactive capacity planning conversation
5. **Quote**: Expansion quote within 3 business days
6. **Close**: Average 18-day sales cycle (fastest motion)

### White Space Engagement (70% Conversion)
1. **Identification**: Gap analysis × fit score calculation
2. **Prioritization**: Sort by ARR potential × close probability
3. **Research**: Success stories from similar accounts
4. **Business Case**: ROI calculator with industry benchmarks
5. **Outreach**: Targeted cross-sell campaign
6. **Demo**: Product-specific value demonstration

### Multi-Product Land-and-Expand
1. **Land**: Initial product with clear use case
2. **Adoption**: Drive utilization >70% within 90 days
3. **Value**: Quantify business outcomes (QBR)
4. **Expand**: Introduce adjacent product with synergy
5. **Bundle**: Package pricing for multi-product adoption

---

**Document Version**: 1.0  
**Created**: October 12, 2025  
**Maintained By**: Sales Operations Team  
**Status**: ✅ Production-Ready
