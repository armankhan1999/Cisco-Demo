# Sales Expansion Dashboard - Gap Analysis & Improvement Plan

**Document Version:** 1.0  
**Created:** October 12, 2025  
**Purpose:** Comprehensive analysis of Sales Expansion dashboard vs Commercial Operations structure, identifying gaps and providing implementation roadmap

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Gap Analysis vs Commercial Operations](#gap-analysis-vs-commercial-operations)
4. [Data Architecture Issues](#data-architecture-issues)
5. [Recommended Improvements](#recommended-improvements)
6. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

### Current State
The Sales Expansion (SE) dashboard exists as a **basic 3-tier view** in `src/app/se/page.tsx` (791 lines) but lacks the sophisticated drill-down architecture, component modularity, and navigation structure present in Commercial Operations.

### Critical Gaps Identified

| Category | Commercial Operations | Sales Expansion | Gap Severity |
|----------|----------------------|-----------------|--------------|
| **Component Structure** | 11 specialized components | 1 monolithic file | 🔴 Critical |
| **Navigation** | 3-level drill-down with breadcrumbs | Simple tier buttons | 🔴 Critical |
| **Service Layer** | Dedicated service with calculations | Basic API service | 🟡 High |
| **Data Integration** | Direct JSON imports + services | Direct JSON imports only | 🟡 High |
| **Drill-Down Logic** | `drillDownService.ts` with state mgmt | None | 🔴 Critical |
| **KPI Cards** | Interactive `DrillDownKPICard` | Static div cards | 🔴 Critical |
| **Charts/Visualizations** | Recharts with 8+ chart types | None | 🔴 Critical |
| **Exception Alerts** | Dedicated alert component | None | 🟡 High |
| **Filters** | Multi-dimensional filtering | None | 🟡 High |
| **Action Items** | Level 3 action queue | Basic table | 🟡 High |

### Business Impact
- **User Experience**: SE dashboard feels disconnected from CO dashboard
- **Navigation**: Users cannot drill into details effectively
- **Actionability**: No clear path from insight to action
- **Consistency**: Different UX patterns confuse users

---

## Current State Analysis

### File Structure

**Sales Expansion:**
```
src/
├── app/
│   └── se/
│       └── page.tsx (791 lines - MONOLITHIC)
├── services/
│   └── salesExpansionService.ts (388 lines - API only)
├── types/
│   └── salesExpansion.ts (type definitions)
└── source_data/
    └── sales-expansion-data/
        ├── competitive-intelligence.json (108KB)
        ├── expansion-opportunities.json (144KB)
        ├── expansion-pipeline-tracking.json (4.5KB)
        ├── expansion-success-stories.json (37KB)
        ├── expansion-triggers.json (56KB)
        └── lookalike-analysis.json (97KB)
```

**Commercial Operations (for comparison):**
```
src/
├── components/
│   └── CommercialOps/
│       ├── DrillDownDashboard.tsx (452 lines)
│       ├── Level2TacticalAnalysis.tsx (655 lines)
│       ├── Level3OperationalActions.tsx (732 lines)
│       ├── DrillDownKPICard.tsx (200+ lines)
│       ├── StrategicTrendChart.tsx (150+ lines)
│       ├── EnhancedExceptionAlerts.tsx (450+ lines)
│       └── [6 more specialized components]
├── services/
│   ├── commercialOpsService.ts (470+ lines)
│   ├── drillDownService.ts (navigation logic)
│   └── q2cAnalyticsService.ts (specialized analytics)
└── source_data/
    └── commercial_operations/ (21 files, 8.5MB)
```

### Current SE Dashboard Structure

**Lines 1-283: Setup & Calculations**
- Direct JSON imports (lines 7-14)
- State management (lines 26-49)
- Tier 1 KPI calculations (lines 79-137)
- Tier 2 KPI calculations (lines 140-204)
- Tier 3 KPI calculations (lines 207-250)

**Lines 284-486: Tier 1 View**
- Header with tier buttons (lines 286-324)
- 4 KPI cards (lines 331-391)
- 2 performance metric cards (lines 394-485)

**Lines 489-637: Tier 2 View**
- NRR by tier (lines 498-515)
- Expansion by category (lines 518-537)
- White space by segment (lines 540-557)
- Pipeline by stage (lines 560-590)
- Utilization by product (lines 593-635)

**Lines 640-791: Tier 3 View**
- Hot opportunities table (lines 643-674)
- Capacity alerts (lines 677-710)
- Account readiness (lines 713-791)

### Problems with Current Structure

#### 1. **Monolithic Component** (791 lines)
- All logic in one file
- No component reusability
- Difficult to maintain
- No separation of concerns

#### 2. **No Drill-Down Navigation**
- Simple tier switching (Tier 1/2/3 buttons)
- No context preservation
- No breadcrumb trail
- Cannot drill from specific KPI

#### 3. **Static KPI Cards**
```typescript
// Current: Static div (lines 333-345)
<div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
  <div className="text-sm text-gray-600 mb-1">NET REVENUE RETENTION</div>
  <div className="text-4xl font-bold text-gray-900 mb-2">{formatNRR(tier1Data.nrr)}</div>
  // No click handler, no drill-down capability
</div>

// Should be: Interactive component (like CO)
<DrillDownKPICard
  kpiId="nrr"
  title="Net Revenue Retention"
  value={tier1Data.nrr}
  onDrillDown={() => handleDrillDown('nrr', 2)}
  // Full interactivity
/>
```

#### 4. **No Visualizations**
- No charts (CO has 8+ chart types)
- No trend lines
- No heatmaps
- No scatter plots
- Only tables and progress bars

#### 5. **Poor Data Integration**
```typescript
// Current: Direct imports (lines 7-14)
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
// ... etc

// Should be: Service-based (like CO)
const kpis = await salesExpansionService.getSalesExpansionKPIs();
const trendData = await salesExpansionService.getTrendData();
```

#### 6. **No Exception Alerts**
- CO has dedicated alert panel
- SE has no alert system
- No prioritization of actions

#### 7. **No Filters**
- CO has time range, tier, product, deal size filters
- SE has no filtering capability

---

## Gap Analysis vs Commercial Operations

### 1. Component Architecture

**Commercial Operations:**
```
DrillDownDashboard (Main)
    ├── DrillDownKPICard × 8 (Interactive tiles)
    ├── StrategicTrendChart (Multi-metric trends)
    ├── EnhancedExceptionAlerts (Alert panel)
    ├── StrategicActionButtons (Export, refresh, etc.)
    ├── Level2TacticalAnalysis (On KPI click)
    │   ├── Multiple chart types
    │   ├── Filter panel
    │   └── Drill-down triggers
    └── Level3OperationalActions (On drill-down)
        ├── Action item queue
        ├── Search & filter
        └── Detail expansion
```

**Sales Expansion (Current):**
```
SalesExpansionDashboard (Monolithic)
    ├── Tier 1: Static KPI cards
    ├── Tier 2: Static tables
    └── Tier 3: Static tables
    (No components, no drill-down)
```

### 2. Navigation Flow

**Commercial Operations:**
```
Level 1 (Strategic Overview)
    ↓ Click KPI Card
Level 2 (Tactical Analysis)
    ↓ Click Data Point
Level 3 (Operational Actions)
    ↑ Breadcrumb navigation back
    ↑ "Back" button
    ↑ "Reset to Level 1" button
```

**Sales Expansion (Current):**
```
Tier 1 ←→ Tier 2 ←→ Tier 3
(Simple button toggle, no context)
```

### 3. Data Service Comparison

**Commercial Operations Service:**
```typescript
// commercialOpsService.ts
export function getCommercialOpsKPIs(): CommercialOpsKPIs {
  return {
    quoteToCashCycleTime: calculateQuoteToCashCycleTime(),
    quoteApprovalVelocity: calculateQuoteApprovalVelocity(),
    invoiceAccuracyRate: calculateInvoiceAccuracyRate(),
    // ... 8 KPIs with full calculations
  };
}

export function getTrendData(): TrendData[] {
  // Historical trends for charts
}

export function getExceptionAlerts(): ExceptionAlert[] {
  // Prioritized alerts
}
```

**Sales Expansion Service (Current):**
```typescript
// salesExpansionService.ts
class SalesExpansionService {
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${this.baseUrl}/customers`);
    return response.json();
  }
  // Just API wrappers, no calculations
}
```

### 4. KPI Card Comparison

**Commercial Operations:**
```typescript
<DrillDownKPICard
  kpiId="quote-to-cash-cycle"
  title="Quote-to-Cash Cycle Time"
  value={kpis.quoteToCashCycleTime.value}
  unit="days"
  target={45}
  trend={kpis.quoteToCashCycleTime.trend}
  status={kpis.quoteToCashCycleTime.status}
  icon={Clock}
  color="blue"
  description="Average days from quote creation to payment received"
  onDrillDown={() => handleDrillDown('quote-to-cash-cycle', 2)}
