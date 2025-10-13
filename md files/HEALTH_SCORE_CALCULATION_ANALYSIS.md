# Health Score Data Source Analysis - CUST_000043

## 🔍 Data Investigation

### From `accounts.json` for CUST_000043:

```json
{
  "account": {
    "id": "CUST_000043",
    "name": "Cronin and Sons",
    "health_score": 48,  // ✅ CURRENT health score
    "renewal_risk_score": 48
  },
  "timeline": [
    {
      "month": 6,
      "date": "2024-06-22",
      "health_score": 73,  // June 2024 milestone
      "event": "integration_planning"
    },
    {
      "month": 9,
      "date": "2024-09-16",
      "health_score": 84,  // September 2024 milestone
      "event": "unified_deployment"
    },
    {
      "month": 12,
      "date": "2024-12-17",
      "health_score": 83,  // December 2024 milestone
      "event": "integrated_operations"
    }
  ]
}
```

---

## 📊 What Each Page Shows

### 1. Account Detail Page (`/csm/accounts/[customerId]`)
**Shows: Health Score = 48** ✅

**Source (Line 434):**
```typescript
healthScore: accountData.account?.health_score || (accountData as any).health_score || 70
```
**Uses:** `account.health_score` = **48** ✅ CORRECT

---

### 2. Accounts List Page (`/csm/accounts`)
**Shows: Health Score = 48** ✅

**Source (Line 93):**
```typescript
const healthScore = accountData.account.health_score || 0;
```
**Uses:** `account.health_score` = **48** ✅ CORRECT

---

### 3. Account Deep Dive Page (`/csm/account-deep-dive/[id]`)
**Shows: Health Score = 83** ❌

**Source:** `accountDeepDiveLoader.ts` → `getLatestHealthScore()` (Lines 152-182)

**Logic:**
```typescript
export function getLatestHealthScore(accountId: string): number {
  const account = accountsData.find(...);
  
  // STEP 1: Check timeline first (WRONG PRIORITY)
  if (account.timeline && account.timeline.length > 0) {
    const sortedTimeline = [...account.timeline].sort((a, b) => b.month - a.month);
    return sortedTimeline[0].health_score || 0;  // ❌ Returns 83 (from Dec milestone)
  }
  
  // STEP 2: Check account.health_score (SHOULD BE FIRST)
  if (accountInfo.health_score !== undefined) {
    return accountInfo.health_score;  // This would return 48 ✅
  }
  
  return 0;
}
```

**Gets:** Timeline month 12 → health_score = **83** ❌ WRONG

---

## 🔴 The Problem

### Timeline vs Current State

**Timeline entries are MILESTONE-BASED:**
- Represent health scores at specific business events
- June: "integration_planning" → 73
- September: "unified_deployment" → 84
- December: "integrated_operations" → 83

**account.health_score is CURRENT STATE:**
- Represents the account's health score **right now** (as of latest snapshot)
- Value: **48**

**The account's health has DECLINED since the December milestone:**
- December 2024 milestone: 83
- Current (October 2025): 48
- **Decline of 35 points!**

---

## ✅ Which One is Correct?

**48 is CORRECT** ✅

### Reasoning:

1. **Current date: October 12, 2025**
2. **Last timeline entry: December 2024** (10 months ago)
3. **account.health_score: 48** (current as of latest data snapshot)

**The timeline shows historical milestones, NOT the current state.**

Between December 2024 and October 2025:
- Health declined from 83 → 48
- This is a **significant decline** (35 points over 10 months)
- This explains why renewal_risk_score is also 48

---

## 🔧 The Bug

`accountDeepDiveLoader.ts` line 160-162:

```typescript
// WRONG: Prioritizes timeline over current state
if (account.timeline && account.timeline.length > 0) {
  const sortedTimeline = [...account.timeline].sort((a, b) => b.month - a.month);
  return sortedTimeline[0].health_score || 0;  // Gets Dec 2024 = 83 ❌
}
```

**This assumes timeline is always up-to-date, but it's milestone-based!**

---

## ✅ The Fix

**Priority should be:**
1. ✅ **FIRST:** Use `account.health_score` (current state)
2. ✅ **FALLBACK:** Use timeline if account.health_score doesn't exist
3. ✅ **LAST RESORT:** Use health-history files

**Fixed logic:**
```typescript
export function getLatestHealthScore(accountId: string): number {
  const account = accountsData.find(...);
  if (!account) return 0;
  
  const accountInfo = account.account || account;
  
  // STEP 1: Check account.health_score FIRST (current state)
  if (accountInfo.health_score !== undefined) {
    return accountInfo.health_score;  // Returns 48 ✅
  }
  
  // STEP 2: Fallback to timeline if no current health_score
  if (account.timeline && account.timeline.length > 0) {
    const sortedTimeline = [...account.timeline].sort((a, b) => b.month - a.month);
    return sortedTimeline[0].health_score || 0;
  }
  
  // STEP 3: Fallback to health-history files
  const accountHealthData = allHealthHistory.filter(...);
  if (accountHealthData.length > 0) {
    const sorted = accountHealthData.sort(...);
    return sorted[0].health_score;
  }
  
  return 0;
}
```

---

## 📊 Health Trend Display

**The Account Deep Dive should show:**

**Current Health Score: 48** ✅
**Health Trend (Last 6+ Months):**
- June 2024: 73
- September 2024: 84
- December 2024: 83
- Current (October 2025): 48 ← **Major decline!**

**This tells the story:**
1. Account was healthy during integration (73 → 84 → 83)
2. Since then, health has severely declined to 48
3. This is a **critical situation** requiring immediate attention

---

## 🎯 Summary

| Page | Value | Correct? | Source |
|------|-------|----------|--------|
| **Account Detail** | 48 | ✅ Yes | `account.health_score` |
| **Accounts List** | 48 | ✅ Yes | `account.health_score` |
| **Account Deep Dive** | 83 | ❌ No | `timeline[last].health_score` |

**48 is the correct CURRENT health score.**
**83 was the health score in December 2024 (10 months ago).**

The fix: Prioritize `account.health_score` over timeline entries.
