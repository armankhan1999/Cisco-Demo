'use client';

import { useState, useEffect } from 'react';
import { DSODrillDownService, type DSOLevel1TrendData } from '@/services/dsoDrillDownService';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, Target } from '@/utils/iconMapping';
import DSOAgingBucketDetailModal from './DSOAgingBucketDetailModal';

interface DSOLevel1TrendAgingProps {
  productFamily?: string;
  onBack: () => void;
  onDrillToLevel2: (segment: string, productFamily: string) => void;
}

export default function DSOLevel1TrendAging({
  productFamily,
  onBack,
  onDrillToLevel2
}: DSOLevel1TrendAgingProps) {
  const [trendData, setTrendData] = useState<DSOLevel1TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('6months');
  const [selectedBucket, setSelectedBucket] = useState<{name: string; minDays: number; maxDays: number} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = DSODrillDownService.getLevel1TrendData(productFamily);
        setTrendData(data);
      } catch (error) {
        console.error('Error fetching DSO Level 1 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTimeframe, productFamily]);

  const handleSegmentClick = (segment: string) => {
    onDrillToLevel2(segment, productFamily || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get current month data for aging analysis
  const currentData = trendData[trendData.length - 1];
  const previousData = trendData[trendData.length - 2];
  const trendDirection = currentData && previousData ?
    (currentData.dsoValue < previousData.dsoValue ? 'improving' : 'declining') : 'stable';

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
            Back to Product Comparison
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {productFamily ? `${productFamily} - ` : ''}Days Sales Outstanding (DSO) Analysis
            </h1>
            <p className="text-gray-600">
              {productFamily ? `Is ${productFamily}'s collection getting better or worse?` : 'Is our collection getting better or worse?'} DSO trend and aging bucket analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards - Q2C Variant Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Current DSO Card */}
        <div className="border border-gray-200 rounded-xl p-5" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Current DSO</h3>
            <span className="text-xs font-medium text-green-600">
              {(currentData?.dsoValue || 0) <= (currentData?.target || 30) ? 'On Target' : 'At Risk'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{currentData?.dsoValue || 0} days</p>
          <p className="text-xs text-gray-500 mb-3">Target: ≤{currentData?.target || 30} days</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${(currentData?.dsoValue || 0) <= (currentData?.target || 30) ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(((currentData?.dsoValue || 0) / (currentData?.target || 30)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Trend Card */}
        <div className="border border-gray-200 rounded-xl p-5" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Trend</h3>
            <span className={`text-xs font-medium ${trendDirection === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
              {trendDirection === 'improving' ? 'Improving' : 'Declining'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {trendDirection === 'improving' ? '↓' : '↑'} {Math.abs((currentData?.dsoValue || 0) - (previousData?.dsoValue || 0))} days
          </p>
          <p className="text-xs text-gray-500 mb-3">vs previous month</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${trendDirection === 'improving' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* Total AR Card */}
        <div className="border border-gray-200 rounded-xl p-5" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Total AR</h3>
            <span className="text-xs font-medium text-gray-600">Current</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            ${Math.round((currentData?.totalAR || 0) / 1000)}K
          </p>
          <p className="text-xs text-gray-500 mb-3">Outstanding receivables</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* 90+ Days Card */}
        <div className="border border-gray-200 rounded-xl p-5" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">90+ Days</h3>
            <span className={`text-xs font-medium ${(currentData?.agingPercentages.aging_90_plus_pct || 0) > 10 ? 'text-red-600' : 'text-green-600'}`}>
              {(currentData?.agingPercentages.aging_90_plus_pct || 0) > 10 ? 'Critical' : 'On Target'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {currentData?.agingPercentages.aging_90_plus_pct || 0}%
          </p>
          <p className="text-xs text-gray-500 mb-3">
            ${Math.round((currentData?.agingBuckets.aging_90_plus || 0) / 1000)}K overdue
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${(currentData?.agingPercentages.aging_90_plus_pct || 0) > 10 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((currentData?.agingPercentages.aging_90_plus_pct || 0) * 2, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Aging Buckets Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AR Aging Buckets (Current Month)</h2>
            <p className="text-sm text-gray-600">Breakdown of outstanding receivables by aging period - Click any bucket to drill down</p>
          </div>
        </div>

        {currentData && (
          <div className="space-y-4">
            {/* Aging Bucket Cards - Clickable */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setSelectedBucket({name: '0-30 Days', minDays: 0, maxDays: 30})}
                className="flex items-center gap-3 p-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-green-300"
                style={{ backgroundColor: '#F3F3F3' }}
              >
                <div className="w-4 h-4 bg-green-500 rounded flex-shrink-0"></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-green-800">0-30 Days</p>
                  <p className="text-xs text-green-600">
                    ${Math.round(currentData.agingBuckets.current_0_30 / 1000)}K ({currentData.agingPercentages.current_0_30_pct}%)
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedBucket({name: '31-60 Days', minDays: 31, maxDays: 60})}
                className="flex items-center gap-3 p-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-yellow-300"
                style={{ backgroundColor: '#F3F3F3' }}
              >
                <div className="w-4 h-4 bg-yellow-500 rounded flex-shrink-0"></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">31-60 Days</p>
                  <p className="text-xs text-yellow-600">
                    ${Math.round(currentData.agingBuckets.aging_31_60 / 1000)}K ({currentData.agingPercentages.aging_31_60_pct}%)
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedBucket({name: '61-90 Days', minDays: 61, maxDays: 90})}
                className="flex items-center gap-3 p-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-orange-300"
                style={{ backgroundColor: '#F3F3F3' }}
              >
                <div className="w-4 h-4 bg-orange-500 rounded flex-shrink-0"></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-orange-800">61-90 Days</p>
                  <p className="text-xs text-orange-600">
                    ${Math.round(currentData.agingBuckets.aging_61_90 / 1000)}K ({currentData.agingPercentages.aging_61_90_pct}%)
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedBucket({name: '90+ Days', minDays: 91, maxDays: 999})}
                className="flex items-center gap-3 p-3 rounded-lg border-2 hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-red-200 hover:border-red-400"
                style={{ backgroundColor: '#F3F3F3' }}
              >
                <div className="w-4 h-4 bg-red-500 rounded flex-shrink-0"></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-red-800">90+ Days</p>
                  <p className="text-xs text-red-600">
                    ${Math.round(currentData.agingBuckets.aging_90_plus / 1000)}K ({currentData.agingPercentages.aging_90_plus_pct}%)
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Target className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Performance vs Target</p>
                <p className="text-xs text-blue-600">
                  Current DSO is {(currentData?.dsoValue || 0) > (currentData?.target || 30) ? 'above' : 'at'} target by {Math.abs((currentData?.dsoValue || 0) - (currentData?.target || 30))} days
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Collection Risk</p>
                <p className="text-xs text-yellow-600">
                  {currentData?.agingPercentages.aging_90_plus_pct || 0}% of AR is 90+ days old, requiring immediate attention
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Trend Analysis</p>
                <p className="text-xs text-green-600">
                  DSO trend is {trendDirection} - {trendDirection === 'improving' ? 'collection efficiency improving' : 'needs attention'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Recommended Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleSegmentClick('Enterprise')}
              className="w-full flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
            >
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <p className="text-sm font-medium text-red-800">Focus on Enterprise Segment{productFamily ? ` - ${productFamily}` : ''}</p>
                <p className="text-xs text-red-600">Highest DSO segment - drill down for details</p>
              </div>
            </button>

            <button
              onClick={() => handleSegmentClick('SMB')}
              className="w-full flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-left"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Review SMB Payment Terms{productFamily ? ` - ${productFamily}` : ''}</p>
                <p className="text-xs text-yellow-600">SMB segment showing payment delays</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <p className="text-sm font-medium text-blue-800">Automate Collection Reminders</p>
                <p className="text-xs text-blue-600">Set up automated follow-ups for 30+ day invoices</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Aging Bucket Detail Modal */}
      {selectedBucket && productFamily && (
        <DSOAgingBucketDetailModal
          productFamily={productFamily}
          bucketName={selectedBucket.name}
          minDays={selectedBucket.minDays}
          maxDays={selectedBucket.maxDays}
          onClose={() => setSelectedBucket(null)}
        />
      )}
    </div>
  );
}