/>
```

**Sales Expansion (Current):**
```typescript
<div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
  <div className="text-sm text-gray-600 mb-1">NET REVENUE RETENTION</div>
  <div className="text-4xl font-bold text-gray-900 mb-2">{formatNRR(tier1Data.nrr)}</div>
  <div className="w-full bg-gray-200 rounded-full h-1.5">
    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(tier1Data.nrr, 100)}%` }}></div>
  </div>
</div>
```

### 5. Missing Features

| Feature | CO | SE | Priority |
|---------|----|----|----------|
| Drill-down navigation | ✅ | ❌ | 🔴 Critical |
| Breadcrumb trail | ✅ | ❌ | 🔴 Critical |
| Interactive KPI cards | ✅ | ❌ | 🔴 Critical |
| Trend charts | ✅ | ❌ | 🔴 Critical |
| Exception alerts | ✅ | ❌ | 🟡 High |
| Filter panel | ✅ | ❌ | 🟡 High |
| Export functionality | ✅ | ❌ | 🟢 Medium |
| Action item queue | ✅ | ❌ | 🟡 High |
| Search capability | ✅ | ❌ | 🟢 Medium |
| Heatmaps | ✅ | ❌ | 🟡 High |
| Scatter plots | ✅ | ❌ | 🟢 Medium |
| Pareto charts | ✅ | ❌ | 🟢 Medium |
| Waterfall charts | ✅ | ❌ | 🟢 Medium |

