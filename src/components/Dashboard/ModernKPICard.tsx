'use client';

interface ModernKPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendDirection: 'up' | 'down';
  target: string;
  performance: 'Good' | 'Critical' | 'Warning';
  icon: string;
  iconColor: string;
  backgroundColor: string;
  onClick?: () => void;
}

export default function ModernKPICard({
  title,
  value,
  subtitle,
  trend,
  trendDirection,
  target,
  performance,
  icon,
  iconColor,
  backgroundColor,
  onClick
}: ModernKPICardProps) {
  
  const performanceColors = {
    Good: '#10b981',
    Critical: '#ef4444',
    Warning: '#f59e0b'
  };

  const performanceBackgrounds = {
    Good: '#d1fae5',
    Critical: '#fee2e2',
    Warning: '#fef3c7'
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl p-6 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: iconColor }}
        >
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`flex items-center gap-1 text-sm font-bold ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trendDirection === 'up' ? '↗' : '↘'}</span>
            <span>{trend}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: trendDirection === 'up' ? '#10b981' : '#ef4444' }}></span>
            <span>{target}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="text-4xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: performance === 'Good' ? '85%' : performance === 'Warning' ? '60%' : '30%',
              backgroundColor: performanceColors[performance]
            }}
          ></div>
        </div>
      </div>

      {/* Performance Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">Performance</span>
        <span 
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ 
            backgroundColor: performanceBackgrounds[performance],
            color: performanceColors[performance]
          }}
        >
          {performance}
        </span>
      </div>
    </div>
  );
}
