// Sales Expansion TypeScript Interfaces

export interface Customer {
  customer_id: string;
  customer_name: string;
  tier: 'Strategic' | 'Enterprise' | 'Commercial' | 'SMB';
  industry: string;
  arr: number;
  csm_id: string;
  story_type: string;
  is_hero_account: boolean;
  created_date: string;
  theater: string;
  region: string;
  country: string;
  city: string;
  timezone: string;
  user_count: number;
  product_count: number;
  last_updated: string;
}

export interface ExpansionOpportunity {
  opportunity_id: string;
  customer_id: string;
  opportunity_type: 'cross_sell' | 'upsell' | 'capacity_expansion' | 'bundle';
  recommended_product: string;
  current_products: string[];
  expansion_readiness_score: number;
  estimated_arr: number;
  close_probability: number;
  expected_close_date: string;
  stage: 'Identified' | 'Qualified' | 'Proposed' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost';
  days_in_stage: number;
  lookalike_confidence: number;
  similar_customer_id: string;
  business_case: string;
  champion_identified: boolean;
  budget_confirmed: boolean;
  technical_fit_score: number;
  competitive_threat: string;
  next_action: string;
  sales_rep: string;
  created_date: string;
  last_updated: string;
}

export interface RevenueMovement {
  movement_id: string;
  customer_id: string;
  subscription_id: string;
  movement_type: 'expansion' | 'churn' | 'contraction' | 'new';
  movement_category: 'upsell' | 'cross_sell' | 'downgrade' | 'cancellation';
  arr_before: number;
  arr_after: number;
  arr_change: number;
  mrr_change: number;
  product_family: string;
  quantity_change: number;
  reason_code: string;
  reason_description: string;
  effective_date: string;
  recorded_date: string;
  triggered_by: string;
  related_quote_id: string;
  related_order_id: string;
  related_amendment_id: string;
  fiscal_year: number;
  fiscal_quarter: string;
  fiscal_month: string;
  created_date: string;
}

export interface License {
  license_id: string;
  customer_id: string;
  product_family: string;
  subscription_id: string;
  quantity_licensed: number;
  quantity_used: number;
  utilization_percentage: number;
  license_tier: string;
  deployment_model: string;
  adoption_stage: string;
  renewal_date: string;
  billing_term: string;
  mrr: number;
  arr: number;
  created_date: string;
  last_updated: string;
}

export interface CompetitiveIntelligence {
  intelligence_id: string;
  customer_id: string;
  competitor_name: string;
  product_category: string;
  threat_level: 'Low' | 'Medium' | 'High' | 'Critical';
  competitive_product: string;
  our_product: string;
  win_probability: number;
  key_differentiators: string[];
  customer_concerns: string[];
  recommended_strategy: string;
  objection_handling: string[];
  pricing_comparison: {
    our_price: number;
    competitor_price: number;
    value_gap: number;
  };
  last_updated: string;
}

export interface ExpansionTrigger {
  trigger_id: string;
  customer_id: string;
  trigger_type: 'utilization' | 'milestone' | 'engagement' | 'health' | 'contract';
  trigger_name: string;
  trigger_description: string;
  threshold_value: number;
  current_value: number;
  threshold_met: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  recommended_action: string;
  estimated_opportunity_arr: number;
  days_active: number;
  assigned_to: string;
  status: 'Active' | 'Actioned' | 'Dismissed';
  created_date: string;
  last_updated: string;
}

export interface LookalikeAnalysis {
  analysis_id: string;
  source_customer_id: string;
  target_customer_id: string;
  similarity_score: number;
  matching_attributes: string[];
  product_adoption_pattern: string;
  expansion_success_rate: number;
  avg_expansion_arr: number;
  avg_time_to_expansion: number;
  recommended_products: string[];
  confidence_level: number;
  created_date: string;
}

export interface WhiteSpaceAnalysis {
  analysis_id: string;
  customer_id: string;
  customer_name: string;
  current_products: string[];
  missing_products: string[];
  white_space_score: number;
  estimated_total_opportunity: number;
  product_recommendations: Array<{
    product: string;
    synergy_score: number;
    estimated_arr: number;
    win_probability: number;
    priority: string;
  }>;
  cross_sell_readiness: number;
  last_updated: string;
}

// KPI Calculation Interfaces
export interface NRRMetrics {
  starting_arr: number;
  expansion_arr: number;
  churn_arr: number;
  contraction_arr: number;
  ending_arr: number;
  nrr_percentage: number;
  period: string;
}

export interface ExpansionMetrics {
  total_opportunities: number;
  total_estimated_arr: number;
  avg_close_probability: number;
  opportunities_by_stage: Record<string, number>;
  opportunities_by_type: Record<string, number>;
  pipeline_coverage: number;
}

export interface UtilizationMetrics {
  total_licenses: number;
  high_utilization_count: number;
  avg_utilization: number;
  capacity_alerts: number;
  expansion_ready_accounts: number;
}
