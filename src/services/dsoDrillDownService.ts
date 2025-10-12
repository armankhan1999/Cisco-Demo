/**
 * DSO (Days Sales Outstanding) Drill-Down Service
 * Implements complete 4-level drill-down system for DSO KPI
 * Based on all_kpi_drill_down.md specifications
 */

// Import data sources
import accountsReceivableData from '@/source_data/commercial_operations/accounts_receivable.json';
import invoicesData from '@/source_data/commercial_operations/invoices.json';
import paymentsData from '@/source_data/commercial_operations/payments.json';
import accountsData from '@/source_data/commercial_operations/accounts.json';

// Level 1: DSO Trend + Aging Buckets
export interface DSOLevel1TrendData {
  id: string;
  month: string;
  dsoValue: number;
  target: number;
  agingBuckets: {
    current_0_30: number;
    aging_31_60: number;
    aging_61_90: number;
    aging_90_plus: number;
  };
  agingPercentages: {
    current_0_30_pct: number;
    aging_31_60_pct: number;
    aging_61_90_pct: number;
    aging_90_plus_pct: number;
  };
  totalAR: number;
}

// Level 2: Segment Performance Matrix
export interface DSOLevel2SegmentData {
  id: string;
  segment: string;
  productFamily: string;
  dsoValue: number;
  arBalance: number;
  customerCount: number;
  status: 'good' | 'warning' | 'critical';
  color: string;
  bubbleSize: number; // For bubble chart
}

// Level 3: Customer AR Aging Detail
export interface DSOLevel3CustomerData {
  id: string;
  customerId: string;
  customerName: string;
  segment: string;
  totalOutstanding: number;
  current_0_30: number;
  aging_31_60: number;
  aging_61_90: number;
  aging_90_plus: number;
  avgDaysOutstanding: number;
  paymentHistory: number[]; // For sparkline (last 6 payments)
  paymentTrend: 'improving' | 'stable' | 'declining';
  priority: 'high' | 'medium' | 'low';
  overdueAmount: number;
  invoiceCount: number;
  oldestInvoiceDays: number;
}

// Level 4: Customer Payment Profile
export interface DSOLevel4CustomerProfile {
  id: string;
  customerId: string;
  customerName: string;
  totalAR: number;
  overdueAmount: number;
  overduePercentage: number;
  
  // Invoice Details
  invoiceDetails: {
    invoiceId: string;
    invoiceNumber: string;
    amount: number;
    daysOverdue: number;
    status: string;
    issueDate: string;
    dueDate: string;
    disputeStatus?: string;
  }[];
  
  // Historical Performance
  historicalPerformance: {
    avgDaysToPay: number;
    onTimeRate: number;
    paymentTimes: number[]; // Last 12 invoice payment times
  };
  
  // Customer Context
  customerContext: {
    arr: number;
    segment: string;
    products: string[];
    healthScore: number;
    csm: string;
    renewalDate: string;
    daysToRenewal: number;
  };
  
  // Risk Assessment
  riskAssessment: {
    collectionsRisk: 'low' | 'medium' | 'high';
    renewalRisk: 'low' | 'medium' | 'high';
    relationshipStrength: 'weak' | 'moderate' | 'strong';
  };
  
  // Collection Activity
  collectionActivity: {
    attempts: {
      date: string;
      type: 'email' | 'phone' | 'escalation';
      status: 'sent' | 'opened' | 'responded' | 'no_response';
      notes?: string;
    }[];
    nextSteps: {
      date: string;
      action: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };
}

class DSODrillDownServiceClass {
  
  /**
   * Level 1: DSO Trend + Aging Buckets
   * Business Story: "Is our collection getting better or worse?"
   */
  getLevel1TrendData(): DSOLevel1TrendData[] {
    // Generate 6 months of trend data
    const months = ['May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025'];
    const dsoValues = [28, 31, 35, 38, 35, 32]; // Trend showing improvement
    const target = 30;
    
    return months.map((month, index) => {
      // Calculate aging buckets from current AR data
      const totalAR = accountsReceivableData.reduce((sum, ar) => sum + ar.total_ar_balance, 0);
      const current_0_30 = accountsReceivableData.reduce((sum, ar) => sum + ar.current_0_30_days, 0);
      const aging_31_60 = accountsReceivableData.reduce((sum, ar) => sum + ar.aging_31_60_days, 0);
      const aging_61_90 = accountsReceivableData.reduce((sum, ar) => sum + ar.aging_61_90_days, 0);
      const aging_90_plus = accountsReceivableData.reduce((sum, ar) => sum + ar.aging_90_plus_days, 0);
      
      return {
        id: `dso-trend-${index}`,
        month,
        dsoValue: dsoValues[index],
        target,
        agingBuckets: {
          current_0_30: current_0_30 * (1 + (Math.random() - 0.5) * 0.2), // Add some variation
          aging_31_60: aging_31_60 * (1 + (Math.random() - 0.5) * 0.3),
          aging_61_90: aging_61_90 * (1 + (Math.random() - 0.5) * 0.4),
          aging_90_plus: aging_90_plus * (1 + (Math.random() - 0.5) * 0.5)
        },
        agingPercentages: {
          current_0_30_pct: Math.round((current_0_30 / totalAR) * 100),
          aging_31_60_pct: Math.round((aging_31_60 / totalAR) * 100),
          aging_61_90_pct: Math.round((aging_61_90 / totalAR) * 100),
          aging_90_plus_pct: Math.round((aging_90_plus / totalAR) * 100)
        },
        totalAR: totalAR * (1 + (Math.random() - 0.5) * 0.1)
      };
    });
  }

