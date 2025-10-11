# Sales Expansion KPI Framework - Comprehensive Requirements Document

**Document Version**: 1.0  
**Last Updated**: October 10, 2025  
**Project**: Cisco Analytics Platform  
**Persona**: Sales Expansion (SE)

---

## Executive Summary

This document defines a comprehensive three-tier KPI framework for Sales Expansion analytics, encompassing 75+ metrics across Strategic, Tactical, and Operational levels. The framework enables data-driven expansion strategies through white space analysis, pipeline intelligence, and actionable insights.

**Key Metrics Overview:**
- **Tier 1**: 10 Strategic KPIs for executive leadership
- **Tier 2**: 25 Tactical KPIs for sales operations and analysis
- **Tier 3**: 40+ Operational KPIs for individual contributors

---

## TIER 1 KPIs (Strategic Level)

**Dashboard**: Sales Expansion Command Center  
**Audience**: VP Sales, CRO, Executive Leadership  
**Refresh**: Daily at 6 AM

### Core Strategic KPIs (10 Primary Metrics)

| # | KPI | Definition | Target | Display Elements | Level 2 Drill | Level 3 Drill |
|---|-----|------------|--------|------------------|----------------|---------------|
| **1** | **Net Revenue Retention (NRR)** | Revenue retention + expansion from existing cohort | ≥ 110% | Large KPI tile with trend arrow, YoY comparison, color-coded status | NRR decomposition by tier, cohort analysis, waterfall chart | Individual customer NRR contributions, expansion transaction details |
| **2** | **Expansion ARR** | Total ARR from upsell/cross-sell in period | QoQ +15% growth | KPI tile with QoQ growth %, trend sparkline, target vs actual | Expansion by category (upsell, cross-sell, capacity), product family breakdown | Individual expansion deals, sales rep performance, pipeline conversion |
| **3** | **Multi-Product Penetration Rate** | % of customers with 2+ products | ≥ 40% | Percentage with customer distribution donut chart, tier breakdown | Penetration matrix by product combination, tier analysis | Single-product accounts list, cross-sell opportunities |
| **4** | **White Space Opportunity Value** | Estimated ARR from identified gaps | Trend monitoring | Dollar value with opportunity count, trend indicator | White space by customer segment, product gap analysis | Top opportunity accounts, recommended next actions |
| **5** | **Expansion Pipeline ARR** | Value of qualified expansion opportunities | 3x quota coverage | Pipeline value with coverage ratio, stage distribution funnel | Pipeline by stage, product, sales rep, velocity analysis | Individual opportunities, next actions, risk factors |
| **6** | **Cross-Sell Attach Rate** | % of renewals including additional products | ≥ 25% | Percentage with renewal volume context, trend chart | Attach rates by product combination, customer tier | Upcoming renewals with cross-sell potential |
| **7** | **Expansion Win Rate** | % of expansion opportunities closed-won | ≥ 60% | Percentage with win/loss volume, competitive comparison | Win rates by product, deal size, sales rep | Recent wins/losses, competitive analysis |
| **8** | **Time to Expansion** | Average days from acquisition to first expansion | <180 days | Days with trend and benchmark comparison | Time to expansion by tier, product, cohort | Accounts approaching expansion timeline |
| **9** | **Share-of-Wallet Score** | Estimated % of customer's IT budget captured | Trend increase | Average percentage with distribution histogram | Share-of-wallet by tier, industry, competitive analysis | Low share-of-wallet accounts, expansion potential |
| **10** | **Capacity-Driven Expansion ARR** | ARR from utilization >85% → upsell | Trend monitoring | ARR value with utilization alert count | Capacity alerts by product, customer response rates | Active capacity alerts, recommended actions |

---

## TIER 2 KPIs (Tactical/Analytical Level)

**Dashboard**: Sales Expansion Intelligence & White Space Analysis  
**Audience**: Sales Directors, Sales Operations, Revenue Operations  
**Refresh**: Daily

### Analytical Deep-Dive KPIs (25 Secondary Metrics)

#### NRR Analysis (5 KPIs)

