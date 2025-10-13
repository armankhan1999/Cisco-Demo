

## Commercial Operations KPI Drill-Down Framework (4 Levels)

### Universal Filters (Available on All Levels)
```
📅 Time Period: Month/Quarter/Year | Fiscal Period
👥 Customer Segment: Enterprise | Mid-Market | SMB
🌍 Geography: Region | Country
📦 Product Family: Meraki | Duo | Umbrella | ThousandEyes | Splunk
```

---

## **1. Quote-to-Cash Cycle Time**

### **Level 0: KPI Card** ✅ (Already Built)
- **Metric:** 48 days (Target: ≤45)
- **Status:** 🔴 Red (6.7% over target)
- **Trend:** ↗ +3 days vs prior month

---

### **Level 1: Process Stage Breakdown**
**Business Story:** *Which stages are causing delays?*

**Visual:** Horizontal Waterfall Chart
```
Quote Creation → Approval (3d) → Order (5d) → Fulfillment (12d) → Invoice (2d) → Payment (26d)
                    ✅              ✅             🔴                 ✅             🔴
```

**Metrics Table (Below Chart):**
| Stage | Avg Days | Target | Δ Target | Volume |
|-------|----------|--------|----------|--------|
| Payment Collection | 26 | 20 | +6 🔴 | 82 |
| Order Fulfillment | 12 | 7 | +5 🔴 | 84 |
| Quote Approval | 3 | 3 | 0 ✅ | 120 |

**Filters Added:** Deal Complexity, Quote Type (New/Renewal/Expansion)

**Click Action:** Drill to Level 2 (e.g., click "Payment Collection" row)

---

### **Level 2: Segment Deep Dive (Payment Collection)**
**Business Story:** *Which customer segments are slow to pay?*

**Visual:** Combo Chart (Bar + Line)
- **Bars:** Avg Days by Segment + Product
- **Line:** Transaction Volume

```
         Days
    30 │     ████
       │     ████  ████           
    20 │████ ████  ████  ████    
       │████ ████  ████  ████ ████
    10 │████ ████  ████  ████ ████
     0 └──────────────────────────
        ENT   MM   SMB   ENT   MM
       Meraki     Duo      Splunk
```

**Insight Box (Top Right):**
```
🎯 SMB-Duo averaging 29 days (15 orders)
💡 Payment terms mismatch detected
```

**Filters Added:** Payment Terms (Net 30/45/60), Contract Value Band

**Click Action:** Drill to Level 3 (e.g., click "SMB-Duo" bar)

---

### **Level 3: Transaction Detail**
**Business Story:** *Which specific deals are stuck?*

**Visual:** Interactive Data Table with Embedded Sparklines

| Customer | Product | Quote Date | Days | Stage | Owner | Action |
|----------|---------|-----------|------|-------|-------|--------|
| GlobalTech | Duo | 2025-08-15 | 58 🔴 | Payment | Sarah M | 📞 Call |
| Acme Corp | Duo | 2025-08-22 | 47 🔴 | Payment | Tom K | 💬 Email |
| TechStart | Duo | 2025-09-01 | 33 🟡 | Payment | Sarah M | ⏰ Follow-up |

**Sparkline Column (Hover):** Shows daily status progression

**Right Panel (Click Row):** 
```
Customer: GlobalTech
Invoice: #INV-2947
Amount: $48,500
Payment Terms: Net 45 (Expired)
Last Contact: 10/01/2025
Health Score: 67 🟡
Utilization: 82% ✅

📋 Timeline:
 • Quote Sent: 08/15 
 • Approved: 08/18
 • Order: 08/20
 • Invoice: 08/27
 • Payment: OVERDUE (45d)

🚨 Risk Factors:
 - 13 days past payment terms
 - Previous late payments: 2/5
 
🔗 Actions:
 [Contact Finance] [View AR Details] [Escalate to CSM]
```

---

### **Level 4: Root Cause Analysis**
**Business Story:** *Why is this customer delayed?*

**Visual:** Relationship Graph + Timeline

**Left Side - Relationship Map:**
```
        [GlobalTech]
           /    \
    [Contact 1] [Contact 2] (Finance Lead)
         ↓         ↓
    3 touches   0 touches ⚠️
```

**Right Side - Parallel Metrics:**
```
📊 Customer Context:
 • ARR: $285K (Mid-Market)
 • Tenure: 18 months
 • Products: 3 (Duo, Meraki, Umbrella)
 • Health: 67/100 🟡
 • Support Tickets: 2 open (P3)

💰 Financial Pattern:
 • Avg Payment Days: 52
 • Payment Method: Wire Transfer
 • Credit Terms: Net 45
 • Collections Contact: 3 attempts

🎯 Utilization Signal:
 • Duo: 82% (Above threshold)
 • Meraki: 45% (⚠️ Underutilized)
 • Last Login: 3 days ago
```

