/**
 * Expansion Ready Accounts Service
 * Generates real expansion-ready account data from source files
 */

// Import source data
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import whiteSpaceData from '@/source_data/csm-data/white_space_analysis.json';

export interface ExpansionReadyAccount {
  name: string;
  score: number;
  opportunity: string;
  tier: string;
  currentProducts: string[];
  recommendedProduct: string;
  estimatedARR: number;
}

export class ExpansionReadyAccountsService {
  
  /**
   * Get expansion-ready accounts by product
   */
  static getAccountsByProduct(): Record<string, ExpansionReadyAccount[]> {
    const productAccounts: Record<string, ExpansionReadyAccount[]> = {
      'Duo': [],
      'Meraki': [],
      'ThousandEyes': [],
      'Umbrella': [],
      'Splunk': []
    };

    // Get expansion opportunities grouped by recommended product
    const opportunitiesByProduct = expansionOpportunitiesData
      .filter(opp => opp.expansion_readiness_score >= 75) // Only high-readiness accounts
      .reduce((acc, opp) => {
        const product = opp.recommended_product;
        if (!acc[product]) acc[product] = [];
        acc[product].push(opp);
        return acc;
      }, {} as Record<string, typeof expansionOpportunitiesData>);

    // Process each product
    Object.keys(productAccounts).forEach(product => {
      const opportunities = opportunitiesByProduct[product] || [];
      
      opportunities
        .sort((a, b) => b.expansion_readiness_score - a.expansion_readiness_score)
        .slice(0, 5) // Top 5 per product
        .forEach(opp => {
          const customer = customersData.find(c => c.customer_id === opp.customer_id);
          if (customer) {
            const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
            const currentProducts = customerLicenses.map(l => l.product_family);
            
            productAccounts[product].push({
              name: customer.customer_name,
              score: opp.expansion_readiness_score,
              opportunity: `$${Math.floor(opp.estimated_arr / 1000)}K`,
              tier: customer.tier,
              currentProducts,
              recommendedProduct: opp.recommended_product,
              estimatedARR: opp.estimated_arr
            });
          }
        });
    });

    return productAccounts;
  }

  /**
   * Get top 10 expansion-ready accounts across all products
   */
  static getTop10Accounts(): ExpansionReadyAccount[] {
    const allOpportunities = expansionOpportunitiesData
      .filter(opp => opp.expansion_readiness_score >= 70)
      .sort((a, b) => b.expansion_readiness_score - a.expansion_readiness_score)
      .slice(0, 10);

    return allOpportunities.map((opp, index) => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      const customerLicenses = licensesData.filter(l => l.customer_id === customer?.customer_id);
      const currentProducts = customerLicenses.map(l => l.product_family);
      
      // Get additional products this customer could buy
      const whiteSpace = whiteSpaceData.find(ws => ws.account_id === customer?.customer_id);
      const additionalProducts = whiteSpace?.white_space_opportunities
        ?.map(ws => ws.product)
        .filter(p => p !== opp.recommended_product)
        .slice(0, 1) || [];
      
      const allRecommendedProducts = [opp.recommended_product, ...additionalProducts].join(', ');

      return {
        name: customer?.customer_name || `Customer ${opp.customer_id}`,
        score: opp.expansion_readiness_score,
        opportunity: `$${Math.floor(opp.estimated_arr / 1000)}K`,
        tier: customer?.tier || 'Enterprise',
        currentProducts,
        recommendedProduct: allRecommendedProducts,
        estimatedARR: opp.estimated_arr
      };
    });
  }

  /**
   * Get white space opportunities for accounts
   */
  static getWhiteSpaceAccounts(): ExpansionReadyAccount[] {
    return whiteSpaceData
      .filter(ws => ws.total_white_space_arr > 100000)
      .sort((a, b) => b.total_white_space_arr - a.total_white_space_arr)
      .slice(0, 15)
      .map(ws => {
        const customer = customersData.find(c => c.customer_id === ws.account_id);
        const customerLicenses = licensesData.filter(l => l.customer_id === ws.account_id);
        const currentProducts = customerLicenses.map(l => l.product_family);
        
        // Get the top white space opportunity
        const topOpportunity = ws.white_space_opportunities
          ?.sort((a, b) => b.estimated_arr - a.estimated_arr)[0];

        return {
          name: customer?.customer_name || `Customer ${ws.account_id}`,
          score: Math.min(95, Math.floor(ws.total_white_space_arr / 10000) + 60), // Generate readiness score based on opportunity size
          opportunity: `$${Math.floor(ws.total_white_space_arr / 1000)}K`,
          tier: customer?.tier || 'Enterprise',
          currentProducts,
          recommendedProduct: topOpportunity?.product || 'Multiple Products',
          estimatedARR: ws.total_white_space_arr
        };
      });
  }
}
