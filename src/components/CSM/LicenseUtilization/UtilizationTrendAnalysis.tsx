'use client';

import React, { useState, useEffect } from 'react';

interface TrendDataPoint {
  date: string;
  utilization: number;
  activeUsers: number;
  unusedCapacity: number;
  rolling7Day: number;
  rolling30Day: number;
}

interface UtilizationTrendAnalysisProps {
  onDateClick?: (date: string) => void;
}

export function UtilizationTrendAnalysis({ onDateClick }: UtilizationTrendAnalysisProps) {
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Generate 90-day trend data
      const data: TrendDataPoint[] = [];
      const today = new Date();
      
      for (let i = 89; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Simulate realistic trend data with some variation
        const baseUtilization = 73;
        const seasonalVariation = Math.sin((i / 90) * Math.PI * 2) * 5; // Seasonal pattern
        const randomVariation = (Math.random() - 0.5) * 10; // Random noise
        const utilization = Math.max(0, Math.min(100, baseUtilization + seasonalVariation + randomVariation));
        
        data.push({
          date: date.toISOString().split('T')[0],
          utilization: Math.round(utilization * 10) / 10,
          activeUsers: Math.round(3299 + (Math.random() - 0.5) * 200),
          unusedCapacity: Math.round(1221 + (Math.random() - 0.5) * 100),
          rolling7Day: 0, // Will be calculated below
          rolling30Day: 0 // Will be calculated below
        });
      }
      
      // Calculate rolling averages
      data.forEach((point, index) => {
        const start7 = Math.max(0, index - 6);
        const start30 = Math.max(0, index - 29);
        
        const last7Days = data.slice(start7, index + 1);
        const last30Days = data.slice(start30, index + 1);
        
        point.rolling7Day = last7Days.reduce((sum, p) => sum + p.utilization, 0) / last7Days.length;
        point.rolling30Day = last30Days.reduce((sum, p) => sum + p.utilization, 0) / last30Days.length;
      });
      
      setTrendData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trend data:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentUtilization = trendData[trendData.length - 1]?.utilization || 0;
  const previousMonthUtilization = trendData[Math.max(0, trendData.length - 30)]?.utilization || 0;
  const momChange = currentUtilization - previousMonthUtilization;
  
  const peakUtilization = Math.max(...trendData.map(d => d.utilization));
  const peakDate = trendData.find(d => d.utilization === peakUtilization)?.date;
  const troughUtilization = Math.min(...trendData.map(d => d.utilization));
  const troughDate = trendData.find(d => d.utilization === troughUtilization)?.date;

  const getTrendDirection = () => {
    const recent = trendData.slice(-7);
    const older = trendData.slice(-14, -7);
    const recentAvg = recent.reduce((sum, d) => sum + d.utilization, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.utilization, 0) / older.length;
    return recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';
  };

  const trendDirection = getTrendDirection();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📈 Portfolio Utilization Trend - Last 90 Days
        </h3>
        <div className="text-sm text-gray-500">
          Daily Portfolio Metrics
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-6">
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Target zone (70-90%) */}
            <rect x="0" y="60" width="100%" height="80" fill="#dcfce7" opacity="0.3" />
            <text x="10" y="55" className="text-xs fill-green-600 font-medium">Target Zone (70-90%)</text>
            
            {/* Trend line */}
            <polyline
              points={trendData.map((point, index) => 
                `${(index / (trendData.length - 1)) * 800},${200 - (point.utilization / 100) * 200}`
              ).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              className="hover:stroke-blue-600"
            />
            
            {/* Rolling averages */}
            <polyline
              points={trendData.map((point, index) => 
                `${(index / (trendData.length - 1)) * 800},${200 - (point.rolling7Day / 100) * 200}`
              ).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="5,5"
            />
            
            {/* Data points */}
            {trendData.map((point, index) => (
              <circle
                key={index}
                cx={(index / (trendData.length - 1)) * 800}
                cy={200 - (point.utilization / 100) * 200}
                r="3"
                fill="#3b82f6"
                className="hover:r-4 hover:fill-blue-600 cursor-pointer"
                onClick={() => onDateClick?.(point.date)}
              />
            ))}
            
            {/* Y-axis labels */}
            <text x="10" y="20" className="text-xs fill-gray-600">100%</text>
            <text x="10" y="60" className="text-xs fill-gray-600">90%</text>
            <text x="10" y="100" className="text-xs fill-gray-600">80%</text>
            <text x="10" y="140" className="text-xs fill-gray-600">70%</text>
            <text x="10" y="180" className="text-xs fill-gray-600">60%</text>
            <text x="10" y="200" className="text-xs fill-gray-600">50%</text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-sm text-gray-600">Daily Utilization</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2"></div>
            <span className="text-sm text-gray-600">7-Day Average</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{currentUtilization.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Current</div>
          <div className={`text-xs ${momChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {momChange >= 0 ? '↑' : '↓'} {Math.abs(momChange).toFixed(1)}% vs prior month
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{trendData[trendData.length - 1]?.rolling7Day.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">7-Day Average</div>
          <div className="text-xs text-gray-500">Stable</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{trendData[trendData.length - 1]?.rolling30Day.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">30-Day Average</div>
          <div className={`text-xs ${trendDirection === 'down' ? 'text-red-600' : 'text-green-600'}`}>
            {trendDirection === 'down' ? '↓' : trendDirection === 'up' ? '↑' : '→'} Trending {trendDirection}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{peakUtilization.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Peak</div>
          <div className="text-xs text-gray-500">{peakDate}</div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Trend Analysis:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-red-600">📉</span>
            <span className="text-gray-700">
              <strong>Declining Trend:</strong> Portfolio utilization down from {peakUtilization.toFixed(1)}% peak ({peakDate}) to {currentUtilization.toFixed(1)}% current
            </span>
          </div>
          <div className="text-gray-600 ml-6">
            <strong>Root Causes:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>5 new customers onboarded (early adoption phase)</li>
              <li>3 customers completed major projects (reduced daily usage)</li>
              <li>Summer seasonality effects normalizing</li>
            </ul>
          </div>
          <div className="flex items-start space-x-2 mt-3">
            <span className="text-orange-600">🎯</span>
            <span className="text-gray-700">
              <strong>Action Items:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Monitor 3 accounts showing &gt;15% decline in last 30 days</li>
                <li>Schedule QBRs with 2 post-project accounts to identify new use cases</li>
                <li>Accelerate onboarding for 5 new customers (currently 45-60 days TTFV)</li>
              </ul>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
          📊 View Account-Level Trends
        </button>
        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
          📅 Overlay Events
        </button>
        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
          📈 Forecast Next Quarter
        </button>
      </div>
    </div>
  );
}
