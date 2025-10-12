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
  actionId?: string;
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
    businessContext: 'End-to-end process from quote creation to payment collection. 41.2 days current vs 45-day target. Payment Collection (68% of cycle) is primary bottleneck.',
    level2Views: [
      {
        id: 'stage-breakdown',
        title: 'Q2C Stage Breakdown Analysis',
        description: 'Waterfall chart showing time contribution of each stage: Quote Creation → Approval → Order → Provision → Invoice → Payment',
        chartType: 'waterfall',
        businessQuestion: 'WHICH stages contribute most to cycle time delays?',
        actionableInsights: [
          'Payment Collection: 28.2 days (68% of total cycle, +8.2d over target)',
          'Provisioning Time: 5.6 days (Technical delays in SaaS activation)',
          'Order Booking: 3.1 days (Manual entry bottlenecks)'
        ]
      },
      {
        id: 'payment-collection-deep-dive',
        title: 'Payment Collection Deep Dive',
        description: 'Heatmap analysis: Payment delays by customer segment & deal type. Enterprise New Business = 42.3d avg (Primary Problem)',
        chartType: 'heatmap',
        businessQuestion: 'WHICH segments drive payment delays?',
        actionableInsights: [
          'Enterprise New Business: 42.3d avg (87 deals, $12.3M) - Multi-level approvals',
          'Public Sector: 41.9d avg (124 deals, $21.2M) - Government fiscal constraints',
          'SMB performs well: 28.4d avg - Simple approval processes'
        ]
      },
      {
        id: 'legal-review-analysis',
        title: 'Legal Review Bottleneck Analysis',
        description: 'Root cause analysis of legal review delays: Resource capacity (35% of cases), Complex terms (28% of cases)',
        chartType: 'breakdown',
        businessQuestion: 'WHY is Legal Review taking 14 days vs 5-day target?',
        actionableInsights: [
          'Resource Capacity: +6d delay (35% of cases) - 2 attorneys, 400 deals/quarter',
          'Complex Non-Standard Terms: +4d delay (28% of cases) - Data residency clauses',
          'Attorney A: 8d avg vs Attorney B: 18d avg - Training opportunity'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'enterprise-approval-delays',
        title: 'Enterprise Multi-Level Approval Delays',
        description: '87 Enterprise deals with CFO approval delays. Root cause: Multi-level approvals (Finance+Legal+Procurement)',
        actionType: 'exception',
        urgency: 'high',
        businessImpact: '$12.3M ARR affected, +16.7d avg delay. Early payment discount program could save $4.7M cash flow.'
      },
      {
        id: 'legal-resource-bottleneck',
        title: 'Legal Team Resource Shortage',
        description: '400 deals/quarter with only 2 attorneys. Attorney B taking 2.25x longer than Attorney A.',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: 'Hire 1 additional attorney or redistribute workload. Potential -9d cycle time reduction.'
      },
      {
        id: 'quote-po-mismatches',
        title: 'Quote/PO Mismatch Resolution',
        description: '64 deals annually with quote/invoice discrepancies. 45% of Splunk deals affected.',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Automated validation could save $3.2M cash flow, -12.3d avg per deal.'
      }
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
    businessContext: 'Total ARR from upsell/cross-sell in period. Target: $5M+ quarterly. Key growth driver.',
    level2Views: [
      {
        id: 'expansion-by-category',
        title: 'Expansion by Category',
        description: 'Breakdown by upsell, cross-sell, capacity expansion, and bundle deals',
        chartType: 'breakdown',
        businessQuestion: 'WHICH expansion types drive the most ARR?',
        actionableInsights: [
          'Cross-sell: $2.1M (39% of total)',
          'Upsell: $1.8M (33% of total)',
          'Capacity: $1.5M (28% of total)'
        ]
      },
      {
        id: 'expansion-by-product',
        title: 'Expansion by Product Family',
        description: 'Product-level expansion performance and attach rates',
        chartType: 'breakdown',
        businessQuestion: 'WHICH products drive expansion?',
        actionableInsights: [
          'Duo → Umbrella: Highest attach rate (45%)',
          'Meraki expansion: Strong capacity-driven growth',
          'ThousandEyes: Emerging cross-sell opportunity'
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
  },
  // SALES EXPANSION KPIs
  {
    kpiId: 'nrr',
    kpiName: 'Net Revenue Retention',
    businessContext: 'Revenue retention + expansion from existing customer cohort. Target: ≥110%. Measures ability to grow revenue from existing base.',
    level2Views: [
      {
        id: 'nrr-by-tier',
        title: 'NRR by Customer Tier',
        description: 'Breakdown of NRR performance across Strategic, Enterprise, Commercial, and SMB tiers',
        chartType: 'breakdown',
        businessQuestion: 'WHICH customer tiers are driving NRR performance?',
        actionableInsights: [
          'Strategic tier: 125% NRR (excellent expansion)',
          'Enterprise tier: 112% NRR (on target)',
          'SMB tier: 95% NRR (churn risk)'
        ]
      },
      {
        id: 'nrr-quarterly-trend',
        title: 'NRR Quarterly Trend',
        description: 'Quarterly NRR performance trends and forecasting',
        chartType: 'trend',
        businessQuestion: 'HOW is NRR trending over time?',
        actionableInsights: [
          'Q4 2024: 118% NRR (8% above target)',
          'Consistent upward trend for 6 quarters',
          'Q1 2025 forecast: 120% NRR'
        ]
      },
      {
        id: 'expansion-vs-churn',
        title: 'Expansion vs Churn Waterfall',
        description: 'Waterfall showing expansion gains vs churn/contraction losses',
        chartType: 'waterfall',
        businessQuestion: 'WHAT is the composition of NRR?',
        actionableInsights: [
          'Expansion: +$5.4M ARR',
          'Churn: -$1.2M ARR',
          'Net: +$4.2M ARR (114.8% NRR)'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'high-nrr-accounts',
        title: 'High NRR Account Success Patterns',
        description: 'Analyze accounts with >120% NRR to replicate success',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Scale best practices to increase overall NRR'
      },
      {
        id: 'low-nrr-intervention',
        title: 'Low NRR Account Intervention',
        description: 'Accounts with <100% NRR requiring immediate attention',
        actionType: 'exception',
        urgency: 'high',
        businessImpact: 'Prevent churn and identify expansion blockers'
      }
    ]
  },
  {
    kpiId: 'multi-product-penetration',
    kpiName: 'Multi-Product Penetration',
    businessContext: '% of customers with 2+ products. Target: ≥40%. Indicates successful cross-sell and customer stickiness.',
    level2Views: [
      {
        id: 'product-matrix',
        title: 'Product Penetration Matrix',
        description: 'Heatmap showing product combination adoption across customer base',
        chartType: 'heatmap',
        businessQuestion: 'WHICH product combinations are most common?',
        actionableInsights: [
          'Duo + Umbrella: Most common pair (28% of customers)',
          'Meraki standalone: 35% (cross-sell opportunity)',
          '3+ products: Only 12% (growth potential)',
          'Full product suite adoption increases NRR by 15%'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'single-product-accounts',
        title: 'Single-Product Account Cross-Sell',
        description: '30 high-value accounts with only 1 product',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: '$8.2M white space opportunity'
      }
    ]
  },
  {
    kpiId: 'white-space-value',
    kpiName: 'White Space Opportunity',
    businessContext: 'Estimated ARR from identified product gaps. Target: $8M+. Represents untapped expansion potential.',
    level2Views: [
      {
        id: 'white-space-by-segment',
        title: 'White Space by Segment',
        description: 'Opportunity sizing by customer tier and industry',
        chartType: 'breakdown',
        businessQuestion: 'WHERE is the biggest white space?',
        actionableInsights: [
          'Enterprise Financial Services: $2.8M opportunity',
          'Strategic Healthcare: $2.1M opportunity',
          'Commercial Manufacturing: $1.9M opportunity'
        ]
      },
      {
        id: 'product-gap-analysis',
        title: 'Product Gap Analysis',
        description: 'Which products have the most expansion headroom',
        chartType: 'breakdown',
        businessQuestion: 'WHICH products have the most white space?',
        actionableInsights: [
          'ThousandEyes: $3.2M gap (lowest penetration)',
          'Umbrella: $2.8M gap (high synergy with Duo)',
          'Splunk: $2.4M gap (new product opportunity)'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'high-fit-opportunities',
        title: 'High-Fit White Space Opportunities',
        description: 'Top 20 accounts with >80% fit score',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: '$4.5M in ready-to-engage opportunities'
      }
    ]
  },
  {
    kpiId: 'pipeline-arr',
    kpiName: 'Expansion Pipeline ARR',
    businessContext: 'Value of qualified expansion opportunities. Target: 3x quota coverage. Indicates future revenue health.',
    level2Views: [
      {
        id: 'pipeline-by-stage',
        title: 'Pipeline by Stage',
        description: 'Funnel analysis showing opportunity distribution and conversion',
        chartType: 'funnel',
        businessQuestion: 'HOW is pipeline distributed across stages?',
        actionableInsights: [
          'Discovery: $6.2M (40% of pipeline)',
          'Proposal: $4.8M (31% of pipeline)',
          'Negotiation: $4.3M (28% of pipeline)'
        ]
      },
      {
        id: 'pipeline-velocity',
        title: 'Pipeline Velocity by Stage',
        description: 'Average time in each stage and bottleneck identification',
        chartType: 'trend',
        businessQuestion: 'WHERE are pipeline bottlenecks?',
        actionableInsights: [
          'Proposal stage: 28 days avg (slowest)',
          'Negotiation: 18 days avg',
          'Overall velocity: 52 days (needs improvement)'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'pipeline-gaps',
        title: 'Pipeline Coverage Gaps',
        description: 'Quarters with <3x coverage requiring generation',
        actionType: 'alert',
        urgency: 'high',
        businessImpact: 'Ensure adequate pipeline for quota attainment'
      }
    ]
  },
  {
    kpiId: 'win-rate',
    kpiName: 'Expansion Win Rate',
    businessContext: '% of expansion opportunities closed-won. Target: ≥60%. Measures sales effectiveness.',
    level2Views: [
      {
        id: 'win-rate-by-product',
        title: 'Win Rate by Product',
        description: 'Product-level win rates and competitive positioning',
        chartType: 'breakdown',
        businessQuestion: 'WHICH products have the highest win rates?',
        actionableInsights: [
          'Capacity expansions: 82% win rate (easiest)',
          'Cross-sell: 65% win rate (on target)',
          'Competitive displacements: 42% win rate (challenging)'
        ]
      },
      {
        id: 'win-loss-analysis',
        title: 'Win/Loss Root Cause Analysis',
        description: 'Primary reasons for wins and losses',
        chartType: 'breakdown',
        businessQuestion: 'WHY are we winning or losing?',
        actionableInsights: [
          'Wins: Value realization (45%), Relationship (32%)',
          'Losses: Price (38%), Timing (28%), Competition (22%)',
          'No-decision: Budget constraints (52%)'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'at-risk-deals',
        title: 'At-Risk Expansion Deals',
        description: 'Opportunities with <50% win probability',
        actionType: 'exception',
        urgency: 'high',
        businessImpact: '$2.1M at-risk pipeline requiring intervention'
      }
    ]
  },
  {
    kpiId: 'cross-sell-rate',
    kpiName: 'Cross-Sell Attach Rate',
    businessContext: '% of renewals including additional products. Target: ≥50%. Indicates cross-sell effectiveness.',
    level2Views: [
      {
        id: 'cross-sell-by-product',
        title: 'Cross-Sell by Product',
        description: 'Attach rates by product combination',
        chartType: 'breakdown',
        businessQuestion: 'WHICH products drive cross-sell?',
        actionableInsights: [
          'Duo + Umbrella: 45% attach rate',
          'Meraki expansion: 38% attach rate',
          'ThousandEyes: 22% attach rate (opportunity)'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'renewal-cross-sell',
        title: 'Upcoming Renewal Cross-Sell',
        description: '25 renewals with high cross-sell potential',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: 'Increase cross-sell attach rate by 15%'
      }
    ]
  },
  {
    kpiId: 'time-to-expansion',
    kpiName: 'Time to Expansion',
    businessContext: 'Average days from acquisition to first expansion. Target: ≤180 days. Faster expansion indicates product-market fit.',
    level2Views: [
      {
        id: 'expansion-timeline-by-tier',
        title: 'Expansion Timeline by Tier',
        description: 'Time to first expansion by customer segment',
        chartType: 'breakdown',
        businessQuestion: 'HOW quickly do customers expand?',
        actionableInsights: [
          'Strategic: 120 days avg (excellent)',
          'Enterprise: 165 days avg (on target)',
          'SMB: 210 days avg (needs improvement)'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'expansion-ready-accounts',
        title: 'Expansion-Ready Accounts',
        description: '18 accounts approaching expansion timeline',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Accelerate expansion velocity'
      }
    ]
  },
  {
    kpiId: 'share-of-wallet',
    kpiName: 'Share of Wallet Score',
    businessContext: 'Estimated % of customer IT budget captured. Target: Increase trend. Indicates expansion headroom.',
    level2Views: [
      {
        id: 'wallet-share-by-tier',
        title: 'Share of Wallet by Tier',
        description: 'Wallet penetration by customer segment',
        chartType: 'breakdown',
        businessQuestion: 'WHERE is the expansion opportunity?',
        actionableInsights: [
          'Strategic: 65% avg (high penetration)',
          'Enterprise: 42% avg (moderate)',
          'SMB: 28% avg (significant upside)'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'low-wallet-share',
        title: 'Low Wallet Share Accounts',
        description: '35 accounts with <30% wallet share',
        actionType: 'exception',
        urgency: 'medium',
        businessImpact: '$4.5M expansion potential'
      }
    ]
  },
  {
    kpiId: 'capacity-arr',
    kpiName: 'Capacity-Driven Expansion ARR',
    businessContext: 'ARR from utilization >85% → upsell. Target: Trend monitoring. Proactive capacity management.',
    level2Views: [
      {
        id: 'capacity-alerts-by-product',
        title: 'Capacity Alerts by Product',
        description: 'High utilization accounts by product family',
        chartType: 'breakdown',
        businessQuestion: 'WHERE are the capacity triggers?',
        actionableInsights: [
          'Duo: 45 high-utilization accounts',
          'Umbrella: 32 capacity alerts',
          'Meraki: 28 expansion-ready'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'active-capacity-alerts',
        title: 'Active Capacity Alerts',
        description: '105 accounts with >85% utilization',
        actionType: 'alert',
        urgency: 'high',
        businessImpact: '$3.2M expansion opportunity requiring proactive outreach'
      }
    ]
  },
  {
    kpiId: 'utilization-expansion',
    kpiName: 'Utilization-Driven Expansion Signals',
    businessContext: 'Real-time capacity alerts requiring immediate action. 18 critical alerts with $2.8M potential ARR. Proactive utilization monitoring drives expansion.',
    level2Views: [
      {
        id: 'alert-overview',
        title: 'Utilization Alert Overview',
        description: 'Comprehensive view of all capacity alerts by severity and product',
        chartType: 'breakdown',
        businessQuestion: 'Which products and customers are approaching capacity limits?',
        actionableInsights: [
          'Critical alerts (>95% utilization) require immediate expansion quotes',
          'High alerts (90-95%) need proactive capacity planning',
          'Medium alerts (85-90%) should be monitored for trending',
          'Response rate of 78% indicates effective alert management'
        ]
      },
      {
        id: 'product-breakdown',
        title: 'Utilization by Product Family',
        description: 'Alert distribution and potential ARR by product category',
        chartType: 'matrix',
        businessQuestion: 'Which products generate the most capacity-driven expansion opportunities?',
        actionableInsights: [
          'Meraki leads with 6 alerts and $920K potential ARR',
          'Duo shows strong utilization growth with 5 alerts',
          'Umbrella has consistent capacity alerts across customer base',
          'ThousandEyes and Splunk show lower but steady utilization'
        ]
      },
      {
        id: 'response-analysis',
        title: 'Alert Response Rate Analysis',
        description: 'Conversion rates and response times for capacity alerts',
        chartType: 'funnel',
        businessQuestion: 'How effectively are we converting utilization alerts to expansion opportunities?',
        actionableInsights: [
          '68% of alerts convert to qualified opportunities',
          'Average response time of 3.2 days meets target of <5 days',
          '22% of alerts are currently in progress',
          'Only 11% remain pending action'
        ]
      },
      {
        id: 'account-prioritization',
        title: 'High-Utilization Account Prioritization',
        description: 'Top accounts requiring immediate expansion outreach',
        chartType: 'heatmap',
        businessQuestion: 'Which accounts should sales prioritize for capacity-driven expansion?',
        actionableInsights: [
          'TechCorp and MedSecure are expansion-ready with >95% utilization',
          'Global Financial Partners needs immediate contact for 93% utilization',
          'Strategic and Enterprise accounts show highest expansion potential',
          'Total addressable expansion potential exceeds $2.8M ARR'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'critical-alerts',
        title: 'Critical Capacity Alerts',
        description: 'Immediate action required for accounts >95% utilization',
        actionType: 'alert',
        urgency: 'high',
        businessImpact: 'Risk of service degradation and customer churn if capacity not expanded within 48 hours'
      },
      {
        id: 'expansion-quotes',
        title: 'Generate Expansion Quotes',
        description: 'Create capacity expansion quotes for high-utilization accounts',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: 'Proactive expansion prevents service issues and captures $840K+ in immediate ARR'
      },
      {
        id: 'capacity-planning',
        title: 'Proactive Capacity Planning',
        description: 'Schedule capacity planning sessions for trending accounts',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Prevents future capacity constraints and enables predictable expansion revenue'
      },
      {
        id: 'utilization-monitoring',
        title: 'Enhanced Utilization Monitoring',
        description: 'Implement advanced monitoring for at-risk accounts',
        actionType: 'escalation',
        urgency: 'medium',
        businessImpact: 'Early warning system prevents emergency expansions and improves customer satisfaction'
      }
    ]
  },
  {
    kpiId: 'performance-metrics',
    kpiName: 'Rep Performance Metrics',
    businessContext: 'Individual rep performance tracking across expansion activities. Target: 100% quota attainment with balanced pipeline health.',
    level2Views: [
      {
        id: 'quota-attainment',
        title: 'Expansion Quota Attainment by Rep',
        description: 'Rep-level quota performance with YTD tracking',
        chartType: 'breakdown',
        businessQuestion: 'Which reps are on track for quota attainment?',
        actionableInsights: [
          'Top performers (>110%): 8 reps driving $3.2M over-quota',
          'On-target (90-110%): 15 reps at $1.8M',
          'At-risk (<90%): 5 reps need coaching and support'
        ]
      },
      {
        id: 'pipeline-generation',
        title: 'Pipeline Generation Rate',
        description: 'New opportunity creation trends by rep',
        chartType: 'trend',
        businessQuestion: 'Who is generating healthy pipeline coverage?',
        actionableInsights: [
          'Target: 3x quota coverage maintained',
          'Average: 12 new opps per rep per quarter',
          'Best practice: Early-quarter pipeline building'
        ]
      },
      {
        id: 'win-rate-by-rep',
        title: 'Win Rate by Rep & Product',
        description: 'Rep-specific win rates across product lines',
        chartType: 'matrix',
        businessQuestion: 'Where do individual reps excel or need coaching?',
        actionableInsights: [
          'Capacity expansion: 85% avg win rate (easiest)',
          'Cross-sell: 62% avg win rate (product training needed)',
          'Product specialization correlates with 15% higher win rates'
        ]
      },
      {
        id: 'activity-metrics',
        title: 'Rep Activity Dashboard',
        description: 'Calls, meetings, proposals, and engagement metrics',
        chartType: 'breakdown',
        businessQuestion: 'Are reps maintaining sufficient activity levels?',
        actionableInsights: [
          'Target: 20 customer touches/week',
          'High performers average 28 touches/week',
          'Activity velocity predicts pipeline health'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'at-risk-reps',
        title: 'At-Risk Rep Coaching',
        description: 'Reps below 90% quota attainment requiring intervention',
        actionType: 'alert',
        urgency: 'high',
        businessImpact: 'Prevent quota miss and identify coaching opportunities'
      },
      {
        id: 'pipeline-gaps',
        title: 'Pipeline Coverage Gaps',
        description: 'Reps with <2x quota coverage',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: 'Ensure adequate pipeline for future quarters'
      },
      {
        id: 'best-practices',
        title: 'Top Performer Best Practices',
        description: 'Analyze and replicate success patterns from top 20%',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Scale winning behaviors across the team'
      }
    ]
  },
  {
    kpiId: 'opportunity-readiness',
    kpiName: 'Account Expansion Readiness',
    businessContext: 'Composite scoring of account readiness for expansion based on health, utilization, engagement, and budget timing. Target: 60+ ready accounts.',
    level2Views: [
      {
        id: 'readiness-segmentation',
        title: 'Expansion Readiness Segmentation',
        description: 'Account distribution by readiness score tiers',
        chartType: 'breakdown',
        businessQuestion: 'How many accounts are expansion-ready now?',
        actionableInsights: [
          'Hot (90-100): 12 accounts, $2.3M opportunity',
          'Ready (75-89): 28 accounts, $4.8M opportunity',
          'Nurture (60-74): 45 accounts, $6.2M opportunity',
          'Not Ready (<60): 35 accounts, monitor only'
        ]
      },
      {
        id: 'readiness-factors',
        title: 'Readiness Score Components',
        description: 'Breakdown of factors driving readiness scores',
        chartType: 'waterfall',
        businessQuestion: 'What drives expansion readiness?',
        actionableInsights: [
          'Health Score (30%): Product adoption and satisfaction',
          'Utilization (25%): Capacity-driven triggers',
          'Engagement (25%): Champion strength and touchpoints',
          'Budget Timing (20%): Procurement cycle alignment'
        ]
      },
      {
        id: 'readiness-trends',
        title: 'Readiness Score Trends',
        description: 'Quarterly progression of account readiness',
        chartType: 'trend',
        businessQuestion: 'Is the ready account pool growing?',
        actionableInsights: [
          'Q4 2024: 68 ready accounts (+15% QoQ)',
          'Improving trend for last 3 quarters',
          'Target: 80+ ready accounts by Q2 2025'
        ]
      },
      {
        id: 'white-space-correlation',
        title: 'Readiness vs White Space Value',
        description: 'Scatter plot showing readiness score vs expansion potential',
        chartType: 'scatter',
        businessQuestion: 'Which ready accounts have the highest value?',
        actionableInsights: [
          'Sweet spot: High readiness + High white space = 18 accounts',
          'Priority targets: $3.4M in immediate-action opportunities',
          'Strategic focus beats volume prospecting'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'hot-opportunities',
        title: 'Hot Expansion Opportunities',
        description: '12 accounts with 90+ readiness scores ready for immediate outreach',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: '$2.3M in highly-qualified expansion opportunities'
      },
      {
        id: 'nurture-campaigns',
        title: 'Readiness Nurture Campaigns',
        description: 'Targeted campaigns to move 60-74 scored accounts to ready status',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Increase expansion-ready pool by 20%'
      },
      {
        id: 'readiness-blockers',
        title: 'Readiness Blocker Analysis',
        description: 'Accounts stuck below 60 - identify and address blockers',
        actionType: 'exception',
        urgency: 'medium',
        businessImpact: 'Unlock stalled accounts and prevent churn risk'
      }
    ]
  },
  {
    kpiId: 'opportunity-readiness-matrix',
    kpiName: 'Opportunity Readiness Matrix',
    businessContext: 'Scatter plot analysis mapping expansion readiness vs white space value. Identifies sweet-spot accounts for immediate action.',
    level2Views: [
      {
        id: 'quadrant-analysis',
        title: 'Readiness-Value Quadrant Analysis',
        description: 'Four-quadrant breakdown of accounts by readiness and opportunity size',
        chartType: 'scatter',
        businessQuestion: 'Which accounts offer the best balance of readiness and value?',
        actionableInsights: [
          'Sweet Spot (High/High): 18 accounts, $3.4M ARR - immediate action',
          'High Value/Low Readiness: 22 accounts - nurture to readiness',
          'High Readiness/Low Value: 28 accounts - quick wins',
          'Focus resources on top-right quadrant for maximum ROI'
        ]
      },
      {
        id: 'readiness-drivers',
        title: 'Readiness Score Drivers',
        description: 'Breakdown of factors driving readiness scores',
        chartType: 'breakdown',
        businessQuestion: 'What makes accounts expansion-ready?',
        actionableInsights: [
          'Health score impact: 30% weight, avg 82/100',
          'Utilization triggers: 25% weight, 78% avg',
          'Engagement quality: 25% weight, 85% active',
          'Budget timing: 20% weight, 45% in planning cycle'
        ]
      },
      {
        id: 'movement-tracking',
        title: 'Readiness Movement Tracking',
        description: 'Track accounts moving between readiness quadrants over time',
        chartType: 'trend',
        businessQuestion: 'How are accounts progressing toward readiness?',
        actionableInsights: [
          'Last 30 days: 12 accounts moved to "Ready" status',
          '8 accounts at risk of dropping from "Hot" tier',
          'Nurture campaigns improved readiness by avg 8 points',
          'Time to ready: avg 45 days from nurture start'
        ]
      },
      {
        id: 'lookalike-analysis',
        title: 'Lookalike Account Targeting',
        description: 'Identify similar accounts to current sweet-spot opportunities',
        chartType: 'heatmap',
        businessQuestion: 'Which other accounts match our best opportunities?',
        actionableInsights: [
          'Found 15 lookalike accounts to sweet-spot tier',
          'Avg similarity score: 87% match',
          'Combined white space: $2.1M additional ARR',
          'Replicate successful engagement patterns'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'sweet-spot-accounts',
        title: 'Sweet Spot Account Blitz',
        description: '18 high-readiness, high-value accounts ready for immediate engagement',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: '$3.4M in qualified, ready-to-close expansion opportunities'
      },
      {
        id: 'readiness-acceleration',
        title: 'Readiness Acceleration Campaign',
        description: 'Targeted campaigns to move 22 high-value accounts to ready status',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Unlock $4.2M in latent expansion potential within 60 days'
      },
      {
        id: 'quick-wins',
        title: 'Quick Win Opportunities',
        description: '28 ready accounts with smaller white space for fast execution',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Rapid pipeline build with high win probability'
      }
    ]
  },
  {
    kpiId: 'expansion-type-distribution',
    kpiName: 'Expansion Type Distribution',
    businessContext: 'Breakdown of expansion ARR by type: capacity-driven, cross-sell, upsell, and bundles. Identifies most effective expansion motions.',
    level2Views: [
      {
        id: 'type-performance',
        title: 'Expansion Type Performance',
        description: 'Detailed metrics by expansion category',
        chartType: 'breakdown',
        businessQuestion: 'Which expansion types drive the most ARR and have highest win rates?',
        actionableInsights: [
          'Capacity-driven: $2.1M ARR, 85% win rate (easiest motion)',
          'Cross-sell: $1.8M ARR, 62% win rate (product training needed)',
          'Upsell: $1.5M ARR, 68% win rate (tier progression)',
          'Bundles: $0.8M ARR, 72% win rate (value packaging)'
        ]
      },
      {
        id: 'type-by-tier',
        title: 'Expansion Type by Customer Tier',
        description: 'Which expansion types work best for each customer segment',
        chartType: 'heatmap',
        businessQuestion: 'How should we tailor expansion approach by customer tier?',
        actionableInsights: [
          'Strategic: Bundle expansions dominate (avg $180K)',
          'Enterprise: Cross-sell most effective (avg $95K)',
          'Commercial: Capacity-driven primary (avg $45K)',
          'SMB: Upsell within product (avg $18K)'
        ]
      },
      {
        id: 'type-velocity',
        title: 'Time to Close by Type',
        description: 'Average sales cycle length for each expansion motion',
        chartType: 'breakdown',
        businessQuestion: 'Which expansion types close fastest?',
        actionableInsights: [
          'Capacity-driven: 18 days avg (urgent need)',
          'Upsell: 32 days avg (clear value path)',
          'Cross-sell: 45 days avg (education needed)',
          'Bundles: 52 days avg (complex decision)'
        ]
      },
      {
        id: 'product-affinity',
        title: 'Product Combination Affinity',
        description: 'Most successful product pairing patterns',
        chartType: 'heatmap',
        businessQuestion: 'Which product combinations have highest attach rates?',
        actionableInsights: [
          'Duo → Umbrella: 45% attach rate (security suite)',
          'Meraki → ThousandEyes: 38% attach rate (network visibility)',
          'Any → Splunk: 28% attach rate (analytics upsell)',
          'Full suite adoption: 15% of enterprise customers'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'capacity-pipeline',
        title: 'Capacity-Driven Pipeline',
        description: 'Active utilization alerts ready for expansion quotes',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: '$2.1M pipeline with 85% win rate - highest conversion'
      },
      {
        id: 'crosssell-campaigns',
        title: 'Product Cross-Sell Campaigns',
        description: 'Targeted campaigns based on product affinity analysis',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Scale proven product combinations across customer base'
      },
      {
        id: 'bundle-opportunities',
        title: 'Bundle Deal Opportunities',
        description: 'High-value bundle deals for strategic accounts',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Avg $180K deal size with comprehensive solution positioning'
      }
    ]
  },
  {
    kpiId: 'exception-alerts',
    kpiName: 'Exception Alerts',
    businessContext: 'Critical alerts requiring immediate attention: at-risk accounts, stalled deals, champion changes, and competitive threats.',
    level2Views: [
      {
        id: 'alert-severity',
        title: 'Alert Severity & Type Analysis',
        description: 'Breakdown of exception alerts by urgency and category',
        chartType: 'breakdown',
        businessQuestion: 'What are our most critical exception categories?',
        actionableInsights: [
          'Critical (24h): 8 alerts - $1.2M ARR at risk',
          'High (72h): 15 alerts - $2.3M ARR needs attention',
          'Medium (1 week): 22 alerts - $3.1M ARR monitoring',
          'Top category: Champion departures (12 alerts)'
        ]
      },
      {
        id: 'alert-trends',
        title: 'Exception Alert Trends',
        description: 'Alert volume and resolution patterns over time',
        chartType: 'trend',
        businessQuestion: 'Are we improving at preventing and resolving exceptions?',
        actionableInsights: [
          'Alert volume down 15% QoQ (better prevention)',
          'Avg resolution time: 4.2 days (target: 3 days)',
          'Critical alert resolution: 92% within SLA',
          'Repeat alerts down 28% (sustainable fixes)'
        ]
      },
      {
        id: 'impact-analysis',
        title: 'Exception Impact Analysis',
        description: 'ARR and pipeline impact by exception type',
        chartType: 'waterfall',
        businessQuestion: 'Which exceptions have the biggest revenue impact?',
        actionableInsights: [
          'Stalled deals: $2.8M pipeline at risk',
          'Champion departures: $1.9M ARR risk',
          'Competitive threats: $1.5M defense needed',
          'Budget delays: $1.2M timing risk'
        ]
      },
      {
        id: 'response-effectiveness',
        title: 'Exception Response Effectiveness',
        description: 'Success rates by alert type and response action',
        chartType: 'breakdown',
        businessQuestion: 'Which intervention tactics work best?',
        actionableInsights: [
          'Executive engagement: 78% save rate',
          'Competitive battle cards: 68% win rate',
          'Champion replacement: 72% success within 30 days',
          'Deal acceleration: 82% unstick rate'
        ]
      }
    ],
    level3Actions: [
      {
        id: 'critical-alerts-queue',
        title: 'Critical Alerts Action Queue',
        description: '8 critical alerts requiring action within 24 hours',
        actionType: 'alert',
        urgency: 'high',
        businessImpact: '$1.2M ARR at immediate risk - prevent churn and deal loss'
      },
      {
        id: 'champion-changes',
        title: 'Champion Departure Response',
        description: '12 accounts with recent champion changes',
        actionType: 'workflow',
        urgency: 'high',
        businessImpact: 'Rapid relationship rebuild to maintain expansion momentum'
      },
      {
        id: 'competitive-defense',
        title: 'Competitive Threat Defense',
        description: 'Accounts with active competitive activity',
        actionType: 'escalation',
        urgency: 'high',
        businessImpact: 'Defend $1.5M ARR from competitive displacement'
      },
      {
        id: 'stalled-deal-intervention',
        title: 'Stalled Deal Intervention',
        description: 'Opportunities stuck in stage >30 days',
        actionType: 'workflow',
        urgency: 'medium',
        businessImpact: 'Accelerate $2.8M stalled pipeline back to health'
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

  drillDown(kpiId: string, level: 2 | 3, subView?: string, actionId?: string): DrillDownLevel {
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
        subView,
        actionId
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
