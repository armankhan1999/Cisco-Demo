/**
 * Enhanced Exception Service
 * Advanced exception detection and analysis for Commercial Operations
 * Provides detailed invoice previews, quote details, and other exception drill-downs
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import invoicesData from '@/source_data/commercial_operations/invoices.json';
import quotesData from '@/source_data/commercial_operations/quotes.json';
import accountsReceivableData from '@/source_data/commercial_operations/accounts_receivable.json';
import revenueRecognitionData from '@/source_data/commercial_operations/revenue_recognition_schedule.json';
import paymentsData from '@/source_data/commercial_operations/payments.json';
import ordersData from '@/source_data/commercial_operations/orders.json';
import subscriptionsData from '@/source_data/commercial_operations/subscriptions.json';
import accountsData from '@/source_data/commercial_operations/accounts.json';

export interface DetailedInvoice {
  invoice_id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  invoice_amount: number;
  total_amount: number;
  amount_outstanding: number;
  days_overdue: number;
  aging_bucket: string;
  is_disputed: boolean;
  dispute_reason: string | null;
  dispute_status: string | null;
  payment_terms: string;
  invoice_date: string;
  due_date: string;
  subscription_details: any;
  line_items: any[];
  payment_history: any[];
  business_impact: string;
  recommended_actions: string[];
}

export interface DetailedQuote {
  quote_id: string;
  quote_number: string;
  customer_id: string;
  customer_name: string;
  total_amount: number;
  arr_value: number;
  quote_status: string;
  days_pending: number;
  approver: string;
  risk_level: 'high' | 'medium' | 'low';
  business_impact: string;
  next_actions: string[];
  product_families: string[];
  contract_term_months: number;
}

export interface DetailedARAccount {
  customer_id: string;
  customer_name: string;
  customer_tier: string;
  total_ar_balance: number;
  avg_days_outstanding: number;
  current_0_30_days: number;
  aging_31_60_days: number;
  aging_61_90_days: number;
  aging_90_plus_days: number;
  risk_score: number;
  payment_behavior: 'excellent' | 'good' | 'concerning' | 'poor';
  recommended_actions: string[];
}

export interface RevenueRecognitionAlert {
  schedule_id: string;
  customer_id: string;
  customer_name: string;
  issue_type: string;
  impact_amount: number;
  variance_percentage: number;
  resolution_needed: string;
  urgency: 'high' | 'medium' | 'low';
  business_impact: string;
}

/**
 * Get detailed disputed invoices with full context
 */
export function getDetailedDisputedInvoices(): DetailedInvoice[] {
  const disputedInvoices = invoicesData.filter(invoice => invoice.is_disputed === true);
  
  // Remove duplicates by invoice_id
  const uniqueInvoices = disputedInvoices.filter((invoice, index, self) => 
    index === self.findIndex(inv => inv.invoice_id === invoice.invoice_id)
  );
  
  return uniqueInvoices.map(invoice => {
    // Get customer details
    const customer = accountsData.find(acc => acc.account?.id === invoice.customer_id);
    
    // Get subscription details
    const subscription = subscriptionsData.find(sub => sub.subscription_id === invoice.subscription_id);
    
    // Get payment history
    const paymentHistory = paymentsData.filter(payment => payment.invoice_id === invoice.invoice_id);
    
    // Calculate business impact
    const businessImpact = calculateInvoiceBusinessImpact(invoice, customer);
    
    // Generate recommended actions
    const recommendedActions = generateInvoiceActions(invoice, customer, subscription);
    
    return {
      invoice_id: invoice.invoice_id,
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id,
      customer_name: customer?.account?.name || 'Unknown Customer',
      invoice_amount: invoice.invoice_amount,
      total_amount: invoice.total_amount,
      amount_outstanding: invoice.amount_outstanding,
      days_overdue: invoice.days_overdue || 0,
      aging_bucket: invoice.aging_bucket,
      is_disputed: invoice.is_disputed,
      dispute_reason: invoice.dispute_reason,
      dispute_status: invoice.dispute_status,
      payment_terms: invoice.payment_terms,
      invoice_date: invoice.invoice_date,
      due_date: invoice.due_date,
      subscription_details: subscription,
      line_items: [], // Would be populated from quote_line_items if available
      payment_history: paymentHistory,
      business_impact: businessImpact,
      recommended_actions: recommendedActions
    };
  });
}

/**
 * Get detailed quotes requiring immediate action
 */