**Action Buttons:**
```
[Send Payment Reminder] [Update Payment Terms] [Assign Collections Agent] 
[View Full Customer 360] [Create Task in CRM]
```

---

## **2. Quote Approval Velocity**

### **Level 1: Approval Stage Funnel**
**Business Story:** *Where are quotes getting stuck?*

**Visual:** Sanity/Funnel Diagram
```
120 Quotes Submitted
    ↓ Auto-Approved (68) → 1.2 days ✅
    ↓ Manager Review (32) → 2.8 days ✅
    ↓ Director Review (15) → 4.5 days 🟡
    ↓ VP/C-Level (5) → 8.2 days 🔴
```

**Filters:** Deal Complexity, Quote Type, Product Portfolio Breadth

---

### **Level 2: Approval Bottleneck Analysis**
**Business Story:** *Why are high-value quotes slow?*

**Visual:** Scatter Plot (Deal Size vs Approval Days) + Color by Complexity

```
Days
 10 │              ● (Complex)
    │          ●   ● 
  5 │    ●  ●   ○ (Moderate)
    │  ○ ○ ○ ○
  0 └──────────────────
     0   50  100  150  200
              Deal Size ($K)
```

**Insight Panel:**
```
🔍 Pattern Detected:
 • Complex deals >$100K averaging 7.5 days
 • Simple renewals <48 hours
 • Cross-sell quotes require multi-tier approval
 
📈 Opportunity:
 • Pre-approved discount bands could save 2-3 days
```

---

### **Level 3: Pending Quote Queue**
**Visual:** Kanban Board

```
┌─ Auto-Approve (1d) ─┬─ Manager (2d) ─┬─ Director (4d) ─┬─ VP+ (7d) ─┐
│ [Quote #2847]       │ [Quote #2851]  │ [Quote #2839]   │ [Quote #2821] │
│ $12K Renewal        │ $48K Expansion │ $125K New       │ $340K Enterprise │
│ Acme Corp           │ TechStart      │ GlobalBank      │ MegaCorp     │
└─────────────────────┴────────────────┴─────────────────┴──────────────┘
```

**Click Card → Drill to Level 4**

---

### **Level 4: Quote Detail + Approval Workflow**
**Visual:** Timeline + Approval Chain

```
Quote #2839: GlobalBank - $125K New Business
Product: Splunk Enterprise (250 licenses)

⏱️ Timeline:
 10/10 08:00 - Quote Created (Rep: John D)
 10/10 09:15 - Auto-checks Passed ✅
 10/10 09:30 - Manager Approved (Sarah M) ✅
 10/11 14:00 - Director Review Started (Mike P)
 10/12 -- PENDING -- 🔴 (32 hours in queue)

📋 Approval Chain:
 ✅ Sales Rep → ✅ Manager → ⏳ Director → ⏸️ VP Sales

🚨 Blockers:
 • Custom pricing 18% below list
 • Payment terms: Net 60 (standard is Net 45)
 • Multi-year commit requires finance review

📞 Next Action:
 • Director Mike P notified 10/12 10:00
 • Escalation trigger: 48 hours
```

---

## **3. Invoice Accuracy Rate**

### **Level 1: Error Type Distribution**
**Business Story:** *What kinds of errors are we making?*

**Visual:** Donut Chart + Error Table

```
        Total Errors: 12 (2.1% of 574 invoices)
        
         ╱─────╲
       ╱         ╲        Pricing: 5 (42%)
      │  Pricing  │       Terms: 4 (33%)
       ╲         ╱        Tax: 2 (17%)
         ╲─────╱          Other: 1 (8%)
```

**Table Below:**
| Error Type | Count | Avg Correction Time | ARR Impact |
|------------|-------|---------------------|------------|
| Pricing Mismatch | 5 | 3.2 days | -$18K |
| Payment Terms Wrong | 4 | 1.8 days | $0 |
| Tax Calculation | 2 | 5.1 days | -$1.2K |

**Filters:** Product Family, Billing Frequency, Invoice Date Range

---

### **Level 2: Product/Segment Error Pattern**
**Business Story:** *Which products/segments have most errors?*

**Visual:** Heatmap

```
          │ Meraki │ Duo  │ Umbrella │ Splunk │
──────────┼────────┼──────┼──────────┼────────┤
Enterprise│   0    │  1   │    2     │   3    │ 🔴
Mid-Market│   1    │  2   │    0     │   1    │ 🟡
SMB       │   0    │  1   │    1     │   0    │ ✅

Color Scale: 0=Green | 1-2=Yellow | 3+=Red
```

**Insight:**
```
⚠️ Enterprise-Splunk: 3 errors (complex multi-year deals)
💡 Root cause: Manual pricing overrides not syncing
```

