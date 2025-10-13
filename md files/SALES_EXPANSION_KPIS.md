# Sales Expansion Dashboard - KPI Documentation

**Dashboard Location**: Sales Expansion → Expansion Dashboard  
**Sidebar Navigation**: `SE` (Sales Expansion) → `Expansion Dashboard`  
**Component**: `src/components/SalesExpansion/DrillDownDashboard.tsx`

---

## Overview

The Sales Expansion Dashboard provides strategic oversight of expansion pipeline, Net Revenue Retention (NRR), and growth opportunities. It follows a 3-tier drill-down architecture:

- **Level 1**: Strategic KPI tiles with high-level metrics
- **Level 2**: Tactical analysis with charts and breakdowns
- **Level 3**: Operational actions and account-specific workflows

---

## Tier 1: Strategic KPIs (Dashboard Cards)

### 1. **Net Revenue Retention (NRR)**
- **KPI ID**: `nrr`
- **Definition**: Revenue retention + expansion from existing customer cohort
- **Target**: ≥ $46.02M (110% NRR rate)
- **Current Value**: $42.24M
- **Status**: Critical
- **Icon**: TrendingUp (Blue)
- **Description**: Retained + expansion revenue in dollars
- **Business Context**: Measures ability to grow revenue from existing base

**Level 2 Drill-Down Views**:
1. **NRR Quarterly Trend** - Performance trends over time
2. **Expansion vs Churn Waterfall** - Composition breakdown
3. **NRR by Customer Tier** - Performance across Strategic, Enterprise, Commercial, SMB

**Level 3 Actions**:
- High NRR Account Success Patterns
- Low NRR Account Intervention

---

### 2. **Expansion ARR**
- **KPI ID**: `expansion-arr`
- **Definition**: Total ARR from upsell/cross-sell in period
- **Target**: ≥ $1.60M
- **Current Value**: $1.32M
- **Status**: Warning
- **Icon**: DollarSign (Green)
- **Description**: Total ARR from upsell/cross-sell in period
- **Business Context**: Key growth driver, target $5M+ quarterly

**Level 2 Drill-Down Views**:
1. **Expansion by Category** - Breakdown by upsell, cross-sell, capacity, bundle
2. **Expansion by Product Family** - Product performance and attach rates
3. **Expansion Deal Size Distribution** - Deal size patterns

**Level 3 Actions**:
- Large Deal Pipeline ($100K+)
- Small Deal Velocity Improvement

---

### 3. **Multi-Product Penetration**
- **KPI ID**: `multi-product-penetration`
- **Definition**: % of customers with 2+ products
- **Target**: ≥ 40%
- **Current Value**: 36.00%
- **Status**: Warning
- **Icon**: Users (Purple)
- **Description**: % of customers with 2+ products
- **Business Context**: Indicates successful cross-sell and customer stickiness

**Level 2 Drill-Down Views**:
1. **Product Penetration Matrix** - Heatmap showing product combination adoption

**Level 3 Actions**:
- Single-Product Account Cross-Sell ($8.2M opportunity)

---

### 4. **White Space Opportunity**
- **KPI ID**: `white-space-value`
- **Definition**: Estimated ARR from identified product gaps
- **Target**: ≥ $8.00M
- **Current Value**: $7.20M
- **Status**: Warning
- **Icon**: AlertCircle (Orange)
- **Description**: Estimated ARR from identified gaps
- **Business Context**: Represents untapped expansion potential

**Level 2 Drill-Down Views**:
1. **White Space by Segment** - Opportunity sizing by tier and industry

**Level 3 Actions**:
- High-Fit White Space Opportunities ($4.5M ready-to-engage)

---

### 5. **Rep Performance Metrics**
- **KPI ID**: `performance-metrics`
- **Definition**: Avg quota attainment across expansion reps
- **Target**: ≥ 100%
- **Current Value**: 92%
- **Status**: Warning
- **Icon**: Users (Indigo)
- **Description**: Avg quota attainment across expansion reps
- **Business Context**: Individual rep performance tracking

**Level 2 Drill-Down Views**:
1. **Quota Attainment by Rep** - Individual rep performance ranking
2. **Pipeline Generation Rate** - New opportunity creation per rep
3. **Win Rate by Rep & Product** - Rep-specific win rates

