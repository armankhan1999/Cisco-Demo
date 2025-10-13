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

---

### 🆕 New JSON Files Required (10 Files)

**No modifications to existing JSON files except reading data from them.**

All 10 new JSON files are standalone with foreign key relationships to existing files.

---

## Gap 1: Intervention Playbooks 🔴

### Priority: CRITICAL

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
  "customer_id": "CUST_000012",
  "customer_name": "Medical Group",
  "health_score": 52,
  "health_category": "At Risk",
  "churn_risk": "High",
  "arr": 320000
}
```

### New JSON Required: `intervention_playbooks.json`

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
  
  "account_id": "CUST_000012",
  "account_name": "Medical Group",
  "triggered_date": "2025-10-08T14:23:00Z",
  "triggered_by": "System",
  "assigned_csm": "CSM_001",
  "assigned_csm_name": "Jane Doe",
  
  "status": "In Progress",
  
  "steps": [
    {
      "sequence": 1,
      "action": "Schedule emergency call with exec sponsor within 4 hours",
      "description": "Contact executive sponsor immediately to discuss health score drop.",
      "owner_role": "CSM",
      "owner_name": "Jane Doe",
      "sla_hours": 4,
      "priority": "Critical",
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
  
  "outcome": null,
  "outcome_date": null,
  "outcome_notes": "",
  
  "playbook_version": "2.3",
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
intervention_playbooks.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS: accounts.health_score, accounts.churn_risk, accounts.arr
```

---

## Gap 2: QBR Value Story Generator 🔴

### Priority: CRITICAL

### Business Problem
CSMs spend 15-20 hours manually building QBR decks by pulling data from 8+ different systems. Need auto-generated customer-facing value summaries to reduce prep time by 80%.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| QBR Prep Time Reduction | AVG(Manual Hours) - AVG(Auto Hours) | 16h → 3h (-80%) | Monthly |
| Value Metric Coverage | (Metrics Included / Total Available) × 100 | >85% | Per QBR |
| QBR Deck Generation Rate | Auto-Generated QBRs / Total QBRs | >75% | Quarterly |
| Customer Value Documented | SUM(estimated_cost_avoided) | Track trend | Quarterly |

### New JSON Required: `qbr_value_stories.json`

**Schema Definition:**
```json
{
  "qbr_id": "QBR_CUST_000012_Q3_2025",
  "account_id": "CUST_000012",
  "account_name": "Medical Group",
  "time_period": "Q3 2025",
  "period_start": "2025-07-01",
  "period_end": "2025-09-30",
  "generation_date": "2025-09-25T10:30:00Z",
  "generation_method": "Auto",
  "generated_by_csm": "CSM_001",
  "csm_name": "Jane Doe",
  
  "security_value": {
    "threats_blocked": 1247,
    "threats_blocked_prev_period": 1015,
    "threats_trend_pct": 23,
    "estimated_cost_avoided": 340000,
    "cost_per_breach_assumption": 4200000,
    "breach_probability_prevented": 0.081,
    "narrative": "Blocked 1,247 threats (↑23% vs Q2), preventing estimated $340K in breach costs",
    "product_contribution": {
      "Umbrella": 0.60,
      "Duo": 0.40
    },
    "threat_categories": {
      "malware": 458,
      "phishing": 312,
      "ransomware": 89,
      "other": 388
    }
  },
  
  "productivity_value": {
    "users_enabled": 247,
    "baseline_users": 213,
    "user_growth_pct": 16.0,
    "adoption_improvement_pp": 16,
    "time_saved_hours": 1482,
    "time_saved_per_user_hours": 6.0,
    "narrative": "Enabled 247 active users with adoption improved from 62% → 78%, saving 1,482 hours",
    "roi_per_user_annual": 2400
  },
  
  "uptime_value": {
    "uptime_percentage": 99.7,
    "baseline_uptime": 99.4,
    "reliability_improvement_pp": 0.3,
    "downtime_minutes_avoided": 131,
    "estimated_downtime_cost_avoided": 52400,
    "narrative": "Maintained 99.7% uptime, avoiding 131 minutes of downtime ($52K cost avoidance)"
  },
  
  "usage_trends": {
    "dau_growth_pct": 18,
    "features_adopted_count": 7,
    "power_users_count": 42,
    "narrative": "Daily active users grew +18%, 7 features in use, 42 power users identified"
  },
  
  "support_experience": {
    "tickets_resolved": 18,
    "avg_resolution_hours": 6.2,
    "resolution_time_improvement_pct": 21,
    "satisfaction_score": 4.8,
    "p1_incidents": 0,
    "narrative": "Resolved 18 tickets in 6.2h avg (-21% faster) with 4.8/5 satisfaction. Zero P1 incidents."
  },
  
  "recommendations": [
    {
      "type": "Expansion",
      "priority": "High",
      "recommendation": "Utilization at 87% - consider expanding capacity",
      "estimated_arr": 120000,
      "rationale": "Current utilization indicates capacity constraint"
    }
  ],
  
  "executive_summary": "Your deployment delivered $392K in measurable value this quarter.",
  "total_value_documented": 392400,
  
  "deck_url": "https://storage.cisco.com/qbr/CUST_000012_Q3_2025.pdf",
  "deck_generated": true,
  "presented_date": null,
  
  "version": "1.0",
  "last_updated": "2025-09-25T10:30:00Z"
}
```

