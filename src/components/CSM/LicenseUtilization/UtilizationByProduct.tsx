'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateProductUtilizationAnalysis } from '../../../lib/kpis/licenseUtilizationKPIs';

interface UtilizationByProductProps {
  onProductClick?: (productFamily: string) => void;
}

export function UtilizationByProduct({ onProductClick }: UtilizationByProductProps) {
  const router = useRouter();
  const [productData, setProductData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = calculateProductUtilizationAnalysis();
      setProductData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading product utilization data:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (variance: number) => {
    if (variance >= 2) return '🟢';
    if (variance >= -5) return '🟡';
    return '🔴';
  };

  const getStatusColor = (variance: number) => {
    if (variance >= 2) return 'text-green-600';
    if (variance >= -5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getWasteColor = (wastePct: number) => {
    if (wastePct <= 15) return 'text-green-600';
    if (wastePct <= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProductIcon = (productFamily: string) => {
    switch (productFamily) {
      case 'Meraki': return '🌐';
      case 'Duo': return '🔐';
      case 'Umbrella': return '☁️';
      case 'ThousandEyes': return '👁️';
      case 'Splunk': return '📊';
      default: return '📦';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📊 Utilization by Product Family
        </h3>
        <div className="text-sm text-gray-500">
          Portfolio Analysis
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Accounts</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Avg Util %</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Licensed</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Active</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Unused</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Waste %</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((product, index) => (
              <tr 
                key={product.productFamily}
                className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => {
                  router.push(`/csm/kpi/product-details?product=${encodeURIComponent(product.productFamily)}`);
                  onProductClick?.(product.productFamily);
                }}
                title={`Click to view detailed ${product.productFamily} analytics`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getProductIcon(product.productFamily)}</span>
                    <div>
                      <div className="font-medium text-gray-900">{product.productFamily}</div>
                      <div className="text-sm text-gray-500">
                        {product.productDescription}
                      </div>
                      <div className="text-xs text-gray-400">
                        ({product.penetration.toFixed(1)}% penetration)
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="font-medium text-gray-900">{product.accounts}</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium text-gray-900">{product.avgUtilization.toFixed(1)}%</span>
                    <span className={`text-sm ${getStatusColor(product.variance)}`}>
                      {getStatusIcon(product.variance)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Target: {product.benchmark}% ({product.variance >= 0 ? '+' : ''}{product.variance.toFixed(1)}pp)
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="font-medium text-gray-900">{product.totalLicenses.toLocaleString()}</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="font-medium text-gray-900">{product.totalUsed.toLocaleString()}</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="font-medium text-gray-900">{product.totalAvailable.toLocaleString()}</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className={`font-medium ${getWasteColor(product.wastePercentage)}`}>
                    {product.wastePercentage.toFixed(1)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Product-Specific Insights:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-green-600">🟢</span>
            <span className="text-gray-700">
              <strong>Strong Performers:</strong> {productData.filter(p => p.varianceFromBenchmark >= 2).map(p => p.productFamily).join(', ')} - Exceeding benchmarks with low waste
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-600">🟡</span>
            <span className="text-gray-700">
              <strong>Needs Attention:</strong> {productData.filter(p => p.varianceFromBenchmark < 2 && p.varianceFromBenchmark >= -5).map(p => p.productFamily).join(', ')} - Slight underperformance, focus on feature adoption
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-red-600">🔴</span>
            <span className="text-gray-700">
              <strong>Critical Focus:</strong> {productData.filter(p => p.varianceFromBenchmark < -5).map(p => p.productFamily).join(', ')} - Below benchmark with high waste, prioritize adoption campaigns
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
          📊 View Product Trends
        </button>
        <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
          🎯 View Low-Adoption Accounts
        </button>
        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
          📧 Launch Product Campaign
        </button>
      </div>
    </div>
  );
}
