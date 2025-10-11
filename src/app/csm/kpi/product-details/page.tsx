'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { loadAccounts, loadUtilizationHistory } from '../../../../lib/data/csmDataLoader';
import { useSidebar } from '../../../../contexts/SidebarContext';

interface ProductDistribution {
  category: string;
  accounts: number;
  arr: number;
  totalLicenses: number;
  activeUsers: number;
  utilizationRate: number;
  healthScore: number;
}

interface AccountProductData {
  customerId: string;
  accountName: string;
  tier: string;
  region: string;
  arr: number;
  totalLicenses: number;
  activeUsers: number;
  unutilizedLicenses: number;
  utilizationRate: number;
  healthScore: number;
}

function ProductDetailsPageContent() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const searchParams = useSearchParams();
  const productFamily = searchParams.get('product') || 'Unknown';
  
  const [tierDistribution, setTierDistribution] = useState<ProductDistribution[]>([]);
  const [regionDistribution, setRegionDistribution] = useState<ProductDistribution[]>([]);
  const [accountsData, setAccountsData] = useState<AccountProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const accounts = loadAccounts();
      const utilizationData = loadUtilizationHistory() as any[];
      
      // Get latest snapshot
      const latestDate = utilizationData.map((d: any) => d.snapshot_date).sort().pop();
      const latestUtilization = utilizationData.filter((d: any) => d.snapshot_date === latestDate);
      
      // Filter for specific product
      const productUtilization = latestUtilization.filter((u: any) => u.product_family === productFamily);
      
      // Build account data for this product
      const accountProductMap = new Map<string, any>();
      productUtilization.forEach((util: any) => {
        accountProductMap.set(util.customer_id, util);
      });
      
      const processedAccounts: AccountProductData[] = [];
      const tierMap = new Map<string, ProductDistribution>();
      const regionMap = new Map<string, ProductDistribution>();
      
      accountProductMap.forEach((util, customerId) => {
        const account = accounts.find((acc: any) => 
          acc.account?.id === customerId || acc.id === customerId
        );
        
        if (!account) return;
        
        const accountARR = account.account?.arr || account.arr || 0;
        const tier = account.account?.tier || 'Unknown';
        const region = account.account?.geography?.region || 'Unknown';
        const healthScore = account.account?.health_score || account.health_score || 0;
        
        const totalLicenses = util.total_licenses;
        const activeUsers = util.active_users;
        const unutilizedLicenses = totalLicenses - activeUsers;
        const utilizationRate = (activeUsers / totalLicenses) * 100;
        
        // Add to accounts data
        processedAccounts.push({
          customerId,
          accountName: account.account?.name || customerId,
          tier,
          region,
          arr: accountARR,
          totalLicenses,
          activeUsers,
          unutilizedLicenses,
          utilizationRate,
          healthScore
        });
        
        // Aggregate by tier
        if (!tierMap.has(tier)) {
          tierMap.set(tier, {
            category: tier,
            accounts: 0,
            arr: 0,
            totalLicenses: 0,
            activeUsers: 0,
            utilizationRate: 0,
            healthScore: 0
          });
        }
        const tierData = tierMap.get(tier)!;
        tierData.accounts += 1;
        tierData.arr += accountARR;
        tierData.totalLicenses += totalLicenses;
        tierData.activeUsers += activeUsers;
        
        // Aggregate by region
        if (!regionMap.has(region)) {
          regionMap.set(region, {
            category: region,
            accounts: 0,
            arr: 0,
            totalLicenses: 0,
            activeUsers: 0,
            utilizationRate: 0,
            healthScore: 0
          });
        }
        const regionData = regionMap.get(region)!;
        regionData.accounts += 1;
        regionData.arr += accountARR;
        regionData.totalLicenses += totalLicenses;
        regionData.activeUsers += activeUsers;
      });
      
      // Calculate averages
      tierMap.forEach((data) => {
        data.utilizationRate = (data.activeUsers / data.totalLicenses) * 100;
        const tierAccounts = processedAccounts.filter(a => a.tier === data.category);
        data.healthScore = tierAccounts.reduce((sum, a) => sum + a.healthScore, 0) / tierAccounts.length;
      });
      
      regionMap.forEach((data) => {
        data.utilizationRate = (data.activeUsers / data.totalLicenses) * 100;
        const regionAccounts = processedAccounts.filter(a => a.region === data.category);
        data.healthScore = regionAccounts.reduce((sum, a) => sum + a.healthScore, 0) / regionAccounts.length;
      });
      
      setTierDistribution(Array.from(tierMap.values()).sort((a, b) => b.arr - a.arr));
      setRegionDistribution(Array.from(regionMap.values()).sort((a, b) => b.arr - a.arr));
      setAccountsData(processedAccounts.sort((a, b) => b.arr - a.arr));
      setLoading(false);
    } catch (error) {
      console.error('Error loading product details:', error);
      setLoading(false);
    }
  }, [productFamily]);

  const getProductIcon = (product: string) => {
    switch (product) {
      case 'Meraki': return '🌐';
      case 'Duo': return '🔐';
      case 'Umbrella': return '☁️';
      case 'ThousandEyes': return '👁️';
      case 'Splunk': return '📊';
      default: return '📦';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50';
    if (score >= 60) return 'text-blue-700 bg-blue-50';
    if (score >= 40) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 70) return 'text-blue-700 bg-blue-50';
    if (rate >= 50) return 'text-cyan-700 bg-cyan-50';
    return 'text-slate-700 bg-slate-50';
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  const totals = {
    accounts: accountsData.length,
    arr: accountsData.reduce((sum, a) => sum + a.arr, 0),
    totalLicenses: accountsData.reduce((sum, a) => sum + a.totalLicenses, 0),
    activeUsers: accountsData.reduce((sum, a) => sum + a.activeUsers, 0),
    avgHealthScore: accountsData.reduce((sum, a) => sum + a.healthScore, 0) / accountsData.length
  };
  const avgUtilization = (totals.activeUsers / totals.totalLicenses) * 100;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 mb-3 flex items-center text-sm font-medium transition-colors"
            >
              ← Back to Portfolio Utilization
            </button>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{getProductIcon(productFamily)}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {productFamily} Product Analytics
                </h1>
                <p className="text-gray-600 mt-2">
                  Detailed performance metrics and distribution analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Accounts</div>
              <div className="text-3xl font-bold text-gray-900">{totals.accounts}</div>
              <div className="text-sm text-gray-500 mt-2">Using this product</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Product ARR</div>
              <div className="text-3xl font-bold text-green-700">${(totals.arr / 1000000).toFixed(2)}M</div>
              <div className="text-sm text-gray-500 mt-2">Annual revenue</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Licenses</div>
              <div className="text-3xl font-bold text-gray-900">{totals.totalLicenses.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">Deployed seats</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Avg Utilization</div>
              <div className="text-3xl font-bold text-blue-700">{avgUtilization.toFixed(1)}%</div>
              <div className="text-sm text-gray-500 mt-2">{totals.activeUsers.toLocaleString()} active users</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Avg Health Score</div>
              <div className="text-3xl font-bold text-gray-900">{totals.avgHealthScore.toFixed(0)}</div>
              <div className="text-sm text-gray-500 mt-2">Portfolio average</div>
            </div>
          </div>

          {/* Distribution by Tier */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Distribution by Account Tier</h2>
              <p className="text-sm text-gray-600 mt-1">Performance breakdown by customer segment</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tier</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Accounts</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">ARR</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Licenses</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Active Users</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Utilization</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tierDistribution.map((tier) => (
                    <tr key={tier.category} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {tier.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {tier.accounts}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-green-700">
                        ${(tier.arr / 1000).toFixed(0)}K
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {tier.totalLicenses.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-blue-700">
                        {tier.activeUsers.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getUtilizationColor(tier.utilizationRate)}`}>
                          {tier.utilizationRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getHealthScoreColor(tier.healthScore)}`}>
                          {tier.healthScore.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Distribution by Region */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Distribution by Region</h2>
              <p className="text-sm text-gray-600 mt-1">Geographic performance analysis</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Region</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Accounts</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">ARR</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Licenses</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Active Users</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Utilization</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {regionDistribution.map((region) => (
                    <tr key={region.category} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {region.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {region.accounts}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-green-700">
                        ${(region.arr / 1000).toFixed(0)}K
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {region.totalLicenses.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-blue-700">
                        {region.activeUsers.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getUtilizationColor(region.utilizationRate)}`}>
                          {region.utilizationRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getHealthScoreColor(region.healthScore)}`}>
                          {region.healthScore.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Accounts Using This Product */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Account-Level Details</h2>
              <p className="text-sm text-gray-600 mt-1">All accounts using {productFamily}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Account</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Tier</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Region</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">ARR</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Licenses</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Active</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Unused</th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Utilization</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {accountsData.map((account) => (
                    <tr 
                      key={account.customerId}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/csm/accounts/${account.customerId}`)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {account.accountName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {account.tier}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-600">
                        {account.region}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-green-700">
                        ${(account.arr / 1000).toFixed(0)}K
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                        {account.totalLicenses.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-blue-700">
                        {account.activeUsers.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-slate-700">
                        {account.unutilizedLicenses.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getUtilizationColor(account.utilizationRate)}`}>
                          {account.utilizationRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getHealthScoreColor(account.healthScore)}`}>
                          {account.healthScore.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    }>
      <ProductDetailsPageContent />
    </Suspense>
  );
}
