/**
 * Product Family Adoption & Utilization Trends
 * Level 2 - Tactical View
 */

import { getActiveAccounts, getAllLicenses, getActiveSubscriptions } from '@/lib/data/csmDataLoader';

export interface ProductTrend {
  productFamily: string;
  avgUtilization: number;
  featureAdoption: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  riskAccounts: number;
  totalAccounts: number;
  status: 'success' | 'warning' | 'danger';
}

/**
 * Calculate adoption and utilization trends by product family
 */
export function calculateProductAdoptionTrends(filteredAccounts?: any[]): ProductTrend[] {
  const allLicenses = getAllLicenses();
  const accounts = filteredAccounts || getActiveAccounts();
  const accountIds = new Set(accounts.map(a => a.account.id));
  
  // Filter licenses for these accounts
  const licenses = allLicenses.filter(lic => accountIds.has(lic.customer_id));
  
  // Group by product family
  const productFamilies = ['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'];
  
  const trends: ProductTrend[] = productFamilies.map(product => {
    const productLicenses = licenses.filter(l => l.product_family === product);
    
    if (productLicenses.length === 0) {
      return {
        productFamily: product,
        avgUtilization: 0,
        featureAdoption: 0,
        trend: 'stable',
        trendPercentage: 0,
        riskAccounts: 0,
        totalAccounts: 0,
        status: 'warning'
      };
    }
    
    // Calculate average utilization
    const totalUtilization = productLicenses.reduce((sum, l) => sum + l.utilization, 0);
    const avgUtilization = Math.round(totalUtilization / productLicenses.length);
    
    // Calculate feature adoption based on adoption_stage
    const adoptionScores: Record<string, number> = {
      'Mature': 85,
      'Developing': 65,
      'Early': 45,
      'Initial': 25
    };
    
    const totalAdoption = productLicenses.reduce((sum, l) => {
      return sum + (adoptionScores[l.adoption_stage] || 50);
    }, 0);
    const featureAdoption = Math.round(totalAdoption / productLicenses.length);
    
    // Calculate trend based on utilization_trend
    const trendCounts = {
      increasing: 0,
      decreasing: 0,
      stable: 0
    };
    
    productLicenses.forEach(l => {
      if (l.utilization_trend) {
        trendCounts[l.utilization_trend as keyof typeof trendCounts]++;
      }
    });
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercentage = 0;
    
    if (trendCounts.increasing > trendCounts.decreasing && trendCounts.increasing > trendCounts.stable) {
      trend = 'up';
      trendPercentage = Math.round((trendCounts.increasing / productLicenses.length) * 10);
    } else if (trendCounts.decreasing > trendCounts.increasing) {
      trend = 'down';
      trendPercentage = -Math.round((trendCounts.decreasing / productLicenses.length) * 8);
    }
    
    // Count risk accounts (utilization < 60%)
    const riskAccounts = productLicenses.filter(l => l.utilization < 60).length;
    
    // Determine status
    let status: 'success' | 'warning' | 'danger' = 'success';
    if (avgUtilization < 60 || trend === 'down') {
      status = 'danger';
    } else if (avgUtilization < 75 || riskAccounts > productLicenses.length * 0.2) {
      status = 'warning';
    }
    
    return {
      productFamily: product,
      avgUtilization,
      featureAdoption,
      trend,
      trendPercentage,
      riskAccounts,
      totalAccounts: productLicenses.length,
      status
    };
  });
  
  return trends.filter(t => t.totalAccounts > 0);
}
