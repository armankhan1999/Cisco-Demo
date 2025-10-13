'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StrategicKPICardProps {
  title: string;
  value: string;
  unit: string;
  target: string;
  trend: number;
  status: 'good' | 'warning' | 'critical';
  icon: ReactNode;
  description: string;
  color: 'blue' | 'green' | 'emerald' | 'orange' | 'purple' | 'indigo' | 'teal' | 'cyan';
  customBgColor?: string;
}

export default function StrategicKPICard({
  title,
  value,
  unit,
  target,
  trend,
  status,
  icon,
  description,
  color,
  customBgColor
}: StrategicKPICardProps) {
  
  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        border: 'border-blue-200',
        iconBg: 'bg-blue-500',
        iconColor: 'text-white',
        valueColor: 'text-blue-900',
        titleColor: 'text-blue-700'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        border: 'border-green-200',
        iconBg: 'bg-green-500',
        iconColor: 'text-white',
        valueColor: 'text-green-900',
        titleColor: 'text-green-700'
      },
      emerald: {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-500',
        iconColor: 'text-white',
        valueColor: 'text-emerald-900',
        titleColor: 'text-emerald-700'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        border: 'border-orange-200',
        iconBg: 'bg-orange-500',
        iconColor: 'text-white',
        valueColor: 'text-orange-900',
        titleColor: 'text-orange-700'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        border: 'border-purple-200',
        iconBg: 'bg-purple-500',
        iconColor: 'text-white',
        valueColor: 'text-purple-900',
        titleColor: 'text-purple-700'
      },
      indigo: {
        bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-500',
        iconColor: 'text-white',
        valueColor: 'text-indigo-900',
        titleColor: 'text-indigo-700'
      },
      teal: {
        bg: 'bg-gradient-to-br from-teal-50 to-teal-100',
        border: 'border-teal-200',
        iconBg: 'bg-teal-500',
        iconColor: 'text-white',
        valueColor: 'text-teal-900',
        titleColor: 'text-teal-700'
      },
      cyan: {
        bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
        border: 'border-cyan-200',
        iconBg: 'bg-cyan-500',
        iconColor: 'text-white',
        valueColor: 'text-cyan-900',
        titleColor: 'text-cyan-700'
      }
    };
    return colors[color];
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'good':
        return {
          dot: 'bg-green-500',
          text: 'text-green-700',
          bg: 'bg-green-100',
          label: 'On Target'
        };
      case 'warning':
        return {
          dot: 'bg-yellow-500',
          text: 'text-yellow-700',
          bg: 'bg-yellow-100',
          label: 'At Risk'
        };
      case 'critical':
        return {
          dot: 'bg-red-500',
          text: 'text-red-700',
          bg: 'bg-red-100',
          label: 'Critical'
        };
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
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

  const colorClasses = getColorClasses();
  const statusIndicator = getStatusIndicator();

  return (
    <div
      className={`${customBgColor ? '' : colorClasses.bg} ${colorClasses.border} border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden`}
      style={customBgColor ? { backgroundColor: customBgColor } : undefined}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
      </div>

      {/* Header with Icon and Status */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`${colorClasses.iconBg} p-3 rounded-xl shadow-lg`}>
          <div className={colorClasses.iconColor}>
            {icon}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {getTrendIcon()}
            <span className={`text-sm font-bold ${getTrendColor()}`}>
              {trend !== 0 && (trend > 0 ? '+' : '')}{trend}%
            </span>
          </div>
          <div className={`${statusIndicator.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
            <div className={`w-2 h-2 rounded-full ${statusIndicator.dot}`}></div>
            <span className={`text-xs font-medium ${statusIndicator.text}`}>
              {statusIndicator.label}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-sm font-semibold ${colorClasses.titleColor} mb-2 relative z-10`}>
        {title}
      </h3>

      {/* Value */}
      <div className="mb-3 relative z-10">
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${colorClasses.valueColor}`}>
            {value}
          </span>
          <span className={`text-lg font-medium ${colorClasses.titleColor}`}>
            {unit}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{target}</p>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-4 line-clamp-2 relative z-10">
        {description}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-white/50 rounded-full h-2 relative z-10">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            status === 'good' ? colorClasses.iconBg : 
            status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ 
            width: status === 'good' ? '90%' : status === 'warning' ? '65%' : '40%' 
          }}
        ></div>
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between mt-3 relative z-10">
        <span className="text-xs text-gray-500 font-medium">Performance</span>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-bold ${statusIndicator.text} capitalize`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