---

### **Level 3: Error Detail Log**
**Visual:** Timeline Table

| Invoice | Customer | Product | Error | Created | Detected | Fixed | Impact |
|---------|----------|---------|-------|---------|----------|-------|--------|
| #2947 | MegaCorp | Splunk | Price | 09/15 | 09/18 | 09/22 | -$8.5K |
| #2851 | GlobalBank | Splunk | Price | 08/22 | 08/25 | 08/28 | -$6.2K |

**Click Row → Level 4**

---

### **Level 4: Invoice Error Audit Trail**
**Visual:** Diff Comparison + Approval Log

```
Invoice #2947: MegaCorp - Splunk Enterprise

❌ Original Invoice (09/15):
 - Quantity: 250 licenses
 - Unit Price: $420 → ⚠️ WRONG (List: $450)
 - Subtotal: $105,000
 - Discount: 15% (Standard)
 - Total: $89,250

✅ Corrected Invoice (09/22):
 - Quantity: 250 licenses
 - Unit Price: $450 ✓
 - Negotiated Price: $405 (10% discount)
 - Total: $101,250

💰 Revenue Impact: +$12,000

📋 Root Cause:
 • Quote #2839 had approved price of $405
 • Invoice pulled stale pricing from product catalog
 • CPQ sync delay: 48 hours

🔧 Correction Timeline:
 09/18 - Customer queried pricing
 09/19 - Finance team opened ticket
 09/20 - Quote reviewed, error confirmed
 09/22 - Corrected invoice issued
 09/25 - Customer accepted, payment received

🔗 Related Records:
 [View Quote #2839] [View Order #2904] [View Payment #2973]
```

---

## **4. Days Sales Outstanding (DSO)**

### **Level 1: DSO Trend + Aging Buckets**
**Business Story:** *Is our collection getting better or worse?*

**Visual:** Line Chart + Stacked Bar

```
DSO Trend (Last 6 Months):
Days
 40 │        ●───●
    │      ●       ●───●
 30 │    ●               ●
    │  ●
 20 └──────────────────────
     May Jun Jul Aug Sep Oct
     
     Target: 30 days ────────

Aging Buckets (Current):
$M  │████ 0-30d: $2.4M (65%)
 3  │████ 31-60d: $0.8M (22%)
    │▓▓▓▓ 61-90d: $0.3M (8%)
 0  └──── 90+d: $0.2M (5%) 🔴
```

**Filters:** Customer Segment, Payment Terms, Geography

---

### **Level 2: Segment Performance Matrix**
**Business Story:** *Which segments are slow payers?*

**Visual:** Bubble Chart (Size = AR Balance, Color = DSO)

```
          Good Payers    │    Slow Payers
                         │
  High    ○ ENT-Meraki   │  ● ENT-Splunk 🔴
  ARR     (35d, $1.2M)   │  (58d, $0.8M)
          ○ MM-Duo       │  ● SMB-Umbrella
  Low     (28d, $0.6M)   │  (42d, $0.3M)
          ───────────────┼─────────────────
          <35 days       │  >45 days
                    DSO
```

**Click Bubble → Level 3**

---

### **Level 3: Customer AR Aging Detail**
**Visual:** Table with Sparklines (Payment History)

| Customer | Segment | Outstanding | Current | 30-60d | 60-90d | 90+d | Payment History |
|----------|---------|-------------|---------|--------|--------|------|-----------------|
| MegaCorp | ENT | $185K | $120K | $45K | $20K 🔴 | $0 | ▂▄▆█▆▄ (Slowing) |
| GlobalTech | MM | $68K | $25K | $28K 🟡 | $15K | $0 | ▄▄▅▅▄▄ (Stable) |

**Sparkline Legend:** Recent → Older (6 invoices)

**Click Row → Level 4**

---

### **Level 4: Customer Payment Profile**
**Visual:** Multi-Tab Dashboard

**Tab 1: Payment Pattern**
```
Customer: MegaCorp
Total AR: $185,000 | Overdue: $65,000 (35%)

📊 Invoice Aging:
 • Invoice #2947 ($45K) - 52 days overdue 🔴
 • Invoice #2851 ($20K) - 68 days overdue 🔴
 • Invoice #2799 ($120K) - Current ✅

📈 Historical Performance:
  Avg Days to Pay: 48 (vs 30 target)
  On-Time Rate: 60% (Last 12 invoices)
  
  Chart: [Bar showing 12 invoice payment times]
```

