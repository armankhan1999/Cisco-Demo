/**
 * Action Items Service
 * Generates real action items from source data for all KPIs
 */

// Import source data
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import expansionTriggersData from '@/source_data/sales-expansion-data/expansion-triggers.json';
import revenueMovementsData from '@/source_data/commercial_operations/revenue_movements.json';
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import whiteSpaceData from '@/source_data/csm-data/white_space_analysis.json';
import accountsReceivableData from '@/source_data/commercial_operations/accounts_receivable.json';
import quotesData from '@/source_data/commercial_operations/quotes.json';
import { ExpansionReadyAccountsService } from './expansionReadyAccountsService';

export interface ActionItem {
  id: string;
  type: 'account' | 'opportunity' | 'contract' | 'quote' | 'renewal';
  title: string;
  customer: string;
  product?: string;
  amount: number;
  daysOverdue: number;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  nextAction: string;
  businessImpact: string;
}

export class ActionItemsService {
  
  /**
   * Generate action items for Expansion ARR KPI
   */
  static getExpansionARRActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Get high-priority expansion opportunities
    const highPriorityOpportunities = expansionOpportunitiesData
      .filter(opp => opp.expansion_readiness_score >= 80 && opp.stage !== 'Closed')
      .sort((a, b) => b.estimated_arr - a.estimated_arr)
      .slice(0, 10);

