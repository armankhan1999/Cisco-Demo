/**
 * DUMMY DATA - FOR DEVELOPMENT ONLY
 * 
 * This file contains static dummy data for dropdown menus and initial UI population.
 * 
 * TO REMOVE: When integrating real data, simply delete this file and update imports
 * in components to use your actual data source/API.
 */

export type Persona = 'CSM' | 'CO' | 'SE';

// ============================================================================
// CSM (Customer Success Management) Dummy Data
// ============================================================================

export const csmDummyData = {
  accounts: [
    { id: 'CUST_000001', name: 'TechCorp Industries', tier: 'Enterprise', arr: 1522871, healthScore: 94 },
    { id: 'CUST_000002', name: 'MedSecure Systems', tier: 'Strategic', arr: 2145000, healthScore: 88 },
    { id: 'CUST_000003', name: 'Global Financial Partners', tier: 'Strategic', arr: 3669528, healthScore: 92 },
    { id: 'CUST_000004', name: 'Advanced Manufacturing Co', tier: 'Commercial', arr: 140615, healthScore: 85 },
    { id: 'CUST_000005', name: 'InnovateTech Solutions', tier: 'Enterprise', arr: 1004742, healthScore: 90 },
  ],
  
  products: [
    { id: 'PROD_001', name: 'Duo', category: 'Security', penetration: 94 },
    { id: 'PROD_002', name: 'Meraki', category: 'Networking', penetration: 72 },
    { id: 'PROD_003', name: 'Umbrella', category: 'Security', penetration: 48 },
    { id: 'PROD_004', name: 'ThousandEyes', category: 'Monitoring', penetration: 20 },
    { id: 'PROD_005', name: 'Splunk', category: 'Analytics', penetration: 8 },
  ],
  
  csms: [
    { id: 'CSM_001', name: 'Sarah Johnson', portfolio: 15, specialization: 'Enterprise' },
    { id: 'CSM_002', name: 'Michael Chen', portfolio: 22, specialization: 'Commercial' },
    { id: 'CSM_003', name: 'Emily Rodriguez', portfolio: 14, specialization: 'Strategic' },
  ],
  
  healthCategories: [
    { value: 'thriving', label: 'Thriving (90-100)', count: 20 },
    { value: 'healthy', label: 'Healthy (75-89)', count: 30 },
    { value: 'stable', label: 'Stable (60-74)', count: 0 },
    { value: 'at-risk', label: 'At Risk (40-59)', count: 0 },
    { value: 'critical', label: 'Critical (0-39)', count: 0 },
  ],
  
  timeRanges: [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '12m', label: 'Last 12 Months' },
    { value: 'custom', label: 'Custom Range' },
  ],
};

// ============================================================================
// CO (Commercial Operations) Dummy Data
// ============================================================================