**Tab 2: Customer Context**
```
🏢 Account Health:
 • ARR: $340K (Enterprise)
 • Products: 4 (Meraki, Duo, Splunk, Umbrella)
 • Health Score: 72/100 🟡
 • CSM: Jennifer L
 • Renewal Date: 2026-03-15 (153 days)

⚠️ Risk Signals:
 • Support tickets: 5 open (2 P2)
 • Utilization: Splunk 68% (Below target)
 • Last executive touch: 45 days ago
 
💡 Collection Strategy:
 ✓ Send reminder (10/01 - Done)
 ⏳ Finance escalation (10/08 - Pending)
 ⏸️ CSM intervention (If no response by 10/12)
```

**Tab 3: Contact Activity**
```
Collection Attempts:
 10/01 - Email to AP contact (Opened, no reply)
 10/05 - Phone call (Voicemail left)
 10/08 - Email to Finance lead (Pending)
 
🔗 Related Actions:
 [Log Collection Call] [Send Payment Link] 
 [Escalate to CSM] [Create Payment Plan]
```

---

## **5. Revenue Recognition Accuracy**

### **Level 1: Recognition Variance by Period**
**Business Story:** *Where are our biggest mismatches?*

**Visual:** Column Chart (Expected vs Actual) + Variance Line

```
$M      Expected  Actual
 2  │   ████      ████
    │   ████      ███░  ← -2.8% Sep
 1  │   ████      ████
    │   ████      ████  ← +0.5% Aug
 0  └────────────────────
       Jul   Aug   Sep   Oct
       
Variance Trend: ─ ─ ─ (Target: ≤2%)
```

**Filters:** Product Family, Revenue Type (New/Renewal/Expansion), Contract Term

---

### **Level 2: Product-Level Recognition Detail**
**Business Story:** *Which products have recognition issues?*

**Visual:** Treemap (Size = Revenue, Color = Variance %)

```
┌──────────────────────────────────────┐
│ Meraki ($850K, +0.8%) ✅             │
│┌────────────────┬───────────────────┐│
││ Duo ($620K)    │ Splunk ($480K)    ││
││ -3.2% 🔴       │ +1.1% ✅          ││
│└────────────────┴───────────────────┘│
│ Umbrella ($340K, -0.5%) ✅           │
└──────────────────────────────────────┘
```

**Click Tile → Level 3**

---

### **Level 3: Subscription Recognition Schedule**
**Visual:** Gantt Chart (Monthly Recognition Timeline)

| Subscription | Customer | Product | Term | Monthly Expected | Variance | Status |
|--------------|----------|---------|------|------------------|----------|--------|
| SUB-2847 | GlobalBank | Splunk | 36mo | $4,200 | -$280 (6.7%) 🔴 | Active |
| SUB-2799 | MegaCorp | Splunk | 24mo | $3,850 | +$115 (3.0%) 🟡 | Active |

**Gantt View (Below Table):**
```
Oct │████████████  ← SUB-2847 (Expected)
    │█████████░░░  ← Actual (-6.7%)
Nov │████████████
    │████████████  ← On track
```

**Click Row → Level 4**

---

### **Level 4: Recognition Variance Root Cause**
**Visual:** Reconciliation Breakdown + Timeline

```
Subscription: SUB-2847 (GlobalBank - Splunk)
Contract Value: $151,200 (36 months)
Monthly Expected: $4,200
September Actual: $3,920 (-$280)

📊 Variance Breakdown:
 • Base Recognition: $4,200 ✓
 • Amendment Adjustment: -$350 🔴
   (Contraction on 09/15: -15 licenses)
 • Timing Delay: +$70
   (Amendment processed late, proration)
 • Net Variance: -$280 (6.7%)

📅 Timeline:
 09/01 - Month starts, schedule: $4,200
 09/15 - Amendment submitted (contraction)
 09/18 - Amendment approved
 09/22 - Revenue schedule updated
 09/30 - Actual recognized: $3,920

⚙️ System Notes:
 • Amendment type: Contraction (15 → 12 licenses)
 • Pro-ration applied: $70 credit
 • Recognition schedule auto-adjusted ✓

🔗 Related:
 [View Amendment #AM-2947] [View Original Contract] 
 [View Full Recognition Schedule]
```

---

## **6. Deferred Revenue Balance**

### **Level 1: Deferred Revenue Trend + Burn Rate**
**Business Story:** *Is our backlog healthy?*

**Visual:** Area Chart + KPI Cards

```
$M        Deferred Balance
 5  │        ░░░░░░░
    │      ░░░░░░░░░░  ← $4.8M (Oct)
 3  │    ░░░░░░░░░░░░
    │  ░░░░░░░░░░░░░░
 1  └──────────────────
     May Jun Jul Aug Sep Oct
     
Current: $4.8M │ MoM: +8% │ Burn Rate: $1.2M/mo
```

**Filters:** Product, Contract Term, Customer Segment

---

### **Level 2: Deferred Revenue Composition**
**Business Story:** *What's driving deferred balance?*

**Visual:** Stacked Bar (by Product) + Table

