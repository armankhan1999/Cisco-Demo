'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Filter, AlertTriangle, TrendingDown, Clock, Calendar } from 'lucide-react';
import { calculatePredictedChurnRisk, ChurnPrediction } from '@/lib/kpis/predictedChurnRisk';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';

export default function AtRiskAccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierFilter = searchParams.get('tier');
  
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>(tierFilter || 'All Tiers');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('12M');

  useEffect(() => {
    try {
      const riskData = calculatePredictedChurnRisk();
      const allAccounts = getActiveAccounts();
      
      // Combine account data with predictions
      const enrichedAccounts = riskData.predictions.map(pred => {
        const account = allAccounts.find(a => a.account.id === pred.account_id);
        return {
          ...pred,
          accountData: account?.account || null
        };
      }).filter(a => a.accountData);
      
      // Sort by days to churn (most urgent first)
      enrichedAccounts.sort((a, b) => a.estimated_days_to_churn - b.estimated_days_to_churn);
      
      setAccounts(enrichedAccounts);
      setFilteredAccounts(enrichedAccounts);
    } catch (error) {
      console.error('Error loading at-risk accounts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let filtered = [...accounts];
    
    // Filter by tier
    if (selectedTier !== 'All Tiers') {
      filtered = filtered.filter(a => a.accountData?.tier === selectedTier);
    }
    
    // Filter by risk level (updated thresholds - only meaningful risk)
    if (selectedRisk !== 'All') {
      if (selectedRisk === 'Critical') {
        filtered = filtered.filter(a => a.churn_probability >= 0.70);  // 70%+
      } else if (selectedRisk === 'High') {
        filtered = filtered.filter(a => a.churn_probability >= 0.50 && a.churn_probability < 0.70);  // 50-69%
      } else if (selectedRisk === 'Medium') {
        filtered = filtered.filter(a => a.churn_probability >= 0.40 && a.churn_probability < 0.50);  // 40-49%
      }
    }
    
    // Filter by timeline
    if (selectedTimeline === '3M') {
      filtered = filtered.filter(a => a.estimated_days_to_churn <= 90);
    } else if (selectedTimeline === '6M') {
      filtered = filtered.filter(a => a.estimated_days_to_churn <= 180);
    }
    
    setFilteredAccounts(filtered);
  }, [selectedTier, selectedRisk, selectedTimeline, accounts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading at-risk accounts...</div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getRiskBadge = (days: number) => {
    if (days <= 30) return { label: 'CRITICAL', bg: 'bg-red-600', text: 'text-white', icon: '🔴' };
    if (days <= 90) return { label: 'HIGH RISK', bg: 'bg-orange-500', text: 'text-white', icon: '⚠️' };
    if (days <= 180) return { label: 'MEDIUM RISK', bg: 'bg-yellow-500', text: 'text-white', icon: '📊' };
    return { label: 'LOW RISK', bg: 'bg-green-500', text: 'text-white', icon: '✅' };
  };

  const groupAccountsByUrgency = () => {
    const critical = filteredAccounts.filter(a => a.estimated_days_to_churn <= 30);
    const high = filteredAccounts.filter(a => a.estimated_days_to_churn > 30 && a.estimated_days_to_churn <= 90);
    const medium = filteredAccounts.filter(a => a.estimated_days_to_churn > 90 && a.estimated_days_to_churn <= 180);
    const low = filteredAccounts.filter(a => a.estimated_days_to_churn > 180);
    
    return { critical, high, medium, low };
  };

  const grouped = groupAccountsByUrgency();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <button
            onClick={() => router.push('/csm/kpi/predicted-churn-risk')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Churn Risk Overview</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              📋 At-Risk Accounts (Churn Probability &gt;40%)
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredAccounts.length} accounts with meaningful churn risk • Showing days until predicted churn
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto">
        
        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filter:</span>
            </div>
            
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Tiers</option>
              <option>Strategic</option>
              <option>Enterprise</option>
              <option>Commercial</option>
              <option>SMB</option>
            </select>
            
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Risk Levels</option>
              <option>Critical (70%+)</option>
              <option>High (50-69%)</option>
              <option>Medium (40-49%)</option>
            </select>
            
            <select
              value={selectedTimeline}
              onChange={(e) => setSelectedTimeline(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="3M">Timeline: 3 Months</option>
              <option value="6M">Timeline: 6 Months</option>
              <option value="12M">Timeline: 12 Months</option>
            </select>
            
            <div className="ml-auto text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredAccounts.length}</span> of {accounts.length} accounts
            </div>
          </div>
        </div>

        {/* Critical Accounts (≤30 days) */}
        {grouped.critical.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-t-xl shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  🔴 CRITICAL URGENCY - Next 30 Days
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">{grouped.critical.length}</div>
                  <div className="text-xs opacity-90">accounts</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-b-xl border-2 border-red-300 divide-y divide-gray-200 shadow-lg">
              {grouped.critical.map((account, idx) => (
                <div key={idx} className="p-6 hover:bg-red-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <button
                        onClick={() => router.push(`/csm/kpi/predicted-churn-risk/account/${account.account_id}`)}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600 hover:underline"
                      >
                        {account.account_name}
                      </button>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full font-medium">
                          {account.accountData?.tier}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">ARR:</span>
                          <span className="text-2xl font-bold text-red-600">{formatCurrency(account.arr_at_risk)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Risk:</span>
                          <span className="text-xl font-bold text-red-600">{(account.churn_probability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-red-700" />
                          <span className="text-sm text-red-900 font-bold">{account.estimated_days_to_churn} days to predicted churn</span>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 text-orange-700" />
                          <span className="text-sm text-orange-900 font-semibold">{account.days_to_renewal} days to renewal</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/csm/kpi/predicted-churn-risk/account/${account.account_id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    {account.risk_factors.slice(0, 3).map((factor: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          factor.severity === 'Critical' ? 'bg-red-200 text-red-900' :
                          factor.severity === 'High' ? 'bg-orange-200 text-orange-900' :
                          'bg-yellow-200 text-yellow-900'
                        }`}>
                          {factor.severity}
                        </span>
                        <span>{factor.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Risk Accounts (31-90 days) */}
        {grouped.high.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-t-xl shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  ⚠️ HIGH PRIORITY - Next 31-90 Days
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">{grouped.high.length}</div>
                  <div className="text-xs opacity-90">accounts</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-b-xl border-2 border-orange-300 divide-y divide-gray-200 shadow-lg">
              {grouped.high.slice(0, 5).map((account, idx) => (
                <div key={idx} className="p-5 hover:bg-orange-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <button
                        onClick={() => router.push(`/csm/kpi/predicted-churn-risk/account/${account.account_id}`)}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600 hover:underline"
                      >
                        {account.account_name}
                      </button>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{account.accountData?.tier}</span>
                        <span className="text-lg font-bold text-orange-600">{formatCurrency(account.arr_at_risk)}</span>
                        <span className="text-md font-bold text-orange-600">{(account.churn_probability * 100).toFixed(0)}% risk</span>
                        <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded">
                          <Clock className="w-3 h-3 text-orange-700" />
                          <span className="text-sm text-orange-900 font-semibold">{account.estimated_days_to_churn}d to churn</span>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                          <Calendar className="w-3 h-3 text-blue-700" />
                          <span className="text-sm text-blue-900">{account.days_to_renewal}d to renewal</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Top factors: {account.risk_factors.slice(0, 2).map((f: any) => f.factor).join(', ')}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/csm/kpi/predicted-churn-risk/account/${account.account_id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {grouped.high.length > 5 && (
                <div className="p-4 text-center">
                  <span className="text-sm text-gray-600">
                    {grouped.high.length - 5} more high-risk accounts...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medium Risk Accounts (91-180 days) */}
        {grouped.medium.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    📊 MEDIUM PRIORITY - Next 91-180 Days
                  </h3>
                  <p className="text-sm opacity-90 mt-1">Plan interventions this quarter</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{grouped.medium.length}</div>
                  <div className="text-xs opacity-90">accounts</div>
                  <div className="text-lg font-bold mt-1">{formatCurrency(grouped.medium.reduce((sum, a) => sum + a.arr_at_risk, 0))}</div>
                  <div className="text-xs opacity-90">at risk</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Low Risk Accounts (181-365 days) */}
        {grouped.low.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    📅 WATCH LIST - Next 181-365 Days
                  </h3>
                  <p className="text-sm opacity-90 mt-1">Monitor quarterly, no immediate action</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{grouped.low.length}</div>
                  <div className="text-xs opacity-90">accounts</div>
                  <div className="text-lg font-bold mt-1">{formatCurrency(grouped.low.reduce((sum, a) => sum + a.arr_at_risk, 0))}</div>
                  <div className="text-xs opacity-90">at risk</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/csm/kpi/predicted-churn-risk/alerts')}
            className="flex-1 bg-red-600 text-white rounded-xl p-4 hover:bg-red-700 transition-colors font-semibold"
          >
            View Champion Departure Alerts →
          </button>
          <button
            onClick={() => {
              const csv = filteredAccounts.map(a => 
                `${a.account_name},${a.accountData?.tier},${a.arr_at_risk},${a.churn_probability},${a.estimated_days_to_churn}`
              ).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'at-risk-accounts.csv';
              a.click();
            }}
            className="flex-1 bg-gray-600 text-white rounded-xl p-4 hover:bg-gray-700 transition-colors font-semibold"
          >
            Export Account List (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
