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
import subscriptionsData from '@/source_data/commercial_operations/subscriptions.json';

// Level 0: Product Line Comparison
export interface DSOLevel0ProductData {
  id: string;
  productFamily: string;
  dsoValue: number;
  arBalance: number;
  invoiceCount: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
  trend: number; // Percentage change from previous period
  customerCount: number;
}

// Level 1: DSO Trend + Aging Buckets (Product-Specific)
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

// Level 1.5: Aging Bucket Detail (NEW)
export interface DSOAgingBucketDetail {
  customerId: string;
  customerName: string;
  invoices: {
    invoiceId: string;
    invoiceNumber: string;
    amount: number;
    daysOutstanding: number;
    dueDate: string;
    status: string;
  }[];
  totalOutstanding: number;
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
   * Helper: Build subscription to product mapping
   */
  private buildSubscriptionProductMap(): Record<string, string> {
    const map: Record<string, string> = {};
    subscriptionsData.forEach(sub => {
      map[sub.subscription_id] = sub.product_family;
    });
    return map;
  }

  /**
   * Helper: Get product family from invoice
   */
  private getProductFromInvoice(invoice: typeof invoicesData[0], subMap: Record<string, string>): string | null {
    if (invoice.subscription_id && subMap[invoice.subscription_id]) {
      return subMap[invoice.subscription_id];
    }
    return null;
  }

  /**
   * Helper: Calculate DSO for a set of invoices
   * DSO measures payment collection time, so we use ALL invoices (paid + unpaid)
   */
  private calculateDSO(invoices: typeof invoicesData): number {
    if (invoices.length === 0) return 0;

    // DSO = Average days outstanding for ALL invoices
    const totalDaysOutstanding = invoices.reduce((sum, inv) =>
      sum + (inv.days_outstanding || 0), 0
    );

    return Math.round(totalDaysOutstanding / invoices.length);
  }

  /**
   * Level 0: Product Line Comparison
   * Business Story: "Which product lines are driving our DSO challenges?"
   */
  getLevel0ProductComparison(): DSOLevel0ProductData[] {
    const productFamilies = ['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk'];
    const target = 30; // 30 days target for all products

    // Build subscription to product mapping
    const subMap = this.buildSubscriptionProductMap();

    return productFamilies.map((productFamily, index) => {
      // Find all invoices for this product family (ALL invoices for DSO calc)
      const allProductInvoices = invoicesData.filter(inv => {
        const product = this.getProductFromInvoice(inv, subMap);
        return product === productFamily;
      });

      // Find outstanding invoices only for AR balance
      const outstandingInvoices = allProductInvoices.filter(inv =>
        inv.amount_outstanding > 0
      );

      // Calculate DSO for this product (using ALL invoices)
      const dsoValue = this.calculateDSO(allProductInvoices);

      // Calculate AR balance (only outstanding invoices)
      const arBalance = outstandingInvoices.reduce((sum, inv) =>
        sum + (inv.amount_outstanding || 0), 0
      );

      // Get unique customer count (from outstanding invoices)
      const uniqueCustomers = new Set(outstandingInvoices.map(inv => inv.customer_id));
      const customerCount = uniqueCustomers.size;

      // Calculate status based on DSO
      let status: 'good' | 'warning' | 'critical' = 'good';
      if (dsoValue > 45) status = 'critical';
      else if (dsoValue > 35) status = 'warning';
      else if (dsoValue > 30) status = 'warning';

      // Calculate trend (simulated improvement/decline)
      // In real scenario, this would compare to previous period
      const trendValues = [-5, 3, -8, 2, -6]; // Percentage changes
      const trend = trendValues[index % trendValues.length];

      return {
        id: `product-${productFamily.toLowerCase()}`,
        productFamily,
        dsoValue,
        arBalance,
        invoiceCount: outstandingInvoices.length, // Count only outstanding invoices
        target,
        status,
        trend,
        customerCount
      };
    });
  }

