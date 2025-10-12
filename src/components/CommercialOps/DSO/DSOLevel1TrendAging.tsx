'use client';

import { useState, useEffect } from 'react';
import { DSODrillDownService, type DSOLevel1TrendData } from '@/services/dsoDrillDownService';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, Target } from '@/utils/iconMapping';

interface DSOLevel1TrendAgingProps {
  onBack: () => void;
  onDrillToLevel2: (segment: string, productFamily: string) => void;
}

export default function DSOLevel1TrendAging({ 
  onBack, 
  onDrillToLevel2 
}: DSOLevel1TrendAgingProps) {
  const [trendData, setTrendData] = useState<DSOLevel1TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('6months');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = DSODrillDownService.getLevel1TrendData();
        setTrendData(data);
      } catch (error) {
        console.error('Error fetching DSO Level 1 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTimeframe]);

  const handleSegmentClick = (segment: string, productFamily: string) => {
    onDrillToLevel2(segment, productFamily);
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
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Days Sales Outstanding (DSO) Analysis</h1>
            <p className="text-gray-600">Is our collection getting better or worse? DSO trend and aging bucket analysis</p>
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-blue-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Current DSO</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{currentData?.dsoValue || 0} days</p>
          <p className="text-sm text-blue-600">Target: ≤{currentData?.target || 30} days</p>
        </div>

        <div className={`${trendDirection === 'improving' ? 'border-green-200' : 'border-red-200'} border rounded-xl p-4 shadow-sm`} style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            {trendDirection === 'improving' ? (
              <TrendingDown className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingUp className="h-5 w-5 text-red-500" />
            )}
            <span className={`font-medium ${trendDirection === 'improving' ? 'text-green-700' : 'text-red-700'}`}>
              Trend
            </span>
          </div>
          <p className={`text-2xl font-bold ${trendDirection === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
            {trendDirection === 'improving' ? '↓' : '↑'} {Math.abs((currentData?.dsoValue || 0) - (previousData?.dsoValue || 0))} days
          </p>
          <p className={`text-sm ${trendDirection === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
            vs previous month
          </p>
        </div>

        <div className="border border-purple-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-purple-700">Total AR</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            ${Math.round((currentData?.totalAR || 0) / 1000)}K
          </p>
          <p className="text-sm text-purple-600">Outstanding receivables</p>
        </div>

        <div className="border border-yellow-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">90+ Days</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {currentData?.agingPercentages.aging_90_plus_pct || 0}%
          </p>
          <p className="text-sm text-yellow-600">
            ${Math.round((currentData?.agingBuckets.aging_90_plus || 0) / 1000)}K overdue
          </p>
        </div>
      </div>

      {/* DSO Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">DSO Trend (Last 6 Months)</h2>
            <p className="text-sm text-gray-600">Days Sales Outstanding performance vs target</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Actual DSO</span>
            <div className="w-3 h-3 bg-red-400 rounded-full ml-4"></div>
            <span>Target (30 days)</span>
          </div>
        </div>
        
        {/* Simple Line Chart Visualization */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {trendData.map((data, index) => (
              <div key={data.id} className="flex flex-col items-center" style={{ width: `${100/trendData.length}%` }}>
                {/* DSO Value Bar */}
                <div className="relative mb-2">
                  <div 
                    className={`w-8 rounded-t ${data.dsoValue > data.target ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ 
                      height: `${(data.dsoValue / 50) * 200}px`,
                      minHeight: '20px'
                    }}
                  ></div>
                  {/* Target Line */}
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-red-400 border-dashed"
                    style={{ 
                      bottom: `${(data.target / 50) * 200}px`
                    }}
                  ></div>
                  {/* Value Label */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                    {data.dsoValue}d
                  </div>
                </div>
                {/* Month Label */}
                <span className="text-xs text-gray-600 transform -rotate-45 origin-center">
                  {data.month.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aging Buckets Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AR Aging Buckets (Current Month)</h2>
            <p className="text-sm text-gray-600">Breakdown of outstanding receivables by aging period</p>
          </div>
        </div>
        
        {currentData && (
          <div className="space-y-4">
            {/* Stacked Bar Visualization */}
            <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${currentData.agingPercentages.current_0_30_pct}%` }}
              >
                {currentData.agingPercentages.current_0_30_pct > 15 && `${currentData.agingPercentages.current_0_30_pct}%`}
              </div>
              <div 
                className="absolute top-0 h-full bg-yellow-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ 
                  left: `${currentData.agingPercentages.current_0_30_pct}%`,
                  width: `${currentData.agingPercentages.aging_31_60_pct}%` 
                }}
              >
                {currentData.agingPercentages.aging_31_60_pct > 10 && `${currentData.agingPercentages.aging_31_60_pct}%`}
              </div>
              <div 
                className="absolute top-0 h-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ 
                  left: `${currentData.agingPercentages.current_0_30_pct + currentData.agingPercentages.aging_31_60_pct}%`,
                  width: `${currentData.agingPercentages.aging_61_90_pct}%` 
                }}
              >
                {currentData.agingPercentages.aging_61_90_pct > 8 && `${currentData.agingPercentages.aging_61_90_pct}%`}
              </div>
              <div 
                className="absolute top-0 h-full bg-red-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ 
                  left: `${currentData.agingPercentages.current_0_30_pct + currentData.agingPercentages.aging_31_60_pct + currentData.agingPercentages.aging_61_90_pct}%`,
                  width: `${currentData.agingPercentages.aging_90_plus_pct}%` 
                }}
              >
                {currentData.agingPercentages.aging_90_plus_pct > 5 && `${currentData.agingPercentages.aging_90_plus_pct}%`}
              </div>
            </div>
            
            {/* Legend and Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-green-800">0-30 Days</p>
                  <p className="text-xs text-green-600">
                    ${Math.round(currentData.agingBuckets.current_0_30 / 1000)}K ({currentData.agingPercentages.current_0_30_pct}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">31-60 Days</p>
                  <p className="text-xs text-yellow-600">
                    ${Math.round(currentData.agingBuckets.aging_31_60 / 1000)}K ({currentData.agingPercentages.aging_31_60_pct}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-orange-800">61-90 Days</p>
                  <p className="text-xs text-orange-600">
                    ${Math.round(currentData.agingBuckets.aging_61_90 / 1000)}K ({currentData.agingPercentages.aging_61_90_pct}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-red-200" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-red-800">90+ Days</p>
                  <p className="text-xs text-red-600">
                    ${Math.round(currentData.agingBuckets.aging_90_plus / 1000)}K ({currentData.agingPercentages.aging_90_plus_pct}%)
                  </p>
                </div>
              </div>
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
              onClick={() => handleSegmentClick('Enterprise', 'Splunk')}
              className="w-full flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
            >
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <p className="text-sm font-medium text-red-800">Focus on Enterprise-Splunk</p>
                <p className="text-xs text-red-600">Highest DSO segment - drill down for details</p>
              </div>
            </button>
            
            <button 
              onClick={() => handleSegmentClick('SMB', 'Duo')}
              className="w-full flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-left"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Review SMB Payment Terms</p>
                <p className="text-xs text-yellow-600">SMB-Duo showing payment delays</p>
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
    </div>
  );
}
