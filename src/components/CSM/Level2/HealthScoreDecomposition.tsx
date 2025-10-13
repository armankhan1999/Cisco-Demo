'use client';

import { useEffect, useState } from 'react';
import { calculateHealthDecomposition, HealthDecomposition } from '@/lib/kpis/csmHealthDecomposition';

export function HealthScoreDecomposition() {
  const [data, setData] = useState<HealthDecomposition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const result = calculateHealthDecomposition();
      setData(result);
    } catch (error) {
      console.error('Error calculating health decomposition:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading health decomposition...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-600">Error loading health decomposition data</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'danger':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      case 'stable':
        return <span className="text-yellow-500">→</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Health Score Decomposition
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Deep dive into the components that make up your portfolio health score
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Portfolio Health Score</div>
          <div className="text-4xl font-bold text-blue-600">
            {data.portfolioHealthScore}
          </div>
          <div className="text-xs text-gray-500 mt-1">Weighted Average</div>
        </div>
      </div>

      {/* Component Breakdown Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Component Breakdown</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Component
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contribution
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.components.map((component, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {component.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {component.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {component.weight}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(component.status)}`}>
                      {component.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-base font-bold text-blue-600">
                      {component.contribution.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                      {component.status === 'success' ? '✓ Good' : component.status === 'warning' ? '⚠ Monitor' : '🔴 Alert'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-xl">
                    {getTrendIcon(component.trend)}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  100%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  --
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-lg font-bold text-blue-700">
                    {data.portfolioHealthScore.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center" colSpan={2}>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${data.portfolioHealthScore >= 75 ? 'text-green-600 bg-green-100' : data.portfolioHealthScore >= 60 ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100'}`}>
                    {data.portfolioHealthScore >= 75 ? '✓ Healthy' : data.portfolioHealthScore >= 60 ? '⚠ Monitor' : '🔴 At Risk'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Component Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.components.map((component, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-6 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{component.name}</h4>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(component.status)}`}>
                {component.score}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-4">
                {component.description}
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 uppercase">Contributing Factors</div>
                {component.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {typeof factor.value === 'number' ? factor.value.toFixed(1) : factor.value}
                        {factor.factor.toLowerCase().includes('rate') ? '%' : ''}
                      </span>
                      <span className={`text-xs ${factor.impact === 'positive' ? 'text-green-600' : factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                        {factor.impact === 'positive' ? '✓' : factor.impact === 'negative' ? '✗' : '○'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <span>💡</span>
            Key Insights
          </h3>
          <ul className="space-y-2">
            {data.insights.map((insight, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Risks & Recommendations */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            Top Risks & Recommendations
          </h3>
          {data.topRisks.length > 0 ? (
            <div className="space-y-4">
              {data.topRisks.map((risk, index) => (
                <div key={index} className="bg-white rounded p-3 border border-yellow-200">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {risk.component}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {risk.impact}
                  </div>
                  <div className="text-xs text-yellow-800 bg-yellow-50 px-2 py-1 rounded">
                    💡 {risk.recommendation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-yellow-800">
              ✓ All health components are performing well. No immediate risks identified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

