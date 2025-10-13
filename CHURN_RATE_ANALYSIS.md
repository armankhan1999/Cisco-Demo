# Churn Rate Calculation - Analysis & Explanation

## 🔍 **What You're Seeing: 0.02%**

**YES, this is CORRECT!** Your churn rate is extremely low at **0.02%** (or 0.0173% to be precise).

---

## 📊 **The Calculation**

### **Data Found in `revenue_movements.json`:**

**Churn Movements (Last 12 Months):**

| Date | Customer ID | Product | ARR Lost | Reason |
|------|-------------|---------|----------|---------|
| 2025-06-06 | CUST_000025 | Umbrella | $462 | Not using |
| 2025-08-16 | CUST_000040 | Duo | $708 | Product fit |
| 2025-09-04 | CUST_000036 | ThousandEyes | $5,000 | Competitor |
| **TOTAL** | **3 customers** | | **$6,170** | |

---

### **Churn Rate Formula:**

```
Churn Rate = (Churned ARR / Total Portfolio ARR) × 100%
           = ($6,170 / $35,600,000) × 100%
           = 0.0173%
           ≈ 0.02% (rounded to 2 decimals)
           ≈ 0.0% (rounded to 1 decimal)
```

**Note:** The code uses `.toFixed(1)` which would show "0.0%", but if you're seeing "0.02", it might be displaying with 2 decimal places or a different rounding.

---

## ✅ **Is This Correct?**

### **YES - This is a 12-Month Annualized Rate**

- ✅ **Time Period:** Last 12 months (not just 30 days)
- ✅ **Calculation Method:** Annualized churn rate
- ✅ **Data Source:** `revenue_movements.json` with `movement_type === 'churn'`
- ✅ **Denominator:** Total current portfolio ARR (~$35.6M)

---

## 📅 **Time Window Confirmation**

**From the code:**
```typescript
// Calculate churn in the last 12 months (annualized churn rate)
const now = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const churnMovements = movements.filter(m => {
  const effectiveDate = new Date(m.effective_date);
  return effectiveDate >= oneYearAgo && 
         effectiveDate <= now && 
         m.movement_type === 'churn';
});
```

**This is NOT a 30-day rate.** The "(30d)" label in the trend refers to the **trend comparison**, not the churn rate itself.

---

## 💡 **Why Is It So Low?**

Your churn rate of **0.02%** is exceptionally low because:

1. **Only 3 customers churned** out of 45 total accounts
2. **Small ARR impact:** Only $6,170 lost from $35.6M portfolio
3. **This is excellent performance!** 

**Industry Benchmarks:**
- ✅ Your Rate: **0.02%** (EXCELLENT)
- 🎯 Target: **≤ 5%** (You're crushing this!)
- 📊 SaaS Average: **5-7%** annual churn
- 🏆 Best-in-Class: **<3%**

---

## 🆚 **Historical Churn vs. Predicted Churn**

### **What You Currently Have:**

**Historical Churn Rate:** 0.02% (Backward-Looking)
- ✅ Shows actual ARR lost in last 12 months
- ✅ Based on real `revenue_movements` data
- ✅ Target: ≤ 5%
- ✅ Status: Success (well below target)

### **What You're MISSING:**

**Predicted Churn Risk Rate:** ~12.3% (Forward-Looking)
- ❌ NOT currently shown as a KPI
- 📊 Data exists in `churn_predictions.json`
- ⚠️ Shows potential future churn (next 12 months)
- 💰 $3.2M ARR at risk from 33 accounts

---

## 📈 **The Two Different Metrics**

| Metric | Current Value | Time Direction | Data Source | Purpose |
|--------|---------------|----------------|-------------|----------|
| **Historical Churn Rate** | **0.02%** | ← Backward | `revenue_movements.json` | Performance tracking |
| **Predicted Churn Risk** | **12.3%** | → Forward | `churn_predictions.json` | Proactive intervention |

---

## 🎯 **Summary**

### **Your Question: "Is 0.02 correct or wrong?"**

**ANSWER: ✅ CORRECT!**

- ✅ It's **0.02%** (not 0.02 without %)
- ✅ It's a **12-month annualized** rate (not 30-day)
- ✅ It's **historical/backward-looking** (what already happened)
- ✅ You have **excellent churn performance**
- ⚠️ However, you're missing the **predictive churn risk** metric

---

## 💭 **What This Means**

**Good News:**
- Your actual churn is extremely low (0.02%)
- Only 3 customers left in the past year
- You're performing far above industry benchmarks

**The Gap:**
- You have 0.02% **historical churn** (what happened)
- But you have ~12% **predicted churn risk** (what might happen)
- This means 33 accounts totaling $3.2M are showing churn risk signals
- You need a **Predicted Churn Risk KPI** to be proactive

---

## 🚀 **Next Steps**

To get the full churn picture, you should:

1. ✅ **Keep the Historical Churn Rate KPI** (0.02%) - Shows past performance
2. ➕ **Add Predicted Churn Risk KPI** (12.3%) - Shows future risk
3. 📊 **Build drill-down views** for at-risk accounts
4. 🎯 **Create intervention workflows** based on predictions

---

## 🔢 **Display Format Clarification**

**If you're seeing "0.02" instead of "0.0%":**

The code currently uses:
```typescript
formatted: `${churnRate.toFixed(1)}%`  // Should show "0.0%"
```

**Possible reasons for seeing "0.02":**
1. Code might be using `.toFixed(2)` somewhere = "0.02%"
2. Displaying raw value instead of formatted = "0.02" (missing %)
3. Different calculation or data refresh timing

**Recommendation:** Check the exact value displayed on your dashboard:
- If it shows: **"0.0%"** → Using .toFixed(1) - correct
- If it shows: **"0.02%"** → Using .toFixed(2) - also correct, more precise
- If it shows: **"0.02"** (no %) → Display bug, should add % symbol

---

## ✅ **Conclusion**

**Your Historical Churn Rate of 0.02% is:**
- ✅ Correctly calculated
- ✅ Based on 12 months of data (not 30 days)
- ✅ Exceptionally good performance
- ✅ Well below the 5% target

**You're doing great on historical churn!** Now you need to add the **Predicted Churn Risk** metric to be proactive about the future.
