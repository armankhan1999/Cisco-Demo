/**
 * Critical Health Accounts - Exception Report
 * Level 3 - Operational View
 */

import { getActiveAccounts, getAllSubscriptions } from '@/lib/data/csmDataLoader';

export interface CriticalAccount {
  accountId: string;
  accountName: string;
  healthScore: number;
  arr: number;
  primaryRiskFactor: string;
  daysToRenewal: number;
  csm: string;
  actionPlanStatus: 'Not Started' | 'In Progress' | 'Scheduled' | 'Completed';
  tier: string;
}

/**
 * Get critical health accounts (health score < 46)
 */
export function getCriticalHealthAccounts(filteredAccounts?: any[]): CriticalAccount[] {
  const accounts = filteredAccounts || getActiveAccounts();
  const allSubscriptions = getAllSubscriptions();
  
  // Filter for critical health (0-45)
  const criticalAccounts = accounts.filter(a => a.account.health_score <= 45);
  
  // Get CSM mapping
  const csmMapping: Record<string, string> = {
    'CSM_001': 'Sarah M.',
    'CSM_002': 'Mike T.',
    'CSM_003': 'Lisa K.',
    'CSM_004': 'David K.',
    'CSM_005': 'Emily R.'
  };
  
  const result: CriticalAccount[] = criticalAccounts.map(account => {
    // Find next renewal date
    const accountSubs = allSubscriptions.filter(sub => sub.customer_id === account.account.id);
    
    let daysToRenewal = 999;
    if (accountSubs.length > 0) {
      const now = Date.now();
      const renewalDates = accountSubs.map(sub => new Date(sub.renewal_date).getTime());
      const nextRenewal = Math.min(...renewalDates);
      daysToRenewal = Math.floor((nextRenewal - now) / (1000 * 60 * 60 * 24));
    }
    
    // Determine primary risk factor based on health score ranges
    let primaryRiskFactor = 'No engagement';
    let actionPlanStatus: CriticalAccount['actionPlanStatus'] = 'Not Started';
    
    if (account.account.health_score < 30) {
      primaryRiskFactor = 'Severe utilization issues';
      actionPlanStatus = daysToRenewal < 60 ? 'Scheduled' : 'In Progress';
    } else if (account.account.health_score < 38) {
      primaryRiskFactor = 'Low utilization (< 35%)';
      actionPlanStatus = 'Scheduled';
    } else if (account.account.health_score < 42) {
      primaryRiskFactor = 'Support escalations';
      actionPlanStatus = 'In Progress';
    } else {
      primaryRiskFactor = 'No engagement (90+ days)';
      actionPlanStatus = daysToRenewal < 90 ? 'Scheduled' : 'Not Started';
    }
    
    return {
      accountId: account.account.id,
      accountName: account.account.name,
      healthScore: account.account.health_score,
      arr: account.account.arr,
      primaryRiskFactor,
      daysToRenewal,
      csm: csmMapping[account.account.csm_id] || 'Unassigned',
      actionPlanStatus,
      tier: account.account.tier
    };
  });
  
  // Sort by health score (lowest first) and ARR (highest first)
  return result.sort((a, b) => {
    if (a.healthScore !== b.healthScore) return a.healthScore - b.healthScore;
    return b.arr - a.arr;
  });
}
