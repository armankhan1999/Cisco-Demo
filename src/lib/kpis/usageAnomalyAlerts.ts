/**
 * Usage Anomaly Alerts
 * Level 3 - Operational View
 */

import { getActiveAccounts, getAllLicenses } from '@/lib/data/csmDataLoader';

export interface UsageAnomaly {
  alertId: string;
  accountId: string;
  accountName: string;
  product: string;
  issue: string;
  severity: 'Critical' | 'High' | 'Medium';
  daysActive: number;
  recommendedAction: string;
  currentUtilization: number;
  previousUtilization: number;
  change: number;
}

/**
 * Generate usage anomaly alerts
 */
export function getUsageAnomalyAlerts(filteredAccounts?: any[]): UsageAnomaly[] {
  const accounts = filteredAccounts || getActiveAccounts();
  const allLicenses = getAllLicenses();
  
  const anomalies: UsageAnomaly[] = [];
  let alertCounter = 2025678;
  
  accounts.forEach(account => {
    const accountLicenses = allLicenses.filter(l => l.customer_id === account.account.id);
    
    accountLicenses.forEach(license => {
      // Check for utilization drops
      if (license.utilization_trend === 'decreasing' && license.utilization < 70) {
        const drop = calculateUtilizationDrop(license.utilization);
        
        if (drop >= 45) {
          // Critical: Usage dropped 45%+
          anomalies.push({
            alertId: `ALT-2025-${alertCounter++}`,
            accountId: account.account.id,
            accountName: account.account.name,
            product: license.product_family,
            issue: `Usage dropped ${drop}%`,
            severity: 'Critical',
            daysActive: getRandomDays(5, 10),
            recommendedAction: 'Immediate outreach',
            currentUtilization: license.utilization,
            previousUtilization: license.utilization + drop,
            change: -drop
          });
        } else if (drop >= 30) {
          // High: Usage dropped 30-44%
          anomalies.push({
            alertId: `ALT-2025-${alertCounter++}`,
            accountId: account.account.id,
            accountName: account.account.name,
            product: license.product_family,
            issue: `Logins down ${drop}%`,
            severity: 'High',
            daysActive: getRandomDays(3, 7),
            recommendedAction: 'Check with champion',
            currentUtilization: license.utilization,
            previousUtilization: license.utilization + drop,
            change: -drop
          });
        }
      }
      
      // Check for stalled adoption
      if (license.adoption_stage === 'Early' || license.adoption_stage === 'Initial') {
        if (license.utilization < 50) {
          anomalies.push({
            alertId: `ALT-2025-${alertCounter++}`,
            accountId: account.account.id,
            accountName: account.account.name,
            product: license.product_family,
            issue: 'Feature adoption stalled',
            severity: 'Medium',
            daysActive: getRandomDays(10, 20),
            recommendedAction: 'Training recommendation',
            currentUtilization: license.utilization,
            previousUtilization: license.utilization,
            change: 0
          });
        }
      }
      
      // Check for sudden utilization spike (could indicate misuse or data quality issue)
      if (license.utilization_trend === 'increasing' && license.utilization > 95) {
        const spike = calculateUtilizationSpike(license.utilization);
        if (spike > 0) {
          anomalies.push({
            alertId: `ALT-2025-${alertCounter++}`,
            accountId: account.account.id,
            accountName: account.account.name,
            product: license.product_family,
            issue: `Unusual spike +${spike}%`,
            severity: 'Medium',
            daysActive: getRandomDays(1, 3),
            recommendedAction: 'Verify usage patterns',
            currentUtilization: license.utilization,
            previousUtilization: license.utilization - spike,
            change: spike
          });
        }
      }
    });
  });
  
  // Sort by severity and days active
  const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2 };
  return anomalies.sort((a, b) => {
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.daysActive - a.daysActive;
  }).slice(0, 20); // Top 20 anomalies
}

function calculateUtilizationDrop(currentUtil: number): number {
  // Simulate drop based on current utilization
  if (currentUtil < 40) return 45 + Math.random() * 10; // 45-55% drop
  if (currentUtil < 60) return 30 + Math.random() * 15; // 30-45% drop
  if (currentUtil < 70) return 20 + Math.random() * 10; // 20-30% drop
  return 0;
}

function calculateUtilizationSpike(currentUtil: number): number {
  // Only spike if already high utilization
  if (currentUtil > 95) return 15 + Math.random() * 10; // 15-25% spike
  return 0;
}

function getRandomDays(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
