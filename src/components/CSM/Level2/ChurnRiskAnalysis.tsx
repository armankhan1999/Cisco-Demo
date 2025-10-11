'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { calculateChurnRiskBySegment, ChurnRiskData } from '@/lib/kpis/churnRiskBySegment';

export function ChurnRiskAnalysis() {
  const [data, setData] = useState<ChurnRiskData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const result = calculateChurnRiskBySegment();
      setData(result);
    } catch (error) {
      console.error('Error calculating churn risk:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading churn risk analysis...</div>
      </div>
    );
  }

  if (!data) return null;

  const formatARR = (arr: number) => {
    if (arr >= 1000000) return `$${(arr / 1000000).toFixed(1)}M`;
    if (arr >= 1000) return `$${(arr / 1000).toFixed(0)}K`;
    return `$${arr.toFixed(0)}`;
  };

  const getRiskColor = (percentage: number) => {
    if (percentage < 10) return 'text-green-600 bg-green-50';
    if (percentage < 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProbabilityBadge = (prob: string) => {
    const styles = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800'
    };
    return styles[prob as keyof typeof styles] || styles.Low;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Churn Risk Analysis by Segment</h2>
        <p className="text-sm text-gray-600 mt-1">Next 12 months projection</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm font-medium text-blue-700 mb-1">Total Portfolio ARR</div>
          <div className="text-2xl font-bold text-blue-900">{formatARR(data.totalARR)}</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-sm font-medium text-orange-700 mb-1">At-Risk ARR</div>
          <div className="text-2xl font-bold text-orange-900">{formatARR(data.totalAtRiskARR)}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-sm font-medium text-red-700 mb-1">Overall Risk %</div>
          <div className="text-2xl font-bold text-red-900">{data.overallRiskPercentage.toFixed(1)}%</div>
        </div>
      </div>

      {/* Segment Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Tier</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Total ARR</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">At-Risk ARR</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Risk %</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Churn Probability</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Accounts</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Avg Health</th>
            </tr>
          </thead>
          <tbody>
            {data.segments.map((segment, idx) => (
              <tr 
                key={segment.tier}
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  idx === data.segments.length - 1 ? 'border-b-2 border-gray-300' : ''
                }`}
              >
                <td className="py-4 px-4 font-medium text-gray-900">{segment.tier}</td>
                <td className="text-right py-4 px-4 font-semibold text-gray-900">
                  {formatARR(segment.totalARR)}
                </td>
                <td className="text-right py-4 px-4 font-semibold text-orange-600">
                  {formatARR(segment.atRiskARR)}
                </td>
                <td className="text-center py-4 px-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(segment.riskPercentage)}`}>
                    {segment.riskPercentage >= 15 && <AlertTriangle className="w-4 h-4" />}
                    {segment.riskPercentage.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getProbabilityBadge(segment.churnProbability)}`}>
                    {segment.churnProbability}
                  </span>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="text-gray-900">
                    <span className="font-semibold text-red-600">{segment.atRiskAccountCount}</span>
                    <span className="text-gray-400"> / </span>
                    <span className="font-semibold">{segment.accountCount}</span>
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className={`font-semibold ${
                    segment.avgHealthScore >= 75 ? 'text-green-600' :
                    segment.avgHealthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {segment.avgHealthScore}
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td className="py-4 px-4 text-gray-900">Total</td>
              <td className="text-right py-4 px-4 text-gray-900">{formatARR(data.totalARR)}</td>
              <td className="text-right py-4 px-4 text-orange-600">{formatARR(data.totalAtRiskARR)}</td>
              <td className="text-center py-4 px-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(data.overallRiskPercentage)}`}>
                  {data.overallRiskPercentage.toFixed(1)}%
                </span>
              </td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Primary Churn Drivers */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Primary Churn Drivers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.drivers.map((driver, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-gray-900">{idx + 1}. {driver.driver}</div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  {driver.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{driver.accountCount}</span> accounts
                <span className="mx-2">•</span>
                <span className="font-semibold">{formatARR(driver.totalARR)}</span> ARR
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Recommended Actions
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          {data.segments.filter(s => s.riskPercentage > 15).length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠</span>
              <span>
                <span className="font-semibold">High-risk tiers identified:</span> Focus on{' '}
                {data.segments.filter(s => s.riskPercentage > 15).map(s => s.tier).join(', ')} with targeted retention campaigns
              </span>
            </div>
          )}
          {data.drivers[0] && (
            <div className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">→</span>
              <span>
                Primary driver is <span className="font-semibold">{data.drivers[0].driver.toLowerCase()}</span> - implement immediate intervention strategy
              </span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">✓</span>
            <span>Schedule executive business reviews for all accounts above $100K ARR with health scores below 60</span>
          </div>
        </div>
      </div>
    </div>
  );
}
