import React from 'react';

interface UtilizationMetricsProps {
  utilization: {
    rate: number;
    totalLicenses: number;
    activeUsers: number;
    unusedLicenses: number;
    trend: string;
    history?: any[];
  };
}

export default function UtilizationMetrics({ utilization }: UtilizationMetricsProps) {
  const getUtilizationColor = (rate: number) => {
    if (rate >= 70) return 'text-green-700 bg-green-50';
    if (rate >= 40) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  const annualSeatCost = 95 * 12; // $95/seat/month
  const annualWaste = utilization.unusedLicenses * annualSeatCost;
  const unusedPercentage = (utilization.unusedLicenses / utilization.totalLicenses) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📊 UTILIZATION METRICS
      </h2>
      
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg font-medium">Current Utilization:</span>
          <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${getUtilizationColor(utilization.rate)}`}>
            {utilization.rate.toFixed(0)}% {utilization.rate < 40 ? '🔴 (Critical Underutilization)' : ''}
          </span>
        </div>

        {/* Licensed Capacity */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="font-medium text-gray-700 mb-3">Licensed Capacity:</div>
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <span className="text-sm">Total Licensed: <strong>{utilization.totalLicenses} seats</strong></span>
            <span className="text-sm">Used: <strong className="text-green-600">{utilization.activeUsers} seats</strong></span>
            <span className="text-sm">Unused: <strong className="text-red-600">{utilization.unusedLicenses} seats ({unusedPercentage.toFixed(0)}%)</strong></span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-8 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center px-2 text-white font-bold text-sm"
              style={{ width: `${utilization.rate}%` }}
            >
              {utilization.rate.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* 90-Day Statistics */}
        {utilization.history && utilization.history.length > 0 && (() => {
          // Calculate 90-day statistics from history
          const now = new Date();
          const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          
          const last90Days = utilization.history.filter((h: any) => {
            const date = new Date(h.snapshot_date);
            return date >= ninetyDaysAgo;
          });
          
          if (last90Days.length > 0) {
            const utilizationRates = last90Days.map((h: any) => {
              const total = h.total_licenses || 1;
              const active = h.active_users || 0;
              return { rate: (active / total) * 100, date: h.snapshot_date, total, active };
            });
            
            const avgRate = utilizationRates.reduce((sum, u) => sum + u.rate, 0) / utilizationRates.length;
            const maxUtil = utilizationRates.reduce((max, u) => u.rate > max.rate ? u : max, utilizationRates[0]);
            const minUtil = utilizationRates.reduce((min, u) => u.rate < min.rate ? u : min, utilizationRates[0]);
            
            // Calculate MoM change
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const lastMonthData = utilizationRates.filter(u => new Date(u.date) >= oneMonthAgo);
            const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
            const previousMonthData = utilizationRates.filter(u => {
              const d = new Date(u.date);
              return d >= twoMonthsAgo && d < oneMonthAgo;
            });
            
            const lastMonthAvg = lastMonthData.length > 0 ? lastMonthData.reduce((s, u) => s + u.rate, 0) / lastMonthData.length : utilization.rate;
            const prevMonthAvg = previousMonthData.length > 0 ? previousMonthData.reduce((s, u) => s + u.rate, 0) / previousMonthData.length : lastMonthAvg;
            const momChange = lastMonthAvg - prevMonthAvg;
            
            return (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="font-medium text-gray-700 mb-2">90-Day Utilization Statistics:</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>• Current: <strong>{utilization.rate.toFixed(0)}%</strong></div>
                  <div>• Average: <strong>{avgRate.toFixed(0)}%</strong></div>
                  <div>• Peak: <strong>{maxUtil.rate.toFixed(0)}%</strong> ({new Date(maxUtil.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</div>
                  <div>• Low: <strong>{minUtil.rate.toFixed(0)}%</strong> ({new Date(minUtil.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</div>
                  <div className="col-span-2">• Trend: <strong className={momChange < 0 ? 'text-red-600' : 'text-green-600'}>
                    {momChange < 0 ? 'Declining' : 'Improving'} {momChange < 0 ? '↓' : '↑'} ({momChange >= 0 ? '+' : ''}{momChange.toFixed(1)}% MoM)
                  </strong></div>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Financial Impact */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <div className="font-medium text-gray-800 mb-2">Financial Impact:</div>
          <div className="space-y-1 text-sm text-gray-700">
            <div>• Annual Seat Cost: $95/seat/month × 12 = ${annualSeatCost.toLocaleString()}/seat/year</div>
            <div className="text-lg font-bold text-red-700">
              • Total Annual Waste: {utilization.unusedLicenses} unused seats × ${annualSeatCost.toLocaleString()} = ${annualWaste.toLocaleString()}/year 💰
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
