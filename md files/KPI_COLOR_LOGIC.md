# KPI Tile Color Logic - Status-Based Design

## Overview
All KPI tiles now use **status-based colors** following the health score matrix, not random colors. Colors indicate actual performance status.

---

## Health Score Matrix (CSM Standard)

| Health Score Range | Status Category | Color | Meaning |
|-------------------|-----------------|-------|---------|
| **86-100** | Thriving | 🟢 Green | Excellent health, proactive engagement |
| **76-85** | Healthy | 🟢 Green | Good health, stable relationship |
| **60-75** | Stable | 🟠 Orange | Moderate health, needs attention |
| **45-59** | At Risk | 🔴 Red | Poor health, intervention needed |
| **0-44** | Critical | 🔴 Red | Critical health, immediate action required |

---

## KPI Tile Color Mapping

### Background Colors (Light Pastel)

| Status | Background Gradient | Border | When Applied |
|--------|-------------------|---------|--------------|
| **Success** | `from-green-50 to-green-100` | `border-gray-200` | KPI meets or exceeds target (≥76%) |
| **Warning** | `from-orange-50 to-orange-100` | `border-gray-200` | KPI in acceptable range (60-75%) |
| **Danger** | `from-red-50 to-red-100` | `border-gray-200` | KPI below acceptable (<60%) |

### Text Colors (Dark for Readability)

| Status | Title & Value Color | Description Color |
|--------|-------------------|-------------------|
| **Success** | `text-green-700` | `text-gray-600` |
| **Warning** | `text-orange-700` | `text-gray-600` |
| **Danger** | `text-red-700` | `text-gray-600` |

### Progress Bar Colors

| Status | Progress Bar | Background |
|--------|-------------|------------|
| **Success** | `bg-green-500` | `bg-gray-200` |
| **Warning** | `bg-orange-500` | `bg-gray-200` |
| **Danger** | `bg-red-500` | `bg-gray-200` |

---

## Trend Arrow Color Logic

### Rule: **Green = Good Performance, Red = Bad Performance**

### Metrics Where HIGHER is BETTER ⬆️ = Good
**Up Trend (↗) = GREEN | Down Trend (↘) = RED**

- ✅ **GRR** (Gross Revenue Retention): Higher retention is better
- ✅ **Portfolio Health Score**: Higher health is better
- ✅ **Renewal Rate**: Higher renewal rate is better
- ✅ **Average Utilization Rate**: Higher utilization is better
- ✅ **Feature Adoption Rate**: Higher adoption is better
- ✅ **Customer Engagement Score**: Higher engagement is better
- ✅ **QBR Completion Rate**: Higher completion is better
- ✅ **NRR** (Net Revenue Retention): Higher retention is better

### Metrics Where LOWER is BETTER ⬇️ = Good
**Down Trend (↘) = GREEN | Up Trend (↗) = RED**

- ⚠️ **At-Risk ARR**: Lower at-risk amount is better
- ⚠️ **Churn Rate**: Lower churn is better
- ⚠️ **Time to Value (TTV)**: Fewer days is better
- ⚠️ **Cycle Time**: Fewer days is better
- ⚠️ **DSO** (Days Sales Outstanding): Fewer days is better

### Examples

```typescript
// Example 1: GRR (Higher is Better)
// Current: 99.9%, Last Period: 98.4%
// Trend: UP ↗ = GREEN ✅ (Good! Revenue retention improved)

// Example 2: Churn Rate (Lower is Better)  
// Current: 0.0%, Last Period: 2.5%
// Trend: DOWN ↘ = GREEN ✅ (Good! Churn decreased)

// Example 3: At-Risk ARR (Lower is Better)
// Current: $16.1M, Last Period: $12M
// Trend: UP ↗ = RED ⚠️ (Bad! More ARR at risk)

// Example 4: Portfolio Health (Higher is Better)
// Current: 66, Last Period: 70
// Trend: DOWN ↘ = RED ⚠️ (Bad! Health score declined)
```

---

## Status Determination Logic

### How KPI Status is Calculated

```typescript
// Example: Portfolio Health Score
const portfolioHealth = 66; // Current value
const target = 75; // Target value

if (portfolioHealth >= target) {
  status = 'success'; // Green tile
} else if (portfolioHealth >= 60) {
  status = 'warning'; // Orange tile
} else {
  status = 'danger'; // Red tile
}
```

