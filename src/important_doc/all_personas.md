Dashboard Design Document
Multi-Level, Persona-Driven Dashboard Ecosystem for Global Technology Company
Document Version: 1.0
Preparation Date: October 9, 2025
Scope: Strategic → Tactical → Operational Analytics for Commercial Operations, Sales Expansion, and Customer Success Leaders

Executive Summary
This document defines a comprehensive, three-persona dashboard ecosystem derived from an existing KPI foundation covering:

125+ CSM KPIs across 6 dashboard types
15 Commercial Operations KPIs across quote-to-cash lifecycle
40+ Sales Expansion KPIs for multi-product intelligence

Each persona receives a three-level analytical hierarchy enabling seamless navigation from strategic oversight to operational execution while maintaining unified metric definitions and data governance.

1. Common Analytical Foundation
1.1 Unified Data Domains
All dashboards share these core data domains:
DomainSource SystemsKey EntitiesCustomerCRM (Salesforce), MDMAccounts, Customer Hierarchy, Tier SegmentationProductProduct Catalog, CPQProduct Family (Meraki, Duo, Umbrella, ThousandEyes, Splunk), SKUs, BundlesFinancialERP, Revenue RecognitionARR, Bookings, Invoices, Payments, Deferred RevenueSubscriptionSubscription ManagementLicenses, Contracts, Renewals, AmendmentsUsage & AdoptionTelemetry SystemsUtilization Rate, Active Users, Feature AdoptionOpportunityCRMPipeline, Quotes, Win/Loss, Expansion OpportunitiesSupportService ManagementTickets, SLA Compliance, Escalations
1.2 Shared Dimensions
Geographic:

Region (Americas, EMEA, APJ)
Theater, Country, Territory

Temporal:

Fiscal Year, Fiscal Quarter, Fiscal Month
Calendar Period, Days to Renewal

Organizational:

Customer Tier (Strategic, Enterprise, Commercial, SMB)
ARR Band (<$100K, $100K-$500K, $500K-$1M, $1M+)
Industry Vertical, Company Size

Product:

Product Family, Product Line, SKU
Subscription Tier, Deployment Model

Performance:

Health Score (0-100)
Risk Level (Critical, High, Medium, Low)
Utilization Category

1.3 Core Shared Metrics (From Base KPI List)
Metric CategoryKey KPIsCalculation ScopeRevenueARR, NRR, GRR, Expansion ARR, Churn ARRCompany, Region, Customer, ProductFinancial HealthDSO, Quote-to-Cash Cycle, Deferred Revenue, Invoice AccuracyCompany, Customer, ProductCustomer HealthHealth Score, Churn Risk %, Engagement ScoreCustomer, CSM PortfolioProduct AdoptionUtilization Rate (%), Feature Adoption Rate, Active User CountCustomer, Product, LicensePipelinePipeline ARR, Win Rate, Deal VelocityRegion, Product, RepOperationalSLA Compliance, Approval Cycle Time, Error RateProcess, Team
1.4 Data Governance Principles

Single Source of Truth: All KPIs calculated from centralized semantic layer
Metric Lineage: Full traceability from source data → calculation → dashboard
Quality Scoring: Data quality score (0-100) tracked per KPI
Refresh Cadence: Real-time (transactional), Daily (aggregated), Weekly (trends)
Access Control: Role-based permissions aligned with organizational hierarchy


2. Dashboard Architecture Framework
2.1 Three-Level Hierarchy Pattern
Each persona dashboard follows this consistent structure:
┌─────────────────────────────────────────────────────┐
│  LEVEL 1: STRATEGIC VIEW                            │
│  ┌─────────────────────────────────────────────┐    │
│  │ Executive KPI Scorecard (8-10 metrics)      │    │
│  │ YoY Trends | Target vs. Actual | Alerts     │    │
│  └─────────────────────────────────────────────┘    │
│              ↓ DRILL DOWN                           │
│  LEVEL 2: TACTICAL / ANALYTICAL VIEW                │
│  ┌─────────────────────────────────────────────┐    │
│  │ Segmentation Analysis & Root Cause          │    │
│  │ Region | Tier | Product | Time Series       │    │
│  │ Derived KPIs | Cohort Analysis | Variance   │    │
│  └─────────────────────────────────────────────┘    │
│              ↓ DRILL DOWN                           │
│  LEVEL 3: OPERATIONAL / ACTIONABLE VIEW             │
│  ┌─────────────────────────────────────────────┐    │
│  │ Account-Level Detail | Exception Reports    │    │
│  │ Workflow Actions | SLA Tracking | Alerts    │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
2.2 Navigation & Interactivity Patterns
Drill-Down Paths:

Click on any metric → View segmented breakdown
Click on segment → View account-level detail
Click on account → View full record with related entities

Cross-Dashboard Links:

High utilization alert → Sales Expansion dashboard
At-risk renewal → Customer Success dashboard
Quote delay → Commercial Operations dashboard

Filters (Applied Globally):

Date Range Selector
Region/Theater Selector
Customer Tier Selector
Product Family Selector
CSM/Rep Assignment Selector


3. Persona 1: Commercial Operations Leader
3.1 Focus Areas & Objectives
Primary Responsibility: Quote-to-cash process efficiency, pricing accuracy, revenue realization, and commercial operations SLA compliance
Key Business Questions:

Are we achieving quote-to-cash cycle time targets?
Where are bottlenecks causing deal delays?
What is our quote accuracy and approval efficiency?
How effectively are we recognizing and realizing revenue?
What is our cash collection performance?


3.2 Level 1 — Strategic View
Dashboard Name: Commercial Operations Command Center
Primary KPIs (10):
KPIDefinitionTargetData SourceQuote-to-Cash Cycle TimeAverage days from quote creation to payment received≤ 45 daysquote_to_cash_trackingQuote Approval VelocityAverage days from quote submission to approval≤ 3 daysquotes.approval_date - quotes.quote_dateInvoice Accuracy Rate% of invoices without billing errors≥ 98%invoices.error_count = 0Days Sales Outstanding (DSO)Average days to collect payment after invoice≤ 30 daysaccounts_receivable.avg_days_outstandingRevenue Recognition AccuracyVariance between expected and actual recognition≤ 2%revenue_recognition_schedule.varianceDeferred Revenue BalanceTotal unearned revenue for future periodsTrendrevenue_recognition_schedule.total_deferred_balanceQuote Win Rate% of quotes accepted vs. declined≥ 65%quotes.win_rateRenewal Quote VelocityTime from renewal trigger to quote delivery≤ 14 daysquotes (renewal type)Overdue Invoices AmountTotal AR balance past due dateMinimizeinvoices.amount_outstanding WHERE overdueExpansion ARR Contribution% of ARR from expansions vs. new business20-30%revenue_movements (expansion type)
Visualization Layout:
┌──────────────────────────────────────────────────────────────────┐
│  COMMERCIAL OPERATIONS STRATEGIC DASHBOARD                       │
├──────────────────────────────────────────────────────────────────┤
│  📊 Key Performance Indicators (Current Quarter)                 │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │ Q2C Cycle  │  │   Quote    │  │  Invoice   │  │    DSO     ││
│  │  38 days   │  │  Approval  │  │  Accuracy  │  │  28 days   ││
│  │  ✓ Target  │  │  2.1 days  │  │   98.5%    │  │  ✓ Target  ││
│  │  ↗ -15%    │  │  ✓ Target  │  │  ✓ Target  │  │  ↗ -7%     ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │  Revenue   │  │  Deferred  │  │   Quote    │  │  Renewal   ││
│  │ Recognition│  │  Revenue   │  │  Win Rate  │  │   Quote    ││
│  │   99.2%    │  │   $42.3M   │  │   68.2%    │  │  Velocity  ││
│  │  ✓ Target  │  │   ↗ +5%    │  │  ✓ Target  │  │  11 days   ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                  │
│  📈 Trends (Last 4 Quarters)                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Quote-to-Cash Cycle Time Trend                           │   │
│  │ 52d ┤                                                     │   │
│  │ 45d ┼────────╮                                            │   │
│  │ 38d ┤        ╰─────╮                                      │   │
│  │ 30d ┤              ╰──────╮                               │   │
│  │ 23d ┤                     ╰───────                        │   │
│  │     └─────┬──────┬──────┬──────┬                         │   │
│  │          Q3'24  Q4'24  Q1'25  Q2'25                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  🚨 Exception Alerts (Requires Action)                          │
│  • 12 quotes pending approval > 5 days ($1.8M ARR)              │
│  • 7 invoices disputed (total $425K)                            │
│  • 23 accounts with DSO > 60 days ($3.2M AR)                    │
└──────────────────────────────────────────────────────────────────┘
Action Buttons:

[Drill to Process Analysis →]
[View Bottleneck Details →]
[Export Executive Summary]


3.3 Level 2 — Tactical / Analytical View
Dashboard Name: Commercial Operations Process Analytics
Analytical Focus:

Root cause analysis for cycle time variance
Margin leakage identification
Approval bottleneck analysis
Revenue recognition variance decomposition

