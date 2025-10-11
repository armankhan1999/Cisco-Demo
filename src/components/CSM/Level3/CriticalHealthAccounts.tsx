'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import { getCriticalHealthAccounts, CriticalAccount } from '@/lib/kpis/criticalHealthAccounts';

export function CriticalHealthAccounts() {
  const [accounts, setAccounts] = useState<CriticalAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getCriticalHealthAccounts();
      setAccounts(data.slice(0, 10)); // Top 10 most critical
    } catch (error) {
      console.error('Error loading critical accounts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading critical accounts...</div>
      </div>
    );
  }

  const formatARR = (arr: number) => {
    if (arr >= 1000000) return `$${(arr / 1000000).toFixed(1)}M`;
    if (arr >= 1000) return `$${(arr / 1000).toFixed(0)}K`;
    return `$${arr.toFixed(0)}`;
  };

  const getHealthColor = (health: number) => {
    if (health < 30) return 'bg-red-600';
    if (health < 38) return 'bg-red-500';
    return 'bg-orange-500';
  };

  const getActionStatusColor = (status: string) => {
    const styles = {
      'Not Started': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Scheduled': 'bg-green-100 text-green-700',
      'Completed': 'bg-gray-100 text-gray-500'
    };
    return styles[status as keyof typeof styles] || styles['Not Started'];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Critical Health Accounts
          </h2>
          <p className="text-sm text-gray-600 mt-1">Immediate action required (Health Score ≤ 45)</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-red-600">{accounts.length}</div>
          <div className="text-xs text-gray-500">Critical Accounts</div>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-green-600 text-lg font-medium">✓ No critical health accounts</div>
          <div className="text-sm text-gray-500 mt-2">All accounts above critical threshold</div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Account</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Health</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">ARR</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Primary Risk Factor</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Renewal</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">CSM</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Action Plan</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, idx) => (
                  <tr 
                    key={account.accountId}
                    className={`border-b border-gray-100 hover:bg-red-50 transition-colors ${
                      idx === accounts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{account.accountName}</div>
                      <div className="text-xs text-gray-500">{account.tier}</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center">
                        <div className={`${getHealthColor(account.healthScore)} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}>
                          <AlertTriangle className="w-3 h-3" />
                          {account.healthScore}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="font-semibold text-gray-900">{formatARR(account.arr)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">{account.primaryRiskFactor}</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`font-semibold ${
                          account.daysToRenewal < 60 ? 'text-red-600' : 
                          account.daysToRenewal < 90 ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {account.daysToRenewal}d
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-1 text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{account.csm}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getActionStatusColor(account.actionPlanStatus)}`}>
                        {account.actionPlanStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Immediate Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                🚨 Launch Save Campaign
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                📅 Schedule Executive Review
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                🤝 Assign Support Resources
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-1">Total At-Risk ARR</div>
                <div className="text-2xl font-bold text-red-900">
                  {formatARR(accounts.reduce((sum, a) => sum + a.arr, 0))}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-sm font-medium text-orange-700 mb-1">Urgent (Renewal &lt; 60d)</div>
                <div className="text-2xl font-bold text-orange-900">
                  {accounts.filter(a => a.daysToRenewal < 60).length}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-1">Action Plans Active</div>
                <div className="text-2xl font-bold text-blue-900">
                  {accounts.filter(a => a.actionPlanStatus === 'In Progress' || a.actionPlanStatus === 'Scheduled').length}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
