'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import CSMKPIWrapper from '@/components/CSM/CSMKPIWrapper';
import { calculateChurnRate, calculatePredictedChurnRiskKPI } from '@/lib/kpis/csmKPICalculations';
import { calculatePredictedChurnRisk } from '@/lib/kpis/predictedChurnRisk';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';

export default function PredictedChurnRiskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [historicalChurn, setHistoricalChurn] = useState<any>(null);
  const [predictedRisk, setPredictedRisk] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [segmentData, setSegmentData] = useState<any[]>([]);

  useEffect(() => {
    try {
      const historical = calculateChurnRate();
      const predicted = calculatePredictedChurnRiskKPI();
      const fullRiskData = calculatePredictedChurnRisk();
      
      // Calculate segment breakdown
      const allAccounts = getActiveAccounts();
      const predictions = fullRiskData.predictions;
      
      // Group by tier
      const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
      const segments = tiers.map(tier => {
        const tierAccounts = allAccounts.filter(a => a.account.tier === tier);
        const tierPredictions = predictions.filter(p => {
          const acc = allAccounts.find(a => a.account.id === p.account_id);
          return acc?.account.tier === tier;
        });
        
        const totalARR = tierAccounts.reduce((sum, a) => sum + a.account.arr, 0);
        const atRiskARR = tierPredictions.reduce((sum, p) => sum + p.arr_at_risk, 0);
        const riskPercent = totalARR > 0 ? (atRiskARR / totalARR) * 100 : 0;
        
        // Average churn probability
        const avgProb = tierPredictions.length > 0 
          ? tierPredictions.reduce((sum, p) => sum + p.churn_probability, 0) / tierPredictions.length
          : 0;
        
        return {
          tier,
          totalARR,
          atRiskARR,
          riskPercent,
          totalAccounts: tierAccounts.length,
          atRiskAccounts: tierPredictions.length,
          avgChurnProbability: avgProb,
          churnProbTier: avgProb >= 0.5 ? 'High' : avgProb >= 0.4 ? 'Medium' : 'Low'
        };
      });
      
      setHistoricalChurn(historical);
      setPredictedRisk(predicted);
      setRiskData(fullRiskData);
      setSegmentData(segments);
    } catch (error) {
      console.error('Error loading churn risk data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading churn risk analysis...</div>
      </div>
    );
  }

  if (!historicalChurn || !predictedRisk || !riskData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error loading data</div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getTierIcon = (tier: string) => {
    const icons: Record<string, string> = {
      Strategic: '🏆',
      Enterprise: '🏢',
      Commercial: '🏪',
      SMB: '🏬'
    };
    return icons[tier] || '📊';
  };

  const handleAccountClick = (tier: string) => {
    router.push(`/csm/kpi/predicted-churn-risk/at-risk-accounts?tier=${tier}&referrer=${encodeURIComponent(window.location.pathname)}`);
  };

  return (
    <CSMKPIWrapper 
      title="Predicted Churn Risk Analysis"
      subtitle="ML-powered churn predictions | Risk segmentation and actionable insights | Updated: 13/10/2025"
      showBackButton={false}
    >
      <div className="space-y-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Portfolio Dashboard</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              📉 Predicted Churn Risk Analysis
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              ML-powered risk assessment with segment analysis and actionable insights
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
              📊 Export Report
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          
          {/* KPI Cards Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
              <span className="text-sm text-gray-500">Real-time metrics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Historical Churn */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Historical Churn Rate (Last 12M)</div>
                <div className="text-4xl font-bold text-green-600 mb-2">{historicalChurn.formatted}</div>
                <div className="text-xs text-gray-500">Target: ≤{historicalChurn.target}%</div>
              </div>

              {/* Predicted Risk */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Predicted Churn Risk (Next 12M)</div>
                <div className={`text-4xl font-bold mb-2 ${
                  predictedRisk.status === 'success' ? 'text-green-600' :
                  predictedRisk.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>{predictedRisk.formatted}</div>
                <div className="text-xs text-gray-500">
                  {riskData.atRiskAccountCount} accounts ({formatCurrency(riskData.atRiskARR)} ARR) with &gt;40% risk
                </div>
              </div>
            </div>
          </section>

          {/* Risk by Customer Tier - TABLE SHOWN DIRECTLY */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Churn Risk by Customer Tier
              </h2>
              <p className="text-gray-600 mt-2">Segment analysis showing risk concentration across different customer tiers</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tier</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Total ARR</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">At-Risk ARR</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Risk %</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Accounts</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Churn Prob</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {segmentData.map((segment, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getTierIcon(segment.tier)}</span>
                          <span className="font-semibold text-gray-900">{segment.tier}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {formatCurrency(segment.totalARR)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-orange-600">
                        {formatCurrency(segment.atRiskARR)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                          segment.riskPercent >= 50 ? 'bg-red-100 text-red-800' :
                          segment.riskPercent >= 30 ? 'bg-orange-100 text-orange-800' :
                          segment.riskPercent >= 15 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {segment.riskPercent.toFixed(1)}% {segment.riskPercent >= 30 ? '⚠️' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {segment.atRiskAccounts} / {segment.totalAccounts}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          segment.churnProbTier === 'High' ? 'bg-red-100 text-red-800' :
                          segment.churnProbTier === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {segment.churnProbTier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleAccountClick(segment.tier)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <td className="px-6 py-4 text-gray-900">💰 Total</td>
                    <td className="px-6 py-4 text-right text-gray-900">
                      {formatCurrency(segmentData.reduce((sum, s) => sum + s.totalARR, 0))}
                    </td>
                    <td className="px-6 py-4 text-right text-orange-700">
                      {formatCurrency(segmentData.reduce((sum, s) => sum + s.atRiskARR, 0))}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">
                      {predictedRisk.formatted}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900">
                      {segmentData.reduce((sum, s) => sum + s.atRiskAccounts, 0)} / {segmentData.reduce((sum, s) => sum + s.totalAccounts, 0)}
                    </td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* At-Risk Accounts by Timeline */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">⏰</span>
                At-Risk Accounts by Timeline
              </h2>
              <p className="text-gray-600 mt-2">Urgency-based segmentation for prioritized interventions</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Next 30 Days */}
              <div 
                onClick={() => router.push('/csm/kpi/predicted-churn-risk/at-risk-accounts?timeline=30')}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-6 cursor-pointer hover:bg-red-100 hover:border-red-300 transition-all shadow-sm"
              >
                <div className="text-sm text-red-700 font-semibold mb-2">Next 30 Days</div>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {riskData.predictions.filter((p: any) => p.estimated_days_to_churn <= 30).length}
                </div>
                <div className="text-xs text-red-600">accounts</div>
                <div className="text-sm text-red-700 mt-2 font-semibold">
                  {formatCurrency(riskData.predictions.filter((p: any) => p.estimated_days_to_churn <= 30).reduce((sum: number, p: any) => sum + p.arr_at_risk, 0))} ARR
                </div>
                <div className="mt-3 text-xs text-red-800 bg-red-200 rounded px-2 py-1 inline-block">
                  🔴 URGENT - Immediate action
                </div>
              </div>

              {/* Next 90 Days */}
              <div 
                onClick={() => router.push('/csm/kpi/predicted-churn-risk/at-risk-accounts?timeline=90')}
                className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 cursor-pointer hover:bg-orange-100 hover:border-orange-300 transition-all shadow-sm"
              >
                <div className="text-sm text-orange-700 font-semibold mb-2">Next 90 Days</div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {riskData.predictions.filter((p: any) => p.estimated_days_to_churn <= 90).length}
                </div>
                <div className="text-xs text-orange-600">accounts</div>
                <div className="text-sm text-orange-700 mt-2 font-semibold">
                  {formatCurrency(riskData.predictions.filter((p: any) => p.estimated_days_to_churn <= 90).reduce((sum: number, p: any) => sum + p.arr_at_risk, 0))} ARR
                </div>
                <div className="mt-3 text-xs text-orange-800 bg-orange-200 rounded px-2 py-1 inline-block">
                  ⚠️ HIGH - Plan this quarter
                </div>
              </div>

              {/* Next 12 Months */}
              <div 
                onClick={() => router.push('/csm/kpi/predicted-churn-risk/at-risk-accounts')}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="text-sm text-blue-700 font-semibold mb-2">Next 12 Months</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {riskData.atRiskAccountCount}
                </div>
                <div className="text-xs text-blue-600">accounts</div>
                <div className="text-sm text-blue-700 mt-2 font-semibold">
                  {formatCurrency(riskData.atRiskARR)} ARR
                </div>
                <div className="mt-3 text-xs text-blue-800 bg-blue-200 rounded px-2 py-1 inline-block">
                  📊 TOTAL - All at-risk
                </div>
              </div>
            </div>
          </section>

          {/* Champion Departure Alerts */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🚨</span>
                Champion Departure Alerts
              </h2>
              <p className="text-gray-600 mt-2">Proactive monitoring of key stakeholder changes</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-600">{riskData.alertCounts.critical}</div>
                <div className="text-sm text-red-700 font-medium">Critical Priority</div>
                <div className="text-xs text-red-600">Impact &gt;80, Days &lt;90</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600">{riskData.alertCounts.high}</div>
                <div className="text-sm text-orange-700 font-medium">High Priority</div>
                <div className="text-xs text-orange-600">Requires attention</div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-gray-600">{riskData.alertCounts.medium}</div>
                <div className="text-sm text-gray-700 font-medium">Medium Priority</div>
                <div className="text-xs text-gray-600">Monitor quarterly</div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push('/csm/kpi/predicted-churn-risk/alerts')}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md"
              >
                View All Champion Departure Alerts →
              </button>
            </div>
          </section>

          {/* Footer Spacer */}
          <div className="pb-8"></div>
        </div>
      </div>
    </CSMKPIWrapper>
  );
}