Segmentation Views:
View 1: Quote-to-Cash Breakdown by Stage
StageAvg DaysTargetVariance% Meeting SLAQuote Creation → Send0.81.0✓ -0.295%Quote Send → Acceptance12.510.0⚠ +2.572%Acceptance → Order0.20.5✓ -0.398%Order → Fulfillment1.52.0✓ -0.594%Fulfillment → Invoice0.51.0✓ -0.597%Invoice → Payment22.530.0✓ -7.583%Total Cycle38.045.0✓ -7.085%
Insight: Quote acceptance stage showing highest variance—investigate customer engagement and pricing clarity.
View 2: Invoice Accuracy Analysis by Product Family
Product Family          Error Rate    Volume    Impact ($)
────────────────────────────────────────────────────────
Meraki                     1.2%        234      $12,450
Duo                        0.8%        189       $6,780
Umbrella                   1.5%        156      $18,900
ThousandEyes              2.1%        127      $28,340 ⚠
Splunk                    1.8%         98      $22,150
────────────────────────────────────────────────────────
Overall                   1.5%        804      $88,620
Insight: ThousandEyes showing highest error rate—likely complex pricing configurations.
View 3: DSO Decomposition by Customer Tier & Aging
TierCurrent (0-30)31-60 Days61-90 Days90+ DaysTotal ARAvg DSOStrategic$8.2M (82%)$1.2M (12%)$0.4M (4%)$0.2M (2%)$10.0M22 daysEnterprise$5.5M (75%)$1.1M (15%)$0.5M (7%)$0.2M (3%)$7.3M28 daysCommercial$3.8M (68%)$1.0M (18%)$0.5M (9%)$0.3M (5%)$5.6M35 days ⚠SMB$1.2M (60%)$0.5M (25%)$0.2M (10%)$0.1M (5%)$2.0M42 days ⚠Total$18.7M$3.8M$1.6M$0.8M$24.9M28 days
Insight: Commercial and SMB tiers driving DSO—implement automated payment reminders.
View 4: Revenue Recognition Variance Drivers
Variance Source              Q2 Impact    % of Total    Trend
─────────────────────────────────────────────────────────────
Contract modification timing    $245K        42%        ↗
Usage-based true-up             $158K        27%        →
Amendment processing delay       $92K        16%        ↘
Multi-year allocation error     $68K        12%        ↘
Other                           $18K         3%        →
─────────────────────────────────────────────────────────────
Total Variance                  $581K       100%

3.4 Level 3 — Operational / Actionable View
Dashboard Name: Commercial Operations Action Center
Operational Metrics:

Pending approvals requiring escalation
At-risk deals (quote expiring, payment overdue)
SLA breach tracking
Workflow exceptions

Exception Report 1: Quotes Requiring Immediate Action
Quote IDCustomerARRStatusDays PendingApproverRiskQUO-2025-1847Acme Corp$285KApproval Pending8 daysDir, Sales Ops🔴 HighQUO-2025-1923GlobalTech$156KLegal Review6 daysLegal🟡 MediumQUO-2025-2011TechStart$92KPricing Exception5 daysVP, Commercial🟡 Medium
Actions: [Send Reminder] [Escalate] [View Quote Details]
Exception Report 2: Overdue Invoices (Actionable List)
Invoice IDCustomerAmountDays OverduePayment TermsAction NeededINV-2025-03-124MegaCorp$425K67 daysNet 30Collections call scheduledINV-2025-04-089StartupX$78K45 daysNet 30Payment plan negotiationINV-2025-04-201Enterprise Y$189K38 daysNet 45Follow-up email sent
Actions: [Log Collection Activity] [Create Payment Plan] [Send Statement]
Exception Report 3: Revenue Recognition Alerts
Subscription IDCustomerIssue TypeImpactResolution NeededSUB-2024-5623TechCoAmendment not processed$125K deferred incorrectlyProcess amendment in billingSUB-2024-7812DataIncUsage overage not invoiced$67K revenue at riskGenerate usage invoice

3.5 Data Sources & Integration
Primary Systems:

CPQ (Configure-Price-Quote): Quote generation, approval workflows, pricing rules
ERP (Enterprise Resource Planning): Orders, invoices, payments, AR aging
Revenue Recognition System: Deferred revenue, recognition schedules, contract modifications
CRM (Salesforce): Customer data, opportunities, subscription records

Key Tables:

quotes, quote_line_items, orders, invoices, payments
amendments, revenue_movements, revenue_recognition_schedule
quote_to_cash_tracking, accounts_receivable (view)
kpi_metrics (pre-calculated metrics)


4. Persona 2: Sales Expansion Leader
4.1 Focus Areas & Objectives
Primary Responsibility: Drive cross-sell, upsell, and multi-product penetration to maximize share-of-wallet and ARR growth from existing customers
Key Business Questions:

Which customers have the highest expansion potential?
What white space exists in our product portfolio coverage?
Which accounts are ready for cross-sell conversations?
How are we performing on NRR and expansion ARR growth?
Which product combinations drive the best outcomes?


4.2 Level 1 — Strategic View
Dashboard Name: Sales Expansion Command Center
Primary KPIs (10):
KPIDefinitionTargetData SourceNet Revenue Retention (NRR)Revenue retention + expansion from existing cohort≥ 110%revenue_movements (expansion - churn) / prior ARRExpansion ARRTotal ARR from upsell/cross-sell in periodGrowth trendrevenue_movements WHERE movement_type = 'expansion'Multi-Product Penetration Rate% of customers with 2+ products≥ 40%accounts with multiple licensesWhite Space Opportunity ValueEstimated ARR from identified gapsTrendDerived from product coverage matrixExpansion Pipeline ARRValue of qualified expansion opportunities3x quotaopportunities WHERE type = 'expansion'Cross-Sell Attach Rate% of renewals including additional products≥ 25%Renewals with expansion within ±30 daysExpansion Win Rate% of expansion opportunities closed-won≥ 60%opportunities WHERE type = 'expansion' AND closed-wonTime to ExpansionAverage days from customer acquisition to first expansionMinimizeamendments first expansion date - acquisition dateShare-of-Wallet ScoreEstimated % of customer's IT budget capturedTrendDerived (customer spend / estimated budget)Capacity-Driven Expansion ARRARR from utilization >85% → upsellTrendutilization_alerts → closed expansion deals
Visualization Layout:
┌──────────────────────────────────────────────────────────────────┐
│  SALES EXPANSION STRATEGIC DASHBOARD                             │
├──────────────────────────────────────────────────────────────────┤
│  📊 Growth & Retention Metrics (Current Quarter)                 │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │    NRR     │  │ Expansion  │  │Multi-Product│ │White Space ││
│  │   115.5%   │  │    ARR     │  │Penetration │ │Opportunity ││
│  │  ✓ Target  │  │  $7.8M     │  │   42.3%    │ │  $12.5M    ││
│  │  ↗ +3.2pp  │  │  ↗ +18%    │  │  ✓ Target  │ │  ↗ +22%    ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                  │
│  📈 Product Penetration Matrix (Customer Distribution)           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Products   Customers    ARR       Avg ARR    Expansion   │   │
│  │ Deployed                                     Potential    │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 5 Products     8        $4.2M     $525K      Low         │   │
│  │ 4 Products    15        $5.8M     $387K      Medium      │   │
│  │ 3 Products    27        $7.2M     $267K      High  ⭐    │   │
│  │ 2 Products    45        $6.5M     $144K      Very High ⭐│   │
│  │ 1 Product     55        $4.3M     $78K       Critical ⭐ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  🎯 Top Expansion Opportunities (This Quarter)                   │
│  1. TechCorp - Add ThousandEyes + Splunk → Est. $280K ARR       │
│  2. FinanceFirst - Umbrella overage + Duo expansion → $156K     │
│  3. GlobalHealth - 3-product bundle upgrade → $225K              │
│                                                                  │
│  🚨 High-Priority Actions                                        │
│  • 23 accounts with >85% utilization (expansion-ready)          │
│  • 45 accounts with single product (cross-sell targets)         │
│  • 12 renewals approaching with white space identified          │
└──────────────────────────────────────────────────────────────────┘

4.3 Level 2 — Tactical / Analytical View
Dashboard Name: Sales Expansion Intelligence & White Space Analysis
View 1: White Space Coverage Matrix
Customer: TechCorp Industries | ARR: $425K | Tier: Enterprise

Product Portfolio Coverage:
┌────────────────┬──────────┬────────────┬─────────────┐
│ Product        │ Deployed │ Utilization│ Synergy     │
│                │          │            │ Score       │
├────────────────┼──────────┼────────────┼─────────────┤
│ Meraki         │    ✓     │    92%     │     --      │
│ Duo            │    ✓     │    78%     │     --      │
│ Umbrella       │    ✗     │     --     │  87 🎯High  │
│ ThousandEyes   │    ✗     │     --     │  92 🎯High  │
│ Splunk         │    ✗     │     --     │  85 🎯High  │
└────────────────┴──────────┴────────────┴─────────────┘

Recommended Expansion Strategy:
1. **ThousandEyes** - Network monitoring gap identified
   Est. ARR: $120K | Win Probability: 78% | Timeline: Q3 2025
   
2. **Umbrella** - Cloud security complement to Duo
   Est. ARR: $85K | Win Probability: 72% | Timeline: Q4 2025

