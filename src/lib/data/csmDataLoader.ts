/**
 * CSM Data Loader
 * Loads and manages synthetic data from source_data folder for CSM dashboards
 */

import accountsData from '@/source_data/accounts.json';
import subscriptionsData from '@/source_data/commercial_operations/subscriptions.json';
import licensesData from '@/source_data/commercial_operations/licenses.json';
import revenueMovementsData from '@/source_data/commercial_operations/revenue_movements.json';
import qbrTrackingData from '@/source_data/csm-data/qbr_tracking.json';
import churnPredictionsData from '@/source_data/csm-data/churn_predictions.json';
import utilizationAlertsData from '@/source_data/commercial_operations/utilization_alerts.json';
import utilizationHistoryData from '@/source_data/commercial_operations/utilization_history.json';

export interface Account {
  account: {
    id: string;
    name: string;
    tier: string;
    arr: number;
    health_score: number;
    renewal_risk_score: number;
    csm_id: string;
    status?: string;
    last_touch_date?: string;
  };
  timeline?: Array<{
    month: number;
    health_score: number;
    usage_percentage: number;
    engagement_events?: any[];
  }>;
}

export interface Subscription {
  subscription_id: string;
  customer_id: string;
  product_family: string;
  subscription_status: string;
  arr: number;
  mrr: number;
  renewal_date: string;
  renewal_status: string;
  renewal_probability: number;
  churn_risk_score: number;
  subscription_start_date: string;
  subscription_end_date: string;
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
  utilization_trend: string;
}

export interface RevenueMovement {
  movement_id: string;
  customer_id: string;
  movement_type: 'expansion' | 'churn' | 'contraction';
  arr_change: number;
  effective_date: string;
  product_family: string;
  reason_code: string;
}

export interface QBRTracking {
  qbr_id: string;
  account_id: string;
  qbr_date: string;
  qbr_status: string;
  qbr_type: string;
}

export interface ChurnPrediction {
  prediction_id: string;
  account_id: string;
  account_name: string;
  churn_probability: number;
  estimated_days_to_churn: number;
  risk_factors: any[];
}

export interface UtilizationAlert {
  alert_id: string;
  customer_id: string;
  license_id: string;
  alert_type: string;
  alert_severity: string;
  alert_status: string;
  current_utilization: number;
  threshold_value: number;
  trigger_condition: string;
  alert_title: string;
  alert_description: string;
  recommended_action: string;
  alert_triggered_date: string;
  alert_acknowledged_date: string | null;
  alert_resolved_date: string | null;
  assigned_to: string;
  assigned_to_team: string;
  escalated: boolean;
  escalation_date: string | null;
  potential_arr_impact: number;
  customer_tier: string;
  action_taken: string;
  outcome: string;
  quote_generated: string | null;
  created_date: string;
  modified_date: string;
}

/**
 * CSM Data Store - Singleton pattern for data management
 */
class CSMDataStore {
  private static instance: CSMDataStore;
  
  public accounts: Account[];
  public subscriptions: Subscription[];
  public licenses: License[];
  public revenueMovements: RevenueMovement[];
  public qbrTracking: QBRTracking[];
  public churnPredictions: ChurnPrediction[];
  public utilizationAlerts: UtilizationAlert[];
  
  // Indexed data for fast lookups
  private accountsById: Map<string, Account>;
  private subscriptionsByCustomer: Map<string, Subscription[]>;
  private licensesByCustomer: Map<string, License[]>;
  private movementsByCustomer: Map<string, RevenueMovement[]>;
  private qbrByAccount: Map<string, QBRTracking[]>;
  
  private constructor() {
    // Load all data
    this.accounts = accountsData as Account[];
    this.subscriptions = subscriptionsData as Subscription[];
    this.licenses = licensesData as License[];
    this.revenueMovements = revenueMovementsData as RevenueMovement[];
    this.churnPredictions = churnPredictionsData as ChurnPrediction[];
    this.utilizationAlerts = utilizationAlertsData as UtilizationAlert[];
    
    // Fix QBR data structure - extract from nested qbr_history
    this.qbrTracking = [];
    (qbrTrackingData as any[]).forEach((period: any) => {
      if (period.qbr_history && Array.isArray(period.qbr_history)) {
        this.qbrTracking.push(...period.qbr_history.map((qbr: any) => ({
          qbr_id: qbr.qbr_id,
          account_id: qbr.account_id,
          qbr_date: qbr.qbr_date,
          qbr_status: qbr.status,
          qbr_type: qbr.generation_method || 'Manual'
        })));
      }
    });
    
    // Create indices for fast lookups
    this.accountsById = new Map();
    this.subscriptionsByCustomer = new Map();
    this.licensesByCustomer = new Map();
    this.movementsByCustomer = new Map();
    this.qbrByAccount = new Map();
    
    this.buildIndices();
    
    // Log data loading summary for debugging
    console.log('✅ CSM Data Loaded Successfully:');
    console.log(`  📊 Accounts: ${this.accounts.length}`);
    console.log(`  📈 Subscriptions: ${this.subscriptions.length}`);
    console.log(`  🔑 Licenses: ${this.licenses.length}`);
    console.log(`  💰 Revenue Movements: ${this.revenueMovements.length}`);
    console.log(`  📋 QBR Tracking: ${this.qbrTracking.length} (extracted from nested structure)`);
    console.log(`  ⚠️  Churn Predictions: ${this.churnPredictions.length}`);
    
    // Debug revenue movements
    const churnMovements = this.revenueMovements.filter(m => m.movement_type === 'churn');
    const expansionMovements = this.revenueMovements.filter(m => m.movement_type === 'expansion');
    const contractionMovements = this.revenueMovements.filter(m => m.movement_type === 'contraction');
    console.log(`  🔍 Revenue Movement Types:`);
    console.log(`     - Churn: ${churnMovements.length} movements`);
    console.log(`     - Expansion: ${expansionMovements.length} movements`);
    console.log(`     - Contraction: ${contractionMovements.length} movements`);
    
    if (churnMovements.length > 0) {
      const totalChurnedARR = churnMovements.reduce((sum, m) => sum + Math.abs(m.arr_change), 0);
      console.log(`     - Total Churned ARR: $${totalChurnedARR.toLocaleString()}`);
      console.log(`     - Churn Dates:`, churnMovements.map(m => m.effective_date));
    }
  }
  
