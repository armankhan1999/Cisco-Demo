import accountsData from '../../source_data/accounts.json';
import contractsData from '../../source_data/master-data/contracts.json';
import stakeholdersData from '../../source_data/csm-data/stakeholders_enhanced.json';
import championDepartureAlerts from '../../source_data/csm-data/champion_departure_alerts.json';
import churnPredictions from '../../source_data/csm-data/churn_predictions.json';
import healthHistory202312 from '../../source_data/health-history/health-history-2023-12.json';
import healthHistory202401 from '../../source_data/health-history/health-history-2024-01.json';
import healthHistory202402 from '../../source_data/health-history/health-history-2024-02.json';
import healthHistory202403 from '../../source_data/health-history/health-history-2024-03.json';

// Combine all health history
const allHealthHistory = [
  ...healthHistory202312,
  ...healthHistory202401,
  ...healthHistory202402,
  ...healthHistory202403
];

export interface HealthTrend {
  month: string;
  year: number;
  score: number;
  date: string;
}

export interface Alert {
  id: number;
  severity: 'high' | 'medium' | 'low';
  title: string;
  triggered: string;
  details: string;
  impact: string;
  action: string;
  status: string;
}

export interface AccountDeepDiveData {
  account: any;
  healthScore: number;
  churnRisk: number;
  npsScore: number;
  healthTrend: HealthTrend[];
  alerts: Alert[];
  championDeparture: any | null;
  churnPrediction: any | null;
  stakeholders: any[];
}

/**
 * Get health score trend from accounts.json timeline (last 6 months)
 * If data is not available for a month, return 0
 */
