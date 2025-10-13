/**
 * Predicted Churn Risk Calculation
 * Forward-looking churn risk based on predictive models
 * 
 * Formula: (At-Risk ARR / Total Current ARR) × 100%
 * Data Source: churn_predictions.json
 */

import { getActiveAccounts } from '@/lib/data/csmDataLoader';
import churnPredictionsData from '@/source_data/csm-data/churn_predictions.json';
import championDepartureData from '@/source_data/csm-data/champion_departure_alerts.json';

export interface ChurnPrediction {
  prediction_id: string;
  account_id: string;
  account_name: string;
  prediction_date: string;
  model_version: string;
  model_type: string;
  current_health_score: number;
  churn_probability: number;
  churn_probability_tier: 'Low' | 'Medium' | 'High';
  estimated_churn_date: string;
  estimated_days_to_churn: number;
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_score: number;
  velocity_metrics: {
    health_velocity: number;
    health_trend: string;
    usage_velocity: number;
    usage_trend: string;
    engagement_velocity: number;
    engagement_trend: string;
  };
  risk_factors: Array<{
    factor: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
    contribution_to_risk: number;
    trend_direction: string;
  }>;
  intervention_window_days: number;
  intervention_urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  recommended_action: string;
  contract_end_date: string;
  days_to_renewal: number;
  arr_at_risk: number;
}

export interface PredictedChurnRiskResult {
  // Overall metrics
  totalARR: number;
  atRiskARR: number;
  riskRate: number;
  atRiskAccountCount: number;
  totalAccountCount: number;
  
  // Time-based breakdown
  next3Months: {
    arr: number;
    accountCount: number;
    avgProbability: number;
  };
  next12Months: {
    arr: number;
    accountCount: number;
    avgProbability: number;
  };
  
  // Risk level breakdown
  criticalRisk: { count: number; arr: number };
  highRisk: { count: number; arr: number };
  mediumRisk: { count: number; arr: number };
  lowRisk: { count: number; arr: number };
  
  // Alert counts
  alertCounts: {
    critical: number;
    high: number;
    medium: number;
    total: number;
  };
  
  // Predictions list
  predictions: ChurnPrediction[];
}

/**
 * Calculate predicted churn risk from predictions data
 * ONLY counts accounts with meaningful churn risk (probability > 40%)
 */
