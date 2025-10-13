# KPI 30-Day Trend Display

## Overview
All KPI tiles now display **last 30-day trends** in the top-right corner with clear visual indicators.

---

## Trend Display Format

```
┌─────────────────────────────────────┐
│ 💰 [Icon]          ↗ +1.5%         │  <- Trend arrow + change
│                    (30d)            │  <- Time period
│                                     │
│ GRR                                 │
│ 99.9%                               │
│ ...                                 │
└─────────────────────────────────────┘
```

---

## Visual Examples

### Example 1: GRR - Positive Trend ✅
```
┌─────────────────────────────────────┐
│ 💰                    ↗ +1.5%       │  <- GREEN (up is good)
│                       (30d)         │
│                                     │
│ GRR                                 │
│ 99.9%                               │
│                                     │
│ ≥ 95%                               │
│ Gross revenue retention             │
│                                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%              │
│                                     │
│ Performance              Good       │
└─────────────────────────────────────┘

Interpretation:
- GRR increased by 1.5% in last 30 days
- Green color = Good (higher is better)
- Up arrow (↗) = Improving
```

### Example 2: Portfolio Health - Negative Trend ⚠️
```
┌─────────────────────────────────────┐
│ ⚕️                    ↘ -4 pts      │  <- RED (down is bad)
│                       (30d)         │
│                                     │
│ Portfolio Health                    │
│ 66                                  │
│                                     │
│ ≥ 75                                │
│ Average health score                │
│                                     │
│ ▓▓▓▓▓▓▓▓▓░░░░░░  66%               │
│                                     │
│ Performance         On Target       │
└─────────────────────────────────────┘

Interpretation:
- Health score decreased by 4 points in last 30 days
- Red color = Bad (lower is worse for health)
- Down arrow (↘) = Declining
```

### Example 3: Churn Rate - Positive Trend ✅
```
┌─────────────────────────────────────┐
│ 📉                    ↘ -2.5%       │  <- GREEN (down is good)
│                       (30d)         │
│                                     │
│ Churn Rate                          │
│ 0.0%                                │
│                                     │
│ ≤ 5%                                │
│ Annual churn rate                   │
│                                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  0%                │
│                                     │
│ Performance              Good       │
└─────────────────────────────────────┘

Interpretation:
- Churn rate decreased by 2.5% in last 30 days
- Green color = Good (lower is better for churn)
- Down arrow (↘) = Improving
```

### Example 4: At-Risk ARR - Negative Trend ⚠️
```
┌─────────────────────────────────────┐
│ ⚠️                    ↗ +$4.1M      │  <- RED (up is bad)
│                       (30d)         │
│                                     │
│ At-Risk ARR                         │
│ $16.1M                              │
│                                     │
│ Current Period                      │
│ ARR at risk in next 90 days         │
│                                     │
│ ▓▓▓▓▓░░░░░░░░░░  35%               │
│                                     │
│ Performance           Critical      │
└─────────────────────────────────────┘

Interpretation:
- At-risk ARR increased by $4.1M in last 30 days
- Red color = Bad (higher at-risk is worse)
- Up arrow (↗) = Worsening
```

### Example 5: Utilization Rate - Stable Trend →
```
┌─────────────────────────────────────┐
│ 📊                    → 0%          │  <- GRAY (no change)
│                       (30d)         │
│                                     │
│ Avg Utilization Rate                │
│ 69%                                 │
│                                     │
│ ≥ 75%                               │
│ Average license utilization         │
│                                     │
│ ▓▓▓▓▓▓▓▓▓░░░░░░  69%               │
│                                     │
│ Performance         On Target       │
└─────────────────────────────────────┘

Interpretation:
- Utilization rate unchanged in last 30 days
- Gray color = Neutral (stable)
- Right arrow (→) = Stable
```

---

## Trend Arrow Meanings

| Arrow | Symbol | Meaning | When to Use |
|-------|--------|---------|-------------|
| **Up** | ↗ | Value increased | Metric went up in last 30 days |
| **Down** | ↘ | Value decreased | Metric went down in last 30 days |
| **Stable** | → | No significant change | Change < 1% or < 1 unit |

---

## Trend Color Logic

### For Metrics Where HIGHER is BETTER
(GRR, Health, Renewal Rate, Utilization, Adoption, Engagement, QBR)

| Trend | Color | Meaning |
|-------|-------|---------|
| ↗ Up | 🟢 **Green** | Improving ✅ |
| ↘ Down | 🔴 **Red** | Declining ⚠️ |
| → Stable | ⚪ Gray | No change |

### For Metrics Where LOWER is BETTER
(At-Risk ARR, Churn Rate, Time to Value, Days, Cycle Time)