### JSON Relationships
```
qbr_value_stories.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS: accounts.licenses[], accounts.support_metrics
```

---

## Gap 3: Time to Churn Estimate 🟡

### Priority: HIGH

### Business Problem
CSMs know accounts are "at-risk" but lack time-based predictions for intervention urgency. Need ML-powered estimates of days until churn.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Prediction Accuracy | (Correct Predictions / Total) × 100 | >85% | Monthly |
| Average Intervention Window | AVG(Days to Churn - Days Since Alert) | 45+ days | Weekly |
| Early Detection Rate | Accounts Flagged >30d Before / Total Churns | >80% | Monthly |

### New JSON Required: `churn_predictions.json`

**Schema Definition:**
```json
{
  "prediction_id": "CHURN_PRED_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "account_name": "Medical Group",
  "prediction_date": "2025-10-08T14:23:00Z",
  "model_version": "v2.3",
  "model_type": "Gradient Boosting + Time Series",
  
  "current_health_score": 52,
  "churn_probability": 0.78,
  "churn_probability_tier": "High",
  
  "estimated_churn_date": "2025-11-22",
  "estimated_days_to_churn": 45,
  "confidence_level": "HIGH",
  "confidence_score": 0.87,
  
  "velocity_metrics": {
    "health_velocity": -1.2,
    "health_trend": "Declining",
    "usage_velocity": -0.52,
    "usage_trend": "Declining",
    "engagement_velocity": -0.15,
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
    }
  ],
  
  "intervention_window_days": 45,
  "intervention_urgency": "Immediate",
  "recommended_action": "Immediate executive escalation",
  
  "contract_end_date": "2026-06-22",
  "days_to_renewal": 257,
  "arr_at_risk": 320000,
  
  "model_inputs": {
    "health_score_30d_avg": 58.4,
    "health_velocity_30d": -1.2,
    "utilization_rate_30d_avg": 41.2,
    "support_tickets_30d": 7,
    "executive_touches_90d": 0,
    "champion_strength": "Weak"
  },
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
churn_predictions.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS: accounts.health_history[], contracts.end_date, 
             users.activity_level, stakeholders.engagement_score
```

---

## Gap 4: Champion Departure Impact Score 🟡

### Priority: HIGH

### Business Problem
When key stakeholders leave, CSMs need quantified risk assessment to prioritize response.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Champion Departure Detection Rate | Detected / Total Departures | >90% | Monthly |
| Average Time to Detection | AVG(Detection - Departure Date) | <14 days | Monthly |
| Post-Departure Save Rate | Accounts Saved / Departures | >60% | Quarterly |

### New JSON Required: `champion_departure_alerts.json`

