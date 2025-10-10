'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getProductFamilyPerformance } from '@/services/commercialOpsService';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export default function ProductPerformanceMatrix() {
  const data = getProductFamilyPerformance();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Error Rate: </span>
              <span className="font-semibold">{data.errorRate}%</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Volume: </span>
              <span className="font-semibold">{data.volume} invoices</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Impact: </span>
              <span className="font-semibold">${data.impact.toLocaleString()}</span>
            </p>
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
          <h3 className="text-xl font-semibold text-gray-900">Invoice Accuracy by Product Family</h3>
        </div>
        <div className="text-sm text-gray-500">
          Current Quarter Analysis
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
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
              label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="errorRate" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.errorRate > 2.0 ? '#EF4444' : entry.errorRate > 1.5 ? '#F59E0B' : '#10B981'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Family
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impact ($)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: product.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-sm font-semibold ${
                    product.errorRate > 2.0 ? 'text-red-600' : 
                    product.errorRate > 1.5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.errorRate}%
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.volume}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${product.impact.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {product.errorRate > 2.0 ? (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-medium text-red-800 bg-red-100 px-2 py-1 rounded-full">
                        Critical
                      </span>
                    </div>
                  ) : product.errorRate > 1.5 ? (
                    <span className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                      Warning
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full">
                      Good
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-800">Key Insights</span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• ThousandEyes showing highest error rate (2.1%) - likely complex pricing configurations</li>
          <li>• Duo maintains best accuracy (0.8%) with high volume - excellent process efficiency</li>
          <li>• Total impact of $88,620 across all product families requires attention</li>
        </ul>
      </div>
    </div>
  );
}