  /**
   * Level 2: Segment Performance Matrix
   * Business Story: "Which segments are slow payers?"
   */
  getLevel2SegmentData(): DSOLevel2SegmentData[] {
    const segments = ['Enterprise', 'Mid-Market', 'SMB'];
    const productFamilies = ['Meraki', 'Duo', 'Splunk', 'Umbrella', 'ThousandEyes'];
    const segmentData: DSOLevel2SegmentData[] = [];
    
    let idCounter = 1;
    
    segments.forEach(segment => {
      productFamilies.forEach(product => {
        // Filter AR data by segment (using customer tier mapping)
        const segmentARData = accountsReceivableData.filter(ar => {
          const tierMapping: Record<string, string> = {
            'Strategic': 'Enterprise',
            'Enterprise': 'Enterprise', 
            'Commercial': 'Mid-Market',
            'SMB': 'SMB'
          };
          return tierMapping[ar.customer_tier] === segment;
        });
        
        if (segmentARData.length === 0) return;
        
        // Calculate metrics for this segment-product combination
        const totalAR = segmentARData.reduce((sum, ar) => sum + ar.total_ar_balance, 0);
        const weightedDSO = segmentARData.reduce((sum, ar) => 
          sum + (ar.avg_days_outstanding * ar.total_ar_balance), 0
        ) / totalAR;
        
        // Determine status and color
        let status: 'good' | 'warning' | 'critical' = 'good';
        let color = '#10B981'; // Green
        
        if (weightedDSO > 45) {
          status = 'critical';
          color = '#EF4444'; // Red
        } else if (weightedDSO > 35) {
          status = 'warning';
          color = '#F59E0B'; // Yellow
        }
        
        segmentData.push({
          id: `segment-${idCounter++}`,
          segment,
          productFamily: product,
          dsoValue: Math.round(weightedDSO),
          arBalance: totalAR,
          customerCount: segmentARData.length,
          status,
          color,
          bubbleSize: Math.log(totalAR) * 10 // Logarithmic scaling for bubble size
        });
      });
    });
    
    return segmentData.filter(item => item.arBalance > 0);
  }

  /**
   * Level 3: Customer AR Aging Detail
   * Business Story: "Which customers owe the most?"
   */
  getLevel3CustomerData(segment?: string, productFamily?: string): DSOLevel3CustomerData[] {
    let filteredARData = accountsReceivableData;
    
    // Apply segment filter
    if (segment) {
      filteredARData = filteredARData.filter(ar => {
        const tierMapping: Record<string, string> = {
          'Strategic': 'Enterprise',
          'Enterprise': 'Enterprise',
          'Commercial': 'Mid-Market', 
          'SMB': 'SMB'
        };
        return tierMapping[ar.customer_tier] === segment;
      });
    }
    
    return filteredARData.map((ar, index) => {
      // Generate payment history sparkline (last 6 payments)
      const paymentHistory = Array.from({length: 6}, () => 
        Math.floor(Math.random() * 60) + 15 // 15-75 days
      );
      
      // Determine payment trend
      const recentAvg = paymentHistory.slice(-3).reduce((a, b) => a + b) / 3;
      const olderAvg = paymentHistory.slice(0, 3).reduce((a, b) => a + b) / 3;
      let paymentTrend: 'improving' | 'stable' | 'declining' = 'stable';
      
      if (recentAvg < olderAvg - 5) paymentTrend = 'improving';
      else if (recentAvg > olderAvg + 5) paymentTrend = 'declining';
      
      // Calculate priority
      let priority: 'high' | 'medium' | 'low' = 'low';
      if (ar.total_ar_balance > 40000 || ar.avg_days_outstanding > 60) {
        priority = 'high';
      } else if (ar.total_ar_balance > 20000 || ar.avg_days_outstanding > 30) {
        priority = 'medium';
      }
      
      return {
        id: `customer-ar-${index}`,
        customerId: ar.customer_id,
        customerName: ar.customer_name,
        segment: ar.customer_tier,
        totalOutstanding: ar.total_ar_balance,
        current_0_30: ar.current_0_30_days,
        aging_31_60: ar.aging_31_60_days,
        aging_61_90: ar.aging_61_90_days,
        aging_90_plus: ar.aging_90_plus_days,
        avgDaysOutstanding: ar.avg_days_outstanding,
        paymentHistory,
        paymentTrend,
        priority,
        overdueAmount: ar.overdue_balance,
        invoiceCount: ar.total_outstanding_invoices,
        oldestInvoiceDays: ar.oldest_invoice_days
      };
    }).sort((a, b) => b.totalOutstanding - a.totalOutstanding); // Sort by amount desc
  }

