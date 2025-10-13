/**
 * DSO Real Data Service
 *
 * Calculates Days Sales Outstanding (DSO) metrics using real source data
 * Implements 3-level drill-down as per DSO.md documentation
 */

import invoicesData from '@/source_data/commercial_operations/invoices.json';
import accountsReceivableData from '@/source_data/commercial_operations/accounts_receivable.json';
import subscriptionsData from '@/source_data/commercial_operations/subscriptions.json';
import accountsData from '@/source_data/commercial_operations/accounts.json';

// Type definitions
export interface DSOProductData {
  productFamily: string;
  dsoValue: number;
  target: number;
  trend: number;
  status: 'good' | 'warning' | 'critical';
  arBalance: number;
  customerCount: number;
  invoiceCount: number;
  aging: {
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
}

export interface DSOSegmentData {
  segment: string;
  geography: string;
  productFamily: string;
  dsoValue: number;
  invoiceVolume: number;
  avgInvoiceValue: number;
  primaryAgingBucket: string;
  delayedCustomersCount: number;
  arBalance: number;
  status: 'good' | 'warning' | 'critical';
}

export interface DSOInvoiceDetail {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerId: string;
  daysOutstanding: number;
  amount: number;
  agingBucket: string;
  paymentTerms: string;
  collectionsStatus: string;
  assignedTo: string;
  productFamily: string;
  segment: string;
  geography: string;
  dueDate: string;
  invoiceDate: string;
  isDisputed: boolean;
  disputeReason?: string;
}

/**
 * Calculate DSO for a given set of invoices
 * DSO = (Accounts Receivable / Total Credit Sales) × Number of Days
 * Or simpler: Average days outstanding
 */
function calculateDSO(invoices: any[]): number {
  if (invoices.length === 0) return 0;

  const totalDaysOutstanding = invoices.reduce((sum, inv) => {
    return sum + (inv.days_outstanding || 0);
  }, 0);

  return Math.round(totalDaysOutstanding / invoices.length);
}

/**
 * Get product family from subscription ID via invoices
 */
function getProductFamilyForInvoice(invoice: any): string {
  const subscription = subscriptionsData.find(
    (sub: any) => sub.subscription_id === invoice.subscription_id
  );
  return subscription?.product_family || 'Unknown';
}

/**
 * Get customer info from accounts
 */
function getCustomerInfo(customerId: string): any {
  const accountRecord = accountsData.find(
    (acc: any) => acc.account?.id === customerId
  );
  return accountRecord?.account || null;
}

/**
 * Calculate aging buckets for invoices
 */
function calculateAgingBuckets(invoices: any[]) {
  const aging = {
    current_0_30: 0,
    aging_31_60: 0,
    aging_61_90: 0,
    aging_90_plus: 0,
  };

  invoices.forEach((inv) => {
    const amount = inv.amount_outstanding || 0;
    const days = inv.days_outstanding || 0;

    if (days <= 30) {
      aging.current_0_30 += amount;
    } else if (days <= 60) {
      aging.aging_31_60 += amount;
    } else if (days <= 90) {
      aging.aging_61_90 += amount;
    } else {
      aging.aging_90_plus += amount;
    }
  });

  return aging;
}

/**
 * Calculate aging percentages
 */
function calculateAgingPercentages(aging: any) {
  const total = aging.current_0_30 + aging.aging_31_60 + aging.aging_61_90 + aging.aging_90_plus;

  if (total === 0) {
    return {
      current_0_30_pct: 0,
      aging_31_60_pct: 0,
      aging_61_90_pct: 0,
      aging_90_plus_pct: 0,
    };
  }

  return {
    current_0_30_pct: Math.round((aging.current_0_30 / total) * 100),
    aging_31_60_pct: Math.round((aging.aging_31_60 / total) * 100),
    aging_61_90_pct: Math.round((aging.aging_61_90 / total) * 100),
    aging_90_plus_pct: Math.round((aging.aging_90_plus / total) * 100),
  };
}

/**
 * Determine status based on DSO value
 */
function getDSOStatus(dso: number, target: number): 'good' | 'warning' | 'critical' {
  if (dso <= target) return 'good';
  if (dso <= target * 1.5) return 'warning';
  return 'critical';
}

/**
 * LEVEL 1: Product-Line DSO Comparison with AR Aging Matrix
 * Returns DSO data by product family (Meraki, Duo, Umbrella, ThousandEyes, Splunk)
 */
export function getLevel1ProductComparison(): DSOProductData[] {
  const products = ['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk'];
  const target = 35; // Target DSO days

  const productData: DSOProductData[] = products.map(product => {
    // Get all subscriptions for this product
    const productSubscriptions = subscriptionsData.filter(
      (sub: any) => sub.product_family === product
    );

    const subscriptionIds = productSubscriptions.map((sub: any) => sub.subscription_id);
    const customerIds = productSubscriptions.map((sub: any) => sub.customer_id);

    // Get invoices for this product (only outstanding)
    const productInvoices = invoicesData.filter((inv: any) =>
      subscriptionIds.includes(inv.subscription_id) &&
      inv.amount_outstanding > 0
    );

    // Calculate metrics
    const dsoValue = calculateDSO(productInvoices);
    const arBalance = productInvoices.reduce((sum, inv) => sum + (inv.amount_outstanding || 0), 0);
    const uniqueCustomers = new Set(productInvoices.map((inv: any) => inv.customer_id)).size;
    const aging = calculateAgingBuckets(productInvoices);
    const agingPercentages = calculateAgingPercentages(aging);

    // Calculate trend (mock for now - could be based on historical data)
    const trend = Math.random() > 0.5 ? Math.round(Math.random() * 10) - 5 : -Math.round(Math.random() * 10);

    return {
      productFamily: product,
      dsoValue,
      target,
      trend,
      status: getDSOStatus(dsoValue, target),
      arBalance: Math.round(arBalance),
      customerCount: uniqueCustomers,
      invoiceCount: productInvoices.length,
      aging,
      agingPercentages,
    };
  });

  return productData;
}

/**
 * LEVEL 2: Customer Segment & Geography Breakdown
 * Returns DSO data by segment and geography for a specific product
 */
export function getLevel2SegmentBreakdown(productFamily?: string): DSOSegmentData[] {
  // Get invoices for the selected product (or all if no product specified)
  let relevantInvoices = invoicesData.filter((inv: any) => inv.amount_outstanding > 0);

  if (productFamily) {
    const productSubscriptions = subscriptionsData.filter(
      (sub: any) => sub.product_family === productFamily
    );
    const subscriptionIds = productSubscriptions.map((sub: any) => sub.subscription_id);
    relevantInvoices = relevantInvoices.filter((inv: any) =>
      subscriptionIds.includes(inv.subscription_id)
    );
  }

  // Group by segment and geography
  const segmentGeographyMap = new Map<string, any[]>();

  relevantInvoices.forEach((inv: any) => {
    const customerInfo = getCustomerInfo(inv.customer_id);
    if (!customerInfo) return;

    const segment = customerInfo.tier || 'Unknown';
    const geography = customerInfo.geography?.theater || 'Unknown';
    const invProductFamily = productFamily || getProductFamilyForInvoice(inv);

    const key = `${segment}|${geography}|${invProductFamily}`;

    if (!segmentGeographyMap.has(key)) {
      segmentGeographyMap.set(key, []);
    }
    segmentGeographyMap.get(key)!.push(inv);
  });

  // Calculate metrics for each segment/geography combination
  const segmentData: DSOSegmentData[] = [];

  segmentGeographyMap.forEach((invoices, key) => {
    const [segment, geography, prod] = key.split('|');

    const dsoValue = calculateDSO(invoices);
    const arBalance = invoices.reduce((sum, inv) => sum + inv.amount_outstanding, 0);
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const avgInvoiceValue = totalAmount / invoices.length;

    // Find primary aging bucket
    const aging = calculateAgingBuckets(invoices);
    const primaryBucket = Object.entries(aging).reduce((max, [bucket, amount]) =>
      amount > max[1] ? [bucket, amount] : max
    , ['current_0_30', 0])[0];

    // Count customers with delayed payments (>45 days)
    const delayedCustomers = new Set(
      invoices.filter(inv => inv.days_outstanding > 45).map(inv => inv.customer_id)
    ).size;

    segmentData.push({
      segment,
      geography,
      productFamily: prod,
      dsoValue,
      invoiceVolume: invoices.length,
      avgInvoiceValue: Math.round(avgInvoiceValue),
      primaryAgingBucket: primaryBucket.replace('aging_', '').replace('_', '-'),
      delayedCustomersCount: delayedCustomers,
      arBalance: Math.round(arBalance),
      status: getDSOStatus(dsoValue, 35),
    });
  });

  return segmentData.sort((a, b) => b.dsoValue - a.dsoValue);
}

/**
 * LEVEL 3: Transactional Invoice Detail & Action View
 * Returns individual invoice details for a specific segment/geography/product combination
 */
export function getLevel3InvoiceDetails(
  segment?: string,
  geography?: string,
  productFamily?: string
): DSOInvoiceDetail[] {
  // Filter invoices
  let relevantInvoices = invoicesData.filter((inv: any) => inv.amount_outstanding > 0);

  // Filter by product family
  if (productFamily) {
    const productSubscriptions = subscriptionsData.filter(
      (sub: any) => sub.product_family === productFamily
    );
    const subscriptionIds = productSubscriptions.map((sub: any) => sub.subscription_id);
    relevantInvoices = relevantInvoices.filter((inv: any) =>
      subscriptionIds.includes(inv.subscription_id)
    );
  }

  // Filter by segment and geography
  if (segment || geography) {
    relevantInvoices = relevantInvoices.filter((inv: any) => {
      const customerInfo = getCustomerInfo(inv.customer_id);
      if (!customerInfo) return false;

      const matchesSegment = !segment || customerInfo.tier === segment;
      const matchesGeography = !geography || customerInfo.geography?.theater === geography;

      return matchesSegment && matchesGeography;
    });
  }

  // Transform to invoice details
  const invoiceDetails: DSOInvoiceDetail[] = relevantInvoices.map((inv: any) => {
    const customerInfo = getCustomerInfo(inv.customer_id);
    const invProductFamily = getProductFamilyForInvoice(inv);

    // Determine collections status
    let collectionsStatus = 'Current';
    if (inv.days_outstanding > 90) {
      collectionsStatus = 'Escalated';
    } else if (inv.days_outstanding > 60) {
      collectionsStatus = 'Follow-up Pending';
    } else if (inv.days_outstanding > 30) {
      collectionsStatus = 'Reminder Sent';
    }

    // Mock assigned to (would come from CRM system)
    const assignedTo = inv.days_outstanding > 60 ? 'Collections Team' : 'AR Specialist';

    return {
      invoiceId: inv.invoice_id,
      invoiceNumber: inv.invoice_number,
      customerName: customerInfo?.name || 'Unknown Customer',
      customerId: inv.customer_id,
      daysOutstanding: inv.days_outstanding || 0,
      amount: inv.amount_outstanding || 0,
      agingBucket: inv.aging_bucket || 'current',
      paymentTerms: inv.payment_terms || 'Net 30',
      collectionsStatus,
      assignedTo,
      productFamily: invProductFamily,
      segment: customerInfo?.tier || 'Unknown',
      geography: customerInfo?.geography?.theater || 'Unknown',
      dueDate: inv.due_date,
      invoiceDate: inv.invoice_date,
      isDisputed: inv.is_disputed || false,
      disputeReason: inv.dispute_reason,
    };
  });

  // Sort by days outstanding (highest first)
  return invoiceDetails.sort((a, b) => b.daysOutstanding - a.daysOutstanding);
}

/**
 * Calculate overall DSO for KPI card
 */
export function getOverallDSO(): {
  value: number;
  target: number;
  trend: number;
  status: 'good' | 'warning' | 'critical';
} {
  const outstandingInvoices = invoicesData.filter((inv: any) => inv.amount_outstanding > 0);
  const dsoValue = calculateDSO(outstandingInvoices);
  const target = 35;

  // Calculate trend from accounts_receivable if available
  // For now, use mock trend
  const trend = -3; // Improving trend

  return {
    value: dsoValue,
    target,
    trend,
    status: getDSOStatus(dsoValue, target),
  };
}
