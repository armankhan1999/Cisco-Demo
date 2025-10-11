# KPI Tile Design Update - Light Theme

## Changes Made ✅

### **Before (Dark Vibrant)**
- Dark gradient backgrounds (blue-500, purple-500, red-500)
- White text on dark backgrounds
- White progress bars
- High contrast, dark appearance

### **After (Light Pastel)** ✨
- **Light pastel backgrounds**: `from-blue-50 to-blue-100`, `from-purple-50 to-purple-100`, etc.
- **Dark colored text**: `text-blue-700`, `text-purple-700`, `text-indigo-700`, etc.
- **Colored progress bars**: Matching theme colors (blue-500, purple-500, etc.)
- **Gray descriptions**: `text-gray-600` and `text-gray-500` for secondary text
- **Subtle borders**: `border-gray-200` for clean separation
- **Soft shadows**: `shadow-md` instead of `shadow-lg`

## Color Palette

### Background Colors (Light Pastels)
- **Light Blue**: `from-blue-50 to-blue-100` → Text: `text-blue-700`
- **Light Purple**: `from-purple-50 to-purple-100` → Text: `text-purple-700`
- **Light Indigo**: `from-indigo-50 to-indigo-100` → Text: `text-indigo-700`
- **Light Teal**: `from-teal-50 to-teal-100` → Text: `text-teal-700`
- **Light Cyan**: `from-cyan-50 to-cyan-100` → Text: `text-cyan-700`
- **Light Pink**: `from-pink-50 to-pink-100` → Text: `text-pink-700`

### Status Colors (Light Pastels)
- **Success**: `from-green-50 to-green-100`
- **Warning**: `from-orange-50 to-orange-100`
- **Danger**: `from-red-50 to-red-100`

## KPI Tile Structure

```
┌─────────────────────────────────────┐
│ 💰 [Icon]          ↗ +1.5% [Trend] │  Light pastel background
│                                     │
│ GRR                                 │  Dark colored text (e.g., text-blue-700)
│ 99.9%                               │  Large, bold value
│                                     │
│ ≥ 95                                │  Gray subtitle text
│ Average days from...                │  Lighter gray description
│                                     │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░  75%               │  Colored progress bar
│                                     │
│ Performance              Good       │  Footer with status
└─────────────────────────────────────┘
```

## Applied To All CSM Dashboards

This design is automatically applied to:

1. ✅ **Customer Success Portfolio Dashboard** (`/csm/portfolio`)
   - All 10 KPI tiles
   
2. ✅ **Portfolio Health Drill-Down** (`/csm/kpi/portfolio-health`)
   - Component score cards
   
3. ✅ **All Future KPI Drill-Down Pages**
   - GRR, At-Risk ARR, Renewal Rate, Churn Rate, etc.

## Design Principles

- **Accessibility**: High contrast text on light backgrounds (WCAG AA compliant)
- **Visual Hierarchy**: Bold values, medium titles, light descriptions
- **Consistency**: Same color palette across all dashboards
- **Readability**: Dark text on light backgrounds for better readability
- **Modern**: Soft gradients, rounded corners, subtle shadows

## Typography

- **Title**: `text-sm font-semibold` in theme color (700 weight)
- **Value**: `text-4xl font-bold` in theme color (700 weight)
- **Subtitle**: `text-xs text-gray-600`
- **Description**: `text-xs text-gray-500`
- **Footer**: `text-xs font-medium text-gray-600`
- **Status**: `text-xs font-bold` in theme color

## Result

Your KPI tiles now match the **light, clean, professional design** from your reference image, with pastel backgrounds and dark readable text. This creates a more approachable, modern dashboard experience compared to the dark vibrant design.

