# GRR and TTV Formula Implementation Guide

## Overview
This document explains how **Gross Revenue Retention (GRR)** and **Time to Value (TTV)** are calculated in the Customer Success Portfolio Dashboard, following industry-standard formulas.

---

## 1️⃣ GRR (Gross Revenue Retention)

### Standard Formula
```
GRR (%) = [(Starting ARR - Churned ARR - Contraction ARR) / Starting ARR] × 100
```

### Components

| Component | Definition | Source |
|-----------|------------|--------|
| **Starting ARR** | Annual Recurring Revenue at period start (from existing customers) | Subscriptions that started ≥ 1 year ago |
| **Churned ARR** | Revenue lost from customers who canceled | Revenue movements with type = 'churn' |
| **Contraction ARR** | Revenue lost from downgrades/contractions | Revenue movements with type = 'contraction' |
| **Exclude** | Expansion/upsell revenue (that goes into NRR) | Not included in GRR |

### Calculation Steps

**Step 1: Get Starting ARR (1 year ago)**
```javascript
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const startingARR = subscriptions
  .filter(sub => new Date(sub.subscription_start_date) <= oneYearAgo)
  .reduce((sum, sub) => sum + sub.arr, 0);
```

**Step 2: Calculate Losses (Churn + Contraction)**
```javascript
const losses = movements
  .filter(m => {
    const effectiveDate = new Date(m.effective_date);
    return effectiveDate >= oneYearAgo && 
           (m.movement_type === 'churn' || m.movement_type === 'contraction');
  })
  .reduce((sum, m) => sum + Math.abs(m.arr_change), 0);
```

**Step 3: Calculate Retained ARR**
```javascript
const retainedARR = startingARR - losses;
```

**Step 4: Calculate GRR %**
```javascript
const grr = startingARR > 0 ? (retainedARR / startingARR) * 100 : 0;
```

### Example Calculation

```
Starting ARR (1 year ago):    $1,000,000
Churned ARR (last 12 months): -$50,000
Contraction ARR:              -$30,000
──────────────────────────────────────
Retained ARR:                 $920,000

GRR = ($920,000 / $1,000,000) × 100 = 92.0%
```

### Benchmark & Status

| GRR % | Status | Color | Interpretation |
|-------|--------|-------|----------------|
| ≥ 95% | ✅ Success | Green | Excellent retention |
| 90-94% | ⚠️ Warning | Yellow | Good, but room to improve |
| < 90% | 🔴 Danger | Red | Poor retention, action needed |
| 100% | 🎯 Perfect | Green | Zero churn/contraction |

**Note**: GRR cannot exceed 100% (expansions excluded by design)

---

## 2️⃣ TTV (Time to Value)

### Standard Formula
```
TTV (days) = Average of (Value Realization Date - Customer Start Date)
```

### Components

| Component | Definition | Source |
|-----------|------------|--------|
| **Customer Start Date** | When subscription began | `subscription_start_date` |
| **Value Realization Date** | When customer achieved productive use | `implementation_date` |
| **TTV Days** | Days from start to value | Calculated difference |

### Value Realization Events
The "value event" is defined as **License Implementation Date**, which represents:
- ✅ First successful activation
- ✅ Completion of onboarding
- ✅ Product deployed and in use
- ✅ Customer achieving productive state

### Calculation Steps

**Step 1: Match Subscription to License**
```javascript
// For each subscription, find corresponding license
const license = licenses.find(l => 
  l.customer_id === subscription.customer_id && 
  l.product_family === subscription.product_family
);
```

**Step 2: Calculate Days for Each Subscription**
```javascript
const subStart = new Date(subscription.subscription_start_date);
const implDate = new Date(license.implementation_date);
const days = Math.floor((implDate - subStart) / (1000 * 60 * 60 * 24));
```

**Step 3: Validate and Filter**
Include only if:
- ✅ License match found
- ✅ Implementation date exists
- ✅ 0 ≤ days ≤ 365 (reasonable range)

**Step 4: Calculate Average**
```javascript
const avgTTV = totalDays / validCount;
```

### Example Calculation

```
Customer A: 
  Start Date: Jan 1, 2024
  Implementation: Jan 15, 2024
  TTV: 14 days

Customer B:
  Start Date: Feb 1, 2024
  Implementation: Mar 1, 2024
  TTV: 29 days

Customer C:
  Start Date: Mar 1, 2024
  Implementation: Apr 15, 2024
  TTV: 45 days

Average TTV = (14 + 29 + 45) / 3 = 29.3 ≈ 29 days
```

### Benchmark & Status

