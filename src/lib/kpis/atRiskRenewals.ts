/**
 * At-Risk Renewals (Next 90 Days)
 * Level 3 - Operational View
 */

import { getActiveAccounts, getAllSubscriptions } from '@/lib/data/csmDataLoader';

export interface AtRiskRenewal {
  accountId: string;
  accountName: string;
  renewalDate: Date;
  daysToRenewal: number;
  arr: number;
  confidence: 'Low' | 'Medium' | 'High';
  riskFactors: string[];
  csm: string;
  mitigationPlan: string;
  healthScore: number;
  tier: string;
}

/**
 * Get at-risk renewals in next 90 days
 */
export function getAtRiskRenewals(filteredAccounts?: any[]): AtRiskRenewal[] {
  const accounts = filteredAccounts || getActiveAccounts();
  const allSubscriptions = getAllSubscriptions();
  
  const now = Date.now();
  const ninetyDaysFromNow = now + (90 * 24 * 60 * 60 * 1000);
  
  const csmMapping: Record<string, string> = {
    'CSM_001': 'Sarah M.',
    'CSM_002': 'Mike T.',
    'CSM_003': 'Lisa K.',
    'CSM_004': 'David K.',
    'CSM_005': 'Emily R.'
  };
  
  const atRiskRenewals: AtRiskRenewal[] = [];
  
  accounts.forEach(account => {
    // Get subscriptions for this account
    const accountSubs = allSubscriptions.filter(sub => sub.customer_id === account.account.id);
    
    if (accountSubs.length === 0) return;
    
    // Find next renewal within 90 days
    const upcomingRenewals = accountSubs.filter(sub => {
      const renewalDate = new Date(sub.renewal_date).getTime();
      return renewalDate >= now && renewalDate <= ninetyDaysFromNow;
    });
    
    if (upcomingRenewals.length === 0) return;
    
    // Get earliest renewal
    const nextRenewal = upcomingRenewals.reduce((earliest, sub) => {
      const renewalDate = new Date(sub.renewal_date).getTime();
      const earliestDate = new Date(earliest.renewal_date).getTime();
      return renewalDate < earliestDate ? sub : earliest;
    });
    
    const renewalDate = new Date(nextRenewal.renewal_date);
    const daysToRenewal = Math.floor((renewalDate.getTime() - now) / (1000 * 60 * 60 * 24));
    
    // Only include if health score indicates risk (< 70)
    if (account.account.health_score >= 70) return;
    
    // Determine confidence and risk factors based on health score
    let confidence: 'Low' | 'Medium' | 'High' = 'Medium';
    const riskFactors: string[] = [];
    
    if (account.account.health_score < 52) {
      confidence = 'Low';
      riskFactors.push(`Health ${account.account.health_score}`);
    } else if (account.account.health_score < 65) {
      confidence = 'Medium';
      riskFactors.push(`Health ${account.account.health_score}`);
    }
    
    // Add risk factors based on patterns
    const { getAllLicenses } = require('@/lib/data/csmDataLoader');
    const allLicenses = getAllLicenses();
    const accountLicenses = allLicenses.filter((l: any) => l.customer_id === account.account.id);
    
    if (accountLicenses.length > 0) {
      const avgUtil = accountLicenses.reduce((sum: number, l: any) => sum + l.utilization, 0) / accountLicenses.length;
      if (avgUtil < 48) {
        riskFactors.push(`Util ${Math.round(avgUtil)}%`);
      }
    }
    
    // Check for champion/stakeholder issues (simulated based on health)
    if (account.account.health_score < 55) {
      riskFactors.push('No champion');
    }
    
    // Support issues indicator
    if (account.account.health_score >= 50 && account.account.health_score < 60) {
      riskFactors.push('Support issues');
    }
    
    // Feature gaps indicator
    if (accountLicenses.some((l: any) => l.adoption_stage === 'Early' || l.adoption_stage === 'Initial')) {
      riskFactors.push('Feature gaps');
    }
    
    // Budget concerns for lower health + higher ARR
    if (account.account.arr > 150000 && account.account.health_score < 60) {
      riskFactors.push('Budget concerns');
    }
    
    // Low ROI perception
    if (account.account.health_score < 58 && accountLicenses.length > 0) {
      const lowAdoption = accountLicenses.filter((l: any) => l.adoption_stage === 'Early' || l.adoption_stage === 'Initial').length;
      if (lowAdoption > accountLicenses.length / 2) {
        riskFactors.push('Low ROI perception');
      }
    }
    
    // Determine mitigation plan
    let mitigationPlan = '';
    if (confidence === 'Low') {
      mitigationPlan = 'Exec engagement + value audit';
    } else if (riskFactors.includes('Support issues') || riskFactors.includes('Feature gaps')) {
      mitigationPlan = 'Feature roadmap review + training';
    } else if (riskFactors.includes('Budget concerns') || riskFactors.includes('Low ROI perception')) {
      mitigationPlan = 'Value realization workshop';
    } else {
      mitigationPlan = 'Health improvement plan';
    }
    
    atRiskRenewals.push({
      accountId: account.account.id,
      accountName: account.account.name,
      renewalDate,
      daysToRenewal,
      arr: account.account.arr,
      confidence,
      riskFactors: riskFactors.slice(0, 4), // Top 4 factors
      csm: csmMapping[account.account.csm_id] || 'Unassigned',
      mitigationPlan,
      healthScore: account.account.health_score,
      tier: account.account.tier
    });
  });
  
  // Sort by days to renewal (most urgent first)
  return atRiskRenewals.sort((a, b) => a.daysToRenewal - b.daysToRenewal);
}