```
$M  │ Splunk ████
 5  │ Meraki ████
    │ Duo    ████
 3  │ Others ████
    │
 0  └──────────────
     Q2  Q3  Q4 
```

**Table:**
| Product | Deferred Balance | Recognized (YTD) | Remaining | Avg Term |
|---------|------------------|------------------|-----------|----------|
| Splunk | $1.8M | $3.2M | 14mo | 28mo |
| Meraki | $1.5M | $2.8M | 16mo | 24mo |

---

### **Level 3: Subscription-Level Deferred Schedule**
**Visual:** Table with Mini Charts

| Subscription | Customer | Product | Total Contract | Recognized | Deferred | Months Left | Trend |
|--------------|----------|---------|----------------|------------|----------|-------------|-------|
| SUB-2847 | GlobalBank | Splunk | $151K | $48K | $103K | 24 | ▃▄▅▆██ |
| SUB-2799 | MegaCorp | Meraki | $88K | $52K | $36K | 12 | ▄▅▆███ |

**Click Row → Level 4**

---

### **Level 4: Full Recognition Waterfall**
**Visual:** Waterfall Chart + Monthly Detail Table

```
Subscription: SUB-2847 (GlobalBank - Splunk)
Total Contract Value: $151,200 (36 months)

Waterfall:
$151K ├─ Recognized (12mo): $48K ███████░░░░░░░░░
      ├─ Current Period: $4.2K ░█░░░░░░░░░░░░░
      └─ Deferred (24mo): $103K ░░░░░░░████████

Monthly Schedule:
| Month | Expected | Recognized | Remaining | Status |
|-------|----------|------------|-----------|--------|
| Oct'25| $4,200 | $0 | $103K | ⏳ Active |
| Nov'25| $4,200 | $0 | $98.8K | Scheduled |
| ...   | ...    | ... | ... | ... |
| Sep'28| $4,200 | $0 | $4.2K | Scheduled |

🔗 Contract: [View Full Contract] [View Amendments]
```

---

## **7. Quote Win Rate**

### **Level 1: Win Rate Funnel + Trend**
**Business Story:** *How are we converting quotes?*

**Visual:** Funnel + Line Chart

```
Funnel (Last 30 Days):
 120 Quotes Sent
   ↓ 78 Accepted (65%) ✅
   ↓ 32 Declined (27%)
   ↓ 10 Expired (8%)

Win Rate Trend:
 %
 70 │      ●───●
    │    ●       ●
 60 │  ●           ●─ (Current: 65%)
    │
 50 └──────────────
     May Jun Jul Aug Sep Oct
     Target: 65% ────────
```

**Filters:** Quote Type, Product, Deal Size, Sales Rep

---

### **Level 2: Win Rate by Segment/Product**
**Business Story:** *Where are we winning/losing?*

**Visual:** Heatmap

```
          │ New Biz │ Renewal │ Expansion │ Upsell │
──────────┼─────────┼─────────┼───────────┼────────┤
Meraki    │  72% ✅ │  88% ✅ │   68% ✅  │  55% 🟡│
Duo       │  65% ✅ │  82% ✅ │   62% ✅  │  48% 🔴│
Splunk    │  58% 🟡 │  79% ✅ │   71% ✅  │  52% 🟡│
Umbrella  │  61% ✅ │  85% ✅ │   64% ✅  │  59% ✅│
```

**Insight:**
```
🔴 Duo-Upsell: 48% (Below 55% threshold)
💡 Price sensitivity in upsell motion
```

---

### **Level 3: Lost Quote Analysis**
**Visual:** Table with Loss Reasons

| Quote ID | Customer | Product | Value | Loss Reason | Days Open | Rep |
|----------|----------|---------|-------|-------------|-----------|-----|
| #2851 | TechStart | Duo | $48K | Price 🔴 | 18 | Sarah M |
| #2839 | Acme | Splunk | $125K | Competitor | 22 | John D |

**Loss Reason Distribution (Right Panel):**
```
Price: 12 (38%) ████████
Timing: 8 (25%) ██████
Competitor: 7 (22%) █████
Budget: 5 (15%) ████
```

**Click Row → Level 4**

---

### **Level 4: Quote Loss Autopsy**
**Visual:** Timeline + Competitor Comparison

