# Time to Value (TTV) Calculation Formula

## Definition
**Time to Value (TTV)** measures the average number of days from when a customer purchases a subscription until they achieve productive use (implementation).

## Formula
```
TTV (days) = Average(Implementation Date - Subscription Start Date)

Where:
- Implementation Date = Date when license was implemented/activated
- Subscription Start Date = Date when subscription contract began
- Average = Mean across all subscriptions with valid data
```

## Step-by-Step Calculation

### Step 1: Data Sources
- **Subscriptions**: `src/source_data/commercial_operations/subscriptions.json`
  - Fields: `customer_id`, `product_family`, `subscription_start_date`
- **Licenses**: `src/source_data/commercial_operations/licenses.json`
  - Fields: `customer_id`, `product_family`, `implementation_date`

### Step 2: Matching Logic
For each subscription:
1. Find matching license where:
   - `license.customer_id === subscription.customer_id`
   - `license.product_family === subscription.product_family`

### Step 3: Calculate Days
```javascript
const subStart = new Date(subscription.subscription_start_date);
const implDate = new Date(license.implementation_date);
const days = Math.floor((implDate - subStart) / (1000 * 60 * 60 * 24));
```

### Step 4: Validation Rules
Include subscription in calculation if:
- ✅ License match found
- ✅ Implementation date exists
- ✅ Days are between 0 and 365 (inclusive)

Exclude if:
- ❌ No matching license found
- ❌ Implementation date is missing
- ❌ Days < 0 (implementation before subscription)
- ❌ Days > 365 (data quality issue)

### Step 5: Calculate Average
```javascript
TTV = Sum of all valid days / Count of valid subscriptions
```

## Example Calculation

### Sample Data:
```
Subscription 1:
- Start: 2024-01-01
- Implementation: 2024-01-15
- TTV: 14 days

Subscription 2:
- Start: 2024-02-01
- Implementation: 2024-03-01
- TTV: 29 days

Subscription 3:
- Start: 2024-03-01
- Implementation: 2024-04-15
- TTV: 45 days
```

### Calculation:
```
Total Days = 14 + 29 + 45 = 88 days
Count = 3 subscriptions
Average TTV = 88 / 3 = 29.3 days ≈ 29 days
```

## Current Implementation

**File**: `src/lib/kpis/csmKPICalculations.ts`

**Function**: `calculateTimeToValue(filteredAccounts?: any[])`

**Logic**:
1. Gets all subscriptions and licenses
2. Filters by accounts if provided
3. Loops through subscriptions
4. Finds matching license
5. Calculates days difference
6. Sums valid values
7. Returns average

**Console Output**:
```
⏱️ === TTV CALCULATION DEBUG ===
Total Subscriptions: 200
Total Licenses: 150
Filtered Subscriptions: 100
Filtered Licenses: 75
  Example 1: Customer CUST_000001
    Sub Start: 2023-12-05T22:08:39.991Z
    Impl Date: 2023-12-05T22:08:39.991Z
    TTV Days: 0
Valid TTV Calculations: 100
Skipped - No License Match: 0
Skipped - No Implementation Date: 0
Skipped - Invalid Days: 0
Average TTV: 52.3 days (CALCULATED from 100 subscriptions)
```

## Troubleshooting

### If TTV shows 0 or N/A:
1. **Check console logs** (F12 → Console)
2. Look for "Valid TTV Calculations: 0" - means no matches found
3. Check "Skipped" reasons:
   - No License Match: Subscription has no corresponding license
   - No Implementation Date: License missing implementation_date field
   - Invalid Days: Days < 0 or > 365

### Common Issues:
1. **Same-day implementation**: If implementation_date = subscription_start_date, TTV = 0 days
   - This is VALID (instant implementation)
   - If many subscriptions have 0 days, average will be low

2. **No license matches**: 
   - Customer IDs don't match between subscriptions and licenses
   - Product family names don't match exactly

3. **Missing implementation dates**:
   - Licenses don't have implementation_date field populated

## Expected Behavior

### With Filters:
- **Product Filter (Duo)**: Shows TTV for only Duo subscriptions
- **CSM Filter (Sarah)**: Shows TTV for Sarah's accounts only
- **Time Range**: Does NOT affect TTV (shows all historical data)
- **Combined Filters**: Shows TTV for accounts matching ALL filters

### Display:
- If count > 0: Shows calculated days (e.g., "52 days")
- If count = 0: Shows "N/A" (no data available)

## Target & Status

**Target**: ≤ 60 days (faster is better)

**Status Colors**:
- 🟢 **Success**: TTV ≤ 60 days
- 🟡 **Warning**: 61-90 days
- 🔴 **Danger**: > 90 days

**Trend**:
- ⬇️ **Down** (Good): TTV ≤ 60 days
- ⬆️ **Up** (Bad): TTV > 60 days
