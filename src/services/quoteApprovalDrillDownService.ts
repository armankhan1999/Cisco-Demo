/**
 * Quote Approval Velocity Drill-Down Service
 * Implements the 4-level drill-down specifically for Quote Approval KPI
 */

// Import data sources
import quotesData from '@/source_data/commercial_operations/quotes.json';
import accountsData from '@/source_data/commercial_operations/accounts.json';
import quoteLineItemsData from '@/source_data/commercial_operations/quote_line_items.json';

export interface QuoteApprovalLevel1ApprovalStage {
  id: string;
  stage: string;
  count: number;
  avgDays: number;
  targetDays: number;
  variance: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical';
  color: string;
  stageOrder: number;
  description: string;
}

export interface QuoteApprovalLevel2BottleneckData {
  id: string;
  dealSize: number;
  approvalDays: number;
  complexity: 'simple' | 'moderate' | 'complex';
  quoteType: string;
  productFamily: string;
  customerSegment: string;
  discountPercentage: number;
  requiresApproval: boolean;
  color: string;
  quoteId: string;
}

export interface QuoteApprovalLevel3PendingQuote {
  id: string;
  quoteId: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  productFamily: string;
  dealValue: number;
  quoteType: string;
  currentStage: string;
  daysInQueue: number;
  createdDate: string;
  approvalRequired: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  assignedTo: string;
  customerSegment: string;
}

export interface QuoteApprovalLevel4QuoteDetail {
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  productDetails: {
    productFamily: string;
    totalLicenses: number;
    totalAmount: number;
    discountPercentage: number;
    netAmount: number;
  };
  approvalWorkflow: {
    currentStage: string;
    approvalChain: Array<{
      stage: string;
      approver: string;
      status: 'completed' | 'pending' | 'not_started';
      timestamp?: string;
      daysInStage?: number;
    }>;
  };
  timeline: Array<{
    stage: string;
    timestamp: string;
    status: 'completed' | 'pending';
    actor: string;
  }>;
  blockers: string[];
  riskFactors: string[];
  recommendations: string[];
  customerContext: {
    segment: string;
    arr: number;
    healthScore: number;
    paymentHistory: string;
  };
}

export class QuoteApprovalDrillDownService {
  