```
Quote #2851: TechStart - Duo Expansion
Value: $48,000 (150 additional licenses)
Status: Lost to Competitor

📅 Quote Journey:
 08/15 - Quote sent ($48K, 15% discount)
 08/18 - Customer requested better pricing
 08/20 - Revised quote ($45K, 20% discount)
 08/25 - Customer reviewing alternatives
 08/30 - Lost to Okta ($42K competitor price)

💰 Pricing Breakdown:
 Our Quote: $45K ($300/license)
 Competitor: $42K ($280/license)
 Delta: -$3K (6.7% cheaper)

📊 Context:
 • Customer ARR: $85K (Existing: Duo Essentials)
 • Health Score: 78/100 ✅
 • Utilization: 92% (Strong usage)
 • Renewal Date: 2026-01-15
 
🚨 Loss Factors:
 • Price-sensitive customer (SMB)
 • Competitor bundled with SSO (their core product)
 • Our response time: 5 days (Slow)

📝 Rep Notes (Sarah M):
 "Customer loved product, usage high. Okta offered 
  bundle deal with existing SSO. Price match would 
  have required VP approval (7+ days). Lost on speed."

🔗 Actions:
 [Add to Watch List] [Competitor Intel] [Win-Back Campaign]
```

---

## **8. Renewal Quote Velocity**

### **Level 1: Velocity Funnel + At-Risk Renewals**
**Business Story:** *Are we quoting renewals on time?*

**Visual:** Gauge + Alert Table

```
Renewal Quote Velocity: 11 days ✅ (Target: ≤14)

Upcoming Renewals (Next 90 Days):
| Days to Renewal | Quotes Sent | Not Sent | At Risk |
|-----------------|-------------|----------|---------|
| 0-30 days | 12 ✅ | 3 🔴 | High |
| 31-60 days | 18 ✅ | 2 🟡 | Medium |
| 61-90 days | 22 ✅ | 0 ✅ | Low |
```

**Filters:** Product, Customer Segment, CSM Owner

---

### **Level 2: Renewal Pipeline by Stage**
**Business Story:** *Which renewals need attention?*

**Visual:** Kanban Board (Renewal Stages)

```
┌─ Trigger (90d) ─┬─ Quote Sent ─┬─ Under Review ─┬─ Won ─┬─ At Risk ─┐
│ 8 accounts      │ 15 accounts  │ 7 accounts     │ 12    │ 3 🔴      │
│ $480K ARR       │ $820K ARR    │ $385K ARR      │ $640K │ $185K     │
└─────────────────┴──────────────┴────────────────┴───────┴───────────┘
```

**Click Column → Level 3**

---

### **Level 3: At-Risk Renewal Details**
**Visual:** Table with Health Signals

| Customer | Product | ARR | Renewal Date | Quote Sent? | Days to Quote | Health | Utilization |
|----------|---------|-----|--------------|-------------|---------------|--------|-------------|
| GlobalTech | Duo | $68K | 2025-11-15 | ❌ No | - | 67 🟡 | 82% |
| Acme Corp | Meraki | $52K | 2025-11-22 | ✅ Yes | 8d | 55 🔴 | 48% 🔴 |

**Click Row → Level 4**

---

### **Level 4: Renewal Playbook View**
**Visual:** Split Panel (Customer Context + Action Plan)

```
Customer: Acme Corp
Product: Meraki (Network Management)
ARR: $52,000 | Contract End: 2025-11-22 (42 days)
Quote Sent: 10/02 (8 days ago) | Status: Under Review

Left Panel - Risk Signals:
🔴 Health Score: 55/100
 • Support tickets: 7 (3 P1)
 • Last CSM touch: 28 days ago
 • Utilization: 48% (Below 60% threshold)
 • NPS: 6 (Detractor)

🟡 Engagement:
 • Login frequency: 2x/week (Down from 5x)
 • Feature adoption: 3/8 modules
 • Training sessions: 0 (Recommended: 2)

✅ Positive Signals:
 • Payment history: 100% on-time
 • Executive sponsor: Active
 • Recent expansion inquiry (Q2)

Right Panel - Action Plan:
📋 Recommended Actions (Next 7 Days):
 ☐ CSM to schedule renewal discussion (Priority 1)
 ☐ Offer utilization health check (Free)
 ☐ Address open P1 tickets (Support escalation)
 ☐ Send renewal quote follow-up (Finance team)
 ☐ Schedule executive alignment call

💬 Communication Log:
 10/02 - Quote sent to Finance contact
 10/05 - No response, follow-up email sent
 10/09 - CFO replied: "Under review"
 
🎯 Win Strategy:
 • Bundle training + onboarding refresh
 • Offer 10% early-renewal discount
 • Highlight ROI from existing usage
 • Address underutilization with action plan

🔗 Actions:
 [Schedule CSM Call] [Send Follow-Up] [Update Forecast]
 [View Full Customer 360]
```

---

## **9. Overdue Invoices Amount**

### **Level 1: Overdue AR Aging + Trend**
**Business Story:** *How much is overdue and is it growing?*

**Visual:** Stacked Area Chart + KPI Cards

