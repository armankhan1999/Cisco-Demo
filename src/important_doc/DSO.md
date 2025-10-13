# DSO (Days Sales Outstanding) - 3-Level Drill-Down Structure

## **Level 1: Product-Line DSO Comparison with AR Aging Matrix**

### Primary View
- **Side-by-side comparison** of DSO across 5 products (Meraki, Duo, Umbrella, ThousandEyes, Splunk)
- **Matrix/Table Format:**

| Product | Current DSO | AR Aging Buckets → | 0-30 Days | 31-60 Days | 61-90 Days | 90+ Days | Trend |
|---------|-------------|---------------------|-----------|------------|------------|----------|-------|
| Meraki | 45 days | Amount/$% | $X / Y% | $X / Y% | $X / Y% | $X / Y% | ↑/↓ |
| Duo | 38 days | Amount/$% | $X / Y% | $X / Y% | $X / Y% | $X / Y% | ↑/↓ |

**Key Metrics per Product:**
- Current DSO value
- AR distribution across aging buckets
- Month-over-month trend indicator
- Red flags for 90+ day buckets

---

## **Level 2: Customer Segment & Geography Breakdown**

**Drill-Down Trigger:** Click on any product row

### View Components
- **Segment Split:**
  - Enterprise vs. Commercial vs. SMB DSO
  - Geography: Americas, EMEA, APAC, Japan
  
- **Enhanced Table:**

| Customer Segment | DSO | Invoice Volume | Avg Invoice Value | Primary Aging Bucket | Top Delayed Customers (count) |
|------------------|-----|----------------|-------------------|----------------------|-------------------------------|
| Enterprise | 52 days | 450 | $125K | 61-90 Days | 12 |
| Commercial | 41 days | 1,200 | $35K | 31-60 Days | 8 |

**Additional Context:**
- Payment terms distribution (Net 30, Net 45, Net 60)
- Invoice dispute rate by segment
- Collections efficiency ratio

---

## **Level 3: Transactional Invoice Detail & Action View**

**Drill-Down Trigger:** Click on specific segment/geography combination

### Actionable Invoice List

| Invoice # | Customer Name | Days Outstanding | Amount | Aging Bucket | Payment Terms | Collections Status | Assigned To | Action |
|-----------|---------------|------------------|--------|--------------|---------------|-------------------|-------------|---------|
| INV-12345 | Acme Corp | 85 days | $250K | 61-90 Days | Net 45 | Follow-up Pending | J. Smith | [Contact] [Escalate] |

**Action Capabilities:**
- Filter by collections owner
- Sort by amount/days outstanding
- Bulk actions for follow-up campaigns
- Direct links to:
  - Customer billing contact
  - Original order details
  - Payment history
  - Dispute tickets (if any)

**Root Cause Indicators:**
- Invoice accuracy issues
- PO matching delays
- Customer dispute flags
- Payment portal access problems

---

## **Storyline Logic**

**Level 1 → 2:** "Which product has DSO issues?" → "Is it concentrated in specific customer segments or regions?"

**Level 2 → 3:** "Which segment is problematic?" → "What are the specific invoices stuck and who needs to act?"

This structure enables Commercial Operations teams to move from **strategic oversight** (product-level DSO health) → **diagnostic analysis** (where delays concentrate) → **tactical execution** (specific invoices requiring collection action).