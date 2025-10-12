/**
 * Quote-to-Cash Cycle Time Specific Drill-Down Service
 * Implements the 4-level drill-down specifically for Q2C KPI
 */

// Import data sources
import quoteToCashData from '@/source_data/commercial_operations/quote_to_cash_tracking.json';
import quotesData from '@/source_data/commercial_operations/quotes.json';
import accountsData from '@/source_data/commercial_operations/accounts.json';
import invoicesData from '@/source_data/commercial_operations/invoices.json';
import paymentsData from '@/source_data/commercial_operations/payments.json';

export interface Q2CLevel1ProcessStage {
  id: string;
  stage: string;
  avgDays: number;
  targetDays: number;
  variance: number;
  volume: number;
  status: 'good' | 'warning' | 'critical';
  color: string;
  stageOrder: number;
  description: string;
  icon: string;
}

export interface Q2CLevel2SegmentData {
  id: string;
  segment: string;
  productFamily: string;
  avgDays: number;
  volume: number;
  targetDays: number;
  variance: number;
  color: string;
  paymentTerms?: string;
  contractValue?: number;
}

export interface Q2CLevel3TransactionDetail {
  id: string;
  customerId: string;
  customerName: string;
  productFamily: string;
  quoteDate: string;
  totalDays: number;
  currentStage: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  status: 'good' | 'warning' | 'critical';
  invoiceAmount: number;
  paymentTerms: string;
  healthScore?: number;
  utilization?: number;
  trackingId?: string;
}

export interface Q2CLevel4RootCause {
  customerId: string;
  customerName: string;
  customerContext: {
    arr: number;
    tier: string;
    tenure: number;
    products: string[];
    healthScore: number;
    supportTickets: number;
  };
  financialPattern: {
    avgPaymentDays: number;
    paymentMethod: string;
    creditTerms: string;
    collectionsContacts: number;
  };
  utilizationSignal: {
    [product: string]: {
      utilization: number;
      status: 'good' | 'warning' | 'critical';
    };
  };
  timeline: Array<{
    stage: string;
    date: string;
    status: 'completed' | 'overdue' | 'pending';
  }>;
  riskFactors: string[];
  recommendations: string[];
}

export class Q2CCycleDrillDownService {
  