**Schema Definition:**
```json
{
  "alert_id": "CHAMP_DEP_STAKE_000053_20251008",
  "account_id": "CUST_000012",
  "account_name": "Medical Group",
  "champion_id": "STAKE_000053",
  "champion_name": "Dr. Trevor Trantow",
  "champion_role": "CISO",
  
  "departure_detected_date": "2025-10-08",
  "departure_date": "2025-10-01",
  "detection_lag_days": 7,
  "detection_method": "LinkedIn API",
  
  "employment_status": "Departed",
  "new_company": "TechCorp Inc",
  "new_role": "VP of Security",
  
  "impact_score": 87,
  "impact_level": "CRITICAL",
  
  "risk_breakdown": {
    "relationship_dependency": 80,
    "champion_influence_score": 95,
    "renewal_proximity": 100,
    "multi_threading_gap": 90
  },
  
  "relationship_metrics": {
    "total_touches_12m": 24,
    "champion_touch_count": 19,
    "champion_touch_percentage": 0.79,
    "other_active_relationships": 1,
    "executive_level_relationships": 0
  },
  
  "historical_churn_probability": 0.67,
  "arr_at_risk": 320000,
  
  "recommended_actions": [
    {
      "sequence": 1,
      "action": "Identify replacement champion within 7 days",
      "owner": "CSM",
      "sla_days": 7,
      "priority": "Critical",
      "status": "Pending"
    }
  ],
  
  "alert_status": "Open",
  "outcome": null,
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
champion_departure_alerts.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► champion_id → stakeholders.json.id (FK)
  └─► READS: stakeholders.engagement_history[], contracts.end_date
```

---

## Gap 5: Expansion Handoff Recommendations 🟡

### Priority: HIGH

### Business Problem
CSMs identify expansion opportunities but lack structured handoff process to Sales.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Opportunity Identification Rate | Opportunities / Total Accounts | >20% | Monthly |
| Handoff Readiness Accuracy | Successful / Total Handoffs | >75% | Quarterly |

### New JSON Required: `expansion_handoff_recommendations.json`

**Schema Definition:**
```json
{
  "handoff_id": "EXP_HANDOFF_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "account_name": "Medical Group",
  "recommendation_date": "2025-10-08T14:23:00Z",
  "recommended_by_csm": "CSM_001",
  "csm_name": "Jane Doe",
  
  "readiness_score": 87,
  "readiness_category": "READY NOW",
  
  "readiness_components": {
    "foundation_health": 92,
    "adoption_maturity": 85,
    "engagement_quality": 82,
    "expansion_indicators": 88
  },
  
  "opportunity_details": {
    "recommended_product": "Umbrella",
    "recommended_product_id": "PROD_UMBRELLA_001",
    "fit_score": 85,
    "estimated_arr": 120000,
    "win_probability": 0.78,
    "similar_customer_success_rate": 0.84,
    "rationale": "84% of Healthcare accounts your size use Umbrella"
  },
  
  "current_products_owned": ["Meraki", "Duo"],
  
  "recommended_ae": "John Smith",
  "recommended_ae_id": "AE_045",
  "ae_territory": "Healthcare West",
  
  "talking_points": [
    {
      "category": "Account Health",
      "point": "Account health is 82 - strong foundation for expansion",
      "data_source": "accounts.health_score"
    }
  ],
  
  "handoff_status": "Pending",
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
expansion_handoff_recommendations.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS: accounts.health_score, accounts.utilization_rate,
             stakeholders.champion_strength
```

---

## Gap 6: Expansion Handoff Success Rate 🟡

### Priority: HIGH

### Business Problem
No tracking of handoff effectiveness. Need metrics on AE engagement and conversion rates.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Handoff Success Rate | Engaged within 7d / Total | >82% | Monthly |
| Average Time to AE Engagement | AVG(Contact - Handoff Date) | <4.2 days | Monthly |
| Conversion to Opportunity | Created / Total Handoffs | >68% | Quarterly |

### New JSON Required: `expansion_handoff_tracking.json`

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
    "to_closed_won_count": 8
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
    }
  ],
  
  "individual_handoffs": [
    {
      "handoff_id": "EXP_HANDOFF_CUST_000012_20250915",
      "account_id": "CUST_000012",
      "handoff_date": "2025-09-15",
      "recommended_product": "Umbrella",
      "assigned_ae": "John Smith",
      "ae_engaged": true,
      "sales_first_touch_date": "2025-09-18",
      "days_to_engagement": 3,
      "opportunity_created": true,
      "opportunity_id": "OPP_12345",
      "status": "In Progress"
    }
  ],
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
expansion_handoff_tracking.json
  └─► Aggregates: expansion_handoff_recommendations.json
  └─► opportunity_id → Salesforce Opportunities (External)