| # | KPI | Display | Level 3 Drill |
|---|-----|---------|---------------|
| **11** | **NRR by Customer Tier** | Segmented table with tier breakdown, variance from target | Tier-specific account performance, outlier analysis |
| **12** | **NRR Cohort Analysis** | Cohort retention heatmap by acquisition year/quarter | Cohort account details, retention patterns |
| **13** | **Expansion vs. Churn Ratio** | Ratio visualization with component waterfall | High-churn segments, expansion success factors |
| **14** | **NRR Velocity (QoQ Change)** | Acceleration/deceleration trend chart | Accounts driving NRR changes, intervention opportunities |
| **15** | **Logo NRR vs. Dollar NRR** | Dual-axis comparison showing customer count vs. revenue retention | High-value vs. high-volume retention strategies |

#### Expansion ARR Analysis (5 KPIs)

| # | KPI | Display | Level 3 Drill |
|---|-----|---------|---------------|
| **16** | **Expansion ARR by Category** | Stacked bar chart by upsell, cross-sell, capacity, bundle | Category-specific deals, success patterns |
| **17** | **Expansion ARR by Product Family** | Product performance matrix with attach rates | Product-specific expansion opportunities |
| **18** | **Expansion Deal Size Distribution** | Histogram of deal sizes by category | Large deal analysis, small deal optimization |
| **19** | **Expansion Velocity by Product** | Average days to close by product combination | Slow-moving deals, acceleration tactics |
| **20** | **Expansion ARR per Sales Rep** | Rep performance ranking with quota attainment | Rep-specific pipeline, coaching opportunities |

#### White Space Analysis (5 KPIs)

| # | KPI | Display | Level 3 Drill |
|---|-----|---------|---------------|
| **21** | **Product Penetration Matrix** | Heatmap of product combinations by customer count | Specific product gap opportunities |
| **22** | **White Space by Customer Segment** | Segment analysis with opportunity sizing | Segment-specific target accounts |
| **23** | **Lookalike Similarity Scores** | Customer similarity clustering for targeting | Lookalike account recommendations |
| **24** | **Synergy Score Distribution** | Product synergy analysis for cross-sell prioritization | High-synergy product combinations |
| **25** | **White Space Conversion Rate** | Funnel showing identified opportunities → pipeline conversion | Conversion bottlenecks, process improvements |

#### Pipeline Analysis (5 KPIs)

| # | KPI | Display | Level 3 Drill |
|---|-----|---------|---------------|
| **26** | **Pipeline Coverage by Quarter** | Coverage ratio vs. quota by time period | Pipeline gap analysis, generation needs |
| **27** | **Pipeline Velocity by Stage** | Stage duration analysis, bottleneck identification | Stuck deals, stage-specific interventions |
| **28** | **Pipeline Win Rate by Source** | Win rates by lead source (capacity alert, white space, renewal) | Source optimization, lead quality analysis |
| **29** | **Weighted Pipeline Value** | Pipeline value adjusted by win probability | High-probability deals, risk mitigation |
| **30** | **Pipeline Generation Rate** | New opportunity creation trends | Generation sources, rep productivity |

#### Utilization & Capacity (5 KPIs)

| # | KPI | Display | Level 3 Drill |
|---|-----|---------|---------------|
| **31** | **Utilization Alert Response Rate** | Conversion funnel from alerts to opportunities | Alert response analysis, process optimization |
| **32** | **Average Utilization by Product** | Utilization trends by product family | Low utilization accounts, adoption barriers |
| **33** | **Capacity Expansion Conversion** | Conversion rate from >85% utilization to expansion | High-utilization accounts, expansion readiness |
| **34** | **Utilization-Driven Pipeline** | Pipeline value from utilization triggers | Utilization-based opportunities, timing analysis |
| **35** | **Feature Adoption Impact on Expansion** | Correlation between feature usage and expansion rates | Feature adoption patterns, expansion predictors |

---

## TIER 2 DETAILED ANALYTICAL VIEWS

### View 1: White Space Coverage Matrix

**Purpose**: Account-level product gap analysis with expansion recommendations

**Example: TechCorp Industries | ARR: $425K | Tier: Enterprise**

```
Product Portfolio Coverage:
┌────────────────┬──────────┬────────────┬─────────────┐
│ Product        │ Deployed │ Utilization│ Synergy     │
│                │          │            │ Score       │
├────────────────┼──────────┼────────────┼─────────────┤
│ Meraki         │    ✓     │    92%     │     --      │
│ Duo            │    ✓     │    78%     │     --      │
│ Umbrella       │    ✗     │     --     │  87 🎯High  │
│ ThousandEyes   │    ✗     │     --     │  92 🎯High  │
│ Splunk         │    ✗     │     --     │  85 🎯High  │
└────────────────┴──────────┴────────────┴─────────────┘
```

