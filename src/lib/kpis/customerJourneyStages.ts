/**
 * Customer Journey Stage Analysis
 * Level 2 - Tactical View
 */

import { getActiveAccounts, getAllSubscriptions, getAllLicenses } from '@/lib/data/csmDataLoader';

export interface JourneyStage {
  stage: string;
  accountCount: number;
  avgHealth: number;
  avgUtilization: number;
  avgTimeInStage: number; // days
  nextMilestone: string;
  stageRange: string;
}

/**
 * Determine journey stage based on account age (days since first subscription)
 */
function getJourneyStage(daysActive: number): {
  stage: string;
  stageRange: string;
  nextMilestone: string;
} {
  if (daysActive <= 30) {
    return {
      stage: 'Implementation',
      stageRange: '0-30d',
      nextMilestone: 'First value realization'
    };
  } else if (daysActive <= 90) {
    return {
      stage: 'Stabilization',
      stageRange: '30-90d',
      nextMilestone: 'Feature adoption targets'
    };
  } else if (daysActive <= 180) {
    return {
      stage: 'Optimization',
      stageRange: '90-180d',
      nextMilestone: 'Advanced features enabled'
    };
  } else {
    return {
      stage: 'Maturity',
      stageRange: '180d+',
      nextMilestone: 'Expansion conversations'
    };
  }
}

/**
 * Calculate customer journey stage analysis
 */
export function calculateCustomerJourneyStages(filteredAccounts?: any[]): JourneyStage[] {
  const accounts = filteredAccounts || getActiveAccounts();
  const allSubscriptions = getAllSubscriptions();
  const allLicenses = getAllLicenses();
  
  // Calculate days active for each account (from earliest subscription)
  const accountStages = accounts.map(account => {
    const accountSubs = allSubscriptions.filter(sub => sub.customer_id === account.account.id);
    
    if (accountSubs.length === 0) return null;
    
    // Find earliest subscription start date
    const earliestSubDate = accountSubs.reduce((earliest, sub) => {
      const subDate = new Date(sub.subscription_start_date).getTime();
      return subDate < earliest ? subDate : earliest;
    }, new Date(accountSubs[0].subscription_start_date).getTime());
    
    const now = Date.now();
    const daysActive = Math.floor((now - earliestSubDate) / (1000 * 60 * 60 * 24));
    
    // Get licenses for utilization
    const accountLicenses = allLicenses.filter(lic => lic.customer_id === account.account.id);
    const avgUtilization = accountLicenses.length > 0
      ? accountLicenses.reduce((sum, l) => sum + l.utilization, 0) / accountLicenses.length
      : 0;
    
    const journeyStage = getJourneyStage(daysActive);
    
    return {
      accountId: account.account.id,
      stage: journeyStage.stage,
      stageRange: journeyStage.stageRange,
      nextMilestone: journeyStage.nextMilestone,
      daysActive,
      healthScore: account.account.health_score,
      utilization: avgUtilization
    };
  }).filter(Boolean);
  
  // Group by stage
  const stages = ['Implementation', 'Stabilization', 'Optimization', 'Maturity'];
  
  const journeyStages: JourneyStage[] = stages.map(stageName => {
    const stageAccounts = accountStages.filter(a => a && a.stage === stageName);
    
    if (stageAccounts.length === 0) {
      return {
        stage: stageName,
        accountCount: 0,
        avgHealth: 0,
        avgUtilization: 0,
        avgTimeInStage: 0,
        nextMilestone: '',
        stageRange: ''
      };
    }
    
    const avgHealth = Math.round(
      stageAccounts.reduce((sum, a) => sum + (a?.healthScore || 0), 0) / stageAccounts.length
    );
    
    const avgUtilization = Math.round(
      stageAccounts.reduce((sum, a) => sum + (a?.utilization || 0), 0) / stageAccounts.length
    );
    
    const avgTimeInStage = Math.round(
      stageAccounts.reduce((sum, a) => sum + (a?.daysActive || 0), 0) / stageAccounts.length
    );
    
    return {
      stage: stageName,
      accountCount: stageAccounts.length,
      avgHealth,
      avgUtilization,
      avgTimeInStage,
      nextMilestone: stageAccounts[0]?.nextMilestone || '',
      stageRange: stageAccounts[0]?.stageRange || ''
    };
  }).filter(s => s.accountCount > 0);
  
  return journeyStages;
}
