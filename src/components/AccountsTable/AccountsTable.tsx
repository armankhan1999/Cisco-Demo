'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  tier: string;
  arr: number;
  health_score: number;
}

interface AccountsTableProps {
  accounts: Account[];
  title?: string;
  maxRows?: number;
  healthFilter?: { min: number; max: number };
}

export function AccountsTable({ accounts, title = "Accounts", maxRows, healthFilter }: AccountsTableProps) {
  const router = useRouter();

  // Filter accounts by health score if filter is provided
  let filteredAccounts = accounts;
  if (healthFilter) {
    filteredAccounts = accounts.filter(
      acc => acc.health_score >= healthFilter.min && acc.health_score < healthFilter.max
    );
  }

  // Limit rows if maxRows is specified
  const displayAccounts = maxRows ? filteredAccounts.slice(0, maxRows) : filteredAccounts;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 45) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getHealthCategory = (score: number) => {
    if (score >= 90) return 'Thriving';
    if (score >= 75) return 'Healthy';
    if (score >= 60) return 'Stable';
    if (score >= 45) return 'At Risk';
    return 'Critical';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Strategic': return 'bg-purple-100 text-purple-800';
      case 'Enterprise': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-green-100 text-green-800';
      case 'SMB': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccountClick = (accountId: string) => {
    router.push(`/account/${accountId}`);
  };

  if (displayAccounts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-center py-8">No accounts found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-600">
          {displayAccounts.length} {displayAccounts.length === 1 ? 'account' : 'accounts'}
          {maxRows && filteredAccounts.length > maxRows && (
            <span className="ml-1">(showing {maxRows} of {filteredAccounts.length})</span>
          )}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Account Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tier</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">ARR</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Health Score</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayAccounts.map((account) => (
              <tr 
                key={account.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleAccountClick(account.id)}
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {account.name}
                  </div>
                  <div className="text-xs text-gray-500">{account.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getTierColor(account.tier)}`}>
                    {account.tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  {formatCurrency(account.arr)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getHealthColor(account.health_score)}`}>
                    {account.health_score}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-medium ${getHealthColor(account.health_score)}`}>
                    {getHealthCategory(account.health_score)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccountClick(account.id);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View account details"
                  >
                    <ExternalLink className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {maxRows && filteredAccounts.length > maxRows && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => router.push('/csm/accounts')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View all {filteredAccounts.length} accounts →
          </button>
        </div>
      )}
    </div>
  );
}