export function getDetailedPendingQuotes(): DetailedQuote[] {
  const pendingQuotes = quotesData.filter(quote => 
    quote.quote_status === 'pending_approval' || 
    quote.quote_status === 'legal_review' ||
    quote.quote_status === 'pricing_exception'
  );
  
  // Remove duplicates by quote_id
  const uniqueQuotes = pendingQuotes.filter((quote, index, self) => 
    index === self.findIndex(q => q.quote_id === quote.quote_id)
  );
  
  return uniqueQuotes.map(quote => {
    // Get customer details
    const customer = accountsData.find(acc => acc.account?.id === quote.customer_id);
    
    // Calculate days pending
    const daysPending = calculateDaysPending(quote.quote_created_date);
    
    // Determine risk level
    const riskLevel = determineQuoteRisk(quote, daysPending);
    
    // Generate business impact assessment
    const businessImpact = calculateQuoteBusinessImpact(quote, daysPending);
    
    // Generate next actions
    const nextActions = generateQuoteActions(quote, daysPending, riskLevel);
    
    return {
      quote_id: quote.quote_id,
      quote_number: quote.quote_number,
      customer_id: quote.customer_id,
      customer_name: customer?.account?.name || 'Unknown Customer',
      total_amount: quote.total_amount,
      arr_value: quote.arr_value,
      quote_status: quote.quote_status,
      days_pending: daysPending,
      approver: determineApprover(quote.quote_status),
      risk_level: riskLevel,
      business_impact: businessImpact,
      next_actions: nextActions,
      product_families: quote.product_families || [],
      contract_term_months: quote.contract_term_months
    };
  });
}

/**
 * Get detailed AR accounts with high DSO
 */
export function getDetailedHighDSOAccounts(): DetailedARAccount[] {
  const highDSOAccounts = accountsReceivableData.filter(ar => ar.avg_days_outstanding > 45);
  
  // Remove duplicates by customer_id
  const uniqueAccounts = highDSOAccounts.filter((ar, index, self) => 
    index === self.findIndex(a => a.customer_id === ar.customer_id)
  );
  
  return uniqueAccounts.map(ar => {
    // Get customer details
    const customer = accountsData.find(acc => acc.account?.id === ar.customer_id);
    
    // Calculate risk score
    const riskScore = calculateARRiskScore(ar);
    
    // Determine payment behavior
    const paymentBehavior = determinePaymentBehavior(ar);
    
    // Generate recommended actions
    const recommendedActions = generateARActions(ar, riskScore);
    
    return {
      customer_id: ar.customer_id,
      customer_name: customer?.account?.name || 'Unknown Customer',
      customer_tier: ar.customer_tier,
      total_ar_balance: ar.total_ar_balance,
      avg_days_outstanding: ar.avg_days_outstanding,
      current_0_30_days: ar.current_0_30_days,
      aging_31_60_days: ar.aging_31_60_days,
      aging_61_90_days: ar.aging_61_90_days,
      aging_90_plus_days: ar.aging_90_plus_days,
      risk_score: riskScore,
      payment_behavior: paymentBehavior,
      recommended_actions: recommendedActions
    };
  });
}

/**
 * Get revenue recognition alerts with detailed context
 */
export function getRevenueRecognitionAlerts(): RevenueRecognitionAlert[] {
  // Find schedules with significant variances or issues
  const alertSchedules = revenueRecognitionData.filter(schedule => {
    // Use available fields for variance calculation
    const variance = Math.abs(schedule.total_recognized_to_date - schedule.total_contract_value * 0.25); // Simulate variance
    const variancePercentage = (variance / (schedule.total_contract_value * 0.25)) * 100;
    return variancePercentage > 5;
  });
  
  // Remove duplicates by schedule_id
  const uniqueSchedules = alertSchedules.filter((schedule, index, self) => 
    index === self.findIndex(s => s.schedule_id === schedule.schedule_id)
  );
  
  return uniqueSchedules.map(schedule => {
    // Get customer details
    const customer = accountsData.find(acc => acc.account?.id === schedule.customer_id);
    
    // Determine issue type
    const issueType = determineRevenueIssueType(schedule);
    
    // Calculate impact
    const impactAmount = Math.abs(schedule.total_recognized_to_date - schedule.total_contract_value * 0.25);
    const variancePercentage = (impactAmount / (schedule.total_contract_value * 0.25)) * 100;
    
    // Determine urgency
    const urgency = variancePercentage > 15 ? 'high' : variancePercentage > 8 ? 'medium' : 'low';
    
    return {
      schedule_id: schedule.schedule_id,
      customer_id: schedule.customer_id,
      customer_name: customer?.account?.name || 'Unknown Customer',
      issue_type: issueType,
      impact_amount: impactAmount,
      variance_percentage: Math.round(variancePercentage * 100) / 100,
      resolution_needed: generateRevenueResolution(schedule, issueType),
      urgency: urgency,
      business_impact: generateRevenueBusinessImpact(schedule, impactAmount)
    };
  });
}

