import fs from 'fs';
import path from 'path';

/**
 * Load all context files from the context directory
 * These files contain SQL queries and metric definitions that help the AI understand business context
 */
export function loadContextFiles(): string {
  const contextDir = path.join(process.cwd(), 'context');
  
  if (!fs.existsSync(contextDir)) {
    console.warn('⚠️  Context directory not found');
    return '';
  }

  try {
    const files = fs.readdirSync(contextDir);
    const contextContent: string[] = [];

    for (const file of files) {
      if (file.endsWith('.txt')) {
        const filePath = path.join(contextDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const metricName = file.replace('.txt', '');
        
        contextContent.push(`\n## ${metricName}\n${content}`);
      }
    }

    console.log(`✅ Loaded ${files.length} context files`);
    return contextContent.join('\n\n---\n');
  } catch (error) {
    console.error('Error loading context files:', error);
    return '';
  }
}

/**
 * Get a summarized version of the context for token efficiency
 */
export function getContextSummary(): string {
  return `
# Business Metrics Context

You have access to the following business metrics and their calculation methods:

## Customer Success Metrics
- **Net Revenue Retention (NRR)**: Measures revenue retention and expansion from existing customers
- **Gross Revenue Retention (GRR)**: Revenue retained excluding expansion
- **Churn Rate**: Customer and revenue churn calculations
- **Portfolio Health Score**: Weighted health score across customer portfolio
- **License Utilization Rate**: How effectively customers use their licenses

## Commercial Operations Metrics
- **Quote-to-Cash Cycle**: Time from quote to payment collection
- **Revenue Recognition Accuracy**: Compliance with revenue recognition standards
- **Days Sales Outstanding (DSO)**: Average collection period for accounts receivable
- **Renewal Quote Velocity**: Speed of quote generation for renewals

## Sales Expansion Metrics
- **Expansion ARR Contribution**: Revenue from upsells and cross-sells
- **Expansion Win Rate**: Success rate of expansion opportunities
- **White Space Opportunity**: Untapped potential within existing accounts
- **Multi-Product Penetration Rate**: Cross-sell success across product portfolio

These metrics are calculated using SQL queries on the Snowflake database with tables including:
- accounts, customers, subscriptions, orders, invoices
- licenses, products, usage_metrics
- quotes, contracts, revenue data

When users ask about these metrics, you can:
1. Explain what they mean and how they're calculated
2. Use Snowflake Cortex to query the actual data
3. Provide insights based on the query results
`;
}

/**
 * Determine if a query should use Snowflake Cortex (data query) or just OpenAI (explanation)
 */
export function shouldUseCortex(message: string): boolean {
  const cortexKeywords = [
    'show', 'list', 'count', 'how many', 'what are', 'find',
    'customers', 'accounts', 'revenue', 'orders', 'subscriptions',
    'invoices', 'products', 'licenses', 'usage',
    'top', 'bottom', 'highest', 'lowest',
    'total', 'sum', 'average', 'calculate',
    'recent', 'last', 'this month', 'this year',
    'query', 'data', 'database'
  ];

  const lowerMessage = message.toLowerCase();
  return cortexKeywords.some(keyword => lowerMessage.includes(keyword));
}