**Recommended Expansion Strategy:**
1. **ThousandEyes** - Network monitoring gap identified
   - Est. ARR: $120K | Win Probability: 78% | Timeline: Q3 2025
2. **Umbrella** - Cloud security complement to Duo
   - Est. ARR: $85K | Win Probability: 72% | Timeline: Q4 2025

**Lookalike Success Patterns:**
- Similar customers (85%+ match) added ThousandEyes with 76% win rate

### View 2: Expansion Readiness Segmentation

**Purpose**: Customer segmentation based on expansion readiness factors

| Segment | Account Count | Total ARR | Avg Opportunity | Priority |
|---------|---------------|-----------|-----------------|----------|
| **Hot Opportunities** (Health >80, Util >90%, Champion) | 12 | $2.3M | $195K | 🔴 Immediate |
| **Ready for Expansion** (Health >70, Util >70%, Engaged) | 28 | $4.8M | $172K | 🟡 This Quarter |
| **Needs Nurturing** (Health >60, Adoption gaps) | 45 | $6.2M | $138K | 🟢 Next Quarter |
| **Not Ready** (Health <60, Low utilization) | 35 | $3.8M | $109K | ⚪ Monitor |

### View 3: Cross-Product Correlation Analysis

**Purpose**: Identify highest-performing product combinations for expansion strategy

| Product Combination | Accounts | Avg ARR | Expansion Rate | NRR |
|---------------------|----------|---------|----------------|-----|
| Meraki + Duo | 42 | $285K | 18% | 118% |
| Meraki + Umbrella | 38 | $312K | 22% | 122% |
| Duo + Umbrella | 35 | $298K | 20% | 120% |
| **Meraki + ThousandEyes** | 28 | $445K | **28% ⭐** | **128% ⭐** |
| **All 5 Products** | 8 | $625K | **35% ⭐** | **135% ⭐** |

**Key Insight**: Accounts with Meraki + ThousandEyes show 28% higher expansion rates—prioritize this combination.

### View 4: Utilization-Driven Expansion Signals

**Purpose**: Identify capacity-based expansion opportunities from usage patterns

| Customer | Product | Licensed | Used | Util % | Trend | Expansion Opportunity |
|----------|---------|----------|------|--------|-------|----------------------|
| Acme Corp | Duo | 500 | 485 | 97% | ↗ +15% | Add 200 licenses ($45K ARR) |
| DataInc | Meraki | 250 | 235 | 94% | ↗ +8% | Upgrade tier ($32K ARR) |
| GlobalTech | Umbrella | 1000 | 920 | 92% | → Stable | Add 250 licenses ($28K ARR) |

---

## TIER 3 KPIs (Operational/Actionable Level)

**Dashboard**: Sales Expansion Action Pipeline  
**Audience**: Individual Sales Reps, Sales Development Reps, Account Managers  
**Refresh**: Real-time/Hourly

### Operational Action KPIs (40+ Tertiary Metrics)

#### Immediate Action Items (10 KPIs)

| # | KPI | Display | Required Actions |
|---|-----|---------|------------------|
| **36** | **Hot Expansion Opportunities Count** | Alert count with priority levels | [Create Opportunity] [Schedule Meeting] [Generate Proposal] |
| **37** | **Capacity Alert Queue** | Active alerts requiring outreach | [Contact Customer] [Quote Licenses] [Schedule Review] |
| **38** | **Renewal + Expansion Opportunities** | Upcoming renewals with white space | [Schedule QBR] [Prepare Proposal] [Stakeholder Mapping] |
| **39** | **Overdue Follow-ups** | Opportunities with overdue actions | [Update Opportunity] [Schedule Follow-up] [Escalate] |
| **40** | **Champion Departure Alerts** | Key contact changes | [Identify New Champion] [Schedule Introduction] |
| **41** | **Competitive Threat Alerts** | Accounts with competitive activity | [Defensive Strategy] [Accelerate Timeline] |
| **42** | **Budget Cycle Opportunities** | Accounts entering budget planning | [Submit Proposal] [Schedule Planning Meeting] |
| **43** | **Contract Amendment Opportunities** | Contract changes enabling expansion | [Propose Amendment] [Schedule Legal Review] |
| **44** | **Success Story Opportunities** | High-satisfaction accounts ready for expansion | [Leverage Success Story] [Propose Products] |
| **45** | **Executive Engagement Opportunities** | Accounts requiring C-level involvement | [Schedule Executive Briefing] [Prepare Business Case] |