| Trend | Color | Meaning |
|-------|-------|---------|
| ↘ Down | 🟢 **Green** | Improving ✅ |
| ↗ Up | 🔴 **Red** | Worsening ⚠️ |
| → Stable | ⚪ Gray | No change |

---

## All KPI Trends

| KPI | Current Value | 30d Change | Trend | Color | Status |
|-----|---------------|------------|-------|-------|--------|
| **GRR** | 99.9% | +1.5% | ↗ | 🟢 Green | Good (up is better) |
| **Portfolio Health** | 66 | -4 pts | ↘ | 🔴 Red | Bad (down is worse) |
| **At-Risk ARR** | $16.1M | +$4.1M | ↗ | 🔴 Red | Bad (up is worse) |
| **Renewal Rate** | 32.1% | -5% | ↘ | 🔴 Red | Bad (down is worse) |
| **Churn Rate** | 0.0% | -2.5% | ↘ | 🟢 Green | Good (down is better) |
| **Utilization Rate** | 69% | +2% | ↗ | 🟢 Green | Good (up is better) |
| **Feature Adoption** | 52% | +3% | ↗ | 🟢 Green | Good (up is better) |
| **Engagement Score** | 67 | +2 pts | ↗ | 🟢 Green | Good (up is better) |
| **Time to Value** | 52 days | -8 days | ↘ | 🟢 Green | Good (down is better) |
| **QBR Completion** | 68% | -5% | ↘ | 🔴 Red | Bad (down is worse) |

---

## Styling Details

### Trend Display Component
```css
Position: Top-right corner of KPI tile
Font size: text-sm (14px) for main trend
Font weight: font-bold (700)
Font size: text-xs (12px) for "(30d)"
Opacity: 90% for "(30d)" indicator
Alignment: Right-aligned, stacked vertically
```

### Colors
```css
Green (Good): text-green-600 (#16a34a)
Red (Bad): text-red-600 (#dc2626)
Gray (Neutral): text-gray-600 (#4b5563)
Additional: font-bold for emphasis
```

---

## Calculation Method

### 30-Day Trend Calculation
```typescript
// Compare current value to value from 30 days ago
const current = kpi.value;          // e.g., 99.9%
const previous = kpi.valueLast30d;  // e.g., 98.4%
const change = current - previous;   // e.g., +1.5%

// Determine trend direction
if (change > 1) {
  trend = 'up';    // ↗
} else if (change < -1) {
  trend = 'down';  // ↘
} else {
  trend = 'stable'; // →
}

// Format display
const formatted = `${trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} ${change > 0 ? '+' : ''}${change}%`;
```

---

## Benefits

### 🎯 **Quick Performance Insights**
- See if metrics are improving or declining at a glance
- No need to navigate to detailed views for basic trends
- Visual color coding (green/red) makes interpretation instant

### 📈 **Consistent Time Frame**
- All trends use same 30-day window for comparison
- Standardized across all KPIs for fair comparison
- Clearly labeled "(30d)" so users know the timeframe

### 🎨 **Intuitive Design**
- Trend in top-right corner (standard dashboard pattern)
- Color matches meaning (green=good, red=bad)
- Bold typography ensures visibility on light backgrounds

### 🔍 **Context Without Clutter**
- Compact display doesn't overwhelm the tile
- Key information (current value) remains prominent
- Trend provides context without being the focus

---

## User Actions

### If Trend is Red (Bad) ⚠️
1. **Click the KPI tile** to drill down
2. **Review detailed analytics** to understand root cause
3. **Check related metrics** for broader context
4. **Take action** based on specific KPI guidance

### If Trend is Green (Good) ✅
1. **Monitor to ensure trend continues**
2. **Document what's working** for replication
3. **Consider** if performance can be further improved
4. **Share success** with relevant stakeholders

### If Trend is Stable (Gray) →
1. **Evaluate** if stability is acceptable
2. **Consider** if intervention is needed to improve
3. **Monitor** for any future changes
4. **Review targets** to ensure they're appropriate

---

## Implementation

### Files Modified
- ✅ `src/components/CSM/KPITile.tsx` - Added 30-day trend display

### Auto-Applied To
All dashboards using `<KPITile>` component:
- ✅ Customer Success Portfolio Dashboard
- ✅ All KPI drill-down pages
- ✅ Deep Dive Analytics views

---

## Summary

**Every KPI tile now shows:**
- ✅ **Trend arrow** (↗ ↘ →) in top-right corner
- ✅ **Change value** (+1.5%, -4 pts, etc.)
- ✅ **Time period** "(30d)" indicator
- ✅ **Color coding** (green=good, red=bad, gray=neutral)

This gives users instant visibility into performance direction without leaving the main dashboard! 📊