  /**
   * Level 1: Approval Stage Funnel
   * Shows where quotes are getting stuck in the approval process
   */
  static getLevel1ApprovalStageFunnel(): QuoteApprovalLevel1ApprovalStage[] {
    const approvalStages: QuoteApprovalLevel1ApprovalStage[] = [];
    
    // Get all quotes from last 30 days for current analysis
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentQuotes = quotesData.filter(quote => 
      new Date(quote.quote_created_date) >= thirtyDaysAgo
    );

    // Helper function for status and color
    const getStatusAndColor = (actual: number, target: number) => {
      const variance = actual - target;
      if (variance <= 0) return { status: 'good' as const, color: '#10B981' };
      if (variance <= target * 0.5) return { status: 'warning' as const, color: '#F59E0B' };
      return { status: 'critical' as const, color: '#EF4444' };
    };

    // 1. Auto-Approved Quotes (no approval required)
    const autoApprovedQuotes = recentQuotes.filter(q => !q.requires_approval);
    const autoApprovalDays = autoApprovedQuotes.map(q => {
      if (q.quote_sent_date && q.quote_created_date) {
        return Math.round((new Date(q.quote_sent_date).getTime() - new Date(q.quote_created_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
      }
      return 1.2; // Default for auto-approval
    });
    const avgAutoApproval = autoApprovalDays.reduce((sum, days) => sum + days, 0) / autoApprovalDays.length || 1.2;
    const { status: autoStatus, color: autoColor } = getStatusAndColor(avgAutoApproval, 1.5);

    approvalStages.push({
      id: 'approval-stage-1-auto',
      stage: 'Auto-Approved',
      count: autoApprovedQuotes.length,
      avgDays: Math.round(avgAutoApproval * 10) / 10,
      targetDays: 1.5,
      variance: Math.round((avgAutoApproval - 1.5) * 10) / 10,
      percentage: Math.round((autoApprovedQuotes.length / recentQuotes.length) * 100),
      status: autoStatus,
      color: autoColor,
      stageOrder: 1,
      description: 'Quotes that pass auto-approval criteria'
    });

    // 2. Manager Review Required
    const managerQuotes = recentQuotes.filter(q => 
      q.requires_approval && 
      q.total_amount < 50000 && 
      q.discount_percentage <= 15
    );
    const managerApprovalDays = managerQuotes.map(q => {
      if (q.approval_date && q.quote_created_date) {
        return Math.round((new Date(q.approval_date).getTime() - new Date(q.quote_created_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
      }
      return 2.8; // Default for manager approval
    });
    const avgManagerApproval = managerApprovalDays.reduce((sum, days) => sum + days, 0) / managerApprovalDays.length || 2.8;
    const { status: managerStatus, color: managerColor } = getStatusAndColor(avgManagerApproval, 3);

    approvalStages.push({
      id: 'approval-stage-2-manager',
      stage: 'Manager Review',
      count: managerQuotes.length,
      avgDays: Math.round(avgManagerApproval * 10) / 10,
      targetDays: 3,
      variance: Math.round((avgManagerApproval - 3) * 10) / 10,
      percentage: Math.round((managerQuotes.length / recentQuotes.length) * 100),
      status: managerStatus,
      color: managerColor,
      stageOrder: 2,
      description: 'Standard deals requiring manager approval'
    });

    // 3. Director Review Required
    const directorQuotes = recentQuotes.filter(q => 
      q.requires_approval && 
      (q.total_amount >= 50000 && q.total_amount < 150000) ||
      (q.discount_percentage > 15 && q.discount_percentage <= 25)
    );
    const directorApprovalDays = directorQuotes.map(q => {
      if (q.approval_date && q.quote_created_date) {
        return Math.round((new Date(q.approval_date).getTime() - new Date(q.quote_created_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
      }
      return 4.5; // Default for director approval
    });
    const avgDirectorApproval = directorApprovalDays.reduce((sum, days) => sum + days, 0) / directorApprovalDays.length || 4.5;
    const { status: directorStatus, color: directorColor } = getStatusAndColor(avgDirectorApproval, 5);

    approvalStages.push({
      id: 'approval-stage-3-director',
      stage: 'Director Review',
      count: directorQuotes.length,
      avgDays: Math.round(avgDirectorApproval * 10) / 10,
      targetDays: 5,
      variance: Math.round((avgDirectorApproval - 5) * 10) / 10,
      percentage: Math.round((directorQuotes.length / recentQuotes.length) * 100),
      status: directorStatus,
      color: directorColor,
      stageOrder: 3,
      description: 'High-value deals or significant discounts'
    });

    // 4. VP/C-Level Review Required
    const vpQuotes = recentQuotes.filter(q => 
      q.requires_approval && 
      (q.total_amount >= 150000 || q.discount_percentage > 25)
    );
    const vpApprovalDays = vpQuotes.map(q => {
      if (q.approval_date && q.quote_created_date) {
        return Math.round((new Date(q.approval_date).getTime() - new Date(q.quote_created_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
      }
      return 8.2; // Default for VP approval
    });
    const avgVpApproval = vpApprovalDays.reduce((sum, days) => sum + days, 0) / vpApprovalDays.length || 8.2;
    const { status: vpStatus, color: vpColor } = getStatusAndColor(avgVpApproval, 7);

    approvalStages.push({
      id: 'approval-stage-4-vp',
      stage: 'VP/C-Level Review',
      count: vpQuotes.length,
      avgDays: Math.round(avgVpApproval * 10) / 10,
      targetDays: 7,
      variance: Math.round((avgVpApproval - 7) * 10) / 10,
      percentage: Math.round((vpQuotes.length / recentQuotes.length) * 100),
      status: vpStatus,
      color: vpColor,
      stageOrder: 4,
      description: 'Enterprise deals or exceptional discounts'
    });

    return approvalStages.sort((a, b) => a.stageOrder - b.stageOrder);
  }

  /**
   * Level 2: Approval Bottleneck Analysis
   * Shows relationship between deal size, complexity, and approval time
   */
  static getLevel2BottleneckAnalysis(): QuoteApprovalLevel2BottleneckData[] {
    const bottleneckData: QuoteApprovalLevel2BottleneckData[] = [];
    
    // Get customer tier mapping
    const customerTiers = new Map();
    accountsData.forEach(acc => {
      customerTiers.set(acc.account.id, acc.account.tier);
    });

    // Analyze quotes requiring approval
    const approvalQuotes = quotesData.filter(q => q.requires_approval);

    approvalQuotes.forEach(quote => {
      const customerTier = customerTiers.get(quote.customer_id) || 'SMB';
      
      // Calculate approval days
      let approvalDays = 0;
      if (quote.approval_date && quote.quote_created_date) {
        approvalDays = Math.round((new Date(quote.approval_date).getTime() - new Date(quote.quote_created_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10;
      } else {
        // Estimate based on deal characteristics
        if (quote.total_amount >= 150000 || quote.discount_percentage > 25) {
          approvalDays = 8.2;
        } else if (quote.total_amount >= 50000 || quote.discount_percentage > 15) {
          approvalDays = 4.5;
        } else {
          approvalDays = 2.8;
        }
      }

      // Determine complexity
      let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
      if (quote.total_amount >= 100000 || quote.discount_percentage > 20 || quote.product_families.length > 2) {
        complexity = 'complex';
      } else if (quote.total_amount >= 50000 || quote.discount_percentage > 10 || quote.product_families.length > 1) {
        complexity = 'moderate';
      }

      // Color based on complexity
      const complexityColors = {
        'simple': '#10B981',
        'moderate': '#F59E0B', 
        'complex': '#EF4444'
      };

      bottleneckData.push({
        id: `bottleneck-${quote.quote_id}`,
        dealSize: quote.total_amount,
        approvalDays: approvalDays,
        complexity: complexity,
        quoteType: quote.quote_type,
        productFamily: quote.product_families[0] || 'Unknown',
        customerSegment: customerTier,
        discountPercentage: quote.discount_percentage,
        requiresApproval: quote.requires_approval,
        color: complexityColors[complexity],
        quoteId: quote.quote_id
      });
    });

    return bottleneckData.sort((a, b) => b.dealSize - a.dealSize);
  }

  /**
   * Level 3: Pending Quote Queue
   * Shows quotes currently in approval pipeline
   */
  static getLevel3PendingQuoteQueue(): QuoteApprovalLevel3PendingQuote[] {
    const pendingQuotes: QuoteApprovalLevel3PendingQuote[] = [];
    
    // Get customer details
    const customerDetails = new Map();
    accountsData.forEach(acc => {
      customerDetails.set(acc.account.id, {
        name: acc.account.name,
        tier: acc.account.tier
      });
    });

    // Filter for pending quotes (requiring approval but not yet approved/rejected)
    const currentPendingQuotes = quotesData.filter(q => 
      q.requires_approval && 
      !q.approval_date && 
      q.quote_status !== 'rejected' &&
      q.quote_status !== 'accepted'
    );

    currentPendingQuotes.forEach(quote => {
      const customer = customerDetails.get(quote.customer_id);
      if (!customer) return;

      // Calculate days in queue
      const daysInQueue = Math.round((new Date().getTime() - new Date(quote.quote_created_date).getTime()) / (1000 * 60 * 60 * 24));

      // Determine current stage based on deal characteristics
      let currentStage = 'Manager Review';
      let assignedTo = 'Sarah M (Manager)';
      
      if (quote.total_amount >= 150000 || quote.discount_percentage > 25) {
        currentStage = 'VP/C-Level Review';
        assignedTo = 'Michael R (VP Sales)';
      } else if (quote.total_amount >= 50000 || quote.discount_percentage > 15) {
        currentStage = 'Director Review';
        assignedTo = 'Jennifer L (Director)';
      }

      // Determine complexity and priority
      let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
      let priority: 'high' | 'medium' | 'low' = 'low';

      if (quote.total_amount >= 100000 || quote.discount_percentage > 20) {
        complexity = 'complex';
        priority = 'high';
      } else if (quote.total_amount >= 50000 || quote.discount_percentage > 10) {
        complexity = 'moderate';
        priority = 'medium';
      }

      // Escalate priority if quote is old
      if (daysInQueue > 5) {
        priority = priority === 'low' ? 'medium' : 'high';
      }

      pendingQuotes.push({
        id: `pending-${quote.quote_id}`,
        quoteId: quote.quote_id,
        quoteNumber: quote.quote_number,
        customerId: quote.customer_id,
        customerName: customer.name,
        productFamily: quote.product_families[0] || 'Unknown',
        dealValue: quote.total_amount,
        quoteType: quote.quote_type,
        currentStage: currentStage,
        daysInQueue: daysInQueue,
        createdDate: quote.quote_created_date.split('T')[0],
        approvalRequired: quote.requires_approval,
        complexity: complexity,
        priority: priority,
        status: 'pending',
        assignedTo: assignedTo,
        customerSegment: customer.tier
      });
    });

    return pendingQuotes.sort((a, b) => {
      // Sort by priority first, then by days in queue
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : b.daysInQueue - a.daysInQueue;
    });
  }

  /**
   * Level 4: Quote Detail + Approval Workflow
   * Deep dive into specific quote approval process
   */
  static getLevel4QuoteDetail(quoteId: string): QuoteApprovalLevel4QuoteDetail | null {
    const quote = quotesData.find(q => q.quote_id === quoteId);
    if (!quote) return null;

    const customer = accountsData.find(acc => acc.account.id === quote.customer_id);
    if (!customer) return null;

    // Build approval workflow chain
    const approvalChain = [];
    
    // Sales Rep (always first)
    approvalChain.push({
      stage: 'Sales Rep',
      approver: 'John D',
      status: 'completed' as const,
      timestamp: quote.quote_created_date,
      daysInStage: 0
    });

    // Auto-checks
    approvalChain.push({
      stage: 'Auto-checks',
      approver: 'System',
      status: 'completed' as const,
      timestamp: quote.quote_created_date,
      daysInStage: 0.1
    });

    // Manager approval
    if (quote.requires_approval) {
      const managerStatus = quote.approval_date ? 'completed' : 'pending';
      approvalChain.push({
        stage: 'Manager',
        approver: 'Sarah M',
        status: managerStatus as const,
        timestamp: quote.approval_date || undefined,
        daysInStage: quote.approval_date ? 
          Math.round((new Date(quote.approval_date).getTime() - new Date(quote.quote_created_date).getTime()) / (1000 * 60 * 60 * 24) * 10) / 10 :
          Math.round((new Date().getTime() - new Date(quote.quote_created_date).getTime()) / (1000 * 60 * 60 * 24))
      });

      // Director approval for higher value deals
      if (quote.total_amount >= 50000 || quote.discount_percentage > 15) {
        const directorStatus = quote.approval_date ? 'completed' : (quote.total_amount >= 150000 ? 'pending' : 'not_started');
        approvalChain.push({
          stage: 'Director',
          approver: 'Mike P',
          status: directorStatus as const,
          timestamp: quote.approval_date || undefined,
          daysInStage: directorStatus === 'pending' ? 
            Math.round((new Date().getTime() - new Date(quote.quote_created_date).getTime()) / (1000 * 60 * 60 * 24)) - 1 : 0
        });
      }

      // VP approval for enterprise deals
      if (quote.total_amount >= 150000 || quote.discount_percentage > 25) {
        approvalChain.push({
          stage: 'VP Sales',
          approver: 'Jennifer L',
          status: 'not_started' as const,
          daysInStage: 0
        });
      }
    }

    // Build timeline
    const timeline = [
      {
        stage: 'Quote Created',
        timestamp: quote.quote_created_date,
        status: 'completed' as const,
        actor: 'John D (Sales Rep)'
      },
      {
        stage: 'Auto-checks Passed',
        timestamp: quote.quote_created_date,
        status: 'completed' as const,
        actor: 'System'
      }
    ];

    if (quote.requires_approval) {
      if (quote.approval_date) {
        timeline.push({
          stage: 'Manager Approved',
          timestamp: quote.approval_date,
          status: 'completed' as const,
          actor: 'Sarah M (Manager)'
        });
      } else {
        timeline.push({
          stage: 'Manager Review',
          timestamp: new Date().toISOString(),
          status: 'pending' as const,
          actor: 'Sarah M (Manager)'
        });
      }
    }

    // Identify blockers
    const blockers = [];
    if (quote.discount_percentage > 18) {
      blockers.push(`Custom pricing ${quote.discount_percentage}% below list`);
    }
    if (quote.payment_terms && quote.payment_terms !== 'Net 30' && quote.payment_terms !== 'Net 45') {
      blockers.push(`Payment terms: ${quote.payment_terms} (non-standard)`);
    }
    if (quote.contract_term_months > 12) {
      blockers.push('Multi-year commit requires finance review');
    }

    // Risk factors
    const riskFactors = [];
    const daysInQueue = Math.round((new Date().getTime() - new Date(quote.quote_created_date).getTime()) / (1000 * 60 * 60 * 24));
    if (daysInQueue > 5) {
      riskFactors.push(`${daysInQueue} days in approval queue`);
    }
    if (quote.total_amount > 100000) {
      riskFactors.push('High-value deal requires multiple approvals');
    }
    if (quote.discount_percentage > 20) {
      riskFactors.push('Significant discount may impact margins');
    }

    // Recommendations
    const recommendations = [];
    if (daysInQueue > 3) {
      recommendations.push('Escalate to next approval level');
    }
    if (quote.discount_percentage > 15) {
      recommendations.push('Justify discount with competitive analysis');
    }
    recommendations.push('Set up customer call to maintain momentum');

    return {
      quoteId: quote.quote_id,
      quoteNumber: quote.quote_number,
      customerName: customer.account.name,
      productDetails: {
        productFamily: quote.product_families[0] || 'Unknown',
        totalLicenses: quote.total_licenses,
        totalAmount: quote.total_amount,
        discountPercentage: quote.discount_percentage,
        netAmount: quote.net_amount
      },
      approvalWorkflow: {
        currentStage: approvalChain.find(a => a.status === 'pending')?.stage || 'Completed',
        approvalChain: approvalChain
      },
      timeline: timeline,
      blockers: blockers,
      riskFactors: riskFactors,
      recommendations: recommendations,
      customerContext: {
        segment: customer.account.tier,
        arr: customer.account.arr,
        healthScore: Math.floor(Math.random() * 40) + 60, // Simulated
        paymentHistory: 'Good (95% on-time)'
      }
    };
  }
}
