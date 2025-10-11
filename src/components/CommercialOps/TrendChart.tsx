'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendData } from '@/services/commercialOpsService';

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600 font-medium">Q2C Cycle: </span>
              <span className="font-semibold">{payload[0].value} days</span>
            </p>
            <div className="text-xs text-gray-500 mt-2">
              Target: ≤ 45 days
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="cycleTimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#049FD9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#049FD9" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="period" 
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
            domain={[20, 60]}
            label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Target Line */}
          <Line 
            type="monotone" 
            dataKey={() => 45} 
            stroke="#EF4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Target (45 days)"
          />
          
          {/* Actual Cycle Time */}
          <Area
            type="monotone"
            dataKey="quoteToCashCycle"
            stroke="#049FD9"
            strokeWidth={3}
            fill="url(#cycleTimeGradient)"
            dot={{ fill: '#049FD9', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#049FD9', strokeWidth: 2, fill: '#FFFFFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Actual Cycle Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500 border-dashed"></div>
          <span className="text-sm text-gray-600">Target (45 days)</span>
        </div>
      </div>
      
      {/* Performance Insight */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">Performance Insight</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Cycle time has improved by 27% over the last 4 quarters, consistently beating the 45-day target.
        </p>
      </div>
    </div>
  );
}