---

## Data Architecture Issues

### 1. Data Source Problems

**Current SE Data Files:**
- `expansion-opportunities.json` (144KB) - ✅ Good
- `competitive-intelligence.json` (108KB) - ✅ Good
- `lookalike-analysis.json` (97KB) - ✅ Good
- `expansion-triggers.json` (56KB) - ✅ Good
- `expansion-success-stories.json` (37KB) - ✅ Good
- `expansion-pipeline-tracking.json` (4.5KB) - ⚠️ Minimal

**Missing SE-Specific Data:**
- ❌ `sales_expansion_kpi_metrics.json` (pre-calculated KPIs)
- ❌ `expansion_trend_data.json` (historical trends)
- ❌ `expansion_exception_alerts.json` (prioritized alerts)
- ❌ `expansion_drill_down_config.json` (drill-down definitions)

### 2. Master Data Usage

**Current:** Direct imports in component
```typescript
// Lines 7-14 in se/page.tsx
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
```

**Should be:** Service-based with caching
```typescript
// In salesExpansionService.ts
private customersCache: Customer[] | null = null;

async getCustomers(): Promise<Customer[]> {
  if (!this.customersCache) {
    this.customersCache = await import('@/source_data/master-data/customers.json');
  }
  return this.customersCache;
}
```

### 3. Calculation Issues

**Current:** All calculations in component (lines 79-250)
- 171 lines of calculation logic in UI component
- No reusability
- No testing capability
- Recalculates on every render

**Should be:** Service-based calculations
- Move to `salesExpansionService.ts`
- Cache results
- Testable functions
- Reusable across components

---

## Recommended Improvements

### Phase 1: Component Restructuring (Week 1)

