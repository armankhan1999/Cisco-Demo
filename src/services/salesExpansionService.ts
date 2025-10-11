import {
  Customer,
  ExpansionOpportunity,
  RevenueMovement,
  License,
  CompetitiveIntelligence,
  ExpansionTrigger,
  LookalikeAnalysis,
  WhiteSpaceAnalysis,
  NRRMetrics,
  ExpansionMetrics,
  UtilizationMetrics,
} from '@/types/salesExpansion';

/**
 * Sales Expansion Service
 * Handles all data fetching and calculations for Sales Expansion dashboard
 */
class SalesExpansionService {
  private baseUrl = '/api/data';

  /**
   * Fetch all customers
   */
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${this.baseUrl}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  }

  /**
   * Fetch expansion opportunities
   */
  async getExpansionOpportunities(): Promise<ExpansionOpportunity[]> {
    const response = await fetch(`${this.baseUrl}/expansion-opportunities`);
    if (!response.ok) throw new Error('Failed to fetch expansion opportunities');
    return response.json();
  }

  /**
   * Fetch revenue movements
   */
  async getRevenueMovements(): Promise<RevenueMovement[]> {
    const response = await fetch(`${this.baseUrl}/revenue-movements`);
    if (!response.ok) throw new Error('Failed to fetch revenue movements');
    return response.json();
  }

  /**
   * Fetch licenses
   */
  async getLicenses(): Promise<License[]> {
    const response = await fetch(`${this.baseUrl}/licenses`);
    if (!response.ok) throw new Error('Failed to fetch licenses');
    return response.json();
  }

  /**
   * Fetch competitive intelligence
   */
  async getCompetitiveIntelligence(): Promise<CompetitiveIntelligence[]> {
    const response = await fetch(`${this.baseUrl}/competitive-intelligence`);
    if (!response.ok) throw new Error('Failed to fetch competitive intelligence');
    return response.json();
  }

  /**
   * Fetch expansion triggers
   */
  async getExpansionTriggers(): Promise<ExpansionTrigger[]> {
    const response = await fetch(`${this.baseUrl}/expansion-triggers`);
    if (!response.ok) throw new Error('Failed to fetch expansion triggers');
    return response.json();
  }

  /**
   * Fetch lookalike analysis
   */
  async getLookalikeAnalysis(): Promise<LookalikeAnalysis[]> {
    const response = await fetch(`${this.baseUrl}/lookalike-analysis`);
    if (!response.ok) throw new Error('Failed to fetch lookalike analysis');
    return response.json();
  }

  /**
   * Fetch white space analysis
   */
  async getWhiteSpaceAnalysis(): Promise<WhiteSpaceAnalysis[]> {
    const response = await fetch(`${this.baseUrl}/white-space-analysis`);
    if (!response.ok) throw new Error('Failed to fetch white space analysis');
    return response.json();
  }

  /**
   * Calculate Net Revenue Retention (NRR)
   * Tier 1 KPI #1
   */
  async calculateNRR(period: string = 'current_quarter'): Promise<NRRMetrics> {
    const movements = await this.getRevenueMovements();
    
    // Filter movements for the specified period
    const periodMovements = movements.filter(m => {
      // Add period filtering logic based on fiscal_quarter
      return true; // Simplified for now
    });

    const starting_arr = periodMovements.reduce((sum, m) => sum + m.arr_before, 0);
    const expansion_arr = periodMovements
      .filter(m => m.movement_type === 'expansion')
      .reduce((sum, m) => sum + m.arr_change, 0);
    const churn_arr = periodMovements
      .filter(m => m.movement_type === 'churn')
      .reduce((sum, m) => sum + Math.abs(m.arr_change), 0);
    const contraction_arr = periodMovements
      .filter(m => m.movement_type === 'contraction')
      .reduce((sum, m) => sum + Math.abs(m.arr_change), 0);

    const ending_arr = starting_arr + expansion_arr - churn_arr - contraction_arr;
    const nrr_percentage = starting_arr > 0 ? (ending_arr / starting_arr) * 100 : 0;

    return {
      starting_arr,
      expansion_arr,
      churn_arr,
      contraction_arr,
      ending_arr,
      nrr_percentage,
      period,
    };
  }

  /**
   * Calculate Expansion ARR
   * Tier 1 KPI #2
   */
  async calculateExpansionARR(period: string = 'current_quarter'): Promise<number> {
    const movements = await this.getRevenueMovements();
    
    const expansionARR = movements
      .filter(m => m.movement_type === 'expansion')
      .reduce((sum, m) => sum + m.arr_change, 0);

    return expansionARR;
  }

  /**
   * Calculate Multi-Product Penetration Rate
   * Tier 1 KPI #3
   */
  async calculateMultiProductPenetration(): Promise<number> {
    const customers = await this.getCustomers();
    
    const multiProductCustomers = customers.filter(c => c.product_count >= 2).length;
    const totalCustomers = customers.length;

    return totalCustomers > 0 ? (multiProductCustomers / totalCustomers) * 100 : 0;
  }

  /**
   * Calculate White Space Opportunity Value
   * Tier 1 KPI #4
   */
  async calculateWhiteSpaceValue(): Promise<number> {
    const whiteSpace = await this.getWhiteSpaceAnalysis();
    
    const totalOpportunity = whiteSpace.reduce((sum, ws) => sum + ws.estimated_total_opportunity, 0);

    return totalOpportunity;
  }

  /**
   * Get Expansion Pipeline ARR
   * Tier 1 KPI #5
   */
  async getExpansionPipelineARR(): Promise<number> {
    const opportunities = await this.getExpansionOpportunities();
    
    const pipelineARR = opportunities
      .filter(o => !['Closed-Won', 'Closed-Lost'].includes(o.stage))
      .reduce((sum, o) => sum + o.estimated_arr, 0);

    return pipelineARR;
  }

  /**
   * Calculate Cross-Sell Attach Rate
   * Tier 1 KPI #6
   */
  async calculateCrossSellAttachRate(): Promise<number> {
    const opportunities = await this.getExpansionOpportunities();
    
    const crossSellOpps = opportunities.filter(o => o.opportunity_type === 'cross_sell');
    const totalOpps = opportunities.length;

    return totalOpps > 0 ? (crossSellOpps.length / totalOpps) * 100 : 0;
  }

  /**
   * Calculate Expansion Win Rate
   * Tier 1 KPI #7
   */
  async calculateExpansionWinRate(): Promise<number> {
    const opportunities = await this.getExpansionOpportunities();
    
    const closedOpps = opportunities.filter(o => ['Closed-Won', 'Closed-Lost'].includes(o.stage));
    const wonOpps = opportunities.filter(o => o.stage === 'Closed-Won');

    return closedOpps.length > 0 ? (wonOpps.length / closedOpps.length) * 100 : 0;
  }

  /**
   * Calculate Capacity-Driven Expansion ARR
   * Tier 1 KPI #10
   */
  async calculateCapacityDrivenARR(): Promise<number> {
    const triggers = await this.getExpansionTriggers();
    
    const capacityTriggers = triggers.filter(t => 
      t.trigger_type === 'utilization' && 
      t.threshold_met &&
      t.status === 'Active'
    );

    const totalARR = capacityTriggers.reduce((sum, t) => sum + t.estimated_opportunity_arr, 0);

    return totalARR;
  }

  /**
   * Get Expansion Metrics Summary
   * Combines multiple KPIs for dashboard display
   */
  async getExpansionMetrics(): Promise<ExpansionMetrics> {
    const opportunities = await this.getExpansionOpportunities();
    
    const total_opportunities = opportunities.length;
    const total_estimated_arr = opportunities.reduce((sum, o) => sum + o.estimated_arr, 0);
    const avg_close_probability = opportunities.length > 0
      ? opportunities.reduce((sum, o) => sum + o.close_probability, 0) / opportunities.length
      : 0;

    const opportunities_by_stage = opportunities.reduce((acc, o) => {
      acc[o.stage] = (acc[o.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const opportunities_by_type = opportunities.reduce((acc, o) => {
      acc[o.opportunity_type] = (acc[o.opportunity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pipeline_coverage = 3.2; // Placeholder - would calculate based on quota

    return {
      total_opportunities,
      total_estimated_arr,
      avg_close_probability,
      opportunities_by_stage,
      opportunities_by_type,
      pipeline_coverage,
    };
  }

  /**
   * Get Utilization Metrics
   * For capacity-driven expansion analysis
   */
  async getUtilizationMetrics(): Promise<UtilizationMetrics> {
    const licenses = await this.getLicenses();
    const triggers = await this.getExpansionTriggers();
    
    const total_licenses = licenses.length;
    const high_utilization_count = licenses.filter(l => l.utilization_percentage >= 85).length;
    const avg_utilization = licenses.length > 0
      ? licenses.reduce((sum, l) => sum + l.utilization_percentage, 0) / licenses.length
      : 0;
    
    const capacity_alerts = triggers.filter(t => 
      t.trigger_type === 'utilization' && 
      t.threshold_met &&
      t.status === 'Active'
    ).length;

    const expansion_ready_accounts = high_utilization_count;

    return {
      total_licenses,
      high_utilization_count,
      avg_utilization,
      capacity_alerts,
      expansion_ready_accounts,
    };
  }

  /**
   * Get Top Expansion Opportunities
   * Tier 3 - Hot opportunities requiring immediate action
   */
  async getHotOpportunities(limit: number = 10): Promise<ExpansionOpportunity[]> {
    const opportunities = await this.getExpansionOpportunities();
    
    return opportunities
      .filter(o => o.expansion_readiness_score >= 80 && !['Closed-Won', 'Closed-Lost'].includes(o.stage))
      .sort((a, b) => b.expansion_readiness_score - a.expansion_readiness_score)
      .slice(0, limit);
  }

  /**
   * Get Active Capacity Alerts
   * Tier 3 - Utilization-based expansion triggers
   */
  async getActiveCapacityAlerts(limit: number = 10): Promise<ExpansionTrigger[]> {
    const triggers = await this.getExpansionTriggers();
    
    return triggers
      .filter(t => t.trigger_type === 'utilization' && t.threshold_met && t.status === 'Active')
      .sort((a, b) => b.current_value - a.current_value)
      .slice(0, limit);
  }

  /**
   * Get Customer White Space Details
   * Tier 2 - White Space Coverage Matrix
   */
  async getCustomerWhiteSpace(customerId: string): Promise<WhiteSpaceAnalysis | null> {
    const whiteSpace = await this.getWhiteSpaceAnalysis();
    
    return whiteSpace.find(ws => ws.customer_id === customerId) || null;
  }

  /**
   * Get Expansion Readiness Segmentation
   * Tier 2 - Segment customers by expansion readiness
   */
  async getExpansionReadinessSegments() {
    const opportunities = await this.getExpansionOpportunities();
    const customers = await this.getCustomers();
    
    // Group opportunities by customer
    const customerOpportunities = opportunities.reduce((acc, opp) => {
      if (!acc[opp.customer_id]) {
        acc[opp.customer_id] = [];
      }
      acc[opp.customer_id].push(opp);
      return acc;
    }, {} as Record<string, ExpansionOpportunity[]>);

    // Segment customers
    const segments = {
      hot: [] as any[],
      ready: [] as any[],
      nurturing: [] as any[],
      not_ready: [] as any[],
    };

    customers.forEach(customer => {
      const opps = customerOpportunities[customer.customer_id] || [];
      const avgReadiness = opps.length > 0
        ? opps.reduce((sum, o) => sum + o.expansion_readiness_score, 0) / opps.length
        : 0;

      const segment = {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        arr: customer.arr,
        readiness_score: avgReadiness,
        opportunity_count: opps.length,
      };

      if (avgReadiness >= 80) {
        segments.hot.push(segment);
      } else if (avgReadiness >= 70) {
        segments.ready.push(segment);
      } else if (avgReadiness >= 60) {
        segments.nurturing.push(segment);
      } else {
        segments.not_ready.push(segment);
      }
    });

    return segments;
  }
}

// Export singleton instance
export const salesExpansionService = new SalesExpansionService();
export default salesExpansionService;
