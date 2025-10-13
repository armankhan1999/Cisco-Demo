'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { calculateProductAdoptionTrends, ProductTrend } from '@/lib/kpis/productAdoptionTrends';

export function ProductAdoptionTrends() {
  const [trends, setTrends] = useState<ProductTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = calculateProductAdoptionTrends();
      setTrends(data);
    } catch (error) {
      console.error('Error calculating product adoption trends:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading product trends...</div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendText = (trend: string, percentage: number) => {
    if (trend === 'stable') return 'Stable';
    const symbol = percentage >= 0 ? '+' : '';
    return `${symbol}${percentage}%`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || styles.success;
  };

  return (
    <div className="rounded-xl shadow-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Adoption & Utilization Trends</h2>
          <p className="text-sm text-gray-600 mt-1">Product family performance over last 90 days</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Product Family</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Avg Utilization</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Feature Adoption</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trend (90d)</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Risk Accounts</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((product, idx) => (
              <tr 
                key={product.productFamily}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  idx === trends.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{product.productFamily}</div>
                  <div className="text-xs text-gray-500">{product.totalAccounts} accounts</div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="font-semibold text-gray-900">{product.avgUtilization}%</div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="font-semibold text-gray-900">{product.featureAdoption}%</div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    {getTrendIcon(product.trend)}
                    <span className={`font-medium ${
                      product.trend === 'up' ? 'text-green-600' :
                      product.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getTrendText(product.trend, product.trendPercentage)}
                    </span>
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="flex items-center justify-center gap-1">
                    {product.riskAccounts > 0 && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className={`font-semibold ${
                      product.riskAccounts > product.totalAccounts * 0.2 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.riskAccounts}
                    </span>
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                    {product.status === 'success' ? '✓ Good' : product.status === 'warning' ? '⚠ Watch' : '🔴 Action'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📊</span>
          Key Insights
        </h3>
        <div className="space-y-2">
          {trends
            .filter(t => t.status === 'danger' || t.trend === 'down')
            .map(product => (
              <div key={product.productFamily} className="flex items-start gap-2 text-sm">
                <span className="text-orange-500 mt-0.5">⚠</span>
                <span className="text-gray-700">
                  <span className="font-semibold">{product.productFamily}</span>
                  {product.trend === 'down' && ' showing declining adoption—targeted training campaign recommended'}
                  {product.status === 'danger' && product.avgUtilization < 60 && ' has low utilization—immediate intervention needed'}
                  {product.riskAccounts > product.totalAccounts * 0.3 && ` has ${product.riskAccounts} at-risk accounts requiring attention`}
                </span>
              </div>
            ))}
          {trends.filter(t => t.status === 'success' && t.trend === 'up').length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">
                Strong performance in {trends.filter(t => t.status === 'success' && t.trend === 'up').map(t => t.productFamily).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