#### 1.1 Create Component Directory
```
src/components/SalesExpansion/
├── DrillDownDashboard.tsx (Main entry point)
├── Level2TacticalAnalysis.tsx (Tier 2 views)
├── Level3OperationalActions.tsx (Tier 3 actions)
├── DrillDownKPICard.tsx (Interactive KPI tiles)
├── ExpansionTrendChart.tsx (Multi-metric trends)
├── ExpansionAlerts.tsx (Exception alerts)
├── ExpansionFilters.tsx (Filter panel)
├── PipelineVisualization.tsx (Pipeline charts)
├── WhiteSpaceMatrix.tsx (Product penetration)
└── AccountReadinessTable.tsx (Account list)
```

#### 1.2 Refactor Main Dashboard
**File:** `src/components/SalesExpansion/DrillDownDashboard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { drillDownService, type DrillDownLevel } from '@/services/drillDownService';
import { getSalesExpansionKPIs, getTrendData, getExceptionAlerts } from '@/services/salesExpansionService';
import DrillDownKPICard from './DrillDownKPICard';
import ExpansionTrendChart from './ExpansionTrendChart';
import ExpansionAlerts from './ExpansionAlerts';
import Level2TacticalAnalysis from './Level2TacticalAnalysis';
import Level3OperationalActions from './Level3OperationalActions';

export default function DrillDownDashboard() {
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>({
    level: 1,
    title: 'Strategic Overview',
    description: 'High-level expansion KPIs'
  });
  const [kpis, setKPIs] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const kpiData = await getSalesExpansionKPIs();
    const trends = await getTrendData();
    const alertData = await getExceptionAlerts();
    
    setKPIs(kpiData);
    setTrendData(trends);
    setAlerts(alertData);
  };

  const handleDrillDown = (kpiId: string, level: 2 | 3) => {
    const newLevel = drillDownService.drillDown(kpiId, level);
    setCurrentLevel(newLevel);
  };

  const handleDrillUp = () => {
    const newLevel = drillDownService.drillUp();
    setCurrentLevel(newLevel);
  };

  // Render Level 2
  if (currentLevel.level === 2 && currentLevel.kpi) {
    return (
      <Level2TacticalAnalysis 
        kpiId={currentLevel.kpi}
        onBack={handleDrillUp}
        onDrillToLevel3={(actionId) => handleDrillDown(currentLevel.kpi!, 3)}
      />
    );
  }

  // Render Level 3
  if (currentLevel.level === 3 && currentLevel.kpi) {
    return (
      <Level3OperationalActions 
        kpiId={currentLevel.kpi}
        onBack={handleDrillUp}
      />
    );
  }

  // Render Level 1 (Strategic Overview)
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header with breadcrumb */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        {/* Breadcrumb navigation */}
        {/* Title and description */}
        {/* Tab navigation */}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-6 p-8">
        <DrillDownKPICard
          kpiId="nrr"
          title="Net Revenue Retention"
          value={kpis?.nrr.value}
          unit="%"
          target={110}
          trend={kpis?.nrr.trend}
          status={kpis?.nrr.status}
          onDrillDown={() => handleDrillDown('nrr', 2)}
        />
        {/* ... 9 more KPI cards */}
      </div>

      {/* Trends & Alerts */}
      <div className="grid grid-cols-3 gap-6 p-8">
        <div className="col-span-2">
          <ExpansionTrendChart data={trendData} />
        </div>
        <div>
          <ExpansionAlerts alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
```

### Phase 2: Service Layer Enhancement (Week 1-2)

#### 2.1 Enhanced Sales Expansion Service
**File:** `src/services/salesExpansionService.ts`

