// Service to load and process account data from master data files
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import csmsData from '@/source_data/master-data/csms.json';

export interface Customer {
  customer_id: string;
  customer_name: string;
  tier: string;
  industry: string;
  arr: number;
  csm_id: string;
  story_type: string;
  is_hero_account: boolean;
  created_date: string;
  theater: string;
  region: string;
  country: string;
  city: string;
  timezone: string;
  user_count: number;
  product_count: number;
  last_updated: string;
}

export interface License {
  license_id: string;
  customer_id: string;
  product_family: string;
  license_count: number;
  utilization: number;
  adoption_stage: string;
  implementation_date: string;
  renewal_date: string;
  license_type: string;
  tier: string;
  unit_price: number;
  annual_value: number;
  billing_frequency: string;
}

export interface CSM {
  csm_id: string;
  name: string;
  expertise: string[];
  portfolio_size: number;
  specialization: string[];
  hire_date: string;
  performance_score: number;
}

export interface AccountDetail {
  id: string;
  name: string;
  tier: string;
  arr: string;
  health: number;
  csm: string;
  products: string[];
  licenses: Record<string, string>;
  renewalDate: string;
  industry: string;
  employees: number;
  location: string;
}

class AccountDataService {
  private customers: Customer[];
  private licenses: License[];
  private csms: CSM[];

  constructor() {
    this.customers = customersData as Customer[];
    this.licenses = licensesData as License[];
    this.csms = csmsData as CSM[];
  }

  /**
   * Get account details by customer name
   */
  getAccountByName(customerName: string): AccountDetail | null {
    const customer = this.customers.find(c => c.customer_name === customerName);
    if (!customer) return null;

    const customerLicenses = this.licenses.filter(l => l.customer_id === customer.customer_id);
    const csm = this.csms.find(c => c.csm_id === customer.csm_id);

    // Get unique products
    const products = [...new Set(customerLicenses.map(l => l.product_family))];

    // Build licenses object with utilization
    const licensesObj: Record<string, string> = {};
    customerLicenses.forEach(license => {
      const used = Math.round((license.license_count * license.utilization) / 100);
      licensesObj[license.product_family] = `${used}/${license.license_count}`;
    });

    // Calculate health score (simplified - based on utilization and adoption)
    const avgUtilization = customerLicenses.length > 0
      ? customerLicenses.reduce((sum, l) => sum + l.utilization, 0) / customerLicenses.length
      : 0;
    const health = Math.round(avgUtilization * 0.9); // Simplified health calculation

    // Get earliest renewal date
    const renewalDates = customerLicenses.map(l => new Date(l.renewal_date));
    const earliestRenewal = renewalDates.length > 0
      ? new Date(Math.min(...renewalDates.map(d => d.getTime())))
      : new Date();

    // Format location
    const location = customer.city && customer.country
      ? `${customer.city}, ${customer.country}`
      : customer.country || 'Unknown';

    return {
      id: customer.customer_id,
      name: customer.customer_name,
      tier: customer.tier,
      arr: `$${(customer.arr / 1000).toFixed(0)}K`,
      health,
      csm: csm?.name || 'Unknown',
      products,
      licenses: licensesObj,
      renewalDate: earliestRenewal.toISOString().split('T')[0],
      industry: customer.industry,
      employees: customer.user_count * 15, // Approximate employees from user count
      location
    };
  }

  /**
   * Get all customers
   */
  getAllCustomers(): Customer[] {
    return this.customers;
  }

  /**
   * Get customers by tier
   */
  getCustomersByTier(tier: string): Customer[] {
    return this.customers.filter(c => c.tier === tier);
  }

  /**
   * Get high utilization accounts (>85%)
   */
  getHighUtilizationAccounts(): Array<{customer: Customer, licenses: License[]}> {
    const highUtilAccounts: Array<{customer: Customer, licenses: License[]}> = [];
    
    this.customers.forEach(customer => {
      const customerLicenses = this.licenses.filter(
        l => l.customer_id === customer.customer_id && l.utilization >= 85
      );
      
      if (customerLicenses.length > 0) {
        highUtilAccounts.push({ customer, licenses: customerLicenses });
      }
    });

    return highUtilAccounts;
  }

  /**
   * Get expansion opportunities (customers with <3 products)
   */
  getExpansionOpportunities(): Customer[] {
    return this.customers.filter(c => c.product_count < 3);
  }
}

// Export singleton instance
export const accountDataService = new AccountDataService();
