/**
 * Drill-Down Navigation Service
 * Manages the business flow and storyline for KPI drill-downs
 */

export interface DrillDownLevel {
  level: 1 | 2 | 3;
  title: string;
  description: string;
  kpi?: string;
  subView?: string;
}

export interface KPIDrillDown {
  kpiId: string;
  kpiName: string;
  businessContext: string;
  level2Views: Level2View[];
  level3Actions: Level3Action[];
}

export interface Level2View {
  id: string;
  title: string;
  description: string;
  chartType: 'breakdown' | 'trend' | 'heatmap' | 'matrix' | 'funnel' | 'waterfall' | 'scatter' | 'correlation';
  businessQuestion: string;
  actionableInsights: string[];
}

export interface Level3Action {
  id: string;
  title: string;
  description: string;
  actionType: 'exception' | 'workflow' | 'alert' | 'escalation';
  urgency: 'high' | 'medium' | 'low';
  businessImpact: string;
}

// KPI Drill-Down Definitions based on all_personas.md
export const KPI_DRILL_DOWNS: KPIDrillDown[] = [
  {
    kpiId: 'quote-to-cash-cycle',
    kpiName: 'Quote-to-Cash Cycle Time',
    businessContext: 'Measures end-to-end efficiency from quote creation to payment collection. Critical for cash flow and customer satisfaction.',
    level2Views: [
      {
        id: 'stage-breakdown',
        title: 'Process Stage Breakdown',
        description: 'Analyze cycle time by each stage to identify bottlenecks',
        chartType: 'breakdown',
        businessQuestion: 'Where are the bottlenecks causing deal delays?',
        actionableInsights: [
          'Quote acceptance stage showing highest variance (+2.5 days)',
          'Customer engagement and pricing clarity issues identified',
          '72% SLA compliance indicates process improvement needed'
        ]
      },
      {
        id: 'bottleneck-heatmap',
        title: 'Bottleneck Analysis Heatmap',
        description: 'Visual heatmap showing cycle time performance by stage and customer tier',
        chartType: 'heatmap',
        businessQuestion: 'Which stage-customer combinations are creating the most delays?',
        actionableInsights: [
          'Enterprise legal reviews taking 40% longer than target',
          'SMB order processing surprisingly efficient',
          'Strategic account approvals need dedicated workflow'
        ]
      },
      {
        id: 'deal-size-correlation',
        title: 'Deal Size vs Cycle Time Analysis',
        description: 'Scatter plot showing correlation between deal value and cycle duration',
        chartType: 'scatter',
        businessQuestion: 'How does deal size impact cycle time efficiency?',
        actionableInsights: [
          'Deals >$500K show exponential cycle time increase',
          'Sweet spot at $100K-$250K range for efficiency',
          'Small deals (<$50K) have disproportionate overhead'
        ]
      },
      {
        id: 'product-family-impact',
        title: 'Product Family Complexity Analysis',
        description: 'Compare cycle times across different product families',
        chartType: 'matrix',
        businessQuestion: 'Which products create the most process complexity?',
        actionableInsights: [
          'ThousandEyes deals take 35% longer due to technical complexity',
          'Duo has most streamlined process (avg 28 days)',
          'Splunk requires specialized approval workflow'
        ]
      },
      {
        id: 'seasonal-trends',
        title: 'Seasonal Performance Patterns',
        description: 'Quarterly trends with business context and seasonal factors',
        chartType: 'trend',
        businessQuestion: 'How do seasonal patterns affect our Q2C performance?',
        actionableInsights: [
          'Q4 cycles 20% faster due to budget urgency',
          'Q1 shows approval delays from new budget processes',
          'Mid-year performance most predictable and optimizable'
        ]
      },
      {
        id: 'historical-trend',
        title: 'Historical Trend Analysis',
        description: 'Long-term Q2C performance trends with key business drivers',
        chartType: 'trend',
        businessQuestion: 'What are the long-term trends and improvement opportunities?',
        actionableInsights: [
          'Overall 18% improvement in cycle time over last 12 months',
          'Process automation reducing manual delays by 25%',
          'Customer tier optimization showing measurable impact'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'pending-quotes',
        title: 'Quotes Requiring Immediate Action',
        description: 'Quotes pending approval > 5 days with high ARR impact',
        actionType: 'exception',
        urgency: 'high',
        businessImpact: '$1.8M ARR at risk from delayed approvals'
      },
      {
        id: 'stage-bottlenecks',
        title: 'Stage-Specific Bottleneck Resolution',
        description: 'Process bottlenecks identified by stage and customer tier',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: 'Reduce cycle time by 15-25% through targeted improvements'
      },
    ]
  },
  {
    kpiId: 'quote-approval-velocity',
    kpiName: 'Quote Approval Velocity',
    businessContext: 'Speed of quote approvals directly impacts deal closure and customer experience. Delays can result in lost opportunities.',
    level2Views: [
      {
        id: 'approval-funnel',
        title: 'Approval Process Funnel',
        description: 'Track quotes through approval stages and identify drop-offs',
        chartType: 'funnel',
        businessQuestion: 'Where do quotes get stuck in the approval process?',
        actionableInsights: [
          'Legal review causing 60% of delays',
          'Pricing exceptions need VP approval',
          'Automated approvals for standard deals'
        ]
      },
      {
        id: 'approver-performance',
        title: 'Approver Performance Matrix',
        description: 'Compare approval times across different approvers',
        chartType: 'matrix',
        businessQuestion: 'Which approvers are bottlenecks?',
        actionableInsights: [
          'Sales Ops Director fastest approver (1.2 days avg)',
          'Legal team needs process optimization',
          'VP Commercial approval queue backed up'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'approval-alerts',
        title: 'Approval SLA Breach Alerts',
        description: 'Real-time alerts for quotes exceeding approval SLA',
        actionType: 'alert',
        urgency: 'high',
        businessImpact: 'Prevent deal slippage and customer frustration'
      }
    ]
  },
  {
    kpiId: 'invoice-accuracy',
    kpiName: 'Invoice Accuracy Rate',
    businessContext: 'Billing errors damage customer relationships and delay payments. High accuracy ensures smooth cash collection.',
    level2Views: [
      {
        id: 'error-analysis',
        title: 'Invoice Error Analysis by Product Family',
        description: 'Breakdown of billing errors by product and error type',
        chartType: 'breakdown',
        businessQuestion: 'What types of billing errors are most common?',
        actionableInsights: [
          'ThousandEyes showing highest error rate (2.1%)',
          'Complex pricing configurations causing issues',
          'Usage-based billing needs automation'
        ]
      },
      {
        id: 'dispute-trends',
        title: 'Dispute Resolution Trends',
        description: 'Track dispute volume and resolution times',
        chartType: 'trend',
        businessQuestion: 'How quickly are we resolving billing disputes?',
        actionableInsights: [
          'Average resolution time: 12 days',
          'Proactive communication reduces disputes by 30%',
          'Usage data helps justify invoices'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'disputed-invoices',
        title: 'Active Invoice Disputes',
        description: 'Invoices currently under dispute requiring resolution',
        actionType: 'exception',
        urgency: 'medium',
        businessImpact: '$425K in disputed amounts affecting cash flow'
      }
    ]
  },
  {
    kpiId: 'days-sales-outstanding',
    kpiName: 'Days Sales Outstanding (DSO)',
    businessContext: 'Measures how quickly we collect payments. Lower DSO improves cash flow and working capital efficiency.',
    level2Views: [
      {
        id: 'aging-analysis',
        title: 'AR Aging by Customer Tier',
        description: 'Breakdown of receivables by aging buckets and customer segments',
        chartType: 'heatmap',
        businessQuestion: 'Which customer segments are driving higher DSO?',
        actionableInsights: [
          'Commercial and SMB tiers driving DSO increases',
          'Strategic accounts have best payment terms',
          'Automated reminders needed for smaller accounts'
        ]
      },
      {
        id: 'collection-performance',
        title: 'Collection Performance Trends',
        description: 'Track collection efficiency over time',
        chartType: 'waterfall',
        businessQuestion: 'How effective are our collection efforts?',
        actionableInsights: [
          'Payment terms correlation with collection speed',
          'Early intervention reduces bad debt by 25%',
          'Customer payment behavior patterns identified'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'overdue-accounts',
        title: 'Accounts with DSO > 60 Days',
        description: 'High-risk accounts requiring immediate collection action',
        actionType: 'exception',
        urgency: 'high',
        businessImpact: '$3.2M AR at risk, immediate action needed'
      }
    ]
  },
  {
    kpiId: 'revenue-recognition',
    kpiName: 'Revenue Recognition Accuracy',
    businessContext: 'Ensures compliance with accounting standards and accurate financial reporting. Critical for investor confidence.',
    level2Views: [
      {
        id: 'variance-drivers',
        title: 'Revenue Recognition Variance Drivers',
        description: 'Analyze root causes of recognition variances',
        chartType: 'waterfall',
        businessQuestion: 'What is causing revenue recognition variances?',
        actionableInsights: [
          'Contract modification timing: 42% of variance ($245K)',
          'Usage-based true-up: 27% of variance ($158K)',
          'Amendment processing delays need automation'
        ]
      },
      {
        id: 'contract-analysis',
        title: 'Contract Modification Impact',
        description: 'Track how contract changes affect revenue recognition',
        chartType: 'trend',
        businessQuestion: 'How do contract modifications impact recognition timing?',
        actionableInsights: [
          'Multi-year contracts have higher variance',
          'Amendment processing SLA needed',
          'Automated recognition rules reduce errors'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'recognition-alerts',
        title: 'Revenue Recognition Alerts',
        description: 'Contracts with recognition issues requiring immediate attention',
        actionType: 'alert',
        urgency: 'medium',
        businessImpact: 'Ensure compliance and accurate financial reporting'
      }
    ]
  },
  {
    kpiId: 'deferred-revenue',
    kpiName: 'Deferred Revenue Balance',
    businessContext: 'Tracks unearned revenue for future periods. Critical for financial planning and cash flow forecasting.',
    level2Views: [
      {
        id: 'revenue-schedule',
        title: 'Revenue Recognition Schedule',
        description: 'Track deferred revenue by contract and recognition timeline',
        chartType: 'waterfall',
        businessQuestion: 'When will deferred revenue be recognized?',
        actionableInsights: [
          'Q3 recognition schedule shows $12.5M expected',
          'Multi-year contracts driving 65% of deferred balance',
          'Usage-based components need monthly true-up'
        ]
      },
      {
        id: 'contract-analysis',
        title: 'Contract Type Analysis',
        description: 'Breakdown of deferred revenue by contract characteristics',
        chartType: 'breakdown',
        businessQuestion: 'Which contract types contribute most to deferred revenue?',
        actionableInsights: [
          'SaaS subscriptions: 70% of deferred revenue',
          'Professional services: 20% of deferred revenue',
          'Support contracts: 10% of deferred revenue'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'recognition-schedule',
        title: 'Revenue Recognition Schedule Review',
        description: 'Contracts requiring recognition schedule updates',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Ensure accurate financial reporting'
      }
    ]
  },
  {
    kpiId: 'quote-win-rate',
    kpiName: 'Quote Win Rate',
    businessContext: 'Measures sales effectiveness and competitive positioning. Higher win rates indicate better value proposition and sales execution.',
    level2Views: [
      {
        id: 'win-loss-analysis',
        title: 'Win/Loss Analysis by Segment',
        description: 'Compare win rates across customer segments and deal sizes',
        chartType: 'heatmap',
        businessQuestion: 'Which segments have the highest win rates?',
        actionableInsights: [
          'Strategic accounts: 78% win rate (above target)',
          'SMB segment: 45% win rate (needs improvement)',
          'Competitive losses mainly to price objections'
        ]
      },
      {
        id: 'competitor-analysis',
        title: 'Competitive Loss Analysis',
        description: 'Track losses by competitor and reason',
        chartType: 'breakdown',
        businessQuestion: 'Why are we losing deals?',
        actionableInsights: [
          'Price objections: 40% of losses',
          'Feature gaps: 25% of losses',
          'Timing issues: 20% of losses'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'lost-deals',
        title: 'Recent Lost Deals Review',
        description: 'High-value deals lost in current quarter requiring analysis',
        actionType: 'exception',
        urgency: 'medium',
        businessImpact: 'Learn from losses to improve future win rate'
      }
    ]
  },
  {
    kpiId: 'renewal-quote-velocity',
    kpiName: 'Renewal Quote Velocity',
    businessContext: 'Speed of renewal quote generation affects customer retention and revenue predictability. Faster renewals reduce churn risk.',
    level2Views: [
      {
        id: 'renewal-pipeline',
        title: 'Renewal Pipeline Analysis',
        description: 'Track renewal quotes by stage and timeline',
        chartType: 'funnel',
        businessQuestion: 'How healthy is our renewal pipeline?',
        actionableInsights: [
          '85% of renewals initiated within SLA',
          'Complex renewals take 3x longer than standard',
          'Early engagement improves renewal velocity by 40%'
        ]
      },
      {
        id: 'renewal-risk',
        title: 'Renewal Risk Assessment',
        description: 'Identify at-risk renewals and intervention opportunities',
        chartType: 'matrix',
        businessQuestion: 'Which renewals are at risk?',
        actionableInsights: [
          '12 high-value renewals at risk ($2.3M ARR)',
          'Usage decline correlates with renewal risk',
          'Proactive outreach reduces churn by 30%'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'at-risk-renewals',
        title: 'At-Risk Renewal Interventions',
        description: 'Renewals requiring immediate attention to prevent churn',
        actionType: 'alert',
        urgency: 'high',
        businessImpact: 'Prevent revenue churn and maintain customer relationships'
      }
    ]
  },
  {
    kpiId: 'overdue-invoices',
    kpiName: 'Overdue Invoices Amount',
    businessContext: 'Outstanding invoices impact cash flow and may indicate customer satisfaction issues. Minimizing overdue amounts is critical for working capital.',
    level2Views: [
      {
        id: 'aging-buckets',
        title: 'Invoice Aging Analysis',
        description: 'Breakdown of overdue invoices by aging buckets',
        chartType: 'breakdown',
        businessQuestion: 'How old are our overdue invoices?',
        actionableInsights: [
          '30-60 days: $1.2M (manageable with standard follow-up)',
          '60-90 days: $800K (requires escalation)',
          '90+ days: $400K (high risk, immediate action needed)'
        ]
      },
      {
        id: 'customer-payment-patterns',
        title: 'Customer Payment Behavior',
        description: 'Analyze payment patterns by customer characteristics',
        chartType: 'heatmap',
        businessQuestion: 'Which customers consistently pay late?',
        actionableInsights: [
          'SMB customers have 2x higher overdue rates',
          'International customers average 15 days longer',
          'Payment terms correlation with collection success'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'collection-actions',
        title: 'Collection Actions Required',
        description: 'Overdue invoices requiring immediate collection efforts',
        actionType: 'exception',
        urgency: 'high',
        businessImpact: 'Recover outstanding receivables and improve cash flow'
      }
    ]
  },
  {
    kpiId: 'expansion-arr',
    kpiName: 'Expansion ARR Contribution',
    businessContext: 'Measures growth from existing customers through upsells and cross-sells. Higher expansion rates indicate strong customer success and product adoption.',
    level2Views: [
      {
        id: 'expansion-opportunities',
        title: 'Expansion Opportunity Matrix',
        description: 'Identify customers with highest expansion potential',
        chartType: 'matrix',
        businessQuestion: 'Which customers are ready for expansion?',
        actionableInsights: [
          '45 customers showing usage >85% (expansion ready)',
          'Multi-product customers expand 3x faster',
          'Usage-based expansion averages $125K ARR'
        ]
      },
      {
        id: 'product-penetration',
        title: 'Product Penetration Analysis',
        description: 'Track cross-sell opportunities across product portfolio',
        chartType: 'heatmap',
        businessQuestion: 'Where are the white space opportunities?',
        actionableInsights: [
          'Security portfolio has 60% penetration opportunity',
          'Collaboration tools show highest attach rates',
          'Infrastructure customers prime for security upsell'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'expansion-campaigns',
        title: 'Expansion Campaign Execution',
        description: 'Targeted expansion campaigns for high-potential accounts',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Drive incremental ARR growth from existing customer base'
      }
    ]
  },
  // Additional KPI configurations for exception drill-downs
  {
    kpiId: 'dso-account',
    kpiName: 'DSO Account Analysis',
    businessContext: 'Detailed analysis of high DSO accounts requiring immediate collection action.',
    level2Views: [
      {
        id: 'account-details',
        title: 'Account Payment Analysis',
        description: 'Comprehensive payment behavior and risk assessment',
        chartType: 'breakdown',
        businessQuestion: 'What is driving the high DSO for this account?',
        actionableInsights: [
          'Payment pattern analysis shows seasonal delays',
          'Credit terms may need adjustment',
          'Proactive communication reduces collection time'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'collection-strategy',
        title: 'Collection Strategy',
        description: 'Immediate collection actions for this account',
        actionType: 'exception',
        urgency: 'high',
        businessImpact: 'Reduce DSO and improve cash flow'
      }
    ]
  },
  {
    kpiId: 'revenue-alert',
    kpiName: 'Revenue Recognition Alert',
    businessContext: 'Revenue recognition variance requiring immediate attention for compliance.',
    level2Views: [
      {
        id: 'variance-analysis',
        title: 'Revenue Variance Analysis',
        description: 'Detailed breakdown of recognition variance causes',
        chartType: 'waterfall',
        businessQuestion: 'What is causing the revenue recognition variance?',
        actionableInsights: [
          'Contract modification timing impact identified',
          'Usage-based adjustments need automation',
          'Amendment processing delays resolved'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'recognition-fix',
        title: 'Recognition Correction',
        description: 'Immediate steps to correct revenue recognition',
        actionType: 'alert',
        urgency: 'medium',
        businessImpact: 'Ensure compliance and accurate reporting'
      }
    ]
  }
];

export class DrillDownNavigationService {
  private currentLevel: DrillDownLevel = { level: 1, title: 'Strategic Overview', description: 'High-level KPI dashboard' };
  private navigationHistory: DrillDownLevel[] = [];

  getCurrentLevel(): DrillDownLevel {
    return this.currentLevel;
  }

  getNavigationHistory(): DrillDownLevel[] {
    return this.navigationHistory;
  }

  drillDown(kpiId: string, level: 2 | 3, subView?: string): DrillDownLevel {
    // Add current level to history
    this.navigationHistory.push({ ...this.currentLevel });

    const kpiDrillDown = KPI_DRILL_DOWNS.find(kpi => kpi.kpiId === kpiId);
    if (!kpiDrillDown) {
      throw new Error(`KPI drill-down not found for: ${kpiId}`);
    }

    if (level === 2) {
      this.currentLevel = {
        level: 2,
        title: `${kpiDrillDown.kpiName} - Tactical Analysis`,
        description: kpiDrillDown.businessContext,
        kpi: kpiId,
        subView
      };
    } else {
      this.currentLevel = {
        level: 3,
        title: `${kpiDrillDown.kpiName} - Operational Actions`,
        description: 'Actionable insights and immediate next steps',
        kpi: kpiId,
        subView
      };
    }

    return this.currentLevel;
  }

  drillUp(): DrillDownLevel {
    if (this.navigationHistory.length > 0) {
      this.currentLevel = this.navigationHistory.pop()!;
    }
    return this.currentLevel;
  }

  resetToLevel1(): DrillDownLevel {
    this.currentLevel = { level: 1, title: 'Strategic Overview', description: 'High-level KPI dashboard' };
    this.navigationHistory = [];
    return this.currentLevel;
  }

  getKPIDrillDown(kpiId: string): KPIDrillDown | undefined {
    return KPI_DRILL_DOWNS.find(kpi => kpi.kpiId === kpiId);
  }

  getAllKPIDrillDowns(): KPIDrillDown[] {
    return KPI_DRILL_DOWNS;
  }
}

// Singleton instance
export const drillDownService = new DrillDownNavigationService();