  public static getInstance(): CSMDataStore {
    if (!CSMDataStore.instance) {
      CSMDataStore.instance = new CSMDataStore();
    }
    return CSMDataStore.instance;
  }
  
  private buildIndices(): void {
    // Index accounts by ID
    this.accounts.forEach(account => {
      this.accountsById.set(account.account.id, account);
    });
    
    // Index subscriptions by customer
    this.subscriptions.forEach(sub => {
      if (!this.subscriptionsByCustomer.has(sub.customer_id)) {
        this.subscriptionsByCustomer.set(sub.customer_id, []);
      }
      this.subscriptionsByCustomer.get(sub.customer_id)!.push(sub);
    });
    
    // Index licenses by customer
    this.licenses.forEach(license => {
      if (!this.licensesByCustomer.has(license.customer_id)) {
        this.licensesByCustomer.set(license.customer_id, []);
      }
      this.licensesByCustomer.get(license.customer_id)!.push(license);
    });
    
    // Index revenue movements by customer
    this.revenueMovements.forEach(movement => {
      if (!this.movementsByCustomer.has(movement.customer_id)) {
        this.movementsByCustomer.set(movement.customer_id, []);
      }
      this.movementsByCustomer.get(movement.customer_id)!.push(movement);
    });
    
    // Index QBRs by account
    this.qbrTracking.forEach(qbr => {
      if (!this.qbrByAccount.has(qbr.account_id)) {
        this.qbrByAccount.set(qbr.account_id, []);
      }
      this.qbrByAccount.get(qbr.account_id)!.push(qbr);
    });
  }
  
  // Getter methods for indexed data
  public getAccountById(id: string): Account | undefined {
    return this.accountsById.get(id);
  }
  
  public getSubscriptionsByCustomer(customerId: string): Subscription[] {
    return this.subscriptionsByCustomer.get(customerId) || [];
  }
  
  public getLicensesByCustomer(customerId: string): License[] {
    return this.licensesByCustomer.get(customerId) || [];
  }
  
  public getMovementsByCustomer(customerId: string): RevenueMovement[] {
    return this.movementsByCustomer.get(customerId) || [];
  }
  
  public getQBRByAccount(accountId: string): QBRTracking[] {
    return this.qbrByAccount.get(accountId) || [];
  }
  
  // Filter methods
  public getActiveAccounts(): Account[] {
    return this.accounts.filter(a => 
      a.account.arr > 0 && 
      (!a.account.status || a.account.status === 'Active')
    );
  }
  
  public getActiveSubscriptions(): Subscription[] {
    return this.subscriptions.filter(s => s.subscription_status === 'active');
  }
  
  public getOpenAlerts(): UtilizationAlert[] {
    return this.utilizationAlerts.filter(a => a.alert_status === 'open');
  }
}

// Export singleton instance
export const csmData = CSMDataStore.getInstance();

// Export convenience functions
export function loadCSMData() {
  return csmData;
}

export function getActiveAccounts(): Account[] {
  return csmData.getActiveAccounts();
}

export function getActiveSubscriptions(): Subscription[] {
  return csmData.getActiveSubscriptions();
}

export function getAllSubscriptions(): Subscription[] {
  return csmData.subscriptions;
}

export function loadUtilizationHistory() {
  return utilizationHistoryData;
}

export function loadLicenses() {
  return licensesData;
}

export function loadAccounts() {
  return accountsData;
}

export function loadSubscriptions() {
  return subscriptionsData;
}

export function getAllLicenses(): License[] {
  return csmData.licenses;
}

export function getAllRevenueMovements(): RevenueMovement[] {
  return csmData.revenueMovements;
}

export function getAllQBRTracking(): QBRTracking[] {
  return csmData.qbrTracking;
}

export function getAllChurnPredictions(): ChurnPrediction[] {
  return csmData.churnPredictions;
}

export function getAllUtilizationAlerts(): UtilizationAlert[] {
  return csmData.utilizationAlerts;
}

