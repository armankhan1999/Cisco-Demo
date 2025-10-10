# Filter Persistence Across Drill-Downs - Implementation

## Problem
Filters applied on Portfolio Health dashboard reset when drilling down to accounts list, renewals, or other pages.

## Solution
Pass filters via URL query parameters and apply them on destination pages.

---

## Changes Made

### 1. KPI Card Component (`components/dashboard/kpi-card.tsx`)

**Added**: `buildFilterParams()` function to serialize filters into URL parameters

```typescript
const buildFilterParams = () => {
  const params = new URLSearchParams();
  
  if (currentFilters.tier?.length) {
    params.set('tier', currentFilters.tier.join(','));
  }
  if (currentFilters.industry?.length) {
    params.set('industry', currentFilters.industry.join(','));
  }
  if (currentFilters.geography?.length) {
    params.set('geography', currentFilters.geography.join(','));
  }
  if (currentFilters.health_category?.length) {
    params.set('health_category', currentFilters.health_category.join(','));
  }
  if (currentFilters.csm_id) {
    params.set('csm_id', currentFilters.csm_id);
  }
  if (currentFilters.product?.length) {
    params.set('product', currentFilters.product.join(','));
  }
  if (currentFilters.arr_range) {
    params.set('arr_min', currentFilters.arr_range.min.toString());
    params.set('arr_max', currentFilters.arr_range.max.toString());
  }
  
  return params.toString();
};
```

**Updated**: All navigation calls to include filter parameters

```typescript
// Before
router.push('/accounts');

// After
const filterParams = buildFilterParams();
router.push(`/accounts?${filterParams}`);
```

---

### 2. Accounts List Page (`app/accounts/page.tsx`)

**Added**: URL parameter parsing

```typescript
// Parse filter parameters from URL
const tierFilter = searchParams.get('tier')?.split(',');
const industryFilter = searchParams.get('industry')?.split(',');
const geographyFilter = searchParams.get('geography')?.split(',');
const healthCategoryFilter = searchParams.get('health_category')?.split(',');
const csmIdFilter = searchParams.get('csm_id');
const arrMinFilter = searchParams.get('arr_min');
const arrMaxFilter = searchParams.get('arr_max');
```

**Updated**: API call to include filters

```typescript
const params = new URLSearchParams({ limit: '500', include_products: 'true' });

// Add filter parameters to API call
if (tierFilter?.length) params.set('tier', tierFilter.join(','));
if (industryFilter?.length) params.set('industry', industryFilter.join(','));
if (geographyFilter?.length) params.set('geography', geographyFilter.join(','));
if (healthCategoryFilter?.length) params.set('health_category', healthCategoryFilter.join(','));
if (csmIdFilter) params.set('csm_id', csmIdFilter);
if (arrMinFilter) params.set('arr_min', arrMinFilter);
if (arrMaxFilter) params.set('arr_max', arrMaxFilter);

const response = await fetch(`/api/accounts?${params.toString()}`);
```

**Updated**: useEffect dependencies

```typescript
useEffect(() => {
  fetchAccounts();
}, [sortBy, sortOrder, productFilter, tierFilter, industryFilter, geographyFilter, healthCategoryFilter, csmIdFilter, arrMinFilter, arrMaxFilter]);
```

---

### 3. Renewals Page (`app/csm/renewals/page.tsx`)

**Added**: Import `useSearchParams`

```typescript
import { useRouter, useSearchParams } from 'next/navigation';
```

**Added**: URL parameter parsing (same as accounts page)

```typescript
const searchParams = useSearchParams();

// Parse filter parameters from URL
const tierFilter = searchParams.get('tier')?.split(',');
const industryFilter = searchParams.get('industry')?.split(',');
const geographyFilter = searchParams.get('geography')?.split(',');
const healthCategoryFilter = searchParams.get('health_category')?.split(',');
const csmIdFilter = searchParams.get('csm_id');
const arrMinFilter = searchParams.get('arr_min');
const arrMaxFilter = searchParams.get('arr_max');
```

**Updated**: API call to include filters

