# Commercial Operations Requirements 

## What They Actually Want

Based on the meeting notes and knowledge base, here's what Cisco's Commercial Operations teams need:

---

## **The Core Problem**

Commercial Operations teams (the people who handle quotes, orders, billing, invoices, and subscription renewals) are **flying blind**. They manage the entire money-making process but don't have a unified view of how customers are actually using what they bought.

---

## **What They're Missing**

### 1. **License Visibility Gap**
- They sell licenses to customers but can't easily see:
  - Are customers using what they paid for?
  - Are licenses sitting unused (shelf-ware)?
  - Are customers about to run out of capacity?
  - Which customers have dormant/inactive licenses?

### 2. **Process Friction**
- When creating renewal quotes, they don't know if a customer needs more or fewer licenses
- When billing disputes happen, they can't quickly show usage data to justify the invoice
- When customers call with questions, they lack quick answers about utilization

### 3. **Reactive Instead of Proactive**
- They only learn about problems when customers complain
- They miss expansion opportunities because they don't see usage hitting capacity limits
- They can't prevent churn because they don't see declining usage patterns early

---

## **What They Want the Dashboard to Show**

### **Think of it like a car dashboard, but for licenses:**

### **Tier I: Basic Health Checks** (The "What")
- **License Saturation**: Out of 1000 licenses sold, how many are assigned to users?
- **Active Usage**: Out of assigned licenses, how many are actually being used?
- **Dormant Licenses**: Which licenses haven't been touched in 90+ days?
- **Usage Trends**: Is usage going up, down, or staying flat?

### **Tier II: Process Triggers** (The "How")
- **Renewal Alerts**: Flag accounts approaching their license limit (expansion opportunity!)
- **Risk Scores**: Calculate which customers might churn based on low/declining usage
- **Billing Reconciliation**: Match what was sold vs. what's actually provisioned
- **Mid-Cycle Warnings**: Alert when usage suddenly drops (customer problem?) or spikes (expansion need?)

### **Tier III: Business Impact** (The "So What")
- **Time Savings**: "We cut quote generation time by 40% because we have the data ready"
- **Revenue Recovery**: "We found $500K in unbilled overages"
- **Churn Prevention**: "We saved 3 at-risk accounts worth $2M by intervening early"
- **Proactive Wins**: "We flagged 15 expansion opportunities before customers asked"

---

## **Who Uses This?**

### **Primary Users:**
1. **Customer Success Managers** (CSMs)
   - Managing hundreds of customer accounts
   - Need quick health checks
   - Want early warning signals

2. **Commercial Operations Teams**
   - Deal Desk (quoting)
   - Order Management
   - Billing & Invoicing
   - Renewal Managers
   - Contract Administration

### **Their Daily Questions:**
- "Which renewals coming up need my attention?"
- "Are there any billing disputes I should prepare for?"
- "Which customers are ready for an upsell conversation?"
- "Are there any inactive licenses I should reclaim?"
- "Which accounts are at risk of churning?"

---

## **The Measurement Flow**

Think of it as a three-level pyramid:

```
          🎯 TIER III 🎯
    Business Value & ROI
    (Did this actually help?)
    
       📊 TIER II 📊
   Process Integration
   (Are we using the data?)
   
      📈 TIER I 📈
  License & Utilization
  (Do we have the data?)
```

### **Bottom Up (How Data Flows):**
1. **Collect** license and usage data (Tier I)
2. **Trigger** alerts and workflows in their daily processes (Tier II)
3. **Measure** the business impact and ROI (Tier III)

### **Top Down (How They Think):**
1. "We need to prove this saves money and prevents churn" (Tier III)
2. "So we need it embedded in our daily work" (Tier II)
3. "Which means we need clean, real-time usage data" (Tier I)

---

## **The Real-World Workflow**

### **Scenario: Renewal Manager's Monday Morning**

**Without This Dashboard:**
- Manually pulls license counts from Product A's portal
- Manually pulls license counts from Product B's portal
- Manually checks Salesforce for account health
- Manually creates renewal quote
- Hopes the customer doesn't complain about the pricing
- **Time: 2-3 hours per renewal**

**With This Dashboard:**
- Opens single screen showing all products
- Sees: "Customer using 450 of 500 Duo licenses (90% capacity)"
- System auto-generates renewal quote with upsell opportunity for 600 licenses
- Sees usage trend is growing 5% monthly
- Has conversation data ready: "You're growing fast—let's add capacity now"
- **Time: 30 minutes per renewal**
- **Bonus: Proactive upsell conversation, not reactive**

---

## **The Five Products They Want Covered**

1. **Meraki** (Network infrastructure)
2. **Duo** (Security/MFA)
3. **Umbrella** (Cloud security)
4. **ThousandEyes** (Network monitoring)
5. **Splunk** (Data analytics)

**Why these five?**
- Diverse product types (infrastructure, security, observability)
- Different licensing models (device-based, user-based, consumption-based)
- Proves the solution works across Cisco's portfolio
- High revenue products where visibility gaps are most painful

---

## **What Makes This Hard**

### **The Data Challenge:**
- Customer "Microsoft" might appear as:
  - "Microsoft Asia-Pacific" (ID: 12345)
  - "Microsoft US" (ID: 67890)
  - "Microsoft LATAM" (ID: 11111)
- All three are the same customer but systems don't know it
- This is a **Master Data Management (MDM)** problem

### **The Organizational Challenge:**
- Cisco has 200+ acquired companies
- Each has different systems, definitions, and processes
- No single source of truth today
- This solution needs to work across that complexity

---

## **Bottom Line: What Success Looks Like**

### **For Commercial Ops Teams:**
✅ "I can create renewal quotes in 1/3 the time"
✅ "I catch expansion opportunities before customers ask"
✅ "I prevent churn by seeing problems early"
✅ "I justify invoices with real usage data"
✅ "I'm proactive, not reactive"

### **For Cisco Leadership:**
✅ "Revenue leakage reduced by $X million"
✅ "Renewal rates improved by Y%"
✅ "Commercial team productivity up Z%"
✅ "Customer satisfaction improved"
✅ "Clear ROI on this investment"

---

## **In One Sentence:**

**"Give Commercial Operations a unified, real-time view of license utilization across all products so they can quote faster, expand proactively, prevent churn, and optimize revenue—moving from reactive firefighting to strategic business partnership."**