**Level 3 Actions**:
- At-Risk Rep Coaching
- Pipeline Coverage Gaps
- Top Performer Best Practices

---

### 6. **Expansion-Ready Accounts**
- **KPI ID**: `opportunity-readiness`
- **Definition**: Accounts with high expansion readiness score
- **Target**: ≥ 60 accounts
- **Current Value**: 68 accounts
- **Status**: Good
- **Icon**: TrendingUp (Teal)
- **Description**: Accounts with high expansion readiness score
- **Business Context**: Composite scoring based on health, utilization, engagement, and budget timing

**Level 2 Drill-Down Views**:
1. **Readiness Score Distribution** - Account distribution by readiness score
2. **Readiness by Customer Tier** - Tier-specific readiness analysis
3. **Readiness Factor Analysis** - Which factors drive readiness scores

**Level 3 Actions**:
- Hot Expansion Opportunities (68 ready accounts)
- Readiness Improvement Plans
- Budget Cycle Alignment

---

## Tier 1.5: Critical Alert Section

### 7. **Utilization-Driven Expansion Signals** 🚨
- **KPI ID**: `utilization-expansion`
- **Definition**: Real-time capacity alerts requiring immediate action
- **Current Value**: 18 critical alerts with $2.8M potential ARR
- **Status**: Critical (Red gradient background)
- **Display**: Featured alert banner with gradient styling
- **Description**: Real-time capacity alerts from license utilization >85%
- **Business Context**: Proactive utilization monitoring drives expansion

**Level 2 Drill-Down Views**:
1. **Utilization Alert Overview** - Distribution by severity (Critical/High/Medium)
2. **Alert Response Rate Analysis** - Conversion rates and response times

**Level 3 Actions**:
- Capacity Alert Queue (18 active alerts, $2.8M ARR)
- High-Utilization Account Prioritization
- Proactive Capacity Planning

---

## Additional Dashboard Visualizations

### 8. **Expansion Pipeline Funnel** (Full Width)
- **Display**: Full-width funnel chart
- **Height**: 450px
- **Data Source**: `expansion-opportunities.json`
- **Stages**: Prospecting → Qualified → Engaged → Proposed → Negotiating
- **Total Pipeline**: $33.9M
- **Metrics Shown**:
  - Weighted Pipeline ARR
  - Total Opportunities Count

**Drill-Down**: Clicks to `pipeline-arr` Level 2

---

### 9. **Opportunity Readiness Matrix**
- **Display**: Scatter plot (2-column grid)
- **Axes**: Close Probability × Estimated ARR
- **Purpose**: Identifies sweet-spot accounts for immediate action
- **Drill-Down**: Clicks to `opportunity-readiness-matrix` Level 2

---

### 10. **Cross-Sell ARR Breakdown**
- **Display**: Pie chart (2-column grid)
- **Breakdown**: Cross-Sell vs Upsell ARR distribution
- **Metrics Shown**:
  - Cross-Sell ARR: Amount + opportunity count
  - Upsell ARR: Amount + opportunity count

---

### 11. **Exception Alerts**
- **Display**: List of critical alerts
- **Alert Types**:
  - Stalled Deals (>30 days in stage)
  - At-Risk Accounts
  - Champion Departures
  - Competitive Threats
- **Severity Levels**: High (Red), Medium (Yellow), Low (Blue)
- **Metrics**: ARR value + item count per alert

**Drill-Down**: Clicks to `exception-alerts` Level 2

---

## Supporting KPIs (Available in Drill-Down)

### 12. **Expansion Pipeline ARR**
- **KPI ID**: `pipeline-arr`
- **Target**: 3x quota coverage
- **Business Context**: Value of qualified expansion opportunities

### 13. **Expansion Win Rate**
- **KPI ID**: `win-rate`
- **Target**: ≥ 60%
- **Business Context**: % of expansion opportunities closed-won

### 14. **Cross-Sell Attach Rate**
- **KPI ID**: `cross-sell-rate`
- **Target**: ≥ 50%
- **Business Context**: % of renewals including additional products

### 15. **Time to Expansion**
- **KPI ID**: `time-to-expansion`
- **Target**: ≤ 180 days
- **Business Context**: Average days from acquisition to first expansion

### 16. **Share of Wallet Score**
- **KPI ID**: `share-of-wallet`
- **Target**: Increase trend
- **Business Context**: Estimated % of customer IT budget captured

