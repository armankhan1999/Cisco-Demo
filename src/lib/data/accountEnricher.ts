// Account Data Enricher - Creates 360-degree view by joining multiple data sources
import accountsData from '@/source_data/accounts.json';
import licensesData from '@/source_data/master-data/licenses.json';
import usersData from '@/source_data/master-data/users.json';
import stakeholdersData from '@/source_data/master-data/stakeholders.json';
import contractsData from '@/source_data/master-data/contracts.json';

export interface EnrichedAccount {
  account: any;
  products: any[];
  users: any[];
  stakeholders: any[];
  contracts: any[];
  metrics: {
    totalLicenses: number;
    activeUsers: number;
    avgUtilization: number;
    totalARR: number;
    keyStakeholders: number;
  };
}

/**
 * Enriches a single account with products, users, stakeholders, and contracts
 */
export function enrichAccount(accountId: string): EnrichedAccount | null {
  // Find base account
  const account = (accountsData as any[]).find((acc: any) => 
    acc.account?.id === accountId || acc.id === accountId
  );
  
  if (!account) return null;
  
  const customerId = account.account?.id || account.id;
  
  // Join products/licenses
  const products = (licensesData as any[]).filter(
    (license: any) => license.customer_id === customerId
  );
  
  // Join users
  const users = (usersData as any[]).filter(
    (user: any) => user.account_id === customerId || user.customer_id === customerId
  );
  
  // Join stakeholders
  const stakeholders = (stakeholdersData as any[]).filter(
    (stakeholder: any) => stakeholder.customer_id === customerId
  );
  
  // Join contracts
  const contracts = (contractsData as any[]).filter(
    (contract: any) => contract.customer_id === customerId
  );
  
  // Calculate metrics
  const totalLicenses = products.reduce((sum, p) => sum + (p.license_count || 0), 0);
  const activeUsers = users.filter((u: any) => {
    if (!u.last_login) return false;
    const lastLogin = new Date(u.last_login);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastLogin >= thirtyDaysAgo;
  }).length;
  
  const avgUtilization = products.length > 0
    ? products.reduce((sum, p) => sum + (p.utilization || 0), 0) / products.length
    : 0;
  
  const totalARR = products.reduce((sum, p) => sum + (p.annual_value || 0), 0);
  
  const keyStakeholders = stakeholders.filter(
    (s: any) => s.influence_level === 'High' || s.champion_strength === 'Strong'
  ).length;
  
  return {
    account,
    products,
    users,
    stakeholders,
    contracts,
    metrics: {
      totalLicenses,
      activeUsers,
      avgUtilization: Math.round(avgUtilization),
      totalARR,
      keyStakeholders
    }
  };
}

/**
 * Get all enriched accounts
 */
export function getAllEnrichedAccounts(): EnrichedAccount[] {
  const accounts = accountsData as any[];
  return accounts
    .map(acc => {
      const id = acc.account?.id || acc.id;
      return enrichAccount(id);
    })
    .filter(Boolean) as EnrichedAccount[];
}

/**
 * Get product adoption summary for an account
 */
export function getProductAdoption(accountId: string) {
  const enriched = enrichAccount(accountId);
  if (!enriched) return null;
  
  const productSummary = enriched.products.map(product => ({
    family: product.product_family,
    licenses: product.license_count,
    utilization: product.utilization,
    adoptionStage: product.adoption_stage,
    trend: product.utilization_trend,
    implementationDate: product.implementation_date,
    renewalDate: product.renewal_date,
    annualValue: product.annual_value
  }));
  
  return {
    products: productSummary,
    totalProducts: productSummary.length,
    avgUtilization: enriched.metrics.avgUtilization,
    totalValue: enriched.metrics.totalARR
  };
}

/**
 * Get user activity summary for an account
 */
export function getUserActivity(accountId: string) {
  const enriched = enrichAccount(accountId);
  if (!enriched) return null;
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const mau = enriched.users.filter(u => {
    if (!u.last_login) return false;
    return new Date(u.last_login) >= thirtyDaysAgo;
  }).length;
  
  const wau = enriched.users.filter(u => {
    if (!u.last_login) return false;
    return new Date(u.last_login) >= sevenDaysAgo;
  }).length;
  
  const dau = enriched.users.filter(u => {
    if (!u.last_login) return false;
    const lastLogin = new Date(u.last_login);
    return lastLogin.toDateString() === now.toDateString();
  }).length;
  
  const activityBreakdown = {
    High: enriched.users.filter(u => u.activity_level === 'High').length,
    Medium: enriched.users.filter(u => u.activity_level === 'Medium').length,
    Low: enriched.users.filter(u => u.activity_level === 'Low').length
  };
  
  return {
    totalUsers: enriched.users.length,
    mau,
    wau,
    dau,
    activityBreakdown,
    utilizationRate: enriched.users.length > 0 
      ? Math.round((mau / enriched.users.length) * 100) 
      : 0
  };
}

/**
 * Get stakeholder engagement summary
 */
export function getStakeholderEngagement(accountId: string) {
  const enriched = enrichAccount(accountId);
  if (!enriched) return null;
  
  const champions = enriched.stakeholders.filter(
    s => s.champion_strength === 'Strong' || s.champion_strength === 'Very Strong'
  );
  
  const influenceLevels = {
    High: enriched.stakeholders.filter(s => s.influence_level === 'High').length,
    Medium: enriched.stakeholders.filter(s => s.influence_level === 'Medium').length,
    Low: enriched.stakeholders.filter(s => s.influence_level === 'Low').length
  };
  
  const avgEngagement = enriched.stakeholders.length > 0
    ? enriched.stakeholders.reduce((sum, s) => sum + (s.engagement_score || 0), 0) / enriched.stakeholders.length
    : 0;
  
  return {
    totalStakeholders: enriched.stakeholders.length,
    champions: champions.length,
    influenceLevels,
    avgEngagementScore: Math.round(avgEngagement * 10) / 10,
    keyContacts: enriched.stakeholders
      .filter(s => s.influence_level === 'High' || s.champion_strength === 'Strong')
      .map(s => ({
        name: s.name,
        role: s.role,
        email: s.email,
        influenceLevel: s.influence_level,
        championStrength: s.champion_strength,
        engagementScore: s.engagement_score
      }))
  };
}