Lookalike Success Patterns:
Similar customers (85%+ match) added ThousandEyes with 76% win rate
View 2: Expansion Readiness Segmentation
SegmentAccount CountTotal ARRAvg OpportunityPriorityHot Opportunities (Health >80, Util >90%, Champion)12$2.3M$195K🔴 ImmediateReady for Expansion (Health >70, Util >70%, Engaged)28$4.8M$172K🟡 This QuarterNeeds Nurturing (Health >60, Adoption gaps)45$6.2M$138K🟢 Next QuarterNot Ready (Health <60, Low utilization)35$3.8M$109K⚪ Monitor
View 3: Cross-Product Correlation Analysis
Product Combination           Accounts   Avg ARR   Expansion Rate   NRR
─────────────────────────────────────────────────────────────────────────
Meraki + Duo                     42      $285K        18%           118%
Meraki + Umbrella                38      $312K        22%           122%
Duo + Umbrella                   35      $298K        20%           120%
Meraki + ThousandEyes           28      $445K        28% ⭐        128% ⭐
All 5 Products                    8      $625K        35% ⭐        135% ⭐
─────────────────────────────────────────────────────────────────────────
Insight: Accounts with Meraki + ThousandEyes show 28% higher expansion rates—prioritize this combination.
View 4: Utilization-Driven Expansion Signals
CustomerProductLicensedUsedUtil %TrendExpansion OpportunityAcme CorpDuo50048597%↗ +15%Add 200 licenses ($45K ARR)DataIncMeraki25023594%↗ +8%Upgrade tier ($32K ARR)GlobalTechUmbrella100092092%→ StableAdd 250 licenses ($28K ARR)

4.4 Level 3 — Operational / Actionable View
Dashboard Name: Sales Expansion Action Pipeline
Exception Report 1: Immediate Expansion Opportunities
AccountCurrent ProductsWhite Space ProductEst. ARRWin ProbNext ActionOwnerTechCorpMeraki, DuoThousandEyes$120K78%Schedule demoSarah M.FinanceFirstUmbrellaDuo, Splunk$185K72%Send proposalMike T.HealthSysMeraki, UmbrellaThousandEyes$95K81%QBR scheduledLisa K.
Actions: [Create Opportunity] [Schedule Meeting] [Generate Proposal]
Exception Report 2: Capacity Alerts (Expansion Triggers)
Alert IDCustomerProductUtilizationAlert TypeDays ActiveRecommended ActionALT-2025-456MegaCorpDuo97%Critical Capacity12Immediate upsell callALT-2025-512StartupXMeraki92%High Utilization8Quote 100 licensesALT-2025-589DataCoUmbrella89%Approaching Limit5Monitor + plan outreach
Exception Report 3: Renewal + Expansion Opportunities
CustomerRenewal DateRenewal ARRWhite Space ProductsExpansion PotentialStatusGlobalInc45 days$285KThousandEyes, Splunk$155KProposal sentTechStart62 days$125KUmbrella$45KQBR scheduledEnterpriseCo78 days$445KNone$0Standard renewal

4.5 Data Sources & Integration
Primary Systems:

CRM (Salesforce): Opportunities, account hierarchy, product ownership
Usage Telemetry: Product-specific utilization data (Meraki, Duo, Umbrella, ThousandEyes, Splunk)
License Management: Seat counts, utilization rates, capacity alerts
Customer Success Platform (Gainsight/Totango): Health scores, engagement metrics

Key Tables:

accounts, licenses, utilization_history, utilization_alerts
opportunities (expansion type), revenue_movements (expansion)
subscriptions, amendments
Derived: White space matrix, lookalike similarity scores, synergy scores


5. Persona 3: Customer Success Leader
5.1 Focus Areas & Objectives
Primary Responsibility: Maximize customer retention, drive product adoption, ensure value realization, and manage renewal pipeline health
Key Business Questions:

What is the health status of our customer portfolio?
Which accounts are at risk of churn?
How are customers adopting and engaging with our products?
What is our renewal pipeline and confidence level?
Where are opportunities to improve customer health and expand?


5.2 Level 1 — Strategic View
Dashboard Name: Customer Success Portfolio Dashboard
Primary KPIs (10):
KPIDefinitionTargetData SourceGross Revenue Retention (GRR)% of ARR retained (excluding expansions)≥ 95%Prior cohort ARR - churn / prior ARRPortfolio Health ScoreWeighted avg health score across accounts≥ 75health_scores weighted by ARRAt-Risk ARRTotal ARR from accounts with health <60Minimizeaccounts WHERE health_score <60Renewal Rate% of contracts renewed (by count and $)≥ 92%subscriptions WHERE renewed = trueChurn Rate% of ARR lost to non-renewals≤ 5%Churned ARR / total ARRAverage Utilization RateAvg % of licenses actively used≥ 75%licenses.utilization_percentageFeature Adoption Rate% of customers using advanced features≥ 60%Feature telemetry dataCustomer Engagement ScoreComposite of touch frequency + QBR + NPS≥ 70Engagement tracking systemTime to Value (TTV)Days from purchase to productive use≤ 60 daysOnboarding milestone trackingQBR Completion Rate% of accounts with QBR in last 120 days≥ 85%qbr_schedule completion tracking
Visualization Layout:
┌──────────────────────────────────────────────────────────────────┐
│  CUSTOMER SUCCESS PORTFOLIO DASHBOARD                            │
├──────────────────────────────────────────────────────────────────┤
│  📊 Retention & Health Metrics (Current Period)                  │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │    GRR     │  │ Portfolio  │  │  At-Risk   │  │  Renewal   ││
│  │   96.2%    │  │   Health   │  │    ARR     │  │    Rate    ││
│  │  ✓ Target  │  │     78     │  │  $3.2M     │  │   94.1%    ││
│  │  ↗ +1.5pp  │  │  ✓ Target  │  │  ⚠ Monitor │  │  ✓ Target  ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                  │
│  📈 Portfolio Health Distribution                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Health Category    Accounts    ARR        % of Total     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Thriving (91-100)     18      $5.2M         26%      ✓   │   │
│  │ Healthy (76-90)       42      $8.7M         43%      ✓   │   │
│  │ Stable (61-75)        28      $4.3M         21%      ~   │   │
│  │ At Risk (46-60)       12      $1.8M          9%      ⚠   │   │
│  │ Critical (0-45)        5      $1.4M          7%      🔴  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  🎯 Renewal Pipeline (Next 180 Days)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Period        Count    ARR      Confidence   At-Risk     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 0-30 days       8     $1.2M        High         0        │   │
│  │ 31-60 days     12     $2.3M        High         1        │   │
│  │ 61-90 days     15     $3.1M       Medium        3        │   │
│  │ 91-180 days    28     $5.8M       Medium        8   ⚠    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  🚨 Critical Actions Required                                    │
│  • 5 accounts in critical health (immediate intervention)       │
│  • 12 accounts with QBRs overdue >30 days                       │
│  • 8 renewals at risk in next 90 days ($1.4M ARR)               │
└──────────────────────────────────────────────────────────────────┘

5.3 Level 2 — Tactical / Analytical View
Dashboard Name: Customer Success Deep Dive Analytics
View 1: Health Score Decomposition
Portfolio Health Score: 78 (Weighted Average)

Component Breakdown:
┌──────────────────────┬───────────┬─────────┬─────────────┐
│ Health Component     │ Weight    │ Score   │ Contribution│
├──────────────────────┼───────────┼─────────┼─────────────┤
│ Usage Health         │   40%     │   82    │    32.8     │
│ Engagement Health    │   30%     │   76    │    22.8     │
│ Support Health       │   20%     │   71    │    14.2     │
│ Business Outcome     │   10%     │   78    │     7.8     │
├──────────────────────┼───────────┼─────────┼─────────────┤
│ Total                │  100%     │   --    │    77.6     │
└──────────────────────┴───────────┴─────────┴─────────────┘

Insight: Support Health is lowest contributor—increase proactive outreach.
View 2: Adoption & Utilization Trends
Product FamilyAvg UtilizationFeature AdoptionTrend (90d)Risk AccountsMeraki84%72%↗ +5%3Duo78%68%→ Stable5Umbrella71%58%↘ -3% ⚠8ThousandEyes82%75%↗ +8%2Splunk76%62%→ Stable6
Insight: Umbrella showing declining adoption—targeted training campaign recommended.
View 3: Churn Risk Analysis by Segment
Churn Risk Distribution (Next 12 Months)

Tier            Total ARR    At-Risk ARR   Risk %   Churn Probability
────────────────────────────────────────────────────────────────────
Strategic       $10.2M       $0.5M         4.9%          Low
Enterprise      $7.8M        $1.2M        15.4% ⚠       Medium
Commercial      $5.6M        $1.1M        19.6% ⚠       Medium
SMB             $2.4M        $0.4M        16.7% ⚠       Medium
────────────────────────────────────────────────────────────────────
Total           $26.0M       $3.2M        12.3%

Primary Churn Drivers:
1. Low utilization (<50%): 8 accounts, $1.4M ARR
2. Lack of engagement: 6 accounts, $0.9M ARR
3. Support issues: 4 accounts, $0.5M ARR
4. Business outcome gaps: 3 accounts, $0.4M ARR
View 4: Customer Journey Stage Analysis
Journey StageAccountsAvg HealthAvg UtilizationAvg Time in StageNext MilestoneImplementation (0-30d)86542%18 daysFirst value realizationStabilization (30-90d)127268%45 daysFeature adoption targetsOptimization (90-180d)187879%112 daysAdvanced features enabledMaturity (180d+)1128284%385 daysExpansion conversations

