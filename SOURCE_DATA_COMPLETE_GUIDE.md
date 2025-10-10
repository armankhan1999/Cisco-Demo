# 📁 Complete Source Data Folder Guide

## Overview: What Data Exists in @source_data/

This document provides a **complete breakdown** of every file and folder in the `@source_data/` directory.

---

## 📊 Quick Stats

```
Total Folders: 6
Total Files: 67+
Total Size: ~10 MB
Total Records: 450,000+

Key Datasets:
├── 50 Accounts (with 12-month history)
├── 4,062 Subscriptions
├── 2,785 Licenses
├── 502 Revenue Movements
├── 445,240 Usage Events
└── 1,730 Churn Predictions
```

---

## 📁 Root Level Files

### 1. **accounts.json** (3.2 MB, 50 accounts)
**Purpose:** Main account data with complete 12-month timeline

**Structure:**
```json
[
  {
    "account": {
      "id": "CUST_000001",
      "name": "TechCorp Industries",
      "tier": "Enterprise",                // Strategic/Enterprise/Commercial/SMB
      "industry": "Technology",             // 8 industries
      "arr": 1522871,                       // Total ARR
      "health_score": 31,                   // 0-100 (pre-calculated)
      "renewal_risk_score": 62,
      "csm_id": "CSM_001",
      "geography": {
        "theater": "EMEA",                  // EMEA/AMER/APAC
        "region": "Central",
        "country": "Switzerland"
      },
      "mrr": 126905.92,
      "starting_arr": 1309450.83,
      "expansion_arr": 0,
      "churn_arr": 0,
      "contraction_arr": 0,
      "payment_terms": "Net 45",
      "billing_frequency": "quarterly"
    },
    "timeline": [                           // 12-month history
      {
        "month": 10,
        "date": "2024-10-01T18:30:00.000Z",
        "health_score": 94,
        "usage_percentage": 92,
        "engagement_events": [...],
        "business_events": [...],
        "support_activity": {...},
        "expansion_signals": [...]
      }
    ]
  }
]
```

**Key Fields:**
- ✅ `health_score` (0-100): Pre-calculated customer health
- ✅ `arr`: Annual Recurring Revenue
- ✅ `tier`: Strategic/Enterprise/Commercial/SMB
- ✅ `timeline[]`: Complete 12-month history per account

**Used By:**
- Portfolio Health Score KPI
- At-Risk ARR KPI
- Customer Engagement Score KPI
- Health Distribution table
- Critical Actions alerts

---

### 2. **hero-accounts.json** (605 KB, 5 accounts)
**Purpose:** Detailed showcase accounts with extended history

**Contains:** 5 strategic accounts:
1. TechCorp Industries
2. MedSecure Systems
3. Global Financial Partners
4. Advanced Manufacturing Co
5. InnovateTech Solutions

**Use Case:** Demo scenarios, detailed drill-downs

---

### 3. **generation-report.json** (11 KB)
**Purpose:** Metadata about data generation

**Contains:**
- Total accounts: 50
- Total ARR: $42.2M
- Generation date: 2025-10-02
- Seed: 99999
- Distribution by tier/industry/geography

---

### 4. **accounts_new.json** (101 KB)
**Purpose:** Alternate account dataset (not used in current dashboard)

---

### 5. **accounts_older_version.json** (1.7 MB)
**Purpose:** Historical account data (archived)

---

### 6. **accounts.json.backup** (1.7 MB)
**Purpose:** Backup of accounts.json

---

## 📁 Folder: commercial_operations/

**Purpose:** Quote-to-Cash lifecycle data (Commercial Operations persona)

### Files in this folder:

#### 1. **subscriptions.json** (~500 KB, 4,062 records)
**Purpose:** Subscription lifecycle and renewal tracking

**Structure:**
```json
{
  "subscription_id": "SUB_CUST_000001_Duo_1",
  "customer_id": "CUST_000001",
  "product_family": "Duo",                  // Duo/Meraki/Umbrella/Thousand Eyes/Splunk
  "subscription_type": "new",               // new/renewal/expansion
  "subscription_status": "active",          // active/expired/cancelled
  "mrr": 798.75,
  "arr": 9585,                              // Real ARR value
  "quantity": 1065,
  "unit_price": 9,
  "billing_frequency": "annual",            // annual/monthly/quarterly
  "subscription_start_date": "2023-12-05",
  "subscription_end_date": "2025-02-25",
  "renewal_date": "2025-02-25",             // Key for renewal pipeline
  "renewal_status": "renewed",              // renewed/quoted/at_risk/lost
  "renewal_probability": 79.09,
  "churn_risk_score": 60.21,
  "auto_renew": true,
  "payment_terms": "Net 45"
}
```

