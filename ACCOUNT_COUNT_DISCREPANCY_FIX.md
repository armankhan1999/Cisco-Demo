# Account Count Discrepancy - Root Cause & Fix

## 🔍 **Problem Identified**

**User Report:**
- **Portfolio Dashboard** shows: **50 Active Accounts**
- **License Utilization** shows: **45 accounts**

**Discrepancy: 5 accounts difference**

---

## 🐛 **Root Cause Analysis**

### **Issue: Duplicate Customer IDs in accounts.json**

**Evidence:**
```bash
Total accounts in accounts.json: 50
Unique customer IDs: 45
Duplicate IDs: 5
```

### **The 5 Duplicate Customer IDs:**

#### **CUST_000001 (2 entries):**
1. **TechCorp Industries** - Enterprise - $1.5M ARR - Health: 31
2. **Global Premier Works** - Strategic - $3.4M ARR - Health: 32

#### **CUST_000002 (2 entries):**
1. **MedSecure Systems** - Strategic - $3.6M ARR - Health: 93
2. **Global Capital Management** - Strategic - $3.7M ARR - Health: 85

#### **CUST_000003 (2 entries):**
1. **Global Financial Partners** - Enterprise - $804K ARR - Health: 51
2. **Global Quality Industries** - Strategic - $3.2M ARR - Health: 76

#### **CUST_000004 (2 entries):**
1. **Advanced Manufacturing Co** - Commercial - $141K ARR - Health: 92
2. **Global Medical Network** - Strategic - $4.2M ARR - Health: 50

#### **CUST_000005 (2 entries):**
1. **InnovateTech Solutions** - Commercial - $496K ARR - Health: 79
2. **White, Boehm and Hilpert** - Enterprise - $1.8M ARR - Health: 68

---

## 📊 **Why Different Counts?**

### **Portfolio Dashboard (50 accounts):**
```typescript
// Counts ALL entries in accounts.json
const accounts = getActiveAccounts(); // Returns 50 entries
const totalAccounts = accounts.length; // 50
```
**Result: 50** (counts duplicate IDs as separate accounts)

### **License Utilization (45 accounts):**
```typescript
// Counts UNIQUE customer IDs with utilization data
const utilizationHistory = loadUtilizationHistory();
const uniqueCustomers = new Set(utilizationHistory.map(u => u.customer_id));
const totalAccounts = uniqueCustomers.size; // 45
```
**Result: 45** (only unique customer IDs)

---

## 🎯 **Which is Correct?**

**Answer: 45 unique accounts is the correct count**

### **Why?**

1. **Customer IDs should be unique** - One customer = one account
2. **Utilization data has 45 unique customers** - This is the source of truth
3. **Duplicate entries are likely data errors** - Same customer appearing twice

### **What are the duplicates?**

Looking at the data, these appear to be **different companies with the same customer ID** (data generation error):

**Example:**
- **CUST_000001** is assigned to both:
  - TechCorp Industries (Enterprise, $1.5M, Health 31)
  - Global Premier Works (Strategic, $3.4M, Health 32)

These are clearly **different companies** but share the same ID!

---

## 🔧 **Solutions**

### **Option 1: Fix Data - Assign Unique IDs (RECOMMENDED)**

**Create new unique IDs for duplicates:**

```javascript
// Reassign IDs to duplicates
CUST_000001 → TechCorp Industries (keep)
CUST_000051 → Global Premier Works (new ID)

CUST_000002 → MedSecure Systems (keep)
CUST_000052 → Global Capital Management (new ID)

CUST_000003 → Global Financial Partners (keep)
CUST_000053 → Global Quality Industries (new ID)

CUST_000004 → Advanced Manufacturing Co (keep)
CUST_000054 → Global Medical Network (new ID)

CUST_000005 → InnovateTech Solutions (keep)
CUST_000055 → White, Boehm and Hilpert (new ID)
```

**Result:** 50 unique accounts, consistent everywhere ✅

---

### **Option 2: Deduplicate - Keep One Entry Per ID**

**For each duplicate, keep the entry with:**
- Higher ARR (business impact)
- OR Lower health score (needs attention)

**Example for CUST_000001:**
```
Keep: Global Premier Works ($3.4M ARR, Health 32)
Remove: TechCorp Industries ($1.5M ARR, Health 31)
```

**Result:** 45 unique accounts, consistent everywhere ✅

---

### **Option 3: Group as Multi-Division Accounts**

**Treat duplicates as divisions of the same company:**
```json
{
  "account_id": "CUST_000001",
  "parent_account": "Global Enterprise Group",
  "divisions": [
    {
      "name": "TechCorp Industries",
      "division_id": "CUST_000001_DIV1",
      "arr": 1523000,
      "health": 31
    },
    {
      "name": "Global Premier Works",
      "division_id": "CUST_000001_DIV2",
      "arr": 3386000,
      "health": 32
    }
  ],
  "total_arr": 4909000,
  "avg_health": 31.5
}
```

**Result:** 45 parent accounts, 50 divisions ✅

---

## 🛠️ **Recommended Fix (Option 1)**

### **Step 1: Update accounts.json**

**Reassign IDs to the 5 duplicate entries:**

