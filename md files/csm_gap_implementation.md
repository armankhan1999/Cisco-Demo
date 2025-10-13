# CSM Dashboard Gap Implementation Guide
## Complete JSON Field Specifications & Dashboard Mapping

**Document Version:** 1.0  
**Date:** October 9, 2025  
**Project:** DynPro Cisco Analytics Platform  
**Scope:** 11 CSM Dashboard Gaps

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [JSON Enhancement vs. New Files](#json-enhancement-vs-new-files)
3. [Gap 1: Intervention Playbooks](#gap-1-intervention-playbooks)
4. [Gap 2: QBR Value Story Generator](#gap-2-qbr-value-story-generator)
5. [Gap 3: Time to Churn Estimate](#gap-3-time-to-churn-estimate)
6. [Gap 4: Champion Departure Impact Score](#gap-4-champion-departure-impact-score)
7. [Gap 5: Expansion Handoff Recommendations](#gap-5-expansion-handoff-recommendations)
8. [Gap 6: Expansion Handoff Success Rate](#gap-6-expansion-handoff-success-rate)
9. [Gap 7: White-Space ARR Potential](#gap-7-white-space-arr-potential)
10. [Gap 8: Multi-Product Readiness Score](#gap-8-multi-product-readiness-score)
11. [Gap 9: Product Bundle Recommendations](#gap-9-product-bundle-recommendations)
12. [Gap 10: QBR Completion Rate by Tier](#gap-10-qbr-completion-rate-by-tier)
13. [Gap 11: Champion Tenure Tracking](#gap-11-champion-tenure-tracking)
14. [Complete JSON Relationship Diagram](#complete-json-relationship-diagram)
15. [Dashboard Usage Mapping](#dashboard-usage-mapping)
16. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 Executive Summary

### Current State
- **CSM Dashboard Completion:** 88% complete with 50+ operational KPIs
- **Existing JSON Files:** 5 core files (accounts.json, stakeholders.json, contracts.json, users.json, licenses.json)
- **Gaps Identified:** 11 true CSM gaps requiring implementation

### Required Changes

#### Existing JSON Enhancements
| JSON File | Fields to Add | Gap # |
|-----------|---------------|-------|
| **stakeholders.json** | 5 new fields (tenure tracking) | Gap 11 |

**Total Existing JSONs to Modify:** 1

#### New JSON Files Required
| # | JSON File Name | Primary Purpose | Size Estimate |
|---|----------------|-----------------|---------------|
| 1 | `intervention_playbooks.json` | Prescriptive action steps for alerts | Medium |
| 2 | `qbr_value_stories.json` | Auto-generated QBR value summaries | Large |
| 3 | `churn_predictions.json` | ML-powered churn time estimates | Medium |
| 4 | `champion_departure_alerts.json` | Stakeholder departure impact scoring | Medium |
| 5 | `expansion_handoff_recommendations.json` | Expansion readiness scoring | Medium |
| 6 | `expansion_handoff_tracking.json` | Handoff workflow tracking | Large |
| 7 | `white_space_analysis.json` | Product fit & ARR potential | Medium |
| 8 | `multi_product_readiness.json` | Composite readiness scoring | Small |
| 9 | `product_bundle_recommendations.json` | Product pairing analysis | Medium |
| 10 | `qbr_tracking.json` | QBR completion tracking by tier | Medium |

**Total New JSON Files:** 10

### Implementation Timeline
- **Phase 1 (Weeks 1-4):** Gaps 1-2 (Critical)
- **Phase 2 (Weeks 5-8):** Gaps 3-7 (High Priority)
- **Phase 3 (Weeks 9-12):** Gaps 8-11 (Medium Priority)
- **Total Effort:** 280 hours (~7 weeks for 1 developer)

---

## 📊 JSON Enhancement vs. New Files

### ✅ Existing JSON Enhancement Required

#### **stakeholders.json** - ADD 5 New Fields

**Current Structure (Keep All Existing Fields):**
```json
{
  "id": "STAKE_000053",
  "account_id": "CUST_000012",
  "name": "Dr. Trevor Trantow",
  "role": "CISO",
  "influence_level": "Medium",
  "engagement_score": 8,
  "champion_strength": "Strong",
  "last_contact": "2025-09-13T13:37:46.764Z",
  "engagement_history": []
}
```

**Enhanced Structure (Add These 5 Fields):**
```json
{
  // ... all existing fields above ...
  
  // ⭐ NEW FIELDS FOR GAP 11
  "role_start_date": "2024-01-15",
  "tenure_months": 21,
  "tenure_risk_level": "Stable",
  "stability_score": 85,
  "linkedin_signals": {
    "profile_updated_recently": false,
    "open_to_work": false,
    "job_seeking_activity": "None",
    "last_checked_date": "2025-10-08"
  }
}
```

**Migration Note:** Backfill `role_start_date` from historical data or LinkedIn. Calculate `tenure_months` as `MONTHS_BETWEEN(CURRENT_DATE, role_start_date)`.

---

### 🆕 New JSON Files Required (10 Files)

**No modifications to existing JSON files except reading data from them.**

All 10 new JSON files are standalone with foreign key relationships to existing files.

---

## Gap 1: Intervention Playbooks 🔴

### Priority: CRITICAL (Weeks 1-2)

### Business Problem
CSMs receive health score alerts but lack prescriptive next-step guidance, leading to inconsistent response times and lower save rates (currently ~45%, target 67%).

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Playbook Adherence Rate | (Playbooks Followed / Total Alerts) × 100 | >90% | Daily |
| Average Time to First Action | AVG(First Action Time - Alert Time) | <4 hours | Daily |
| Playbook Success Rate | (Accounts Saved / Playbooks Executed) × 100 | >67% | Monthly |
| Step Completion Rate | (Completed Steps / Total Steps) × 100 | >95% | Weekly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json
{
  "customer_id": "CUST_000012",      // ✅ Link to account
  "customer_name": "Medical Group",  // ✅ Display name
  "health_score": 52,                 // ✅ Trigger condition
  "health_category": "At Risk",       // ✅ Alert classification
  "churn_risk": "High",               // ✅ Severity indicator
  "arr": 320000                       // ✅ Account value
}
```

**No modifications to accounts.json required** - only read access.

### New JSON Required

#### File: `intervention_playbooks.json`

**Schema Definition:**
```json
{
  "playbook_id": "PB_HEALTH_CRASH_001",
  "alert_type": "Health Score Crash",
  "alert_subtype": "15+ Point Drop in 7 Days",
  "severity": "Critical",
  
  "trigger_conditions": {
    "health_score_drop_points": 15,
    "time_window_days": 7,
    "threshold_score": 50,
    "churn_risk_level": "High"
  },
  
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",          // Denormalized for display
  "triggered_date": "2025-10-08T14:23:00Z",
  "triggered_by": "System",                 // "System" | "CSM Manual"
  "assigned_csm": "CSM_001",
  "assigned_csm_name": "Jane Doe",
  
  "status": "In Progress",                  // "Pending" | "In Progress" | "Completed" | "Cancelled"
  
  "steps": [
    {
      "sequence": 1,
      "action": "Schedule emergency call with exec sponsor within 4 hours",
      "description": "Contact executive sponsor immediately to discuss health score drop. Use template email in Gainsight.",
      "owner_role": "CSM",
      "owner_name": "Jane Doe",
      "sla_hours": 4,
      "priority": "Critical",
      "status": "Pending",
      "started_date": null,
      "completed_date": null,
      "notes": "",
      "outcome": null                       // "Successful" | "Failed" | "Skipped"
    },
    {
      "sequence": 2,
      "action": "Conduct usage audit to identify drop cause",
      "description": "Review last 30 days of product usage data across all licenses. Check for: deactivated users, feature usage decline, API errors.",
      "owner_role": "CSM + Technical CSM",
      "owner_name": "Jane Doe",
      "sla_hours": 24,
      "priority": "High",
      "status": "Pending",
      "started_date": null,
      "completed_date": null,
      "notes": "",
      "outcome": null
    },
    {
      "sequence": 3,
      "action": "Review support tickets from last 30 days",
      "description": "Analyze all support tickets for patterns: P1 incidents, recurring issues, negative sentiment.",
      "owner_role": "CSM",
      "owner_name": "Jane Doe",
      "sla_hours": 24,
      "priority": "High",
      "status": "Pending",
      "started_date": null,
      "completed_date": null,
      "notes": "",
      "outcome": null
    },
    {
      "sequence": 4,
      "action": "Escalate to manager if health <45",
      "description": "If health score drops below 45, escalate to CSM Manager for executive intervention.",
      "owner_role": "CSM → Manager",
      "owner_name": "Jane Doe",
      "sla_hours": 48,
      "priority": "Medium",
      "condition": "health_score < 45",
      "condition_met": true,
      "status": "Conditional",
      "started_date": null,
      "completed_date": null,
      "notes": "",
      "outcome": null
    },
    {
      "sequence": 5,
      "action": "Create save plan in Gainsight",
      "description": "Document findings and create formal save plan with: root cause, action items, success criteria, timeline.",
      "owner_role": "CSM",
      "owner_name": "Jane Doe",
      "sla_hours": 48,
      "priority": "High",
      "status": "Pending",
      "started_date": null,
      "completed_date": null,
      "notes": "",
      "outcome": null
    }
  ],
  
  "expected_impact": "67% save rate when actioned within 24h",
  "historical_success_rate": 0.67,
  "historical_sample_size": 156,
  
  "completion_status": "In Progress",
  "completion_percentage": 0.0,
  "total_steps": 5,
  "completed_steps": 0,
  "skipped_steps": 0,
  
  "outcome": null,                          // "Saved" | "Churned" | "In Progress"
  "outcome_date": null,
  "outcome_notes": "",
  
  "playbook_version": "2.3",
  "last_updated": "2025-10-08T14:23:00Z"
}
```

**Field Type Definitions:**
```typescript
interface InterventionPlaybook {
  playbook_id: string;                // PK
  alert_type: string;
  alert_subtype: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  
  trigger_conditions: {
    health_score_drop_points?: number;
    time_window_days?: number;
    threshold_score?: number;
    churn_risk_level?: string;
  };
  
  account_id: string;                 // FK → accounts.json
  account_name: string;
  triggered_date: string;             // ISO 8601
  triggered_by: "System" | "CSM Manual";
  assigned_csm: string;
  assigned_csm_name: string;
  
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  
  steps: PlaybookStep[];
  
  expected_impact: string;
  historical_success_rate: number;    // 0-1
  historical_sample_size: number;
  
  completion_status: string;
  completion_percentage: number;      // 0-100
  total_steps: number;
  completed_steps: number;
  skipped_steps: number;
  
  outcome: "Saved" | "Churned" | "In Progress" | null;
  outcome_date: string | null;
  outcome_notes: string;
  
  playbook_version: string;
  last_updated: string;
}

interface PlaybookStep {
  sequence: number;
  action: string;
  description: string;
  owner_role: string;
  owner_name: string;
  sla_hours: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  condition?: string;
  condition_met?: boolean;
  status: "Pending" | "In Progress" | "Completed" | "Skipped" | "Conditional";
  started_date: string | null;
  completed_date: string | null;
  notes: string;
  outcome: "Successful" | "Failed" | "Skipped" | null;
}
```

### JSON Relationships

```
intervention_playbooks.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS (no writes): 
        - accounts.health_score
        - accounts.churn_risk
        - accounts.arr
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **CSM Portfolio Health** | Alert Center Widget | Display triggered playbooks with status badges | Real-time |
| **CSM Portfolio Health** | At-Risk Accounts Table | Show "Playbook Active" indicator column | Real-time |
| **Account Drill-Down (Level 2)** | Action Panel (Right Sidebar) | Show playbook steps with progress stepper UI | Real-time |
| **Account Drill-Down (Level 2)** | Alert Banner (Top) | Show critical playbooks with countdown timer | Real-time |
| **CSM Activity Dashboard** | Playbook Adherence KPI Card | Display completion rate metric | Daily |
| **CSM Activity Dashboard** | Playbook Success Rate Chart | Show save rates by playbook type | Weekly |

### Sample Data (3 Playbook Types)

```json
// Example 1: Health Score Crash
{
  "playbook_id": "PB_HEALTH_CRASH_CUST_000012_20251008",
  "alert_type": "Health Score Crash",
  "account_id": "CUST_000012",
  "triggered_date": "2025-10-08T14:23:00Z",
  "status": "In Progress",
  "steps": [...],
  "historical_success_rate": 0.67
}

// Example 2: Usage Drop
{
  "playbook_id": "PB_USAGE_DROP_CUST_000045_20251008",
  "alert_type": "Usage Drop",
  "account_id": "CUST_000045",
  "triggered_date": "2025-10-08T09:15:00Z",
  "status": "Pending",
  "steps": [...],
  "historical_success_rate": 0.74
}

// Example 3: Champion Unresponsive
{
  "playbook_id": "PB_CHAMP_UNRESPONSIVE_CUST_000089_20251007",
  "alert_type": "Champion Unresponsive",
  "account_id": "CUST_000089",
  "triggered_date": "2025-10-07T11:30:00Z",
  "status": "Completed",
  "outcome": "Saved",
  "steps": [...],
  "historical_success_rate": 0.82
}
```

### Implementation Requirements

**Backend:**
- Create playbook library with 89 alert types
- Build rule engine for trigger conditions
- Implement step tracking API endpoints
- Create webhook listener for Gainsight alerts

**Frontend:**
- Playbook stepper UI component (Material-UI Stepper)
- Alert center widget with filtering
- Progress tracking visualization
- SLA countdown timers

**Integration:**
- Gainsight webhook for real-time alerts
- Snowflake write-back for step completion tracking

**Estimated Effort:** 32 hours

---

## Gap 2: QBR Value Story Generator 🔴

### Priority: CRITICAL (Weeks 3-4)

### Business Problem
CSMs spend 15-20 hours manually building QBR decks by pulling data from 8+ different systems. Need auto-generated customer-facing value summaries to reduce prep time by 80%.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| QBR Prep Time Reduction | AVG(Manual Hours) - AVG(Auto Hours) | 16h → 3h (-80%) | Monthly |
| Value Metric Coverage | (Metrics Included / Total Available) × 100 | >85% | Per QBR |
| QBR Deck Generation Rate | Auto-Generated QBRs / Total QBRs | >75% | Quarterly |
| Customer Value Documented | SUM(estimated_cost_avoided) | Track trend | Quarterly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json
{
  "customer_id": "CUST_000012",
  "customer_name": "Medical Group",
  "industry": "Healthcare",
  "arr": 3627162,
  
  // Nested: licenses array
  "licenses": [
    {
      "product_family": "Duo",
      "product_id": "PROD_DUO_001",
      "utilization_rate": 87,        // ✅ For capacity metrics
      "active_users": 247,            // ✅ For productivity value
      "licensed_quantity": 300,       // ✅ Growth calculation
      "license_start_date": "2024-01-15",
      "last_usage_date": "2025-10-08"
    }
  ],
  
  // Nested: support_metrics
  "support_metrics": {
    "open_tickets": 3,
    "avg_resolution_time": 6.2,
    "satisfaction_score": 4.8,
    "tickets_resolved_90d": 18,
    "p1_incidents_90d": 0
  }
}
```

**No modifications to accounts.json required** - only read access.

### New JSON Required

#### File: `qbr_value_stories.json`

**Schema Definition:**
```json
{
  "qbr_id": "QBR_CUST_000012_Q3_2025",
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",
  "time_period": "Q3 2025",
  "period_start": "2025-07-01",
  "period_end": "2025-09-30",
  "generation_date": "2025-09-25T10:30:00Z",
  "generation_method": "Auto",              // "Auto" | "Manual" | "Hybrid"
  "generated_by_csm": "CSM_001",
  "csm_name": "Jane Doe",
  
  "security_value": {
    "threats_blocked": 1247,
    "threats_blocked_prev_period": 1015,
    "threats_trend_pct": 23,
    "threats_comparison": "vs Q2 2025",
    "estimated_cost_avoided": 340000,
    "cost_per_breach_assumption": 4200000,  // Industry avg (IBM Security)
    "breach_probability_prevented": 0.081,  // 1247 / 15000 avg threats
    "narrative": "Blocked 1,247 threats (↑23% vs Q2), preventing estimated $340K in breach costs based on IBM's average breach cost of $4.2M",
    "product_contribution": {
      "Umbrella": 0.60,                     // 60% of threat blocks
      "Duo": 0.40                           // 40% of threat blocks
    },
    "threat_categories": {
      "malware": 458,
      "phishing": 312,
      "ransomware": 89,
      "other": 388
    }
  },
  
  "productivity_value": {
    "users_enabled": 247,                    // From licenses.active_users
    "baseline_users": 213,
    "user_growth_pct": 16.0,
    "adoption_improvement_pp": 16,           // Percentage points: 62% → 78%
    "adoption_baseline": 62,
    "adoption_current": 78,
    "time_saved_hours": 1482,
    "time_saved_per_user_hours": 6.0,
    "time_saved_methodology": "Industry benchmark: 6h saved per user per quarter at 75%+ adoption",
    "narrative": "Enabled 247 active users with adoption improved from 62% → 78% (+16pp), saving approximately 1,482 employee hours this quarter",
    "calculation_methodology": "Industry benchmark: 6h saved per user per quarter at 75%+ adoption",
    "roi_per_user_annual": 2400              // $40/hr × 6h/qtr × 4 qtrs
  },
  
  "uptime_value": {
    "uptime_percentage": 99.7,
    "baseline_uptime": 99.4,
    "reliability_improvement_pp": 0.3,
    "downtime_minutes_avoided": 131,        // (0.3% of 90 days)
    "estimated_downtime_cost_avoided": 52400,
    "downtime_cost_per_minute": 400,        // Based on company size
    "narrative": "Maintained 99.7% uptime, +0.3pp improvement vs last quarter, avoiding 131 minutes of downtime ($52K cost avoidance)"
  },
  
  "usage_trends": {
    "dau_growth_pct": 18,
    "dau_current": 189,
    "dau_baseline": 160,
    "features_adopted_count": 7,
    "features_adopted_new_this_period": 3,
    "features_available_count": 23,
    "feature_adoption_rate": 0.304,
    "power_users_count": 42,
    "power_user_threshold": "10+ features used",
    "power_user_growth_pct": 24,
    "narrative": "Daily active users grew +18% (160 → 189), 7 features now in use including 3 newly adopted this quarter. 42 power users identified."
  },
  
  "support_experience": {
    "tickets_resolved": 18,                  // From support_metrics
    "tickets_resolved_prev_period": 22,
    "avg_resolution_hours": 6.2,
    "avg_resolution_hours_prev_period": 7.8,
    "resolution_time_improvement_pct": 21,
    "satisfaction_score": 4.8,
    "satisfaction_score_prev_period": 4.6,
    "satisfaction_trend": "+0.2 vs Q2",
    "p1_incidents": 0,
    "p2_incidents": 2,
    "p3_incidents": 16,
    "narrative": "Resolved 18 tickets in avg 6.2 hours (-21% faster) with 4.8/5 satisfaction (+0.2). Zero P1 incidents this quarter."
  },
  
  "recommendations": [
    {
      "type": "Expansion",
      "priority": "High",
      "recommendation": "Utilization at 87% - consider expanding capacity for growing demand",
      "estimated_arr": 120000,
      "rationale": "Current utilization indicates capacity constraint. Similar customers expanded by avg $120K."
    },
    {
      "type": "Adoption",
      "priority": "Medium",
      "recommendation": "5 advanced features available but not yet adopted - training recommended",
      "estimated_time_investment": "2 hours training",
      "features": ["SSO Advanced", "API Access", "Custom Reporting", "Automated Workflows", "Mobile App"]
    },
    {
      "type": "Risk Mitigation",
      "priority": "Low",
      "recommendation": "Consider adding ThousandEyes for network visibility",
      "estimated_arr": 85000,
      "rationale": "83% of Meraki customers your size use ThousandEyes for complete visibility"
    }
  ],
  
  "executive_summary": "Your Duo and Umbrella deployment delivered $392K in measurable value this quarter through threat prevention ($340K) and improved uptime ($52K). User adoption improved 16 percentage points with 18% DAU growth. Support experience improved with 21% faster ticket resolution and 4.8/5 satisfaction.",
  
  "total_value_documented": 392400,         // Sum of cost_avoided + time_saved
  
  "deck_url": "https://storage.cisco.com/qbr/CUST_000012_Q3_2025.pdf",
  "deck_generated": true,
  "presented_date": null,
  "attendees": [],
  "presentation_notes": "",
  
  "version": "1.0",
  "last_updated": "2025-09-25T10:30:00Z"
}
```

**Field Type Definitions:**
```typescript
interface QBRValueStory {
  qbr_id: string;                     // PK
  account_id: string;                 // FK → accounts.json
  account_name: string;
  time_period: string;                // "Q1 2025", "Q2 2025", etc.
  period_start: string;               // ISO 8601 date
  period_end: string;
  generation_date: string;            // ISO 8601 datetime
  generation_method: "Auto" | "Manual" | "Hybrid";
  generated_by_csm: string;
  csm_name: string;
  
  security_value: SecurityValue;
  productivity_value: ProductivityValue;
  uptime_value: UptimeValue;
  usage_trends: UsageTrends;
  support_experience: SupportExperience;
  
  recommendations: Recommendation[];
  
  executive_summary: string;
  total_value_documented: number;
  
  deck_url: string | null;
  deck_generated: boolean;
  presented_date: string | null;
  attendees: string[];
  presentation_notes: string;
  
  version: string;
  last_updated: string;
}

interface SecurityValue {
  threats_blocked: number;
  threats_blocked_prev_period: number;
  threats_trend_pct: number;
  threats_comparison: string;
  estimated_cost_avoided: number;
  cost_per_breach_assumption: number;
  breach_probability_prevented: number;
  narrative: string;
  product_contribution: Record<string, number>;
  threat_categories: Record<string, number>;
}

interface ProductivityValue {
  users_enabled: number;
  baseline_users: number;
  user_growth_pct: number;
  adoption_improvement_pp: number;
  adoption_baseline: number;
  adoption_current: number;
  time_saved_hours: number;
  time_saved_per_user_hours: number;
  time_saved_methodology: string;
  narrative: string;
  calculation_methodology: string;
  roi_per_user_annual: number;
}

interface Recommendation {
  type: "Expansion" | "Adoption" | "Risk Mitigation";
  priority: "High" | "Medium" | "Low";
  recommendation: string;
  estimated_arr?: number;
  estimated_time_investment?: string;
  features?: string[];
  rationale: string;
}
```

### JSON Relationships

```
qbr_value_stories.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS (no writes):
        - accounts.licenses[].active_users
        - accounts.licenses[].utilization_rate
        - accounts.support_metrics.*
  └─► REQUIRES EXTERNAL:
        - Product APIs (Duo, Umbrella, Meraki) for security events, uptime
        - Industry benchmark database for ROI calculations
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **Account Drill-Down (Level 2)** | QBR Value Card (Center Panel) | Display auto-generated value summary | Quarterly |
| **Account Drill-Down (Level 2)** | QBR History Timeline | Show past QBRs with value trends | Quarterly |
| **CSM Activity Dashboard** | QBR Prep Time KPI Card | Show avg prep time (before vs after) | Monthly |
| **CSM Activity Dashboard** | Value Documented Chart | Show total value across all QBRs | Quarterly |
| **Account Health Detail** | Value Metrics Panel | Show security, productivity, uptime values | Real-time |

### Sample Data

```json
{
  "qbr_id": "QBR_CUST_000012_Q3_2025",
  "account_id": "CUST_000012",
  "time_period": "Q3 2025",
  "generation_method": "Auto",
  "security_value": {
    "threats_blocked": 1247,
    "estimated_cost_avoided": 340000,
    "narrative": "Blocked 1,247 threats, preventing $340K in breach costs"
  },
  "executive_summary": "Your deployment delivered $392K in measurable value this quarter.",
  "total_value_documented": 392400
}
```

### Implementation Requirements

**Backend:**
- Value calculation engine (6 metric categories)
- LLM integration for narrative generation (Claude API)
- Product API integrations (Duo, Umbrella, Meraki, ThousandEyes)
- PDF deck generator (Puppeteer or similar)

**Frontend:**
- QBR value display component with expandable sections
- Value trend charts (Line charts for QoQ comparison)
- Recommendation cards with action buttons

**Integration:**
- Duo API for active users, adoption metrics
- Umbrella API for security events, threat intelligence
- Meraki API for uptime, network metrics
- Support system API for ticket data

**Estimated Effort:** 48 hours

---

## Gap 3: Time to Churn Estimate 🟡

### Priority: HIGH (Week 5-6)

### Business Problem
CSMs know accounts are "at-risk" (binary flag) but lack time-based predictions for intervention urgency. Need ML-powered estimates of days until churn to prioritize rescue efforts.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Prediction Accuracy | (Correct Predictions / Total Predictions) × 100 | >85% | Monthly |
| Average Intervention Window | AVG(Days to Churn - Days Since Alert) | 45+ days | Weekly |
| Early Detection Rate | Accounts Flagged >30d Before Churn / Total Churns | >80% | Monthly |
| Model Confidence Score | AVG(confidence_score) for all predictions | >0.80 | Monthly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json
{
  "customer_id": "CUST_000012",
  "health_score": 52,                  // ✅ Current state
  "health_history": [                  // ✅ For velocity calculation
    {"date": "2025-10-08", "score": 52},
    {"date": "2025-10-01", "score": 67},
    {"date": "2025-09-24", "score": 72},
    {"date": "2025-09-17", "score": 74},
    {"date": "2025-09-10", "score": 76}
  ],
  "churn_risk": "High",
  "utilization_rate": 35,
  "utilization_history": [
    {"date": "2025-10-01", "rate": 35},
    {"date": "2025-09-01", "rate": 52},
    {"date": "2025-08-01", "rate": 68}
  ]
}

// FROM: contracts.json
{
  "contract_id": "CONTRACT_000012",
  "customer_id": "CUST_000012",        // FK
  "end_date": "2026-06-22T04:48:33Z",  // ✅ Renewal deadline
  "arr": 320000
}

// FROM: users.json
{
  "user_id": "USER_001",
  "customer_id": "CUST_000012",
  "activity_level": "Low",             // ✅ Engagement signal
  "last_login": "2025-09-15",
  "login_frequency_30d": 3
}

// FROM: stakeholders.json
{
  "id": "STAKE_000053",
  "account_id": "CUST_000012",
  "last_contact": "2025-09-08T06:51:13Z",  // ✅ Engagement gap
  "engagement_score": 8
}
```

**No modifications to existing JSONs required** - only read access.

### New JSON Required

#### File: `churn_predictions.json`

**Schema Definition:**
```json
{
  "prediction_id": "CHURN_PRED_CUST_000012_20251008",
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",
  "prediction_date": "2025-10-08T14:23:00Z",
  "model_version": "v2.3",
  "model_type": "Gradient Boosting + Time Series",
  
  "current_health_score": 52,               // From accounts.json
  "churn_probability": 0.78,                // ML model output (0-1)
  "churn_probability_tier": "High",         // High: >0.70, Medium: 0.40-0.70, Low: <0.40
  
  "estimated_churn_date": "2025-11-22",
  "estimated_days_to_churn": 45,
  "confidence_level": "HIGH",               // HIGH | MEDIUM | LOW
  "confidence_score": 0.87,                 // 0-1
  
  "velocity_metrics": {
    "health_velocity": -1.2,                // Points per day (last 30d)
    "health_trend": "Declining",
    "usage_velocity": -0.52,                // % change per day (last 30d)
    "usage_trend": "Declining",
    "engagement_velocity": -0.15,           // Touches per week decline
    "engagement_trend": "Declining"
  },
  
  "risk_factors": [
    {
      "factor": "Health Decline",
      "severity": "Critical",
      "description": "Health declining at -1.2 points/day",
      "contribution_to_risk": 0.35,
      "trend_direction": "Worsening"
    },
    {
      "factor": "Usage Drop",
      "severity": "High",
      "description": "Usage dropped 52% in last 30 days",
      "contribution_to_risk": 0.28,
      "trend_direction": "Worsening"
    },
    {
      "factor": "Engagement Gap",
      "severity": "Medium",
      "description": "No executive engagement in 6 months",
      "contribution_to_risk": 0.22,
      "trend_direction": "Stable"
    },
    {
      "factor": "Renewal Proximity",
      "severity": "Medium",
      "description": "Renewal in 73 days",
      "contribution_to_risk": 0.15,
      "trend_direction": "Time-based"
    }
  ],
  
  "intervention_window_days": 45,
  "intervention_urgency": "Immediate",      // Immediate | High | Medium | Low
  "recommended_action": "Immediate executive escalation",
  
  "similar_churn_patterns": [
    {
      "historical_account_id": "CUST_000089",
      "historical_account_name": "Previous Churn",
      "similarity_score": 0.92,
      "pattern_match_features": ["Health velocity", "Usage decline", "Low engagement"],
      "outcome": "Churned",
      "days_to_churn_actual": 42,
      "intervention_attempted": true,
      "intervention_success": false
    },
    {
      "historical_account_id": "CUST_000134",
      "historical_account_name": "Saved Account",
      "similarity_score": 0.88,
      "pattern_match_features": ["Health velocity", "Low engagement"],
      "outcome": "Saved",
      "days_to_churn_predicted": 48,
      "intervention_attempted": true,
      "intervention_success": true,
      "save_actions_taken": ["Executive escalation", "Emergency QBR"]
    }
  ],
  
  "contract_end_date": "2026-06-22",        // From contracts.json
  "days_to_renewal": 257,
  "arr_at_risk": 320000,
  
  "model_inputs": {
    "health_score_30d_avg": 58.4,
    "health_score_90d_avg": 68.2,
    "health_velocity_30d": -1.2,
    "utilization_rate_30d_avg": 41.2,
    "utilization_velocity_30d": -0.52,
    "support_tickets_30d": 7,
    "support_tickets_90d": 18,
    "support_sentiment_avg": -0.23,
    "executive_touches_90d": 0,
    "executive_touches_180d": 2,
    "champion_strength": "Weak",
    "product_adoption_breadth": 0.34,
    "user_activity_level": "Low",
    "login_frequency_30d": 3.2,
    "feature_usage_decline_pct": 42
  },
  
  "model_performance_metadata": {
    "training_date": "2025-09-01",
    "training_sample_size": 3456,
    "test_accuracy": 0.87,
    "false_positive_rate": 0.08,
    "false_negative_rate": 0.05
  },
  
  "last_updated": "2025-10-08T14:23:00Z",
  "next_prediction_date": "2025-10-15T00:00:00Z"
}
```

**Field Type Definitions:**
```typescript
interface ChurnPrediction {
  prediction_id: string;              // PK
  account_id: string;                 // FK → accounts.json
  account_name: string;
  prediction_date: string;
  model_version: string;
  model_type: string;
  
  current_health_score: number;
  churn_probability: number;          // 0-1
  churn_probability_tier: "High" | "Medium" | "Low";
  
  estimated_churn_date: string;
  estimated_days_to_churn: number;
  confidence_level: "HIGH" | "MEDIUM" | "LOW";
  confidence_score: number;           // 0-1
  
  velocity_metrics: VelocityMetrics;
  risk_factors: RiskFactor[];
  
  intervention_window_days: number;
  intervention_urgency: "Immediate" | "High" | "Medium" | "Low";
  recommended_action: string;
  
  similar_churn_patterns: SimilarPattern[];
  
  contract_end_date: string;
  days_to_renewal: number;
  arr_at_risk: number;
  
  model_inputs: Record<string, number | string>;
  model_performance_metadata: ModelPerformance;
  
  last_updated: string;
  next_prediction_date: string;
}

interface VelocityMetrics {
  health_velocity: number;
  health_trend: "Improving" | "Stable" | "Declining";
  usage_velocity: number;
  usage_trend: "Improving" | "Stable" | "Declining";
  engagement_velocity: number;
  engagement_trend: "Improving" | "Stable" | "Declining";
}

interface RiskFactor {
  factor: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  contribution_to_risk: number;       // 0-1
  trend_direction: "Worsening" | "Stable" | "Improving" | "Time-based";
}

interface SimilarPattern {
  historical_account_id: string;
  historical_account_name: string;
  similarity_score: number;           // 0-1
  pattern_match_features: string[];
  outcome: "Churned" | "Saved";
  days_to_churn_actual?: number;
  days_to_churn_predicted?: number;
  intervention_attempted: boolean;
  intervention_success?: boolean;
  save_actions_taken?: string[];
}
```

### JSON Relationships

```
churn_predictions.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS (no writes):
        - accounts.health_score
        - accounts.health_history[]
        - accounts.utilization_rate
        - accounts.utilization_history[]
        - contracts.end_date
        - users.activity_level
        - users.login_frequency_30d
        - stakeholders.last_contact
        - stakeholders.engagement_score
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **CSM Portfolio Health** | At-Risk Accounts Table | Add "Days to Churn" column | Daily |
| **Health Matrix (Renewal Risk Matrix)** | Cell Detail View | Display time estimates in hover tooltip | Daily |
| **Health Matrix** | Color Coding Enhancement | Red gradient by urgency (days to churn) | Daily |
| **Account Drill-Down (Level 2)** | Churn Prediction Card | Show full prediction with confidence | Daily |
| **Account Drill-Down (Level 2)** | Risk Factor Breakdown | Chart showing contribution percentages | Daily |
| **Account Drill-Down (Level 2)** | Similar Patterns Panel | Show historical similar accounts | On-demand |

### Sample Data

```json
{
  "prediction_id": "CHURN_PRED_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "churn_probability": 0.78,
  "estimated_days_to_churn": 45,
  "confidence_level": "HIGH",
  "velocity_metrics": {
    "health_velocity": -1.2,
    "usage_velocity": -0.52
  },
  "intervention_urgency": "Immediate"
}
```

### Implementation Requirements

**ML Model:**
- Train gradient boosting model on 5+ years historical churn data
- Features: health velocity, usage trends, engagement metrics, support sentiment
- Target: Binary churn + time to churn (dual-output model)
- Validation: 80/20 train-test split, 85%+ accuracy target

**Backend:**
- Prediction API (Flask/FastAPI)
- Nightly batch scoring job (update all at-risk accounts)
- Real-time prediction on-demand endpoint
- Model versioning and A/B testing framework

**Frontend:**
- Churn prediction display card component
- Risk factor breakdown chart (D3.js donut chart)
- Time-to-churn countdown visualization
- Similar patterns comparison table

**Integration:**
- Snowflake for model training data
- Real-time health score updates trigger re-scoring
- Alert system integration for intervention_urgency="Immediate"

**Estimated Effort:** 60 hours (including model training)

---

## Gap 4: Champion Departure Impact Score 🟡

### Priority: HIGH (Week 5-6)

### Business Problem
When key stakeholders leave, CSMs need quantified risk assessment to prioritize response. Currently, champion departures are detected manually with inconsistent follow-up.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Champion Departure Detection Rate | Departures Detected / Total Departures | >90% | Monthly |
| Average Time to Detection | AVG(Detection Date - Departure Date) | <14 days | Monthly |
| Post-Departure Save Rate | Accounts Saved / Champion Departures | >60% | Quarterly |
| Multi-Threading Score | AVG(Active Relationships per Account) | >3 | Monthly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: stakeholders.json
{
  "id": "STAKE_000053",
  "account_id": "CUST_000012",
  "name": "Dr. Trevor Trantow",
  "role": "CISO",                          // ✅ For influence scoring
  "influence_level": "Medium",             // ✅ Available
  "engagement_score": 8,                   // ✅ Available
  "champion_strength": "Strong",           // ✅ Available
  "last_contact": "2025-09-13T13:37:46Z",
  
  "engagement_history": [                  // ✅ For touch frequency
    {
      "date": "2025-07-07T08:40:44Z",
      "type": "meeting",
      "sentiment": "neutral",
      "csm_id": "CSM_001"
    },
    {
      "date": "2025-08-15T10:20:00Z",
      "type": "email",
      "sentiment": "positive",
      "csm_id": "CSM_001"
    }
  ]
}

// FROM: contracts.json
{
  "contract_id": "CONTRACT_000012",
  "customer_id": "CUST_000012",
  "end_date": "2026-06-22T04:48:33Z",      // ✅ For renewal proximity
  "arr": 320000
}

// FROM: accounts.json
{
  "customer_id": "CUST_000012",
  "arr": 320000,                            // ✅ ARR at risk
  "health_score": 52
}
```

**No modifications to existing JSONs required** - only read access.

### New JSON Required

#### File: `champion_departure_alerts.json`

**Schema Definition:**
```json
{
  "alert_id": "CHAMP_DEP_STAKE_000053_20251008",
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",
  "champion_id": "STAKE_000053",            // FK → stakeholders.json
  "champion_name": "Dr. Trevor Trantow",
  "champion_role": "CISO",
  "champion_email": "ttrantow@medicalgroup.com",
  
  "departure_detected_date": "2025-10-08",
  "departure_date": "2025-10-01",
  "detection_lag_days": 7,
  "detection_method": "LinkedIn API",       // "LinkedIn API" | "Manual" | "Customer Notification" | "Email Bounce"
  
  "employment_status": "Departed",          // "Active" | "Departed" | "Unknown"
  "new_company": "TechCorp Inc",
  "new_role": "VP of Security",
  "linkedin_profile_url": "https://linkedin.com/in/trevortrantow",
  
  "impact_score": 87,                       // Composite 0-100
  "impact_level": "CRITICAL",               // CRITICAL (85-100) | HIGH (70-84) | MEDIUM (50-69) | LOW (<50)
  
  "risk_breakdown": {
    "relationship_dependency": 80,          // 0-100: % of touches with this person
    "champion_influence_score": 95,         // 0-100: Decision authority + budget control
    "renewal_proximity": 100,               // 0-100: 100 if <90 days, 70 if <180 days, else 40
    "multi_threading_gap": 90               // 0-100: 100 - (active_relationships × 20)
  },
  
  "relationship_metrics": {
    "total_touches_12m": 24,
    "champion_touch_count": 19,
    "champion_touch_percentage": 0.79,      // 79% of all touches
    "other_active_relationships": 1,
    "executive_level_relationships": 0,
    "total_stakeholders": 5,
    "active_stakeholders": 2
  },
  
  "historical_churn_probability": 0.67,     // 67% churn rate in similar cases
  "historical_data_source": "Last 3 years, 45 similar departures",
  "relationship_rebuild_time_days": 120,    // Historical avg
  "arr_at_risk": 320000,
  
  "contract_end_date": "2026-06-22",
  "days_to_renewal": 257,
  
  "recommended_actions": [
    {
      "sequence": 1,
      "action": "Identify replacement champion within 7 days",
      "owner": "CSM",
      "sla_days": 7,
      "priority": "Critical",
      "status": "Pending",
      "details": "Review remaining stakeholders, identify decision-makers, assess influence levels"
    },
    {
      "sequence": 2,
      "action": "Request introduction from departing champion (if possible)",
      "owner": "CSM",
      "sla_days": 3,
      "priority": "High",
      "status": "Pending",
      "details": "Reach out via LinkedIn or personal email if professional relationship exists"
    },
    {
      "sequence": 3,
      "action": "Escalate to executive sponsor for C-level engagement",
      "owner": "CSM → Executive Sponsor",
      "sla_days": 14,
      "priority": "High",
      "status": "Pending",
      "details": "Engage CEO-to-CEO or CRO-to-CFO to maintain executive presence"
    },
    {
      "sequence": 4,
      "action": "Increase touch cadence with remaining stakeholders",
      "owner": "CSM",
      "sla_days": 7,
      "priority": "Medium",
      "status": "Pending",
      "details": "Double touch frequency from monthly to bi-weekly with all remaining contacts"
    }
  ],
  
  "alert_status": "Open",                   // Open | In Progress | Resolved | Cancelled
  "alert_opened_date": "2025-10-08",
  "resolution_date": null,
  "resolution_method": null,
  
  "new_champion_id": null,
  "new_champion_identified_date": null,
  "relationship_rebuild_progress": 0,
  
  "outcome": null,                          // "Saved" | "Churned" | "In Progress" | null
  "outcome_date": null,
  "outcome_notes": "",
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

**Field Type Definitions:**
```typescript
interface ChampionDepartureAlert {
  alert_id: string;                   // PK
  account_id: string;                 // FK → accounts.json
  account_name: string;
  champion_id: string;                // FK → stakeholders.json
  champion_name: string;
  champion_role: string;
  champion_email: string;
  
  departure_detected_date: string;
  departure_date: string;
  detection_lag_days: number;
  detection_method: "LinkedIn API" | "Manual" | "Customer Notification" | "Email Bounce";
  
  employment_status: "Active" | "Departed" | "Unknown";
  new_company: string | null;
  new_role: string | null;
  linkedin_profile_url: string;
  
  impact_score: number;               // 0-100
  impact_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  
  risk_breakdown: RiskBreakdown;
  relationship_metrics: RelationshipMetrics;
  
  historical_churn_probability: number;
  historical_data_source: string;
  relationship_rebuild_time_days: number;
  arr_at_risk: number;
  
  contract_end_date: string;
  days_to_renewal: number;
  
  recommended_actions: RecommendedAction[];
  
  alert_status: "Open" | "In Progress" | "Resolved" | "Cancelled";
  alert_opened_date: string;
  resolution_date: string | null;
  resolution_method: string | null;
  
  new_champion_id: string | null;
  new_champion_identified_date: string | null;
  relationship_rebuild_progress: number;  // 0-100
  
  outcome: "Saved" | "Churned" | "In Progress" | null;
  outcome_date: string | null;
  outcome_notes: string;
  
  last_updated: string;
}

interface RiskBreakdown {
  relationship_dependency: number;    // 0-100
  champion_influence_score: number;   // 0-100
  renewal_proximity: number;          // 0-100
  multi_threading_gap: number;        // 0-100
}

interface RelationshipMetrics {
  total_touches_12m: number;
  champion_touch_count: number;
  champion_touch_percentage: number;  // 0-1
  other_active_relationships: number;
  executive_level_relationships: number;
  total_stakeholders: number;
  active_stakeholders: number;
}

interface RecommendedAction {
  sequence: number;
  action: string;
  owner: string;
  sla_days: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed" | "Skipped";
  details: string;
}
```

### Calculation Formulas

```javascript
// Impact Score (0-100)
impact_score = 
  (relationship_dependency × 0.40) +
  (champion_influence_score × 0.30) +
  (renewal_proximity × 0.20) +
  (multi_threading_gap × 0.10)

// Relationship Dependency (0-100)
relationship_dependency = 
  IF champion_touch_percentage > 0.80 THEN 100
  ELSE IF champion_touch_percentage > 0.60 THEN 80
  ELSE champion_touch_percentage × 100

// Champion Influence Score (0-100)
champion_influence_score = 
  (decision_authority × 0.50) +
  (internal_advocacy × 0.30) +
  (budget_control × 0.20)

decision_authority = 
  IF role IN ['CEO', 'CFO', 'CIO', 'CISO', 'CTO'] THEN 100
  ELSE IF role IN ['Director', 'VP', 'SVP'] THEN 70
  ELSE 40

// Renewal Proximity (0-100)
renewal_proximity = 
  IF days_to_renewal < 90 THEN 100
  ELSE IF days_to_renewal < 180 THEN 70
  ELSE 40

// Multi-Threading Gap (0-100)
multi_threading_gap = 100 - (active_relationships × 20)
// Cap at 100, floor at 0
```

### JSON Relationships

```
champion_departure_alerts.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► champion_id → stakeholders.json.id (FK)
  └─► READS (no writes):
        - stakeholders.engagement_history[]
        - stakeholders.influence_level
        - stakeholders.champion_strength
        - contracts.end_date
        - accounts.arr
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **CSM Portfolio Health** | Champion Departure Alert Banner | Show critical alerts at top | Real-time |
| **CSM Portfolio Health** | At-Risk Accounts Table | Add "Champion Risk" icon column | Daily |
| **Account Drill-Down (Level 2)** | Stakeholder Panel | Flag departed champions with red badge | Real-time |
| **Account Drill-Down (Level 2)** | Champion Departure Impact Card | Show full impact breakdown | On departure |
| **CSM Activity Dashboard** | Champion Retention KPI | Track avg impact scores | Monthly |
| **CSM Activity Dashboard** | Multi-Threading Score | Show avg relationships per account | Monthly |

### Sample Data

```json
{
  "alert_id": "CHAMP_DEP_STAKE_000053_20251008",
  "account_id": "CUST_000012",
  "champion_id": "STAKE_000053",
  "champion_name": "Dr. Trevor Trantow",
  "departure_date": "2025-10-01",
  "impact_score": 87,
  "impact_level": "CRITICAL",
  "risk_breakdown": {
    "relationship_dependency": 80,
    "champion_influence_score": 95,
    "renewal_proximity": 100,
    "multi_threading_gap": 90
  },
  "arr_at_risk": 320000,
  "alert_status": "Open"
}
```

### Implementation Requirements

**Integration:**
- LinkedIn Sales Navigator API for departure detection
- Email bounce detection (SendGrid/Mailgun webhooks)
- Automated daily check for profile changes

**Backend:**
- Impact scoring algorithm
- Relationship metrics calculation engine
- Alert generation and notification system

**Frontend:**
- Departure alert banner component
- Impact breakdown visualization (radar chart)
- Recommended actions checklist UI

**Estimated Effort:** 40 hours

---

## Gap 5: Expansion Handoff Recommendations 🟡

### Priority: HIGH (Week 7)

### Business Problem
CSMs identify expansion opportunities but lack structured handoff process to Sales. Need readiness scoring and automated AE assignment with talking points.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Expansion Opportunity Identification Rate | Opportunities / Total Accounts | >20% | Monthly |
| Handoff Readiness Accuracy | Successful Handoffs / Total Handoffs | >75% | Quarterly |
| Average Fit Score | AVG(fit_score) for all recommendations | >80 | Monthly |
| Time to Handoff | AVG(Days from Ready to Handoff) | <14 days | Monthly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json
{
  "customer_id": "CUST_000012",
  "customer_name": "Medical Group",
  "health_score": 82,                      // ✅ Available
  "utilization_rate": 86,                  // ✅ Available
  "adoption_stage": "Mature",              // ✅ Available
  "arr": 320000                            // ✅ Available
}

// FROM: stakeholders.json
{
  "champion_strength": "Strong",           // ✅ Available
  "engagement_score": 8                    // ✅ Available
}

// FROM: licenses (nested in accounts.json)
{
  "product_family": "Duo",                 // ✅ Available
  "product_id": "PROD_DUO_001",
  "utilization_rate": 86                   // ✅ Available
}
```

**No modifications to existing JSONs required** - only read access.

### New JSON Required

#### File: `expansion_handoff_recommendations.json`

**Schema Definition:**
```json
{
  "handoff_id": "EXP_HANDOFF_CUST_000012_20251008",
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",
  "recommendation_date": "2025-10-08T14:23:00Z",
  "recommended_by_csm": "CSM_001",
  "csm_name": "Jane Doe",
  
  "readiness_score": 87,                    // Composite 0-100
  "readiness_category": "READY NOW",        // READY NOW (85-100) | READY SOON (70-84) | NOT READY (<70)
  
  "readiness_components": {
    "foundation_health": 92,                // 0-100: From health_score
    "adoption_maturity": 85,                // 0-100: From adoption_stage
    "engagement_quality": 82,               // 0-100: From stakeholder engagement
    "expansion_indicators": 88              // 0-100: From utilization rate
  },
  
  "opportunity_details": {
    "recommended_product": "Umbrella",
    "recommended_product_id": "PROD_UMBRELLA_001",
    "fit_score": 85,                        // 0-100: Product fit algorithm
    "fit_components": {
      "use_case_alignment": 90,
      "peer_adoption_rate": 0.84,
      "tech_stack_compatibility": 85,
      "account_size_match": 92
    },
    "estimated_arr": 120000,
    "win_probability": 0.78,
    "similar_customer_success_rate": 0.84,
    "rationale": "84% of Healthcare accounts your size use Umbrella. Strong DNS security use case alignment.",
    "priority_ranking": 1
  },
  
  "current_products_owned": [
    "Meraki",
    "Duo"
  ],
  
  "recommended_ae": "John Smith",
  "recommended_ae_id": "AE_045",
  "recommended_ae_email": "jsmith@cisco.com",
  "ae_territory": "Healthcare West",
  "ae_assignment_logic": "Territory mapping + Healthcare specialization",
  
  "talking_points": [
    {
      "category": "Account Health",
      "point": "Account health is 82 - strong foundation for expansion",
      "data_source": "accounts.health_score"
    },
    {
      "category": "Engagement",
      "point": "Current utilization at 86% - showing high engagement",
      "data_source": "accounts.utilization_rate"
    },
    {
      "category": "Customer Need",
      "point": "Customer mentioned 'DNS security' in recent QBR",
      "data_source": "qbr_notes_keyword_match"
    },
    {
      "category": "Peer Benchmark",
      "point": "84% of similar Healthcare accounts use Umbrella",
      "data_source": "peer_benchmark_analysis"
    }
  ],
  
  "next_steps": [
    {
      "step": 1,
      "action": "CSM introduces AE in next customer call",
      "owner": "CSM",
      "timeline": "Within 7 days",
      "status": "Pending"
    },
    {
      "step": 2,
      "action": "AE schedules discovery call",
      "owner": "AE",
      "timeline": "Within 14 days of introduction",
      "status": "Pending"
    },
    {
      "step": 3,
      "action": "AE creates opportunity in Salesforce",
      "owner": "AE",
      "timeline": "After discovery call",
      "status": "Pending"
    }
  ],
  
  "handoff_status": "Pending",              // Pending | Introduced | AE Engaged | Opportunity Created | Closed Won | Closed Lost
  "handoff_initiated_date": null,
  "ae_first_contact_date": null,
  "opportunity_id": null,
  "opportunity_created_date": null,
  "closed_date": null,
  "closed_won": null,
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

**Field Type Definitions:**
```typescript
interface ExpansionHandoffRecommendation {
  handoff_id: string;                 // PK
  account_id: string;                 // FK → accounts.json
  account_name: string;
  recommendation_date: string;
  recommended_by_csm: string;
  csm_name: string;
  
  readiness_score: number;            // 0-100
  readiness_category: "READY NOW" | "READY SOON" | "NOT READY";
  
  readiness_components: {
    foundation_health: number;
    adoption_maturity: number;
    engagement_quality: number;
    expansion_indicators: number;
  };
  
  opportunity_details: OpportunityDetails;
  
  current_products_owned: string[];
  
  recommended_ae: string;
  recommended_ae_id: string;
  recommended_ae_email: string;
  ae_territory: string;
  ae_assignment_logic: string;
  
  talking_points: TalkingPoint[];
  next_steps: NextStep[];
  
  handoff_status: "Pending" | "Introduced" | "AE Engaged" | "Opportunity Created" | "Closed Won" | "Closed Lost";
  handoff_initiated_date: string | null;
  ae_first_contact_date: string | null;
  opportunity_id: string | null;
  opportunity_created_date: string | null;
  closed_date: string | null;
  closed_won: boolean | null;
  
  last_updated: string;
}

interface OpportunityDetails {
  recommended_product: string;
  recommended_product_id: string;
  fit_score: number;
  fit_components: {
    use_case_alignment: number;
    peer_adoption_rate: number;
    tech_stack_compatibility: number;
    account_size_match: number;
  };
  estimated_arr: number;
  win_probability: number;
  similar_customer_success_rate: number;
  rationale: string;
  priority_ranking: number;
}

interface TalkingPoint {
  category: string;
  point: string;
  data_source: string;
}

interface NextStep {
  step: number;
  action: string;
  owner: string;
  timeline: string;
  status: "Pending" | "In Progress" | "Completed";
}
```

### JSON Relationships

```
expansion_handoff_recommendations.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► opportunity_id → Salesforce Opportunities (External)
  └─► READS (no writes):
        - accounts.health_score
        - accounts.utilization_rate
        - accounts.adoption_stage
        - accounts.licenses[]
        - stakeholders.champion_strength
        - stakeholders.engagement_score
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **Account Drill-Down (Level 2)** | Expansion Opportunity Card | Show recommended products with fit scores | Weekly |
| **CSM Portfolio Health** | Expansion Ready Accounts Table | List accounts with readiness_category="READY NOW" | Weekly |
| **CSM Activity Dashboard** | Expansion Handoff Rate KPI | Show handoffs initiated / month | Monthly |

### Sample Data

```json
{
  "handoff_id": "EXP_HANDOFF_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "readiness_score": 87,
  "readiness_category": "READY NOW",
  "opportunity_details": {
    "recommended_product": "Umbrella",
    "fit_score": 85,
    "estimated_arr": 120000,
    "win_probability": 0.78
  },
  "recommended_ae": "John Smith",
  "handoff_status": "Pending"
}
```

### Implementation Requirements

**Backend:**
- Readiness scoring algorithm
- Product fit scoring (multi-factor)
- AE assignment logic (territory + specialization)
- Talking points generator (LLM-based)

**Frontend:**
- Expansion opportunity card component
- Readiness scorecard visualization
- Handoff workflow tracker

**Integration:**
- Salesforce for opportunity tracking
- AE directory API for assignments
- Peer benchmark database

**Estimated Effort:** 36 hours

---

## Gap 6: Expansion Handoff Success Rate 🟡

### Priority: HIGH (Week 7)

### Business Problem
No tracking of handoff effectiveness. Need metrics on AE engagement rates, time to follow-up, and conversion rates by AE and product.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Handoff Success Rate | Engaged within 7d / Total Handoffs | >82% | Monthly |
| Average Time to AE Engagement | AVG(AE First Contact - Handoff Date) | <4.2 days | Monthly |
| Conversion to Opportunity | Opportunities Created / Total Handoffs | >68% | Quarterly |
| Conversion to Closed Won | Closed Won / Total Handoffs | >24% | Quarterly |

### Existing JSON Fields Used (Read-Only)

**None directly** - This is a new tracking system that references:
- `expansion_handoff_recommendations.json` (handoff events)
- Salesforce Opportunities (external system)

### New JSON Required

#### File: `expansion_handoff_tracking.json`

**Schema Definition:**
```json
{
  "tracking_period": "2025-Q3",
  "period_start": "2025-07-01",
  "period_end": "2025-09-30",
  "csm_id": "CSM_001",
  "csm_name": "Jane Doe",
  
  "summary_metrics": {
    "total_handoffs_90d": 34,
    "engaged_within_7d": 28,
    "engagement_rate": 0.82,
    "avg_time_to_engagement_days": 4.2,
    "not_engaged_count": 6
  },
  
  "conversion_metrics": {
    "to_opportunity_created": 0.68,
    "to_opportunity_created_count": 23,
    "to_closed_won": 0.24,
    "to_closed_won_count": 8,
    "to_closed_lost": 0.15,
    "to_closed_lost_count": 5,
    "still_in_progress": 10
  },
  
  "by_ae": [
    {
      "ae_name": "John Smith",
      "ae_id": "AE_045",
      "handoffs_received": 12,
      "engaged": 11,
      "engagement_rate": 0.92,
      "avg_time_to_engagement_days": 3.1,
      "opportunities_created": 9,
      "closed_won": 4,
      "win_rate": 0.44
    },
    {
      "ae_name": "Sarah Johnson",
      "ae_id": "AE_067",
      "handoffs_received": 10,
      "engaged": 8,
      "engagement_rate": 0.80,
      "avg_time_to_engagement_days": 5.2,
      "opportunities_created": 6,
      "closed_won": 2,
      "win_rate": 0.33
    },
    {
      "ae_name": "Michael Chen",
      "ae_id": "AE_089",
      "handoffs_received": 12,
      "engaged": 9,
      "engagement_rate": 0.75,
      "avg_time_to_engagement_days": 4.8,
      "opportunities_created": 8,
      "closed_won": 2,
      "win_rate": 0.25
    }
  ],
  
  "by_product": [
    {
      "product": "Umbrella",
      "handoffs": 15,
      "engaged": 13,
      "engagement_rate": 0.87,
      "opportunities_created": 10,
      "closed_won": 4,
      "win_rate": 0.40,
      "avg_deal_size": 118000
    },
    {
      "product": "ThousandEyes",
      "handoffs": 10,
      "engaged": 8,
      "engagement_rate": 0.80,
      "opportunities_created": 6,
      "closed_won": 2,
      "win_rate": 0.33,
      "avg_deal_size": 92000
    },
    {
      "product": "Splunk",
      "handoffs": 9,
      "engaged": 7,
      "engagement_rate": 0.78,
      "opportunities_created": 7,
      "closed_won": 2,
      "win_rate": 0.29,
      "avg_deal_size": 156000
    }
  ],
  
  "individual_handoffs": [
    {
      "handoff_id": "EXP_HANDOFF_CUST_000012_20250915",
      "account_id": "CUST_000012",
      "account_name": "Medical Group",
      "handoff_date": "2025-09-15",
      "recommended_product": "Umbrella",
      "assigned_ae": "John Smith",
      "assigned_ae_id": "AE_045",
      "csm_name": "Jane Doe",
      
      "ae_engaged": true,
      "sales_first_touch_date": "2025-09-18",
      "days_to_engagement": 3,
      
      "opportunity_created": true,
      "opportunity_id": "OPP_12345",
      "opportunity_created_date": "2025-09-20",
      "opportunity_stage": "Discovery",
      "opportunity_amount": 120000,
      
      "closed_won_date": null,
      "closed_lost_date": null,
      "closed_lost_reason": null,
      
      "status": "In Progress",
      "last_updated": "2025-10-08"
    },
    {
      "handoff_id": "EXP_HANDOFF_CUST_000045_20250901",
      "account_id": "CUST_000045",
      "account_name": "Tech Solutions",
      "handoff_date": "2025-09-01",
      "recommended_product": "ThousandEyes",
      "assigned_ae": "Sarah Johnson",
      "assigned_ae_id": "AE_067",
      "csm_name": "Jane Doe",
      
      "ae_engaged": false,
      "sales_first_touch_date": null,
      "days_to_engagement": null,
      
      "opportunity_created": false,
      "opportunity_id": null,
      
      "status": "Not Engaged",
      "last_updated": "2025-10-08"
    }
  ],
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

**Field Type Definitions:**
```typescript
interface ExpansionHandoffTracking {
  tracking_period: string;
  period_start: string;
  period_end: string;
  csm_id: string;
  csm_name: string;
  
  summary_metrics: SummaryMetrics;
  conversion_metrics: ConversionMetrics;
  
  by_ae: AEBreakdown[];
  by_product: ProductBreakdown[];
  
  individual_handoffs: IndividualHandoff[];
  
  last_updated: string;
}

interface SummaryMetrics {
  total_handoffs_90d: number;
  engaged_within_7d: number;
  engagement_rate: number;
  avg_time_to_engagement_days: number;
  not_engaged_count: number;
}

interface ConversionMetrics {
  to_opportunity_created: number;
  to_opportunity_created_count: number;
  to_closed_won: number;
  to_closed_won_count: number;
  to_closed_lost: number;
  to_closed_lost_count: number;
  still_in_progress: number;
}

interface AEBreakdown {
  ae_name: string;
  ae_id: string;
  handoffs_received: number;
  engaged: number;
  engagement_rate: number;
  avg_time_to_engagement_days: number;
  opportunities_created: number;
  closed_won: number;
  win_rate: number;
}

interface ProductBreakdown {
  product: string;
  handoffs: number;
  engaged: number;
  engagement_rate: number;
  opportunities_created: number;
  closed_won: number;
  win_rate: number;
  avg_deal_size: number;
}

interface IndividualHandoff {
  handoff_id: string;
  account_id: string;
  account_name: string;
  handoff_date: string;
  recommended_product: string;
  assigned_ae: string;
  assigned_ae_id: string;
  csm_name: string;
  
  ae_engaged: boolean;
  sales_first_touch_date: string | null;
  days_to_engagement: number | null;
  
  opportunity_created: boolean;
  opportunity_id: string | null;
  opportunity_created_date: string | null;
  opportunity_stage: string | null;
  opportunity_amount: number | null;
  
  closed_won_date: string | null;
  closed_lost_date: string | null;
  closed_lost_reason: string | null;
  
  status: "In Progress" | "Closed Won" | "Closed Lost" | "Not Engaged";
  last_updated: string;
}
```

### JSON Relationships

```
expansion_handoff_tracking.json
  └─► Aggregates data from: expansion_handoff_recommendations.json
  └─► opportunity_id → Salesforce Opportunities (External FK)
  └─► account_id → accounts.json (Reference)
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **CSM Activity Dashboard** | Expansion Handoff Success Rate KPI | Show engagement_rate metric | Weekly |
| **CSM Activity Dashboard** | AE Performance Table | Show by_ae[] breakdown | Monthly |
| **CSM Activity Dashboard** | Product Conversion Chart | Show by_product[] win rates | Quarterly |
| **CSM Activity Dashboard** | Handoff Timeline | Show individual_handoffs[] with status | Real-time |

### Sample Data

```json
{
  "tracking_period": "2025-Q3",
  "csm_id": "CSM_001",
  "summary_metrics": {
    "total_handoffs_90d": 34,
    "engaged_within_7d": 28,
    "engagement_rate": 0.82
  },
  "conversion_metrics": {
    "to_opportunity_created": 0.68,
    "to_closed_won": 0.24
  }
}
```

### Implementation Requirements

**Backend:**
- Handoff aggregation engine
- Salesforce webhook integration for opportunity updates
- AE engagement tracking
- Automated metrics calculation (nightly job)

**Frontend:**
- Handoff success rate dashboard
- AE leaderboard table
- Product conversion funnel chart
- Individual handoff status tracker

**Integration:**
- Salesforce Opportunities API
- AE activity tracking (Outreach/Salesloft)
- Email engagement tracking

**Estimated Effort:** 32 hours

---

## Gap 7: White-Space ARR Potential 🟡

### Priority: HIGH (Week 8)

### Business Problem
CSMs need visibility into which products customers don't own and the estimated ARR potential. Requires product fit scoring and peer benchmarks.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| White-Space Identification Rate | Accounts with Opportunities / Total Accounts | >65% | Monthly |
| Average White-Space ARR per Account | AVG(total_white_space_arr) | Track trend | Monthly |
| Total Portfolio White-Space ARR | SUM(total_white_space_arr) | Track trend | Quarterly |
| Fit Score Accuracy | Realized Fit / Predicted Fit | >0.85 | Quarterly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json (licenses nested)
{
  "customer_id": "CUST_000012",
  "customer_name": "Medical Group",
  "industry": "Healthcare",
  "employee_count": 5000,
  "current_arr": 320000,
  
  "licenses": [
    {
      "product_family": "Duo",             // ✅ Can identify owned products
      "product_id": "PROD_DUO_001",
      "license_type": "Premier"
    },
    {
      "product_family": "Meraki",
      "product_id": "PROD_MERAKI_001",
      "license_type": "Enterprise"
    }
  ]
}

// FROM: products.json (assumed - product catalog)
{
  "product_family": "Umbrella",            // ✅ All available products
  "product_id": "PROD_UMBRELLA_001",
  "product_category": "Security"
}
```

**No modifications to existing JSONs required** - only read access.

### New JSON Required

#### File: `white_space_analysis.json`

**Schema Definition:**
```json
{
  "analysis_id": "WS_CUST_000012_20251008",
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",
  "industry": "Healthcare",
  "employee_count": 5000,
  "analysis_date": "2025-10-08T14:23:00Z",
  
  "current_arr": 320000,
  "owned_products": ["Meraki", "Duo"],
  
  "white_space_opportunities": [
    {
      "product": "Umbrella",
      "product_id": "PROD_UMBRELLA_001",
      "product_category": "Security",
      
      "fit_score": 87,                     // 0-100: Multi-factor algorithm
      "fit_tier": "Excellent",             // Excellent (85-100) | Good (70-84) | Fair (50-69) | Poor (<50)
      
      "fit_components": {
        "industry_match": 95,              // Umbrella adoption high in Healthcare
        "use_case_alignment": 85,          // DNS security aligns with Duo ownership
        "peer_adoption_rate": 0.84,        // 84% of peers use Umbrella
        "tech_stack_compatibility": 80,    // Integrates with Duo
        "account_size_match": 90           // ARR tier matches typical Umbrella customers
      },
      
      "estimated_arr": 120000,
      "arr_confidence": "HIGH",            // HIGH | MEDIUM | LOW
      "arr_estimation_method": "Peer benchmark: avg Healthcare 5K employees",
      
      "peer_benchmarks": {
        "peer_group": "Healthcare 3K-7K employees",
        "peer_sample_size": 247,
        "avg_arr_for_product": 118000,
        "median_arr_for_product": 110000,
        "adoption_rate": 0.84
      },
      
      "use_case": "DNS security and web filtering",
      "integration_benefits": "Integrates with your existing Duo deployment for unified security",
      
      "rationale": [
        "87% of Healthcare accounts your size use Umbrella",
        "Integrates seamlessly with your existing Duo deployment",
        "Addresses DNS security concerns mentioned in recent QBR notes",
        "Typical implementation: 60 days"
      ],
      
      "priority_ranking": 1,
      "recommended_next_step": "Schedule discovery call with Security team"
    },
    {
      "product": "ThousandEyes",
      "product_id": "PROD_THOUSANDEYES_001",
      "product_category": "Observability",
      
      "fit_score": 72,
      "fit_tier": "Good",
      
      "fit_components": {
        "industry_match": 78,
        "use_case_alignment": 70,
        "peer_adoption_rate": 0.54,
        "tech_stack_compatibility": 85,
        "account_size_match": 75
      },
      
      "estimated_arr": 85000,
      "arr_confidence": "MEDIUM",
      "arr_estimation_method": "Peer benchmark with ±25% variance",
      
      "peer_benchmarks": {
        "peer_group": "Healthcare 3K-7K employees with Meraki",
        "peer_sample_size": 134,
        "avg_arr_for_product": 87000,
        "median_arr_for_product": 82000,
        "adoption_rate": 0.54
      },
      
      "use_case": "Network performance monitoring and visibility",
      "integration_benefits": "Complements Meraki for end-to-end network visibility",
      
      "rationale": [
        "Network visibility complements Meraki infrastructure",
        "Monitor performance across all locations",
        "54% of Meraki customers your size use ThousandEyes"
      ],
      
      "priority_ranking": 2,
      "recommended_next_step": "Assess network monitoring pain points"
    },
    {
      "product": "Splunk",
      "product_id": "PROD_SPLUNK_001",
      "product_category": "Observability",
      
      "fit_score": 65,
      "fit_tier": "Fair",
      
      "fit_components": {
        "industry_match": 82,
        "use_case_alignment": 60,
        "peer_adoption_rate": 0.38,
        "tech_stack_compatibility": 70,
        "account_size_match": 75
      },
      
      "estimated_arr": 180000,
      "arr_confidence": "LOW",
      "arr_estimation_method": "Industry avg with high variance",
      
      "peer_benchmarks": {
        "peer_group": "Healthcare 3K-7K employees",
        "peer_sample_size": 94,
        "avg_arr_for_product": 175000,
        "median_arr_for_product": 165000,
        "adoption_rate": 0.38
      },
      
      "use_case": "Security information and event management (SIEM)",
      "integration_benefits": "Centralized logging for Duo, Meraki, Umbrella",
      
      "rationale": [
        "38% adoption rate in peer group (moderate fit)",
        "Higher price point may require executive buy-in",
        "Consider after Umbrella adoption"
      ],
      
      "priority_ranking": 3,
      "recommended_next_step": "Qualify SIEM requirements"
    }
  ],
  
  "total_white_space_arr": 385000,
  "expansion_potential_ratio": 1.20,       // White-space ARR / Current ARR
  
  "summary": "Account has $385K in identified white-space ARR across 3 products (1.2x current ARR). Umbrella is highest priority with excellent fit (87 score) and $120K potential.",
  
  "last_updated": "2025-10-08T14:23:00Z",
  "next_refresh_date": "2025-11-08"
}
```

**Field Type Definitions:**
```typescript
interface WhiteSpaceAnalysis {
  analysis_id: string;                // PK
  account_id: string;                 // FK → accounts.json
  account_name: string;
  industry: string;
  employee_count: number;
  analysis_date: string;
  
  current_arr: number;
  owned_products: string[];
  
  white_space_opportunities: WhiteSpaceOpportunity[];
  
  total_white_space_arr: number;
  expansion_potential_ratio: number;
  
  summary: string;
  
  last_updated: string;
  next_refresh_date: string;
}

interface WhiteSpaceOpportunity {
  product: string;
  product_id: string;
  product_category: string;
  
  fit_score: number;                  // 0-100
  fit_tier: "Excellent" | "Good" | "Fair" | "Poor";
  
  fit_components: {
    industry_match: number;
    use_case_alignment: number;
    peer_adoption_rate: number;
    tech_stack_compatibility: number;
    account_size_match: number;
  };
  
  estimated_arr: number;
  arr_confidence: "HIGH" | "MEDIUM" | "LOW";
  arr_estimation_method: string;
  
  peer_benchmarks: {
    peer_group: string;
    peer_sample_size: number;
    avg_arr_for_product: number;
    median_arr_for_product: number;
    adoption_rate: number;
  };
  
  use_case: string;
  integration_benefits: string;
  
  rationale: string[];
  
  priority_ranking: number;
  recommended_next_step: string;
}
```

### Calculation Formulas

```javascript
// Fit Score (0-100)
fit_score = 
  (industry_match × 0.25) +
  (use_case_alignment × 0.25) +
  (peer_adoption_rate × 100 × 0.20) +
  (tech_stack_compatibility × 0.15) +
  (account_size_match × 0.15)

// Industry Match (0-100)
industry_match = 
  peer_adoption_rate_in_industry × 100
  // If Healthcare adoption is 84%, score is 84

// Use Case Alignment (0-100)
use_case_alignment = 
  IF product_integrates_with_owned THEN base_score + 15
  ELSE base_score

// Tech Stack Compatibility (0-100)
tech_stack_compatibility = 
  COUNT(owned_products_that_integrate) × 20
  // Max 100 if 5+ integrations

// Account Size Match (0-100)
account_size_match = 
  100 - ABS(account_arr - typical_arr_for_product) / typical_arr_for_product × 100
  // Closer to typical customer size = higher score

// Expansion Potential Ratio
expansion_potential_ratio = total_white_space_arr / current_arr
```

### JSON Relationships

```
white_space_analysis.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS (no writes):
        - accounts.licenses[] (owned products)
        - accounts.arr (current spend)
        - accounts.industry
        - accounts.employee_count
  └─► REQUIRES EXTERNAL:
        - Peer benchmark database (industry comparisons)
        - Product catalog (products.json)
        - Pricing database (typical ARR by product + size)
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **Account Drill-Down (Level 2)** | White-Space Opportunities Card | Show top 3 opportunities with fit scores | Monthly |
| **Account Drill-Down (Level 2)** | White-Space ARR Gauge | Show total_white_space_arr vs current_arr | Monthly |
| **CSM Portfolio Health** | White-Space Summary Table | Show total white-space across portfolio | Quarterly |
| **CSM Activity Dashboard** | Expansion Potential KPI | Show avg expansion_potential_ratio | Quarterly |

### Sample Data

```json
{
  "analysis_id": "WS_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "current_arr": 320000,
  "owned_products": ["Meraki", "Duo"],
  "white_space_opportunities": [
    {
      "product": "Umbrella",
      "fit_score": 87,
      "estimated_arr": 120000,
      "priority_ranking": 1
    }
  ],
  "total_white_space_arr": 385000,
  "expansion_potential_ratio": 1.20
}
```

### Implementation Requirements

**Backend:**
- Product fit scoring algorithm (6 factors)
- Peer benchmark analysis engine
- Pricing estimation model
- Monthly refresh job

**Frontend:**
- White-space opportunities card
- Fit score visualization (progress bars)
- Peer benchmark comparison charts

**Integration:**
- Peer benchmark database
- Product catalog API
- Pricing database

**Estimated Effort:** 44 hours

---

## Gap 8: Multi-Product Readiness Score 🟢

### Priority: MEDIUM (Week 9)

### Business Problem
CSMs need a composite score indicating if an account is ready for expansion handoff. Combines health, adoption, engagement, and usage signals.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Readiness Score Distribution | Accounts by readiness_category | Track trends | Monthly |
| Average Readiness Score | AVG(readiness_score) across portfolio | >75 | Monthly |
| Ready Now Accounts | COUNT where readiness_category="READY NOW" | Track trend | Weekly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json
{
  "customer_id": "CUST_000012",
  "health_score": 82,                      // ✅ Available (foundation_health)
  "adoption_stage": "Mature",              // ✅ Available (adoption_maturity)
  "utilization_rate": 86                   // ✅ Available (expansion indicators)
}

// FROM: stakeholders.json
{
  "engagement_score": 8,                   // ✅ Available (engagement_quality)
  "champion_strength": "Strong"            // ✅ Available
}

// FROM: users.json
{
  "activity_level": "High"                 // ✅ Available (usage signals)
}
```

**No modifications to existing JSONs required** - only read access.

### New JSON Required

#### File: `multi_product_readiness.json`

**Schema Definition:**
```json
{
  "readiness_id": "MPR_CUST_000012_20251008",
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",
  "calculation_date": "2025-10-08T14:23:00Z",
  
  "readiness_score": 87,                    // Composite 0-100
  "readiness_category": "READY NOW",        // READY NOW (85-100) | READY SOON (70-84) | NOT READY (<70)
  
  "component_scores": {
    "foundation_health": 92,                // From accounts.health_score
    "adoption_maturity": 85,                // From accounts.adoption_stage
    "engagement_quality": 82,               // From stakeholders.engagement_score
    "expansion_indicators": 88              // From accounts.utilization_rate + usage signals
  },
  
  "component_details": {
    "foundation_health": {
      "score": 92,
      "weight": 0.35,
      "contribution": 32.2,
      "data_points": {
        "health_score": 82,
        "churn_risk": "Low",
        "trend": "Improving"
      }
    },
    "adoption_maturity": {
      "score": 85,
      "weight": 0.25,
      "contribution": 21.25,
      "data_points": {
        "adoption_stage": "Mature",
        "feature_adoption_rate": 0.73,
        "power_user_count": 42
      }
    },
    "engagement_quality": {
      "score": 82,
      "weight": 0.20,
      "contribution": 16.4,
      "data_points": {
        "engagement_score": 8,
        "champion_strength": "Strong",
        "executive_touches_90d": 3
      }
    },
    "expansion_indicators": {
      "score": 88,
      "weight": 0.20,
      "contribution": 17.6,
      "data_points": {
        "utilization_rate": 86,
        "usage_growth_trend": "Growing",
        "capacity_constraint": true
      }
    }
  },
  
  "blockers_to_readiness": [],              // Empty if ready
  
  "readiness_tier_thresholds": {
    "ready_now": 85,
    "ready_soon": 70,
    "not_ready": 0
  },
  
  "recommended_action": "Hand off to Sales AE for Umbrella cross-sell",
  "recommended_product": "Umbrella",
  "estimated_opportunity_arr": 120000,
  "win_probability": 0.78,
  
  "historical_readiness_trend": [
    {"date": "2025-10-01", "score": 87},
    {"date": "2025-09-01", "score": 84},
    {"date": "2025-08-01", "score": 79}
  ],
  
  "last_updated": "2025-10-08T14:23:00Z",
  "next_calculation_date": "2025-10-15"
}
```

**Field Type Definitions:**
```typescript
interface MultiProductReadiness {
  readiness_id: string;               // PK
  account_id: string;                 // FK → accounts.json
  account_name: string;
  calculation_date: string;
  
  readiness_score: number;            // 0-100
  readiness_category: "READY NOW" | "READY SOON" | "NOT READY";
  
  component_scores: {
    foundation_health: number;
    adoption_maturity: number;
    engagement_quality: number;
    expansion_indicators: number;
  };
  
  component_details: Record<string, ComponentDetail>;
  
  blockers_to_readiness: string[];
  
  readiness_tier_thresholds: {
    ready_now: number;
    ready_soon: number;
    not_ready: number;
  };
  
  recommended_action: string;
  recommended_product: string;
  estimated_opportunity_arr: number;
  win_probability: number;
  
  historical_readiness_trend: HistoricalScore[];
  
  last_updated: string;
  next_calculation_date: string;
}

interface ComponentDetail {
  score: number;
  weight: number;
  contribution: number;
  data_points: Record<string, any>;
}

interface HistoricalScore {
  date: string;
  score: number;
}
```

### Calculation Formulas

```javascript
// Readiness Score (0-100)
readiness_score = 
  (foundation_health × 0.35) +
  (adoption_maturity × 0.25) +
  (engagement_quality × 0.20) +
  (expansion_indicators × 0.20)

// Foundation Health (0-100)
foundation_health = accounts.health_score × 1.15
// Boost by 15% if health_score > 80

// Adoption Maturity (0-100)
adoption_maturity_map = {
  "Getting Started": 40,
  "Growing": 60,
  "Mature": 85,
  "Optimizing": 95
}
adoption_maturity = adoption_maturity_map[accounts.adoption_stage]

// Engagement Quality (0-100)
engagement_quality = 
  (stakeholders.engagement_score × 10) × 0.60 +
  (champion_strength_score × 0.40)

champion_strength_score = {
  "Strong": 100,
  "Medium": 70,
  "Weak": 40,
  "None": 0
}[stakeholders.champion_strength]

// Expansion Indicators (0-100)
expansion_indicators = 
  (utilization_rate × 0.50) +
  (usage_growth_score × 0.30) +
  (capacity_constraint_score × 0.20)
```

### JSON Relationships

```
multi_product_readiness.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS (no writes):
        - accounts.health_score
        - accounts.adoption_stage
        - accounts.utilization_rate
        - stakeholders.engagement_score
        - stakeholders.champion_strength
        - users.activity_level
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **CSM Portfolio Health** | Readiness Score Distribution Chart | Show accounts by readiness_category | Weekly |
| **Account Drill-Down (Level 2)** | Readiness Scorecard | Show component breakdown | Weekly |
| **CSM Activity Dashboard** | Ready Now Accounts KPI | COUNT(readiness_category="READY NOW") | Daily |

### Sample Data

```json
{
  "readiness_id": "MPR_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "readiness_score": 87,
  "readiness_category": "READY NOW",
  "component_scores": {
    "foundation_health": 92,
    "adoption_maturity": 85,
    "engagement_quality": 82,
    "expansion_indicators": 88
  },
  "recommended_action": "Hand off to Sales AE"
}
```

### Implementation Requirements

**Backend:**
- Composite scoring algorithm
- Weekly automated calculation
- Historical trend tracking

**Frontend:**
- Readiness scorecard component
- Component breakdown radar chart
- Trend line chart

**Estimated Effort:** 24 hours

---

## Gap 9: Product Bundle Recommendations 🟢

### Priority: MEDIUM (Week 10)

### Business Problem
CSMs need data-driven product pairing recommendations based on historical adoption patterns. Which products do customers typically buy together?

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Bundle Recommendation Accuracy | Realized Bundles / Recommended | >70% | Quarterly |
| Average Pairing Rate | AVG(pairing_rate) for top recommendations | >0.75 | Monthly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json (licenses nested)
{
  "customer_id": "CUST_000012",
  "licenses": [
    {
      "product_family": "Meraki",          // ✅ Can identify current products
      "product_id": "PROD_MERAKI_001"
    },
    {
      "product_family": "Duo",
      "product_id": "PROD_DUO_001"
    }
  ]
}
```

**No modifications to existing JSONs required** - only read access.

### New JSON Required

#### File: `product_bundle_recommendations.json`

**Schema Definition:**
```json
{
  "recommendation_id": "PBR_CUST_000012_20251008",
  "account_id": "CUST_000012",              // FK → accounts.json
  "account_name": "Medical Group",
  "analysis_date": "2025-10-08T14:23:00Z",
  
  "owned_products": ["Meraki", "Duo"],
  
  "recommended_bundles": [
    {
      "product": "Umbrella",
      "product_id": "PROD_UMBRELLA_001",
      "pairing_rate": 0.82,                 // 82% of Duo customers add Umbrella
      "pairing_type": "Duo → Umbrella",
      "rationale": "82% of Duo customers add Umbrella - highest pairing rate in portfolio",
      "use_case": "Complete identity + network security stack",
      "integration_benefits": "Single-sign-on, unified policies, consolidated reporting",
      "avg_time_to_add_days": 150,          // Typical adoption timeline
      "avg_deal_size": 110000,
      "priority_ranking": 1,
      
      "historical_data": {
        "total_duo_customers": 1245,
        "duo_customers_with_umbrella": 1021,
        "sample_period": "Last 3 years"
      }
    },
    {
      "product": "ThousandEyes",
      "product_id": "PROD_THOUSANDEYES_001",
      "pairing_rate": 0.54,
      "pairing_type": "Meraki → ThousandEyes",
      "rationale": "Network visibility complements Meraki infrastructure - common in enterprise deployments",
      "use_case": "Monitor performance across all locations with detailed insights",
      "integration_benefits": "Correlate Meraki device health with end-user experience",
      "avg_time_to_add_days": 240,
      "avg_deal_size": 85000,
      "priority_ranking": 2,
      
      "historical_data": {
        "total_meraki_customers": 2134,
        "meraki_customers_with_thousandeyes": 1152,
        "sample_period": "Last 3 years"
      }
    },
    {
      "product": "Splunk",
      "product_id": "PROD_SPLUNK_001",
      "pairing_rate": 0.31,
      "pairing_type": "Multi-Product → Splunk",
      "rationale": "Centralized logging for customers with 3+ Cisco products",
      "use_case": "SIEM and unified security operations center",
      "integration_benefits": "Aggregate logs from all Cisco security products",
      "avg_time_to_add_days": 365,
      "avg_deal_size": 175000,
      "priority_ranking": 3,
      
      "historical_data": {
        "total_3plus_product_customers": 892,
        "customers_with_splunk": 276,
        "sample_period": "Last 3 years"
      }
    }
  ],
  
  "bundle_summary": "Top recommendation: Umbrella (82% pairing rate with Duo). Typical adoption within 5 months, avg deal size $110K.",
  
  "last_updated": "2025-10-08T14:23:00Z",
  "next_refresh_date": "2025-11-08"
}
```

**Field Type Definitions:**
```typescript
interface ProductBundleRecommendations {
  recommendation_id: string;          // PK
  account_id: string;                 // FK → accounts.json
  account_name: string;
  analysis_date: string;
  
  owned_products: string[];
  
  recommended_bundles: BundleRecommendation[];
  
  bundle_summary: string;
  
  last_updated: string;
  next_refresh_date: string;
}

interface BundleRecommendation {
  product: string;
  product_id: string;
  pairing_rate: number;               // 0-1
  pairing_type: string;
  rationale: string;
  use_case: string;
  integration_benefits: string;
  avg_time_to_add_days: number;
  avg_deal_size: number;
  priority_ranking: number;
  
  historical_data: {
    total_duo_customers?: number;
    duo_customers_with_umbrella?: number;
    total_meraki_customers?: number;
    meraki_customers_with_thousandeyes?: number;
    total_3plus_product_customers?: number;
    customers_with_splunk?: number;
    sample_period: string;
  };
}
```

### JSON Relationships

```
product_bundle_recommendations.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS (no writes):
        - accounts.licenses[] (owned products)
  └─► REQUIRES EXTERNAL:
        - Historical adoption database (product pairing rates)
        - Deal size database (avg ARR by product pairing)
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **Account Drill-Down (Level 2)** | Product Bundle Recommendations Card | Show top 3 pairings | Monthly |
| **CSM Portfolio Health** | Bundle Opportunity Summary | Aggregate bundle recommendations | Quarterly |

### Sample Data

```json
{
  "recommendation_id": "PBR_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "owned_products": ["Meraki", "Duo"],
  "recommended_bundles": [
    {
      "product": "Umbrella",
      "pairing_rate": 0.82,
      "avg_deal_size": 110000,
      "priority_ranking": 1
    }
  ]
}
```

### Implementation Requirements

**Backend:**
- Historical pairing analysis
- Deal size aggregation
- Monthly refresh job

**Frontend:**
- Bundle recommendation card
- Pairing rate visualization

**Estimated Effort:** 20 hours

---

## Gap 10: QBR Completion Rate by Tier 🟢

### Priority: MEDIUM (Week 11)

### Business Problem
CSMs need visibility into QBR compliance by customer tier. Track which accounts are overdue and trend completion rates.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| QBR Completion Rate (Strategic) | Compliant / Total Strategic | >95% | Monthly |
| QBR Completion Rate (Enterprise) | Compliant / Total Enterprise | >90% | Monthly |
| QBR Completion Rate (Commercial) | Compliant / Total Commercial | >75% | Monthly |
| Average Days Since Last QBR | AVG(days_since_last_qbr) | <90 | Monthly |

### Existing JSON Fields Used (Read-Only)

```json
// FROM: accounts.json
{
  "customer_id": "CUST_000012",
  "customer_name": "Medical Group",
  "customer_tier": "Enterprise",           // ✅ Available for segmentation
  "arr": 320000
}
```

**No modifications to existing JSONs required** - only read access.

### New JSON Required

#### File: `qbr_tracking.json`

**Schema Definition:**
```json
{
  "tracking_period": "2025-Q3",
  "period_start": "2025-07-01",
  "period_end": "2025-09-30",
  "csm_id": "CSM_001",
  "csm_name": "Jane Doe",
  
  "by_tier": [
    {
      "tier": "Strategic",
      "qbr_frequency_days": 90,
      "total_accounts": 20,
      "compliant": 19,
      "overdue": 1,
      "completion_rate": 0.95,
      "avg_days_since_last_qbr": 52,
      
      "accounts_needing_qbr": [
        {
          "account_id": "CUST_000001",
          "account_name": "Acme Corp",
          "last_qbr_date": "2025-04-15",
          "days_since_last_qbr": 176,
          "days_overdue": 86,
          "arr": 2500000
        }
      ]
    },
    {
      "tier": "Enterprise",
      "qbr_frequency_days": 90,
      "total_accounts": 45,
      "compliant": 41,
      "overdue": 4,
      "completion_rate": 0.91,
      "avg_days_since_last_qbr": 68,
      
      "accounts_needing_qbr": [...]
    },
    {
      "tier": "Commercial",
      "qbr_frequency_days": 180,
      "total_accounts": 120,
      "compliant": 95,
      "overdue": 25,
      "completion_rate": 0.79,
      "avg_days_since_last_qbr": 142,
      
      "accounts_needing_qbr": [...]
    }
  ],
  
  "by_csm": [
    {
      "csm_name": "Jane Doe",
      "csm_id": "CSM_001",
      "strategic_rate": 0.95,
      "enterprise_rate": 0.91,
      "commercial_rate": 0.79,
      "overall_rate": 0.86,
      "total_accounts": 185
    }
  ],
  
  "qbr_history": [
    {
      "qbr_id": "QBR_CUST_000012_Q3_2025",
      "account_id": "CUST_000012",
      "account_name": "Medical Group",
      "qbr_date": "2025-07-15",
      "qbr_type": "Quarterly",
      "participants": ["CIO", "CISO", "CSM", "Account Manager"],
      "status": "Completed",
      "generation_method": "Auto",
      "prep_time_hours": 3.2
    }
  ],
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

**Field Type Definitions:**
```typescript
interface QBRTracking {
  tracking_period: string;
  period_start: string;
  period_end: string;
  csm_id: string;
  csm_name: string;
  
  by_tier: TierBreakdown[];
  by_csm: CSMBreakdown[];
  
  qbr_history: QBRHistoryRecord[];
  
  last_updated: string;
}

interface TierBreakdown {
  tier: string;
  qbr_frequency_days: number;
  total_accounts: number;
  compliant: number;
  overdue: number;
  completion_rate: number;
  avg_days_since_last_qbr: number;
  accounts_needing_qbr: AccountNeedingQBR[];
}

interface AccountNeedingQBR {
  account_id: string;
  account_name: string;
  last_qbr_date: string;
  days_since_last_qbr: number;
  days_overdue: number;
  arr: number;
}

interface QBRHistoryRecord {
  qbr_id: string;
  account_id: string;
  account_name: string;
  qbr_date: string;
  qbr_type: string;
  participants: string[];
  status: string;
  generation_method: string;
  prep_time_hours: number;
}
```

### JSON Relationships

```
qbr_tracking.json
  └─► Aggregates from: qbr_value_stories.json
  └─► account_id → accounts.json (Reference for tier)
  └─► READS:
        - accounts.customer_tier
        - accounts.arr
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **CSM Activity Dashboard** | QBR Completion Rate by Tier | Show by_tier[] completion rates | Monthly |
| **CSM Activity Dashboard** | QBR Overdue Accounts Table | Show accounts_needing_qbr[] | Weekly |
| **CSM Activity Dashboard** | CSM QBR Performance | Show by_csm[] comparison | Monthly |

### Sample Data

```json
{
  "tracking_period": "2025-Q3",
  "csm_id": "CSM_001",
  "by_tier": [
    {
      "tier": "Strategic",
      "total_accounts": 20,
      "compliant": 19,
      "completion_rate": 0.95
    }
  ]
}
```

### Implementation Requirements

**Backend:**
- QBR event tracking
- Compliance calculation engine
- Overdue alert system

**Frontend:**
- QBR completion dashboard
- Overdue accounts table

**Estimated Effort:** 20 hours

---

## Gap 11: Champion Tenure Tracking 🟢

### Priority: MEDIUM (Week 12)

### Business Problem
CSMs need to track how long champions have been in their roles to assess departure risk. LinkedIn integration for real-time monitoring.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Average Champion Tenure | AVG(tenure_months) across accounts | Track trend | Monthly |
| At-Risk Champion Count | COUNT where tenure_risk_level="At Risk" | Track trend | Monthly |
| LinkedIn Coverage Rate | Champions with LinkedIn Data / Total | >85% | Monthly |

### Existing JSON Enhancement Required

#### **ENHANCE: stakeholders.json** - ADD 5 New Fields

**Current Structure (Keep All Existing Fields):**
```json
{
  "id": "STAKE_000053",
  "account_id": "CUST_000012",
  "name": "Dr. Trevor Trantow",
  "role": "CISO",
  "email": "ttrantow@medicalgroup.com",
  "phone": "+1-555-0123",
  "influence_level": "Medium",
  "engagement_score": 8,
  "champion_strength": "Strong",
  "last_contact": "2025-09-13T13:37:46.764Z",
  "engagement_history": [
    {
      "date": "2025-07-07T08:40:44.285Z",
      "type": "meeting",
      "sentiment": "neutral",
      "csm_id": "CSM_001"
    }
  ]
}
```

**Enhanced Structure (ADD THESE 5 FIELDS):**
```json
{
  // ... all existing fields above ...
  
  // ⭐ NEW FIELD 1: Role Start Date
  "role_start_date": "2024-01-15",
  
  // ⭐ NEW FIELD 2: Tenure in Months
  "tenure_months": 21,
  
  // ⭐ NEW FIELD 3: Tenure Risk Level
  "tenure_risk_level": "Stable",              // "Stable" | "At Risk" | "High Risk" | "Unknown"
  
  // ⭐ NEW FIELD 4: Stability Score
  "stability_score": 85,                      // 0-100: Composite of tenure + LinkedIn signals
  
  // ⭐ NEW FIELD 5: LinkedIn Signals
  "linkedin_signals": {
    "profile_url": "https://linkedin.com/in/trevortrantow",
    "profile_updated_recently": false,
    "profile_last_updated": "2024-11-15",
    "open_to_work": false,
    "job_seeking_activity": "None",          // "None" | "Active" | "Passive"
    "last_checked_date": "2025-10-08",
    "data_available": true
  }
}
```

### New Field Specifications

| Field Name | Type | Description | Calculation | Required |
|------------|------|-------------|-------------|----------|
| `role_start_date` | string (ISO date) | Date when stakeholder started their current role | Manual entry or LinkedIn | Yes |
| `tenure_months` | integer | Number of months in current role | `MONTHS_BETWEEN(CURRENT_DATE, role_start_date)` | Yes |
| `tenure_risk_level` | enum | Risk classification | See formula below | Yes |
| `stability_score` | integer (0-100) | Composite stability score | See formula below | Yes |
| `linkedin_signals` | object | LinkedIn-derived signals | LinkedIn API | No |

### Calculation Formulas

```javascript
// Tenure Months (automatic)
tenure_months = MONTHS_BETWEEN(CURRENT_DATE, role_start_date)

// Tenure Risk Level
tenure_risk_level = 
  IF tenure_months >= 24 THEN "Stable"
  ELSE IF tenure_months >= 12 THEN "At Risk"
  ELSE IF tenure_months < 12 THEN "High Risk"
  ELSE "Unknown"

// Stability Score (0-100)
stability_score = 
  (tenure_component × 0.60) +
  (linkedin_signal_component × 0.40)

tenure_component = 
  MIN(tenure_months / 36 × 100, 100)
  // 36+ months = max 100 score

linkedin_signal_component = 
  IF job_seeking_activity == "Active" THEN 0
  ELSE IF job_seeking_activity == "Passive" THEN 40
  ELSE IF open_to_work == true THEN 30
  ELSE IF profile_updated_recently == true THEN 70
  ELSE 100
```

### Migration Plan

**Backfill Strategy:**
1. **role_start_date:**
   - Try LinkedIn API first
   - Fall back to manual entry by CSMs
   - Use account.customer_relationship_start_date as proxy if unavailable
   
2. **tenure_months:**
   - Calculate automatically once role_start_date is populated
   
3. **tenure_risk_level:**
   - Auto-calculate from tenure_months
   
4. **stability_score:**
   - Calculate after LinkedIn signals are fetched
   
5. **linkedin_signals:**
   - Batch API call to LinkedIn for all stakeholders
   - Daily refresh job

### JSON Relationships

```
stakeholders.json (ENHANCED)
  └─► account_id → accounts.json.customer_id (FK - existing)
  └─► NEW DATA SOURCES:
        - LinkedIn API (linkedin_signals)
        - Manual entry (role_start_date if LinkedIn unavailable)
```

### Dashboard Usage

| Dashboard | Component | Usage | Update Frequency |
|-----------|-----------|-------|------------------|
| **Account Drill-Down (Level 2)** | Stakeholder Panel | Show tenure_months + stability_score | Daily |
| **Account Drill-Down (Level 2)** | Stakeholder Risk Badges | Flag tenure_risk_level="High Risk" | Daily |
| **CSM Portfolio Health** | Champion Stability KPI | AVG(stability_score) across portfolio | Weekly |
| **CSM Activity Dashboard** | At-Risk Champions Count | COUNT(tenure_risk_level="At Risk" OR "High Risk") | Weekly |

### Sample Enhanced Data

```json
{
  "id": "STAKE_000053",
  "account_id": "CUST_000012",
  "name": "Dr. Trevor Trantow",
  "role": "CISO",
  "engagement_score": 8,
  "champion_strength": "Strong",
  
  // ⭐ NEW FIELDS
  "role_start_date": "2024-01-15",
  "tenure_months": 21,
  "tenure_risk_level": "Stable",
  "stability_score": 85,
  "linkedin_signals": {
    "profile_url": "https://linkedin.com/in/trevortrantow",
    "profile_updated_recently": false,
    "open_to_work": false,
    "job_seeking_activity": "None",
    "last_checked_date": "2025-10-08",
    "data_available": true
  }
}
```

### Implementation Requirements

**Integration:**
- LinkedIn Sales Navigator API
- Automated daily refresh job

**Backend:**
- Tenure calculation engine (nightly)
- Stability scoring algorithm
- LinkedIn data sync service
- Backfill script for existing stakeholders

**Frontend:**
- Stakeholder tenure badges
- Stability score visualization
- LinkedIn profile integration

**Data Migration:**
```sql
-- Add new columns to stakeholders table
ALTER TABLE stakeholders 
ADD COLUMN role_start_date DATE,
ADD COLUMN tenure_months INT,
ADD COLUMN tenure_risk_level VARCHAR(20),
ADD COLUMN stability_score INT,
ADD COLUMN linkedin_signals JSONB;

-- Backfill tenure_months for existing records
UPDATE stakeholders 
SET tenure_months = EXTRACT(MONTH FROM AGE(CURRENT_DATE, role_start_date))
WHERE role_start_date IS NOT NULL;

-- Backfill tenure_risk_level