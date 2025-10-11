# Drill-Through Architecture Documentation

## Overview
This document outlines the complete drill-through flow architecture for NRR, Expansion ARR, Multi-Product Penetration, and White Space Opportunities. All implementations use ONLY master data from `src/source_data/`.

## Universal Drill-Through Pattern

### Level Structure
- **Level 1**: High-level KPI overview with summary cards
- **Level 2**: Analytical deep-dive with charts, matrices, and segmentation
- **Level 3**: Actionable account-level details with specific opportunities

### Component Architecture
```typescript
interface DrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
}
```

## 1. NRR (Net Revenue Retention) Flow

### Level 1 - Overview
**File**: `NRRDrillDownModal.tsx`
**Layout**: Tab-based (Overview | Details)

#### Overview Tab Cards (4 cards):
- **Current Quarter NRR**: `${(netNRR / 1000000).toFixed(1)}M`
- **YoY Comparison**: Calculated from historical data
- **Target Achievement**: vs $46.4M benchmark
- **Customer Count**: Total customers in calculation

#### Details Tab Charts:
- **Quarterly NRR Trend**: Line chart with real values
- **NRR Waterfall**: Component breakdown
- **Customer Tier Analysis**: Segmented performance

### Level 2 - Analytics (Not yet implemented)
**Planned Features**:
- NRR by customer tier drill-down
- Cohort analysis
- Expansion vs churn breakdown
- Individual customer contributions

### Level 3 - Account Details (Not yet implemented)
**Planned Features**:
- Account-specific NRR calculations
- Expansion transaction history
- Churn risk factors
- Recommended actions

## 2. Expansion ARR Flow

### Level 1 - Overview
**File**: `ExpansionARRDrillDownModal.tsx`
**Layout**: Tab-based (Overview | Analytics)

#### Overview Tab Cards (4 clickable cards):
```typescript
// Each card has onClick handler for drill-through
onClick={() => {
  setSelectedCategory('upsell'); // or cross_sell, capacity, bundle
  onLevelChange(2);
}}
```

- **Upsell ARR**: `${(upsellARR / 1000000).toFixed(1)}M` - Clickable
- **Cross-Sell ARR**: `${(crossSellARR / 1000000).toFixed(1)}M` - Clickable  
- **Capacity ARR**: `${(capacityARR / 1000000).toFixed(1)}M` - Clickable
- **Bundle ARR**: `${(bundleARR / 1000000).toFixed(1)}M` - Clickable

#### Summary Sections:
- **Expansion Performance Summary**: Real metrics from opportunities
- **Quarterly Expansion Trend**: Current quarter total
- **Top Performing Categories**: Dynamic rankings

### Level 2 - Category Drill-Down
**Functionality**: Shows all opportunities for selected category
```typescript
const categoryOpportunities = selectedCategory === 'capacity' 
  ? expansionOpportunities.filter(opp => opp.business_case?.includes('Capacity threshold'))
  : expansionOpportunities.filter(opp => opp.opportunity_type === selectedCategory);
```

**Display**:
- Account list with expansion potential
- Stage and probability information
- Total ARR for category
- Back navigation to Level 1

### Level 3 - Account Details
**File**: `AccountDetailModal.tsx`
**Triggered**: Click on specific account in Level 2
**Content**: Account-specific expansion details

## 3. Multi-Product Penetration Flow

### Level 1 - Overview
**File**: `MultiProductDrillDownModal.tsx`
**Layout**: Tab-based (Overview | Analytics)

#### Overview Tab Cards (4 cards):
- **Multi-Product Customers**: `{multiProductCustomers}` count
- **Single Product**: `{singleProductCustomers}` count  
- **Avg Products**: `{avgProducts}` per customer
- **Cross-Sell Value**: `${(crossSellValue / 1000000).toFixed(1)}M`

#### Sections:
- **Customer Segmentation**: By product count (3+, 2, 1)
- **Cross-Sell Expansion Opportunities**: Real opportunity metrics

### Level 2 - Analytics
**File**: `MultiProductDrillDown.tsx` - `MultiProductLevel2`
**Features**:
- **Product Penetration Matrix**: Clickable heatmap
- **Customer Tier Analysis**: Clickable tier breakdown
- **Cross-Sell Opportunities by Product**: Clickable product cards

#### Clickable Elements:
```typescript
// Product combination cells
onClick={() => onProductComboClick?.(product1, product2, count)}

// Tier rows  
onClick={() => onTierClick?.(tier)}
```

### Level 3 - Single-Product Accounts
**File**: `MultiProductDrillDown.tsx` - `MultiProductLevel3`
**Content**:
- Complete list of single-product customers
- Real cross-sell opportunities from expansion data
- Recommended actions (top 2 high-readiness)
- Account detail modal integration

## 4. White Space Opportunities Flow

### Level 1 - Overview (To be implemented)
**File**: `WhiteSpaceDrillDownModal.tsx` (needs creation)
**Layout**: Tab-based (Overview | Analytics)

#### Planned Overview Cards (4 clickable cards):
- **Total White Space**: Drill to all opportunities
- **High-Priority Opportunities**: Drill to fit_score >= 80
- **Product Gaps**: Drill to product gap analysis
- **Tier Analysis**: Drill to tier breakdown

### Level 2 - Analytics ✅ IMPLEMENTED
**File**: `WhiteSpaceDrillDown.tsx` - `WhiteSpaceLevel2`

