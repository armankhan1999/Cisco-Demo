'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  target: string;
  trend: number;
  status: 'good' | 'warning' | 'critical';
  icon: ReactNode;
  description: string;
  customBgColor?: string;
}

export default function KPICard({ title, value, target, trend, status, icon, description, customBgColor }: KPICardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          progressBg: 'bg-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          progressBg: 'bg-yellow-500'
        };
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          progressBg: 'bg-red-500'
        };
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    if (trend > 0) {
      return 'text-green-600';
    } else if (trend < 0) {
      return 'text-red-600';
    } else {
      return 'text-gray-500';
    }
  };

  const colors = getStatusColor();

  return (
    <div
      className={`${customBgColor ? '' : colors.bg} ${colors.border} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
      style={customBgColor ? { backgroundColor: customBgColor } : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.iconBg} p-3 rounded-lg`}>
          <div className={colors.iconColor}>
            {icon}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trend !== 0 && (trend > 0 ? '+' : '')}{trend}%
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

      {/* Value */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500">{target}</p>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-4 line-clamp-2">{description}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colors.progressBg} transition-all duration-500`}
          style={{ 
            width: status === 'good' ? '85%' : status === 'warning' ? '65%' : '40%' 
          }}
        ></div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">Performance</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${colors.progressBg}`}></div>
          <span className={`text-xs font-medium ${colors.iconColor} capitalize`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
