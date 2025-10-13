'use client';

import { useEffect, useState } from 'react';
import { Calendar, AlertTriangle, TrendingDown } from 'lucide-react';
import { getAtRiskRenewals, AtRiskRenewal } from '@/lib/kpis/atRiskRenewals';

export function AtRiskRenewals() {
  const [renewals, setRenewals] = useState<AtRiskRenewal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getAtRiskRenewals();
      setRenewals(data.slice(0, 15)); // Top 15 most at-risk
    } catch (error) {
      console.error('Error loading at-risk renewals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading at-risk renewals...</div>
      </div>
    );
  }

  const formatARR = (arr: number) => {
    if (arr >= 1000000) return `$${(arr / 1000000).toFixed(1)}M`;
    if (arr >= 1000) return `$${(arr / 1000).toFixed(0)}K`;
    return `$${arr.toFixed(0)}`;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getConfidenceBadge = (confidence: string) => {
    const styles = {
      Low: 'bg-red-100 text-red-800 border-red-300',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      High: 'bg-green-100 text-green-800 border-green-300'
    };
    return styles[confidence as keyof typeof styles] || styles.Medium;
  };

  const getUrgencyColor = (days: number) => {
    if (days < 30) return 'text-red-600 bg-red-50 border-red-200';
    if (days < 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="rounded-xl shadow-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-orange-600" />
            At-Risk Renewals (Next 90 Days)
          </h2>
          <p className="text-sm text-gray-600 mt-1">Accounts requiring immediate retention focus</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600">{renewals.length}</div>
          <div className="text-xs text-gray-500">At-Risk</div>
        </div>
      </div>

      {renewals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-green-600 text-lg font-medium">✓ No at-risk renewals</div>
          <div className="text-sm text-gray-500 mt-2">All upcoming renewals appear healthy</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg p-4 border border-red-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-red-700 mb-1">Total At-Risk ARR</div>
              <div className="text-2xl font-bold text-red-900">
                {formatARR(renewals.reduce((sum, r) => sum + r.arr, 0))}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-orange-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-orange-700 mb-1">Urgent (&lt; 30 days)</div>
              <div className="text-2xl font-bold text-orange-900">
                {renewals.filter(r => r.daysToRenewal < 30).length}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-yellow-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-yellow-700 mb-1">Low Confidence</div>
              <div className="text-2xl font-bold text-yellow-900">
                {renewals.filter(r => r.confidence === 'Low').length}
              </div>
            </div>
          </div>

          {/* Renewals Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Account</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Renewal Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">ARR</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Confidence</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Risk Factors</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">CSM</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Mitigation Plan</th>
                </tr>
              </thead>
              <tbody>
                {renewals.map((renewal, idx) => (
                  <tr 
                    key={renewal.accountId}
                    className={`border-b border-gray-100 hover:bg-yellow-50 transition-colors ${
                      idx === renewals.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{renewal.accountName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {renewal.tier}
                        <span className="mx-1">•</span>
                        <span className={`${
                          renewal.healthScore < 55 ? 'text-red-600' : 'text-orange-600'
                        } font-semibold`}>
                          Health: {renewal.healthScore}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${getUrgencyColor(renewal.daysToRenewal)}`}>
                        <Calendar className="w-4 h-4" />
                        <div className="text-left">
                          <div className="text-xs font-medium">{formatDate(renewal.renewalDate)}</div>
                          <div className="text-xs font-bold">{renewal.daysToRenewal} days</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="font-semibold text-gray-900">{formatARR(renewal.arr)}</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceBadge(renewal.confidence)}`}>
                        {renewal.confidence}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {renewal.riskFactors.map((factor, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-sm text-gray-700">{renewal.csm}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">{renewal.mitigationPlan}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Recommendations */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recommended Actions by Urgency
            </h3>
            <div className="space-y-3">
              {renewals.filter(r => r.daysToRenewal < 30).length > 0 && (
                <div className="border border-red-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="font-medium text-red-900 mb-2">🔥 Immediate (Next 30 Days) - {renewals.filter(r => r.daysToRenewal < 30).length} accounts</div>
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Schedule executive business reviews within 5 business days</li>
                    <li>• Conduct comprehensive value audit and ROI analysis</li>
                    <li>• Activate save team for accounts &gt; $100K ARR</li>
                  </ul>
                </div>
              )}
              {renewals.filter(r => r.daysToRenewal >= 30 && r.daysToRenewal < 60).length > 0 && (
                <div className="border border-orange-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="font-medium text-orange-900 mb-2">⚡ Urgent (30-60 Days) - {renewals.filter(r => r.daysToRenewal >= 30 && r.daysToRenewal < 60).length} accounts</div>
                  <ul className="text-sm text-orange-800 space-y-1 ml-4">
                    <li>• Implement targeted training and feature adoption programs</li>
                    <li>• Address support issues and escalate to product team if needed</li>
                    <li>• Develop custom success plans with measurable milestones</li>
                  </ul>
                </div>
              )}
              {renewals.filter(r => r.daysToRenewal >= 60).length > 0 && (
                <div className="border border-yellow-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="font-medium text-yellow-900 mb-2">⏰ Watch List (60-90 Days) - {renewals.filter(r => r.daysToRenewal >= 60).length} accounts</div>
                  <ul className="text-sm text-yellow-800 space-y-1 ml-4">
                    <li>• Increase engagement cadence and monitor health trends closely</li>
                    <li>• Conduct QBRs to align on business outcomes and value realization</li>
                    <li>• Identify and nurture champion relationships</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