```typescript
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import revenueMovementsData from '@/source_data/commercial_operations/revenue_movements.json';
// ... other imports

export interface SalesExpansionKPIs {
  nrr: KPIValue;
  expansionARR: KPIValue;
  multiProductPenetration: KPIValue;
  whiteSpaceValue: KPIValue;
  pipelineARR: KPIValue;
  crossSellRate: KPIValue;
  winRate: KPIValue;
  timeToExpansion: KPIValue;
  shareOfWallet: KPIValue;
  capacityARR: KPIValue;
}

export interface KPIValue {
  value: number;
  trend: number; // % change
  status: 'good' | 'warning' | 'critical';
  target: number;
}

// Calculate all KPIs
export function getSalesExpansionKPIs(): SalesExpansionKPIs {
  return {
    nrr: calculateNRR(),
    expansionARR: calculateExpansionARR(),
    multiProductPenetration: calculateMultiProductPenetration(),
    whiteSpaceValue: calculateWhiteSpaceValue(),
    pipelineARR: calculatePipelineARR(),
    crossSellRate: calculateCrossSellRate(),
    winRate: calculateWinRate(),
    timeToExpansion: calculateTimeToExpansion(),
    shareOfWallet: calculateShareOfWallet(),
    capacityARR: calculateCapacityARR()
  };
}

// Individual KPI calculations
function calculateNRR(): KPIValue {
  const expansionMovements = revenueMovementsData.filter(m => m.movement_type === 'expansion');
  const churnMovements = revenueMovementsData.filter(m => m.movement_type === 'churn');
  const totalExpansionARR = expansionMovements.reduce((sum, m) => sum + m.arr_change, 0);
  const totalChurnARR = churnMovements.reduce((sum, m) => sum + Math.abs(m.arr_change), 0);
  const totalARR = customersData.reduce((sum, c) => sum + c.arr, 0);
  
  const value = totalARR > 0 ? ((totalARR + totalExpansionARR - totalChurnARR) / totalARR) * 100 : 0;
  const target = 110;
  const trend = 3.2; // Calculate from historical data
  const status = value >= target ? 'good' : value >= target * 0.95 ? 'warning' : 'critical';
  
  return { value, trend, status, target };
}

// ... 9 more KPI calculation functions

// Trend data for charts
export function getTrendData(): TrendData[] {
  // Return last 4 quarters of data
  return [
    { period: 'Q3 2024', nrr: 112.5, expansionARR: 4.2, winRate: 65.3 },
    { period: 'Q4 2024', nrr: 113.8, expansionARR: 4.8, winRate: 67.1 },
    { period: 'Q1 2025', nrr: 114.2, expansionARR: 5.1, winRate: 68.5 },
    { period: 'Q2 2025', nrr: 114.8, expansionARR: 5.4, winRate: 68.2 }
  ];
}

// Exception alerts
export function getExceptionAlerts(): ExceptionAlert[] {
  return [
    {
      id: 'alert-1',
      type: 'hot_opportunity',
      severity: 'high',
      title: '15 Hot Opportunities Ready',
      description: 'Expansion readiness score ≥ 80',
      count: 15,
      value: 2800000,
      action: 'Review opportunities'
    },
    {
      id: 'alert-2',
      type: 'capacity_alert',
      severity: 'high',
      title: '23 Capacity Alerts Active',
      description: 'Utilization ≥ 85%',
      count: 23,
      value: 1200000,
      action: 'Contact customers'
    },
    {
      id: 'alert-3',
      type: 'competitive_threat',
      severity: 'medium',
      title: '8 Competitive Threats',
      description: 'Win probability < 70%',
      count: 8,
      value: 950000,
      action: 'Review strategy'
    }
  ];
}
```

#### 2.2 Drill-Down Service Integration
**File:** `src/services/drillDownService.ts` (extend existing)

```typescript
// Add SE KPI definitions
const SE_KPI_DEFINITIONS = {
  'nrr': {
    id: 'nrr',
    title: 'Net Revenue Retention',
    level2Views: [
      { id: 'nrr-by-tier', title: 'NRR by Customer Tier', chartType: 'bar' },
      { id: 'nrr-cohort', title: 'Cohort Analysis', chartType: 'line' },
      { id: 'expansion-vs-churn', title: 'Expansion vs Churn', chartType: 'waterfall' }
    ],
    level3Actions: [
      { id: 'tier-accounts', title: 'Tier-Specific Accounts' },
      { id: 'expansion-details', title: 'Expansion Transaction Details' }
    ]
  },
  // ... 9 more KPI definitions
};
```

### Phase 3: Visualization Components (Week 2)