5.4 Level 3 — Operational / Actionable View
Dashboard Name: Customer Success Action Center
Exception Report 1: Critical Health Accounts (Immediate Action)
AccountHealth ScoreARRPrimary Risk FactorDays to RenewalCSMAction Plan StatusMegaCorp38$425KLow utilization (32%)45Sarah M.Exec escalation scheduledDataInc42$285KSupport escalations (8)78Mike T.Recovery plan in progressTechStart45$156KNo engagement (120d)92Lisa K.QBR scheduled this week
Actions: [Launch Save Campaign] [Schedule Executive Review] [Assign Support Resources]
Exception Report 2: Overdue Success Activities
Activity TypeAccountDays OverduePriorityImpactCSMActionQBRGlobalHealth45HighHealth decliningSarah M.Schedule immediatelySuccess Plan ReviewFinanceFirst32MediumRenewal in 60dMike T.Update plan this weekOnboarding MilestoneStartupX18HighStill in implementationLisa K.Accelerate onboarding
Exception Report 3: At-Risk Renewals (Next 90 Days)
AccountRenewal DateARRConfidenceRisk FactorsCSMMitigation PlanEnterpriseCo28 days$385KLowHealth 52, Util 48%, No championSarah M.Exec engagement + value auditMidMarketInc55 days$225KMediumSupport issues, feature gapsMike T.Feature roadmap review + trainingTechFirm82 days$178KMediumBudget concerns, low ROI perceptionLisa K.Value realization workshop
Exception Report 4: Usage Anomaly Alerts
Alert IDAccountProductIssueSeverityDays ActiveRecommended ActionALT-2025-678DataCorpDuoUsage dropped 45%🔴 Critical8Immediate outreachALT-2025-701GlobalTechMerakiLogins down 30%🟡 High5Check with championALT-2025-734TechIncUmbrellaFeature adoption stalled🟢 Medium12Training recommendation

5.5 Data Sources & Integration
Primary Systems:

Customer Success Platform (Gainsight/Totango): Health scores, success plans, touch tracking, QBR schedules
Usage Telemetry Systems: Product-specific utilization, feature adoption, active user metrics
CRM (Salesforce): Subscription data, renewal dates, account hierarchy
Support System (ServiceNow/Zendesk): Ticket volume, severity, resolution time, sentiment

Key Tables:

health_scores, engagement_tracking, qbr_schedule
licenses, utilization_history, utilization_alerts
subscriptions, renewals, churn_tracking
support_tickets, nps_scores, customer_journey_stages


6. KPI Mapping & Derivation Table
6.1 Base KPIs to Derived KPIs Mapping
Base KPI (From Project Knowledge)PersonaDerived/Extended KPIsCalculation LogicARRAllTotal ARR, ARR by Tier, ARR Growth Rate, ARR TrendSum(subscriptions.arr) with segmentationNRRSales, CSMNRR by Segment, NRR Trend, NRR Contributors(Starting ARR + Expansion - Churn - Contraction) / Starting ARRGRRCSMGRR by Tier, Churn Rate, Logo Retention(Starting ARR - Churn - Contraction) / Starting ARRUtilization RateAllUtilization by Product, Capacity Alerts, Expansion Triggerslicenses_used / total_licenses × 100Health ScoreCSM, SalesHealth Distribution, At-Risk ARR, Health TrendWeighted composite of usage + engagement + support + outcomesDSOCommOpsDSO by Tier, Aging Buckets, Collection EfficiencyAR Balance / (Revenue / Days in Period)Quote-to-Cash CycleCommOpsCycle by Stage, SLA Compliance, Bottleneck AnalysisSum of milestone durations from quote creation to paymentExpansion ARRSalesExpansion by Source, Expansion Rate, Expansion VelocitySum(revenue_movements WHERE type='expansion')Renewal RateCSMRenewal Rate by Segment, On-Time Renewal %, Renewal Pipeline HealthRenewed contracts / Total renewals dueFeature Adoption RateCSM, SalesAdoption by Feature, Adoption Maturity, Power User RatioUsers using advanced features / total users
6.2 Actionable Insights Framework
Strategic KPITactical InsightOperational ActionNRR = 115%18% from cross-sell, 12% from upsellContact 23 accounts >85% utilization for expansion callsGRR = 96%4% churn concentrated in SMB tierLaunch save campaign for 5 critical health accountsQuote-to-Cash = 38 daysQuote acceptance stage +2.5 days over targetReview pricing clarity and customer communication templatesPortfolio Health = 78Support health lowest at 71Increase proactive CSM touchpoints, reduce ticket volumeDSO = 28 daysCommercial/SMB tiers at 35-42 daysImplement automated payment reminders for these tiersExpansion Pipeline = $12.5M45 single-product accounts identifiedAssign reps to top 20 white space opportunities

7. Data Architecture & Integration Blueprint
7.1 Recommended Architecture
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CommOps     │  │    Sales     │  │   Customer   │      │
│  │  Dashboard   │  │  Expansion   │  │   Success    │      │
│  │              │  │  Dashboard   │  │   Dashboard  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              SEMANTIC LAYER / METRICS LAYER                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Unified KPI Definitions & Calculation Engine          │  │
│  │ • Pre-aggregated metrics in kpi_metrics table         │  │
│  │ • Derived calculations (NRR, GRR, Health Scores)      │  │
│  │ • Data quality scoring & lineage tracking             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 DATA WAREHOUSE LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Snowflake / BigQuery / Redshift                      │   │
│  │ • Dimensional models (Customer, Product, Time)       │   │
│  │ • Fact tables (Subscriptions, Quotes, Utilization)   │   │
│  │ • Aggregation tables for performance                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATA INTEGRATION LAYER                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ETL/ELT Pipelines (Fivetran, Airbyte, dbt)          │   │
│  │ • Real-time CDC for transactional data               │   │
│  │ • Batch loads for telemetry & support data           │   │
│  │ • Data quality validation & transformation           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   SOURCE SYSTEMS                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Salesforce │ │    CPQ     │ │    ERP     │ │ Gainsight│ │
│  │   (CRM)    │ │  (Quotes)  │ │ (Finance)  │ │  (CSM)   │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │  Telemetry │ │  Support   │ │  License   │ │ Revenue  │ │
│  │  Systems   │ │  Tickets   │ │   Mgmt     │ │   Recog  │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
7.2 Key Integration Points
Real-Time Data Flows (CDC):

Salesforce opportunities → Expansion pipeline updates
CPQ quotes → Quote approval tracking
ERP payments → DSO calculations
Support tickets → Health score adjustments

Batch Data Flows (Scheduled):

Telemetry data (hourly) → Utilization metrics
Revenue recognition (daily) → Financial KPIs
Health score calculations (daily) → Portfolio status
KPI aggregations (daily at 2 AM) → Dashboard refresh

Semantic Layer Technologies:

Option 1: dbt (data build tool) for metric definitions + Looker/Tableau semantic layer
Option 2: Cube.js or Apache Superset for unified metric layer
Option 3: Proprietary BI semantic layer (Tableau Data Models, Power BI Datasets)

7.3 Data Refresh Strategy
Data CategoryRefresh FrequencyLatency RequirementMethodTransactional (Quotes, Orders, Payments)Real-time<5 minutesCDC (Change Data Capture)Utilization TelemetryHourly<1 hourBatch API pullsHealth ScoresDailyEODScheduled calculationFinancial Aggregates (ARR, NRR, DSO)Daily2 AMScheduled aggregationStrategic KPIsDaily6 AMPre-calculated in kpi_metrics

8. Visualization & Interaction Design
8.1 Visual Design Hierarchy
Level 1 (Strategic) — Visual Emphasis:

KPI Tiles: Large numbers, trend indicators (↗↘→), target badges (✓⚠🔴)
Scorecards: Color-coded performance indicators
Trend Charts: Simple line charts with annotations for key milestones
Alerts Section: Prominent exception summary with counts

Level 2 (Tactical) — Visual Emphasis:

Segmentation Tables: Sortable, filterable data grids with inline sparklines
Decomposition Trees: Interactive breakdown of composite metrics
Heatmaps: Product/customer matrices for white space analysis
Waterfall Charts: Revenue bridge analysis (ARR movements)
Bubble Charts: Multi-dimensional analysis (e.g., ARR vs. Health vs. Expansion Potential)

Level 3 (Operational) — Visual Emphasis:

Exception Reports: Tabular lists with action buttons
Workflow Status: Progress bars, checklists, timeline views
Detailed Records: Full data cards with related entity links
Alert Management: Priority badges, assignment tracking, resolution status

8.2 Recommended Visualization Types by Metric
Metric TypeLevel 1 (Strategic)Level 2 (Tactical)Level 3 (Operational)Point-in-Time Metrics (ARR, DSO, Health)KPI Tile with trendBar chart by segmentDetail table with filtersRate/Percentage Metrics (NRR, Win Rate)Gauge or progress barStacked bar by cohortList with calculations shownDistribution Metrics (Health bands)Donut chartHistogram with filtersSorted list by categoryTime-Series Trends (ARR growth)Line chart (quarterly)Multi-line by segmentDaily/weekly granular dataPipeline/Funnel (Q2C stages)Funnel chartStage-by-stage barsTransaction-level audit trailComparison Metrics (Target vs. Actual)Bullet chartVariance waterfallException list (over/under target)Correlation Analysis (Product combos)Matrix heatmapScatter plot with trendlineAccount list by correlationActionable Lists (At-risk accounts)Summary countPrioritized tableFull detail cards with actions
8.3 Drill Path Examples
Example 1: NRR Drill Path (Sales Expansion)
Level 1: NRR = 115% ✓ (+3.2pp YoY)
   ↓ Click on tile
Level 2: NRR Decomposition
   - Expansion ARR: $7.8M (+18%)
   - Churn ARR: -$1.2M (-8%)
   - Contraction ARR: -$0.4M (-15%)
   ↓ Click on "Expansion ARR"
Level 3: Expansion Movements Detail
   - List of 47 expansion transactions
   - Filter by product, date, sales rep
   - Drill to individual account → Full expansion history