**Used By:**
- GRR KPI
- Renewal Rate KPI
- Churn Rate KPI
- Time to Value KPI
- Renewal Pipeline table

---

#### 2. **licenses.json** (~300 KB, 2,785 records)
**Purpose:** License utilization and adoption tracking

**Structure:**
```json
{
  "license_id": "LIC_CUST_000001_Duo",
  "customer_id": "CUST_000001",
  "product_family": "Duo",
  "license_count": 1065,
  "utilization": 95,                        // 0-100% (KEY FOR UTILIZATION KPI)
  "adoption_stage": "Mature",               // Pilot/Early/Growing/Mature/Optimized/Declining
  "implementation_date": "2023-12-05",
  "renewal_date": "2025-02-25",
  "license_type": "subscription",
  "tier": "Advantage",
  "unit_price": 9,
  "annual_value": 9585,
  "utilization_trend": "decreasing",        // increasing/stable/decreasing
  "last_utilization_check": "2025-09-30"
}
```

**Used By:**
- Average Utilization Rate KPI
- Feature Adoption Rate KPI
- Time to Value KPI

---

#### 3. **revenue_movements.json** (~50 KB, 502 records)
**Purpose:** Track ARR changes (churn, expansion, contraction)

**Structure:**
```json
{
  "movement_id": "MOV_20241104_1",
  "customer_id": "CUST_000026",
  "subscription_id": "SUB_CUST_000026_Duo_97",
  "movement_type": "expansion",             // expansion/churn/contraction (KEY)
  "movement_category": "upsell",            // upsell/downsell/new_product/cancellation
  "arr_before": 1320,
  "arr_after": 1500.0,
  "arr_change": 180.0,                      // Positive for expansion, negative for churn
  "mrr_change": 15.0,
  "product_family": "Duo",
  "quantity_change": 30,
  "reason_code": "customer_requested",
  "reason_description": "Quantity Increase",
  "effective_date": "2024-11-04",           // When change occurred
  "triggered_by": "CSM",                    // CSM/Sales/Customer/System
  "related_quote_id": "QUO_20241104_AMD_002",
  "fiscal_year": 2024,
  "fiscal_quarter": "Q4",
  "fiscal_month": "2024-11"
}
```

**Movement Types:**
- **expansion:** ARR increase (upsell, new product)
- **churn:** Complete cancellation (ARR to $0)
- **contraction:** ARR decrease (downsell)

**Used By:**
- GRR KPI (churn + contraction)
- Churn Rate KPI

---

#### 4. **quotes.json**
**Purpose:** Quote generation and proposal tracking

**Contains:** Quote details, line items, approval workflow

---

#### 5. **orders.json**
**Purpose:** Order booking and fulfillment

**Contains:** Order details, product lines, fulfillment status

---

#### 6. **invoices.json**
**Purpose:** Invoice generation and tracking

**Contains:** Invoice details, line items, payment terms

---

#### 7. **payments.json**
**Purpose:** Payment processing and collections

**Contains:** Payment records, methods, dates, amounts

---

#### 8. **accounts_receivable.json**
**Purpose:** AR aging and DSO tracking

**Contains:** Outstanding invoices, aging buckets

---

#### 9. **amendments.json**
**Purpose:** Contract amendments and changes

**Contains:** Mid-term contract modifications

---

#### 10. **quote_line_items.json**
**Purpose:** Detailed quote line items

---

#### 11. **quote_to_cash_tracking.json**
**Purpose:** Quote-to-cash cycle metrics

---

#### 12. **revenue_recognition_schedule.json**
**Purpose:** Revenue recognition over time

---

#### 13. **utilization_alerts.json**
**Purpose:** License utilization alerts

**Structure:**
```json
{
  "alert_id": "ALERT_001",
  "license_id": "LIC_CUST_000001_Duo",
  "alert_type": "low_utilization",
  "severity": "High",
  "current_value": 45,
  "threshold_value": 75,
  "status": "open"
}
```

---

#### 14. **utilization_history.json**
**Purpose:** Historical utilization tracking

---

#### 15. **kpi_metrics.json**
**Purpose:** Pre-calculated KPI values for Commercial Ops

---

#### 16-21. **Documentation Files**
- COMMERCIAL_OPS_DRILL_DOWN_ARCHITECTURE.md
- KPI_CALCULATIONS.md
- GENERATION_SUMMARY.md
- generate_commercial_ops_data.py
- generate_all_data.py