  /**
   * Level 1: Complete Q2C Process Stage Breakdown
   * Shows all stages in Quote-to-Cash including subscription lifecycle
   */
  static getLevel1ProcessBreakdown(): Q2CLevel1ProcessStage[] {
    const processStages: Q2CLevel1ProcessStage[] = [];
    
    // Calculate averages for each stage from quote_to_cash_tracking.json
    const completedTransactions = quoteToCashData.filter(t => t.is_complete);
    
    // Helper function to get status and color based on performance
    const getStatusAndColor = (actual: number, target: number) => {
      const variance = actual - target;
      if (variance <= 0) return { status: 'good' as const, color: '#10B981' };
      if (variance <= target * 0.5) return { status: 'warning' as const, color: '#F59E0B' };
      return { status: 'critical' as const, color: '#EF4444' };
    };

    // 1. Quote Creation (Internal Process)
    const quoteCreationDays = completedTransactions.map(t => {
      const created = new Date(t.quote_created_date);
      const sent = new Date(t.quote_sent_date);
      return Math.round((sent.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
    }).filter(d => d >= 0);
    const avgQuoteCreation = quoteCreationDays.reduce((sum, days) => sum + days, 0) / quoteCreationDays.length;
    const { status: creationStatus, color: creationColor } = getStatusAndColor(avgQuoteCreation, 1);
    
    processStages.push({
      id: 'q2c-stage-1-quote-creation',
      stage: 'Quote Creation',
      avgDays: Math.round(avgQuoteCreation * 10) / 10,
      targetDays: 1,
      variance: Math.round((avgQuoteCreation - 1) * 10) / 10,
      volume: quoteCreationDays.length,
      status: creationStatus,
      color: creationColor,
      stageOrder: 1,
      description: 'Time to create and send quote to customer',
      icon: 'FileText'
    });

    // 2. Quote Review & Approval
    const quoteReviewDays = completedTransactions.map(t => {
      const sent = new Date(t.quote_sent_date);
      const accepted = new Date(t.quote_accepted_date);
      return Math.round((accepted.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
    }).filter(d => d >= 0);
    const avgQuoteReview = quoteReviewDays.reduce((sum, days) => sum + days, 0) / quoteReviewDays.length;
    const { status: reviewStatus, color: reviewColor } = getStatusAndColor(avgQuoteReview, 5);
    
    processStages.push({
      id: 'q2c-stage-2-quote-review',
      stage: 'Quote Review & Approval',
      avgDays: Math.round(avgQuoteReview * 10) / 10,
      targetDays: 5,
      variance: Math.round((avgQuoteReview - 5) * 10) / 10,
      volume: quoteReviewDays.length,
      status: reviewStatus,
      color: reviewColor,
      stageOrder: 2,
      description: 'Customer review and approval of quote',
      icon: 'CheckCircle'
    });

    // 3. Order Processing
    const orderProcessingDays = completedTransactions.map(t => {
      const accepted = new Date(t.quote_accepted_date);
      const ordered = new Date(t.order_placed_date);
      return Math.round((ordered.getTime() - accepted.getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
    }).filter(d => d >= 0);
    const avgOrderProcessing = orderProcessingDays.reduce((sum, days) => sum + days, 0) / orderProcessingDays.length;
    const { status: orderStatus, color: orderColor } = getStatusAndColor(avgOrderProcessing, 1);
    
    processStages.push({
      id: 'q2c-stage-3-order-processing',
      stage: 'Order Processing',
      avgDays: Math.round(avgOrderProcessing * 10) / 10,
      targetDays: 1,
      variance: Math.round((avgOrderProcessing - 1) * 10) / 10,
      volume: orderProcessingDays.length,
      status: orderStatus,
      color: orderColor,
      stageOrder: 3,
      description: 'Convert approved quote to order',
      icon: 'ShoppingCart'
    });

    // 4. Order Fulfillment & Provisioning
    const orderFulfillmentDays = completedTransactions.map(t => {
      const ordered = new Date(t.order_placed_date);
      const fulfilled = new Date(t.order_fulfilled_date);
      return Math.round((fulfilled.getTime() - ordered.getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
    }).filter(d => d >= 0);
    const avgOrderFulfillment = orderFulfillmentDays.reduce((sum, days) => sum + days, 0) / orderFulfillmentDays.length;
    const { status: fulfillmentStatus, color: fulfillmentColor } = getStatusAndColor(avgOrderFulfillment, 3);
    
    processStages.push({
      id: 'q2c-stage-4-order-fulfillment',
      stage: 'Order Fulfillment',
      avgDays: Math.round(avgOrderFulfillment * 10) / 10,
      targetDays: 3,
      variance: Math.round((avgOrderFulfillment - 3) * 10) / 10,
      volume: orderFulfillmentDays.length,
      status: fulfillmentStatus,
      color: fulfillmentColor,
      stageOrder: 4,
      description: 'Provision licenses and activate services',
      icon: 'Settings'
    });

    // 5. Invoice Generation
    const invoiceGenerationDays = completedTransactions.map(t => {
      const fulfilled = new Date(t.order_fulfilled_date);
      const invoiceGenerated = new Date(t.invoice_generated_date);
      return Math.round((invoiceGenerated.getTime() - fulfilled.getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
    }).filter(d => d >= 0);
    const avgInvoiceGeneration = invoiceGenerationDays.reduce((sum, days) => sum + days, 0) / invoiceGenerationDays.length;
    const { status: invoiceGenStatus, color: invoiceGenColor } = getStatusAndColor(avgInvoiceGeneration, 1);
    
    processStages.push({
      id: 'q2c-stage-5-invoice-generation',
      stage: 'Invoice Generation',
      avgDays: Math.round(avgInvoiceGeneration * 10) / 10,
      targetDays: 1,
      variance: Math.round((avgInvoiceGeneration - 1) * 10) / 10,
      volume: invoiceGenerationDays.length,
      status: invoiceGenStatus,
      color: invoiceGenColor,
      stageOrder: 5,
      description: 'Generate and send invoice to customer',
      icon: 'FileText'
    });

    // 6. Payment Collection
    const paymentCollectionDays = completedTransactions.map(t => {
      const invoiceSent = new Date(t.invoice_sent_date);
      const paymentReceived = new Date(t.payment_received_date);
      return Math.round((paymentReceived.getTime() - invoiceSent.getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
    }).filter(d => d >= 0);
    const avgPaymentCollection = paymentCollectionDays.reduce((sum, days) => sum + days, 0) / paymentCollectionDays.length;
    const { status: paymentStatus, color: paymentColor } = getStatusAndColor(avgPaymentCollection, 30);
    
    processStages.push({
      id: 'q2c-stage-6-payment-collection',
      stage: 'Payment Collection',
      avgDays: Math.round(avgPaymentCollection * 10) / 10,
      targetDays: 30,
      variance: Math.round((avgPaymentCollection - 30) * 10) / 10,
      volume: paymentCollectionDays.length,
      status: paymentStatus,
      color: paymentColor,
      stageOrder: 6,
      description: 'Collect payment from customer',
      icon: 'CreditCard'
    });

    // 7. Subscription Activation (Post-Payment)
    // Simulated stage for subscription lifecycle
    const subscriptionActivationDays = 1.2; // Average based on business process
    const { status: subStatus, color: subColor } = getStatusAndColor(subscriptionActivationDays, 1);
    
    processStages.push({
      id: 'q2c-stage-7-subscription-activation',
      stage: 'Subscription Activation',
      avgDays: subscriptionActivationDays,
      targetDays: 1,
      variance: Math.round((subscriptionActivationDays - 1) * 10) / 10,
      volume: completedTransactions.length,
      status: subStatus,
      color: subColor,
      stageOrder: 7,
      description: 'Activate subscription and customer onboarding',
      icon: 'Zap'
    });

    return processStages.sort((a, b) => a.stageOrder - b.stageOrder);
  }

  /**
   * Level 2: Enhanced Segment Deep Dive
   * Shows performance by customer segment and product family with consistent color coding
   */
  static getLevel2SegmentAnalysis(stage: string): Q2CLevel2SegmentData[] {
    const segmentData: Q2CLevel2SegmentData[] = [];
    
    // Get customer tier mapping
    const customerTiers = new Map();
    accountsData.forEach(acc => {
      customerTiers.set(acc.account.id, acc.account.tier);
    });

    // Get quote product families
    const quoteProducts = new Map();
    quotesData.forEach(quote => {
      quoteProducts.set(quote.customer_id, quote.product_families[0] || 'Unknown');
    });

    // Enhanced stage mapping for all 7 stages
    const getStageData = (transaction: any, stageName: string) => {
      const stageMapping: { [key: string]: { days: number, target: number } } = {
        'Quote Creation': {
          days: Math.round((new Date(transaction.quote_sent_date).getTime() - new Date(transaction.quote_created_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10,
          target: 1
        },
        'Quote Review & Approval': {
          days: Math.round((new Date(transaction.quote_accepted_date).getTime() - new Date(transaction.quote_sent_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10,
          target: 5
        },
        'Order Processing': {
          days: Math.round((new Date(transaction.order_placed_date).getTime() - new Date(transaction.quote_accepted_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10,
          target: 1
        },
        'Order Fulfillment': {
          days: Math.round((new Date(transaction.order_fulfilled_date).getTime() - new Date(transaction.order_placed_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10,
          target: 3
        },
        'Invoice Generation': {
          days: Math.round((new Date(transaction.invoice_generated_date).getTime() - new Date(transaction.order_fulfilled_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10,
          target: 1
        },
        'Payment Collection': {
          days: Math.round((new Date(transaction.payment_received_date).getTime() - new Date(transaction.invoice_sent_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10,
          target: 30
        },
        'Subscription Activation': {
          days: 1.2, // Simulated
          target: 1
        }
      };
      
      return stageMapping[stageName] || { days: 0, target: 1 };
    };

    // Group by segment and product family
    const segmentGroups = new Map();
    
    quoteToCashData.filter(t => t.is_complete).forEach(transaction => {
      const customerTier = customerTiers.get(transaction.customer_id) || 'SMB';
      const productFamily = quoteProducts.get(transaction.customer_id) || 'Unknown';
      const key = `${customerTier}-${productFamily}`;
      
      if (!segmentGroups.has(key)) {
        segmentGroups.set(key, {
          segment: customerTier,
          productFamily: productFamily,
          transactions: [],
          totalDays: 0,
          count: 0
        });
      }
      
      const group = segmentGroups.get(key);
      const stageData = getStageData(transaction, stage);
      
      group.transactions.push(transaction);
      group.totalDays += stageData.days;
      group.count += 1;
    });

    // Helper function for consistent color coding
    const getStatusAndColor = (actual: number, target: number) => {
      const variance = actual - target;
      if (variance <= 0) return { status: 'good' as const, color: '#10B981' };
      if (variance <= target * 0.5) return { status: 'warning' as const, color: '#F59E0B' };
      return { status: 'critical' as const, color: '#EF4444' };
    };

    // Convert to segment data array
    segmentGroups.forEach((group, key) => {
      const avgDays = group.totalDays / group.count;
      const stageData = getStageData(group.transactions[0], stage);
      const targetDays = stageData.target;
      const variance = avgDays - targetDays;
      const { color } = getStatusAndColor(avgDays, targetDays);
      
      segmentData.push({
        id: `q2c-segment-${group.segment.toLowerCase()}-${group.productFamily.toLowerCase().replace(/\s+/g, '-')}`,
        segment: group.segment,
        productFamily: group.productFamily,
        avgDays: Math.round(avgDays * 10) / 10,
        volume: group.count,
        targetDays: targetDays,
        variance: Math.round(variance * 10) / 10,
        color: color,
        paymentTerms: 'Net 30',
        contractValue: group.transactions.reduce((sum, t) => sum + t.transaction_value, 0) / group.count
      });
    });

    return segmentData.sort((a, b) => b.avgDays - a.avgDays);
  }

  /**
   * Level 3: Enhanced Transaction Detail
   * Shows specific transactions requiring attention with consistent color coding
   */
  static getLevel3TransactionDetails(segment: string, productFamily: string): Q2CLevel3TransactionDetail[] {
    const transactionDetails: Q2CLevel3TransactionDetail[] = [];
    
    // Get customer details
    const customerDetails = new Map();
    accountsData.forEach(acc => {
      customerDetails.set(acc.account.id, {
        name: acc.account.name,
        tier: acc.account.tier,
        healthScore: Math.floor(Math.random() * 40) + 60 // Simulated health score
      });
    });

    // Enhanced filtering with better criteria
    const filteredTransactions = quoteToCashData.filter(transaction => {
      const customer = customerDetails.get(transaction.customer_id);
      const quote = quotesData.find(q => q.customer_id === transaction.customer_id);
      
      // Filter by segment and product family
      const segmentMatch = segment === 'all' || customer?.tier === segment;
      const productMatch = productFamily === 'all' || quote?.product_families?.includes(productFamily);
      
      // Focus on transactions that need attention (>30 days or incomplete)
      const needsAttention = transaction.quote_to_cash_days > 30 || !transaction.is_complete;
      
      return segmentMatch && productMatch && needsAttention;
    });

    // Helper function for consistent status determination
    const getTransactionStatus = (totalDays: number, isComplete: boolean) => {
      if (!isComplete) {
        return { priority: 'high' as const, status: 'critical' as const };
      }
      
      if (totalDays > 60) {
        return { priority: 'high' as const, status: 'critical' as const };
      } else if (totalDays > 45) {
        return { priority: 'medium' as const, status: 'warning' as const };
      } else {
        return { priority: 'low' as const, status: 'good' as const };
      }
    };

    filteredTransactions.forEach(transaction => {
      const customer = customerDetails.get(transaction.customer_id);
      const quote = quotesData.find(q => q.customer_id === transaction.customer_id);
      
      if (customer && quote) {
        const totalDays = transaction.quote_to_cash_days;
        const { priority, status } = getTransactionStatus(totalDays, transaction.is_complete);
        
        // Assign owners based on customer tier for consistency
        const ownerMapping = {
          'Enterprise': ['Jennifer L', 'Michael R', 'Sarah K'],
          'Mid-Market': ['Tom K', 'Lisa R', 'David M'],
          'SMB': ['Sarah M', 'Alex P', 'Maria G']
        };
        const owners = ownerMapping[customer.tier] || ownerMapping['SMB'];
        const owner = owners[Math.floor(Math.random() * owners.length)];

        transactionDetails.push({
          id: `q2c-transaction-${transaction.tracking_id || transaction.customer_id}-${transaction.quote_created_date.split('T')[0]}`,
          customerId: transaction.customer_id,
          customerName: customer.name,
          productFamily: quote.product_families[0] || 'Unknown',
          quoteDate: transaction.quote_created_date.split('T')[0],
          totalDays: Math.round(totalDays),
          currentStage: transaction.current_stage,
          owner: owner,
          priority: priority,
          status: status,
          invoiceAmount: transaction.transaction_value,
          paymentTerms: quote.payment_terms || 'Net 30',
          healthScore: customer.healthScore,
          utilization: Math.floor(Math.random() * 40) + 60,
          trackingId: transaction.tracking_id
        });
      }
    });

    return transactionDetails.sort((a, b) => {
      // Sort by priority first, then by total days
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : b.totalDays - a.totalDays;
    });
  }

  /**
   * Level 4: Root Cause Analysis
   * Deep dive into specific customer transaction
   */
  static getLevel4RootCauseAnalysis(customerId: string): Q2CLevel4RootCause | null {
    const customer = accountsData.find(acc => acc.account.id === customerId);
    const transaction = quoteToCashData.find(t => t.customer_id === customerId);
    const quotes = quotesData.filter(q => q.customer_id === customerId);
    
    if (!customer || !transaction) return null;

    // Build enhanced timeline with all 7 stages
    const timeline = [
      {
        stage: 'Quote Creation',
        date: transaction.quote_created_date.split('T')[0],
        status: 'completed' as const
      },
      {
        stage: 'Quote Sent',
        date: transaction.quote_sent_date.split('T')[0],
        status: 'completed' as const
      },
      {
        stage: 'Quote Review & Approval',
        date: transaction.quote_accepted_date.split('T')[0],
        status: 'completed' as const
      },
      {
        stage: 'Order Processing',
        date: transaction.order_placed_date.split('T')[0],
        status: 'completed' as const
      },
      {
        stage: 'Order Fulfillment',
        date: transaction.order_fulfilled_date.split('T')[0],
        status: 'completed' as const
      },
      {
        stage: 'Invoice Generation',
        date: transaction.invoice_generated_date.split('T')[0],
        status: 'completed' as const
      },
      {
        stage: 'Payment Collection',
        date: transaction.payment_received_date ? transaction.payment_received_date.split('T')[0] : 'Pending',
        status: transaction.payment_received_date ? 'completed' as const : 'overdue' as const
      },
      {
        stage: 'Subscription Activation',
        date: transaction.payment_received_date ? 
          new Date(new Date(transaction.payment_received_date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
          'Pending',
        status: transaction.payment_received_date ? 'completed' as const : 'pending' as const
      }
    ];

    // Enhanced risk factor analysis
    const riskFactors = [];
    
    // Payment-related risks
    if (transaction.invoice_to_payment_days > 45) {
      riskFactors.push(`${Math.round(transaction.invoice_to_payment_days - 30)} days past payment terms`);
    }
    
    // Quote-related risks
    const rejectedQuotes = quotes.filter(q => q.quote_status === 'rejected').length;
    if (rejectedQuotes > 0) {
      riskFactors.push(`Previous rejected quotes: ${rejectedQuotes}`);
    }
    
    // Process delay risks
    const quoteToOrderDays = Math.round((new Date(transaction.quote_accepted_date).getTime() - new Date(transaction.quote_sent_date).getTime()) / (1000 * 60 * 60 * 24));
    if (quoteToOrderDays > 7) {
      riskFactors.push(`Extended quote review period: ${quoteToOrderDays} days`);
    }
    
    // Fulfillment risks
    const fulfillmentDays = Math.round((new Date(transaction.order_fulfilled_date).getTime() - new Date(transaction.order_placed_date).getTime()) / (1000 * 60 * 60 * 24));
    if (fulfillmentDays > 5) {
      riskFactors.push(`Delayed order fulfillment: ${fulfillmentDays} days`);
    }

    // Enhanced recommendations based on stage analysis
    const recommendations = [];
    
    if (transaction.invoice_to_payment_days > 30) {
      recommendations.push('Escalate to customer finance team immediately');
      recommendations.push('Review and adjust payment terms for future orders');
      recommendations.push('Consider implementing automated payment reminders');
    }
    
    if (quoteToOrderDays > 7) {
      recommendations.push('Implement quote approval automation for this customer tier');
      recommendations.push('Provide customer training on approval workflows');
    }
    
    if (fulfillmentDays > 3) {
      recommendations.push('Review provisioning process for this product family');
      recommendations.push('Consider pre-provisioning for repeat customers');
    }
    
    if (transaction.quote_to_cash_days > 60) {
      recommendations.push('Assign dedicated account manager for future transactions');
      recommendations.push('Implement proactive monitoring for similar deals');
    }

    return {
      customerId: customerId,
      customerName: customer.account.name,
      customerContext: {
        arr: customer.account.arr,
        tier: customer.account.tier,
        tenure: Math.floor((new Date().getTime() - new Date(customer.account.created_date).getTime()) / (1000 * 60 * 60 * 24 * 30)),
        products: [...new Set(quotes.flatMap(q => q.product_families))],
        healthScore: Math.floor(Math.random() * 40) + 60,
        supportTickets: Math.floor(Math.random() * 5)
      },
      financialPattern: {
        avgPaymentDays: Math.round(transaction.invoice_to_payment_days || 30),
        paymentMethod: 'Wire Transfer',
        creditTerms: 'Net 30',
        collectionsContacts: Math.floor(Math.random() * 5) + 1
      },
      utilizationSignal: {
        'Duo': {
          utilization: Math.floor(Math.random() * 40) + 60,
          status: 'good'
        },
        'Meraki': {
          utilization: Math.floor(Math.random() * 30) + 40,
          status: 'warning'
        }
      },
      timeline: timeline,
      riskFactors: riskFactors,
      recommendations: recommendations
    };
  }
}
