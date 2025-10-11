'use client';

import React, { useState, useEffect } from 'react';
import { calculateAccountUtilizationDetails, AccountUtilizationDetail } from '../../../lib/kpis/licenseUtilizationKPIs';

interface AccountUtilizationTableProps {
  utilizationBucket?: string;
  onAccountClick?: (customerId: string) => void;
}

export function AccountUtilizationTable({ utilizationBucket, onAccountClick }: AccountUtilizationTableProps) {
  const [accounts, setAccounts] = useState<AccountUtilizationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    try {
      const accountDetails = calculateAccountUtilizationDetails(utilizationBucket);
      setAccounts(accountDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error loading Account Utilization Details:', error);
      setLoading(false);
    }
  }, [utilizationBucket]);

  const getPriorityColor = (priorityScore: number) => {
    if (priorityScore >= 80) return 'bg-red-100 text-red-800';
    if (priorityScore >= 60) return 'bg-orange-100 text-orange-800';
    if (priorityScore >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getHealthColor = (healthScore: number) => {
    if (healthScore < 60) return 'bg-red-100 text-red-800';
    if (healthScore < 75) return 'bg-orange-100 text-orange-800';
    if (healthScore < 90) return 'bg-green-100 text-green-800';
    return 'bg-green-100 text-green-800';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 20) return 'bg-red-100 text-red-800';
    if (utilization < 40) return 'bg-orange-100 text-orange-800';
    if (utilization < 60) return 'bg-yellow-100 text-yellow-800';
    if (utilization < 80) return 'bg-green-100 text-green-800';
    return 'bg-green-100 text-green-800';
  };

  const getRenewalColor = (daysToRenewal: number) => {
    if (daysToRenewal < 30) return 'bg-red-100 text-red-800';
    if (daysToRenewal < 60) return 'bg-orange-100 text-orange-800';
    if (daysToRenewal < 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗';
      case 'decreasing': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string, momChange: number) => {
    if (trend === 'stable') return 'text-gray-600';
    return momChange > 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = accounts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {utilizationBucket ? `${utilizationBucket} Utilization Accounts` : 'All Accounts by Utilization'}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No accounts found for the selected criteria.
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-base font-semibold text-gray-600">Total Accounts</div>
              <div className="text-3xl font-bold text-gray-900">{accounts.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-base font-semibold text-gray-600">Total ARR</div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(accounts.reduce((sum, acc) => sum + acc.arr, 0))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-base font-semibold text-gray-600">Avg Utilization</div>
              <div className="text-3xl font-bold text-gray-900">
                {(accounts.reduce((sum, acc) => sum + acc.utilizationPercentage, 0) / accounts.length).toFixed(0)}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-base font-semibold text-gray-600">High Priority</div>
              <div className="text-3xl font-bold text-red-600">
                {accounts.filter(acc => acc.priorityScore >= 70).length}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Account</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Product</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Utilization</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Licenses</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Health</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">ARR</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Renewal</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAccounts.map((account, index) => (
                  <tr
                    key={account.customerId}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${onAccountClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onAccountClick?.(account.customerId)}
                    title={onAccountClick ? `Click to view ${account.customerName} details` : ''}
                  >
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(account.priorityScore)}`}>
                        {account.priorityScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{account.customerName}</div>
                        <div className="text-xs text-gray-500">{account.customerId}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {account.productFamily}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getUtilizationColor(account.utilizationPercentage)}`}>
                          {account.utilizationPercentage.toFixed(0)}%
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className={`text-sm ${getTrendColor(account.utilizationTrend, account.momChange)}`}>
                            {getTrendIcon(account.utilizationTrend)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {account.momChange >= 0 ? '+' : ''}{account.momChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-sm text-gray-900">
                      <div>{account.licensesUsed.toLocaleString()}/{account.totalLicenses.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {account.licensesAvailable.toLocaleString()} unused
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getHealthColor(account.healthScore)}`}>
                        {account.healthScore}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(account.arr)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="text-sm text-gray-900">
                        {account.daysToRenewal} days
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(account.renewalDate)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-gray-600 max-w-xs">
                        {account.recommendedAction}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, accounts.length)} of {accounts.length} accounts
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