### 17. **Capacity-Driven Expansion ARR**
- **KPI ID**: `capacity-arr`
- **Target**: Trend monitoring
- **Business Context**: ARR from utilization >85% → upsell

### 18. **Expansion Type Distribution**
- **KPI ID**: `expansion-type-distribution`
- **Business Context**: Breakdown by capacity-driven, cross-sell, upsell, and bundles

---

## Data Sources

### Real Data Integration
All KPIs pull from real data sources in `src/source_data/sales-expansion-data/`:

1. **expansion-opportunities.json** - Individual expansion opportunities with:
   - Customer details
   - Estimated ARR
   - Stage and probability
   - Product families
   - Close dates

2. **expansion-pipeline-tracking.json** - Pipeline metrics:
   - Total pipeline ARR
   - Weighted pipeline ARR
   - Stage distribution
   - Expansion type breakdown

3. **licenses.json** (from master-data) - License utilization:
   - Current utilization %
   - License count
   - Product families
   - Triggers for capacity alerts

4. **customers.json** (from master-data) - Customer attributes:
   - Tier classification
   - Industry
   - ARR values
   - Product portfolios

---

## Technical Implementation

### Services
- **Primary Service**: `src/services/salesExpansionService.ts`
- **Drill-Down Logic**: `src/services/drillDownService.ts`
- **Analytics Service**: `src/services/seAnalyticsService.ts`

### Components
- **Main Dashboard**: `src/components/SalesExpansion/DrillDownDashboard.tsx`
- **KPI Card**: `src/components/CommercialOps/DrillDownKPICard.tsx`
- **Level 2 Analysis**: `src/components/CommercialOps/Level2TacticalAnalysis.tsx`
- **Level 3 Actions**: `src/components/CommercialOps/Level3OperationalActions.tsx`

### Dashboard Features
- ✅ 3-column responsive grid (lg:grid-cols-3)
- ✅ All numbers rounded to 2 decimal places
- ✅ Full-width pipeline funnel (450px height)
- ✅ Real-time data from JSON sources
- ✅ Interactive drill-down navigation
- ✅ Breadcrumb navigation history
- ✅ Color-coded status indicators
- ✅ Gradient alert sections for critical items

---

## Navigation Verification

**Sidebar Configuration** (from `EnhancedSidebar.tsx`):
```typescript
case 'SE':
  return [
    {
      id: 'expansion-dashboard',
      name: 'Expansion Dashboard',
      description: 'Sales expansion opportunities',
      icon: Target
    }
  ];
```

**Access Path**:
1. Click **"Sales Expansion"** in sidebar (Target icon)
2. Click **"Expansion Dashboard"** sub-menu
3. Dashboard renders with all 6 KPI cards + utilization alert banner

---

## Status Summary

### ✅ Verified Components
- All 6 main KPI cards render correctly
- Utilization alert banner displays prominently
- Pipeline funnel expanded to full width (450px height)
- All percentages rounded to 2 decimal places
- Real data integration from JSON sources
- Drill-down navigation functional
- NRR tabs reordered (Quarterly Trend → Expansion vs Churn → By Tier)

### 📊 Data Quality
- **Source Files**: 6 JSON files in `sales-expansion-data/`
- **Master Data**: Customers, licenses, contracts, products
- **Total Opportunities**: 100+ expansion opportunities
- **Pipeline Stages**: 5 stages (Prospecting to Negotiating)
- **Alert Generation**: Real-time from license utilization >85%

---

## Business Impact Metrics

### High-Impact Opportunities
1. **$2.8M** - Capacity alert queue (18 critical alerts)
2. **$8.2M** - Single-product cross-sell opportunity
3. **$4.5M** - High-fit white space (ready-to-engage)
4. **$33.9M** - Total expansion pipeline
5. **68 accounts** - Expansion-ready with high readiness scores

### Critical Actions Required
- 18 capacity alerts requiring immediate outreach
- Low NRR accounts (<100%) needing intervention
- Pipeline coverage gaps (<3x quota)
- At-risk expansion deals (<50% win probability)

---

**Document Version**: 2.0  
**Last Updated**: October 12, 2025  
**Maintained By**: Sales Operations Team  
**Status**: ✅ Verified Against Production Dashboard