#### 3.1 Trend Chart Component
**File:** `src/components/SalesExpansion/ExpansionTrendChart.tsx`

```typescript
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExpansionTrendChartProps {
  data: TrendData[];
}

export default function ExpansionTrendChart({ data }: ExpansionTrendChartProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Expansion Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="nrr" stroke="#3B82F6" name="NRR %" />
          <Line yAxisId="right" type="monotone" dataKey="expansionARR" stroke="#10B981" name="Expansion ARR ($M)" />
          <Line yAxisId="left" type="monotone" dataKey="winRate" stroke="#8B5CF6" name="Win Rate %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Phase 4: Level 2 & 3 Components (Week 2-3)

#### 4.1 Level 2 Tactical Analysis
**File:** `src/components/SalesExpansion/Level2TacticalAnalysis.tsx`

Similar structure to CO's Level2TacticalAnalysis with:
- Multiple view options per KPI
- Interactive charts (Bar, Line, Heatmap, Scatter)
- Filter panel
- Drill-down triggers

#### 4.2 Level 3 Operational Actions
**File:** `src/components/SalesExpansion/Level3OperationalActions.tsx`

Similar structure to CO's Level3OperationalActions with:
- Action item queue
- Search and filter
- Detail expansion
- Bulk operations

---

## Implementation Roadmap

### Week 1: Foundation
- [ ] Create `src/components/SalesExpansion/` directory
- [ ] Create `DrillDownDashboard.tsx` (main component)
- [ ] Create `DrillDownKPICard.tsx` (reusable KPI tile)
- [ ] Enhance `salesExpansionService.ts` with KPI calculations
- [ ] Move all calculation logic from component to service
- [ ] Add SE KPI definitions to `drillDownService.ts`

### Week 2: Visualization & Navigation
- [ ] Create `ExpansionTrendChart.tsx`
- [ ] Create `ExpansionAlerts.tsx`
- [ ] Create `ExpansionFilters.tsx`
- [ ] Implement drill-down navigation
- [ ] Add breadcrumb trail
- [ ] Create Level 2 component structure

### Week 3: Deep Dive Components
- [ ] Create `Level2TacticalAnalysis.tsx`
- [ ] Implement all Level 2 views (8+ views per KPI)
- [ ] Add chart components (Heatmap, Scatter, Pareto, etc.)
- [ ] Create `Level3OperationalActions.tsx`
- [ ] Implement action item queue

### Week 4: Polish & Testing
- [ ] Add exception alerts
- [ ] Implement filters (time, tier, product, deal size)
- [ ] Add export functionality
- [ ] Add search capability
- [ ] Test all drill-down paths
- [ ] Performance optimization
- [ ] Documentation updates

---

## Priority Action Items

### 🔴 Critical (Do First)
1. **Create component directory structure**
2. **Refactor monolithic page.tsx into DrillDownDashboard.tsx**
3. **Create DrillDownKPICard component**
4. **Implement drill-down navigation**
5. **Move calculations to service layer**

### 🟡 High (Do Next)
6. **Add trend charts**
7. **Create Level 2 tactical analysis**
8. **Add exception alerts**
9. **Implement filters**
10. **Create Level 3 operational actions**

### 🟢 Medium (Do Later)
11. **Add advanced visualizations (heatmaps, scatter plots)**
12. **Implement export functionality**
13. **Add search capability**
14. **Performance optimization**
15. **Comprehensive testing**

---

## Success Metrics

### User Experience
- ✅ Navigation feels consistent with CO dashboard
- ✅ Users can drill from KPI → Analysis → Action
- ✅ Breadcrumb trail shows context
- ✅ Back button works intuitively

### Technical Quality
- ✅ Component reusability > 80%
- ✅ Code duplication < 10%
- ✅ Service layer handles all calculations
- ✅ Master data accessed through services

### Business Value
- ✅ Time to insight reduced by 50%
- ✅ Action item completion rate increased
- ✅ User satisfaction score > 8/10
- ✅ Dashboard load time < 2 seconds

---

## End of Document

**Next Steps:** Begin Phase 1 implementation
**Review Date:** After Week 2 completion
**Maintained By:** Development Team
