/**
 * Overdue Success Activities
 * Level 3 - Operational View
 */

import { getActiveAccounts, getAllQBRTracking } from '@/lib/data/csmDataLoader';

export interface OverdueActivity {
  activityType: 'QBR' | 'Success Plan Review' | 'Onboarding Milestone' | 'Health Check' | 'Training Session';
  accountId: string;
  accountName: string;
  daysOverdue: number;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
  csm: string;
  action: string;
  healthScore: number;
  arr: number;
}

/**
 * Get overdue success activities
 */
export function getOverdueActivities(filteredAccounts?: any[]): OverdueActivity[] {
  const accounts = filteredAccounts || getActiveAccounts();
  const qbrTracking = getAllQBRTracking();
  
  const csmMapping: Record<string, string> = {
    'CSM_001': 'Sarah M.',
    'CSM_002': 'Mike T.',
    'CSM_003': 'Lisa K.',
    'CSM_004': 'David K.',
    'CSM_005': 'Emily R.'
  };
  
  const overdueActivities: OverdueActivity[] = [];
  const now = Date.now();
  
  accounts.forEach(account => {
    // Check for overdue QBRs
    const accountQBRs = qbrTracking.filter(q => q.customer_id === account.account.id);
    
    if (accountQBRs.length > 0) {
      // Get most recent QBR
      const recentQBR = accountQBRs.sort((a, b) => 
        new Date(b.qbr_date).getTime() - new Date(a.qbr_date).getTime()
      )[0];
      
      const daysSinceQBR = Math.floor((now - new Date(recentQBR.qbr_date).getTime()) / (1000 * 60 * 60 * 24));
      
      // QBR overdue if > 120 days (quarterly + buffer)
      if (daysSinceQBR > 120) {
        const daysOverdue = daysSinceQBR - 120;
        
        let priority: 'High' | 'Medium' | 'Low' = 'Medium';
        let impact = 'Relationship maintenance';
        
        if (account.account.health_score < 60) {
          priority = 'High';
          impact = 'Health declining';
        } else if (account.account.arr > 200000) {
          priority = 'High';
          impact = 'Strategic account';
        }
        
        overdueActivities.push({
          activityType: 'QBR',
          accountId: account.account.id,
          accountName: account.account.name,
          daysOverdue,
          priority,
          impact,
          csm: csmMapping[account.account.csm_id] || 'Unassigned',
          action: 'Schedule immediately',
          healthScore: account.account.health_score,
          arr: account.account.arr
        });
      }
    } else if (account.account.arr > 100000) {
      // No QBR record for high-value account
      overdueActivities.push({
        activityType: 'QBR',
        accountId: account.account.id,
        accountName: account.account.name,
        daysOverdue: 180, // Assume 6 months overdue
        priority: 'High',
        impact: 'No QBR history',
        csm: csmMapping[account.account.csm_id] || 'Unassigned',
        action: 'Schedule immediately',
        healthScore: account.account.health_score,
        arr: account.account.arr
      });
    }
    
    // Check for overdue success plan reviews (based on health score trends)
    if (account.account.health_score < 70) {
      // Simulate overdue success plan review
      const daysOverdue = Math.floor(30 + Math.random() * 30); // 30-60 days
      
      let priority: 'High' | 'Medium' | 'Low' = 'Medium';
      let impact = 'Plan needs updating';
      
      // Check for upcoming renewals
      const { getAllSubscriptions } = require('@/lib/data/csmDataLoader');
      const allSubscriptions = getAllSubscriptions();
      const accountSubs = allSubscriptions.filter((s: any) => s.customer_id === account.account.id);
      
      if (accountSubs.length > 0) {
        const nextRenewal = accountSubs.reduce((earliest: any, sub: any) => {
          const renewalDate = new Date(sub.renewal_date).getTime();
          const earliestDate = new Date(earliest.renewal_date).getTime();
          return renewalDate < earliestDate ? sub : earliest;
        });
        
        const daysToRenewal = Math.floor((new Date(nextRenewal.renewal_date).getTime() - now) / (1000 * 60 * 60 * 24));
        
        if (daysToRenewal < 60) {
          priority = 'Medium';
          impact = 'Renewal in 60d';
        }
      }
      
      overdueActivities.push({
        activityType: 'Success Plan Review',
        accountId: account.account.id,
        accountName: account.account.name,
        daysOverdue,
        priority,
        impact,
        csm: csmMapping[account.account.csm_id] || 'Unassigned',
        action: 'Update plan this week',
        healthScore: account.account.health_score,
        arr: account.account.arr
      });
    }
    
    // Check for overdue onboarding milestones (accounts with low health and recent start)
    const { getAllSubscriptions } = require('@/lib/data/csmDataLoader');
    const allSubscriptions = getAllSubscriptions();
    const accountSubs = allSubscriptions.filter((s: any) => s.customer_id === account.account.id);
    
    if (accountSubs.length > 0) {
      const earliestSub = accountSubs.reduce((earliest: any, sub: any) => {
        const subDate = new Date(sub.subscription_start_date).getTime();
        const earliestDate = new Date(earliest.subscription_start_date).getTime();
        return subDate < earliestDate ? sub : earliest;
      });
      
      const daysSinceStart = Math.floor((now - new Date(earliestSub.subscription_start_date).getTime()) / (1000 * 60 * 60 * 24));
      
      // If started within last 90 days but health < 65, onboarding may be stalled
      if (daysSinceStart < 90 && daysSinceStart > 30 && account.account.health_score < 65) {
        const daysOverdue = Math.floor(10 + Math.random() * 20); // 10-30 days
        
        overdueActivities.push({
          activityType: 'Onboarding Milestone',
          accountId: account.account.id,
          accountName: account.account.name,
          daysOverdue,
          priority: 'High',
          impact: 'Still in implementation',
          csm: csmMapping[account.account.csm_id] || 'Unassigned',
          action: 'Accelerate onboarding',
          healthScore: account.account.health_score,
          arr: account.account.arr
        });
      }
    }
  });
  
  // Sort by priority and days overdue
  const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
  return overdueActivities
    .sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.daysOverdue - a.daysOverdue;
    })
    .slice(0, 15); // Top 15 overdue activities
}