```

---

## Gap 7: White-Space ARR Potential 🟡

### Priority: HIGH

### Business Problem
CSMs need visibility into which products customers don't own and estimated ARR potential.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| White-Space Identification Rate | Accounts with Opps / Total | >65% | Monthly |
| Average White-Space ARR | AVG(total_white_space_arr) | Track | Monthly |

### New JSON Required: `white_space_analysis.json`

**Schema Definition:**
```json
{
  "analysis_id": "WS_CUST_000012_20251008",
  "account_id": "CUST_000012",
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
      
      "fit_score": 87,
      "fit_tier": "Excellent",
      
      "fit_components": {
        "industry_match": 95,
        "use_case_alignment": 85,
        "peer_adoption_rate": 0.84,
        "tech_stack_compatibility": 80,
        "account_size_match": 90
      },
      
      "estimated_arr": 120000,
      "arr_confidence": "HIGH",
      
      "peer_benchmarks": {
        "peer_group": "Healthcare 3K-7K employees",
        "peer_sample_size": 247,
        "avg_arr_for_product": 118000,
        "adoption_rate": 0.84
      },
      
      "use_case": "DNS security and web filtering",
      "integration_benefits": "Integrates with existing Duo deployment",
      
      "rationale": [
        "87% of Healthcare accounts your size use Umbrella",
        "Integrates seamlessly with your existing Duo deployment"
      ],
      
      "priority_ranking": 1
    }
  ],
  
  "total_white_space_arr": 385000,
  "expansion_potential_ratio": 1.20,
  
  "summary": "Account has $385K in white-space ARR across 3 products",
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
white_space_analysis.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS: accounts.licenses[], accounts.industry
  └─► EXTERNAL: Peer benchmark database, Product catalog