#### Account-Level Metrics (15 KPIs)

| # | KPI | Display | Required Actions |
|---|-----|---------|------------------|
| **46** | **Account Expansion Readiness Score** | Composite score with readiness indicators | [Prioritize Outreach] [Customize Approach] |
| **47** | **Account White Space Value** | Estimated expansion potential | [Develop Account Plan] [Prioritize Products] |
| **48** | **Account Utilization Trend** | 90-day utilization trend | [Capacity Planning] [Expansion Timing] |
| **49** | **Account Engagement Score** | Recent engagement metrics | [Increase Touchpoints] [Schedule Review] |
| **50** | **Account Competitive Risk** | Competitive threat level | [Defensive Positioning] [Accelerate Expansion] |
| **51** | **Account Budget Timing** | Budget cycle timing | [Align Proposal Timing] [Budget Justification] |
| **52** | **Account Stakeholder Map** | Key contacts and influence | [Expand Relationships] [Identify Champions] |
| **53** | **Account Success Metrics** | Business outcomes achieved | [Quantify Value] [Build Business Case] |
| **54** | **Account Contract Status** | Contract terms and renewal dates | [Plan Renewal Strategy] [Identify Windows] |
| **55** | **Account Support Health** | Support ticket volume | [Address Issues] [Improve Readiness] |
| **56** | **Account Product Adoption** | Feature usage maturity | [Drive Adoption] [Identify Triggers] |
| **57** | **Account Expansion History** | Previous expansion patterns | [Replicate Patterns] [Avoid Past Issues] |
| **58** | **Account Risk Factors** | Churn risk and constraints | [Mitigate Risks] [Adjust Strategy] |
| **59** | **Account Champion Strength** | Champion influence level | [Strengthen Relationships] [Develop Champions] |
| **60** | **Account Decision Process** | Procurement process | [Align to Process] [Prepare Documentation] |

#### Pipeline Management (10 KPIs)

| # | KPI | Display | Required Actions |
|---|-----|---------|------------------|
| **61** | **Opportunity Stage Duration** | Time in current stage vs. benchmark | [Accelerate Progress] [Address Blockers] |
| **62** | **Opportunity Win Probability** | AI-calculated win probability | [Focus on High-Probability] [Improve Weak Deals] |
| **63** | **Opportunity Next Action Due** | Overdue and upcoming actions | [Complete Actions] [Schedule Next Steps] |
| **64** | **Opportunity Competitive Status** | Competitive situation | [Differentiate Value] [Address Objections] |
| **65** | **Opportunity Budget Status** | Budget confirmation process | [Confirm Budget] [Navigate Approval] |
| **66** | **Opportunity Technical Fit** | Technical requirements fit | [Address Gaps] [Schedule POC] |
| **67** | **Opportunity Stakeholder Engagement** | Stakeholder involvement | [Engage Stakeholders] [Build Consensus] |
| **68** | **Opportunity Legal/Procurement Status** | Contract process status | [Navigate Legal] [Expedite Procurement] |
| **69** | **Opportunity Risk Factors** | Deal risks and mitigation | [Address Risks] [Develop Contingency] |
| **70** | **Opportunity Value Realization** | Business case strength | [Strengthen Case] [Quantify Value] |

#### Performance Tracking (5 KPIs)

| # | KPI | Display | Required Actions |
|---|-----|---------|------------------|
| **71** | **Rep Expansion Quota Attainment** | Individual quota performance | [Adjust Activity] [Focus on High-Value] |
| **72** | **Rep Pipeline Generation** | New opportunity creation rate | [Increase Prospecting] [Improve Qualification] |
| **73** | **Rep Win Rate by Product** | Product-specific win rates | [Focus on Strengths] [Improve Weak Areas] |
| **74** | **Rep Activity Metrics** | Calls, meetings, proposals | [Increase Activity] [Improve Efficiency] |
| **75** | **Rep Customer Satisfaction** | Customer feedback scores | [Address Issues] [Improve Relationships] |

