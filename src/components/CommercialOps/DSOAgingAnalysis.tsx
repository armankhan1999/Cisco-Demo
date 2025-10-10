'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getDSOAgingAnalysis } from '@/services/commercialOpsService';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DSOAgingAnalysis() {
  const data = getDSOAgingAnalysis();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label} Tier</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Total AR: </span>
              <span className="font-semibold">${data.totalAR}K</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Avg DSO: </span>
              <span className="font-semibold">{data.avgDSO} days</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">90+ Days: </span>
              <span className="font-semibold">${data.aging90Plus}K</span>
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
        return <Clock className="h-4 w-4 text-yellow-500" />;
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
          <Clock className="h-6 w-6 text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-900">DSO Analysis by Customer Tier</h3>
        </div>
        <div className="text-sm text-gray-500">
          Aging Breakdown
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="tier" 
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
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgDSO" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
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
                Tier
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current (0-30)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                31-60 Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                61-90 Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                90+ Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total AR
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg DSO
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((tier, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{tier.tier}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${tier.current}K
                    <div className="text-xs text-gray-500">
                      {tier.totalAR > 0 ? Math.round((tier.current / tier.totalAR) * 100) : 0}%
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${tier.aging31_60}K
                    <div className="text-xs text-gray-500">
                      {tier.totalAR > 0 ? Math.round((tier.aging31_60 / tier.totalAR) * 100) : 0}%
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${tier.aging61_90}K
                    <div className="text-xs text-gray-500">
                      {tier.totalAR > 0 ? Math.round((tier.aging61_90 / tier.totalAR) * 100) : 0}%
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${tier.aging90Plus > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    ${tier.aging90Plus}K
                    <div className="text-xs text-gray-500">
                      {tier.totalAR > 0 ? Math.round((tier.aging90Plus / tier.totalAR) * 100) : 0}%
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">${tier.totalAR}K</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-sm font-semibold ${
                    tier.status === 'good' ? 'text-green-600' : 
                    tier.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {tier.avgDSO} days
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tier.status)}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      tier.status === 'good' ? 'bg-green-100 text-green-800' : 
                      tier.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {tier.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            ${data.reduce((sum, tier) => sum + tier.totalAR, 0)}K
          </div>
          <div className="text-sm text-blue-700">Total AR Balance</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${data.reduce((sum, tier) => sum + tier.current, 0)}K
          </div>
          <div className="text-sm text-green-700">Current (0-30 days)</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            ${data.reduce((sum, tier) => sum + tier.aging90Plus, 0)}K
          </div>
          <div className="text-sm text-red-700">90+ Days Overdue</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {Math.round(
              data.reduce((sum, tier) => sum + (tier.avgDSO * tier.totalAR), 0) / 
              data.reduce((sum, tier) => sum + tier.totalAR, 0)
            )}
          </div>
          <div className="text-sm text-gray-700">Weighted Avg DSO</div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-medium text-orange-800">Collection Insights</span>
        </div>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Commercial and SMB tiers driving higher DSO - implement automated payment reminders</li>
          <li>• Strategic tier maintaining excellent 22-day DSO performance</li>
          <li>• Focus collection efforts on ${data.reduce((sum, tier) => sum + tier.aging90Plus, 0)}K in 90+ day aging</li>
        </ul>
      </div>
    </div>
  );
}
