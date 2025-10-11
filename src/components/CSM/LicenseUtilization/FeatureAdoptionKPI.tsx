'use client';

import React, { useState, useEffect } from 'react';
import { calculateFeatureAdoptionKPI } from '../../../lib/kpis/licenseUtilizationKPIs';

interface FeatureAdoptionKPIProps {
  onDrillDown?: () => void;
  drillDownUrl?: string;
}

export function FeatureAdoptionKPI({ onDrillDown, drillDownUrl }: FeatureAdoptionKPIProps) {
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const calculatedKPI = calculateFeatureAdoptionKPI();
      setKpi(calculatedKPI);
      setLoading(false);
    } catch (error) {
      console.error('Error loading Feature Adoption KPI:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!kpi) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-red-600">Error loading feature adoption data</div>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (kpi.status) {
      case 'success': return 'from-blue-50 to-blue-100';
      case 'warning': return 'from-cyan-50 to-cyan-100';
      case 'danger': return 'from-slate-50 to-slate-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const getTextColor = () => {
    switch (kpi.status) {
      case 'success': return 'text-blue-700';
      case 'warning': return 'text-cyan-700';
      case 'danger': return 'text-slate-700';
      default: return 'text-gray-700';
    }
  };

  const getProgressColor = () => {
    switch (kpi.status) {
      case 'success': return 'bg-blue-500';
      case 'warning': return 'bg-cyan-500';
      case 'danger': return 'bg-slate-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = () => {
    if (kpi.trend === 'stable') return 'text-gray-600';
    return kpi.trend === 'up' ? 'text-blue-600' : 'text-slate-600';
  };

  const getPerformanceText = () => {
    if (kpi.value >= 60) return 'Excellent';
    if (kpi.value >= 40) return 'Good';
    if (kpi.value >= 20) return 'Needs Attention';
    return 'Critical';
  };

  const getProgressPercentage = () => {
    return Math.min((kpi.value / 100) * 100, 100);
  };

  const handleClick = () => {
    if (drillDownUrl) {
      window.location.href = drillDownUrl;
    } else if (onDrillDown) {
      onDrillDown();
    }
  };

  return (
    <div 
      className={`
        group relative rounded-xl shadow-md border border-gray-200 p-6 h-64 transition-all duration-300
        bg-gradient-to-br ${getStatusColor()}
        ${(drillDownUrl || onDrillDown) ? 'cursor-pointer hover:shadow-xl hover:scale-102 hover:-translate-y-1' : ''}
        transform-gpu
      `}
      onClick={handleClick}
    >
      <div className="relative h-full flex flex-col">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl opacity-90">
            🚀
          </div>
          <div className={`text-sm font-bold ${getTrendColor()} flex flex-col items-end`}>
            <div className="flex items-center gap-1">
              {getTrendIcon()} {kpi.change}
            </div>
            <div className="text-xs font-medium opacity-90">
              (QoQ)
            </div>
          </div>
        </div>
        
        {/* Title */}
        <div className={`text-sm font-semibold ${getTextColor()} mb-1 leading-tight`}>
          Feature Adoption Velocity
        </div>
        
        {/* Main Value */}
        <div className={`text-3xl font-bold ${getTextColor()} mb-2 leading-none`}>
          {kpi.formatted}
        </div>
        
        {/* Subtitle/Description */}
        <div className="text-xs text-gray-600 mb-3">
          Target: {kpi.target}%
        </div>
        
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`${getProgressColor()} h-1.5 rounded-full transition-all duration-300`}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
        
        {/* Spacer for consistent layout */}
        <div className="flex-grow"></div>
        
        {/* Footer with performance status */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">
            Performance
          </span>
          <span className={`text-xs font-bold ${getTextColor()}`}>
            {getPerformanceText()}
          </span>
        </div>
        
        {/* Click indicator for drill-down */}
        {(drillDownUrl || onDrillDown) && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={`w-2 h-2 ${getProgressColor()} rounded-full`}></div>
          </div>
        )}
      </div>
    </div>
  );
}