  /**
   * Level 4: Customer Payment Profile
   * Business Story: "Why is this customer delayed and what actions to take?"
   */
  getLevel4CustomerProfile(customerId: string): DSOLevel4CustomerProfile | null {
    // Find AR data for customer
    const customerAR = accountsReceivableData.find(ar => ar.customer_id === customerId);
    if (!customerAR) return null;
    
    // Find customer account data
    const customerAccount = accountsData.find(acc => acc.account.id === customerId);
    
    // Find customer invoices
    const customerInvoices = invoicesData.filter(inv => inv.customer_id === customerId);
    
    // Find customer payments
    const customerPayments = paymentsData.filter(pay => pay.customer_id === customerId);
    
    // Build invoice details
    const invoiceDetails = customerInvoices
      .filter(inv => inv.amount_outstanding > 0)
      .map(inv => ({
        invoiceId: inv.invoice_id,
        invoiceNumber: inv.invoice_number,
        amount: inv.amount_outstanding,
        daysOverdue: inv.days_overdue || 0,
        status: inv.is_disputed ? 'Disputed' : inv.is_overdue ? 'Overdue' : 'Current',
        issueDate: inv.invoice_date,
        dueDate: inv.due_date,
        disputeStatus: inv.is_disputed ? inv.dispute_status : undefined
      }))
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
    
    // Calculate historical performance
    const paidInvoices = customerInvoices.filter(inv => inv.invoice_status === 'paid');
    const paymentTimes = paidInvoices.map(inv => inv.days_outstanding || 30);
    const avgDaysToPay = paymentTimes.length > 0 ? 
      paymentTimes.reduce((sum, days) => sum + days, 0) / paymentTimes.length : 30;
    const onTimeRate = paidInvoices.length > 0 ?
      (paidInvoices.filter(inv => (inv.days_outstanding || 30) <= 30).length / paidInvoices.length) * 100 : 0;
    
    // Generate collection activity
    const collectionActivity = {
      attempts: [
        {
          date: '2025-10-01',
          type: 'email' as const,
          status: 'opened' as const,
          notes: 'Payment reminder sent to AP contact'
        },
        {
          date: '2025-10-05', 
          type: 'phone' as const,
          status: 'no_response' as const,
          notes: 'Voicemail left with finance team'
        },
        {
          date: '2025-10-08',
          type: 'email' as const,
          status: 'sent' as const,
          notes: 'Escalated to finance lead'
        }
      ],
      nextSteps: [
        {
          date: '2025-10-12',
          action: 'Follow-up with finance lead',
          priority: 'high' as const
        },
        {
          date: '2025-10-15',
          action: 'CSM intervention if no response',
          priority: 'medium' as const
        }
      ]
    };
    
    // Risk assessment
    const collectionsRisk = customerAR.overdue_balance > 20000 ? 'high' : 
                           customerAR.overdue_balance > 5000 ? 'medium' : 'low';
    const renewalRisk = avgDaysToPay > 45 ? 'medium' : 'low';
    const relationshipStrength = (customerAccount?.account.health_score || 65) > 70 ? 'strong' : 
                                (customerAccount?.account.health_score || 65) > 50 ? 'moderate' : 'weak';
    
    return {
      id: `customer-profile-${customerId}`,
      customerId,
      customerName: customerAR.customer_name,
      totalAR: customerAR.total_ar_balance,
      overdueAmount: customerAR.overdue_balance,
      overduePercentage: Math.round((customerAR.overdue_balance / customerAR.total_ar_balance) * 100),
      
      invoiceDetails,
      
      historicalPerformance: {
        avgDaysToPay: Math.round(avgDaysToPay),
        onTimeRate: Math.round(onTimeRate),
        paymentTimes: paymentTimes.slice(-12) // Last 12 payments
      },
      
      customerContext: {
        arr: customerAccount?.account.arr || 0,
        segment: customerAR.customer_tier,
        products: ['Meraki', 'Duo', 'Splunk'], // Simplified
        healthScore: customerAccount?.account.health_score || 65,
        csm: 'Jennifer L', // Simplified
        renewalDate: '2026-03-15',
        daysToRenewal: 153
      },
      
      riskAssessment: {
        collectionsRisk,
        renewalRisk,
        relationshipStrength
      },
      
      collectionActivity
    };
  }
}

// Export singleton instance
export const DSODrillDownService = new DSODrillDownServiceClass();
export default DSODrillDownService;
