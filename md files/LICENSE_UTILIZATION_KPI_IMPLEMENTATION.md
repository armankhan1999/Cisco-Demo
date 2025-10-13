# License Utilization KPI Implementation

## Overview
Complete 3-level dashboard architecture for Portfolio Average Utilization KPI with real synthetic data integration and comprehensive drill-down capabilities.

## Architecture

### Level 1: Strategic View (Portfolio Executive Summary)
- **KPI Tile**: Portfolio Average Utilization
- **Data Source**: Real synthetic data from `utilization_history.json`
- **Calculation**: Weighted average utilization across entire CSM portfolio
- **Features**:
  - Dynamic status-based coloring (green/orange/red)
  - 30-day trend indicators with directional arrows
  - Click-to-drill-down functionality
  - Real-time data updates

### Level 2: Tactical View (Portfolio Segmentation & Analysis)
- **Utilization Distribution Histogram**: Visual segmentation by utilization buckets
- **Interactive Features**:
  - Clickable histogram bars for drill-down
  - Color-coded status indicators
  - ARR impact analysis per bucket
  - Account count and percentage breakdown

### Level 3: Operational View (Account-Level Detail & Actions)
- **Account Utilization Table**: Detailed account-level metrics
- **Features**:
  - Priority scoring algorithm
  - Recommended actions based on utilization and health
  - Pagination and filtering
  - Click-to-drill-down to individual accounts

### Level 4: Individual Account Deep-Dive
- **Account Detail Page**: Comprehensive single-account analysis
- **Features**:
  - Complete account overview
  - Utilization metrics and trends
  - Priority scoring and recommendations
  - Action planning interface

## Data Integration

### Real Synthetic Data Sources
- `utilization_history.json`: License utilization snapshots
- `licenses.json`: License details and configurations
- `accounts.json`: Customer account information
- `subscriptions.json`: Subscription and ARR data

### KPI Calculations
```typescript
// Portfolio Average Utilization
const portfolioUtilization = totalArr > 0 ? weightedSum / totalArr : (totalUsed / totalLicenses) * 100;

// Utilization Distribution Buckets
const buckets = [
  { min: 0, max: 20, status: 'critical' },
  { min: 21, max: 40, status: 'high-risk' },
  { min: 41, max: 60, status: 'moderate' },
  { min: 61, max: 80, status: 'healthy' },
  { min: 81, max: 100, status: 'optimal' },
  { min: 101, max: Infinity, status: 'overage' }
];

// Priority Scoring
let priorityScore = 0;
if (utilization < 20) priorityScore += 40;
if (healthScore < 60) priorityScore += 30;
if (daysToRenewal < 90) priorityScore += 20;
if (arr > 100000) priorityScore += 10;
```

## UI Components

### 1. PortfolioUtilizationKPI.tsx
- Light pastel background with status-based coloring
- Trend indicators with smart color logic
- Progress bar visualization
- Click-to-drill-down functionality

### 2. UtilizationDistribution.tsx
- Interactive histogram visualization
- Color-coded status indicators
- Clickable rows for drill-down
- ARR impact analysis

### 3. AccountUtilizationTable.tsx
- Comprehensive account listing
- Priority-based sorting
- Pagination controls
- Action recommendations

### 4. Account Detail Page
- Complete account overview
- Utilization metrics dashboard
- Priority and action planning
- Trend visualization placeholder

## Navigation Flow

```
CSM Portfolio Dashboard
    ↓ (Click Portfolio Utilization KPI)
Portfolio Utilization Page
    ↓ (Click Distribution Tab)
Utilization Distribution View
    ↓ (Click Histogram Bar)
Account Table (Filtered by Bucket)
    ↓ (Click Account Name)
Individual Account Detail Page
```

## Key Features

### Dynamic Data Integration
- All calculations use real synthetic data
- No static/hardcoded values
- Real-time updates and trends
- Month-over-month change calculations

### Smart Status Logic
- Utilization-based status determination
- Health score correlation
- Renewal proximity consideration
- ARR impact weighting

### Interactive Drill-Down
- Seamless navigation between levels
- Context preservation across views
- Filtering and segmentation
- Action-oriented recommendations

### Responsive Design
- Mobile-first approach
- Consistent styling with existing CSM dashboards
- Light color theme as requested
- Accessible UI components

## File Structure

```
src/
├── lib/kpis/
│   └── licenseUtilizationKPIs.ts          # KPI calculation functions
├── components/CSM/LicenseUtilization/
│   ├── PortfolioUtilizationKPI.tsx        # Level 1 KPI tile
│   ├── UtilizationDistribution.tsx        # Level 2 histogram
│   └── AccountUtilizationTable.tsx        # Level 3 account table
├── app/csm/kpi/portfolio-utilization/
│   └── page.tsx                           # Main dashboard page
└── app/csm/accounts/[customerId]/
    └── page.tsx                           # Individual account detail
```

## Usage

### Accessing the Dashboard
1. Navigate to CSM Portfolio Dashboard
2. Click on "Portfolio Average Utilization" KPI tile
3. Explore different views using the navigation tabs
4. Drill down to specific accounts for detailed analysis

### Key Metrics
- **Portfolio Utilization**: Weighted average across all accounts
- **Distribution Analysis**: Account segmentation by utilization ranges
- **Priority Scoring**: Risk-based account prioritization
- **Action Recommendations**: Contextual next steps

## Data Quality
- All values derived from real synthetic data
- Consistent calculations across all views
- No hardcoded or static values
- Real-time trend analysis
- Month-over-month change tracking

## Future Enhancements
- Real-time utilization trend charts
- Advanced filtering and segmentation
- Bulk action capabilities
- Export functionality
- Integration with external systems
