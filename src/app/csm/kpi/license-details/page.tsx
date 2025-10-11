'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { loadAccounts, loadUtilizationHistory } from '../../../../lib/data/csmDataLoader';
import { useSidebar } from '../../../../contexts/SidebarContext';

interface AccountLicenseData {
  customerId: string;
  accountName: string;
  tier: string;
  arr: number;
  totalLicenses: number;
  activeUsers: number;
  unusedLicenses: number;
  utilizationRate: number;
  products: ProductLicenseData[];
}

interface ProductLicenseData {
  productFamily: string;
  arr: number;
  totalLicenses: number;
  activeUsers: number;
  unusedLicenses: number;
  utilizationRate: number;
}

function LicenseDetailsPageContent() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const searchParams = useSearchParams();
  const focusType = searchParams.get('focus') || 'all'; // all, active, waste, range
  const utilizationRange = searchParams.get('range') || null; // e.g., "21-40%"
  
  const [accountsData, setAccountsData] = useState<AccountLicenseData[]>([]);
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'licenses' | 'utilization'>('licenses');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    try {
      const accounts = loadAccounts();
      const utilizationData = loadUtilizationHistory() as any[];
      
      // Get latest snapshot date
      const latestDate = utilizationData.map((d: any) => d.snapshot_date).sort().pop();
      const latestUtilization = utilizationData.filter((d: any) => d.snapshot_date === latestDate);
      
      // Group by account
      const accountMap = new Map<string, any[]>();
      latestUtilization.forEach((util: any) => {
        if (!accountMap.has(util.customer_id)) {
          accountMap.set(util.customer_id, []);
        }
        accountMap.get(util.customer_id)?.push(util);
      });
      
      const processedAccounts: AccountLicenseData[] = [];
      
      accountMap.forEach((products, customerId) => {
        const account = accounts.find((acc: any) => 
          acc.account?.id === customerId || acc.id === customerId
        );
        
        if (!account) return;
        
        const accountARR = account.account?.arr || account.arr || 0;
        const totalLicenses = products.reduce((sum, p) => sum + p.total_licenses, 0);
        const activeUsers = products.reduce((sum, p) => sum + p.active_users, 0);
        const unusedLicenses = totalLicenses - activeUsers;
        const utilizationRate = (activeUsers / totalLicenses) * 100;
        
        const productDetails: ProductLicenseData[] = products.map(p => {
          // Calculate product ARR proportionally based on licenses
          const productARR = totalLicenses > 0 ? (p.total_licenses / totalLicenses) * accountARR : 0;
          
          return {
            productFamily: p.product_family,
            arr: productARR,
            totalLicenses: p.total_licenses,
            activeUsers: p.active_users,
            unusedLicenses: p.total_licenses - p.active_users,
            utilizationRate: (p.active_users / p.total_licenses) * 100
          };
        });
        
        processedAccounts.push({
          customerId,
          accountName: account.account?.name || customerId,
          tier: account.account?.tier || 'Unknown',
          arr: accountARR,
          totalLicenses,
          activeUsers,
          unusedLicenses,
          utilizationRate,
          products: productDetails
        });
      });
      
      setAccountsData(processedAccounts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading license details:', error);
      setLoading(false);
    }
  }, []);

  const handleSort = (field: 'name' | 'licenses' | 'utilization') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter accounts by utilization range if specified
  const getUtilizationRangeBounds = (range: string): [number, number] | null => {
    if (range === '0-20%') return [0, 20];
    if (range === '21-40%') return [21, 40];
    if (range === '41-60%') return [41, 60];
    if (range === '61-80%') return [61, 80];
    if (range === '81-100%') return [81, 100];
    if (range === '>100%') return [100, Infinity];
    return null;
  };

  const filteredAccounts = utilizationRange 
    ? accountsData.filter(account => {
        const bounds = getUtilizationRangeBounds(utilizationRange);
        if (!bounds) return true;
        const [min, max] = bounds;
        return account.utilizationRate >= min && account.utilizationRate <= max;
      })
    : accountsData;

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.accountName.localeCompare(b.accountName);
        break;
      case 'licenses':
        comparison = a.totalLicenses - b.totalLicenses;
        break;
      case 'utilization':
        comparison = a.utilizationRate - b.utilizationRate;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleAccountExpand = (customerId: string) => {
    setExpandedAccount(expandedAccount === customerId ? null : customerId);
  };

  const getFocusTitle = () => {
    if (focusType === 'range' && utilizationRange) {
      return `Accounts in ${utilizationRange} Utilization Range`;
    }
    switch (focusType) {
      case 'active': return 'Active Users Breakdown';
      case 'waste': return 'Seat Waste Analysis';
      default: return 'License Allocation Details';
    }
  };

  const getFocusDescription = () => {
    if (focusType === 'range' && utilizationRange) {
      return `Detailed breakdown of accounts with ${utilizationRange} license utilization`;
    }
    switch (focusType) {
      case 'active': return 'Active users across all accounts and products';
      case 'waste': return 'Unused licenses and optimization opportunities';
      default: return 'Complete license inventory by account and product';
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 70) return 'text-blue-700 bg-blue-50';
    if (rate >= 50) return 'text-cyan-700 bg-cyan-50';
    return 'text-slate-700 bg-slate-50';
  };

  const getStatusInfo = (rate: number) => {
    if (rate >= 81) return { label: 'OPTIMAL', color: 'bg-green-100 text-green-800', icon: '🟢' };
    if (rate >= 61) return { label: 'HEALTHY', color: 'bg-blue-100 text-blue-800', icon: '🔵' };
    if (rate >= 41) return { label: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' };
    if (rate >= 21) return { label: 'HIGH RISK', color: 'bg-orange-100 text-orange-800', icon: '🟠' };
    return { label: 'CRITICAL', color: 'bg-red-100 text-red-800', icon: '🔴' };
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading license details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals based on filtered accounts
  const portfolioTotals = {
    arr: filteredAccounts.reduce((sum, acc) => sum + acc.arr, 0),
    totalLicenses: filteredAccounts.reduce((sum, acc) => sum + acc.totalLicenses, 0),
    activeUsers: filteredAccounts.reduce((sum, acc) => sum + acc.activeUsers, 0),
    unusedLicenses: filteredAccounts.reduce((sum, acc) => sum + acc.unusedLicenses, 0)
  };
  const portfolioUtilization = (portfolioTotals.activeUsers / portfolioTotals.totalLicenses) * 100;

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
            <h1 className="text-3xl font-bold text-gray-900">
              {getFocusTitle()}
            </h1>
            <p className="text-gray-600 mt-2">
              {getFocusDescription()}
            </p>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Total ARR</div>
              <div className="text-3xl font-bold text-green-700">${(portfolioTotals.arr / 1000000).toFixed(2)}M</div>
              <div className="text-sm text-gray-500 mt-2">Annual Recurring Revenue</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Licenses</div>
              <div className="text-3xl font-bold text-gray-900">{portfolioTotals.totalLicenses.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">Across {filteredAccounts.length} accounts</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Active Users</div>
              <div className="text-3xl font-bold text-blue-700">{portfolioTotals.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">{portfolioUtilization.toFixed(1)}% utilization</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Unused Licenses</div>
              <div className="text-3xl font-bold text-slate-700">{portfolioTotals.unusedLicenses.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">{(100 - portfolioUtilization).toFixed(1)}% waste</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Accounts</div>
              <div className="text-3xl font-bold text-gray-900">{filteredAccounts.length}</div>
              <div className="text-sm text-gray-500 mt-2">{utilizationRange ? `In ${utilizationRange} range` : 'With license data'}</div>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Account-Level Breakdown</h2>
              <p className="text-sm text-gray-600 mt-1">Click on any account to view product-level details</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-blue-600">
                        Account Name
                        {sortBy === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Tier
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      ARR
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      <button onClick={() => handleSort('licenses')} className="flex items-center gap-1 ml-auto hover:text-blue-600">
                        Total Licenses
                        {sortBy === 'licenses' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Active Users
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Unused
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      <button onClick={() => handleSort('utilization')} className="flex items-center gap-1 ml-auto hover:text-blue-600">
                        Utilization
                        {sortBy === 'utilization' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Products
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedAccounts.map((account) => (
                    <React.Fragment key={account.customerId}>
                      {/* Account Row */}
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggleAccountExpand(account.customerId)}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                              {expandedAccount === account.customerId ? '▼' : '▶'}
                            </span>
                            <div className="font-medium text-gray-900">{account.accountName}</div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {account.tier}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-green-700">
                          ${(account.arr / 1000).toFixed(0)}K
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-gray-900">
                          {account.totalLicenses.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-blue-700">
                          {account.activeUsers.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-slate-700">
                          {account.unusedLicenses.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getUtilizationColor(account.utilizationRate)}`}>
                            {account.utilizationRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${getStatusInfo(account.utilizationRate).color}`}>
                            <span>{getStatusInfo(account.utilizationRate).icon}</span>
                            {getStatusInfo(account.utilizationRate).label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500">
                          {account.products.length}
                        </td>
                      </tr>
                      
                      {/* Expanded Product Rows */}
                      {expandedAccount === account.customerId && (
                        <tr>
                          <td colSpan={9} className="bg-gray-50 px-4 py-4">
                            <div className="ml-8">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Product Breakdown</h4>
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                  <tr>
                                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-600">Product Family</th>
                                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">ARR</th>
                                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">Total Licenses</th>
                                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">Active Users</th>
                                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">Unused</th>
                                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-600">Utilization</th>
                                    <th className="py-2 px-3 text-center text-xs font-medium text-gray-600">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  {account.products.map((product, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="py-2 px-3 text-sm font-medium text-gray-900">{product.productFamily}</td>
                                      <td className="py-2 px-3 text-sm text-right text-green-700">${(product.arr / 1000).toFixed(0)}K</td>
                                      <td className="py-2 px-3 text-sm text-right text-gray-700">{product.totalLicenses.toLocaleString()}</td>
                                      <td className="py-2 px-3 text-sm text-right text-blue-700">{product.activeUsers.toLocaleString()}</td>
                                      <td className="py-2 px-3 text-sm text-right text-slate-700">{product.unusedLicenses.toLocaleString()}</td>
                                      <td className="py-2 px-3 text-sm text-right">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getUtilizationColor(product.utilizationRate)}`}>
                                          {product.utilizationRate.toFixed(1)}%
                                        </span>
                                      </td>
                                      <td className="py-2 px-3 text-sm text-center">
                                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${getStatusInfo(product.utilizationRate).color}`}>
                                          <span>{getStatusInfo(product.utilizationRate).icon}</span>
                                          {getStatusInfo(product.utilizationRate).label}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default function LicenseDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading license details...</p>
          </div>
        </div>
      </div>
    }>
      <LicenseDetailsPageContent />
    </Suspense>
  );
}