export const coDummyData = {
  quotes: [
    { id: 'QUO_001', customer: 'TechCorp Industries', amount: 250000, status: 'accepted', date: '2025-09-15' },
    { id: 'QUO_002', customer: 'MedSecure Systems', amount: 180000, status: 'sent', date: '2025-09-20' },
    { id: 'QUO_003', customer: 'Global Financial Partners', amount: 420000, status: 'draft', date: '2025-09-25' },
    { id: 'QUO_004', customer: 'Advanced Manufacturing Co', amount: 95000, status: 'accepted', date: '2025-09-10' },
  ],
  
  orders: [
    { id: 'ORD_001', customer: 'TechCorp Industries', amount: 250000, status: 'fulfilled', date: '2025-09-16' },
    { id: 'ORD_002', customer: 'InnovateTech Solutions', amount: 175000, status: 'processing', date: '2025-09-22' },
    { id: 'ORD_003', customer: 'Global Financial Partners', amount: 320000, status: 'pending', date: '2025-09-28' },
  ],
  
  invoices: [
    { id: 'INV_001', customer: 'TechCorp Industries', amount: 250000, status: 'paid', dueDate: '2025-10-15' },
    { id: 'INV_002', customer: 'MedSecure Systems', amount: 180000, status: 'sent', dueDate: '2025-10-20' },
    { id: 'INV_003', customer: 'Advanced Manufacturing Co', amount: 95000, status: 'overdue', dueDate: '2025-09-30' },
  ],
  
  subscriptions: [
    { id: 'SUB_001', customer: 'TechCorp Industries', product: 'Duo', mrr: 12500, status: 'active' },
    { id: 'SUB_002', customer: 'MedSecure Systems', product: 'Umbrella', mrr: 8500, status: 'active' },
    { id: 'SUB_003', customer: 'Global Financial Partners', product: 'Meraki', mrr: 15000, status: 'active' },
    { id: 'SUB_004', customer: 'InnovateTech Solutions', product: 'ThousandEyes', mrr: 6500, status: 'pending_renewal' },
  ],
  
  revenueCategories: [
    { value: 'new', label: 'New Business', amount: 2800000 },
    { value: 'expansion', label: 'Expansion', amount: 5230000 },
    { value: 'renewal', label: 'Renewal', amount: 18500000 },
    { value: 'churn', label: 'Churn', amount: -14100 },
  ],
  
  fiscalPeriods: [
    { value: 'Q1-2025', label: 'Q1 2025' },
    { value: 'Q2-2025', label: 'Q2 2025' },
    { value: 'Q3-2025', label: 'Q3 2025' },
    { value: 'Q4-2025', label: 'Q4 2025' },
    { value: 'FY-2025', label: 'FY 2025' },
  ],
};

// ============================================================================
// SE (Sales Expansion) Dummy Data - NOW USING REAL DATA
// ============================================================================
// Note: Sales Expansion now uses real data from src/source_data/sales-expansion-data/
// This section is kept for backward compatibility with dropdown filters

export const seDummyData = {
  stages: [
    { value: 'identified', label: 'Identified', count: 0 },
    { value: 'qualified', label: 'Qualified', count: 0 },
    { value: 'proposed', label: 'Proposed', count: 0 },
    { value: 'negotiation', label: 'Negotiation', count: 0 },
    { value: 'closed-won', label: 'Closed-Won', count: 0 },
  ],
  expansionTypes: [
    { value: 'cross_sell', label: 'Cross-Sell', count: 0 },
    { value: 'upsell', label: 'Upsell', count: 0 },
    { value: 'capacity_expansion', label: 'Capacity Expansion', count: 0 },
    { value: 'bundle', label: 'Bundle', count: 0 },
  ],
  quarters: [
    { value: 'Q1-2025', label: 'Q1 2025' },
    { value: 'Q2-2025', label: 'Q2 2025' },
    { value: 'Q3-2025', label: 'Q3 2025' },
    { value: 'Q4-2025', label: 'Q4 2025' },
  ],
  competitors: [
    { name: 'Palo Alto Networks', marketShare: 15 },
    { name: 'Fortinet', marketShare: 12 },
    { name: 'Check Point', marketShare: 10 },
    { name: 'Zscaler', marketShare: 8 },
  ],
  // Real data is fetched from API routes - see /api/data/expansion-opportunities
  opportunities: [],
  triggers: [],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get dummy data for a specific persona
 */
export function getPersonaData(persona: Persona) {
  switch (persona) {
    case 'CSM':
      return csmDummyData;
    case 'CO':
      return coDummyData;
    case 'SE':
      return seDummyData;
    default:
      return csmDummyData;
  }
}

/**
 * Get persona display name
 */
export function getPersonaName(persona: Persona): string {
  const names = {
    CSM: 'Customer Success Management',
    CO: 'Commercial Operations',
    SE: 'Sales Expansion',
  };
  return names[persona];
}

/**
 * Get persona description
 */
export function getPersonaDescription(persona: Persona): string {
  const descriptions = {
    CSM: 'Monitor customer health, engagement, and product adoption',
    CO: 'Track quotes, orders, invoices, and revenue operations',
    SE: 'Identify expansion opportunities and manage sales pipeline',
  };
  return descriptions[persona];
}