---

## 📁 Folder: csm-data/

**Purpose:** Customer Success Management specific data

### Files in this folder:

#### 1. **qbr_tracking.json** (~30 KB)
**Purpose:** QBR (Quarterly Business Review) completion tracking

**Structure:**
```json
[
  {
    "tracking_period": "2025-Q3",
    "period_start": "2025-07-01",
    "period_end": "2025-09-30",
    "csm_id": "CSM_001",
    "csm_name": "Sarah Johnson",
    "by_tier": [
      {
        "tier": "Strategic",
        "qbr_frequency_days": 90,
        "total_accounts": 3,
        "compliant": 2,
        "overdue": 1,
        "completion_rate": 0.67,
        "accounts_needing_qbr": [
          {
            "account_id": "CUST_000004",
            "account_name": "Global Medical Network",
            "last_qbr_date": "2025-07-19",
            "days_since_last_qbr": 107,
            "days_overdue": 19,
            "arr": 4199901
          }
        ]
      }
    ],
    "qbr_history": [                        // ✅ ACTUAL QBR RECORDS
      {
        "qbr_id": "QBR_CUST_000036_Q3_2025",
        "account_id": "CUST_000036",
        "qbr_date": "2025-10-03",           // Real QBR date
        "status": "Completed",
        "generation_method": "Manual",
        "prep_time_hours": 5.3
      }
    ]
  }
]
```

**Used By:**
- QBR Completion Rate KPI
- Customer Engagement Score KPI
- Critical Actions (overdue QBRs)

---

#### 2. **churn_predictions.json** (~150 KB, 1,730 records)
**Purpose:** ML-based churn risk predictions

**Structure:**
```json
{
  "prediction_id": "CHURN_PRED_CUST_000002_20251009",
  "account_id": "CUST_000002",
  "account_name": "MedSecure Systems",
  "prediction_date": "2025-10-09",
  "model_version": "v2.3",
  "model_type": "Gradient Boosting + Time Series",
  "current_health_score": 78,
  "churn_probability": 0.85,                // 0-1 (ML prediction)
  "churn_probability_tier": "High",         // Low/Medium/High/Critical
  "estimated_churn_date": "2025-11-28",
  "estimated_days_to_churn": 61,
  "confidence_level": "LOW",                // LOW/MEDIUM/HIGH
  "confidence_score": 0.71,
  "velocity_metrics": {
    "health_velocity": -0.32,
    "health_trend": "Improving",
    "usage_velocity": -0.73,
    "engagement_velocity": 0.08
  },
  "risk_factors": [
    {
      "factor": "Health Decline",
      "severity": "High",
      "description": "Health declining at -1.2 points/day",
      "contribution_to_risk": 0.23
    }
  ],
  "arr_at_risk": 3627162,
  "recommended_action": "Schedule intervention call",
  "contract_end_date": "2026-05-14"
}
```

**Used For:**
- Critical Actions alerts
- At-Risk ARR validation
- Intervention playbooks

---

#### 3. **champion_departure_alerts.json**
**Purpose:** Track when key stakeholders leave customer organizations

---

#### 4. **expansion_handoff_tracking.json**
**Purpose:** Track handoffs from CSM to Sales for expansion opportunities

---

#### 5. **expansion_handoff_recommendations.json**
**Purpose:** AI-recommended expansion opportunities

---