```
$K        Overdue AR Balance
 200 │        ▓▓▓ 90+ days
     │      ▒▒▒▒▒ 60-90 days
 100 │    ░░░░░░░ 30-60 days
     │  ░░░░░░░░░
   0 └──────────────────
      May Jun Jul Aug Sep Oct
      
Current: $182K │ 90+: $45K 🔴 │ Customers: 18
```

**Filters:** Customer Segment, Geography, Payment Terms

---

### **Level 2: Customer Concentration Analysis**
**Business Story:** *Which customers owe the most?*

**Visual:** Pareto Chart (80/20 Rule)

```
$K  Customer         Overdue    Cumulative %
 50 ████ MegaCorp    $48K       26%
 40 ███ GlobalTech   $35K       45%
 30 ██ TechStart     $28K       60%
 20 ██ Others (15)   $71K       100%
    └──────────────────────────────
        
📊 Insight: Top 3 customers = 60% of overdue balance
```

**Click Bar → Level 3**

---

### **Level 3: Customer Overdue Invoice List**
**Visual:** Table with Priority Scoring

| Customer | Total Overdue | Invoices | Oldest | Days | Priority | CSM | Action |
|----------|---------------|----------|--------|------|----------|-----|--------|
| MegaCorp | $48K | 2 | #2799 | 68d 🔴 | High | Jennifer L | [Escalate] |
| GlobalTech | $35K | 3 | #2847 | 52d 🔴 | Medium | Tom K | [Call] |

**Priority Logic:**
```
High: Amount >$40K OR Days >60 OR Health <60
Medium: Amount $20-40K OR Days 30-60
Low: Amount <$20K AND Days <30
```

**Click Row → Level 4**

---

### **Level 4: Collections Dashboard (Per Customer)**
**Visual:** 3-Column Layout

```
┌─ Column 1: Invoice Detail ──────────────────────┐
│ Customer: MegaCorp                              │
│ Total Overdue: $48,000 (2 invoices)            │
│                                                 │
│ Invoice #2799: $28,000                          │
│  • Issue Date: 08/05/2025                       │
│  • Due Date: 09/04/2025 (Net 30)                │
│  • Days Overdue: 38 days 🔴                     │
│  • Status: Disputed (Pricing error claimed)     │
│                                                 │
│ Invoice #2851: $20,000                          │
│  • Issue Date: 08/20/2025                       │
│  • Due Date: 09/19/2025                         │
│  • Days Overdue: 23 days 🟡                     │
│  • Status: Under finance review                 │
└─────────────────────────────────────────────────┘

┌─ Column 2: Collection Activity ─────────────────┐
│ 📞 Collection Attempts:                         │
│  10/01 - Email to AP (No response)              │
│  10/05 - Phone call (Voicemail)                 │
│  10/08 - Email to Finance lead (Opened)         │
│  10/10 - CSM escalation requested               │
│                                                 │
│ 💬 Dispute Notes (Invoice #2799):               │
│  "Customer claims pricing doesn't match quote.  │
│   Finance investigating. Expect resolution by    │
│   10/15. Payment on hold until resolved."       │
│                                                 │
│ 📅 Next Steps:                                  │
│  • 10/12 - Follow-up with Finance lead          │
│  • 10/15 - Dispute resolution deadline          │
│  • 10/18 - Executive escalation (if unresolved) │
└─────────────────────────────────────────────────┘

┌─ Column 3: Customer Risk Context ───────────────┐
│ 🏢 Account Profile:                             │
│  • ARR: $340K (Enterprise)                      │
│  • Products: 4 (Meraki, Duo, Splunk, Umbrella)  │
│  • Health Score: 72/100 🟡                      │
│  • Renewal Date: 2026-03-15 (153 days)          │
│  • CSM: Jennifer L                              │
│                                                 │
│ 💰 Payment History:                             │
│  • Avg Days to Pay: 48 (Target: 30)             │
│  • On-Time Rate: 60% (Last 12 invoices)         │
│  • Previous Disputes: 1 (Resolved in 12 days)   │
│                                                 │
│ ⚠️ Risk Assessment:                             │
│  • Collections risk: Medium                     │
│  • Renewal risk: Low-Medium                     │
│  • Relationship: Strong (Executive sponsor)     │
│                                                 │
│ 🔗 Quick Actions:                               │
│  [Log Call] [Send Payment Link] [Create Task]   │
│  [Escalate to CSM] [Payment Plan] [Write-Off]   │
└─────────────────────────────────────────────────┘
```

---

## **10. Expansion ARR Contribution** (Bonus KPI)

### **Level 1: Expansion Mix + Trend**
**Business Story:** *Is expansion driving growth?*

**Visual:** Stacked Area Chart + Waterfall

```
ARR Contribution (% of Total New ARR):
 %
 40 │     ▓▓▓ Expansion
    │   ▒▒▒▒▒ Upsell
 20 │ ░░░░░░░ Cross-sell
    │░░░░░░░░░
  0 └──────────────
     Q1  Q2  Q3  Q4

Current Mix: Expansion 28% | Target: 20-30% ✅
```