export function getHealthTrend(accountId: string): HealthTrend[] {
  // First try to get from accounts.json timeline
  const account = accountsData.find((acc: any) => 
    acc.account?.id === accountId || acc.id === accountId
  ) as any;
  
  if (account && account.timeline && account.timeline.length > 0) {
    // Sort timeline by month
    const sortedTimeline = [...account.timeline].sort((a: any, b: any) => a.month - b.month);
    
    // Get last 6 months from timeline
    const last6Months = sortedTimeline.slice(-6);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return last6Months.map((item: any) => {
      const date = new Date(item.date);
      return {
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        score: item.health_score || 0,
        date: item.date
      };
    });
  }
  
  // Fallback to health-history files
  const accountHealthData = allHealthHistory.filter((h: any) => h.customer_id === accountId);
  
  if (accountHealthData.length === 0) {
    // Return 6 months of zeros if no data
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    return months.map((month, idx) => ({
      month,
      year: 2024,
      score: 0,
      date: `2024-${String(5 + idx).padStart(2, '0')}-01`
    }));
  }

  // Sort by date
  const sortedData = accountHealthData.sort((a: any, b: any) => 
    new Date(a.snapshot_date).getTime() - new Date(b.snapshot_date).getTime()
  );

  // Get last 6 months of data
  const monthlyAverages = new Map<string, { sum: number; count: number; date: Date }>();
  
  sortedData.forEach((record: any) => {
    const date = new Date(record.snapshot_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyAverages.has(monthKey)) {
      monthlyAverages.set(monthKey, { sum: 0, count: 0, date });
    }
    
    const existing = monthlyAverages.get(monthKey)!;
    existing.sum += record.health_score;
    existing.count += 1;
  });

  // Convert to array and get last 6 months
  const monthlyData = Array.from(monthlyAverages.entries())
    .map(([key, value]) => ({
      monthKey: key,
      avgScore: Math.round(value.sum / value.count),
      date: value.date
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-6);

  // If we have less than 6 months, pad with zeros at the beginning
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result: HealthTrend[] = [];
  
  // Calculate what 6 months ago would be
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  
  for (let i = 0; i < 6; i++) {
    const targetDate = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
    const targetMonthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
    
    const dataPoint = monthlyData.find(d => d.monthKey === targetMonthKey);
    
    result.push({
      month: monthNames[targetDate.getMonth()],
      year: targetDate.getFullYear(),
      score: dataPoint ? dataPoint.avgScore : 0,
      date: targetDate.toISOString().split('T')[0]
    });
  }

  return result;
}

/**
 * Get the latest health score for an account - prioritizes current state over historical milestones
 */
export function getLatestHealthScore(accountId: string): number {
  const account = accountsData.find((acc: any) => 
    acc.account?.id === accountId || acc.id === accountId
  ) as any;
  
  if (!account) return 0;
  
  const accountInfo = account.account || account;
  
  // PRIORITY 1: Check account.health_score FIRST (current state)
  // This is the most up-to-date health score
  if (accountInfo.health_score !== undefined) {
    return accountInfo.health_score;
  }
  
  // PRIORITY 2: Fallback to timeline for most recent health score (historical milestones)
  // Timeline entries are milestone-based and may be outdated
  if (account.timeline && account.timeline.length > 0) {
    const sortedTimeline = [...account.timeline].sort((a: any, b: any) => b.month - a.month);
    return sortedTimeline[0].health_score || 0;
  }
  
  // PRIORITY 3: Fallback to health-history files
  const accountHealthData = allHealthHistory.filter((h: any) => h.customer_id === accountId);
  
  if (accountHealthData.length > 0) {
    const sorted = accountHealthData.sort((a: any, b: any) => 
      new Date(b.snapshot_date).getTime() - new Date(a.snapshot_date).getTime()
    );
    return sorted[0].health_score;
  }

  return 0;
}

/**
 * Get stakeholders for an account
 */
export function getStakeholders(accountId: string): any[] {
  // stakeholders_enhanced.json doesn't have account_id, would need to be linked via another data source
  // For now, return empty array - this would need proper data mapping
  return [];
}

/**
 * Get champion departure alert for an account
 */
export function getChampionDepartureAlert(accountId: string): any | null {
  return championDepartureAlerts.find((alert: any) => alert.account_id === accountId) || null;
}

/**
 * Get churn prediction for an account
 */
export function getChurnPrediction(accountId: string): any | null {
  return churnPredictions.find((pred: any) => pred.account_id === accountId) || null;
}

/**
 * Generate alerts based on real data
 */
export function generateAlerts(accountId: string, utilizationRate: number, unusedLicenses: number): Alert[] {
  const alerts: Alert[] = [];
  const championAlert = getChampionDepartureAlert(accountId);
  const churnPred = getChurnPrediction(accountId);
  const healthTrend = getHealthTrend(accountId);
  
  let alertId = 1;

  // Alert 1: Low Utilization
  if (utilizationRate < 40) {
    const annualWaste = unusedLicenses * 1140; // $95/month * 12 months
    alerts.push({
      id: alertId++,
      severity: utilizationRate < 20 ? 'high' : 'medium',
      title: 'Critical Low Utilization',
      triggered: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      details: `Current: ${utilizationRate.toFixed(0)}% utilization (Threshold: <40%)`,
      impact: `$${annualWaste.toLocaleString()} annual waste + Churn risk`,
      action: 'Emergency intervention required - See Success Plan below',
      status: 'Open'
    });
  }

  // Alert 2: Health Score Declining
  const nonZeroScores = healthTrend.filter(h => h.score > 0);
  if (nonZeroScores.length >= 2) {
    const firstScore = nonZeroScores[0].score;
    const lastScore = nonZeroScores[nonZeroScores.length - 1].score;
    
    if (lastScore < firstScore && lastScore < 60) {
      alerts.push({
        id: alertId++,
        severity: 'high',
        title: 'Health Score Declining',
        triggered: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        details: `${nonZeroScores.length}-month decline (${firstScore} → ${lastScore})`,
        impact: `${churnPred ? (churnPred.churn_probability * 100).toFixed(0) : '75'}% churn probability at renewal`,
        action: 'Executive escalation + Emergency QBR',
        status: 'Open'
      });
    }
  }

  // Alert 3: Champion Departure
  if (championAlert) {
    alerts.push({
      id: alertId++,
      severity: championAlert.impact_level === 'HIGH' ? 'high' : 'medium',
      title: 'Champion Departure',
      triggered: new Date(championAlert.departure_detected_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      details: `Primary champion (${championAlert.champion_name}) left company`,
      impact: `Impact Score: ${championAlert.impact_score}/100 - Loss of internal advocacy`,
      action: 'Identify and nurture new champion within 30 days',
      status: 'Open (Requires immediate attention)'
    });
  }

  // Alert 4: High Churn Risk
  if (churnPred && churnPred.churn_probability > 0.7) {
    alerts.push({
      id: alertId++,
      severity: 'high',
      title: 'High Churn Risk Detected',
      triggered: new Date(churnPred.prediction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      details: `${(churnPred.churn_probability * 100).toFixed(0)}% churn probability (${churnPred.churn_probability_tier})`,
      impact: `Estimated ${churnPred.estimated_days_to_churn} days to churn`,
      action: churnPred.recommended_interventions?.[0] || 'Immediate intervention required',
      status: 'Open'
    });
  }

  return alerts;
}

/**
 * Load complete account deep dive data
 */
export function loadAccountDeepDive(accountId: string, utilization: any): AccountDeepDiveData {
  // Find account from accounts.json
  const account = accountsData.find((acc: any) => 
    acc.account?.id === accountId || acc.id === accountId
  ) as any;

  if (!account) {
    throw new Error(`Account ${accountId} not found`);
  }

  const accountInfo = account.account || account;
  
  // Get contract data for renewal date
  const contract = contractsData.find((c: any) => c.customer_id === accountId) as any;
  if (contract) {
    accountInfo.next_renewal_date = contract.end_date;
    accountInfo.contract_start_date = contract.start_date;
  }
  const healthScore = getLatestHealthScore(accountId);
  const healthTrend = getHealthTrend(accountId);
  const churnPrediction = getChurnPrediction(accountId);
  const championDeparture = getChampionDepartureAlert(accountId);
  
  // Calculate churn risk from prediction or health score
  let churnRisk = 0;
  if (churnPrediction) {
    churnRisk = Math.round(churnPrediction.churn_probability * 100);
  } else if (healthScore < 60) {
    churnRisk = Math.round((100 - healthScore) * 0.8); // Estimate based on health
  } else if (healthScore >= 60 && healthScore < 75) {
    churnRisk = Math.round((100 - healthScore) * 0.5); // Lower risk
  }

  // NPS score calculation: 0-6 = Detractor, 7-8 = Passive, 9-10 = Promoter
  let npsScore = 0;
  if (accountInfo.nps_score !== undefined) {
    npsScore = accountInfo.nps_score;
  } else {
    // Estimate from health score
    if (healthScore >= 90) npsScore = 9; // Promoter
    else if (healthScore >= 75) npsScore = 8; // Passive
    else if (healthScore >= 60) npsScore = 7; // Passive
    else npsScore = Math.max(0, Math.floor((healthScore / 100) * 6)); // Detractor
  }

  // Generate alerts based on real data
  const alerts = generateAlerts(accountId, utilization.rate, utilization.unusedLicenses);

  const stakeholders = getStakeholders(accountId);

  return {
    account: accountInfo,
    healthScore,
    churnRisk,
    npsScore,
    healthTrend,
    alerts,
    championDeparture,
    churnPrediction,
    stakeholders
  };
}
