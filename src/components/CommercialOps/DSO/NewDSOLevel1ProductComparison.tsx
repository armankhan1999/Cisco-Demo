'use client';

import { useState, useEffect } from 'react';
import { getLevel1ProductComparison, type DSOProductData } from '@/services/dsoRealDataService';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from '@/utils/iconMapping';

interface NewDSOLevel1ProductComparisonProps {
  onBack: () => void;
  onDrillToLevel2: (productFamily: string) => void;
}

export default function NewDSOLevel1ProductComparison({
  onBack,
  onDrillToLevel2
}: NewDSOLevel1ProductComparisonProps) {
  const [productData, setProductData] = useState<DSOProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = getLevel1ProductComparison();
        setProductData(data);
      } catch (error) {
        console.error('Error fetching DSO Level 1 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate overall metrics
  const totalAR = productData.reduce((sum, p) => sum + p.arBalance, 0);
  const weightedDSO = productData.reduce((sum, p) => sum + (p.dsoValue * p.arBalance), 0) / totalAR;
  const totalAging90Plus = productData.reduce((sum, p) => sum + p.aging.aging_90_plus, 0);
  const aging90PlusPct = (totalAging90Plus / totalAR) * 100;

  // Get product colors
  const productColors: Record<string, string> = {
    'Meraki': '#049FD9',
    'Duo': '#6CC04A',
    'Umbrella': '#F58220',
    'ThousandEyes': '#ED1C24',
    'Splunk': '#7B5EA7'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product-Line DSO Comparison
            </h1>
            <p className="text-gray-600">Which product has DSO issues? AR aging matrix by product family</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Overall DSO</h3>
            <span className="text-xs font-medium text-blue-600">
              {Math.round(weightedDSO) <= 35 ? 'On Target' : 'At Risk'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{Math.round(weightedDSO)} days</p>
          <p className="text-xs text-gray-500 mb-3">Target: ≤35 days</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${Math.round(weightedDSO) <= 35 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min((Math.round(weightedDSO) / 60) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Total AR</h3>
            <span className="text-xs font-medium text-gray-600">Outstanding</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">${Math.round(totalAR / 1000)}K</p>
          <p className="text-xs text-gray-500 mb-3">Across all products</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">90+ Days</h3>
            <span className={`text-xs font-medium ${aging90PlusPct > 10 ? 'text-red-600' : 'text-green-600'}`}>
              {aging90PlusPct > 10 ? 'Critical' : 'Good'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{Math.round(aging90PlusPct)}%</p>
          <p className="text-xs text-gray-500 mb-3">${Math.round(totalAging90Plus / 1000)}K overdue</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${aging90PlusPct > 10 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(aging90PlusPct * 2, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Products</h3>
            <span className="text-xs font-medium text-gray-600">Active</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{productData.length}</p>
          <p className="text-xs text-gray-500 mb-3">Product families</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Product Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Product-Line DSO Performance</h2>
            <p className="text-sm text-gray-600">Click any product to drill down to segment analysis</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product Family</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">DSO (Days)</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">AR Balance</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">0-30d</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">31-60d</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">61-90d</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">90+d</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {productData
                .sort((a, b) => b.dsoValue - a.dsoValue)
                .map((product) => (
                  <tr
                    key={product.productFamily}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onDrillToLevel2(product.productFamily)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: productColors[product.productFamily] || '#999' }}
                        ></div>
                        <span className="font-medium text-gray-900 text-sm">{product.productFamily}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className={`font-semibold text-sm ${
                        product.status === 'good' ? 'text-green-600' :
                        product.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.dsoValue} days
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-medium text-gray-900 text-sm">
                        ${Math.round(product.arBalance / 1000)}K
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-green-600">
                        ${Math.round(product.aging.current_0_30 / 1000)}K
                        <div className="text-xs text-gray-500">({product.agingPercentages.current_0_30_pct}%)</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-yellow-600">
                        ${Math.round(product.aging.aging_31_60 / 1000)}K
                        <div className="text-xs text-gray-500">({product.agingPercentages.aging_31_60_pct}%)</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-orange-600">
                        ${Math.round(product.aging.aging_61_90 / 1000)}K
                        <div className="text-xs text-gray-500">({product.agingPercentages.aging_61_90_pct}%)</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-red-600 font-medium">
                        ${Math.round(product.aging.aging_90_plus / 1000)}K
                        <div className="text-xs text-gray-500">({product.agingPercentages.aging_90_plus_pct}%)</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        product.status === 'good' ? 'bg-green-100 text-green-800' :
                        product.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'good' ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View Segments →
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Key Insights</h3>
        <div className="space-y-3">
          {productData
            .filter(p => p.status === 'critical')
            .map(p => (
              <div key={p.productFamily} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-800">{p.productFamily} requires immediate attention</p>
                  <p className="text-xs text-red-600">
                    DSO of {p.dsoValue} days ({p.agingPercentages.aging_90_plus_pct}% in 90+ bucket) - drill down to segments for details
                  </p>
                </div>
              </div>
            ))}

          {productData
            .filter(p => p.status === 'good')
            .slice(0, 1)
            .map(p => (
              <div key={p.productFamily} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-green-800">{p.productFamily} performing well</p>
                  <p className="text-xs text-green-600">
                    DSO of {p.dsoValue} days - {p.agingPercentages.current_0_30_pct}% current AR
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
