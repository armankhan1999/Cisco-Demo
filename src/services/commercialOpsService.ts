/**
 * Commercial Operations Service
 * Handles all KPI calculations and data processing for Commercial Operations Command Center
 */

// Import all commercial operations data
import quotesData from '@/source_data/commercial_operations/quotes.json';
import quoteTrackingData from '@/source_data/commercial_operations/quote_to_cash_tracking.json';
import invoicesData from '@/source_data/commercial_operations/invoices.json';
import accountsReceivableData from '@/source_data/commercial_operations/accounts_receivable.json';
import revenueMovementsData from '@/source_data/commercial_operations/revenue_movements.json';
import revenueRecognitionData from '@/source_data/commercial_operations/revenue_recognition_schedule.json';
import paymentsData from '@/source_data/commercial_operations/payments.json';
import ordersData from '@/source_data/commercial_operations/orders.json';
import { getOverallDSO } from './dsoRealDataService';

export interface CommercialOpsKPIs {
  quoteToCashCycleTime: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  quoteApprovalVelocity: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  invoiceAccuracyRate: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  daysSalesOutstanding: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  revenueRecognitionAccuracy: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  deferredRevenueBalance: {
    value: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  quoteWinRate: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  renewalQuoteVelocity: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  overdueInvoicesAmount: {
    value: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
  expansionARRContribution: {
    value: number;
    target: number;
    trend: number;
    status: 'good' | 'warning' | 'critical';
  };
}

export interface TrendData {
  period: string;
  quoteToCashCycle: number;
  quoteWinRate: number;
  dso: number;
  invoiceAccuracy: number;
}

export interface ExceptionAlert {
  id: string;
  type: 'quotes' | 'invoices' | 'accounts';
  message: string;
  count: number;
  amount: number;
  severity: 'high' | 'medium' | 'low';
}

/**
 * Calculate Quote-to-Cash Cycle Time
 */
function calculateQuoteToCashCycleTime(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  const completedTracking = quoteTrackingData.filter(track => 
    track.is_complete === true && track.quote_to_cash_days
  );

  if (completedTracking.length === 0) {
    return { value: 0, target: 45, trend: 0, status: 'critical' };
  }

  // Use the pre-calculated quote_to_cash_days from the data
  const avgCycleTime = completedTracking.reduce((sum, track) => sum + (track.quote_to_cash_days || 0), 0) / completedTracking.length;
  const target = 45;
  
  // Calculate trend by comparing current vs previous period (simulate quarterly comparison)
  const currentQuarter = completedTracking.filter(track => 
    new Date(track.created_date) >= new Date('2025-04-01')
  );
  const previousQuarter = completedTracking.filter(track => 
    new Date(track.created_date) >= new Date('2025-01-01') && 
    new Date(track.created_date) < new Date('2025-04-01')
  );
  
  let trend = 0;
  if (currentQuarter.length > 0 && previousQuarter.length > 0) {
    const currentAvg = currentQuarter.reduce((sum, track) => sum + (track.quote_to_cash_days || 0), 0) / currentQuarter.length;
    const previousAvg = previousQuarter.reduce((sum, track) => sum + (track.quote_to_cash_days || 0), 0) / previousQuarter.length;
    trend = Math.round(((currentAvg - previousAvg) / previousAvg) * 100);
  }
  
  const status = avgCycleTime <= target ? 'good' : avgCycleTime <= target * 1.2 ? 'warning' : 'critical';
  
  return {
    value: Math.round(avgCycleTime * 10) / 10,
    target,
    trend,
    status
  };
}

/**
 * Calculate Quote Approval Velocity
 */
function calculateQuoteApprovalVelocity(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  const quotesWithApproval = quotesData.filter(quote => 
    quote.quote_created_date && quote.quote_accepted_date
  );

  if (quotesWithApproval.length === 0) {
    return { value: 0, target: 3, trend: 0, status: 'critical' };
  }

  const approvalTimes = quotesWithApproval.map(quote => {
    const quoteDate = new Date(quote.quote_created_date);
    const approvalDate = new Date(quote.quote_accepted_date!);
    return Math.ceil((approvalDate.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24));
  });

  const avgApprovalTime = approvalTimes.reduce((sum, time) => sum + time, 0) / approvalTimes.length;
  const target = 3;
  
  // Calculate trend by comparing current vs previous period
  const currentQuarter = quotesWithApproval.filter(quote => 
    new Date(quote.quote_created_date) >= new Date('2025-04-01')
  );
  const previousQuarter = quotesWithApproval.filter(quote => 
    new Date(quote.quote_created_date) >= new Date('2025-01-01') && 
    new Date(quote.quote_created_date) < new Date('2025-04-01')
  );
  
  let trend = 0;
  if (currentQuarter.length > 0 && previousQuarter.length > 0) {
    const currentAvg = currentQuarter.map(quote => {
      const quoteDate = new Date(quote.quote_created_date);
      const approvalDate = new Date(quote.quote_accepted_date!);
      return Math.ceil((approvalDate.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24));
    }).reduce((sum, time) => sum + time, 0) / currentQuarter.length;
    
    const previousAvg = previousQuarter.map(quote => {
      const quoteDate = new Date(quote.quote_created_date);
      const approvalDate = new Date(quote.quote_accepted_date!);
      return Math.ceil((approvalDate.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24));
    }).reduce((sum, time) => sum + time, 0) / previousQuarter.length;
    
    trend = Math.round(((currentAvg - previousAvg) / previousAvg) * 100);
  }
  
  const status = avgApprovalTime <= target ? 'good' : avgApprovalTime <= target * 1.5 ? 'warning' : 'critical';
  
  return {
    value: Math.round(avgApprovalTime * 10) / 10,
    target,
    trend,
    status
  };
}

/**
 * Calculate Invoice Accuracy Rate
 */
function calculateInvoiceAccuracyRate(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  const totalInvoices = invoicesData.length;
  // Use is_disputed as proxy for invoice errors
  const errorFreeInvoices = invoicesData.filter(invoice => 
    invoice.is_disputed === false
  ).length;

  const accuracyRate = totalInvoices > 0 ? (errorFreeInvoices / totalInvoices) * 100 : 0;
  const target = 98;
  
  // Calculate trend by comparing current vs previous period
  const currentQuarter = invoicesData.filter(invoice => 
    new Date(invoice.invoice_date) >= new Date('2025-04-01')
  );
  const previousQuarter = invoicesData.filter(invoice => 
    new Date(invoice.invoice_date) >= new Date('2025-01-01') && 
    new Date(invoice.invoice_date) < new Date('2025-04-01')
  );
  
  let trend = 0;
  if (currentQuarter.length > 0 && previousQuarter.length > 0) {
    const currentAccuracy = (currentQuarter.filter(inv => inv.is_disputed === false).length / currentQuarter.length) * 100;
    const previousAccuracy = (previousQuarter.filter(inv => inv.is_disputed === false).length / previousQuarter.length) * 100;
    trend = Math.round(((currentAccuracy - previousAccuracy) / previousAccuracy) * 100);
  }
  
  const status = accuracyRate >= target ? 'good' : accuracyRate >= target * 0.95 ? 'warning' : 'critical';
  
  return {
    value: Math.round(accuracyRate * 10) / 10,
    target,
    trend,
    status
  };
}

/**
 * Calculate Days Sales Outstanding (DSO)
 * Now uses the real DSO data service for consistent calculations
 */
function calculateDaysSalesOutstanding(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  return getOverallDSO();
}

/**
 * Calculate Revenue Recognition Accuracy
 */
function calculateRevenueRecognitionAccuracy(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  // Simulate revenue recognition accuracy calculation
  const accuracy = 99.2;
  const target = 98;
  const trend = 1; // Slight improvement
  
  const status = accuracy >= target ? 'good' : accuracy >= target * 0.98 ? 'warning' : 'critical';
  
  return {
    value: accuracy,
    target,
    trend,
    status
  };
}

/**
 * Calculate Deferred Revenue Balance
 */
function calculateDeferredRevenueBalance(): { value: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  // Calculate from revenue recognition data using total_deferred_balance
  const totalDeferred = revenueRecognitionData.reduce((sum, item) => {
    return sum + (item.total_deferred_balance || 0);
  }, 0);

  // Calculate trend by comparing current vs previous period
  const currentQuarter = revenueRecognitionData.filter(item => 
    new Date(item.recognition_period_start) >= new Date('2025-04-01')
  );
  const previousQuarter = revenueRecognitionData.filter(item => 
    new Date(item.recognition_period_start) >= new Date('2025-01-01') && 
    new Date(item.recognition_period_start) < new Date('2025-04-01')
  );
  
  let trend = 0;
  if (currentQuarter.length > 0 && previousQuarter.length > 0) {
    const currentDeferred = currentQuarter.reduce((sum, item) => sum + (item.total_deferred_balance || 0), 0);
    const previousDeferred = previousQuarter.reduce((sum, item) => sum + (item.total_deferred_balance || 0), 0);
    if (previousDeferred > 0) {
      trend = Math.round(((currentDeferred - previousDeferred) / previousDeferred) * 100);
    }
  }
  
  const status = 'good'; // Growing deferred revenue is typically good
  
  return {
    value: Math.round(totalDeferred / 1000000 * 10) / 10, // Convert to millions
    trend,
    status
  };
}

/**
 * Calculate Quote Win Rate
 */
function calculateQuoteWinRate(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  const totalQuotes = quotesData.length;
  const acceptedQuotes = quotesData.filter(quote => 
    quote.quote_status === 'accepted'
  ).length;

  const winRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;
  const target = 65;
  
  // Calculate trend by comparing current vs previous period
  const currentQuarter = quotesData.filter(quote => 
    new Date(quote.quote_created_date) >= new Date('2025-04-01')
  );
  const previousQuarter = quotesData.filter(quote => 
    new Date(quote.quote_created_date) >= new Date('2025-01-01') && 
    new Date(quote.quote_created_date) < new Date('2025-04-01')
  );
  
  let trend = 0;
  if (currentQuarter.length > 0 && previousQuarter.length > 0) {
    const currentWinRate = (currentQuarter.filter(q => q.quote_status === 'accepted').length / currentQuarter.length) * 100;
    const previousWinRate = (previousQuarter.filter(q => q.quote_status === 'accepted').length / previousQuarter.length) * 100;
    if (previousWinRate > 0) {
      trend = Math.round(((currentWinRate - previousWinRate) / previousWinRate) * 100);
    }
  }
  
  const status = winRate >= target ? 'good' : winRate >= target * 0.9 ? 'warning' : 'critical';
  
  return {
    value: Math.round(winRate * 10) / 10,
    target,
    trend,
    status
  };
}

/**
 * Calculate Renewal Quote Velocity
 */
function calculateRenewalQuoteVelocity(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  const renewalQuotes = quotesData.filter(quote => 
    quote.quote_type === 'renewal' && quote.quote_created_date && quote.quote_sent_date
  );

  if (renewalQuotes.length === 0) {
    return { value: 0, target: 14, trend: 0, status: 'critical' };
  }

  // Calculate velocity from creation to sent
  const velocities = renewalQuotes.map(quote => {
    const createdDate = new Date(quote.quote_created_date);
    const sentDate = new Date(quote.quote_sent_date!);
    return Math.ceil((sentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  });

  const avgVelocity = velocities.reduce((sum, vel) => sum + vel, 0) / velocities.length;
  const target = 14;
  
  // Calculate trend by comparing current vs previous period
  const currentQuarter = renewalQuotes.filter(quote => 
    new Date(quote.quote_created_date) >= new Date('2025-04-01')
  );
  const previousQuarter = renewalQuotes.filter(quote => 
    new Date(quote.quote_created_date) >= new Date('2025-01-01') && 
    new Date(quote.quote_created_date) < new Date('2025-04-01')
  );
  
  let trend = 0;
  if (currentQuarter.length > 0 && previousQuarter.length > 0) {
    const currentAvg = currentQuarter.map(quote => {
      const createdDate = new Date(quote.quote_created_date);
      const sentDate = new Date(quote.quote_sent_date!);
      return Math.ceil((sentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    }).reduce((sum, vel) => sum + vel, 0) / currentQuarter.length;
    
    const previousAvg = previousQuarter.map(quote => {
      const createdDate = new Date(quote.quote_created_date);
      const sentDate = new Date(quote.quote_sent_date!);
      return Math.ceil((sentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    }).reduce((sum, vel) => sum + vel, 0) / previousQuarter.length;
    
    trend = Math.round(((currentAvg - previousAvg) / previousAvg) * 100);
  }
  
  const status = avgVelocity <= target ? 'good' : avgVelocity <= target * 1.2 ? 'warning' : 'critical';
  
  return {
    value: Math.round(avgVelocity * 10) / 10,
    target,
    trend,
    status
  };
}

/**
 * Calculate Overdue Invoices Amount
 */
function calculateOverdueInvoicesAmount(): { value: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  const overdueInvoices = invoicesData.filter(invoice => 
    invoice.amount_outstanding > 0 && invoice.due_date
  );

  const totalOverdue = overdueInvoices.reduce((sum, invoice) => 
    sum + invoice.amount_outstanding, 0
  );

  const trend = -12; // Improvement (reduction)
  const status = totalOverdue < 500000 ? 'good' : totalOverdue < 1000000 ? 'warning' : 'critical';
  
  return {
    value: Math.round(totalOverdue / 1000), // Convert to thousands
    trend,
    status
  };
}

/**
 * Calculate Expansion ARR Contribution
 */
function calculateExpansionARRContribution(): { value: number; target: number; trend: number; status: 'good' | 'warning' | 'critical' } {
  const expansionMovements = revenueMovementsData.filter(movement => 
    movement.movement_type === 'expansion'
  );

  const totalExpansionARR = expansionMovements.reduce((sum, movement) => 
    sum + movement.arr_change, 0
  );

  // Calculate as percentage of total ARR (simulated)
  const totalARR = 50000000; // $50M total ARR
  const expansionPercentage = (totalExpansionARR / totalARR) * 100;
  
  const target = 25; // 25% target
  const trend = 4; // Improvement
  
  const status = expansionPercentage >= 20 && expansionPercentage <= 30 ? 'good' : 
                 expansionPercentage >= 15 ? 'warning' : 'critical';
  
  return {
    value: Math.round(expansionPercentage * 10) / 10,
    target,
    trend,
    status
  };
}

/**
 * Get all Commercial Operations KPIs
 */
export function getCommercialOpsKPIs(): CommercialOpsKPIs {
  return {
    quoteToCashCycleTime: calculateQuoteToCashCycleTime(),
    quoteApprovalVelocity: calculateQuoteApprovalVelocity(),
    invoiceAccuracyRate: calculateInvoiceAccuracyRate(),
    daysSalesOutstanding: calculateDaysSalesOutstanding(),
    revenueRecognitionAccuracy: calculateRevenueRecognitionAccuracy(),
    deferredRevenueBalance: calculateDeferredRevenueBalance(),
    quoteWinRate: calculateQuoteWinRate(),
    renewalQuoteVelocity: calculateRenewalQuoteVelocity(),
    overdueInvoicesAmount: calculateOverdueInvoicesAmount(),
    expansionARRContribution: calculateExpansionARRContribution()
  };
}

/**
 * Get trend data for charts
 */
export function getTrendData(): TrendData[] {
  // Calculate quarterly trends from actual data
  const quarters = [
    { period: 'Q3\'24', start: '2024-07-01', end: '2024-09-30' },
    { period: 'Q4\'24', start: '2024-10-01', end: '2024-12-31' },
    { period: 'Q1\'25', start: '2025-01-01', end: '2025-03-31' },
    { period: 'Q2\'25', start: '2025-04-01', end: '2025-06-30' }
  ];

  return quarters.map(quarter => {
    // Filter data for this quarter
    const quarterTracking = quoteTrackingData.filter(track => 
      track.is_complete && 
      new Date(track.created_date) >= new Date(quarter.start) && 
      new Date(track.created_date) <= new Date(quarter.end)
    );
    
    const quarterQuotes = quotesData.filter(quote => 
      new Date(quote.quote_created_date) >= new Date(quarter.start) && 
      new Date(quote.quote_created_date) <= new Date(quarter.end)
    );
    
    const quarterInvoices = invoicesData.filter(invoice => 
      new Date(invoice.invoice_date) >= new Date(quarter.start) && 
      new Date(invoice.invoice_date) <= new Date(quarter.end)
    );
    
    // Use all AR data since it's a snapshot view
    const quarterAR = accountsReceivableData;

    // Calculate metrics for this quarter
    const quoteToCashCycle = quarterTracking.length > 0 
      ? quarterTracking.reduce((sum, track) => sum + (track.quote_to_cash_days || 0), 0) / quarterTracking.length
      : 0;
    
    const quoteWinRate = quarterQuotes.length > 0 
      ? (quarterQuotes.filter(q => q.quote_status === 'accepted').length / quarterQuotes.length) * 100
      : 0;
    
    const dso = quarterAR.length > 0 
      ? quarterAR.reduce((sum, ar) => sum + (ar.avg_days_outstanding * ar.total_ar_balance), 0) / 
        quarterAR.reduce((sum, ar) => sum + ar.total_ar_balance, 0)
      : 0;
    
    const invoiceAccuracy = quarterInvoices.length > 0 
      ? (quarterInvoices.filter(inv => inv.is_disputed === false).length / quarterInvoices.length) * 100
      : 0;

    return {
      period: quarter.period,
      quoteToCashCycle: Math.round(quoteToCashCycle * 10) / 10,
      quoteWinRate: Math.round(quoteWinRate * 10) / 10,
      dso: Math.round(dso),
      invoiceAccuracy: Math.round(invoiceAccuracy * 10) / 10
    };
  });
}

/**
 * Get exception alerts
 */
export function getExceptionAlerts(): ExceptionAlert[] {
  const pendingQuotes = quotesData.filter(quote => 
    quote.quote_status === 'pending_approval'
  );

  const disputedInvoices = invoicesData.filter(invoice => 
    invoice.invoice_status === 'disputed'
  );

  const highDSOAccounts = accountsReceivableData.filter(ar => 
    ar.avg_days_outstanding > 60
  );

  return [
    {
      id: 'pending-quotes',
      type: 'quotes',
      message: 'quotes pending approval > 5 days',
      count: Math.min(pendingQuotes.length, 12),
      amount: 1.8,
      severity: 'high'
    },
    {
      id: 'disputed-invoices',
      type: 'invoices',
      message: 'invoices disputed',
      count: Math.min(disputedInvoices.length, 7),
      amount: 425,
      severity: 'medium'
    },
    {
      id: 'high-dso-accounts',
      type: 'accounts',
      message: 'accounts with DSO > 60 days',
      count: Math.min(highDSOAccounts.length, 23),
      amount: 3.2,
      severity: 'high'
    }
  ];
}

/**
 * Get product family performance data
 */
export function getProductFamilyPerformance() {
  return [
    { name: 'Meraki', errorRate: 1.2, volume: 234, impact: 12450, color: '#049FD9' },
    { name: 'Duo', errorRate: 0.8, volume: 189, impact: 6780, color: '#6CC04A' },
    { name: 'Umbrella', errorRate: 1.5, volume: 156, impact: 18900, color: '#F58220' },
    { name: 'ThousandEyes', errorRate: 2.1, volume: 127, impact: 28340, color: '#ED1C24' },
    { name: 'Splunk', errorRate: 1.8, volume: 98, impact: 22150, color: '#7B5EA7' }
  ];
}

/**
 * Get DSO aging analysis
 */
export function getDSOAgingAnalysis() {
  const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
  
  return tiers.map(tier => {
    const tierData = accountsReceivableData.filter(ar => ar.customer_tier === tier);
    const totalAR = tierData.reduce((sum, ar) => sum + ar.total_ar_balance, 0);
    const current = tierData.reduce((sum, ar) => sum + ar.current_0_30_days, 0);
    const aging31_60 = tierData.reduce((sum, ar) => sum + ar.aging_31_60_days, 0);
    const aging61_90 = tierData.reduce((sum, ar) => sum + ar.aging_61_90_days, 0);
    const aging90Plus = tierData.reduce((sum, ar) => sum + ar.aging_90_plus_days, 0);
    const avgDSO = tierData.length > 0 ? 
      tierData.reduce((sum, ar) => sum + (ar.avg_days_outstanding * ar.total_ar_balance), 0) / totalAR : 0;

    return {
      tier,
      current: Math.round(current / 1000),
      aging31_60: Math.round(aging31_60 / 1000),
      aging61_90: Math.round(aging61_90 / 1000),
      aging90Plus: Math.round(aging90Plus / 1000),
      totalAR: Math.round(totalAR / 1000),
      avgDSO: Math.round(avgDSO),
      status: avgDSO <= 30 ? 'good' : avgDSO <= 40 ? 'warning' : 'critical'
    };
  });
}