---

## Data Integration & Technical Requirements

### Key Data Sources

| Data Source | Purpose | Key Tables/Files |
|-------------|---------|------------------|
| **CRM (Salesforce)** | Opportunities, accounts, contacts, activities | opportunities, accounts, contacts, activities |
| **Usage Telemetry** | Product utilization, feature adoption, capacity | utilization_history, utilization_alerts, feature_usage |
| **Revenue Recognition** | ARR movements, expansion tracking, churn | revenue_movements, subscriptions, contracts |
| **Customer Success Platform** | Health scores, engagement metrics, risk factors | health_scores, engagement_tracking, risk_assessments |
| **Competitive Intelligence** | Win/loss data, competitive positioning | competitive_intelligence, win_loss_analysis |

### Source Data Files (Cisco Platform)

| Category | Files | Location |
|----------|-------|----------|
| **Master Data** | customers.json, licenses.json, contracts.json, products.json | `src/source_data/master-data/` |
| **Sales Expansion** | expansion-opportunities.json, competitive-intelligence.json, expansion-triggers.json | `src/source_data/sales-expansion-data/` |
| **CSM Data** | white_space_analysis.json, expansion_handoff_recommendations.json | `src/source_data/csm-data/` |
| **Commercial Ops** | quotes.json, orders.json, revenue_movements.json | `src/source_data/commercial_operations/` |
| **Usage Events** | usage-events-chunk-*.json (45 files) | `src/source_data/usage-events/` |

### Calculation Frequencies

| Tier | Frequency | Latency Requirement | Method |
|------|-----------|-------------------|---------|
| **Tier 1** | Daily at 6 AM | <4 hours | Batch aggregation |
| **Tier 2** | Daily with real-time components | <1 hour | Hybrid batch/streaming |
| **Tier 3** | Real-time for alerts, hourly for pipeline | <15 minutes | Real-time streaming |

### Quality Thresholds

| Metric Type | Completeness | Accuracy | Refresh Latency |
|-------------|--------------|----------|-----------------|
| **Tier 1 KPIs** | >95% | <1% variance | <4 hours |
| **Tier 2 KPIs** | >90% | <2% variance | <1 hour |
| **Tier 3 KPIs** | >85% | <5% variance | <15 minutes |

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Implement Tier 1 strategic KPIs
- [ ] Build data service layer for sales expansion
- [ ] Create basic dashboard layouts
- [ ] Deploy to pilot users (5-10)

### Phase 2: Tactical Analytics (Weeks 5-8)
- [ ] Implement Tier 2 analytical views
- [ ] Add white space coverage matrix
- [ ] Build expansion readiness segmentation
- [ ] Add cross-product correlation analysis

### Phase 3: Operational Enablement (Weeks 9-12)
- [ ] Implement Tier 3 operational KPIs
- [ ] Add utilization-driven expansion signals
- [ ] Build action-oriented workflows
- [ ] Full organizational rollout

### Phase 4: Optimization (Weeks 13-16)
- [ ] AI/ML-powered insights
- [ ] Predictive analytics
- [ ] Performance tuning
- [ ] Advanced automation

---

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **User Adoption Rate** | >80% monthly active users | Login tracking, usage analytics |
| **Dashboard Engagement** | >5 sessions per user per week | BI platform analytics |
| **Time to Insight** | <30 seconds to find key metrics | User surveys, task completion time |
| **Data Quality Score** | >95% confidence in calculations | Automated data validation |
| **Action Completion Rate** | >70% of flagged exceptions actioned | Workflow tracking |

---

## Governance & Maintenance

### Metric Ownership
- **Business Owner**: VP Sales, Sales Operations
- **Technical Owner**: Director of Analytics, Data Engineering
- **Data Steward**: Sales Operations Analyst

### Change Management
- **Major Changes**: 2-week notice, steering committee approval
- **Minor Changes**: 3-day notice, release notes
- **Bug Fixes**: Immediate deployment with notification

### Documentation Updates
- **Quarterly**: Review and update KPI definitions
- **Monthly**: Update data source mappings
- **Weekly**: Refresh calculation examples

---

**Document Control**
- **Created**: October 10, 2025
- **Version**: 1.0
- **Next Review**: January 10, 2026
- **Approved By**: [To be filled]
- **Distribution**: Sales Leadership, Analytics Team, Engineering Team
