'use client';

/**
 * Premium KPI Card Component
 * 
 * This is the STANDARD card design for all dashboards (CSM, CO, SE)
 * Design matches Commercial Operations Command Center style
 * 
 * Features:
 * - Pastel gradient background
 * - Colored circular icon (top-left)
 * - Trend indicator with arrow (top-right)
 * - Large bold value display
 * - Progress bar
 * - Performance badge
 * - Hover effects and shadows
 * 
 * DO NOT MODIFY without updating all persona dashboards
 */

interface PremiumKPICardProps {
  // Card Identification
  title: string;
  subtitle: string;
  
  // Main Value
  value: string;
  
  // Icon Configuration
  icon: React.ReactNode;
  iconBgColor: string; // e.g., 'bg-blue-500'
  
  // Background Theme
  gradientFrom: string; // e.g., 'from-blue-50'
  gradientTo: string;   // e.g., 'to-blue-100/50'
  borderColor: string;  // e.g., 'border-blue-200/50'
  
  // Trend Indicator
  trend: string;        // e.g., '+3.2pp' or '-7%'
  trendDirection: 'up' | 'down';
  trendLabel: string;   // e.g., 'On Target' or 'Critical'
  
  // Progress Bar
  progressPercent: number; // 0-100
  progressBgColor: string; // e.g., 'bg-blue-200'
  progressFillColor: string; // e.g., 'bg-blue-600'
  
  // Performance Badge
  performance: 'Good' | 'Critical' | 'Warning';
  
  // Interactivity
  onClick?: () => void;
  clickable?: boolean;
}

export default function PremiumKPICard({
  title,
  subtitle,
  value,
  icon,
  iconBgColor,
  gradientFrom,
  gradientTo,
  borderColor,
  trend,
  trendDirection,
  trendLabel,
  progressPercent,
  progressBgColor,
  progressFillColor,
  performance,
  onClick,
  clickable = false
}: PremiumKPICardProps) {
  
  const performanceConfig = {
    Good: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      dotColor: 'bg-green-500'
    },
    Critical: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      dotColor: 'bg-red-500'
    },
    Warning: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      dotColor: 'bg-yellow-500'
    }
  };

  const trendConfig = trendDirection === 'up' 
    ? { color: 'text-green-600', arrow: '↗', dotColor: 'bg-green-500' }
    : { color: 'text-red-600', arrow: '↘', dotColor: 'bg-red-500' };

  return (
    <div 
      onClick={clickable ? onClick : undefined}
      className={`
        bg-gradient-to-br ${gradientFrom} ${gradientTo}
        rounded-2xl p-6 shadow-md hover:shadow-xl transition-all
        border ${borderColor}
        ${clickable ? 'cursor-pointer' : ''}
      `}
    >
      {/* Icon and Trend */}
      <div className="flex items-start justify-between mb-4">
        {/* Colored Icon */}
        <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        
        {/* Trend Indicator */}
        <div className="text-right">
          <div className={`flex items-center gap-1 text-sm font-bold mb-1 ${trendConfig.color}`}>
            <span>{trendConfig.arrow}</span>
            <span>{trend}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendConfig.color}`}>
            <span className={`w-2 h-2 rounded-full ${trendConfig.dotColor}`}></span>
            <span>{trendLabel}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="text-5xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className={`w-full ${progressBgColor} rounded-full h-2`}>
          <div 
            className={`${progressFillColor} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Performance Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">Performance</span>
        <span 
          className={`
            px-3 py-1 rounded-full text-xs font-bold
            ${performanceConfig[performance].bgColor}
            ${performanceConfig[performance].textColor}
          `}
        >
          {performance}
        </span>
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Blue Card (NRR)
 * <PremiumKPICard
 *   title="Net Revenue Retention"
 *   subtitle="Current Quarter"
 *   value="114.8%"
 *   icon={<TrendUpIcon />}
 *   iconBgColor="bg-blue-500"
 *   gradientFrom="from-blue-50"
 *   gradientTo="to-blue-100/50"
 *   borderColor="border-blue-200/50"
 *   trend="+3.2pp"
 *   trendDirection="up"
 *   trendLabel="On Target"
 *   progressPercent={100}
 *   progressBgColor="bg-blue-200"
 *   progressFillColor="bg-blue-600"
 *   performance="Good"
 *   clickable={true}
 *   onClick={() => handleDrillDown()}
 * />
 * 
 * // Green Card (Expansion ARR)
 * <PremiumKPICard
 *   title="Expansion ARR"
 *   subtitle="YTD vs target"
 *   value="$10.3M"
 *   icon={<DollarIcon />}
 *   iconBgColor="bg-green-500"
 *   gradientFrom="from-green-50"
 *   gradientTo="to-green-100/50"
 *   borderColor="border-green-200/50"
 *   trend="+18%"
 *   trendDirection="up"
 *   trendLabel="On Target"
 *   progressPercent={75}
 *   progressBgColor="bg-green-200"
 *   progressFillColor="bg-green-600"
 *   performance="Good"
 * />
 * 
 * // Orange Card (Critical)
 * <PremiumKPICard
 *   title="White Space Opportunity"
 *   subtitle="YTD Identified"
 *   value="$16.9M"
 *   icon={<TargetIcon />}
 *   iconBgColor="bg-orange-500"
 *   gradientFrom="from-orange-50"
 *   gradientTo="to-orange-100/50"
 *   borderColor="border-orange-200/50"
 *   trend="-7%"
 *   trendDirection="down"
 *   trendLabel="Hot List"
 *   progressPercent={85}
 *   progressBgColor="bg-orange-200"
 *   progressFillColor="bg-orange-600"
 *   performance="Critical"
 * />
 */
