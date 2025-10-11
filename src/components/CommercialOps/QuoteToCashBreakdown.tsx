'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function QuoteToCashBreakdown() {
  const stageData = [
    { 
      stage: 'Quote Creation → Send', 
      avgDays: 0.8, 
      target: 1.0, 
      variance: -0.2, 
      slaCompliance: 95,
      status: 'good'
    },
    { 
      stage: 'Quote Send → Acceptance', 
      avgDays: 12.5, 
      target: 10.0, 
      variance: 2.5, 
      slaCompliance: 72,
      status: 'warning'
    },
    { 
      stage: 'Acceptance → Order', 
      avgDays: 0.2, 
      target: 0.5, 
      variance: -0.3, 
      slaCompliance: 98,
      status: 'good'
    },
    { 
      stage: 'Order → Fulfillment', 
      avgDays: 1.5, 
      target: 2.0, 
      variance: -0.5, 
      slaCompliance: 94,
      status: 'good'
    },
    { 
      stage: 'Fulfillment → Invoice', 
      avgDays: 0.5, 
      target: 1.0, 
      variance: -0.5, 
      slaCompliance: 97,
      status: 'good'
    },
    { 
      stage: 'Invoice → Payment', 
      avgDays: 22.5, 
      target: 30.0, 
      variance: -7.5, 
      slaCompliance: 83,
      status: 'good'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Avg Days: </span>
              <span className="font-semibold">{data.avgDays}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Target: </span>
              <span className="font-semibold">{data.target}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">SLA Compliance: </span>
              <span className="font-semibold">{data.slaCompliance}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Quote-to-Cash Process Breakdown</h3>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Stage Analysis
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stageData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="stage" 
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgDays" radius={[4, 4, 0, 0]}>
              {stageData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.status === 'good' ? '#10B981' : 
                    entry.status === 'warning' ? '#F59E0B' : '#EF4444'
                  } 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SLA Compliance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stageData.map((stage, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{stage.avgDays}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{stage.target}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    stage.variance < 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stage.variance > 0 ? '+' : ''}{stage.variance}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      stage.slaCompliance >= 90 ? 'text-green-600' : 
                      stage.slaCompliance >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stage.slaCompliance}%
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stage.slaCompliance >= 90 ? 'bg-green-500' : 
                          stage.slaCompliance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${stage.slaCompliance}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(stage.status)}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      stage.status === 'good' ? 'bg-green-100 text-green-800' : 
                      stage.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {stage.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Insight */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Key Bottleneck Identified</span>
        </div>
        <p className="text-sm text-yellow-700">
          <span className="font-semibold">Quote Send → Acceptance</span> stage showing highest variance (+2.5 days above target). 
          This suggests issues with customer engagement and pricing clarity. 
          <span className="font-semibold">72% SLA compliance</span> indicates need for process improvement.
        </p>
      </div>
    </div>
  );
}