```json
// Change from CUST_000001 to CUST_000051
{
  "account": {
    "id": "CUST_000051",  // Changed
    "name": "Global Premier Works",
    "tier": "Strategic",
    "arr": 3386280,
    ...
  }
}

// Repeat for:
// CUST_000002 → CUST_000052 (Global Capital Management)
// CUST_000003 → CUST_000053 (Global Quality Industries)
// CUST_000004 → CUST_000054 (Global Medical Network)
// CUST_000005 → CUST_000055 (White, Boehm and Hilpert)
```

### **Step 2: Update Related Data Files**

**Files that reference customer_id:**
1. ✅ `subscriptions.json` - Add subscriptions for new IDs
2. ✅ `utilization_history.json` - Add utilization for new IDs
3. ✅ `licenses.json` - Add licenses for new IDs
4. ✅ `qbr_tracking.json` - Add QBR records for new IDs
5. ✅ `revenue_movements.json` - Update movements for new IDs

### **Step 3: Verify Consistency**

```bash
# Check counts after fix
node -e "
  const accounts = require('./src/source_data/accounts.json');
  const unique = new Set(accounts.map(a => a.account.id));
  console.log('Total accounts:', accounts.length);
  console.log('Unique IDs:', unique.size);
  console.log('Match:', accounts.length === unique.size ? 'YES ✅' : 'NO ❌');
"
```

**Expected Result:**
```
Total accounts: 50
Unique IDs: 50
Match: YES ✅
```

---

## 📋 **Impact Analysis**

### **Before Fix:**
- ❌ Portfolio shows 50, License Utilization shows 45
- ❌ 5 companies share customer IDs
- ❌ Data inconsistency across dashboards
- ❌ Potential for incorrect reporting

### **After Fix:**
- ✅ Portfolio shows 50, License Utilization shows 50
- ✅ All companies have unique customer IDs
- ✅ Data consistency across all dashboards
- ✅ Accurate reporting and metrics

---

## 🎯 **Quick Fix - Deduplicate in Code**

**If data fix is not immediate, use this code workaround:**

### **Update getActiveAccounts() in csmDataLoader.ts:**

```typescript
export function getActiveAccounts(): Account[] {
  const accounts = accountsData.filter(a => 
    a.account.arr > 0 && 
    (!a.account.status || a.account.status === 'Active')
  );
  
  // Deduplicate by customer_id (keep higher ARR entry)
  const uniqueAccounts = new Map<string, any>();
  
  accounts.forEach(account => {
    const customerId = account.account.id;
    const existing = uniqueAccounts.get(customerId);
    
    if (!existing || account.account.arr > existing.account.arr) {
      uniqueAccounts.set(customerId, account);
    }
  });
  
  return Array.from(uniqueAccounts.values());
}
```

**Result:**
- Portfolio: 45 accounts (deduplicated)
- License Utilization: 45 accounts (unique)
- ✅ Consistent across dashboards

**Note:** This keeps the **higher ARR entry** for each duplicate ID.

---

## 🔍 **Detection Script**

**Create a validation script to check for duplicates:**

```javascript
// check_data_consistency.js
const accounts = require('./src/source_data/accounts.json');
const utilization = require('./src/source_data/commercial_operations/utilization_history.json');

const accountIds = accounts.map(a => a.account.id);
const uniqueAccountIds = new Set(accountIds);
const utilizationIds = new Set(utilization.map(u => u.customer_id));

console.log('Data Consistency Check:');
console.log('='.repeat(50));
console.log(`Accounts in accounts.json: ${accounts.length}`);
console.log(`Unique IDs in accounts.json: ${uniqueAccountIds.size}`);
console.log(`Unique IDs in utilization: ${utilizationIds.size}`);
console.log('='.repeat(50));

if (accounts.length !== uniqueAccountIds.size) {
  console.log('⚠️  WARNING: Duplicate customer IDs found!');
  
  const duplicates = accountIds.filter((id, i, arr) => 
    arr.indexOf(id) !== i
  );
  
  console.log('\nDuplicate IDs:', [...new Set(duplicates)]);
} else {
  console.log('✅ No duplicates found');
}

if (uniqueAccountIds.size !== utilizationIds.size) {
  console.log('\n⚠️  WARNING: ID count mismatch between files!');
}
```

---

## 💡 **Recommendations**

### **Immediate (Today):**
1. ✅ Implement code workaround in `getActiveAccounts()`
2. ✅ Both dashboards will show 45 accounts (consistent)

### **Short-term (This Week):**
1. 🔧 Fix data: Assign unique IDs (CUST_000051-000055)
2. 🔧 Update related data files
3. 🔧 Verify consistency across all files

### **Long-term (Next Sprint):**
1. 📊 Add data validation tests
2. 📊 Implement duplicate detection in data pipeline
3. 📊 Add consistency checks in CI/CD

---

## 📊 **Summary**

| Issue | Count | Root Cause |
|-------|-------|------------|
| **Portfolio Dashboard** | 50 | Counts all entries (including duplicates) |
| **License Utilization** | 45 | Counts unique customer IDs only |
| **Duplicate IDs** | 5 | Same customer_id assigned to different companies |
| **True Account Count** | **45** | Number of unique customers |

**Fix:**
- **Quick:** Deduplicate in code → Both show 45 ✅
- **Proper:** Fix data, assign unique IDs → Both show 50 ✅

**The discrepancy is NOT a bug in calculations - it's a data integrity issue with duplicate customer IDs in accounts.json!**
