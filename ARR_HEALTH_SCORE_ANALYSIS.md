# ARR and Health Score Data Source Analysis

## 🔴 Problem: Different Values Shown

### For CUST_000043 (Cronin and Sons):

**Account Detail Page (Inside) Shows:**
- Health Score: 48
- ARR: $400

**Accounts List Page (Outside) Should Show:**
- Health Score: 48
- ARR: $10,017

---

## 📊 Data in Files

### 1. accounts.json
```json
{
  "account": {
    "id": "CUST_000043",
    "name": "Cronin and Sons",
    "arr": 10017,           // ✅ TOTAL account ARR
    "health_score": 48,     // ✅ Current health score
    "tier": "SMB"
  }
}
```

### 2. subscriptions.json
```json
// Meraki Subscription
{
  "subscription_id": "SUB_CUST_000043_Meraki_139",
  "customer_id": "CUST_000043",
  "arr": 400,             // ❌ Just Meraki product ARR
  "subscription_status": "suspended"
}

// Duo Subscription  
{
  "subscription_id": "SUB_CUST_000043_Duo_140",
  "customer_id": "CUST_000043",
  "arr": 18,              // ❌ Just Duo product ARR
  "subscription_status": "active"
}
```

**Total from subscriptions:** 400 + 18 = 418
**BUT account-level ARR in accounts.json:** 10,017

---

## 🔴 Root Cause

### Current (WRONG) Implementation:

**Account Detail Page (Line 433):**
```typescript
arr: subscription.arr || 0,
```
- Uses `subscriptions.find()` which returns FIRST match only
- Gets Meraki subscription = $400 ❌

**Accounts List Page (Line 101):**
```typescript
arr: subscription?.arr || 0,
```
- Also uses `subscriptions.find()` which returns FIRST match only
- Gets Meraki subscription = $400 ❌

**Both pages are getting PRODUCT-LEVEL ARR instead of ACCOUNT-LEVEL ARR!**

---

## ✅ Correct Data Source

### accounts.json is the SOURCE OF TRUTH for account-level metrics:

| Metric | Correct Source | Field |
|--------|---------------|-------|
| **Total ARR** | `accounts.json` | `account.arr` |
| **Health Score** | `accounts.json` | `account.health_score` |
| **MRR** | `accounts.json` | `account.mrr` |
| **Tier** | `accounts.json` | `account.tier` |
| **Renewal Risk** | `accounts.json` | `account.renewal_risk_score` |

### subscriptions.json is for PRODUCT-LEVEL details:

| Metric | Source | Use Case |
|--------|--------|----------|
| **Product ARR** | `subscriptions.json` | Per-product revenue breakdown |
| **Subscription Status** | `subscriptions.json` | Active/Suspended/Cancelled |
| **Renewal Probability** | `subscriptions.json` | Per-product renewal risk |
| **Billing Details** | `subscriptions.json` | Payment terms, frequency |

---

## ✅ Solution

### Fix Both Pages to Use accounts.json for Account-Level Metrics

**Account Detail Page:**
```typescript
// OLD (WRONG):
arr: subscription.arr || 0,

// NEW (CORRECT):
arr: accountData.account?.arr || (accountData as any).arr || 0,
```

**Accounts List Page:**
```typescript
// OLD (WRONG):
arr: subscription?.arr || 0,

// NEW (CORRECT):
arr: accountData.account.arr || 0,
```

---

## 📋 Why This Confusion Exists

**subscriptions.json stores per-product ARR:**
- Each product has its own subscription record
- Each subscription has its own ARR value
- Finding one subscription gets you ONE product's ARR, not total

**accounts.json stores rolled-up account metrics:**
- Total ARR across all products
- Overall health score
- Account-level financial data

**The relationship:**
```
accounts.json (account.arr) = SUM of all subscriptions.json (arr) for that customer
```

But since we're already doing `subscriptions.find()` (which returns ONE subscription), we're only getting partial ARR.

---

## ✅ After Fix

**Both pages will show:**
- Health Score: 48 (from accounts.json)
- ARR: $10,017 (from accounts.json)

**Consistent across:**
- ✅ Accounts List page (cards)
- ✅ Account Detail page (inside)
- ✅ All KPI pages
- ✅ Dashboard summaries

---

## 🎯 Rule Going Forward

**For Account-Level Metrics:**
- ✅ Use `accounts.json` (account.arr, account.health_score, etc.)

**For Product-Level Details:**
- ✅ Use `subscriptions.json` (per-product ARR, status, renewal dates)

**Never mix product-level with account-level!**