Example 2: Quote-to-Cash Drill Path (Commercial Ops)
Level 1: Q2C Cycle = 38 days ✓ (-7 days vs. target)
   ↓ Click on tile
Level 2: Cycle Breakdown by Stage
   - Quote Acceptance: 12.5 days ⚠ (+2.5 over target)
   - Other stages on target
   ↓ Click on "Quote Acceptance"
Level 3: Delayed Quotes List
   - 28 quotes taking >10 days to accept
   - View quote details, customer tier, pricing complexity
   - Actions: [Remind Customer] [Escalate to Sales]
Example 3: Portfolio Health Drill Path (Customer Success)
Level 1: Portfolio Health = 78 ✓
   ↓ Click on "At-Risk: 12 accounts, $1.8M ARR"
Level 2: At-Risk Segmentation
   - By risk factor: Low utilization (5), No engagement (4), Support issues (3)
   - By tier: Enterprise (7), Commercial (5)
   ↓ Click on "Low Utilization" segment
Level 3: Account Action List
   - 5 accounts with <50% utilization
   - CSM assignments, next touchpoint dates
   - Actions: [Launch Success Plan] [Schedule QBR] [Training Recommendation]
8.4 Interactivity Features
Standard Features (All Dashboards):

Date range selector with presets (Last 7d, Last 30d, Last Quarter, Last Year, Custom)
Export to PDF/Excel/CSV
Subscribe to scheduled email delivery
Set custom alerts on threshold breaches
Bookmark views with filters applied
Share dashboard snapshot with team

Advanced Features (Level 2 & 3):

Save custom segments and filters
Create ad-hoc calculations
Annotate data points with comments
Compare multiple time periods side-by-side
Predictive trend projection (AI-powered)
Natural language query interface (e.g., "Show me accounts with declining health in healthcare vertical")


9. Implementation Roadmap & Prioritization
9.1 Phased Rollout Approach
Phase 1: Foundation (Weeks 1-4)

Establish data warehouse and semantic layer
Implement core shared KPIs (ARR, NRR, GRR, Health Score, Utilization)
Build Level 1 strategic views for all three personas
Deploy to pilot group (5-10 users per persona)

Deliverables:

Data pipeline architecture
Base KPI calculations documented
Three Level 1 dashboards deployed
User feedback collected

Phase 2: Tactical Expansion (Weeks 5-8)

Build Level 2 tactical/analytical views
Implement drill-down paths from Level 1 → Level 2
Add segmentation and filtering capabilities
Expand to broader user group (20-30 users per persona)

Deliverables:

Three Level 2 dashboards deployed
Interactive drill paths functional
Advanced filtering and segmentation
Training materials created

Phase 3: Operational Enablement (Weeks 9-12)

Build Level 3 operational/actionable views
Implement exception reports and alerts
Integrate workflow actions (e.g., create opportunity, schedule meeting)
Full organizational rollout

Deliverables:

Three Level 3 dashboards deployed
Alert and notification system
Workflow integrations
User adoption tracking

Phase 4: Optimization & Enhancement (Weeks 13-16)

Gather user feedback and refine UX
Add AI/ML-powered insights (lookalike analysis, churn prediction)
Implement conversational query interface
Performance tuning and data quality improvements

Deliverables:

Enhanced analytics features
AI-powered recommendations
Performance benchmarks met
Governance framework established

9.2 Success Metrics for Dashboard Adoption
MetricTargetMeasurement MethodUser Adoption Rate>80% of target users active monthlyLogin tracking, usage analyticsDashboard Engagement>5 sessions per user per weekBI platform analyticsTime to Insight<30 seconds to find key metricUser surveys, task completion timeData Quality Score>95% confidence in KPI calculationsAutomated data validationAction Completion Rate>70% of flagged exceptions actionedWorkflow trackingUser Satisfaction>4.0/5.0 ratingQuarterly NPS surveys

10. Data Governance & Quality Framework
10.1 Metric Definition Standards
For Each KPI, Document:

Business Definition: Plain-language explanation
Calculation Formula: SQL or pseudocode
Data Sources: Tables and fields used
Refresh Frequency: Real-time, hourly, daily, etc.
Ownership: Business owner and technical owner
Quality Thresholds: Acceptable data completeness and accuracy levels
Version History: Changes to definition over time

Example (From NRR):
KPI: Net Revenue Retention (NRR)
Business Definition: Percentage of revenue retained and expanded from a cohort 
                     of customers over a period, excluding new customer revenue
Calculation: ((Starting ARR + Expansion ARR - Churn ARR - Contraction ARR) 
              / Starting ARR) × 100
Data Sources: revenue_movements (expansion, churn, contraction), 
              subscriptions (starting ARR)
Refresh: Daily at 6 AM
Owner: VP Sales (Business), Director Analytics (Technical)
Quality Threshold: 100% data completeness, <1% calculation variance
Version: 2.1 (Last updated: 2025-01-15)
10.2 Data Quality Monitoring
Automated Checks:

Completeness: % of records with all required fields populated
Accuracy: Variance from expected ranges or patterns
Consistency: Cross-table relationship validation
Timeliness: Data freshness vs. expected refresh cadence
Uniqueness: Duplicate record detection

Quality Scoring System:
Data Quality Score (0-100) = 
  (Completeness × 0.40) + 
  (Accuracy × 0.30) + 
  (Consistency × 0.20) + 
  (Timeliness × 0.10)

Quality Bands:
- 95-100: Excellent (Green ✓)RContinue
90-94: Good (Light Green)
80-89: Acceptable (Yellow ⚠)
70-79: Poor (Orange)
<70: Critical (Red 🔴)


**Quality Issue Resolution Process:**
1. **Detection:** Automated alert triggered when quality score <90
2. **Triage:** Data steward reviews issue within 4 hours
3. **Root Cause Analysis:** Identify source system or pipeline issue
4. **Remediation:** Fix data issue and re-run calculations
5. **Validation:** Verify quality score returns to acceptable level
6. **Documentation:** Log issue and resolution in data quality registry

### 10.3 Metric Governance Committee

**Structure:**
- **Executive Sponsor:** Chief Revenue Officer or Chief Customer Officer
- **Steering Committee:** VP Commercial Ops, VP Sales, VP Customer Success
- **Working Group:** Directors from Analytics, Operations, Finance, IT
- **Data Stewards:** Assigned owners for each major data domain

**Responsibilities:**
- Approve new KPI definitions and changes to existing ones
- Resolve metric definition conflicts across business units
- Review data quality scorecards monthly
- Prioritize dashboard enhancement requests
- Ensure compliance with data privacy and security policies

**Meeting Cadence:**
- Steering Committee: Monthly
- Working Group: Bi-weekly
- Data Stewards: Weekly standups

---

## 11. Security, Privacy & Access Control

### 11.1 Role-Based Access Control (RBAC)

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Executive Leadership** | All dashboards, all data | View all metrics, export data, set global targets |
| **Commercial Ops Leader** | CommOps dashboard (all levels) | View, export, set team targets, manage workflows |
| **Sales Expansion Leader** | Sales dashboard (all levels), cross-reference CSM | View, export, create opportunities, manage pipeline |
| **Customer Success Leader** | CSM dashboard (all levels), cross-reference Sales | View, export, manage health scores, launch save campaigns |
| **Individual CSM** | CSM dashboard, filtered to assigned accounts | View own portfolio, update health scores, log activities |
| **Individual Sales Rep** | Sales dashboard, filtered to assigned accounts | View expansion opportunities, create quotes, track pipeline |
| **Commercial Ops Analyst** | CommOps dashboard (Levels 2-3) | View, analyze, create reports, flag exceptions |
| **Data Analyst** | All dashboards (read-only), semantic layer access | View, analyze, validate calculations, support users |
| **Executive Assistant** | Summary views only | View Level 1 dashboards for supported executives |

### 11.2 Data Privacy & Compliance

**Principles:**
1. **Data Minimization:** Only display data necessary for role function
2. **Anonymization:** Mask sensitive customer details where possible
3. **Audit Trails:** Log all data access and export activities
4. **Retention Policies:** Archive historical data per regulatory requirements
5. **Regional Compliance:** Respect GDPR, CCPA, and other data protection laws

**Sensitive Data Handling:**
- Customer names visible only to users with direct account relationship
- Financial details (ARR, payment terms) restricted to leadership and finance roles
- Personal identifiers (emails, phone numbers) masked in operational views
- Export functionality includes automatic watermarking and recipient tracking

### 11.3 Change Management & Version Control

**Dashboard Versioning:**
- All dashboard changes tracked in Git repository
- Major version changes require steering committee approval
- Minor version changes (cosmetic, non-metric) follow change request process
- Rollback capability for last 3 versions maintained

**Communication Protocol:**
- **Major Changes** (new KPIs, calculation changes): 2-week notice, training sessions, documentation updates
- **Minor Changes** (layout, filters): 3-day notice, release notes published
- **Bug Fixes:** Immediate deployment with post-fix notification

**Training & Enablement:**
- Onboarding program for new dashboard users (1-hour session per persona)
- Office hours: Weekly 30-minute Q&A sessions
- Documentation portal with video tutorials, FAQs, calculation guides
- Power user community for peer-to-peer support

---

## 12. Appendix: Detailed KPI Calculation Reference

### 12.1 Commercial Operations KPIs

