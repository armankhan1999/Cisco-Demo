'use client';

import React, { useState, useEffect } from 'react';
import { getUtilizationTrendData } from '../../../lib/kpis/licenseUtilizationKPIs';

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
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    try {
      // Get real utilization trend data for last 90 days
      const realTrendData = getUtilizationTrendData(90);
      
      if (realTrendData.length === 0) {
        console.warn('No real trend data available, using fallback');
        setTrendData([]);
        setLoading(false);
        return;
      }
      
      let processedData: TrendDataPoint[];
      
      if (viewMode === 'monthly') {
        // Group by month and calculate monthly averages
        const monthlyGroups = new Map<string, any[]>();
        realTrendData.forEach(point => {
          const monthKey = point.date.substring(0, 7); // YYYY-MM
          if (!monthlyGroups.has(monthKey)) {
            monthlyGroups.set(monthKey, []);
          }
          monthlyGroups.get(monthKey)!.push(point);
        });
        
        processedData = Array.from(monthlyGroups.entries()).map(([month, points]) => {
          const avgUtilization = points.reduce((sum, p) => sum + p.utilization, 0) / points.length;
          const totalActiveUsers = points.reduce((sum, p) => sum + p.totalUsed, 0);
          const totalUnusedCapacity = points.reduce((sum, p) => sum + p.totalAvailable, 0);
          
          return {
            date: `${month}-01`, // First day of month for display
            utilization: avgUtilization,
            activeUsers: Math.round(totalActiveUsers / points.length),
            unusedCapacity: Math.round(totalUnusedCapacity / points.length),
          rolling7Day: 0, // Will be calculated below
          rolling30Day: 0 // Will be calculated below
          };
        });
      } else {
        // Daily view - use original data
        processedData = realTrendData.map(point => ({
          date: point.date,
          utilization: point.utilization,
          activeUsers: point.totalUsed,
          unusedCapacity: point.totalAvailable,
          rolling7Day: 0, // Will be calculated below
          rolling30Day: 0 // Will be calculated below
        }));
      }
      
      // Calculate rolling averages based on view mode
      processedData.forEach((point, index) => {
        const windowSize = viewMode === 'monthly' ? 3 : 7; // 3 months vs 7 days
        const startWindow = Math.max(0, index - (windowSize - 1));
        
        const windowData = processedData.slice(startWindow, index + 1);
        point.rolling7Day = windowData.reduce((sum, p) => sum + p.utilization, 0) / windowData.length;
        point.rolling30Day = point.rolling7Day; // For monthly view, use same as 7-day
      });
      
      setTrendData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading real trend data:', error);
      setLoading(false);
    }
  }, [viewMode]);

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

  if (trendData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Portfolio Utilization Trend - Last 90 Days
          </h3>
          <p className="text-gray-600 mb-4">
            No utilization data available for the last 90 days
          </p>
          <p className="text-sm text-gray-500">
            Data will appear once utilization tracking begins
          </p>
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

  // Dynamic scale calculation
  const dataRange = peakUtilization - troughUtilization;
  const padding = Math.max(dataRange * 0.1, 0.5); // 10% padding or minimum 0.5%
  const minScale = Math.max(0, troughUtilization - padding);
  const maxScale = Math.min(100, peakUtilization + padding);
  const scaleRange = maxScale - minScale;

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
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'daily'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
          </div>
        <div className="text-sm text-gray-500">
            {viewMode === 'daily' ? 'Daily Portfolio Metrics' : 'Monthly Portfolio Metrics'}
          </div>
          {/* Dynamic Scale Indicator */}
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Scale: {minScale.toFixed(1)}% - {maxScale.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-6">
        <div className="h-96 relative">
          <svg className="w-full h-full" viewBox="0 0 900 350" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect x="60" y="20" width="820" height="280" fill="url(#grid)" />
            
            {/* Y-axis */}
            <line x1="60" y1="20" x2="60" y2="300" stroke="#9ca3af" strokeWidth="2" />
            
            {/* X-axis */}
            <line x1="60" y1="300" x2="880" y2="300" stroke="#9ca3af" strokeWidth="2" />
            
            {/* Target zone - dynamic scaling */}
            {(() => {
              const targetMin = 70;
              const targetMax = 90;
              
              // Only show target zone if it's within the visible range
              if (targetMax >= minScale && targetMin <= maxScale) {
                const targetMinY = 300 - ((Math.max(targetMin, minScale) - minScale) / scaleRange) * 280;
                const targetMaxY = 300 - ((Math.min(targetMax, maxScale) - minScale) / scaleRange) * 280;
                const targetHeight = targetMaxY - targetMinY;
                
                return (
                  <>
                    <rect x="60" y={targetMinY} width="820" height={targetHeight} fill="#dcfce7" opacity="0.3" />
                    <text x="70" y={targetMinY - 5} className="text-xs fill-green-600 font-semibold">
                      Target Zone (70-90%)
                    </text>
                  </>
                );
              }
              return null;
            })()}
            
            {/* Y-axis labels - dynamic scale */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const value = minScale + (ratio * scaleRange);
              const y = 300 - (ratio * 280);
              return (
                <text key={ratio} x="50" y={y + 4} textAnchor="end" className="text-xs fill-gray-700 font-medium">
                  {value.toFixed(1)}%
                </text>
              );
            })}
            
            {/* Horizontal grid lines at each label */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 300 - (ratio * 280);
              return (
                <line key={ratio} x1="60" y1={y} x2="880" y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              );
            })}
            
            {/* Trend line - with dynamic scaling */}
            <polyline
              points={trendData.map((point, index) => {
                const x = 60 + (index / (trendData.length - 1)) * 820;
                const normalizedValue = (point.utilization - minScale) / scaleRange;
                const y = 300 - (normalizedValue * 280);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              className="hover:stroke-blue-700 transition-colors"
            />
            
            {/* Rolling average - with dynamic scaling */}
            <polyline
              points={trendData.map((point, index) => {
                const x = 60 + (index / (trendData.length - 1)) * 820;
                const normalizedValue = (point.rolling7Day - minScale) / scaleRange;
                const y = 300 - (normalizedValue * 280);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="8,4"
              opacity="0.7"
            />
            
            {/* X-axis date labels - adjust based on view mode */}
            {trendData.filter((_, index) => {
              const interval = viewMode === 'monthly' ? 1 : 15; // Show every month or every 15 days
              return index % interval === 0 || index === trendData.length - 1;
            }).map((point, idx, filtered) => {
              const index = trendData.indexOf(point);
              const x = 60 + (index / (trendData.length - 1)) * 820;
              const dateObj = new Date(point.date);
              const label = viewMode === 'monthly' 
                ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
                : `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
              return (
                <text 
                  key={index} 
                  x={x} 
                  y="320" 
                  textAnchor="middle" 
                  className="text-xs fill-gray-600 font-medium"
                >
                  {label}
                </text>
              );
            })}
            
            {/* Data points - show every 3rd point to avoid clutter */}
            {trendData.filter((_, index) => index % 3 === 0).map((point) => {
              const index = trendData.indexOf(point);
              const x = 60 + (index / (trendData.length - 1)) * 820;
              const normalizedValue = (point.utilization - minScale) / scaleRange;
              const y = 300 - (normalizedValue * 280);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  className="hover:r-6 hover:fill-blue-700 cursor-pointer transition-all"
                  onClick={() => onDateClick?.(point.date)}
                />
              );
            })}
            
            {/* Y-axis label */}
            <text x="20" y="160" textAnchor="middle" className="text-sm fill-gray-700 font-semibold" transform="rotate(-90, 20, 160)">
              Utilization %
            </text>
            
            {/* X-axis label */}
            <text x="470" y="345" textAnchor="middle" className="text-sm fill-gray-700 font-semibold">
              Date (Last 90 Days)
            </text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-sm text-gray-600">
              {viewMode === 'daily' ? 'Daily Utilization' : 'Monthly Utilization'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2"></div>
            <span className="text-sm text-gray-600">
              {viewMode === 'daily' ? '7-Day Average' : '3-Month Average'}
            </span>
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
          <div className="text-sm text-gray-600">
            {viewMode === 'daily' ? '7-Day Average' : '3-Month Average'}
          </div>
          <div className="text-xs text-gray-500">Stable</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{trendData[trendData.length - 1]?.rolling30Day.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">
            {viewMode === 'daily' ? '30-Day Average' : 'Overall Trend'}
          </div>
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
            <span className={trendDirection === 'down' ? 'text-red-600' : trendDirection === 'up' ? 'text-green-600' : 'text-blue-600'}>
              {trendDirection === 'down' ? '📉' : trendDirection === 'up' ? '📈' : '📊'}
            </span>
            <span className="text-gray-700">
              <strong>
                {trendDirection === 'down' ? 'Declining' : trendDirection === 'up' ? 'Rising' : 'Stable'} Trend:
              </strong> Portfolio utilization {trendDirection === 'down' ? 'down' : trendDirection === 'up' ? 'up' : 'stable'} from {peakUtilization.toFixed(1)}% peak ({peakDate}) to {currentUtilization.toFixed(1)}% current
            </span>
          </div>
          <div className="text-gray-600 ml-6">
            <strong>Key Insights:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Current utilization: {currentUtilization.toFixed(1)}% (Target: 70-90%)</li>
              <li>
                {viewMode === 'daily' ? '7-day average' : '3-month average'}: {trendData[trendData.length - 1]?.rolling7Day.toFixed(1)}%
              </li>
              <li>
                {viewMode === 'daily' ? '30-day average' : 'Overall trend'}: {trendData[trendData.length - 1]?.rolling30Day.toFixed(1)}%
              </li>
              <li>
                {viewMode === 'daily' ? 'Month-over-month change' : 'Period-over-period change'}: {momChange >= 0 ? '+' : ''}{momChange.toFixed(1)}%
              </li>
            </ul>
          </div>
          <div className="flex items-start space-x-2 mt-3">
            <span className="text-orange-600">🎯</span>
            <span className="text-gray-700">
              <strong>Recommended Actions:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {currentUtilization < 70 && (
                  <li>Focus on adoption programs - utilization below target zone</li>
                )}
                {trendDirection === 'down' && (
                  <li>Investigate accounts with declining utilization patterns</li>
                )}
                {peakUtilization > 90 && (
                  <li>Monitor for overage risks and capacity planning needs</li>
                )}
                <li>Schedule QBRs with accounts showing significant changes</li>
                <li>Review onboarding effectiveness for new customers</li>
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
