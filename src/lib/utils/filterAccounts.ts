import { FilterState, TimeRange } from '@/contexts/FilterContext';
import { getActiveSubscriptions, getAllLicenses } from '@/lib/data/csmDataLoader';

/**
 * Get date threshold based on time range filter
 */
function getDateThreshold(timeRange: TimeRange): Date | null {
  if (timeRange === 'all') return null;
  
  const now = new Date();
  const daysMap: Record<Exclude<TimeRange, 'all'>, number> = {
    '30d': 30,
    '60d': 60,
    '90d': 90
  };
  
  const days = daysMap[timeRange];
  const threshold = new Date(now);
  threshold.setDate(threshold.getDate() - days);
  return threshold;
}

interface Account {
  account: {
    id: string;
    name: string;
    tier: string;
    arr: number;
    csm_id: string;
    health_score: number;
    last_touch_date?: string;
  };
  timeline?: any[];
}

// Health category ranges
const healthRanges: Record<string, { min: number; max: number }> = {
  'Thriving': { min: 91, max: 100 },
  'Healthy': { min: 76, max: 90 },
  'Stable': { min: 61, max: 75 },
  'At Risk': { min: 46, max: 60 },
  'Critical': { min: 0, max: 45 }
};

/**
 * Filter accounts based on FilterState
 */
export function filterAccounts(accounts: Account[], filters: FilterState): Account[] {
  // Get subscriptions and licenses for product filtering
  const allSubscriptions = getActiveSubscriptions();
  const allLicenses = getAllLicenses();
  
  // Get time threshold for time range filtering
  const dateThreshold = getDateThreshold(filters.timeRange);
  
  return accounts.filter(acc => {
    // CSM Filter
    if (filters.csmId.length > 0 && !filters.csmId.includes(acc.account.csm_id)) {
      return false;
    }

    // Tier Filter
    if (filters.tier.length > 0 && !filters.tier.includes(acc.account.tier)) {
      return false;
    }

    // ARR Range Filter
    if (acc.account.arr < filters.arrRange[0] || acc.account.arr > filters.arrRange[1]) {
      return false;
    }

    // Health Category Filter
    if (filters.healthCategories.length > 0) {
      const matchesCategory = filters.healthCategories.some(category => {
        const range = healthRanges[category];
        return acc.account.health_score >= range.min && acc.account.health_score <= range.max;
      });
      if (!matchesCategory) {
        return false;
      }
    }

    // Product Filter
    if (filters.products.length > 0) {
      // Check if account has any subscriptions or licenses with the selected products
      const accountSubscriptions = allSubscriptions.filter(sub => sub.customer_id === acc.account.id);
      const accountLicenses = allLicenses.filter(lic => lic.customer_id === acc.account.id);
      
      const hasMatchingProduct = 
        accountSubscriptions.some(sub => filters.products.includes(sub.product_family)) ||
        accountLicenses.some(lic => filters.products.includes(lic.product_family));
      
      if (!hasMatchingProduct) {
        return false;
      }
    }

    // Note: Time Range Filter is NOT applied to account filtering
    // Time range affects the CALCULATION PERIOD for metrics (e.g., churn in last 30 days)
    // but does NOT filter which accounts are displayed
    // All accounts are shown regardless of time range selection

    return true;
  });
}

/**
 * Calculate portfolio metrics from filtered accounts
 */
export function calculatePortfolioMetrics(accounts: Account[]) {
  const totalAccounts = accounts.length;
  const totalARR = accounts.reduce((sum, acc) => sum + acc.account.arr, 0);
  const avgHealth = totalAccounts > 0 
    ? accounts.reduce((sum, acc) => sum + acc.account.health_score, 0) / totalAccounts 
    : 0;
  const atRiskCount = accounts.filter(acc => acc.account.health_score < 60).length;

  return {
    totalAccounts,
    totalARR,
    avgHealth,
    atRiskCount
  };
}