export function calculatePredictedChurnRisk(filteredAccounts?: any[]): PredictedChurnRiskResult {
  const accounts = filteredAccounts || getActiveAccounts();
  const predictions = churnPredictionsData as ChurnPrediction[];
  
  // Create account map for quick lookup
  const accountMap = new Map(accounts.map(a => [a.account.id, a]));
  
  // Filter predictions to only include active accounts AND meaningful risk (>40% probability)
  const activeAccountIds = new Set(accounts.map(a => a.account.id));
  const activePredictions = predictions.filter(p => 
    activeAccountIds.has(p.account_id) && p.churn_probability > 0.40  // Only >40% risk
  );
  
  // Calculate total portfolio ARR
  const totalARR = accounts.reduce((sum, acc) => sum + acc.account.arr, 0);
  
  // Calculate at-risk ARR (sum of all predicted churn)
  const atRiskARR = activePredictions.reduce((sum, p) => sum + p.arr_at_risk, 0);
  
  // Calculate risk rate percentage
  const riskRate = totalARR > 0 ? (atRiskARR / totalARR) * 100 : 0;
  
  // Calculate time-based breakdown
  const now = new Date();
  const threeMonthsOut = new Date();
  threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);
  const twelveMonthsOut = new Date();
  twelveMonthsOut.setMonth(twelveMonthsOut.getMonth() + 12);
  
  // 3-month predictions
  const next3MonthsPredictions = activePredictions.filter(p => {
    const churnDate = new Date(p.estimated_churn_date);
    return churnDate <= threeMonthsOut;
  });
  
  // 12-month predictions (all active predictions are typically 12-month window)
  const next12MonthsPredictions = activePredictions;
  
  // Risk level categorization (by probability - only meaningful risk >40%)
  const criticalRisk = activePredictions.filter(p => p.churn_probability >= 0.70);  // 70%+
  const highRisk = activePredictions.filter(p => p.churn_probability >= 0.50 && p.churn_probability < 0.70);  // 50-69%
  const mediumRisk = activePredictions.filter(p => p.churn_probability >= 0.40 && p.churn_probability < 0.50);  // 40-49%
  const lowRisk = activePredictions.filter(p => p.churn_probability < 0.40);  // Below threshold (should be empty)
  
  // Alert counts (based on urgency and days to churn)
  const criticalAlerts = activePredictions.filter(p => 
    p.intervention_urgency === 'Critical' || p.estimated_days_to_churn <= 30
  );
  const highAlerts = activePredictions.filter(p => 
    p.intervention_urgency === 'High' || 
    (p.estimated_days_to_churn > 30 && p.estimated_days_to_churn <= 90)
  );
  const mediumAlerts = activePredictions.filter(p => 
    p.intervention_urgency === 'Medium' ||
    (p.estimated_days_to_churn > 90 && p.estimated_days_to_churn <= 180)
  );
  
  return {
    totalARR,
    atRiskARR,
    riskRate,
    atRiskAccountCount: activePredictions.length,
    totalAccountCount: accounts.length,
    
    next3Months: {
      arr: next3MonthsPredictions.reduce((sum, p) => sum + p.arr_at_risk, 0),
      accountCount: next3MonthsPredictions.length,
      avgProbability: next3MonthsPredictions.length > 0
        ? next3MonthsPredictions.reduce((sum, p) => sum + p.churn_probability, 0) / next3MonthsPredictions.length
        : 0
    },
    
    next12Months: {
      arr: next12MonthsPredictions.reduce((sum, p) => sum + p.arr_at_risk, 0),
      accountCount: next12MonthsPredictions.length,
      avgProbability: next12MonthsPredictions.length > 0
        ? next12MonthsPredictions.reduce((sum, p) => sum + p.churn_probability, 0) / next12MonthsPredictions.length
        : 0
    },
    
    criticalRisk: {
      count: criticalRisk.length,
      arr: criticalRisk.reduce((sum, p) => sum + p.arr_at_risk, 0)
    },
    
    highRisk: {
      count: highRisk.length,
      arr: highRisk.reduce((sum, p) => sum + p.arr_at_risk, 0)
    },
    
    mediumRisk: {
      count: mediumRisk.length,
      arr: mediumRisk.reduce((sum, p) => sum + p.arr_at_risk, 0)
    },
    
    lowRisk: {
      count: lowRisk.length,
      arr: lowRisk.reduce((sum, p) => sum + p.arr_at_risk, 0)
    },
    
    alertCounts: {
      critical: criticalAlerts.length,
      high: highAlerts.length,
      medium: mediumAlerts.length,
      total: criticalAlerts.length + highAlerts.length + mediumAlerts.length
    },
    
    predictions: activePredictions
  };
}

/**
 * Get churn predictions for a specific account
 */
export function getAccountChurnPrediction(accountId: string): ChurnPrediction | null {
  const predictions = churnPredictionsData as ChurnPrediction[];
  return predictions.find(p => p.account_id === accountId) || null;
}

/**
 * Get champion departure alerts
 */
export function getChampionDepartureAlerts() {
  return championDepartureData;
}

/**
 * Get predictions by time window
 */
export function getPredictionsByTimeWindow(
  predictions: ChurnPrediction[],
  daysWindow: number
): ChurnPrediction[] {
  const now = new Date();
  const windowDate = new Date();
  windowDate.setDate(windowDate.getDate() + daysWindow);
  
  return predictions.filter(p => {
    const churnDate = new Date(p.estimated_churn_date);
    return churnDate <= windowDate;
  });
}

/**
 * Get top churn risk drivers
 */
export function getChurnRiskDrivers(predictions: ChurnPrediction[]) {
  const driverMap = new Map<string, { count: number; totalARR: number; totalContribution: number }>();
  
  predictions.forEach(p => {
    p.risk_factors.forEach(factor => {
      const existing = driverMap.get(factor.factor) || { count: 0, totalARR: 0, totalContribution: 0 };
      driverMap.set(factor.factor, {
        count: existing.count + 1,
        totalARR: existing.totalARR + p.arr_at_risk,
        totalContribution: existing.totalContribution + factor.contribution_to_risk
      });
    });
  });
  
  // Convert to array and sort by total ARR impact
  return Array.from(driverMap.entries())
    .map(([driver, stats]) => ({
      driver,
      accountCount: stats.count,
      totalARR: stats.totalARR,
      avgContribution: stats.totalContribution / stats.count,
      priority: stats.totalARR > 1000000 ? 1 : stats.totalARR > 500000 ? 2 : stats.totalARR > 100000 ? 3 : 4
    }))
    .sort((a, b) => b.totalARR - a.totalARR);
}