---

### **Level 2: Expansion by Product/Motion**
**Business Story:** *Which products/motions drive expansion?*

**Visual:** Grouped Bar Chart

```
ARR   │ Upsell  Cross-sell  Total
$K    │
 150  │ ████    
      │ ████    ████        Splunk: $285K
 100  │ ████    ████   
      │ ████    ████        Meraki: $195K
  50  │ ████    ████
      │ ████    ████        Duo: $140K
      └─────────────────────────────
```

**Filters:** Customer Segment, CSM Owner, Expansion Trigger

---

### **Level 3: Expansion Opportunity Pipeline**
**Visual:** Table with Propensity Scores

| Customer | Current ARR | Expansion Type | Projected ARR | Propensity | Stage |
|----------|-------------|----------------|---------------|------------|-------|
| GlobalBank | $125K | Upsell (Splunk) | +$45K | 85% 🟢 | Negotiation |
| MegaCorp | $340K | Cross-sell (ThousandEyes) | +$80K | 72% 🟢 | Discovery |

**Click Row → Level 4**

---

### **Level 4: Expansion Opportunity Detail**
**Visual:** Opportunity Scorecard

```
Customer: GlobalBank
Current ARR: $125,000 (Splunk Enterprise, 100 licenses)
Expansion: Upsell to 150 licenses (+$45K ARR)
Propensity: 85% (High confidence)

📊 Expansion Signals:
✅ Utilization: 94% (Above 85% threshold)
✅ Recent growth: +15% team size
✅ Feature requests: Advanced analytics module
✅ Budget cycle: Q4 refresh approved
✅ Champion engagement: High (C-level sponsor)

🎯 Business Case:
 • Current capacity: 100 licenses (94 active users)
 • Headroom: 6 licenses (Risk of overage)
 • Recommended: 150 licenses (Future-proofs 18mo)
 • Value: Avoid overage fees ($8K penalty risk)

💰 Financial Model:
 Current: $125K/year ($1,250/license)
 Expansion: +$45K/year ($300/license incremental)
 Total New ARR: $170K/year
 Contract: 24-month commit (Renewal alignment)

📅 Timeline:
 09/15 - Usage threshold triggered alert
 09/20 - CSM outreach scheduled
 09/25 - Discovery call completed
 10/01 - Proposal sent ($45K, 15% discount)
 10/08 - Finance review (In progress)
 10/15 - Target close date

🔗 Actions:
 [View Utilization Trend] [Send Follow-Up] [Update Forecast]
```

---

## Universal Drill-Through Paths

### Cross-KPI Navigation Examples:

**Path 1: Collections → Health → Utilization**
```
Overdue Invoice (L3) → [View Customer 360] → Health Score (L2) → 
Utilization Dashboard → Low Usage Alert (L3)
```

**Path 2: Quote Win Rate → Renewal Velocity**
```
Lost Quote (L4) → Customer: Acme Corp → [Check Renewal Status] → 
Renewal Pipeline (L3) → Renewal Risk Assessment (L4)
```

**Path 3: Cycle Time → Approval Bottleneck**
```
Slow Quote-to-Cash (L2) → Payment Stage (L2) → 
Customer AR Detail (L3) → Quote Approval History → 
Approval Queue (L3 from KPI 2)
```

---

## Implementation Notes

### Data Refresh Cadence:
- **Level 0 (KPI Cards):** Every 15 minutes
- **Level 1-2:** Every 5 minutes (on demand)
- **Level 3-4:** Real-time (no caching)

### Performance Optimization:
- Pre-aggregate Level 1-2 data nightly
- Index on: `customer_id`, `product_family`, `quote_date`, `invoice_date`
- Partition `utilization_history` by month
- Use lazy loading for Level 3-4 (load on click)

### User Permissions:
- **CSM/Sales:** View all levels, limited to assigned accounts
- **Finance:** Full access to AR/billing KPIs
- **Executives:** View Levels 0-2 only (summary view)
- **Ops:** Full access, export capabilities

---

## Visual Design Principles Applied:

1. **Minimal Text:** Max 2-3 insight bullets per level
2. **Progressive Disclosure:** Each level reveals "why" behind the metric
3. **Action-Oriented:** Every Level 4 includes actionable next steps
4. **Consistent Color:** Red (>target), Yellow (near target), Green (on target)
5. **Contextual Filters:** Filters persist across drill-down levels
6. **Breadcrumbs:** Always show: `KPI Name > Level 1 > Level 2 > Level 3 > Level 4`

---

**Total Framework:** 9 KPIs × 4 Levels = 36 unique drill-down views, each with specific visual recommendations and business narrative justification.