```typescript
const params = new URLSearchParams();
if (tierFilter?.length) params.set('tier', tierFilter.join(','));
if (industryFilter?.length) params.set('industry', industryFilter.join(','));
if (geographyFilter?.length) params.set('geography', geographyFilter.join(','));
if (healthCategoryFilter?.length) params.set('health_category', healthCategoryFilter.join(','));
if (csmIdFilter) params.set('csm_id', csmIdFilter);
if (arrMinFilter) params.set('arr_min', arrMinFilter);
if (arrMaxFilter) params.set('arr_max', arrMaxFilter);

const apiUrl = params.toString() 
  ? `/api/commercial/renewal-pipeline?${params.toString()}` 
  : '/api/commercial/renewal-pipeline';
```

**Updated**: useCallback dependencies

```typescript
}, [timeFrame, tierFilter, industryFilter, geographyFilter, healthCategoryFilter, csmIdFilter, arrMinFilter, arrMaxFilter]);
```

---

## Filter Flow

### Level 1: Portfolio Health Dashboard
```
User selects filters in FilterPanel
  ↓
Filters stored in state: { tier: ['Enterprise'], geography: ['EMEA'] }
  ↓
Dashboard KPIs recalculate with filters
```

### Level 2: Drill-down to Accounts List
```
User clicks "Total Accounts" KPI
  ↓
KPI Card builds URL: /accounts?tier=Enterprise&geography=EMEA
  ↓
Accounts page reads URL params
  ↓
Fetches filtered accounts from API
  ↓
Shows only Enterprise accounts in EMEA
```

### Level 3: Drill-down to Account Detail
```
User clicks specific account
  ↓
Navigates to /account/[id]
  ↓
Account detail page can also read filters if needed
```

---

## URL Format

### Example URLs with Filters

**Single filter**:
```
/accounts?tier=Enterprise
```

**Multiple filters**:
```
/accounts?tier=Enterprise,Strategic&geography=EMEA&health_category=At+Risk
```

**With ARR range**:
```
/accounts?arr_min=500000&arr_max=2000000
```

**Combined with sorting**:
```
/accounts?tier=Enterprise&sort=arr&order=desc
```

---

## Benefits

✅ **Filter Persistence**: Filters maintained across all drill-down levels
✅ **Shareable URLs**: Users can bookmark or share filtered views
✅ **Browser Navigation**: Back/forward buttons maintain filter state
✅ **Deep Linking**: Can link directly to filtered view
✅ **Consistent Experience**: Same filters apply everywhere

---

## Testing Scenarios

### Scenario 1: Tier + Geography Filter
1. Open Portfolio Health dashboard
2. Click Filters → Select "Enterprise" tier + "EMEA" geography
3. Click "Total Accounts" KPI
4. **Expected**: Accounts page shows only Enterprise accounts in EMEA
5. **Verify**: URL shows `?tier=Enterprise&geography=EMEA`

### Scenario 2: Health Category Filter
1. Open Portfolio Health dashboard  
2. Click Filters → Select "At Risk" health category
3. Click "At-Risk ARR" KPI
4. **Expected**: Accounts page shows only At Risk + Critical accounts
5. **Verify**: URL shows `?health_category=At+Risk,Critical`

### Scenario 3: Multiple Filters + Renewals
1. Open Portfolio Health dashboard
2. Click Filters → Select "Enterprise" + "Technology" industry + "EMEA"
3. Click "Renewal Pipeline" KPI
4. **Expected**: Renewals page shows only Enterprise Technology accounts in EMEA
5. **Verify**: URL shows all three filters

### Scenario 4: Clear Filters
1. Apply filters on dashboard
2. Drill down to accounts (filters applied)
3. Navigate back to dashboard
4. Click "Clear All" in filter panel
5. Drill down again
6. **Expected**: All accounts shown (no filters in URL)

---

## Additional Pages to Update (Future)

If these pages are drill-down destinations, they should also be updated:

- `/csm/expansion` - Expansion opportunities page
- `/account/[id]` - Individual account detail page
- `/csm/health` - If drilling from other dashboards
- `/csm/usage` - If drilling from other dashboards

Same pattern:
1. Import `useSearchParams`
2. Parse URL parameters
3. Apply to API calls
4. Update useEffect dependencies