#### Summary Cards (4 cards - NEED DRILL-THROUGH):
- **Total White Space**: `${(totalWhiteSpace / 1000000).toFixed(1)}M` - **NEEDS CLICK**
- **Opportunities**: `{totalOpportunities}` - **NEEDS CLICK**
- **Avg Opportunity**: `${(avgOpportunity / 1000).toFixed(0)}K` - **NEEDS CLICK**
- **Readiness Score**: `{avgReadiness}` - **NEEDS CLICK**

#### Matrices (NEED DRILL-THROUGH):
- **🎯 Product Gap Analysis Matrix**: **NEEDS ROW CLICKS**
- **📊 White Space by Customer Tier**: **NEEDS ROW CLICKS**

### Level 3 - Account Details ✅ IMPLEMENTED
**File**: `WhiteSpaceDrillDown.tsx` - `WhiteSpaceLevel3`
**Content**: Top opportunities with account details

## Required Implementation: White Space Drill-Through

### 1. Create WhiteSpaceDrillDownModal.tsx
```typescript
interface WhiteSpaceDrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
}

// State management for drill-through context
const [selectedFilter, setSelectedFilter] = useState<{
  type: 'product' | 'tier' | 'readiness' | 'all';
  value: string;
} | null>(null);
```

### 2. Add Click Handlers to Level 2 Cards
```typescript
// Total White Space card
onClick={() => {
  setSelectedFilter({ type: 'all', value: 'all' });
  onLevelChange(3);
}}

// Opportunities card  
onClick={() => {
  setSelectedFilter({ type: 'readiness', value: 'high' });
  onLevelChange(3);
}}

// Product Gap Matrix rows
onClick={() => {
  setSelectedFilter({ type: 'product', value: product });
  onLevelChange(3);
}}

// Tier table rows
onClick={() => {
  setSelectedFilter({ type: 'tier', value: tier });
  onLevelChange(3);
}}
```

### 3. Update Level 3 Filtering
```typescript
const getFilteredOpportunities = () => {
  if (!selectedFilter) return allOpportunities;
  
  switch (selectedFilter.type) {
    case 'product':
      return allOpportunities.filter(opp => opp.product === selectedFilter.value);
    case 'tier':
      return allOpportunities.filter(opp => {
        const customer = customersData.find(c => c.customer_id === opp.account_id);
        return customer?.tier === selectedFilter.value;
      });
    case 'readiness':
      return allOpportunities.filter(opp => opp.fit_score >= 80);
    default:
      return allOpportunities;
  }
};
```

## Data Sources by Component

### Master Data Files Used:
- `master-data/customers.json`: Customer profiles, tiers, ARR
- `master-data/licenses.json`: Product ownership, utilization
- `master-data/contracts.json`: Contract terms, renewals
- `sales-expansion-data/expansion-opportunities.json`: All expansion opportunities
- `csm-data/white_space_analysis.json`: White space opportunities
- `csm-data/churn_predictions.json`: Churn risk data

### Data Flow Pattern:
1. **Import master data** at component level
2. **Calculate metrics** from raw data (no hardcoded values)
3. **Filter and aggregate** based on drill-through context
4. **Pass context** through state management
5. **Render filtered results** in drill-through levels

## UI/UX Patterns

### Clickable Elements Styling:
```css
.clickable-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.clickable-row:hover {
  background-color: rgba(59, 130, 246, 0.05);
}
```

### Navigation Breadcrumbs:
```typescript
// Level 2 back button
<button onClick={() => onLevelChange(1)}>
  ← Back to Overview
</button>

// Level 3 back button with context
<button onClick={() => onLevelChange(2)}>
  ← Back to {selectedFilter?.type} Analysis
</button>
```

### Loading States:
```typescript
const [loading, setLoading] = useState(false);

// Show loading during level transitions
{loading && <div className="animate-pulse">Loading...</div>}
```

## Implementation Priority

### ✅ COMPLETED:
1. **Expansion ARR**: Full 3-level drill-through
2. **Multi-Product Penetration**: Full 3-level drill-through  
3. **White Space Level 2 & 3**: Analytics and account details
4. **NRR Level 1**: Overview with real data

### 🔄 IN PROGRESS:
1. **White Space Level 1**: Overview modal wrapper
2. **White Space Drill-Through**: Click handlers for cards and matrices

### 📋 PENDING:
1. **NRR Level 2 & 3**: Analytics and account drill-through
2. **Cross-component navigation**: Seamless flow between KPIs
3. **Advanced filtering**: Multi-criteria drill-through
4. **Export functionality**: Drill-through data export

## Testing Checklist

### For Each Component:
- [ ] All cards show real calculated values (no hardcoded data)
- [ ] Click handlers navigate to correct drill-through level
- [ ] Back navigation preserves context
- [ ] Filtered data matches drill-through criteria
- [ ] Loading states display during transitions
- [ ] Error handling for missing data
- [ ] Responsive design on all screen sizes
- [ ] Accessibility (keyboard navigation, screen readers)

### Data Validation:
- [ ] All metrics sum correctly across drill-through levels
- [ ] Filtered results maintain referential integrity
- [ ] No duplicate opportunities in listings
- [ ] Customer data consistency across components
- [ ] Real-time data updates reflect in all levels

This architecture ensures consistent, scalable drill-through functionality across all KPI components while maintaining exclusive use of master data sources.