### KPI-Specific Thresholds

| KPI | Success (Green) | Warning (Orange) | Danger (Red) |
|-----|----------------|------------------|--------------|
| **GRR** | ≥95% | 90-94% | <90% |
| **Portfolio Health** | ≥75 | 60-74 | <60 |
| **Renewal Rate** | ≥92% | 85-91% | <85% |
| **Churn Rate** | ≤5% | 5-10% | >10% |
| **Utilization Rate** | ≥75% | 60-74% | <60% |
| **Feature Adoption** | ≥65% | 50-64% | <50% |
| **Engagement Score** | ≥70 | 60-69 | <60 |
| **QBR Completion** | ≥85% | 70-84% | <70% |
| **Time to Value** | ≤60 days | 61-90 days | >90 days |

---

## Visual Examples

### Success State (Green)
```
┌─────────────────────────────────────┐
│ 🟢 Light Green Background           │
│                                      │
│ GRR                    ↗ +1.5% 🟢   │ <- Green trend (good)
│ 99.9%                  (Green text) │
│                                      │
│ ≥ 95%                               │
│ Gross revenue retention...          │
│                                      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░  95%  (Green bar)  │
│                                      │
│ Performance              Good       │
└─────────────────────────────────────┘
```

### Warning State (Orange)
```
┌─────────────────────────────────────┐
│ 🟠 Light Orange Background          │
│                                      │
│ Portfolio Health       ↘ -4pts 🔴   │ <- Red trend (bad)
│ 66                  (Orange text)   │
│                                      │
│ ≥ 75                                │
│ Average health score...             │
│                                      │
│ ▓▓▓▓▓▓▓▓▓░░░░░  66%  (Orange bar)  │
│                                      │
│ Performance         On Target       │
└─────────────────────────────────────┘
```

### Danger State (Red)
```
┌─────────────────────────────────────┐
│ 🔴 Light Red Background             │
│                                      │
│ At-Risk ARR           ↗ +$4.1M 🔴   │ <- Red trend (bad, up)
│ $16.1M              (Red text)      │
│                                      │
│ Current Period                      │
│ ARR at risk in next 90 days         │
│                                      │
│ ▓▓▓▓▓░░░░░░░░░  35%  (Red bar)     │
│                                      │
│ Performance           Critical      │
└─────────────────────────────────────┘
```

---

## Implementation Rules

### ✅ DO

1. **Always use KPI status** to determine tile colors
2. **Check metric type** before assigning trend colors
3. **Follow the health score matrix** (76+ = green, 60-75 = orange, <60 = red)
4. **Use light pastel backgrounds** for readability
5. **Use dark text colors** (700 weight) on light backgrounds
6. **Make trends intuitive**: Green = Good, Red = Bad

### ❌ DON'T

1. **Never use random colors** based on KPI name hash
2. **Never reverse trend logic** (don't show red for good trends)
3. **Never use dark backgrounds** with white text
4. **Never ignore the status** field from KPI calculations
5. **Never use multiple color schemes** on the same dashboard

---

## Files Updated

1. ✅ **`src/components/CSM/KPITile.tsx`** - Core component with status-based colors
2. ✅ **`src/app/csm/kpi/at-risk-arr/page.tsx`** - Fixed JSX syntax error
3. ✅ All KPI tiles across all CSM dashboards automatically inherit this logic

---

## Testing Checklist

- [ ] GRR tile shows green when ≥95%
- [ ] Portfolio Health shows orange when 60-75
- [ ] At-Risk ARR shows red when critical
- [ ] Churn Rate down trend shows green arrow (good)
- [ ] Portfolio Health down trend shows red arrow (bad)
- [ ] All tiles use light backgrounds with dark text
- [ ] Progress bars match the status color
- [ ] Performance footer shows correct status text

---

## Summary

**All KPI tiles now follow a consistent, intuitive color system:**

- 🟢 **Green** = Healthy, Thriving, Success (≥76%)
- 🟠 **Orange** = Stable, Warning, Needs Attention (60-75%)
- 🔴 **Red** = At Risk, Critical, Danger (<60%)

**Trend arrows are contextual:**
- 🟢 **Green arrow** = Good performance change
- 🔴 **Red arrow** = Bad performance change
- ⚪ **Gray arrow** = Neutral/Stable

This ensures users can instantly understand performance at a glance without reading numbers!