```

---

## Gap 8: Multi-Product Readiness Score 🟢

### Priority: MEDIUM

### Business Problem
CSMs need composite score indicating if an account is ready for expansion handoff.

### New JSON Required: `multi_product_readiness.json`

**Schema Definition:**
```json
{
  "readiness_id": "MPR_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "account_name": "Medical Group",
  "calculation_date": "2025-10-08T14:23:00Z",
  
  "readiness_score": 87,
  "readiness_category": "READY NOW",
  
  "component_scores": {
    "foundation_health": 92,
    "adoption_maturity": 85,
    "engagement_quality": 82,
    "expansion_indicators": 88
  },
  
  "recommended_action": "Hand off to Sales AE for Umbrella cross-sell",
  "estimated_opportunity_arr": 120000,
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
multi_product_readiness.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS: accounts.health_score, accounts.adoption_stage,
             stakeholders.engagement_score
```

---

## Gap 9: Product Bundle Recommendations 🟢

### Priority: MEDIUM

### Business Problem
CSMs need data-driven product pairing recommendations based on historical adoption patterns.

### New JSON Required: `product_bundle_recommendations.json`

**Schema Definition:**
```json
{
  "recommendation_id": "PBR_CUST_000012_20251008",
  "account_id": "CUST_000012",
  "account_name": "Medical Group",
  "analysis_date": "2025-10-08T14:23:00Z",
  
  "owned_products": ["Meraki", "Duo"],
  
  "recommended_bundles": [
    {
      "product": "Umbrella",
      "product_id": "PROD_UMBRELLA_001",
      "pairing_rate": 0.82,
      "pairing_type": "Duo → Umbrella",
      "rationale": "82% of Duo customers add Umbrella",
      "use_case": "Complete identity + network security stack",
      "integration_benefits": "Single-sign-on, unified policies",
      "avg_time_to_add_days": 150,
      "avg_deal_size": 110000,
      "priority_ranking": 1,
      
      "historical_data": {
        "total_duo_customers": 1245,
        "duo_customers_with_umbrella": 1021,
        "sample_period": "Last 3 years"
      }
    }
  ],
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
product_bundle_recommendations.json
  └─► account_id → accounts.json.customer_id (FK)
  └─► READS: accounts.licenses[]
  └─► EXTERNAL: Historical adoption database
```

---

## Gap 10: QBR Completion Rate by Tier 🟢

### Priority: MEDIUM

### Business Problem
CSMs need visibility into QBR compliance by customer tier.

### New JSON Required: `qbr_tracking.json`

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
    }
  ],
  
  "qbr_history": [
    {
      "qbr_id": "QBR_CUST_000012_Q3_2025",
      "account_id": "CUST_000012",
      "qbr_date": "2025-07-15",
      "status": "Completed",
      "generation_method": "Auto",
      "prep_time_hours": 3.2
    }
  ],
  
  "last_updated": "2025-10-08T14:23:00Z"
}
```

### JSON Relationships
```
qbr_tracking.json
  └─► Aggregates: qbr_value_stories.json
  └─► READS: accounts.customer_tier
```

---

## Gap 11: Champion Tenure Tracking 🟢

### Priority: MEDIUM

### Business Problem
CSMs need to track how long champions have been in their roles to assess departure risk.

### KPIs Enabled
| KPI Name | Formula | Target | Measurement Frequency |
|----------|---------|--------|----------------------|
| Average Champion Tenure | AVG(tenure_months) | Track trend | Monthly |
| At-Risk Champion Count | COUNT(tenure_risk_level="At Risk") | Track trend | Monthly |
| LinkedIn Coverage Rate | Champions with Data / Total | >85% | Monthly |

### Required JSON Enhancement: **stakeholders.json**

**ADD 5 New Fields:**

```json
{
  // ... all existing stakeholder fields ...
  
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

### Field Specifications

| Field | Type | Description | Calculation |
|-------|------|-------------|-------------|
| `role_start_date` | ISO date | When stakeholder started current role | Manual/LinkedIn |
| `tenure_months` | integer | Months in current role | MONTHS_BETWEEN(CURRENT, start_date) |
| `tenure_risk_level` | enum | Risk classification | Formula-based |
| `stability_score` | integer 0-100 | Composite stability | Tenure + LinkedIn signals |
| `linkedin_signals` | object | LinkedIn-derived signals | LinkedIn API |

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

tenure_component = MIN(tenure_months / 36 × 100, 100)

linkedin_signal_component = 
  IF job_seeking_activity == "Active" THEN 0
  ELSE IF job_seeking_activity == "Passive" THEN 40
  ELSE IF open_to_work == true THEN 30
  ELSE IF profile_updated_recently == true THEN 70
  ELSE 100
```

### JSON Relationships
```
stakeholders.json (ENHANCED)
  └─► account_id → accounts.json.customer_id (FK - existing)
  └─► NEW DATA: LinkedIn API integration
```

---

## 14. Complete JSON Relationship Diagram

### Data Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    EXISTING CORE JSONs                       │
│              (No Structural Changes Required)                │
└─────────────────────────────────────────────────────────────┘

    accounts.json                stakeholders.json           contracts.json
    [Master Entity]              [Relationships]             [Renewals]
    ─────────────                ────────────────            ──────────────
    • customer_id (PK)           • id (PK)                   • contract_id (PK)
    • customer_name              • account_id (FK) ──┐       • customer_id (FK) ──┐
    • health_score               • name                │       • end_date           │
    • churn_risk                 • role                │       • arr                │
    • arr                        • engagement_score    │       • renewal_date       │
    • utilization_rate           • champion_strength   │                            │
    • adoption_stage             • ⭐ NEW FIELDS:      │                            │
    • licenses[]                 •   role_start_date   │                            │
    • support_metrics            •   tenure_months     │                            │
         │                       •   stability_score   │                            │
         │                       •   linkedin_signals  │                            │
         │                              │               │                            │
         └──────────────────────────────┴───────────────┼────────────────────────────┘
                                                        │
┌───────────────────────────────────────────────────────┼────────────────────────────┐
│                          NEW JSONs (10 Files)         │                            │
└───────────────────────────────────────────────────────┼────────────────────────────┘
                                                        │
    ┌───────────────────────────────────────────────────┴─────┐
    │                                                          │
    │  intervention_playbooks.json          qbr_value_stories.json
    │  ───────────────────────────          ──────────────────────
    │  • playbook_id (PK)                   • qbr_id (PK)
    │  • account_id (FK) ──────────┐        • account_id (FK) ────┐
    │  • steps[]                    │        • security_value      │
    │  • status                     │        • productivity_value  │
    │  • completion_percentage      │        • recommendations[]   │
    │                               │                               │
    │  READS FROM:                  │        READS FROM:            │
    │    └─► accounts.health_score  │          └─► accounts.licenses[]
    │    └─► accounts.churn_risk    │          └─► accounts.support_metrics
    │                               │                               │
    └───────────────────────────────┼───────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                                │
    │  churn_predictions.json           champion_departure_alerts.json
    │  ──────────────────────           ─────────────────────────────
    │  • prediction_id (PK)             • alert_id (PK)
    │  • account_id (FK) ─────┐         • account_id (FK) ───────┐
    │  • churn_probability     │         • champion_id (FK) ──┐   │
    │  • estimated_days        │         • impact_score        │   │
    │  • velocity_metrics      │         • risk_breakdown      │   │
    │  • risk_factors[]        │                               │   │
    │                          │         READS FROM:           │   │
    │  READS FROM:             │           └─► stakeholders.id │   │
    │    └─► accounts.health_history        └─► stakeholders.  │   │
    │    └─► contracts.end_date                 engagement_    │   │
    │    └─► users.activity_level               history[]      │   │
    │    └─► stakeholders.last_contact                         │   │
    │                                                           │   │
    └───────────────────────────────────────────────────────────┼───┘
                                                                │
    ┌───────────────────────────────────────────────────────────┴───┐
    │                                                                │
    │  expansion_handoff_recommendations     expansion_handoff_tracking
    │  ─────────────────────────────────     ────────────────────────
    │  • handoff_id (PK)                     • tracking_period (PK)
    │  • account_id (FK) ───────┐            • csm_id
    │  • readiness_score         │            • summary_metrics
    │  • opportunity_details     │            • by_ae[]
    │  • recommended_ae          │            • by_product[]
    │  • talking_points[]        │            • individual_handoffs[]
    │                            │                     │
    │  READS FROM:               │            AGGREGATES FROM:
    │    └─► accounts.health_score            └─► expansion_handoff_
    │    └─► accounts.utilization_rate            recommendations.json
    │    └─► stakeholders.champion_strength   └─► Salesforce (External)
    │                                                                │
    └────────────────────────────────────────────────────────────────┘
    
    ┌────────────────────────────────────────────────────────────────┐
    │                                                                │
    │  white_space_analysis.json        multi_product_readiness.json
    │  ─────────────────────────        ───────────────────────────
    │  • analysis_id (PK)               • readiness_id (PK)
    │  • account_id (FK) ────┐          • account_id (FK) ────┐
    │  • white_space_opps[]   │          • readiness_score      │
    │  • total_white_space    │          • component_scores     │
    │  • expansion_ratio      │          • recommended_action   │
    │                         │                                  │
    │  READS FROM:            │          READS FROM:             │
    │    └─► accounts.licenses[]         └─► accounts.health_score
    │    └─► accounts.industry            └─► accounts.adoption_stage
    │  EXTERNAL:              │            └─► stakeholders.engagement
    │    └─► Peer benchmarks  │                                  │
    │                                                            │
    └────────────────────────────────────────────────────────────┘
    
    ┌────────────────────────────────────────────────────────────────┐
    │                                                                │
    │  product_bundle_recommendations    qbr_tracking.json
    │  ──────────────────────────────    ────────────────
    │  • recommendation_id (PK)          • tracking_period (PK)
    │  • account_id (FK) ────┐           • csm_id
    │  • recommended_bundles  │           • by_tier[]
    │  • pairing_rates        │           • by_csm[]
    │                         │           • qbr_history[]
    │  READS FROM:            │                    │
    │    └─► accounts.licenses[]         AGGREGATES FROM:
    │  EXTERNAL:              │            └─► qbr_value_stories.json
    │    └─► Historical       │            └─► accounts.customer_tier
    │        adoption DB      │
    └────────────────────────────────────────────────────────────────┘
```

### Data Flow Legend

```
─────►  Foreign Key Relationship (Direct link)
- - - ►  Read-Only Access (No FK, just reads data)
═════►  Aggregation (Derives from multiple sources)
```

### Key Relationship Rules

1. **All new JSONs reference `accounts.json`** via `account_id` foreign key
2. **Only 1 JSON references `stakeholders.json`**: `champion_departure_alerts.json` via `champion_id`
3. **Only 1 JSON is enhanced**: `stakeholders.json` adds 5 fields for Gap 11
4. **2 JSONs aggregate data**:
   - `expansion_handoff_tracking.json` aggregates from `expansion_handoff_recommendations.json`
   - `qbr_tracking.json` aggregates from `qbr_value_stories.json`
5. **External integrations**:
   - LinkedIn API → `stakeholders.linkedin_signals`
   - Salesforce → `expansion_handoff_tracking.opportunity_id`
   - Peer benchmark DB → `white_space_analysis.json`
   - Product APIs → `qbr_value_stories.json`

---