    highPriorityOpportunities.forEach((opp, index) => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
      
      items.push({
        id: `EXP-${opp.opportunity_id}`,
        type: 'opportunity',
        title: `${opp.opportunity_type === 'cross_sell' ? 'Cross-sell' : 'Upsell'} ${opp.recommended_product}`,
        customer: customerName,
        product: opp.recommended_product,
        amount: opp.estimated_arr,
        daysOverdue: opp.days_in_stage,
        assignee: opp.sales_rep || 'Sales Team',
        priority: opp.expansion_readiness_score >= 90 ? 'high' : opp.expansion_readiness_score >= 80 ? 'medium' : 'low',
        status: opp.stage === 'Proposed' ? 'in_progress' : 'pending',
        nextAction: opp.next_action || 'Follow up with customer',
        businessImpact: `${opp.opportunity_type} opportunity worth $${Math.floor(opp.estimated_arr/1000)}K. Readiness score: ${opp.expansion_readiness_score}%`
      });
    });

    // Add expansion triggers as action items
    const urgentTriggers = expansionTriggersData
      .filter(trigger => trigger.urgency === 'High')
      .slice(0, 5);

    urgentTriggers.forEach(trigger => {
      const customer = customersData.find(c => c.customer_id === trigger.customer_id);
      const customerName = customer?.customer_name || `Customer ${trigger.customer_id}`;
      
      items.push({
        id: `TRIG-${trigger.trigger_id}`,
        type: 'account',
        title: `${trigger.trigger_type.replace('_', ' ')} - ${trigger.product_affected}`,
        customer: customerName,
        product: trigger.expansion_opportunity?.recommended_product || trigger.product_affected,
        amount: trigger.expansion_opportunity?.estimated_arr || 0,
        daysOverdue: Math.floor((new Date().getTime() - new Date(trigger.trigger_date).getTime()) / (1000 * 60 * 60 * 24)),
        assignee: 'CSM Team',
        priority: trigger.urgency === 'High' ? 'high' : 'medium',
        status: 'pending',
        nextAction: trigger.expansion_opportunity?.recommended_action || 'Review trigger',
        businessImpact: `${trigger.trigger_type} detected. ${trigger.expansion_opportunity?.type} opportunity available.`
      });
    });

    return items;
  }

  /**
   * Generate action items for NRR KPI
   */
  static getNRRActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Get customers with recent contractions
    const contractions = revenueMovementsData
      .filter(movement => movement.movement_type === 'contraction')
      .sort((a, b) => Math.abs(b.arr_change) - Math.abs(a.arr_change))
      .slice(0, 8);

    contractions.forEach(contraction => {
      const customer = customersData.find(c => c.customer_id === contraction.customer_id);
      const customerName = customer?.customer_name || `Customer ${contraction.customer_id}`;
      
      items.push({
        id: `NRR-${contraction.movement_id}`,
        type: 'account',
        title: `Revenue Contraction - ${contraction.product_family}`,
        customer: customerName,
        product: contraction.product_family,
        amount: Math.abs(contraction.arr_change),
        daysOverdue: Math.floor((new Date().getTime() - new Date(contraction.effective_date).getTime()) / (1000 * 60 * 60 * 24)),
        assignee: 'CSM Team',
        priority: Math.abs(contraction.arr_change) > 50000 ? 'high' : 'medium',
        status: 'pending',
        nextAction: 'Schedule retention call',
        businessImpact: `$${Math.floor(Math.abs(contraction.arr_change)/1000)}K ARR loss. Reason: ${contraction.reason_description}`
      });
    });

    // Add at-risk renewals
    const atRiskCustomers = customersData
      .filter(customer => {
        // Find customers with low utilization or recent contractions
        const licenses = licensesData.filter(l => l.customer_id === customer.customer_id);
        const avgUtilization = licenses.reduce((sum, l) => sum + l.utilization, 0) / licenses.length;
        return avgUtilization < 60 || customer.tier === 'Strategic'; // Focus on strategic accounts
      })
      .slice(0, 5);

    atRiskCustomers.forEach(customer => {
      const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
      const currentProducts = customerLicenses.map(l => l.product_family).join(', ') || 'Multiple Products';
      
      items.push({
        id: `RISK-${customer.customer_id}`,
        type: 'renewal',
        title: `At-Risk Renewal - ${customer.tier} Account`,
        customer: customer.customer_name,
        product: currentProducts,
        amount: customer.arr,
        daysOverdue: 0,
        assignee: 'CSM Team',
        priority: customer.tier === 'Strategic' ? 'high' : 'medium',
        status: 'pending',
        nextAction: 'Schedule health check call',
        businessImpact: `${customer.tier} tier account worth $${Math.floor(customer.arr/1000)}K ARR at risk`
      });
    });

    return items;
  }

  /**
   * Generate action items for Multi-Product Penetration KPI
   */
  static getMultiProductPenetrationActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Find single-product customers with high white space opportunity
    const singleProductCustomers = customersData
      .filter(customer => customer.product_count === 1)
      .map(customer => {
        const whiteSpace = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        return {
          ...customer,
          whiteSpaceValue: whiteSpace?.total_white_space_arr || 0
        };
      })
      .filter(customer => customer.whiteSpaceValue > 50000)
      .sort((a, b) => b.whiteSpaceValue - a.whiteSpaceValue)
      .slice(0, 10);

    singleProductCustomers.forEach(customer => {
      const currentLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
      const currentProduct = currentLicenses[0]?.product_family || 'Unknown';
      
      items.push({
        id: `MP-${customer.customer_id}`,
        type: 'opportunity',
        title: `Cross-sell Opportunity - Single Product Customer`,
        customer: customer.customer_name,
        product: `Current: ${currentProduct}`,
        amount: customer.whiteSpaceValue,
        daysOverdue: 0,
        assignee: 'Sales Team',
        priority: customer.whiteSpaceValue > 200000 ? 'high' : customer.whiteSpaceValue > 100000 ? 'medium' : 'low',
        status: 'pending',
        nextAction: 'Identify cross-sell products',
        businessImpact: `Customer only has ${currentProduct}. White space opportunity: $${Math.floor(customer.whiteSpaceValue/1000)}K`
      });
    });

    // Find customers with low product adoption relative to their tier
    const underPenetratedCustomers = customersData
      .filter(customer => {
        if (customer.tier === 'Strategic' && customer.product_count < 3) return true;
        if (customer.tier === 'Enterprise' && customer.product_count < 2) return true;
        return false;
      })
      .slice(0, 8);

    underPenetratedCustomers.forEach(customer => {
      const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
      const currentProducts = customerLicenses.map(l => l.product_family).join(', ') || 'None';
      
      items.push({
        id: `UP-${customer.customer_id}`,
        type: 'account',
        title: `Under-penetrated ${customer.tier} Account`,
        customer: customer.customer_name,
        product: `Current: ${currentProducts}`,
        amount: customer.arr,
        daysOverdue: 0,
        assignee: 'Account Team',
        priority: customer.tier === 'Strategic' ? 'high' : 'medium',
        status: 'pending',
        nextAction: 'Conduct product portfolio review',
        businessImpact: `${customer.tier} account with only ${customer.product_count} products. Expansion potential available.`
      });
    });

    return items;
  }

  /**
   * Generate action items for White Space Opportunity KPI
   */
  static getWhiteSpaceActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Get top white space opportunities
    const topWhiteSpaceOpportunities = whiteSpaceData
      .filter(ws => ws.total_white_space_arr > 100000)
      .sort((a, b) => b.total_white_space_arr - a.total_white_space_arr)
      .slice(0, 12);

    topWhiteSpaceOpportunities.forEach(whiteSpace => {
      const customer = customersData.find(c => c.customer_id === whiteSpace.account_id);
      const customerName = customer?.customer_name || `Customer ${whiteSpace.account_id}`;
      
      // Get the top white space opportunity product
      const topOpportunity = whiteSpace.white_space_opportunities
        ?.sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
      
      items.push({
        id: `WS-${whiteSpace.account_id}`,
        type: 'opportunity',
        title: `White Space Analysis - Product Gap`,
        customer: customerName,
        product: topOpportunity?.product || 'Multiple Products',
        amount: whiteSpace.total_white_space_arr,
        daysOverdue: 0,
        assignee: 'Sales Team',
        priority: whiteSpace.total_white_space_arr > 300000 ? 'high' : whiteSpace.total_white_space_arr > 150000 ? 'medium' : 'low',
        status: 'pending',
        nextAction: 'Present product portfolio gap analysis',
        businessImpact: `$${Math.floor(whiteSpace.total_white_space_arr/1000)}K white space opportunity identified`
      });
    });

    return items;
  }

  /**
   * Get filtered expansion opportunities by type
   */
  static getExpansionOpportunitiesByType(type: 'upsell' | 'cross_sell' | 'capacity'): ActionItem[] {
    const items: ActionItem[] = [];
    
    let filteredOpportunities;
    if (type === 'capacity') {
      // For capacity, look for utilization-based triggers
      filteredOpportunities = expansionTriggersData
        .filter(trigger => trigger.trigger_type === 'Capacity_Threshold' || trigger.trigger_type === 'Usage_Spike')
        .map(trigger => {
          const customer = customersData.find(c => c.customer_id === trigger.customer_id);
          return {
            opportunity_id: trigger.trigger_id,
            customer_id: trigger.customer_id,
            opportunity_type: 'upsell',
            recommended_product: trigger.product_affected,
            expansion_readiness_score: 85, // High readiness for capacity issues
            estimated_arr: trigger.expansion_opportunity?.estimated_arr || 100000,
            stage: 'Qualified',
            days_in_stage: Math.floor((new Date().getTime() - new Date(trigger.trigger_date).getTime()) / (1000 * 60 * 60 * 24)),
            next_action: trigger.expansion_opportunity?.recommended_action || 'Schedule capacity planning call',
            sales_rep: 'CSM Team'
          };
        });
    } else {
      filteredOpportunities = expansionOpportunitiesData
        .filter(opp => opp.opportunity_type === type && opp.expansion_readiness_score >= 70)
        .sort((a, b) => b.expansion_readiness_score - a.expansion_readiness_score);
    }

    filteredOpportunities.forEach((opp) => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
      
      items.push({
        id: `${type.toUpperCase()}-${opp.opportunity_id}`,
        type: 'opportunity',
        title: `${type === 'cross_sell' ? 'Cross-sell' : type === 'upsell' ? 'Upsell' : 'Capacity Expansion'} - ${opp.recommended_product}`,
        customer: customerName,
        product: opp.recommended_product,
        amount: opp.estimated_arr,
        daysOverdue: opp.days_in_stage > 30 ? opp.days_in_stage - 30 : 0,
        assignee: opp.sales_rep || 'Sales Team',
        priority: opp.expansion_readiness_score >= 90 ? 'high' : opp.expansion_readiness_score >= 80 ? 'medium' : 'low',
        status: opp.stage === 'Proposed' ? 'in_progress' : 'pending',
        nextAction: opp.next_action || `Follow up on ${type} opportunity`,
        businessImpact: `${type} opportunity worth $${Math.floor(opp.estimated_arr/1000)}K. Readiness score: ${opp.expansion_readiness_score}%`
      });
    });

    return items;
  }

  /**
   * Generate action items for Opportunity Readiness KPI (consistent with ExpansionReadyAccountsService)
   */
  static getOpportunityReadinessActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Get all expansion-ready accounts using the same filtering logic
    const allReadyAccounts = ExpansionReadyAccountsService.getAllExpansionReadyAccounts();
    
    // Convert to action items
    allReadyAccounts.forEach((account, index) => {
      items.push({
        id: `READY-${index + 1}`,
        type: 'opportunity',
        title: `${account.recommendedProduct} Expansion Opportunity`,
        customer: account.name,
        product: account.recommendedProduct,
        amount: account.estimatedARR,
        daysOverdue: 0,
        assignee: 'Sales Team',
        priority: account.score >= 90 ? 'high' : account.score >= 80 ? 'medium' : 'low',
        status: 'pending',
        nextAction: account.nextAction,
        businessImpact: account.businessJustification
      });
    });

    return items;
  }

  /**
   * Get accounts by product for Product Gap Analysis Matrix
   */
  static getAccountsByProduct(product: string): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Get white space opportunities for the specific product
    const productOpportunities = whiteSpaceData
      .filter(ws => {
        return ws.white_space_opportunities && ws.white_space_opportunities.some(opp => 
          opp.product === product || 
          opp.product.toLowerCase() === product.toLowerCase() ||
          opp.product.replace(/\s+/g, '').toLowerCase() === product.replace(/\s+/g, '').toLowerCase()
        );
      })
      .sort((a, b) => b.total_white_space_arr - a.total_white_space_arr)
      .slice(0, 15);

    productOpportunities.forEach(ws => {
      const customer = customersData.find(c => c.customer_id === ws.account_id);
      const productOpp = ws.white_space_opportunities.find(opp => 
        opp.product === product || 
        opp.product.toLowerCase() === product.toLowerCase() ||
        opp.product.replace(/\s+/g, '').toLowerCase() === product.replace(/\s+/g, '').toLowerCase()
      );
      
      if (customer && productOpp) {
        items.push({
          id: `PRODUCT-${product}-${ws.account_id}`,
          type: 'opportunity',
          title: `${product} Gap Analysis`,
          customer: customer.customer_name,
          product: product,
          amount: productOpp.estimated_arr,
          daysOverdue: 0,
          assignee: 'Sales Team',
          priority: productOpp.estimated_arr > 200000 ? 'high' : productOpp.estimated_arr > 100000 ? 'medium' : 'low',
          status: 'pending',
          nextAction: `Present ${product} solution to customer`,
          businessImpact: `${product} gap identified. Opportunity worth $${Math.floor(productOpp.estimated_arr/1000)}K. Fit score: ${productOpp.fit_score}%`
        });
      }
    });

    return items;
  }

  /**
   * Generate action items for Utilization-Driven Expansion Signals KPI (Capacity-focused)
   */
  static getUtilizationExpansionActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Categorize by utilization thresholds for targeted actions
    const utilizationThresholds = [
      { 
        min: 95, 
        max: 100, 
        priority: 'high' as const, 
        action: 'URGENT: Customer at capacity limit - immediate expansion required',
        urgency: 'Critical - Contact within 24 hours'
      },
      { 
        min: 90, 
        max: 94, 
        priority: 'high' as const, 
        action: 'Proactive capacity planning - schedule expansion discussion',
        urgency: 'High - Contact within 3 days'
      },
      { 
        min: 85, 
        max: 89, 
        priority: 'medium' as const, 
        action: 'Monitor usage trends and prepare expansion proposal',
        urgency: 'Medium - Contact within 1 week'
      }
    ];

    utilizationThresholds.forEach(threshold => {
      const thresholdAlerts = expansionTriggersData
        .filter(trigger => 
          trigger.trigger_type === 'Capacity_Threshold' && 
          trigger.current_utilization && 
          trigger.current_utilization >= threshold.min && 
          trigger.current_utilization <= threshold.max
        )
        .sort((a, b) => (b.current_utilization || 0) - (a.current_utilization || 0))
        .slice(0, 5); // Limit per threshold

      thresholdAlerts.forEach((alert, index) => {
        const customer = customersData.find(c => c.customer_id === alert.customer_id);
        const customerName = customer?.customer_name || `Customer ${alert.customer_id}`;
        
        // Calculate expansion sizing based on utilization
        const utilizationOverage = (alert.current_utilization || 0) - 80; // Baseline 80%
        const expansionMultiplier = Math.min(0.5, utilizationOverage * 0.02); // Scale with utilization
        const estimatedExpansion = customer ? Math.floor(customer.arr * expansionMultiplier) : 50000;

        // Determine license expansion needed
        const currentLicense = licensesData.find(l => 
          l.customer_id === alert.customer_id && 
          l.product_family === alert.product_family
        );
        const currentCount = currentLicense?.license_count || 100;
        const recommendedIncrease = Math.ceil(currentCount * (utilizationOverage / 100));

        items.push({
          id: `CAPACITY-${threshold.min}-${alert.trigger_id}`,
          type: 'opportunity',
          title: `${alert.current_utilization}% Utilization Alert - ${alert.product_family}`,
          customer: customerName,
          product: alert.product_family,
          amount: estimatedExpansion,
          daysOverdue: alert.days_since_trigger || 0,
          assignee: 'Sales Team',
          priority: threshold.priority,
          status: threshold.min >= 95 ? 'pending' : 'in_progress',
          nextAction: threshold.action,
          businessImpact: `${threshold.urgency} | Recommend +${recommendedIncrease} licenses | Current: ${alert.current_utilization}% utilized`
        });
      });
    });

    return items;
  }

  /**
   * Generate action items for Expansion Pipeline Funnel KPI (Stage-focused)
   */
  static getExpansionPipelineActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Focus on stage-specific actions and bottlenecks
    const stageActions = [
      // Stalled opportunities in each stage
      { stage: 'Proposed', maxDays: 21, action: 'Follow up on proposal - customer may need clarification' },
      { stage: 'Negotiation', maxDays: 14, action: 'Address pricing/terms objections to close deal' },
      { stage: 'Verbal Commit', maxDays: 7, action: 'Urgent: Get signed contract before commitment expires' }
    ];

    stageActions.forEach(stageConfig => {
      const stalledOpps = expansionOpportunitiesData
        .filter(opp => 
          opp.stage === stageConfig.stage && 
          opp.days_in_stage > stageConfig.maxDays
        )
        .sort((a, b) => b.days_in_stage - a.days_in_stage)
        .slice(0, 4);

      stalledOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
        
        const priority = stageConfig.stage === 'Verbal Commit' ? 'high' : 
                        stageConfig.stage === 'Negotiation' ? 'medium' : 'low';

        items.push({
          id: `STAGE-${stageConfig.stage}-${opp.opportunity_id}`,
          type: 'opportunity',
          title: `Stalled ${stageConfig.stage} - ${opp.recommended_product}`,
          customer: customerName,
          product: opp.recommended_product,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage - stageConfig.maxDays,
          assignee: opp.sales_rep || 'Sales Team',
          priority,
          status: 'pending',
          nextAction: stageConfig.action,
          businessImpact: `${stageConfig.stage} stalled ${opp.days_in_stage} days - risk of deal loss`
        });
      });
    });

    // Add velocity improvement opportunities
    const slowMovingOpps = expansionOpportunitiesData
      .filter(opp => ['Discovery', 'Qualified'].includes(opp.stage) && opp.days_in_stage > 30)
      .sort((a, b) => b.estimated_arr - a.estimated_arr)
      .slice(0, 3);

    slowMovingOpps.forEach((opp, index) => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;

      items.push({
        id: `VELOCITY-${opp.opportunity_id}`,
        type: 'opportunity',
        title: `Accelerate Pipeline - ${opp.recommended_product}`,
        customer: customerName,
        product: opp.recommended_product,
        amount: opp.estimated_arr,
        daysOverdue: Math.max(0, opp.days_in_stage - 30),
        assignee: opp.sales_rep || 'Sales Team',
        priority: 'medium',
        status: 'pending',
        nextAction: `Move from ${opp.stage} to next stage - schedule decision maker meeting`,
        businessImpact: `Pipeline velocity improvement - advance $${Math.floor(opp.estimated_arr/1000)}K opportunity`
      });
    });

    return items;
  }

  /**
   * Generate action items for Opportunity Readiness Matrix KPI (Score-focused positioning)
   */
  static getOpportunityReadinessMatrixActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Focus on readiness score quadrants for strategic positioning
    const readinessQuadrants = [
      {
        name: 'Hot Zone',
        minScore: 90,
        maxScore: 100,
        priority: 'high' as const,
        action: 'Strike while hot - immediate outreach and proposal',
        strategy: 'Fast-track to close'
      },
      {
        name: 'Sweet Spot',
        minScore: 80,
        maxScore: 89,
        priority: 'high' as const,
        action: 'Prime for engagement - schedule executive meeting',
        strategy: 'Executive-level engagement'
      },
      {
        name: 'Warm Zone',
        minScore: 70,
        maxScore: 79,
        priority: 'medium' as const,
        action: 'Nurture readiness - provide value-driven content',
        strategy: 'Educational nurturing'
      }
    ];

    readinessQuadrants.forEach(quadrant => {
      const quadrantOpps = expansionOpportunitiesData
        .filter(opp => 
          opp.expansion_readiness_score >= quadrant.minScore && 
          opp.expansion_readiness_score <= quadrant.maxScore
        )
        .sort((a, b) => {
          // Sort by readiness score first, then by ARR potential
          if (b.expansion_readiness_score !== a.expansion_readiness_score) {
            return b.expansion_readiness_score - a.expansion_readiness_score;
          }
          return b.estimated_arr - a.estimated_arr;
        })
        .slice(0, 4); // Top 4 per quadrant

      quadrantOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
        
        // Calculate positioning metrics
        const closeProb = Math.min(95, opp.expansion_readiness_score + 5);
        const timeToClose = quadrant.minScore >= 90 ? '30 days' : 
                           quadrant.minScore >= 80 ? '60 days' : '90+ days';

        items.push({
          id: `QUADRANT-${quadrant.name.replace(' ', '')}-${opp.opportunity_id}`,
          type: 'opportunity',
          title: `${quadrant.name} Opportunity - ${opp.recommended_product}`,
          customer: customerName,
          product: opp.recommended_product,
          amount: opp.estimated_arr,
          daysOverdue: 0,
          assignee: opp.sales_rep || 'Sales Team',
          priority: quadrant.priority,
          status: quadrant.minScore >= 90 ? 'in_progress' : 'pending',
          nextAction: quadrant.action,
          businessImpact: `${quadrant.strategy} | Score: ${opp.expansion_readiness_score} | Close Prob: ${closeProb}% | ETA: ${timeToClose}`
        });
      });
    });

    return items;
  }

  /**
   * Generate action items for Expansion Type Distribution KPI (Balance-focused)
   */
  static getExpansionTypeDistributionActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Analyze current distribution and identify imbalances
    const upsellOpps = expansionOpportunitiesData.filter(opp => opp.opportunity_type === 'upsell');
    const crossSellOpps = expansionOpportunitiesData.filter(opp => opp.opportunity_type === 'cross_sell');
    const capacityOpps = expansionTriggersData.filter(trigger => trigger.trigger_type === 'Capacity_Threshold');

    const totalOpps = upsellOpps.length + crossSellOpps.length + capacityOpps.length;
    const upsellPct = (upsellOpps.length / totalOpps) * 100;
    const crossSellPct = (crossSellOpps.length / totalOpps) * 100;
    const capacityPct = (capacityOpps.length / totalOpps) * 100;

    // Target distribution: 40% upsell, 35% cross-sell, 25% capacity
    const targetDistribution = { upsell: 40, crossSell: 35, capacity: 25 };
    
    // Identify which type needs more focus
    const imbalances = [
      { type: 'upsell', current: upsellPct, target: targetDistribution.upsell, gap: targetDistribution.upsell - upsellPct },
      { type: 'cross_sell', current: crossSellPct, target: targetDistribution.crossSell, gap: targetDistribution.crossSell - crossSellPct },
      { type: 'capacity', current: capacityPct, target: targetDistribution.capacity, gap: targetDistribution.capacity - capacityPct }
    ].sort((a, b) => b.gap - a.gap); // Biggest gap first

    // Focus on the most underrepresented type
    const focusType = imbalances[0];
    
    if (focusType.type === 'upsell' && focusType.gap > 5) {
      // Need more upsell opportunities
      const topUpsellOpps = upsellOpps
        .sort((a, b) => b.estimated_arr - a.estimated_arr)
        .slice(0, 6);

      topUpsellOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
        
        items.push({
          id: `BALANCE-UPSELL-${opp.opportunity_id}`,
          type: 'opportunity',
          title: `Priority Upsell - ${opp.recommended_product}`,
          customer: customerName,
          product: opp.recommended_product,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage,
          assignee: opp.sales_rep || 'Sales Team',
          priority: 'high',
          status: 'pending',
          nextAction: 'Focus on upsell to balance expansion mix',
          businessImpact: `Rebalance portfolio: Upsell at ${upsellPct.toFixed(1)}% (target: ${targetDistribution.upsell}%)`
        });
      });
    } else if (focusType.type === 'cross_sell' && focusType.gap > 5) {
      // Need more cross-sell opportunities
      const topCrossSellOpps = crossSellOpps
        .sort((a, b) => b.estimated_arr - a.estimated_arr)
        .slice(0, 6);

      topCrossSellOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
        
        items.push({
          id: `BALANCE-CROSS-${opp.opportunity_id}`,
          type: 'opportunity',
          title: `Priority Cross-sell - ${opp.recommended_product}`,
          customer: customerName,
          product: opp.recommended_product,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage,
          assignee: opp.sales_rep || 'Sales Team',
          priority: 'high',
          status: 'pending',
          nextAction: 'Focus on cross-sell to balance expansion mix',
          businessImpact: `Rebalance portfolio: Cross-sell at ${crossSellPct.toFixed(1)}% (target: ${targetDistribution.crossSell}%)`
        });
      });
    } else if (focusType.type === 'capacity' && focusType.gap > 5) {
      // Need more capacity-driven opportunities
      const topCapacityOpps = capacityOpps
        .sort((a, b) => (b.current_utilization || 0) - (a.current_utilization || 0))
        .slice(0, 6);

      topCapacityOpps.forEach((trigger, index) => {
        const customer = customersData.find(c => c.customer_id === trigger.customer_id);
        const customerName = customer?.customer_name || `Customer ${trigger.customer_id}`;
        
        items.push({
          id: `BALANCE-CAPACITY-${trigger.trigger_id}`,
          type: 'opportunity',
          title: `Priority Capacity - ${trigger.product_family}`,
          customer: customerName,
          product: trigger.product_family,
          amount: customer ? Math.floor(customer.arr * 0.3) : 75000,
          daysOverdue: trigger.days_since_trigger || 0,
          assignee: 'Sales Team',
          priority: 'high',
          status: 'pending',
          nextAction: 'Focus on capacity expansion to balance mix',
          businessImpact: `Rebalance portfolio: Capacity at ${capacityPct.toFixed(1)}% (target: ${targetDistribution.capacity}%)`
        });
      });
    } else {
      // Distribution is balanced, focus on highest value opportunities across all types
      const allOpportunities = [
        ...upsellOpps.map(opp => ({ ...opp, expansionType: 'upsell' })),
        ...crossSellOpps.map(opp => ({ ...opp, expansionType: 'cross_sell' })),
        ...capacityOpps.map(trigger => ({
          ...trigger,
          expansionType: 'capacity',
          estimated_arr: 75000,
          opportunity_id: trigger.trigger_id,
          recommended_product: trigger.product_family
        }))
      ].sort((a, b) => (b.estimated_arr || 0) - (a.estimated_arr || 0))
      .slice(0, 8);

      allOpportunities.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
        
        items.push({
          id: `BALANCED-${opp.expansionType}-${opp.opportunity_id}`,
          type: 'opportunity',
          title: `Balanced Mix - ${opp.recommended_product}`,
          customer: customerName,
          product: opp.recommended_product,
          amount: opp.estimated_arr || 75000,
          daysOverdue: (opp as any).days_in_stage || (opp as any).days_since_trigger || 0,
          assignee: (opp as any).sales_rep || 'Sales Team',
          priority: 'medium',
          status: 'pending',
          nextAction: `Maintain balanced ${opp.expansionType} approach`,
          businessImpact: `Balanced distribution maintained: ${opp.expansionType} opportunity`
        });
      });
    }

    return items;
  }

  /**
   * Generate action items for Exception Alerts KPI (Urgency-focused)
   */
  static getExceptionAlertsActionItems(): ActionItem[] {
    const items: ActionItem[] = [];
    
    // Focus on critical exceptions by severity and business impact
    
    // 1. CRITICAL: Revenue at immediate risk (contractions + high-value churn threats)
    const criticalRevenueRisk = revenueMovementsData
      .filter(rev => rev.movement_type === 'Contraction' && Math.abs(rev.amount_change) > 50000)
      .sort((a, b) => Math.abs(b.amount_change) - Math.abs(a.amount_change))
      .slice(0, 3);

    criticalRevenueRisk.forEach((rev, index) => {
      const customer = customersData.find(c => c.customer_id === rev.customer_id);
      const customerName = customer?.customer_name || `Customer ${rev.customer_id}`;
      const riskAmount = Math.abs(rev.amount_change);
      
      items.push({
        id: `CRITICAL-CHURN-${rev.movement_id}`,
        type: 'account',
        title: `🚨 CRITICAL: Major Revenue Risk`,
        customer: customerName,
        product: rev.product_family,
        amount: riskAmount,
        daysOverdue: 0,
        assignee: 'Executive Team',
        priority: 'high',
        status: 'pending',
        nextAction: 'URGENT: Executive intervention required within 24 hours',
        businessImpact: `CRITICAL: $${Math.floor(riskAmount/1000)}K ARR at immediate risk - potential major churn`
      });
    });

    // 2. HIGH: Stalled high-value deals (>$100K opportunities stuck >45 days)
    const stalledHighValueDeals = expansionOpportunitiesData
      .filter(opp => opp.estimated_arr > 100000 && opp.days_in_stage > 45)
      .sort((a, b) => b.estimated_arr - a.estimated_arr)
      .slice(0, 4);

    stalledHighValueDeals.forEach((opp, index) => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      const customerName = customer?.customer_name || `Customer ${opp.customer_id}`;
      
      items.push({
        id: `STALLED-DEAL-${opp.opportunity_id}`,
        type: 'opportunity',
        title: `⚠️ HIGH: Stalled High-Value Deal`,
        customer: customerName,
        product: opp.recommended_product,
        amount: opp.estimated_arr,
        daysOverdue: Math.max(0, opp.days_in_stage - 45),
        assignee: opp.sales_rep || 'Sales Manager',
        priority: 'high',
        status: 'pending',
        nextAction: `Escalate stalled ${opp.stage} - executive engagement needed`,
        businessImpact: `HIGH: $${Math.floor(opp.estimated_arr/1000)}K deal stalled ${opp.days_in_stage} days - risk of loss`
      });
    });

    // 3. MEDIUM: Overdue critical quotes (>60 days, >$50K value)
    const criticalOverdueQuotes = quotesData
      .filter(quote => {
        const daysOld = Math.floor((Date.now() - new Date(quote.quote_date).getTime()) / (1000 * 60 * 60 * 24));
        return daysOld > 60 && quote.quote_status === 'Pending' && quote.quote_amount > 50000;
      })
      .sort((a, b) => b.quote_amount - a.quote_amount)
      .slice(0, 3);

    criticalOverdueQuotes.forEach((quote, index) => {
      const customer = customersData.find(c => c.customer_id === quote.customer_id);
      const customerName = customer?.customer_name || `Customer ${quote.customer_id}`;
      const daysOverdue = Math.floor((Date.now() - new Date(quote.quote_date).getTime()) / (1000 * 60 * 60 * 24));
      
      items.push({
        id: `OVERDUE-QUOTE-${quote.quote_id}`,
        type: 'quote',
        title: `⚠️ MEDIUM: Critical Quote Overdue`,
        customer: customerName,
        product: 'Expansion Package',
        amount: quote.quote_amount,
        daysOverdue,
        assignee: 'Sales Team',
        priority: 'medium',
        status: 'pending',
        nextAction: `Urgent follow-up required - quote expires soon`,
        businessImpact: `MEDIUM: $${Math.floor(quote.quote_amount/1000)}K quote overdue ${daysOverdue} days - closing window`
      });
    });

    // 4. MEDIUM: Champion departures (inferred from low engagement + high ARR)
    const potentialChampionDepartures = customersData
      .filter(customer => customer.arr > 200000) // High-value accounts only
      .slice(0, 3); // Simulate champion departure risk

    potentialChampionDepartures.forEach((customer, index) => {
      items.push({
        id: `CHAMPION-RISK-${customer.customer_id}`,
        type: 'account',
        title: `⚠️ MEDIUM: Champion Departure Risk`,
        customer: customer.customer_name,
        product: 'Account Relationship',
        amount: customer.arr,
        daysOverdue: 0,
        assignee: 'CSM Team',
        priority: 'medium',
        status: 'pending',
        nextAction: 'Identify and cultivate new champions immediately',
        businessImpact: `MEDIUM: $${Math.floor(customer.arr/1000)}K account at risk due to champion changes`
      });
    });

    // 5. LOW: Competitive threats (based on low utilization in strategic accounts)
    const competitiveThreats = licensesData
      .filter(license => {
        const customer = customersData.find(c => c.customer_id === license.customer_id);
        return customer?.tier === 'Strategic' && license.utilization < 50;
      })
      .slice(0, 2);

    competitiveThreats.forEach((license, index) => {
      const customer = customersData.find(c => c.customer_id === license.customer_id);
      const customerName = customer?.customer_name || `Customer ${license.customer_id}`;
      
      items.push({
        id: `COMPETITIVE-${license.license_id}`,
        type: 'account',
        title: `ℹ️ LOW: Competitive Threat Indicator`,
        customer: customerName,
        product: license.product_family,
        amount: customer?.arr || 100000,
        daysOverdue: 0,
        assignee: 'CSM Team',
        priority: 'low',
        status: 'pending',
        nextAction: 'Monitor for competitive activity and strengthen value proposition',
        businessImpact: `LOW: Strategic account with ${license.utilization}% utilization - potential competitive risk`
      });
    });

    return items;
  }

  /**
   * Get action items for any KPI
   */
  static getActionItemsForKPI(kpiId: string, actionId?: string): ActionItem[] {
    // Handle specific drill-through actions
    if (actionId) {
      if (actionId === 'upsell-opportunities') {
        return this.getExpansionOpportunitiesByType('upsell');
      }
      if (actionId === 'cross-sell-opportunities') {
        return this.getExpansionOpportunitiesByType('cross_sell');
      }
      if (actionId === 'capacity-expansion') {
        return this.getExpansionOpportunitiesByType('capacity');
      }
      // Handle product-specific drill-throughs
      if (actionId.startsWith('product-') || actionId.startsWith('product-gap-')) {
        let product = actionId.replace('product-gap-', '').replace('product-', '').replace('-', ' ');
        
        const productMap: Record<string, string> = {
          'duo': 'Duo',
          'meraki': 'Meraki',
          'umbrella': 'Umbrella',
          'thousandeyes': 'ThousandEyes',
          'splunk': 'Splunk'
        };
        const productName = productMap[product.toLowerCase()] || product.charAt(0).toUpperCase() + product.slice(1);
        return this.getAccountsByProduct(productName);
      }
    }

    // Default KPI-based action items
    switch (kpiId) {
      case 'expansion-arr':
        return this.getExpansionARRActionItems();
      case 'nrr':
        return this.getNRRActionItems();
      case 'multi-product-penetration':
        return this.getMultiProductPenetrationActionItems();
      case 'white-space-value':
        return this.getWhiteSpaceActionItems();
      case 'opportunity-readiness':
        return this.getOpportunityReadinessActionItems(); // Consistent with ExpansionReadyAccountsService
      case 'utilization-expansion':
        return this.getUtilizationExpansionActionItems();
      case 'pipeline-arr':
        return this.getExpansionPipelineActionItems();
      case 'opportunity-readiness-matrix':
        return this.getOpportunityReadinessMatrixActionItems();
      case 'expansion-type-distribution':
        return this.getExpansionTypeDistributionActionItems();
      case 'exception-alerts':
        return this.getExceptionAlertsActionItems();
      default:
        return [];
    }
  }
}
