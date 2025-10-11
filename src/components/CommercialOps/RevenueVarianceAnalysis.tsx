'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export default function RevenueVarianceAnalysis() {
  const varianceData = [
    { name: 'Contract modification timing', value: 245, percentage: 42, trend: 'up', color: '#EF4444' },
    { name: 'Usage-based true-up', value: 158, percentage: 27, trend: 'stable', color: '#F59E0B' },
    { name: 'Amendment processing delay', value: 92, percentage: 16, trend: 'down', color: '#10B981' },
    { name: 'Multi-year allocation error', value: 68, percentage: 12, trend: 'down', color: '#6366F1' },
    { name: 'Other', value: 18, percentage: 3, trend: 'stable', color: '#8B5CF6' }
  ];

  const monthlyTrend = [
    { month: 'Jan', variance: 425 },
    { month: 'Feb', variance: 380 },
    { month: 'Mar', variance: 445 },
    { month: 'Apr', variance: 520 },
    { month: 'May', variance: 485 },
    { month: 'Jun', variance: 581 }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Impact: </span>
              <span className="font-semibold">${data.value}K</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Percentage: </span>
              <span className="font-semibold">{data.percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Revenue Recognition Variance Analysis</h3>
        </div>
        <div className="text-sm text-gray-500">
          Q2 2025 Impact: $581K
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Variance Drivers Breakdown</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={varianceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {varianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {varianceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">${item.value}K</span>
                  {getTrendIcon(item.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Monthly Variance Trend</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Variance ($K)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}K`, 'Variance']}
                  labelFormatter={(label) => `${label} 2025`}
                />
                <Bar dataKey="variance" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Key Insights</span>
            </div>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Contract modifications driving 42% of variance - need process automation</li>
              <li>• Amendment delays decreasing - process improvements working</li>
              <li>• June variance spike requires investigation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-800">High Priority</span>
            </div>
            <p className="text-sm text-red-700">
              Automate contract modification timing workflows to reduce $245K impact
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-800">Medium Priority</span>
            </div>
            <p className="text-sm text-yellow-700">
              Implement real-time usage tracking to minimize true-up variances
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Monitor</span>
            </div>
            <p className="text-sm text-green-700">
              Continue monitoring amendment processing improvements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