  /**
   * Level 1: DSO Trend + Aging Buckets (Product-Specific)
   * Business Story: "Is our collection getting better or worse for THIS product?"
   */
  getLevel1TrendData(productFamily?: string): DSOLevel1TrendData[] {
    // Generate 6 months of trend data
    const months = ['May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025'];
    const target = 30;

    // Build subscription to product mapping
    const subMap = this.buildSubscriptionProductMap();

    // Filter ALL invoices by product family if specified (for DSO calculation)
    let allFilteredInvoices = invoicesData;
    if (productFamily) {
      allFilteredInvoices = invoicesData.filter(inv => {
        const product = this.getProductFromInvoice(inv, subMap);
        return product === productFamily;
      });
    }

    // Filter outstanding invoices only (for AR aging buckets)
    const outstandingInvoices = allFilteredInvoices.filter(inv =>
      inv.amount_outstanding > 0
    );

    // Calculate base DSO for product (using ALL invoices)
    const baseDSO = this.calculateDSO(allFilteredInvoices);

    // Generate trend with some variation around base DSO
    const dsoValues = months.map((_, index) => {
      const variation = Math.sin(index / 2) * 3; // Creates wave pattern
      return Math.max(20, Math.round(baseDSO + variation));
    });

    return months.map((month, index) => {
      // Calculate AR aging buckets from OUTSTANDING invoices only
      const totalAR = outstandingInvoices.reduce((sum, inv) =>
        sum + (inv.amount_outstanding || 0), 0
      );

      // Calculate aging buckets based on days outstanding (for OUTSTANDING invoices)
      let current_0_30 = 0;
      let aging_31_60 = 0;
      let aging_61_90 = 0;
      let aging_90_plus = 0;

      outstandingInvoices.forEach(inv => {
        const days = inv.days_outstanding || 0;
        const amount = inv.amount_outstanding || 0;

        if (days <= 30) current_0_30 += amount;
        else if (days <= 60) aging_31_60 += amount;
        else if (days <= 90) aging_61_90 += amount;
        else aging_90_plus += amount;
      });
      
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
          current_0_30_pct: totalAR > 0 ? Math.round((current_0_30 / totalAR) * 100) : 0,
          aging_31_60_pct: totalAR > 0 ? Math.round((aging_31_60 / totalAR) * 100) : 0,
          aging_61_90_pct: totalAR > 0 ? Math.round((aging_61_90 / totalAR) * 100) : 0,
          aging_90_plus_pct: totalAR > 0 ? Math.round((aging_90_plus / totalAR) * 100) : 0
        },
        totalAR: totalAR * (1 + (Math.random() - 0.5) * 0.1)
      };
    });
  }

  /**
   * Level 2: Segment Performance Matrix (Product-Specific)
   * Business Story: "Which segments are slow payers for this product?"
   */
  getLevel2SegmentData(productFamily?: string): DSOLevel2SegmentData[] {
    const segments = ['Enterprise', 'Mid-Market', 'SMB'];
    const productFamilies = productFamily ? [productFamily] : ['Meraki', 'Duo', 'Splunk', 'Umbrella', 'ThousandEyes'];
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

  /**
   * Level 1.5: Aging Bucket Detail
   * Business Story: "Which customers and invoices are in this aging bucket?"
   */
  getAgingBucketDetail(productFamily: string, minDays: number, maxDays: number): DSOAgingBucketDetail[] {
    // Build subscription to product mapping
    const subMap = this.buildSubscriptionProductMap();

    // Filter invoices by product and aging range
    const filteredInvoices = invoicesData.filter(inv => {
      const product = this.getProductFromInvoice(inv, subMap);
      const days = inv.days_outstanding || 0;
      const hasOutstanding = inv.amount_outstanding > 0;

      return product === productFamily && hasOutstanding && days >= minDays && days <= maxDays;
    });

    // Group by customer
    const customerMap = new Map<string, typeof filteredInvoices>();
    filteredInvoices.forEach(inv => {
      const existing = customerMap.get(inv.customer_id) || [];
      customerMap.set(inv.customer_id, [...existing, inv]);
    });

    // Build result
    const result: DSOAgingBucketDetail[] = [];
    customerMap.forEach((invoices, customerId) => {
      // Find customer name from accounts data
      const customerAccount = accountsData.find(acc => acc.account.id === customerId);
      const customerName = customerAccount?.account.name || `Customer ${customerId}`;

      const totalOutstanding = invoices.reduce((sum, inv) =>
        sum + (inv.amount_outstanding || 0), 0
      );

      result.push({
        customerId,
        customerName,
        totalOutstanding,
        invoices: invoices.map(inv => ({
          invoiceId: inv.invoice_id,
          invoiceNumber: inv.invoice_number,
          amount: inv.amount_outstanding,
          daysOutstanding: inv.days_outstanding || 0,
          dueDate: inv.due_date,
          status: inv.is_disputed ? 'Disputed' : inv.is_overdue ? 'Overdue' : 'Current'
        }))
      });
    });

    // Sort by total outstanding amount (highest first)
    return result.sort((a, b) => b.totalOutstanding - a.totalOutstanding);
  }
}

// Export singleton instance
export const DSODrillDownService = new DSODrillDownServiceClass();
export default DSODrillDownService;