#### Quote-to-Cash Cycle Time
```sql
-- Level 1: Overall Average
SELECT 
    AVG(quote_to_cash_days) AS avg_cycle_time,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY quote_to_cash_days) AS median_cycle_time,
    COUNT(CASE WHEN meets_sla = true THEN 1 END) * 100.0 / COUNT(*) AS sla_compliance_pct
FROM quote_to_cash_tracking
WHERE is_complete = true
    AND quote_created_date >= CURRENT_DATE - INTERVAL '90 days';

-- Level 2: Breakdown by Stage
SELECT 
    'Quote to Order' AS stage,
    AVG(quote_to_order_days) AS avg_days,
    3.0 AS target_days
FROM quote_to_cash_tracking
WHERE is_complete = true
UNION ALL
SELECT 'Order to Invoice', AVG(order_to_invoice_days), 2.0 FROM quote_to_cash_tracking WHERE is_complete = true
UNION ALL
SELECT 'Invoice to Payment', AVG(invoice_to_payment_days), 30.0 FROM quote_to_cash_tracking WHERE is_complete = true;

-- Level 3: Exception List (SLA Breaches)
SELECT 
    q.tracking_id,
    q.customer_id,
    a.name AS customer_name,
    q.quote_to_cash_days,
    q.target_cycle_days,
    q.variance_from_target,
    q.current_stage
FROM quote_to_cash_tracking q
JOIN accounts a ON q.customer_id = a.id
WHERE q.meets_sla = false
    AND q.is_complete = false
ORDER BY q.variance_from_target DESC
LIMIT 50;
Days Sales Outstanding (DSO)
sql-- Level 1: Company-Wide DSO
SELECT 
    SUM(total_ar_balance) / (SUM(arr) / 365.0) AS dso_days,
    SUM(total_ar_balance) AS total_ar,
    SUM(overdue_balance) AS overdue_ar,
    SUM(overdue_balance) * 100.0 / NULLIF(SUM(total_ar_balance), 0) AS overdue_pct
FROM accounts_receivable;

-- Level 2: DSO by Customer Tier
SELECT 
    customer_tier,
    COUNT(*) AS customer_count,
    SUM(total_ar_balance) AS tier_ar,
    SUM(current_0_30_days) AS current,
    SUM(aging_31_60_days) AS aging_31_60,
    SUM(aging_61_90_days) AS aging_61_90,
    SUM(aging_90_plus_days) AS aging_90_plus,
    AVG(avg_days_outstanding) AS avg_dso
FROM accounts_receivable
GROUP BY customer_tier
ORDER BY avg_dso DESC;

-- Level 3: Accounts with DSO > 60 Days
SELECT 
    ar.customer_id,
    ar.customer_name,
    ar.customer_tier,
    ar.total_ar_balance,
    ar.avg_days_outstanding AS dso,
    ar.overdue_balance,
    ar.disputed_amount,
    a.arr AS customer_arr
FROM accounts_receivable ar
JOIN accounts a ON ar.customer_id = a.id
WHERE ar.avg_days_outstanding > 60
ORDER BY ar.total_ar_balance DESC;
Expansion ARR Contribution
sql-- Level 1: Overall Expansion Contribution
SELECT 
    SUM(CASE WHEN movement_type = 'expansion' THEN arr_change ELSE 0 END) AS expansion_arr,
    SUM(arr_change) AS total_arr_change,
    SUM(CASE WHEN movement_type = 'expansion' THEN arr_change ELSE 0 END) * 100.0 / 
        NULLIF(SUM(arr_change), 0) AS expansion_contribution_pct
FROM revenue_movements
WHERE fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND fiscal_quarter = 'Q' || EXTRACT(QUARTER FROM CURRENT_DATE);

-- Level 2: Expansion by Category
SELECT 
    movement_category,
    COUNT(*) AS expansion_count,
    SUM(arr_change) AS total_expansion_arr,
    AVG(arr_change) AS avg_expansion_value
FROM revenue_movements
WHERE movement_type = 'expansion'
    AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY movement_category
ORDER BY total_expansion_arr DESC;

-- Level 3: Recent Expansion Movements
SELECT 
    rm.movement_id,
    rm.customer_id,
    a.name AS customer_name,
    rm.movement_category,
    rm.arr_change AS expansion_arr,
    rm.effective_date,
    s.product_family
FROM revenue_movements rm
JOIN accounts a ON rm.customer_id = a.id
JOIN subscriptions s ON rm.subscription_id = s.subscription_id
WHERE rm.movement_type = 'expansion'
    AND rm.effective_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY rm.effective_date DESC;
12.2 Sales Expansion KPIs
Net Revenue Retention (NRR)
sql-- Level 1: Company-Wide NRR
WITH cohort_base AS (
    SELECT 
        SUM(arr) AS starting_arr
    FROM subscriptions
    WHERE subscription_start_date <= DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '1 year'
        AND (subscription_end_date IS NULL OR subscription_end_date > DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '1 year')
),
cohort_movements AS (
    SELECT 
        SUM(CASE WHEN movement_type = 'expansion' THEN arr_change ELSE 0 END) AS expansion_arr,
        SUM(CASE WHEN movement_type = 'churn' THEN arr_change ELSE 0 END) AS churn_arr,
        SUM(CASE WHEN movement_type = 'contraction' THEN arr_change ELSE 0 END) AS contraction_arr
    FROM revenue_movements
    WHERE effective_date BETWEEN DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '1 year' 
        AND DATE_TRUNC('quarter', CURRENT_DATE)
)
SELECT 
    cb.starting_arr,
    cm.expansion_arr,
    cm.churn_arr,
    cm.contraction_arr,
    (cb.starting_arr + cm.expansion_arr + cm.churn_arr + cm.contraction_arr) AS ending_arr,
    ((cb.starting_arr + cm.expansion_arr + cm.churn_arr + cm.contraction_arr) * 100.0 / cb.starting_arr) AS nrr_pct
FROM cohort_base cb, cohort_movements cm;

-- Level 2: NRR by Customer Tier
SELECT 
    a.tier,
    SUM(CASE WHEN rm.movement_type = 'expansion' THEN rm.arr_change ELSE 0 END) AS expansion,
    SUM(CASE WHEN rm.movement_type = 'churn' THEN rm.arr_change ELSE 0 END) AS churn,
    SUM(CASE WHEN rm.movement_type = 'contraction' THEN rm.arr_change ELSE 0 END) AS contraction
FROM revenue_movements rm
JOIN accounts a ON rm.customer_id = a.id
WHERE rm.effective_date >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY a.tier;
White Space Opportunity Value
sql-- Level 1: Total White Space Potential
WITH product_coverage AS (
    SELECT 
        a.id AS customer_id,
        a.name AS customer_name,
        a.tier,
        a.arr AS current_arr,
        COUNT(DISTINCT l.product_family) AS products_deployed,
        5 - COUNT(DISTINCT l.product_family) AS white_space_products
    FROM accounts a
    LEFT JOIN licenses l ON a.id = l.customer_id
    WHERE a.status = 'Active'
    GROUP BY a.id, a.name, a.tier, a.arr
)
SELECT 
    SUM(white_space_products) AS total_white_space_gaps,
    SUM(white_space_products * current_arr * 0.35) AS estimated_white_space_arr,
    AVG(white_space_products) AS avg_gaps_per_customer
FROM product_coverage
WHERE white_space_products > 0;

-- Level 2: White Space by Customer Segment
SELECT 
    tier,
    products_deployed,
    COUNT(*) AS customer_count,
    SUM(white_space_products) AS total_gaps,
    SUM(current_arr) AS segment_arr,
    SUM(white_space_products * current_arr * 0.35) AS est_opportunity
FROM product_coverage
GROUP BY tier, products_deployed
ORDER BY tier, products_deployed;

-- Level 3: Top White Space Opportunities
SELECT 
    pc.customer_id,
    pc.customer_name,
    pc.tier,
    pc.current_arr,
    pc.products_deployed,
    pc.white_space_products,
    (pc.white_space_products * pc.current_arr * 0.35) AS estimated_expansion_arr,
    ARRAY_AGG(l.product_family) AS deployed_products
FROM product_coverage pc
LEFT JOIN licenses l ON pc.customer_id = l.customer_id
WHERE pc.white_space_products >= 2
GROUP BY pc.customer_id, pc.customer_name, pc.tier, pc.current_arr, 
         pc.products_deployed, pc.white_space_products
ORDER BY estimated_expansion_arr DESC
LIMIT 50;
12.3 Customer Success KPIs
Gross Revenue Retention (GRR)
sql-- Level 1: Company-Wide GRR
WITH cohort_base AS (
    SELECT 
        SUM(arr) AS starting_arr
    FROM subscriptions
    WHERE subscription_start_date <= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
        AND (subscription_end_date IS NULL OR 
             subscription_end_date > DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year')
),
cohort_losses AS (
    SELECT 
        SUM(CASE WHEN movement_type = 'churn' THEN arr_change ELSE 0 END) AS churn_arr,
        SUM(CASE WHEN movement_type = 'contraction' THEN arr_change ELSE 0 END) AS contraction_arr
    FROM revenue_movements
    WHERE effective_date BETWEEN DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year' 
        AND DATE_TRUNC('year', CURRENT_DATE)
)
SELECT 
    cb.starting_arr,
    cl.churn_arr,
    cl.contraction_arr,
    (cb.starting_arr + cl.churn_arr + cl.contraction_arr) AS retained_arr,
    ((cb.starting_arr + cl.churn_arr + cl.contraction_arr) * 100.0 / cb.starting_arr) AS grr_pct
FROM cohort_base cb, cohort_losses cl;

-- Level 2: GRR by Tier and Cohort
SELECT 
    a.tier,
    DATE_TRUNC('year', s.subscription_start_date) AS cohort_year,
    COUNT(DISTINCT a.id) AS cohort_size,
    SUM(s.arr) AS cohort_starting_arr,
    SUM(CASE WHEN rm.movement_type IN ('churn', 'contraction') 
        THEN rm.arr_change ELSE 0 END) AS losses,
    ((SUM(s.arr) + SUM(CASE WHEN rm.movement_type IN ('churn', 'contraction') 
        THEN rm.arr_change ELSE 0 END)) * 100.0 / SUM(s.arr)) AS grr_pct
FROM accounts a
JOIN subscriptions s ON a.id = s.customer_id
LEFT JOIN revenue_movements rm ON a.id = rm.customer_id
WHERE s.subscription_start_date >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '3 years'
GROUP BY a.tier, DATE_TRUNC('year', s.subscription_start_date)
ORDER BY cohort_year DESC, a.tier;
Portfolio Health Score
sql-- Level 1: Weighted Portfolio Health
WITH account_health AS (
    SELECT 
        a.id AS customer_id,
        a.name AS customer_name,
        a.arr,
        -- Usage Health (40%)
        (AVG(l.utilization) * 0.40) +
        -- Engagement Health (30%) - simplified for example
        (CASE WHEN a.last_touch_date >= CURRENT_DATE - 30 THEN 85 ELSE 60 END * 0.30) +
        -- Support Health (20%)
        (CASE WHEN t.open_ticket_count = 0 THEN 90 
              WHEN t.open_ticket_count <= 2 THEN 75 ELSE 55 END * 0.20) +
        -- Business Outcome Health (10%) - placeholder
        (75 * 0.10)
        AS health_score
    FROM accounts a
    LEFT JOIN licenses l ON a.id = l.customer_id
    LEFT JOIN (
        SELECT customer_id, COUNT(*) AS open_ticket_count
        FROM support_tickets
        WHERE status = 'Open'
        GROUP BY customer_id
    ) t ON a.id = t.customer_id
    WHERE a.status = 'Active'
    GROUP BY a.id, a.name, a.arr, a.last_touch_date, t.open_ticket_count
)
SELECT 
    SUM(health_score * arr) / SUM(arr) AS weighted_portfolio_health,
    AVG(health_score) AS avg_health_score,
    COUNT(*) AS total_accounts,
    SUM(arr) AS total_arr
FROM account_health;

-- Level 2: Health Distribution
SELECT 
    CASE 
        WHEN health_score >= 91 THEN 'Thriving (91-100)'
        WHEN health_score >= 76 THEN 'Healthy (76-90)'
        WHEN health_score >= 61 THEN 'Stable (61-75)'
        WHEN health_score >= 46 THEN 'At Risk (46-60)'
        ELSE 'Critical (0-45)'
    END AS health_category,
    COUNT(*) AS account_count,
    SUM(arr) AS category_arr,
    SUM(arr) * 100.0 / SUM(SUM(arr)) OVER () AS pct_of_total_arr
FROM account_health
GROUP BY health_category
ORDER BY MIN(health_score) DESC;

-- Level 3: At-Risk Accounts Detail
SELECT 
    ah.customer_id,
    ah.customer_name,
    ah.arr,
    ah.health_score,
    a.tier,
    a.csm_assigned,
    s.subscription_end_date AS renewal_date,
    DATEDIFF(day, CURRENT_DATE, s.subscription_end_date) AS days_to_renewal
FROM account_health ah
JOIN accounts a ON ah.customer_id = a.id
JOIN subscriptions s ON ah.customer_id = s.customer_id
WHERE ah.health_score < 60
    AND s.subscription_end_date >= CURRENT_DATE
ORDER BY ah.health_score ASC, s.subscription_end_date ASC;

13. Mock Dashboard Layouts
13.1 Commercial Operations - Level 1 Layout
╔═══════════════════════════════════════════════════════════════════════════════╗
║                  COMMERCIAL OPERATIONS COMMAND CENTER                         ║
║                          Q2 2025 Performance                                  ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  [Filter: Region: All ▾] [Tier: All ▾] [Product: All ▾] [Quarter: Q2 2025 ▾] ║
║                                                                               ║
║  ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓  ║
║  ┃ Quote-to-Cash ┃  ┃ Quote Approval┃  ┃    Invoice    ┃  ┃      DSO      ┃  ║
║  ┃   Cycle Time  ┃  ┃    Velocity   ┃  ┃   Accuracy    ┃  ┃               ┃  ║
║  ┃               ┃  ┃               ┃  ┃               ┃  ┃               ┃  ║
║  ┃    38 days    ┃  ┃   2.1 days    ┃  ┃    98.5%      ┃  ┃    28 days    ┃  ║
║  ┃   ✓ Target    ┃  ┃   ✓ Target    ┃  ┃   ✓ Target    ┃  ┃   ✓ Target    ┃  ║
║  ┃   ↗ -15.8%    ┃  ┃   ↗ -12.5%    ┃  ┃   ↗ +0.5pp    ┃  ┃   ↗ -6.7%     ┃  ║
║  ┃               ┃  ┃               ┃  ┃               ┃  ┃               ┃  ║
║  ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛  ║
║                                                                               ║
║  ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓  ║
║  ┃   Revenue     ┃  ┃   Deferred    ┃  ┃  Quote Win    ┃  ┃  Expansion    ┃  ║
║  ┃ Recognition   ┃  ┃    Revenue    ┃  ┃     Rate      ┃  ┃      ARR      ┃  ║
║  ┃   Accuracy    ┃  ┃    Balance    ┃  ┃               ┃  ┃ Contribution  ┃  ║
║  ┃    99.2%      ┃  ┃   $42.3M      ┃  ┃    68.2%      ┃  ┃     24.3%     ┃  ║
║  ┃   ✓ Target    ┃  ┃   ↗ +5.2%     ┃  ┃   ✓ Target    ┃  ┃   ✓ Target    ┃  ║
║  ┃   → Stable    ┃  ┃               ┃  ┃   ↗ +3.2pp    ┃  ┃   ↗ +2.1pp    ┃  ║
║  ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛  ║
║                                                                               ║
║  ┌───────────────────────────────────────────────────────────────────────┐   ║
║  │  📈 Quote-to-Cash Cycle Trend (Last 4 Quarters)                       │   ║
║  │                                                                       │   ║
║  │  52d ┤                                                                │   ║
║  │  45d ┼────────╮ ← Target                                             │   ║
║  │  38d ┤        ╰─────╮                                                 │   ║
║  │  30d ┤              ╰──────╮                                          │   ║
║  │  23d ┤                     ╰───────●                                  │   ║
║  │      └─────┬──────┬──────┬──────┬                                     │   ║
║  │           Q3'24  Q4'24  Q1'25  Q2'25                                 │   ║
║  └───────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
║  ⚠ Exception Alerts (Requires Action)                  [View All Details →]  ║
║  ┌───────────────────────────────────────────────────────────────────────┐   ║
║  │  🔴 12 quotes pending approval > 5 days ($1.8M ARR)                   │   ║
║  │  🟡 7 invoices disputed (total $425K)                                 │   ║
║  │  🟡 23 accounts with DSO > 60 days ($3.2M AR)                         │   ║
║  └───────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
║  [📊 Drill to Process Analysis] [📋 View Detailed Reports] [📧 Export Summary]║
╚═══════════════════════════════════════════════════════════════════════════════╝
13.2 Sales Expansion - Level 2 Layout (White Space Matrix)
╔═══════════════════════════════════════════════════════════════════════════════╗
║              SALES EXPANSION: WHITE SPACE INTELLIGENCE                        ║
║                     Multi-Product Penetration Analysis                        ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  Customer: TechCorp Industries  |  ARR: $425K  |  Tier: Enterprise           ║
║  CSM: Sarah Martinez  |  Sales Rep: Mike Thompson  |  Health Score: 78       ║
║                                                                               ║
║  ┌───────────────────────────────────────────────────────────────────────┐   ║
║  │  PRODUCT PORTFOLIO COVERAGE MATRIX                                    │   ║
║  ├───────────────┬──────────┬──────────────┬──────────────┬─────────────┤   ║
║  │  Product      │ Deployed │ Utilization  │ Health Score │ Synergy     │   ║
║  │               │          │              │              │ Score       │   ║
║  ├───────────────┼──────────┼──────────────┼──────────────┼─────────────┤   ║
║  │  Meraki       │    ✓     │     92%      │     85       │     --      │   ║
║  │  Duo          │    ✓     │     78%      │     76       │     --      │   ║
║  │  Umbrella     │    ✗     │     --       │     --       │  87 🎯 HIGH │   ║
║  │  ThousandEyes │    ✗     │     --       │     --       │  92 🎯 HIGH │   ║
║  │  Splunk       │    ✗     │     --       │     --       │  85 🎯 HIGH │   ║
║  └───────────────┴──────────┴──────────────┴──────────────┴─────────────┘   ║
║                                                                               ║
║  📊 RECOMMENDED EXPANSION STRATEGY                                            ║
║  ┌───────────────────────────────────────────────────────────────────────┐   ║
║  │  Priority 1: ThousandEyes (Network Monitoring)                        │   ║
║  │  • Estimated ARR: $120K                                               │   ║
║  │  • Win Probability: 78% (based on 12 similar account patterns)       │   ║
║  │  • Timeline: Q3 2025                                                  │   ║
║  │  • Key Driver: Network visibility gap identified                      │   ║
║  │  • Champion: John Smith (CTO)                                         │   ║
║  │  [📞 Schedule Demo] [📄 Generate Proposal] [👥 View Lookalikes]      │   ║
║  ├───────────────────────────────────────────────────────────────────────┤   ║
║  │  Priority 2: Umbrella (Cloud Security)                                │   ║
║  │  • Estimated ARR: $85K                                                │   ║
║  │  • Win Probability: 72% (complements existing Duo deployment)        │   ║
║  │  • Timeline: Q4 2025                                                  │   ║
║  │  • Key Driver: Cloud migration underway (AWS + Azure)                │   ║
║  │  [📞 QBR Discussion] [📊 ROI Calculator] [📋 Case Studies]           │   ║
║  └───────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
║  🔍 LOOKALIKE SUCCESS PATTERNS                                                ║
║  ┌───────────────────────────────────────────────────────────────────────┐   ║
║  │  Similar customers (85%+ similarity match):                           │   ║
║  │  • FinanceFirst (Similarity: 92%) - Added ThousandEyes, $115K ARR    │   ║
║  │  • GlobalHealth (Similarity: 88%) - Added ThousandEyes, $128K ARR    │   ║
║  │  • DataSystems (Similarity: 85%) - Added Umbrella, $78K ARR          │   ║
║  │                                                                       │   ║
║  │  Aggregate Statistics:                                                │   ║
║  │  • 15 similar accounts added ThousandEyes with 76% win rate          │   ║
║  │  • Average time from opportunity → close: 87 days                    │   ║
║  │  • Typical entry point: Network performance concerns                  │   ║
║  │  [📊 View Full Analysis] [👥 Contact Similar Account CSMs]           │   ║
║  └───────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
║  [← Back to Overview] [🔄 Refresh Data] [📧 Share with Team] [✏️ Add Notes]  ║
╚═══════════════════════════════════════════════════════════════════════════════╝
13.3 Customer Success - Level 3 Layout (Action Center)
╔═══════════════════════════════════════════════════════════════════════════════╗
║                   CUSTOMER SUCCESS ACTION CENTER                              ║
║                     Exception Reports & Workflows                             ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  CSM: Sarah Martinez  |  Portfolio: 45 accounts  |  Total ARR: $8.2M         ║
║  [🔴 Critical: 5] [🟡 High Priority: 12] [🟢 Normal: 28]                     ║
║                                                                               ║
║  ╔═══════════════════════════════════════════════════════════════════════╗   ║
║  ║  🔴 CRITICAL HEALTH ACCOUNTS (Immediate Action Required)              ║   ║
║  ╠═══════════════════════════════════════════════════════════════════════╣   ║
║  ║  Account        Health  ARR     Primary Risk      Days to  Action    ║   ║
║  ║                 Score           Factor            Renewal  Status    ║   ║
║  ║───────────────────────────────────────────────────────────────────────║   ║
║  ║  MegaCorp        38    $425K   Low utilization      45    ⚠ Plan    ║   ║
║  ║                                 (32%)                      Active    ║   ║
║  ║  └─ [🚨 Launch Save Campaign] [📞 Exec Escalation] [📋 View Detail] ║   ║
║  ║                                                                       ║   ║
║  ║  DataInc         42    $285K   Support escalations  78    ⚠ In      ║   ║
║  ║                                 (8 open tickets)           Progress  ║   ║
║  ║  └─ [📞 Support Review Meeting] [✉️ Email Update] [📊 Ticket Data] ║   ║
║  ║                                                                       ║   ║
║  ║  TechStart       45    $156K   No engagement       92    📅 Sched   ║   ║
║  ║                                 (120 days)                          ║   ║
║  ║  └─ [📅 Schedule QBR] [📞 Call Champion] [📧 Send Re-engagement]   ║   ║
║  ╚═══════════════════════════════════════════════════════════════════════╝   ║
║                                                                               ║
║  ╔═══════════════════════════════════════════════════════════════════════╗   ║
║  ║  ⚠ OVERDUE SUCCESS ACTIVITIES                                        ║   ║
║  ╠═══════════════════════════════════════════════════════════════════════╣   ║
║  ║  Activity      Account         Days     Priority  Impact             ║   ║
║  ║  Type                          Overdue                               ║   ║
║  ║───────────────────────────────────────────────────────────────────────║   ║
║  ║  QBR           GlobalHealth      45      🔴 High   Health declining  ║   ║
║  ║  └─ Last QBR: 2024-12-15  |  Next renewal: 2025-08-30               ║   ║
║  ║  └─ [📅 Schedule Now] [📧 Send Invite] [📋 Prep QBR Deck]           ║   ║
║  ║                                                                       ║   ║
║  ║  Success Plan  FinanceFirst      32      🟡 Med    Renewal in 60d   ║   ║
║  ║  Review                                                              ║   ║
║  ║  └─ [✏️ Update Plan] [📞 Review Call] [📊 Progress Check]           ║   ║
║  ║                                                                       ║   ║
║  ║  Onboarding    StartupX          18      🔴 High   Still impl phase ║   ║
║  ║  Milestone                                                           ║   ║
║  ║  └─ [🚀 Accelerate] [📞 Check-in Call] [📝 Milestone Review]        ║   ║
║  ╚═══════════════════════════════════════════════════════════════════════╝   ║
║                                                                               ║
║  ╔═══════════════════════════════════════════════════════════════════════╗   ║
║  ║  📉 USAGE ANOMALY ALERTS                                             ║   ║
║  ╠═══════════════════════════════════════════════════════════════════════╣   ║
║  ║  Alert ID       Account    Product   Issue          Severity  Days  ║   ║
║  ║                                                               Active ║   ║
║  ║───────────────────────────────────────────────────────────────────────║   ║
║  ║  ALT-2025-678   DataCorp   Duo       Usage ↓ 45%   🔴 Crit     8   ║   ║
║  ║  └─ Recommended Action: Immediate customer outreach                  ║   ║
║  ║  └─ [📞 Call Now] [📧 Email] [📊 View Usage History] [✏️ Log Note] ║   ║
║  ║                                                                       ║   ║
║  ║  ALT-2025-701   GlobalTech Meraki    Logins ↓ 30%  🟡 High     5   ║   ║
║  ║  └─ [📞 Check with Champion] [📧 Send Check-in] [📊 View Trend]    ║   ║
║  ╚═══════════════════════════════════════════════════════════════════════╝   ║
║                                                                               ║
║  [🔄 Refresh Alerts] [✅ Mark as Actioned] [📊 View All Accounts] [⚙️ Settings]║
╚═══════════════════════════════════════════════════════════════════════════════╝

14. Conclusion & Next Steps
14.1 Summary
This Dashboard Design Document provides a comprehensive blueprint for a three-persona, multi-level analytics ecosystem built on a unified KPI foundation. The design enables:

Commercial Operations Leaders to optimize quote-to-cash processes, improve cash collection, and ensure revenue recognition accuracy
Sales Expansion Leaders to identify white space opportunities, drive cross-sell/upsell, and maximize NRR through data-driven expansion strategies
Customer Success Leaders to proactively manage portfolio health, mitigate churn risk, and ensure customers achieve value realization

Each dashboard follows a consistent Strategic → Tactical → Operational hierarchy, allowing users to seamlessly drill from executive-level insights to actionable, account-level interventions.
14.2 Key Success Factors
Technical Excellence:

Robust data pipeline architecture with quality monitoring
Semantic layer ensuring metric consistency across personas
Performance-optimized queries for sub-second response times

User Adoption:

Intuitive navigation and interaction patterns
Role-appropriate access and filtering
Comprehensive training and documentation

Business Alignment:

Metrics directly tied to organizational goals and compensation
Cross-functional governance ensuring stakeholder buy-in
Continuous feedback loops for dashboard refinement

Data Governance:

Single source of truth for all KPIs
Clear ownership and accountability for data quality
Version control and change management protocols

14.3 Recommended Next Steps
Week 1-2: Stakeholder Alignment

Present design document to steering committee
Gather feedback on KPI priorities and visualization preferences
Finalize metric definitions and calculation logic
Secure executive sponsorship and resource allocation

Week 3-4: Technical Foundation

Set up data warehouse environment
Implement data pipelines from source systems
Build semantic layer with core KPIs
Establish data quality monitoring framework

Week 5-8: Dashboard Development (Pilot)

Build Level 1 strategic views for all three personas
Deploy to 5-10 pilot users per persona
Conduct user acceptance testing
Iterate based on feedback

Week 9-12: Full Rollout

Complete Levels 2 and 3 for all personas
Train broader user community (50-100 users)
Enable self-service drill-downs and exports
Launch support infrastructure (office hours, documentation portal)

Week 13-16: Optimization

Gather usage analytics and user feedback
Implement AI/ML-powered insights (lookalike matching, churn prediction)
Performance tuning and query optimization
Establish ongoing governance and enhancement process

14.4 Long-Term Vision
Beyond initial deployment, this dashboard ecosystem can evolve to include:

Predictive Analytics: AI-driven forecasts for churn risk, expansion probability, and revenue projections
Prescriptive Recommendations: Automated next-best-action suggestions (e.g., "Contact these 5 accounts this week for highest ROI")
Natural Language Interface: Conversational query capability (e.g., "Show me healthcare accounts with declining Umbrella usage")
Mobile Access: Responsive design for executive dashboards on mobile devices
Embedded Analytics: Dashboard components embedded directly in CRM and CSM platforms
Real-Time Collaboration: Shared annotations, @mentions, and workflow assignments directly within dashboards


Document End
For questions or clarifications on this design, please contact the Analytics Strategy team or refer to the project knowledge base for detailed KPI calculations and data schemas.