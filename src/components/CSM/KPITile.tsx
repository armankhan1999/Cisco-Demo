'use client';

import React from 'react';
import Link from 'next/link';
import { KPIResult } from '@/lib/kpis/csmKPICalculations';

interface KPITileProps {
  title: string;
  kpi: KPIResult;
  onClick?: () => void;
  drillDownUrl?: string;
}

export function KPITile({ title, kpi, onClick, drillDownUrl }: KPITileProps) {
  // Status-based background colors (following health score matrix)
  // Success (Green): 76-100 = Thriving/Healthy
  // Warning (Orange): 60-75 = Stable
  // Danger (Red): 0-59 = At Risk/Critical
  const statusColors = {
    success: 'bg-gradient-to-br from-green-50 to-green-100',
    warning: 'bg-gradient-to-br from-orange-50 to-orange-100', 
    danger: 'bg-gradient-to-br from-red-50 to-red-100'
  };

  // Status-based text colors
  const statusTextColors = {
    success: 'text-green-700',
    warning: 'text-orange-700',
    danger: 'text-red-700'
  };

  // Status-based progress bar colors
  const statusProgressColors = {
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    danger: 'bg-red-500'
  };

  // Get colors based on KPI status (not random)
  const getTileColor = () => {
    return statusColors[kpi.status];
  };

  const getTextColor = () => {
    return statusTextColors[kpi.status];
  };

  const getProgressBarColor = () => {
    return statusProgressColors[kpi.status];
  };

  // Icons for different KPI types
  const getKPIIcon = () => {
    if (title.includes('GRR') || title.includes('Revenue')) return '💰';
    if (title.includes('Health')) return '⚕️';
    if (title.includes('At-Risk')) return '⚠️';
    if (title.includes('Renewal')) return '🔄';
    if (title.includes('Churn')) return '📉';
    if (title.includes('Utilization')) return '📊';
    if (title.includes('Adoption')) return '🚀';
    if (title.includes('Engagement')) return '👥';
    if (title.includes('Time to Value')) return '⏱️';
    if (title.includes('QBR')) return '📋';
    return '📈'; // Default icon
  };
  
  const trendIcons = {
    up: '↗',
    down: '↘',
    stable: '→'
  };
  
  // Trend colors based on metric type and direction
  // Green = Good, Red = Bad, Gray = Neutral/Stable
  const getTrendColor = () => {
    if (!kpi.trend || kpi.trend === 'stable') return 'text-gray-600';
    
    // Metrics where LOWER is BETTER (down trend = green, up trend = red)
    const lowerIsBetter = [
      'At-Risk',
      'Churn',
      'Time to Value',
      'TTV',
      'Days',
      'Cycle Time',
      'DSO'
    ];
    
    const isLowerBetter = lowerIsBetter.some(metric => title.includes(metric));
    
    if (isLowerBetter) {
      // Down is good (green), Up is bad (red)
      return kpi.trend === 'down' ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
    } else {
      // Up is good (green), Down is bad (red) - for GRR, Health, Utilization, Adoption, etc.
      return kpi.trend === 'up' ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
    }
  };

  // Get performance status text
  const getPerformanceText = () => {
    switch (kpi.status) {
      case 'success': return 'Good';
      case 'warning': return 'On Target';
      case 'danger': return 'Critical';
      default: return 'Good';
    }
  };

  // Calculate progress percentage for the progress bar
  const getProgressPercentage = () => {
    if (!kpi.target) return 75; // Default progress
    const current = typeof kpi.value === 'number' ? kpi.value : parseFloat(kpi.formatted.replace(/[^0-9.-]/g, ''));
    const progress = Math.min(100, Math.max(0, (current / kpi.target) * 100));
    return progress;
  };
  
  const isClickable = !!(drillDownUrl || onClick);
  
  // Get colors based on actual KPI status
  const tileColor = getTileColor();
  const textColorClass = getTextColor();
  const progressBarClass = getProgressBarColor();
  
  const content = (
    <div className="relative h-full flex flex-col">
      {/* Header with icon and 30-day trend */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl opacity-90">
          {getKPIIcon()}
        </div>
        {kpi.trend && (
          <div className={`text-sm font-bold ${getTrendColor()} flex flex-col items-end`}>
            <div className="flex items-center gap-1">
              {trendIcons[kpi.trend]} {kpi.change}
            </div>
            <div className="text-xs font-medium opacity-90">
              (30d)
            </div>
          </div>
        )}
      </div>
      
      {/* Title */}
      <div className={`text-sm font-semibold ${textColorClass} mb-1 leading-tight`}>
        {title}
      </div>
      
      {/* Main Value */}
      <div className={`text-4xl font-bold ${textColorClass} mb-2 leading-none`}>
        {kpi.formatted}
      </div>
      
      {/* Subtitle/Description */}
      <div className="text-xs text-gray-600 mb-4 flex-grow">
        {kpi.target ? `≥ ${kpi.target}` : 'Current Period'}
        <br />
        <span className="text-gray-500">
          {title.includes('GRR') && 'Average days from quote creation to payment received'}
          {title.includes('Health') && 'Average health score across all accounts'}
          {title.includes('At-Risk') && 'ARR at risk in next 90 days'}
          {title.includes('Renewal') && 'Percentage of renewals successfully completed'}
          {title.includes('Churn') && 'Annual churn rate based on ARR'}
          {title.includes('Utilization') && 'Average license utilization across portfolio'}
          {title.includes('Adoption') && 'Feature adoption rate across customers'}
          {title.includes('Engagement') && 'Customer engagement composite score'}
          {title.includes('Time to Value') && 'Average days to realize value'}
          {title.includes('QBR') && 'Percentage of QBRs completed on schedule'}
          {!title.includes('GRR') && !title.includes('Health') && !title.includes('At-Risk') && 
           !title.includes('Renewal') && !title.includes('Churn') && !title.includes('Utilization') && 
           !title.includes('Adoption') && !title.includes('Engagement') && !title.includes('Time to Value') && 
           !title.includes('QBR') && 'Performance metric'}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${progressBarClass} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Footer with performance status */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">
          Performance
        </span>
        <span className={`text-xs font-bold ${textColorClass}`}>
          {getPerformanceText()}
        </span>
      </div>
      
      {/* Click indicator for drill-down */}
      {drillDownUrl && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`w-2 h-2 ${progressBarClass} rounded-full`}></div>
        </div>
      )}
    </div>
  );

  if (drillDownUrl) {
    return (
      <Link
        href={drillDownUrl}
        className={`
          group block relative rounded-xl shadow-md border border-gray-200 p-6 h-64 transition-all duration-300
          ${tileColor}
          cursor-pointer hover:shadow-xl hover:scale-102 hover:-translate-y-1
          transform-gpu
        `}
      >
        {content}
      </Link>
    );
  }
  
  return (
    <div
      className={`
        group relative rounded-xl shadow-md border border-gray-200 p-6 h-64 transition-all duration-300
        ${tileColor}
        ${isClickable ? 'cursor-pointer hover:shadow-xl hover:scale-102 hover:-translate-y-1' : ''}
        transform-gpu
      `}
      onClick={onClick}
    >
      {content}
    </div>
  );
}

