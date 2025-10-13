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