// Helper functions
function calculateDaysPending(createdDate: string): number {
  const created = new Date(createdDate);
  const now = new Date();
  return Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function determineQuoteRisk(quote: any, daysPending: number): 'high' | 'medium' | 'low' {
  if (daysPending > 7 && quote.arr_value > 200000) return 'high';
  if (daysPending > 5 || quote.arr_value > 100000) return 'medium';
  return 'low';
}

function determineApprover(status: string): string {
  switch (status) {
    case 'pending_approval': return 'Dir, Sales Ops';
    case 'legal_review': return 'Legal Team';
    case 'pricing_exception': return 'VP, Commercial';
    default: return 'Sales Ops';
  }
}

function calculateInvoiceBusinessImpact(invoice: any, customer: any): string {
  if (invoice.amount_outstanding > 100000) {
    return `High-value customer dispute affecting cash flow. Customer tier: ${customer?.customer_tier || 'Unknown'}`;
  }
  return `Standard dispute resolution required. Monitor for escalation.`;
}

function generateInvoiceActions(invoice: any, customer: any, subscription: any): string[] {
  const actions = [];
  
  if (invoice.dispute_reason?.includes('usage')) {
    actions.push('Provide detailed usage reports and justification');
  }
  if (invoice.days_overdue > 30) {
    actions.push('Schedule executive escalation call');
  }
  if (customer?.customer_tier === 'Strategic') {
    actions.push('Assign dedicated account manager for resolution');
  }
  
  actions.push('Document dispute resolution in CRM');
  actions.push('Review billing accuracy for similar customers');
  
  return actions;
}

function calculateQuoteBusinessImpact(quote: any, daysPending: number): string {
  if (quote.arr_value > 200000 && daysPending > 7) {
    return `Critical: $${(quote.arr_value / 1000).toFixed(0)}K ARR at risk. Customer may seek alternatives.`;
  }
  if (quote.arr_value > 100000) {
    return `Significant: $${(quote.arr_value / 1000).toFixed(0)}K ARR opportunity. Maintain customer engagement.`;
  }
  return `Standard: Monitor for SLA compliance and customer satisfaction.`;
}

function generateQuoteActions(quote: any, daysPending: number, riskLevel: string): string[] {
  const actions = [];
  
  if (riskLevel === 'high') {
    actions.push('Immediate escalation to VP level');
    actions.push('Customer communication within 24 hours');
  }
  
  if (quote.quote_status === 'legal_review') {
    actions.push('Schedule legal review meeting');
    actions.push('Prepare standard contract alternatives');
  }
  
  if (daysPending > 5) {
    actions.push('Send status update to customer');
  }
  
  actions.push('Update opportunity stage in CRM');
  
  return actions;
}

function calculateARRiskScore(ar: any): number {
  let score = 0;
  
  // Days outstanding impact
  if (ar.avg_days_outstanding > 60) score += 40;
  else if (ar.avg_days_outstanding > 45) score += 25;
  else if (ar.avg_days_outstanding > 30) score += 10;
  
  // Aging distribution impact
  const oldDebt = ar.aging_61_90_days + ar.aging_90_plus_days;
  const totalDebt = ar.total_ar_balance;
  const oldDebtPercentage = (oldDebt / totalDebt) * 100;
  
  if (oldDebtPercentage > 30) score += 30;
  else if (oldDebtPercentage > 15) score += 15;
  
  // Balance size impact
  if (ar.total_ar_balance > 500000) score += 20;
  else if (ar.total_ar_balance > 200000) score += 10;
  
  return Math.min(score, 100);
}

function determinePaymentBehavior(ar: any): 'excellent' | 'good' | 'concerning' | 'poor' {
  if (ar.avg_days_outstanding <= 30) return 'excellent';
  if (ar.avg_days_outstanding <= 45) return 'good';
  if (ar.avg_days_outstanding <= 60) return 'concerning';
  return 'poor';
}

function generateARActions(ar: any, riskScore: number): string[] {
  const actions = [];
  
  if (riskScore > 70) {
    actions.push('Immediate collections call required');
    actions.push('Consider payment plan negotiation');
    actions.push('Legal review for collection options');
  } else if (riskScore > 40) {
    actions.push('Schedule follow-up call within 48 hours');
    actions.push('Send formal payment reminder');
  }
  
  if (ar.customer_tier === 'Strategic') {
    actions.push('Coordinate with account management team');
  }
  
  actions.push('Update payment terms for future orders');
  
  return actions;
}

function determineRevenueIssueType(schedule: any): string {
  if (schedule.recognition_status === 'pending_adjustment') {
    return 'Contract modification pending';
  }
  
  const variance = Math.abs(schedule.actual_recognized_amount - schedule.scheduled_amount);
  const variancePercentage = (variance / schedule.scheduled_amount) * 100;
  
  if (variancePercentage > 15) {
    return 'Significant variance detected';
  }
  
  return 'Usage-based true-up required';
}

function generateRevenueResolution(schedule: any, issueType: string): string {
  switch (issueType) {
    case 'Contract modification pending':
      return 'Process amendment in billing system';
    case 'Significant variance detected':
      return 'Review contract terms and usage data';
    case 'Usage-based true-up required':
      return 'Generate usage invoice adjustment';
    default:
      return 'Review recognition schedule';
  }
}

function generateRevenueBusinessImpact(schedule: any, impactAmount: number): string {
  if (impactAmount > 50000) {
    return `Material impact: $${(impactAmount / 1000).toFixed(0)}K variance affects quarterly results`;
  }
  return `Standard variance: Monitor for pattern and adjust processes`;
}
