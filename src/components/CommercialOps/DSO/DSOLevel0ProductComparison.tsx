'use client';

import { useState, useEffect } from 'react';
import { DSODrillDownService, type DSOLevel0ProductData } from '@/services/dsoDrillDownService';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, FileText, Target, AlertCircle } from '@/utils/iconMapping';

interface DSOLevel0ProductComparisonProps {
  onBack: () => void;
  onDrillToLevel1: (productFamily: string) => void;
}

export default function DSOLevel0ProductComparison({
  onBack,
  onDrillToLevel1
}: DSOLevel0ProductComparisonProps) {
  const [productData, setProductData] = useState<DSOLevel0ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = DSODrillDownService.getLevel0ProductComparison();
        setProductData(data);
      } catch (error) {
        console.error('Error fetching DSO Product Comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductClick = (productFamily: string) => {
    setSelectedProduct(productFamily);
    onDrillToLevel1(productFamily);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate overall metrics
  const totalAR = productData.reduce((sum, prod) => sum + prod.arBalance, 0);
  const weightedDSO = productData.reduce((sum, prod) =>
    sum + (prod.dsoValue * prod.arBalance), 0
  ) / totalAR;
  const criticalProducts = productData.filter(p => p.status === 'critical').length;
  const warningProducts = productData.filter(p => p.status === 'warning').length;

  // Sort products by DSO value for rankings
  const sortedProducts = [...productData].sort((a, b) => b.dsoValue - a.dsoValue);
  const bestPerformer = sortedProducts[sortedProducts.length - 1];
  const worstPerformer = sortedProducts[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                DSO by Product Line
              </h1>
              <p className="text-gray-600 text-base">
                Which product lines are driving our collection challenges?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Overall DSO</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(weightedDSO)} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary - Q2C Variant Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-base font-semibold text-gray-900">Target Performance</h3>
            <span className="text-xs font-medium text-blue-600">
              {productData.filter(p => p.status === 'good').length >= productData.length / 2 ? 'On Target' : 'At Risk'}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1.5">
            {productData.filter(p => p.status === 'good').length} / {productData.length}
          </p>
          <p className="text-xs text-gray-500 mb-2">Products meeting target</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-blue-500"
              style={{ width: `${(productData.filter(p => p.status === 'good').length / productData.length) * 100}%` }}>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-base font-semibold text-gray-900">Best Performer</h3>
            <span className="text-xs font-medium text-green-600">On Target</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1.5">{bestPerformer?.productFamily}</p>
          <p className="text-xs text-gray-500 mb-2">{bestPerformer?.dsoValue} days DSO</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-green-500"
              style={{ width: `${Math.min((bestPerformer?.dsoValue || 0) / (bestPerformer?.target || 30) * 100, 100)}%` }}>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-base font-semibold text-gray-900">Needs Attention</h3>
            <span className="text-xs font-medium text-red-600">Critical</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1.5">{worstPerformer?.productFamily}</p>
          <p className="text-xs text-gray-500 mb-2">{worstPerformer?.dsoValue} days DSO</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-red-500"
              style={{ width: `${Math.min((worstPerformer?.dsoValue || 0) / ((worstPerformer?.target || 30) * 2) * 100, 100)}%` }}>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-base font-semibold text-gray-900">Total Outstanding</h3>
            <span className="text-xs font-medium text-blue-600">Info</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1.5">
            ${Math.round(totalAR / 1000)}K
          </p>
          <p className="text-xs text-gray-500 mb-2">Across all products</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Product Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">DSO Comparison by Product Line</h2>
          <p className="text-sm text-gray-600">Click any product to drill down into detailed analysis</p>
        </div>

        {/* Comparison Bars */}
        <div className="space-y-4">
          {productData.map((product) => {
            const maxDSO = Math.max(...productData.map(p => p.dsoValue));
            const barWidth = (product.dsoValue / maxDSO) * 100;
            const isSelected = selectedProduct === product.productFamily;

            let statusColor = 'bg-green-500';
            let borderColor = 'border-green-200';
            let bgColor = 'bg-green-50';

            if (product.status === 'critical') {
              statusColor = 'bg-red-500';
              borderColor = 'border-red-200';
              bgColor = 'bg-red-50';
            } else if (product.status === 'warning') {
              statusColor = 'bg-yellow-500';
              borderColor = 'border-yellow-200';
              bgColor = 'bg-yellow-50';
            }

            return (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.productFamily)}
                className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${borderColor} ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
                style={{ backgroundColor: '#F3F3F3' }}
              >
                {/* Product Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 ${statusColor} rounded-full`}></div>
                    <h3 className="text-lg font-bold text-gray-900">{product.productFamily}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">DSO</p>
                      <p className={`text-xl font-bold ${
                        product.status === 'critical' ? 'text-red-600' :
                        product.status === 'warning' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {product.dsoValue} days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Trend</p>
                      <div className="flex items-center gap-1">
                        {product.trend < 0 ? (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        )}
                        <p className={`text-base font-bold ${product.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(product.trend)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DSO Bar */}
                <div className="relative mb-3">
                  <div className="h-10 bg-gray-200 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${statusColor} flex items-center justify-end pr-3 transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    >
                      <span className="text-white font-bold text-xs">{product.dsoValue} days</span>
                    </div>
                  </div>
                  {/* Target Line */}
                  <div
                    className="absolute top-0 h-full border-l-2 border-dashed border-gray-600"
                    style={{ left: `${(product.target / maxDSO) * 100}%` }}
                  >
                    <span className="absolute -top-5 left-0 transform -translate-x-1/2 text-xs text-gray-600 font-medium">
                      Target: {product.target}d
                    </span>
                  </div>
                </div>

                {/* Product Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">AR Balance</p>
                      <p className="text-sm font-bold text-gray-900">${Math.round(product.arBalance / 1000)}K</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Customers</p>
                      <p className="text-sm font-bold text-gray-900">{product.customerCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Invoices</p>
                      <p className="text-sm font-bold text-gray-900">{product.invoiceCount}</p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Performance Overview</p>
                <p className="text-xs text-blue-600 mt-1">
                  {productData.filter(p => p.status === 'good').length} of {productData.length} product lines meeting target.
                  {criticalProducts > 0 && ` ${criticalProducts} requiring immediate attention.`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Best Practice</p>
                <p className="text-xs text-green-600 mt-1">
                  {bestPerformer?.productFamily} demonstrates excellent collection efficiency at {bestPerformer?.dsoValue} days.
                  Review their payment terms and collection processes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Action Required</p>
                <p className="text-xs text-red-600 mt-1">
                  {worstPerformer?.productFamily} has highest DSO at {worstPerformer?.dsoValue} days.
                  Click to drill down and identify specific customers causing delays.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Recommended Actions</h3>
          <div className="space-y-3">
            {sortedProducts.slice(0, 3).map((product, index) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.productFamily)}
                className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg hover:shadow-md transition-all text-left ${
                  product.status === 'critical' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                  product.status === 'warning' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                  'bg-green-50 border-green-200 hover:bg-green-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                  product.status === 'critical' ? 'bg-red-500' :
                  product.status === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    product.status === 'critical' ? 'text-red-800' :
                    product.status === 'warning' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    Investigate {product.productFamily} Collections
                  </p>
                  <p className={`text-xs mt-1 ${
                    product.status === 'critical' ? 'text-red-600' :
                    product.status === 'warning' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {product.dsoValue} days DSO | ${Math.round(product.arBalance / 1000)}K outstanding | {product.customerCount} customers
                  </p>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 transform rotate-180" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
