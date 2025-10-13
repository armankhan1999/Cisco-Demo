# Commercial Operations Dashboard - Complete Architecture & Structure Analysis

**Document Version:** 1.0  
**Created:** October 12, 2025  
**Purpose:** Comprehensive analysis of Commercial Operations dashboard structure, data sources, KPI calculations, and 3-level drill-down architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Dashboard Overview](#dashboard-overview)
3. [Data Architecture](#data-architecture)
4. [Level 1: Strategic Overview](#level-1-strategic-overview)
5. [Level 2: Tactical Analysis](#level-2-tactical-analysis)
6. [Level 3: Operational Actions](#level-3-operational-actions)
7. [KPI Calculations & Formulas](#kpi-calculations--formulas)
8. [Shared Data with CSM](#shared-data-with-csm)
9. [Component Structure](#component-structure)

---

## Executive Summary

### Dashboard Purpose
The **Commercial Operations Command Center** provides strategic oversight of quote-to-cash process efficiency, pricing accuracy, and revenue realization.

### Key Stakeholders
- **Primary**: Commercial Operations Directors, Revenue Operations Managers, Finance Controllers
- **Secondary**: Sales Operations, Account Managers, Executive Leadership
- **Tertiary**: Legal, Billing, Collections Teams

### Business Value
- **Process Optimization**: Identifies bottlenecks in quote-to-cash cycle (target: ≤45 days)
- **Revenue Acceleration**: Reduces DSO from 35 to 30 days = $2.3M cash flow improvement
- **Accuracy Improvement**: 98%+ invoice accuracy reduces disputes and delays
- **Strategic Insights**: Links commercial operations to customer health and expansion

---

## Dashboard Overview

### Navigation Structure

```
Home (/) → Commercial Operations (CO Persona)
    ↓
DrillDownDashboard Component
    ↓
    ├── Level 1: Strategic Overview (8 KPIs + Trends + Alerts)
    │   ├── Tab: Strategic Overview
    │   ├── Tab: Process Breakdown
    │   └── Tab: Deep Analysis
    │
    ├── Level 2: Tactical Analysis (On KPI Click)
    │   ├── Stage Breakdown
    │   ├── Customer Segment Analysis
    │   ├── Product Family Impact
    │   ├── Bottleneck Heatmaps
    │   └── Historical Trends
    │
    └── Level 3: Operational Actions (On Drill-Down)
        ├── Action Items Queue
        ├── Account Details
        └── Recommended Next Steps
```

### Component Files

| Component | File Path | Lines | Purpose |
|-----------|-----------|-------|---------|
| Main Dashboard | `DrillDownDashboard.tsx` | 452 | Level 1 entry point |
| Level 2 Analysis | `Level2TacticalAnalysis.tsx` | 655 | Tactical breakdowns |
| Level 3 Actions | `Level3OperationalActions.tsx` | 732 | Operational details |
| KPI Card | `DrillDownKPICard.tsx` | 200+ | Interactive KPI tiles |
| Trend Chart | `StrategicTrendChart.tsx` | 150+ | Multi-metric trends |
| Exception Alerts | `EnhancedExceptionAlerts.tsx` | 450+ | Alert management |

---

## Data Architecture

### Data Sources Overview

**Total:** 21 files, ~8.5MB across 3 categories

#### 1. Master Data (Shared with CSM & SE)
**Location:** `src/source_data/master-data/`

| File | Records | Size | Shared With | Key Fields |
|------|---------|------|-------------|------------|
| `customers.json` | 50 | 28KB | CSM, SE | customer_id, name, tier, arr, industry, health_score |
| `licenses.json` | 2,785 | 99KB | CSM, SE | license_id, customer_id, product_family, utilization |
| `contracts.json` | 50 | 19KB | CSM, SE | contract_id, customer_id, start_date, end_date |
| `products.json` | 5 | 678B | CSM, SE | product_id, name, category |

#### 2. Commercial Operations Exclusive Data
**Location:** `src/source_data/commercial_operations/`

| File | Records | Size | Primary KPIs |
|------|---------|------|--------------|
| `quotes.json` | 120 | 156KB | Quote Win Rate, Quote Approval Velocity |
| `quote_to_cash_tracking.json` | 82 | 92KB | Q2C Cycle Time |
| `orders.json` | 84 | 108KB | Order Processing |
| `invoices.json` | 82 | 125KB | Invoice Accuracy, DSO |
| `payments.json` | 76 | 78KB | Payment Collection |
| `accounts_receivable.json` | 7 | 4KB | DSO Calculation |
| `revenue_recognition_schedule.json` | 133 | 441KB | Revenue Recognition Accuracy |
| `revenue_movements.json` | 20 | 18KB | NRR, Expansion ARR |
| `subscriptions.json` | 145 | 141KB | ARR Tracking |
| `utilization_history.json` | 10,890 | 7.3MB | Utilization Trends |

### Data Relationships

```
MASTER DATA
customers (50) ──┬── licenses (2,785)
                 └── contracts (50)
                         ↓
COMMERCIAL OPERATIONS
quotes (120) ──┬── quote_line_items (224)
               ├── orders (84) ──┬── invoices (82)
               │                  └── payments (76)
               └── quote_to_cash_tracking (82)

subscriptions (145) ──┬── revenue_movements (20)
                      └── revenue_recognition_schedule (133)

licenses (2,785) ──┬── utilization_history (10,890)
                   └── utilization_alerts (25)
```

---

## Level 1: Strategic Overview

### File: `DrillDownDashboard.tsx` (Lines 167-449)

### Header Section (Lines 170-223)

**Elements:**
- Breadcrumb navigation
- Dashboard title with icon
- Current quarter: Q2 2025
- Health status: Excellent (green pulse)
- Tab navigation (3 tabs)

### KPI Cards Grid (Lines 230-352)

**Layout:** 2 rows × 4 columns = 8 KPI cards

#### Row 1: Core Process Metrics

**1. Quote-to-Cash Cycle Time**
- **ID:** `quote-to-cash-cycle`
- **Value:** 41.2 days (dynamic)
- **Target:** ≤ 45 days
- **Status:** Good (within target)
- **Trend:** -5% (improving)
- **Icon:** Clock
- **Color:** Blue
- **Description:** "Average days from quote creation to payment received"
- **Click Action:** → Level 2 Stage Breakdown

**2. Quote Approval Velocity**
- **ID:** `quote-approval-velocity`
- **Value:** 2.8 days
- **Target:** ≤ 3 days
- **Status:** Good
- **Trend:** -8% (improving)
- **Icon:** FileText
- **Color:** Green

**3. Invoice Accuracy**
- **ID:** `invoice-accuracy`
- **Value:** 98.5%
- **Target:** ≥ 98%
- **Status:** Good
- **Trend:** +2%
- **Icon:** CheckCircle
- **Color:** Emerald

**4. Days Sales Outstanding (DSO)**
- **ID:** `days-sales-outstanding`
- **Value:** 35 days
- **Target:** ≤ 30 days
- **Status:** Warning (above target)
- **Trend:** -7% (improving)
- **Icon:** DollarSign
- **Color:** Orange

#### Row 2: Revenue & Performance Metrics

**5. Revenue Recognition Accuracy**
- **ID:** `revenue-recognition`
- **Value:** 99.2%
- **Target:** ≥ 98%
- **Status:** Good
- **Trend:** +1%

**6. Deferred Revenue Balance**
- **ID:** `deferred-revenue`
- **Value:** $18.5M
- **Target:** Trend monitoring
- **Status:** Good
- **Trend:** +12%

**7. Quote Win Rate**
- **ID:** `quote-win-rate`
- **Value:** 68.2%
- **Target:** ≥ 65%
- **Status:** Good
- **Trend:** +3%

**8. Renewal Quote Velocity**
- **ID:** `renewal-quote-velocity`
- **Value:** 12.5 days
- **Target:** ≤ 14 days
- **Status:** Good
- **Trend:** -6%

### Trends Section (Lines 354-423)

**Layout:** 2/3 chart + 1/3 metrics cards

**Trend Chart:**
- **Component:** `StrategicTrendChart`
- **Time Range:** Last 4 quarters (Q3'24 → Q2'25)
- **Metrics:**
  - Quote-to-Cash Cycle Time (line)
  - Quote Win Rate (line)
  - DSO (line)
  - Invoice Accuracy (line)

**Financial Health Card:**
- Overdue Invoices: $425K ↓ -12%
- Expansion ARR: 28.5% ↑ +4%

**Performance Summary Card:**
- Targets Met: 8 of 10
- Overall Health: Excellent
- Trend Direction: ↑ Improving

### Exception Alerts (Lines 425-426)

**Component:** `EnhancedExceptionAlerts`

**3 Alert Types:**
1. **Pending Quotes** (High): 12 quotes > 5 days, $1.8M
2. **Disputed Invoices** (Medium): 7 invoices, $425K
3. **High DSO Accounts** (High): 23 accounts > 60 days, $3.2M

---

## Level 2: Tactical Analysis

### File: `Level2TacticalAnalysis.tsx` (Lines 1-655)

### Entry Point

**Trigger:** Click KPI card in Level 1
**Function:** `handleDrillDown(kpiId, 2)` in DrillDownDashboard

### Component Structure

**Props:**
```typescript
{
  kpiId: string;
  onBack: () => void;
  onDrillToLevel3: (actionId: string) => void;
}
```

**State:**
```typescript
{
  activeView: string;
  kpiDrillDown: KPIDrillDown | null;
  filters: {
    timeRange: 'last-12-months',
    customerTier: 'all',
    productFamily: 'all',
    dealSize: 'all'
  }
}
```

### KPI-Specific Views

#### 1. Quote-to-Cash Cycle Time

**View A: Stage Breakdown (Lines 64-73)**
```
Waterfall Chart: Q2C Process Stages

Stage               | Avg Days | Target | Variance | % of Total | Status
--------------------|----------|--------|----------|------------|--------
Quote Creation      | 0.8      | 0.5    | +0.3     | 1.9%       | ⚠️
Approval Cycle      | 2.3      | 2.0    | +0.3     | 5.6%       | ⚠️
Order Booking       | 3.1      | 1.5    | +1.6     | 7.5%       | 🔴
Provisioning        | 5.6      | 2.0    | +3.6     | 13.6%      | 🔴
Invoice Generation  | 1.2      | 1.0    | +0.2     | 2.9%       | ✅
Payment Collection  | 28.2     | 20.0   | +8.2     | 68.4%      | 🔴

Total: 41.2 days (Target: 35 days)
```

**Key Insights:**
- Payment Collection is 68.4% of total cycle
- Provisioning exceeds target by 180%
- Order Booking has 107% variance

**View B: Payment Collection Heatmap (Lines 74-85)**
```
Days to Payment by Segment & Deal Type

              New Business | Renewal | Expansion
Enterprise    42.3d 🔴     | 22.1d ✅ | 31.2d ⚠️
Public Sector 51.8d 🔴     | 38.2d 🔴 | —
Mid-Market    35.7d ⚠️     | —        | —
SMB           28.4d ⚠️     | 19.7d ✅ | —

Legend: ✅ ≤30d  ⚠️ 31-40d  🔴 >40d
```

**View C: Legal Review Pareto (Lines 86-94)**
```
Root Cause Analysis

Cause                        | Cases | Avg Delay | Impact | % | Cumulative
-----------------------------|-------|-----------|--------|---|------------
Resource Capacity            | 87    | 6 days    | 522d   |35%| 35%
Complex Non-Standard Terms   | 64    | 4 days    | 256d   |28%| 63%
Outdated Contract Templates  | 43    | 3 days    | 129d   |18%| 81%
Customer Redline Cycles      | 29    | 2 days    | 58d    |12%| 93%
Approval Authority Escalation| 18    | 1 day     | 18d    | 7%| 100%
```

**80/20 Rule:** Top 2 causes = 63% of delays

#### 2. Invoice Accuracy

**View: Error Analysis by Product (Lines 134-140)**
```
Product Error Rates

Product       | Error Rate | Volume | Impact  | Status
--------------|------------|--------|---------|--------
ThousandEyes  | 2.1%       | 127    | $28.3K  | 🔴
Splunk        | 1.8%       | 98     | $22.2K  | 🔴
Umbrella      | 1.5%       | 156    | $18.9K  | ⚠️
Meraki        | 1.2%       | 234    | $12.5K  | ✅
Duo           | 0.8%       | 189    | $6.8K   | ✅
```

#### 3. DSO Analysis

**View: Aging Buckets by Tier (Lines 141-147)**
```
AR Aging Analysis

Tier      | Current | 31-60d | 61-90d | 90+   | Avg DSO | Status
----------|---------|--------|--------|-------|---------|--------
Strategic | $8.2M   | $1.2M  | $400K  | $200K | 22 days | ✅
Enterprise| $5.5M   | $1.1M  | $500K  | $200K | 28 days | ✅
Commercial| $3.8M   | $1.0M  | $500K  | $300K | 35 days | ⚠️
SMB       | $1.2M   | $500K  | $200K  | $100K | 42 days | 🔴
```

### Filter Panel

**Available Filters:**
- Time Range: Last 3/6/12 months, YTD, Custom
- Customer Tier: All, Strategic, Enterprise, Commercial, SMB
- Product Family: All, Meraki, Duo, Umbrella, ThousandEyes, Splunk
- Deal Size: All, <$50K, $50K-$100K, $100K-$500K, >$500K

---

## Level 3: Operational Actions

### File: `Level3OperationalActions.tsx` (Lines 1-732)

### Entry Point

**Trigger:** Drill-down from Level 2
**Function:** `handleDrillDown(kpiId, 3)` or click specific data point

### Action Item Structure

```typescript
interface ActionItem {
  id: string;
  type: 'quote' | 'invoice' | 'account' | 'contract';
  title: string;
  customer: string;
  amount: number;
  daysOverdue: number;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  nextAction: string;
  businessImpact: string;
}
```

### Sample Action Items

**Q2C Cycle Time - Action 1:**
```
ID: ENT-001
Title: Enterprise CFO Approval Delays
Customer: Global Pharma Inc
Amount: $480,000
Days Overdue: 67
Assignee: Jennifer Lee (AM)
Priority: HIGH 🔴
Status: Pending

Next Action:
→ Escalate to CFO with value realization report

Business Impact:
$12.3M ARR affected across 87 Enterprise deals.
Early payment discount could save $4.7M cash flow.
```

**Q2C Cycle Time - Action 2:**
```
ID: LEG-001
Title: Legal Team Resource Shortage
Customer: Multiple
Amount: $2.4M (aggregate)
Days Overdue: 14 (average)
Assignee: Legal Director
Priority: HIGH 🔴

Next Action:
→ Hire additional attorney or redistribute workload

Business Impact:
400 deals/quarter with only 2 attorneys.
Attorney B taking 2.25x longer than Attorney A.
```

### Action Queue Features

- **Search:** Filter by customer, assignee, or keyword
- **Sort:** By priority, amount, days overdue, status
- **Bulk Actions:** Assign, update status, export
- **Details View:** Expand to see full context and history

---

## KPI Calculations & Formulas

### Data Service: `commercialOpsService.ts`

### 1. Quote-to-Cash Cycle Time

**Formula:**
```typescript
AVG(payment_received_date - quote_created_date)
```

**Data Sources:**
- `quote_to_cash_tracking.json`: `quote_to_cash_days` field
- Pre-calculated for completed transactions

**Calculation (Lines 97-134):**
```typescript
const completedTracking = quoteTrackingData.filter(track => 
  track.is_complete === true && track.quote_to_cash_days
);

const avgCycleTime = completedTracking.reduce(
  (sum, track) => sum + (track.quote_to_cash_days || 0), 0
) / completedTracking.length;

// Trend: Current Q vs Previous Q
const currentQuarter = completedTracking.filter(track => 
  new Date(track.created_date) >= new Date('2025-04-01')
);
const previousQuarter = completedTracking.filter(track => 
  new Date(track.created_date) >= new Date('2025-01-01') && 
  new Date(track.created_date) < new Date('2025-04-01')
);

const trend = ((currentAvg - previousAvg) / previousAvg) * 100;
```

**Target:** ≤ 45 days
**Status Logic:**
- Good: ≤ 45 days
- Warning: 45-54 days (≤ 120% of target)
- Critical: > 54 days

### 2. Quote Approval Velocity

**Formula:**
```typescript
AVG(quote_accepted_date - quote_created_date)
```

**Data Sources:**
- `quotes.json`: `quote_created_date`, `quote_accepted_date`

**Calculation (Lines 139-191):**
```typescript
const quotesWithApproval = quotesData.filter(quote => 
  quote.quote_created_date && quote.quote_accepted_date
);

const approvalTimes = quotesWithApproval.map(quote => {
  const quoteDate = new Date(quote.quote_created_date);
  const approvalDate = new Date(quote.quote_accepted_date);
  return Math.ceil((approvalDate - quoteDate) / (1000 * 60 * 60 * 24));
});

const avgApprovalTime = approvalTimes.reduce((sum, time) => sum + time, 0) 
  / approvalTimes.length;
```

**Target:** ≤ 3 days

### 3. Invoice Accuracy Rate

**Formula:**
```typescript
(Error-Free Invoices / Total Invoices) × 100
```

**Data Sources:**
- `invoices.json`: `is_disputed` field

**Calculation (Lines 196-230):**
```typescript
const totalInvoices = invoicesData.length;
const errorFreeInvoices = invoicesData.filter(invoice => 
  invoice.is_disputed === false
).length;

const accuracyRate = (errorFreeInvoices / totalInvoices) * 100;
```

**Target:** ≥ 98%

### 4. Days Sales Outstanding (DSO)

**Formula:**
```typescript
(Accounts Receivable / Total Credit Sales) × Number of Days
```

**Data Sources:**
- `accounts_receivable.json`: `avg_days_outstanding`, `total_ar_balance`

**Calculation (Lines 235-260):**
```typescript
const validARData = accountsReceivableData.filter(ar => 
  ar.avg_days_outstanding && ar.avg_days_outstanding > 0
);

const totalAR = validARData.reduce((sum, ar) => sum + ar.total_ar_balance, 0);
const weightedDSO = validARData.reduce((sum, ar) => 
  sum + (ar.avg_days_outstanding * ar.total_ar_balance), 0
) / totalAR;
```

**Target:** ≤ 30 days

### 5. Revenue Recognition Accuracy

**Formula:**
```typescript
(1 - (|Actual - Expected| / Expected)) × 100
```

**Data Sources:**
- `revenue_recognition_schedule.json`: `total_variance`, `variance_percentage`

**Calculation (Lines 265-279):**
```typescript
// Simulated from revenue recognition data
const accuracy = 99.2; // Calculated from variance data
```

**Target:** ≥ 98%

### 6. Deferred Revenue Balance

**Formula:**
```typescript
SUM(total_deferred_balance)
```

**Data Sources:**
- `revenue_recognition_schedule.json`: `total_deferred_balance`

**Calculation (Lines 284-315):**
```typescript
const totalDeferred = revenueRecognitionData.reduce((sum, item) => {
  return sum + (item.total_deferred_balance || 0);
}, 0);

// Convert to millions
const value = Math.round(totalDeferred / 1000000 * 10) / 10;
```

### 7. Quote Win Rate

**Formula:**
```typescript
(Accepted Quotes / Total Quotes) × 100
```

**Data Sources:**
- `quotes.json`: `quote_status`

**Calculation (Lines 320-355):**
```typescript
const totalQuotes = quotesData.length;
const acceptedQuotes = quotesData.filter(quote => 
  quote.quote_status === 'accepted'
).length;

const winRate = (acceptedQuotes / totalQuotes) * 100;
```

**Target:** ≥ 65%

### 8. Renewal Quote Velocity

**Formula:**
```typescript
AVG(quote_sent_date - quote_created_date) WHERE quote_type = 'renewal'
```

**Data Sources:**
- `quotes.json`: `quote_type`, `quote_created_date`, `quote_sent_date`

**Calculation (Lines 360-413):**
```typescript
const renewalQuotes = quotesData.filter(quote => 
  quote.quote_type === 'renewal' && 
  quote.quote_created_date && 
  quote.quote_sent_date
);

const velocities = renewalQuotes.map(quote => {
  const createdDate = new Date(quote.quote_created_date);
  const sentDate = new Date(quote.quote_sent_date);
  return Math.ceil((sentDate - createdDate) / (1000 * 60 * 60 * 24));
});

const avgVelocity = velocities.reduce((sum, vel) => sum + vel, 0) 
  / velocities.length;
```

**Target:** ≤ 14 days

---

## Shared Data with CSM

### Master Data Files (Shared)

**1. customers.json**
- **Used by CO for:** Customer segmentation, ARR tracking, tier-based analysis
- **Used by CSM for:** Health scores, renewal risk, engagement tracking
- **Shared Fields:**
  - `customer_id`, `customer_name`, `tier`, `arr`, `industry`
  - `health_score`, `renewal_risk_score`, `csm_assigned`

**2. licenses.json**
- **Used by CO for:** Utilization-driven expansion, capacity alerts
- **Used by CSM for:** Adoption tracking, feature usage, product health
- **Shared Fields:**
  - `license_id`, `customer_id`, `product_family`, `utilization`
  - `license_count`, `adoption_stage`, `last_usage_date`

**3. contracts.json**
- **Used by CO for:** Renewal pipeline, contract value tracking
- **Used by CSM for:** Renewal planning, contract health
- **Shared Fields:**
  - `contract_id`, `customer_id`, `start_date`, `end_date`
  - `total_value`, `auto_renew`, `payment_terms`

### Cross-Persona Calculations

**1. Expansion ARR Contribution**
- **CO Calculation:** `(Expansion ARR / Total ARR) × 100`
- **CSM Input:** Customer health scores, utilization rates
- **Data Flow:** CSM identifies expansion-ready accounts → CO tracks quote-to-cash

**2. Utilization-Driven Expansion**
- **CO Metric:** Capacity alerts (utilization > 85%)
- **CSM Metric:** Feature adoption, user engagement
- **Shared Data:** `utilization_alerts.json`, `utilization_history.json`

**3. Renewal Risk**
- **CO View:** Payment history, DSO, invoice disputes
- **CSM View:** Health scores, engagement, support tickets
- **Combined Score:** Weighted average of both perspectives

---

## Component Structure

### Main Dashboard Components

**1. DrillDownDashboard.tsx**
- **Purpose:** Level 1 entry point and navigation controller
- **Key Functions:**
  - `handleDrillDown(kpiId, level)`: Navigate to deeper levels
  - `handleDrillUp()`: Return to previous level
  - `handleResetToLevel1()`: Return to dashboard home
  - `renderBreadcrumb()`: Show navigation path
- **State Management:**
  - `currentLevel`: Tracks drill-down depth (1, 2, or 3)
  - `kpis`: KPI values from service
  - `trendData`: Historical trends
  - `alerts`: Exception alerts

**2. DrillDownKPICard.tsx**
- **Purpose:** Interactive KPI tile with drill-down capability
- **Props:**
  - `kpiId`, `title`, `value`, `unit`, `target`, `trend`, `status`
  - `icon`, `color`, `description`, `onDrillDown`
- **Features:**
  - Hover effects
  - Click to drill down
  - Status indicators (good/warning/critical)
  - Trend arrows

**3. Level2TacticalAnalysis.tsx**
- **Purpose:** Dimensional breakdown and analysis
- **Key Features:**
  - Multiple view options per KPI
  - Interactive charts (Bar, Line, Heatmap, Pareto, Scatter)
  - Filter panel
  - Export capabilities
- **Chart Library:** Recharts

**4. Level3OperationalActions.tsx**
- **Purpose:** Actionable items and details
- **Key Features:**
  - Action item queue
  - Search and filter
  - Bulk operations
  - Detail expansion
  - Assignee management

### Supporting Components

**5. StrategicTrendChart.tsx**
- Multi-metric line chart
- Quarterly data points
- Legend and tooltips

**6. EnhancedExceptionAlerts.tsx**
- Alert cards with severity
- Click to drill down
- Dismiss/snooze functionality

**7. StrategicActionButtons.tsx**
- Export, refresh, configure
- Email scheduling
- Report generation

**8. QuoteToCashBreakdown.tsx**
- Process flow visualization
- Stage-by-stage metrics

**9. ProductPerformanceMatrix.tsx**
- Product comparison table
- Error rates by product

**10. DSOAgingAnalysis.tsx**
- AR aging buckets
- Tier-based breakdown

**11. RevenueVarianceAnalysis.tsx**
- Revenue recognition variance
- Driver analysis

---

## Technical Implementation

### Service Layer

**File:** `src/services/commercialOpsService.ts`

**Exports:**
```typescript
export function getCommercialOpsKPIs(): CommercialOpsKPIs
export function getTrendData(): TrendData[]
export function getExceptionAlerts(): ExceptionAlert[]
export function getProductFamilyPerformance()
export function getDSOAgingAnalysis()
```

**Data Loading:**
```typescript
import quotesData from '@/source_data/commercial_operations/quotes.json';
import invoicesData from '@/source_data/commercial_operations/invoices.json';
import accountsReceivableData from '@/source_data/commercial_operations/accounts_receivable.json';
// ... etc
```

### Drill-Down Service

**File:** `src/services/drillDownService.ts`

**Purpose:** Manages navigation state and drill-down logic

**Key Functions:**
```typescript
drillDown(kpiId: string, level: 2 | 3): DrillDownLevel
drillUp(): DrillDownLevel
resetToLevel1(): DrillDownLevel
getNavigationHistory(): DrillDownLevel[]
getKPIDrillDown(kpiId: string): KPIDrillDown
```

### Q2C Analytics Service

**File:** `src/services/q2cAnalyticsService.ts`

**Specialized analytics for Quote-to-Cash:**
```typescript
export function getQ2CStageBreakdown()
export function getQ2CBottleneckHeatmap()
export function getQ2CDealSizeCorrelation()
export function getQ2CProductFamilyImpact()
export function getQ2CCapacityInsights()
export function getQ2CSeasonalTrends()
export function getQ2CHistoricalTrends()
export function getQ2CQuotesRequiringAction()
```

### Data Validation

**File:** `src/utils/dataValidation.ts`

**Function:** `validateCommercialOpsData()`
- Checks data completeness
- Validates referential integrity
- Logs warnings in development mode

---

## End of Document

**Total Pages:** 15  
**Last Updated:** October 12, 2025  
**Maintained By:** Development Team  
**Review Cycle:** Quarterly
