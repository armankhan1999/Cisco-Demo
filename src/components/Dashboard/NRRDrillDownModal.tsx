import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import customersData from '@/source_data/master-data/customers.json';
import revenueMovementsData from '@/source_data/commercial_operations/revenue_movements.json';

interface NRRDrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
}

export default function NRRDrillDownModal({ level, onClose, onLevelChange }: NRRDrillDownModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const renderLevel1 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-bold text-gray-900">Net Revenue Retention (NRR)</h3>
        <div className="text-5xl font-bold text-blue-600">$48.4M</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
          <div className="text-base font-bold text-gray-900 mb-2">Current Quarter</div>
          <div className="text-4xl font-bold text-blue-600 mb-2">$48.4M</div>
          <div className="text-sm font-semibold text-green-600">+$6.2M vs target</div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
          <div className="text-base font-bold text-gray-900 mb-2">YoY Comparison</div>
          <div className="text-4xl font-bold text-green-600 mb-2">+$3.6M</div>
          <div className="text-sm font-semibold text-gray-700">vs same quarter last year</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
          <div className="text-base font-bold text-gray-900 mb-2">Target</div>
          <div className="text-4xl font-bold text-purple-600 mb-2">≥ $46.4M</div>
          <div className="text-sm font-semibold text-green-600">✓ Target achieved</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 NRR Waterfall Chart</h4>
        <div className="space-y-6">
          {/* Visual Waterfall */}
          <div className="flex items-end justify-between h-64 gap-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-400 rounded-t-lg" style={{ height: '200px' }}></div>
              <div className="text-center mt-3">
                <div className="text-2xl font-bold text-gray-900">$42.2M</div>
                <div className="text-sm font-semibold text-gray-700">Base</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-500 rounded-t-lg" style={{ height: '236px' }}></div>
              <div className="text-center mt-3">
                <div className="text-2xl font-bold text-green-600">+$7.68M</div>
                <div className="text-sm font-semibold text-gray-700">Expansion</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-red-500 rounded-t-lg" style={{ height: '68px' }}></div>
              <div className="text-center mt-3">
                <div className="text-2xl font-bold text-red-600">-$1.44M</div>
                <div className="text-sm font-semibold text-gray-700">Churn</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: '230px' }}></div>
              <div className="text-center mt-3">
                <div className="text-2xl font-bold text-blue-600">$48.4M</div>
                <div className="text-sm font-semibold text-gray-700">Net NRR</div>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-3 pt-6 border-t-2">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-lg font-bold text-gray-900">Base Retention</span>
              <span className="text-2xl font-bold text-gray-900">$42.2M</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-lg font-bold text-gray-900">+ Expansion Revenue</span>
              <span className="text-2xl font-bold text-green-600">+$7.68M</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-lg font-bold text-gray-900">- Churn & Contraction</span>
              <span className="text-2xl font-bold text-red-600">-$1.44M</span>
            </div>
            <div className="flex items-center justify-between py-4 bg-blue-50 px-4 rounded-lg">
              <span className="text-xl font-bold text-gray-900">Net Revenue Retention</span>
              <span className="text-3xl font-bold text-blue-600">$48.4M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly Trend Chart */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📈 NRR Quarterly Trend</h4>
        <div className="space-y-4">
          <div className="flex items-end justify-between h-48 gap-3">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-400 rounded-t-lg" style={{ height: '140px' }}></div>
              <div className="text-center mt-2">
                <div className="text-lg font-bold text-gray-900">$44.9M</div>
                <div className="text-xs font-semibold text-gray-600">Q1 2024</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: '160px' }}></div>
              <div className="text-center mt-2">
                <div className="text-lg font-bold text-gray-900">$46.2M</div>
                <div className="text-xs font-semibold text-gray-600">Q2 2024</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: '175px' }}></div>
              <div className="text-center mt-2">
                <div className="text-lg font-bold text-gray-900">$47.3M</div>
                <div className="text-xs font-semibold text-gray-600">Q3 2024</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-700 rounded-t-lg" style={{ height: '192px' }}></div>
              <div className="text-center mt-2">
                <div className="text-lg font-bold text-blue-600">$48.4M</div>
                <div className="text-xs font-semibold text-gray-600">Q4 2024</div>
              </div>
            </div>
          </div>
          <div className="text-center pt-4 border-t">
            <span className="text-base font-bold text-green-600">↗ +8.5% YoY Growth</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onLevelChange(2)}
        className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
      >
        View Detailed Analysis: NRR by Tier & Cohort →
      </button>
    </div>
  );

  const renderLevel2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => onLevelChange(1)}
            className="text-base font-semibold text-blue-600 hover:text-blue-700 mb-3 flex items-center gap-2"
          >
            ← Back to Overview
          </button>
          <h3 className="text-3xl font-bold text-gray-900">NRR Analysis - Tactical View</h3>
        </div>
      </div>

      {/* NRR by Customer Tier - Scatter Plot */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 NRR by Customer Tier - Account Distribution</h4>
        <p className="text-sm text-gray-600 mb-4">Each dot represents a customer account. Size indicates ARR value.</p>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="category" 
              dataKey="tier" 
              name="Tier"
              label={{ value: 'Customer Tier', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="arr" 
              name="ARR"
              label={{ value: 'Annual ARR ($)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-lg">
                      <p className="font-bold text-gray-900">{data.customer_name}</p>
                      <p className="text-sm text-gray-600">Tier: {data.tier}</p>
                      <p className="text-sm text-gray-600">ARR: ${(data.arr / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-gray-600">Products: {data.product_count}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter 
              name="Strategic" 
              data={customersData.filter(c => c.tier === 'Strategic')}
              fill="#8b5cf6" 
            />
            <Scatter 
              name="Enterprise" 
              data={customersData.filter(c => c.tier === 'Enterprise')}
              fill="#3b82f6" 
            />
            <Scatter 
              name="Commercial" 
              data={customersData.filter(c => c.tier === 'Commercial')}
              fill="#10b981" 
            />
            <Scatter 
              name="SMB" 
              data={customersData.filter(c => c.tier === 'SMB')}
              fill="#f59e0b" 
            />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Summary Table */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {['Strategic', 'Enterprise', 'Commercial', 'SMB'].map(tier => {
            const tierCustomers = customersData.filter(c => c.tier === tier);
            const totalARR = tierCustomers.reduce((sum, c) => sum + c.arr, 0);
            return (
              <div key={tier} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h5 className="font-bold text-gray-900 mb-2">{tier}</h5>
                <p className="text-2xl font-bold text-blue-600">{tierCustomers.length}</p>
                <p className="text-xs text-gray-600">accounts</p>
                <p className="text-sm font-semibold text-gray-700 mt-2">${(totalARR / 1000000).toFixed(1)}M ARR</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cohort Analysis - Line Chart */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📈 NRR Cohort Analysis - Real Data</h4>
        <p className="text-sm text-gray-600 mb-4">Customer cohorts by creation date showing ARR trends</p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={(() => {
              // Group customers by creation year
              const cohorts = customersData.reduce((acc: any, customer) => {
                const year = customer.created_date.substring(0, 4);
                if (!acc[year]) {
                  acc[year] = { year, customers: 0, totalARR: 0 };
                }
                acc[year].customers += 1;
                acc[year].totalARR += customer.arr;
                return acc;
              }, {});
              return Object.values(cohorts).sort((a: any, b: any) => a.year.localeCompare(b.year));
            })()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Cohort Year', position: 'insideBottom', offset: -5 }} />
            <YAxis 
              yAxisId="left"
              label={{ value: 'Number of Customers', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ value: 'Total ARR ($M)', angle: 90, position: 'insideRight' }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-lg">
                      <p className="font-bold text-gray-900">Cohort {payload[0].payload.year}</p>
                      <p className="text-sm text-blue-600">Customers: {payload[0].value}</p>
                      <p className="text-sm text-green-600">Total ARR: ${(payload[1].value / 1000000).toFixed(2)}M</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={3} name="Customers" />
            <Line yAxisId="right" type="monotone" dataKey="totalARR" stroke="#10b981" strokeWidth={3} name="Total ARR" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expansion vs Churn - Line Chart */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">⚖️ Expansion vs. Churn Trend - Real Data</h4>
        <p className="text-sm text-gray-600 mb-4">Monthly revenue movements from real data</p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={(() => {
              // Group by month and calculate expansion vs churn
              const monthlyData = revenueMovementsData.reduce((acc: any, movement) => {
                const month = movement.effective_date.substring(0, 7);
                if (!acc[month]) {
                  acc[month] = { month, expansion: 0, churn: 0, net: 0 };
                }
                if (movement.arr_change > 0) {
                  acc[month].expansion += movement.arr_change;
                } else {
                  acc[month].churn += Math.abs(movement.arr_change);
                }
                acc[month].net += movement.arr_change;
                return acc;
              }, {});
              return Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month)).slice(0, 12);
            })()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`}
              contentStyle={{ backgroundColor: 'white', border: '2px solid #ccc', borderRadius: '8px' }}
            />
            <Legend />
            <Line type="monotone" dataKey="expansion" stroke="#10b981" strokeWidth={3} name="Expansion ARR" />
            <Line type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={3} name="Churn ARR" />
            <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Net ARR Change" />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-sm font-bold text-gray-900 mb-2">Total Expansion</div>
            <div className="text-2xl font-bold text-green-600">
              ${(revenueMovementsData.filter(m => m.arr_change > 0).reduce((sum, m) => sum + m.arr_change, 0) / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
            <div className="text-sm font-bold text-gray-900 mb-2">Total Churn</div>
            <div className="text-2xl font-bold text-red-600">
              ${(Math.abs(revenueMovementsData.filter(m => m.arr_change < 0).reduce((sum, m) => sum + m.arr_change, 0)) / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="text-sm font-bold text-gray-900 mb-2">Net Change</div>
            <div className="text-2xl font-bold text-blue-600">
              ${(revenueMovementsData.reduce((sum, m) => sum + m.arr_change, 0) / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onLevelChange(3)}
        className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
      >
        View Level 3 Drill-Down: Individual Customer NRR Details →
      </button>
    </div>
  );

  const renderLevel3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => onLevelChange(2)}
            className="text-base font-semibold text-blue-600 hover:text-blue-700 mb-3 flex items-center gap-2"
          >
            ← Back to Tactical View
          </button>
          <h3 className="text-3xl font-bold text-gray-900">Individual Customer NRR - Operational View</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Top NRR Contributors (Strategic Tier)</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Starting ARR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Expansion</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Churn</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Ending ARR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">NRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr 
                className="hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAccount('MedSecure Systems')}
              >
                <td className="px-6 py-4 text-base font-bold text-gray-900">MedSecure Systems</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$3.2M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$850K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$4.05M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">126.6%</td>
              </tr>
              <tr 
                className="hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAccount('TechCorp Industries')}
              >
                <td className="px-6 py-4 text-base font-bold text-gray-900">TechCorp Industries</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$1.5M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$420K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.92M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">128.0%</td>
              </tr>
              <tr 
                className="hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAccount('Global Financial Partners')}
              >
                <td className="px-6 py-4 text-base font-bold text-gray-900">Global Financial Partners</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$2.8M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$650K</td>
                <td className="px-6 py-4 text-base font-semibold text-red-600">-$120K</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$3.33M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">118.9%</td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">InnovateTech Solutions</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$1.0M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$285K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.29M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">128.5%</td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">Advanced Manufacturing Co</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$850K</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$195K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.05M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">122.9%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📋 Expansion Transaction Details</h4>
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-bold text-gray-900">MedSecure Systems - ThousandEyes Expansion</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Closed: 2024-09-15</div>
              </div>
              <span className="text-2xl font-bold text-green-600">+$850K ARR</span>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Type: <span className="text-gray-900">Cross-sell</span> • 
              Product: <span className="text-gray-900">ThousandEyes Enterprise</span> • 
              Rep: <span className="text-gray-900">Sarah Johnson</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-bold text-gray-900">Global Financial Partners - Capacity Upsell</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Closed: 2024-08-22</div>
              </div>
              <span className="text-2xl font-bold text-green-600">+$650K ARR</span>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Type: <span className="text-gray-900">Upsell</span> • 
              Product: <span className="text-gray-900">Meraki Additional Licenses</span> • 
              Rep: <span className="text-gray-900">Michael Chen</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-bold text-gray-900">TechCorp Industries - Umbrella Add-on</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Closed: 2024-07-10</div>
              </div>
              <span className="text-2xl font-bold text-green-600">+$420K ARR</span>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Type: <span className="text-gray-900">Cross-sell</span> • 
              Product: <span className="text-gray-900">Umbrella DNS Security</span> • 
              Rep: <span className="text-gray-900">Emily Rodriguez</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Net Revenue Retention</h2>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => onLevelChange(2)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  level === 2
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => onLevelChange(3)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  level === 3
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Details
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-5xl font-bold leading-none px-4"
          >
            ×
          </button>
        </div>
        
        <div className="px-8 py-6">
          {level === 1 && renderLevel1()}
          {level === 2 && renderLevel2()}
          {level === 3 && renderLevel3()}
        </div>
      </div>
      
      {/* Account Detail Modal */}
      {selectedAccount && (
        <AccountDetailModal
          accountName={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
}
