/**
 * Churn Risk Analysis by Segment (Tier)
 * Level 2 - Tactical View
 */

import { getActiveAccounts, getAllSubscriptions } from '@/lib/data/csmDataLoader';

export interface SegmentRiskAnalysis {
  tier: string;
  totalARR: number;
  atRiskARR: number;
  riskPercentage: number;
  churnProbability: 'Low' | 'Medium' | 'High';
  accountCount: number;
  atRiskAccountCount: number;
  avgHealthScore: number;
}

export interface ChurnDriver {
  driver: string;
  accountCount: number;
  totalARR: number;
  percentage: number;
}

export interface ChurnRiskData {
  segments: SegmentRiskAnalysis[];
  totalARR: number;
  totalAtRiskARR: number;
  overallRiskPercentage: number;
  drivers: ChurnDriver[];
}

/**
 * Calculate churn risk analysis by tier segment
 */
export function calculateChurnRiskBySegment(filteredAccounts?: any[]): ChurnRiskData {
  const accounts = filteredAccounts || getActiveAccounts();
  const allSubscriptions = getAllSubscriptions();
  
  // Group by tier
  const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
  
  const segments: SegmentRiskAnalysis[] = tiers.map(tier => {
    const tierAccounts = accounts.filter(a => a.account.tier === tier);
    
    if (tierAccounts.length === 0) {
      return {
        tier,
        totalARR: 0,
        atRiskARR: 0,
        riskPercentage: 0,
        churnProbability: 'Low' as const,
        accountCount: 0,
        atRiskAccountCount: 0,
        avgHealthScore: 0
      } as SegmentRiskAnalysis;
    }
    
    // Calculate total ARR for tier
    const totalARR = tierAccounts.reduce((sum, acc) => sum + acc.account.arr, 0);
    
    // At-risk defined as health score < 60
    const atRiskAccounts = tierAccounts.filter(a => a.account.health_score < 60);
    const atRiskARR = atRiskAccounts.reduce((sum, acc) => sum + acc.account.arr, 0);
    
    const riskPercentage = totalARR > 0 ? (atRiskARR / totalARR) * 100 : 0;
    
    // Calculate average health score
    const avgHealthScore = tierAccounts.length > 0
      ? Math.round(tierAccounts.reduce((sum, a) => sum + a.account.health_score, 0) / tierAccounts.length)
      : 0;
    
    // Determine churn probability based on risk percentage
    let churnProbability: 'Low' | 'Medium' | 'High' = 'Low' as const;
    if (riskPercentage > 20) {
      churnProbability = 'High' as const;
    } else if (riskPercentage > 10) {
      churnProbability = 'Medium' as const;
    }
    
    return {
      tier,
      totalARR,
      atRiskARR,
      riskPercentage,
      churnProbability,
      accountCount: tierAccounts.length,
      atRiskAccountCount: atRiskAccounts.length,
      avgHealthScore
    };
  }).filter(s => s.accountCount > 0);
  
  // Calculate totals
  const totalARR = segments.reduce((sum, s) => sum + s.totalARR, 0);
  const totalAtRiskARR = segments.reduce((sum, s) => sum + s.atRiskARR, 0);
  const overallRiskPercentage = totalARR > 0 ? (totalAtRiskARR / totalARR) * 100 : 0;
  
  // Analyze churn drivers
  const drivers: ChurnDriver[] = [];
  
  // Get all licenses for utilization analysis
  const { getAllLicenses } = require('@/lib/data/csmDataLoader');
  const allLicenses = getAllLicenses();
  
  // Driver 1: Low utilization (<50%)
  const lowUtilAccounts = accounts.filter(acc => {
    const accountLicenses = allLicenses.filter((l: any) => l.customer_id === acc.account.id);
    if (accountLicenses.length === 0) return false;
    const avgUtil = accountLicenses.reduce((sum: number, l: any) => sum + l.utilization, 0) / accountLicenses.length;
    return avgUtil < 50;
  });
  
  if (lowUtilAccounts.length > 0) {
    drivers.push({
      driver: 'Low utilization (<50%)',
      accountCount: lowUtilAccounts.length,
      totalARR: lowUtilAccounts.reduce((sum, a) => sum + a.account.arr, 0),
      percentage: (lowUtilAccounts.length / accounts.length) * 100
    });
  }
  
  // Driver 2: Lack of engagement (health score < 50)
  const lowEngagementAccounts = accounts.filter(a => a.account.health_score < 50);
  
  if (lowEngagementAccounts.length > 0) {
    drivers.push({
      driver: 'Lack of engagement',
      accountCount: lowEngagementAccounts.length,
      totalARR: lowEngagementAccounts.reduce((sum, a) => sum + a.account.arr, 0),
      percentage: (lowEngagementAccounts.length / accounts.length) * 100
    });
  }
  
  // Driver 3: Support issues (accounts with health 50-60 indicating support problems)
  const supportIssueAccounts = accounts.filter(a => 
    a.account.health_score >= 50 && a.account.health_score < 60
  );
  
  if (supportIssueAccounts.length > 0) {
    drivers.push({
      driver: 'Support issues',
      accountCount: supportIssueAccounts.length,
      totalARR: supportIssueAccounts.reduce((sum, a) => sum + a.account.arr, 0),
      percentage: (supportIssueAccounts.length / accounts.length) * 100
    });
  }
  
  // Driver 4: Business outcome gaps (moderate health 60-70)
  const outcomeGapAccounts = accounts.filter(a => 
    a.account.health_score >= 60 && a.account.health_score < 70
  );
  
  if (outcomeGapAccounts.length > 0) {
    drivers.push({
      driver: 'Business outcome gaps',
      accountCount: outcomeGapAccounts.length,
      totalARR: outcomeGapAccounts.reduce((sum, a) => sum + a.account.arr, 0),
      percentage: (outcomeGapAccounts.length / accounts.length) * 100
    });
  }
  
  // Sort drivers by ARR impact
  drivers.sort((a, b) => b.totalARR - a.totalARR);
  
  return {
    segments,
    totalARR,
    totalAtRiskARR,
    overallRiskPercentage,
    drivers: drivers.slice(0, 4) // Top 4 drivers
  };
}