#### 6. **white_space_analysis.json**
**Purpose:** Identify product gaps (products customer doesn't have)

---

#### 7. **product_bundle_recommendations.json**
**Purpose:** Recommended product bundles for cross-sell

---

#### 8. **multi_product_readiness.json**
**Purpose:** Customer readiness scores for additional products

---

#### 9. **intervention_playbooks.json**
**Purpose:** Recommended intervention strategies for at-risk accounts

---

#### 10. **qbr_value_stories.json**
**Purpose:** Value realization stories for QBR presentations

---

#### 11. **stakeholders_enhanced.json**
**Purpose:** Enhanced stakeholder information with influence mapping

---

## 📁 Folder: master-data/

**Purpose:** Dimensional/reference data (master data tables)

### Files in this folder:

#### 1. **customers.json**
**Purpose:** Customer master data (dimensional)

---

#### 2. **products.json**
**Purpose:** Product catalog

**Contains:** 5 main product families:
- Duo (Identity & Access Management)
- Meraki (Network Infrastructure)
- Umbrella (Cloud Security)
- Thousand Eyes (Network Intelligence)
- Splunk (Observability)

---

#### 3. **licenses.json**
**Purpose:** License master data

---

#### 4. **licenses_older_version.json**
**Purpose:** Historical license data

---

#### 5. **contracts.json**
**Purpose:** Contract master data

---

#### 6. **stakeholders.json**
**Purpose:** Contact/stakeholder information

---

#### 7. **csms.json**
**Purpose:** Customer Success Manager profiles

---

#### 8. **users.json**
**Purpose:** User master data (2,579 users)

---

#### 9. **product-performance.json**
**Purpose:** Product-level performance metrics

---

## 📁 Folder: health-history/

**Purpose:** Time-series health score tracking

### Files in this folder:

- **health-history-2023-12.json**
- **health-history-2024-01.json**
- **health-history-2024-02.json**
- **health-history-2024-03.json**

**Purpose:** Monthly health score snapshots for trend analysis

---

## 📁 Folder: usage-events/

**Purpose:** Product usage telemetry (445,240 events)

### Files in this folder (45 files):

- **usage-events-2024-10.json** (October 2024)
- **usage-events-2024-11.json** (November 2024)
- **usage-events-2024-12.json** (December 2024)
- **usage-events-2025-01.json** (January 2025)
- ... (monthly files)

**Structure:**
```json
{
  "event_id": "EVT_001",
  "customer_id": "CUST_000001",
  "user_id": "USER_001",
  "product_family": "Duo",
  "event_type": "login",
  "event_date": "2024-10-15T10:30:00Z",
  "feature": "Multi-Factor Authentication",
  "session_duration": 3600
}
```

**Use Case:** Feature adoption analysis, usage patterns, engagement scoring

---

## 📁 Folder: sales-expansion-data/

**Purpose:** Sales expansion and competitive intelligence

### Files in this folder:

#### 1. **expansion-opportunities.json**
**Purpose:** Identified expansion opportunities

---

#### 2. **expansion-pipeline-tracking.json**
**Purpose:** Track expansion deals through pipeline

---

#### 3. **expansion-success-stories.json**
**Purpose:** Historical expansion wins for playbook development

---

#### 4. **expansion-triggers.json**
**Purpose:** Events that trigger expansion opportunities

---

#### 5. **competitive-intelligence.json**
**Purpose:** Competitor analysis and win/loss data

---

#### 6. **lookalike-analysis.json**
**Purpose:** ML-based lookalike customer analysis

---

## 🔍 Data Relationships

### Primary Keys & Relationships

```
accounts.json
  └── account.id (CUST_000001)
       ↓
       ├── subscriptions.json (customer_id)
       ├── licenses.json (customer_id)
       ├── revenue_movements.json (customer_id)
       ├── qbr_tracking.json → qbr_history (account_id)
       ├── churn_predictions.json (account_id)
       └── usage-events/*.json (customer_id)

subscriptions.json
  └── subscription_id (SUB_CUST_000001_Duo_1)
       ↓
       ├── revenue_movements.json (subscription_id)
       └── licenses.json (license_id references)

licenses.json
  └── license_id (LIC_CUST_000001_Duo)
       ↓
       └── utilization_alerts.json (license_id)
```

---

## 📊 Data Quality & Characteristics

### Deterministic Generation
- **Seed:** 99999
- **Repeatability:** 100% deterministic
- **Regeneration:** `npm run generate:data -- --seed=99999`

### Data Distribution

**By Tier:**
- Strategic: 5 accounts (10%)
- Enterprise: 13 accounts (26%)
- Commercial: 29 accounts (58%)
- SMB: 3 accounts (6%)

**By Industry:**
- Technology: 6 accounts
- Healthcare: 6 accounts
- Financial Services: 10 accounts
- Manufacturing: 4 accounts
- Energy: 6 accounts
- Education: 7 accounts
- Retail: 4 accounts
- Government: 7 accounts

**By Geography:**
- AMER: 21 accounts (42%)
- EMEA: 19 accounts (38%)
- APAC: 10 accounts (20%)

---

## ✅ Summary

**Total Data Files:** 67+  
**Total Size:** ~10 MB  
**Total Records:** 450,000+  
**Key Accounts:** 50  
**Total ARR:** $42,213,318  
**Deterministic:** Yes (seed: 99999)

**Primary Files Used by CSM Dashboard:**
1. ✅ accounts.json
2. ✅ subscriptions.json
3. ✅ licenses.json
4. ✅ revenue_movements.json
5. ✅ qbr_tracking.json
6. ✅ churn_predictions.json

**Status:** 🟢 **ALL DATA VERIFIED AND DOCUMENTED**

---

**Last Updated:** October 10, 2025  
**Documentation Status:** Complete

