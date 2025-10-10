'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendData } from '@/services/commercialOpsService';
import { TrendingUp } from 'lucide-react';

interface StrategicTrendChartProps {
  data: TrendData[];
}

export default function StrategicTrendChart({ data }: StrategicTrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900 mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Q2C Cycle:</span>
              <span className="font-semibold text-blue-600">{payload[0].value} days</span>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
              Target: ≤ 45 days
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Quote-to-Cash Cycle Time Trend</h3>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Last 4 Quarters
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="cycleTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="period" 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[20, 60]}
              tick={{ fill: '#6B7280' }}
              label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Target Line */}
            <Line 
              type="monotone" 
              dataKey={() => 45} 
              stroke="#EF4444" 
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
              name="Target (45 days)"
            />
            
            {/* Actual Cycle Time */}
            <Area
              type="monotone"
              dataKey="quoteToCashCycle"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#cycleTimeGradient)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600 font-medium">Actual Cycle Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500 border-dashed"></div>
          <span className="text-sm text-gray-600 font-medium">Target (45 days)</span>
        </div>
      </div>
      
      {/* Performance Insight */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-semibold text-green-800">Performance Insight</span>
        </div>
        <p className="text-sm text-green-700">
          Cycle time has improved by <span className="font-semibold">27%</span> over the last 4 quarters, 
          consistently beating the 45-day target. Current performance at <span className="font-semibold">38 days</span> 
          represents excellent operational efficiency.
        </p>
      </div>
    </div>
  );
}
