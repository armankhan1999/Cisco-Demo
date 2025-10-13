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
        return this.getExpansionARRActionItems(); // Same as expansion ARR
      default:
        return [];
    }
  }
}
