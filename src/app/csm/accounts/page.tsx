'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import { getActiveAccounts, loadSubscriptions, loadUtilizationHistory } from '@/lib/data/csmDataLoader';
import { useSidebar } from '@/contexts/SidebarContext';

interface EnrichedAccountData {
  account: any;
  arr: number;
  healthScore: number;
  utilization: number;
  totalLicenses: number;
  licensesUsed: number;
  licensesAvailable: number;
  priorityScore: number;
  annualWasteCost: number;
  productCount: number;
  contractsCount: number;
  stakeholdersCount: number;
}

function AccountsPageContent() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter'); // 'all', 'at-risk', 'healthy'
  const tierFilter = searchParams.get('tier'); // Tier filter from churn analysis
  
  const [accounts, setAccounts] = useState<EnrichedAccountData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const accountsData = getActiveAccounts();
      const subscriptions = loadSubscriptions();
      const utilizationHistory = loadUtilizationHistory() as any[];
      
      // Load additional data files
      const contracts = require('@/source_data/master-data/contracts.json');
      const licenses = require('@/source_data/master-data/licenses.json');
      const stakeholders = require('@/source_data/master-data/stakeholders.json');
      
      // Deduplicate accounts first
      const seenIds = new Set<string>();
      const uniqueAccountsData = accountsData.filter(acc => {
        const accountId = acc.account.id;
        if (seenIds.has(accountId)) {
          return false;
        }
        seenIds.add(accountId);
        return true;
      });
      
      // Enrich each account with real data
      const enrichedAccounts: EnrichedAccountData[] = uniqueAccountsData.map(accountData => {
        const customerId = accountData.account.id;
        
        // Get subscription data
        const subscription = subscriptions.find(sub => sub.customer_id === customerId);
        
        // Get latest utilization data from utilization_history.json (SAME AS OTHER PAGES)
        // First, find the latest snapshot date globally
        const allSnapshots = utilizationHistory.map((d: any) => d.snapshot_date).sort();
        const latestDate = allSnapshots[allSnapshots.length - 1];
        
        // Get all products for this customer at the latest date
        const accountUtilization = utilizationHistory.filter(util => 
          util.customer_id === customerId && util.snapshot_date === latestDate
        );
        
        // Calculate totals from utilization_history.json (SAME METHOD AS LICENSE DETAILS PAGE)
        const totalLicenses = accountUtilization.reduce((sum: number, u: any) => sum + (u.total_licenses || 0), 0);
        const licensesUsed = accountUtilization.reduce((sum: number, u: any) => sum + (u.active_users || 0), 0);
        const licensesAvailable = totalLicenses - licensesUsed;
        
        // Calculate account-level utilization percentage (SAME AS OTHER PAGES)
        const utilizationPercentage = totalLicenses > 0 ? (licensesUsed / totalLicenses) * 100 : 0;
        
        // Count unique products from utilization data
        const productCount = new Set(accountUtilization.map((u: any) => u.product_family)).size;
        
        // Get contract count
        const accountContracts = contracts.filter((contract: any) => contract.customer_id === customerId);
        
        // Get stakeholders count
        const accountStakeholders = stakeholders.filter((stakeholder: any) => 
          stakeholder.customer_id === customerId || stakeholder.account_id === customerId
        );
        
        // Calculate priority score using REAL account-level utilization
        const healthScore = accountData.account.health_score || 0;
        const priorityScore = Math.round(healthScore * 0.7 + utilizationPercentage * 0.3);
        
        // Calculate annual waste cost using REAL available licenses
        const annualWasteCost = licensesAvailable * 100; // $100 per unused license per year
        
        return {
          account: accountData.account,
          arr: accountData.account.arr || 0,  // Use account-level ARR from accounts.json
          healthScore: healthScore,
          utilization: utilizationPercentage,  // Account-level utilization (all products)
          totalLicenses: totalLicenses,
          licensesUsed: licensesUsed,
          licensesAvailable: licensesAvailable,
          priorityScore: priorityScore,
          annualWasteCost: annualWasteCost,
          productCount: productCount,
          contractsCount: accountContracts.length,
          stakeholdersCount: accountStakeholders.length
        };
      });
      
      // Apply filters
      let filteredAccounts = enrichedAccounts;
      
      // Apply health filter
      if (filter === 'at-risk') {
        filteredAccounts = filteredAccounts.filter(acc => acc.healthScore < 60);
      } else if (filter === 'healthy') {
        filteredAccounts = filteredAccounts.filter(acc => acc.healthScore >= 75);
      }
      
      // Apply tier filter from URL (from churn analysis)
      if (tierFilter) {
        filteredAccounts = filteredAccounts.filter(acc => acc.account.tier === tierFilter);
      }
      
      setAccounts(filteredAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, tierFilter]);

  const getHealthColor = (score: number) => {
    if (score >= 75) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
    if (score >= 60) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
  };

  const getHealthLabel = (score: number) => {
    if (score >= 90) return '🌟 Thriving';
    if (score >= 75) return '✅ Healthy';
    if (score >= 60) return '⚠️ Stable';
    return '🚨 At Risk';
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine title and description
  let title = `All Accounts (${accounts.length})`;
  let description = 'Complete portfolio of active customer accounts';
  
  if (tierFilter) {
    title = `${tierFilter} Tier Accounts (${accounts.length})`;
    description = `Accounts in the ${tierFilter} tier`;
  } else if (filter === 'at-risk') {
    title = `At-Risk Accounts (${accounts.length})`;
    description = 'Accounts with health scores below 60 requiring immediate attention';
  } else if (filter === 'healthy') {
    title = `Healthy Accounts (${accounts.length})`;
    description = 'Accounts with health scores 75 and above';
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              ← Back to {tierFilter ? 'Churn Analysis' : 'Portfolio Dashboard'}
            </button>
            
            {tierFilter && (
              <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    <strong>Filtered by:</strong> {tierFilter} tier from Churn Analysis
                  </p>
                  <button
                    onClick={() => router.push('/csm/accounts')}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear filter
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-2">{description}</p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/csm/accounts?filter=all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !filter || filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All Accounts
                </button>
                <button
                  onClick={() => router.push('/csm/accounts?filter=healthy')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'healthy'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Healthy
                </button>
                <button
                  onClick={() => router.push('/csm/accounts?filter=at-risk')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'at-risk'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  At-Risk
                </button>
              </div>
            </div>
          </div>

          {/* Account Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accounts.map((acc) => {
              const healthColor = getHealthColor(acc.healthScore);
              return (
                <div
                  key={acc.account.id}
                  onClick={() => router.push(`/csm/accounts/${acc.account.id}`)}
                  className={`relative overflow-hidden rounded-xl border-2 ${
                    healthColor.border
                  } p-5 cursor-pointer transition-all hover:shadow-xl hover:scale-105`}
                  style={{ backgroundColor: '#F3F3F3' }}
                >
                  {/* Health Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      healthColor.badge
                    }`}>
                      {Math.ceil(acc.healthScore)}
                    </span>
                  </div>
                  
                  {/* Account Info */}
                  <div className="mb-4 pr-12">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                      {acc.account.name}
                    </h3>
                    <p className="text-sm text-gray-600">{acc.account.id}</p>
                  </div>
                  
                  {/* Health Status */}
                  <div className="mb-4">
                    <span className={`text-sm font-semibold ${
                      healthColor.text
                    }`}>
                      {getHealthLabel(acc.healthScore)}
                    </span>
                  </div>
                  
                  {/* Account Metrics */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tier:</span>
                      <span className="font-semibold text-gray-900">{acc.account.tier}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">ARR:</span>
                      <span className="font-bold text-green-700">{formatCurrency(acc.arr)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Utilization:</span>
                      <span className="font-semibold text-blue-700">{acc.utilization.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Priority Score:</span>
                      <span className="font-semibold text-orange-700">{acc.priorityScore}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Licenses:</span>
                      <span className="font-semibold text-gray-900">{acc.licensesUsed.toLocaleString()}/{acc.totalLicenses.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Annual Waste:</span>
                      <span className="font-semibold text-red-700">{formatCurrency(acc.annualWasteCost)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-semibold text-purple-700">{acc.productCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Contracts:</span>
                      <span className="font-semibold text-indigo-700">{acc.contractsCount}</span>
                    </div>
                  </div>
                  
                  {/* Click indicator */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    <span>View Details</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {accounts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No accounts found matching the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading accounts...</p>
          </div>
        </div>
      </div>
    }>
      <AccountsPageContent />
    </Suspense>
  );
}