| TTV Days | Status | Color | Interpretation |
|----------|--------|-------|----------------|
| ≤ 60 | ✅ Success | Green | Fast time to value |
| 61-90 | ⚠️ Warning | Yellow | Acceptable but slow |
| > 90 | 🔴 Danger | Red | Too slow, risk of churn |

**Note**: Lower TTV = Better (customers realize value faster)

---

## 3️⃣ Combined KPI Dashboard

| KPI | Formula | Current | Benchmark | Status |
|-----|---------|---------|-----------|--------|
| **GRR** | `[(Starting ARR - Churned - Contraction) / Starting ARR] × 100` | 92.0% | ≥ 95% | ⚠️ Warning |
| **TTV** | `Avg(Implementation Date - Start Date)` | 52 days | ≤ 60 days | ✅ Success |

---

## 4️⃣ Implementation Details

### Data Sources

**For GRR:**
- `subscriptions.json` → Starting ARR calculation
- `revenue_movements.json` → Churn and contraction tracking
- Time period: Rolling 12 months

**For TTV:**
- `subscriptions.json` → Subscription start dates
- `licenses.json` → Implementation dates
- Matching: customer_id + product_family

### Filter Support

Both KPIs respect dashboard filters:

**✅ Filtered by:**
- CSM (shows only their accounts)
- Tier (Strategic, Enterprise, etc.)
- Products (Duo, Meraki, Umbrella, etc.)
- Health Categories
- ARR Range

**❌ NOT filtered by:**
- Time Range (affects calculation period, not which accounts shown)

### Tracking Frequency

**GRR:**
- ✅ Calculated: Annually (last 12 months)
- ✅ Updated: Real-time (whenever movements occur)
- ✅ Cohort: Rolling 12-month window

**TTV:**
- ✅ Calculated: All-time average
- ✅ Updated: Real-time (as implementations complete)
- ✅ Cohort: All subscriptions with valid data

---

## 5️⃣ Troubleshooting

### GRR Shows Unexpected Value

**Check:**
1. Starting ARR period (1 year ago subscriptions)
2. Revenue movements in last 12 months
3. Movement types (only 'churn' and 'contraction' count)
4. Filter state (may be limiting accounts)

**Console Logs:**
```javascript
console.log('Starting ARR:', startingARR);
console.log('Losses (Churn + Contraction):', losses);
console.log('Retained ARR:', retainedARR);
console.log('GRR:', grr.toFixed(1) + '%');
```

### TTV Shows 0 or N/A

**Check browser console (F12):**
```
⏱️ === TTV CALCULATION DEBUG ===
Valid TTV Calculations: 0
Skipped - No License Match: X
Skipped - No Implementation Date: X
```

**Common Issues:**
1. **No License Match**: customer_id or product_family mismatch
2. **No Implementation Date**: License missing implementation_date field
3. **Invalid Days**: Implementation before subscription (data error)

---

## 6️⃣ Related Metrics

| Metric | Formula | Purpose |
|--------|---------|---------|
| **NRR** | `[(Starting ARR - Churn - Contraction + Expansion) / Starting ARR] × 100` | Includes growth |
| **Logo Churn** | `(Churned Customers / Total Customers) × 100` | Customer count churn |
| **ARR Churn** | `(Churned ARR / Starting ARR) × 100` | Revenue churn rate |

---

## 7️⃣ Best Practices

### For GRR:
✅ Track cohorts consistently (monthly or quarterly)  
✅ Exclude new customer revenue (focus on retention)  
✅ Separate churn from contraction for analysis  
✅ Monitor trend over time, not just absolute value  

### For TTV:
✅ Define "value event" clearly and consistently  
✅ Track both signup and implementation dates  
✅ Set alerts for customers exceeding 60 days  
✅ Calculate by product/segment for deeper insights  

---

## 8️⃣ Implementation Files

| File | Purpose |
|------|---------|
| `src/lib/kpis/csmKPICalculations.ts` | Core calculation functions |
| `src/lib/data/csmDataLoader.ts` | Data loading and interfaces |
| `src/source_data/commercial_operations/subscriptions.json` | Subscription data |
| `src/source_data/commercial_operations/licenses.json` | License/implementation data |
| `src/source_data/commercial_operations/revenue_movements.json` | Churn/contraction tracking |

---

## Summary

✅ **GRR** = Measures revenue retention (excludes growth)  
✅ **TTV** = Measures speed to customer value realization  
✅ **Both** = Industry-standard formulas correctly implemented  
✅ **Both** = Support filtering and real-time calculation  
✅ **Both** = Include debug logging for troubleshooting  
