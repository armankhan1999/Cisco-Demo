import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

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

      {/* NRR by Customer Tier */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 NRR by Customer Tier</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customers</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">NRR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Variance</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => onLevelChange(3)}>
                <td className="px-6 py-4 text-base font-bold text-gray-900">Strategic</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$18.5M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">122.3%</td>
                <td className="px-6 py-4 text-base font-semibold text-green-600">+12.3pp</td>
                <td className="px-6 py-4 text-base text-blue-600 font-bold">View Details →</td>
              </tr>
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => onLevelChange(3)}>
                <td className="px-6 py-4 text-base font-bold text-gray-900">Enterprise</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">15</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$15.2M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">118.5%</td>
                <td className="px-6 py-4 text-base font-semibold text-green-600">+8.5pp</td>
                <td className="px-6 py-4 text-base text-blue-600 font-bold">View Details →</td>
              </tr>
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => onLevelChange(3)}>
                <td className="px-6 py-4 text-base font-bold text-gray-900">Commercial</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$6.8M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">108.2%</td>
                <td className="px-6 py-4 text-base font-semibold text-yellow-600">-1.8pp</td>
                <td className="px-6 py-4 text-base text-blue-600 font-bold">View Details →</td>
              </tr>
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => onLevelChange(3)}>
                <td className="px-6 py-4 text-base font-bold text-gray-900">SMB</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">9</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.7M</td>
                <td className="px-6 py-4 text-lg font-bold text-yellow-600">102.5%</td>
                <td className="px-6 py-4 text-base font-semibold text-red-600">-7.5pp</td>
                <td className="px-6 py-4 text-base text-blue-600 font-bold">View Details →</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Analysis with Heatmap */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📈 NRR Cohort Heatmap</h4>
        
        {/* Visual Heatmap */}
        <div className="mb-6">
          <div className="flex items-end justify-between h-56 gap-3">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-green-400 to-green-600 rounded-t-lg" style={{ height: '220px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-green-600">125.3%</div>
                <div className="text-xs font-semibold text-gray-600">2024 Q1</div>
                <div className="text-xs text-gray-500">12 customers</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-green-300 to-green-500 rounded-t-lg" style={{ height: '200px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-green-600">118.7%</div>
                <div className="text-xs font-semibold text-gray-600">2023 Q4</div>
                <div className="text-xs text-gray-500">15 customers</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-yellow-300 to-yellow-500 rounded-t-lg" style={{ height: '160px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-yellow-600">108.2%</div>
                <div className="text-xs font-semibold text-gray-600">2023 Q3</div>
                <div className="text-xs text-gray-500">18 customers</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-yellow-200 to-yellow-400 rounded-t-lg" style={{ height: '140px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-yellow-600">105.4%</div>
                <div className="text-xs font-semibold text-gray-600">2023 Q2</div>
                <div className="text-xs text-gray-500">5 customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cohort Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-sm font-bold text-gray-900 mb-2">2024 Q1</div>
            <div className="text-3xl font-bold text-green-600">125.3%</div>
            <div className="text-xs font-semibold text-gray-700 mt-1">12 customers</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-sm font-bold text-gray-900 mb-2">2023 Q4</div>
            <div className="text-3xl font-bold text-green-600">118.7%</div>
            <div className="text-xs font-semibold text-gray-700 mt-1">15 customers</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="text-sm font-bold text-gray-900 mb-2">2023 Q3</div>
            <div className="text-3xl font-bold text-yellow-600">108.2%</div>
            <div className="text-xs font-semibold text-gray-700 mt-1">18 customers</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="text-sm font-bold text-gray-900 mb-2">2023 Q2</div>
            <div className="text-3xl font-bold text-yellow-600">105.4%</div>
            <div className="text-xs font-semibold text-gray-700 mt-1">5 customers</div>
          </div>
        </div>
      </div>

      {/* Expansion vs Churn */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">⚖️ Expansion vs. Churn Ratio</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <div className="text-base font-bold text-gray-900 mb-3">Expansion Revenue</div>
            <div className="text-4xl font-bold text-green-600 mb-2">$7.68M</div>
            <div className="text-sm font-semibold text-gray-700">+18.2% of base ARR</div>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
            <div className="text-base font-bold text-gray-900 mb-3">Churn & Contraction</div>
            <div className="text-4xl font-bold text-red-600 mb-2">$1.44M</div>
            <div className="text-sm font-semibold text-gray-700">-3.4% of base ARR</div>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Expansion/Churn Ratio</span>
            <span className="text-3xl font-bold text-blue-600">5.3:1</span>
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
