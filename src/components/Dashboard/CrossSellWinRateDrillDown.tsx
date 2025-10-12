import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

interface CrossSellDrillDownProps {
  level: number;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

export const CrossSellDrillDown: React.FC<CrossSellDrillDownProps> = ({ level, onClose, onLevelChange }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Cross-Sell Attach Rate Analysis</h2>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => onLevelChange(2)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 2
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Product & Tier
              </button>
              <button
                onClick={() => onLevelChange(3)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 3
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Renewal Opportunities
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="p-8">
          {level === 2 && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border-2 border-indigo-200">
                  <div className="text-sm text-gray-600 mb-2">Overall Attach Rate</div>
                  <div className="text-4xl font-bold text-indigo-600">28%</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">↑ +3pp vs Target</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Total Renewals (YTD)</div>
                  <div className="text-4xl font-bold text-gray-900">42</div>
                  <div className="text-xs text-gray-600 mt-1">12 with cross-sell</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Cross-Sell ARR</div>
                  <div className="text-4xl font-bold text-gray-900">$3.2M</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">↑ +18% YoY</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Avg Deal Size</div>
                  <div className="text-4xl font-bold text-gray-900">$267K</div>
                  <div className="text-xs text-gray-600 mt-1">Per cross-sell</div>
                </div>
              </div>

              {/* Visual Chart - Attach Rate Trend */}
              <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl border-2 border-indigo-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Attach Rate Trend (Last 6 Months)</h3>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 500 256" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={i} x1="0" y1={i * 64} x2="500" y2={i * 64} stroke="#e5e7eb" strokeWidth="1" />
                    ))}
                    
                    {/* Shaded area */}
                    <defs>
                      <linearGradient id="attachGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 115 L 100 103 L 200 96 L 300 90 L 400 83 L 500 77 L 500 256 L 0 256 Z"
                      fill="url(#attachGradient)"
                    />
                    
                    {/* Line */}
                    <path
                      d="M 0 115 L 100 103 L 200 96 L 300 90 L 400 83 L 500 77"
                      stroke="#6366f1"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {[
                      { x: 0, y: 115, rate: 22 },
                      { x: 100, y: 103, rate: 24 },
                      { x: 200, y: 96, rate: 25 },
                      { x: 300, y: 90, rate: 26 },
                      { x: 400, y: 83, rate: 27 },
                      { x: 500, y: 77, rate: 28 }
                    ].map((point, idx) => (
                      <g key={idx}>
                        <circle cx={point.x} cy={point.y} r="6" fill="#6366f1" stroke="white" strokeWidth="2" />
                        <text x={point.x} y={point.y - 15} textAnchor="middle" fill="#4338ca" fontSize="14" fontWeight="bold">
                          {point.rate}%
                        </text>
                      </g>
                    ))}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-4">
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((label, idx) => (
                      <span key={idx} className="text-sm text-gray-700 font-semibold">{label}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                    ↑ +6pp improvement over 6 months
                  </div>
                </div>
              </div>

              {/* Attach Rate by Product Combination */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Attach Rate by Product Combination</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Base Product</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Cross-Sell Product</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Renewals</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">With Cross-Sell</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Attach Rate</th>
                        <th className="text-right py-4 px-4 font-bold text-gray-700">ARR Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { base: 'Duo', cross: 'Umbrella', renewals: 15, with_cross: 5, rate: 33, arr: '$980K' },
                        { base: 'Meraki', cross: 'ThousandEyes', renewals: 12, with_cross: 4, rate: 33, arr: '$840K' },
                        { base: 'Umbrella', cross: 'Duo', renewals: 10, with_cross: 2, rate: 20, arr: '$620K' },
                        { base: 'ThousandEyes', cross: 'Splunk', renewals: 5, with_cross: 1, rate: 20, arr: '$760K' }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold">{row.base}</td>
                          <td className="py-4 px-4">{row.cross}</td>
                          <td className="py-4 px-4 text-center">{row.renewals}</td>
                          <td className="py-4 px-4 text-center">{row.with_cross}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-bold ${
                              row.rate >= 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {row.rate}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-bold">{row.arr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attach Rate by Customer Tier */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border-2 border-purple-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Attach Rate by Customer Tier</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl border-2 border-purple-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Strategic</div>
                    <div className="text-5xl font-bold text-purple-600">45%</div>
                    <div className="text-sm text-gray-600 mt-2">9/20 renewals</div>
                    <div className="text-xs font-semibold mt-1 text-green-600">↑ +8pp vs avg</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl border-2 border-blue-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Enterprise</div>
                    <div className="text-5xl font-bold text-blue-600">30%</div>
                    <div className="text-sm text-gray-600 mt-2">6/20 renewals</div>
                    <div className="text-xs font-semibold mt-1 text-green-600">↑ +2pp vs avg</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Commercial</div>
                    <div className="text-5xl font-bold text-green-600">18%</div>
                    <div className="text-sm text-gray-600 mt-2">2/11 renewals</div>
                    <div className="text-xs font-semibold mt-1 text-red-600">↓ 10pp vs avg</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-6 rounded-xl border-2 border-gray-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">SMB</div>
                    <div className="text-5xl font-bold text-gray-600">10%</div>
                    <div className="text-sm text-gray-600 mt-2">1/10 renewals</div>
                    <div className="text-xs font-semibold mt-1 text-red-600">↓ 18pp vs avg</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {level === 3 && (
            <div className="space-y-6">
              {/* Upcoming Renewals with Cross-Sell Potential */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Renewals with Cross-Sell Potential (Next 90 Days)</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'TechCorp Industries', renewal_date: '2025-11-15', arr: '$1.5M', product: 'Duo', opportunity: 'Umbrella', score: 92, tier: 'Enterprise' },
                    { customer: 'MedSecure Systems', renewal_date: '2025-11-22', arr: '$3.6M', product: 'Meraki', opportunity: 'ThousandEyes', score: 88, tier: 'Strategic' },
                    { customer: 'Global Financial Partners', renewal_date: '2025-12-05', arr: '$804K', product: 'Umbrella', opportunity: 'Duo', score: 85, tier: 'Enterprise' },
                    { customer: 'InnovateTech Solutions', renewal_date: '2025-12-18', arr: '$1.0M', product: 'Duo', opportunity: 'Splunk', score: 78, tier: 'Enterprise' },
                    { customer: 'Advanced Manufacturing Co', renewal_date: '2025-12-28', arr: '$141K', product: 'Meraki', opportunity: 'Umbrella', score: 72, tier: 'Commercial' }
                  ].map((renewal, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-indigo-500 cursor-pointer"
                      onClick={() => setSelectedAccount(renewal.customer)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-lg font-bold text-gray-900">{renewal.customer}</div>
                            <div className="text-sm text-gray-600">Renewal: {renewal.renewal_date} • {renewal.tier}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-600">Current: <span className="font-semibold">{renewal.product}</span></span>
                          <span className="text-sm text-gray-600">→</span>
                          <span className="text-sm text-indigo-600 font-semibold">Cross-sell: {renewal.opportunity}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            renewal.score >= 85 ? 'bg-green-100 text-green-700' : 
                            renewal.score >= 75 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-orange-100 text-orange-700'
                          }`}>
                            Readiness: {renewal.score}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{renewal.arr}</div>
                        <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold">
                          Create Opportunity
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
};

interface WinRateDrillDownProps {
  level: number;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

export const WinRateDrillDown: React.FC<WinRateDrillDownProps> = ({ level, onClose, onLevelChange }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Expansion Win Rate Analysis</h2>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => onLevelChange(2)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Product & Size
              </button>
              <button
                onClick={() => onLevelChange(3)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 3
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Win/Loss Analysis
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="p-8">
          {level === 2 && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border-2 border-emerald-200">
                  <div className="text-sm text-gray-600 mb-2">Overall Win Rate</div>
                  <div className="text-4xl font-bold text-emerald-600">64%</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">↑ +4% vs Target</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Won</div>
                  <div className="text-4xl font-bold text-green-600">32</div>
                  <div className="text-xs text-gray-600 mt-1">Opportunities</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Lost</div>
                  <div className="text-4xl font-bold text-red-600">18</div>
                  <div className="text-xs text-gray-600 mt-1">Opportunities</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Won ARR</div>
                  <div className="text-4xl font-bold text-gray-900">$7.2M</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">↑ +22% YoY</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Avg Win Size</div>
                  <div className="text-4xl font-bold text-gray-900">$225K</div>
                  <div className="text-xs text-gray-600 mt-1">Per deal</div>
                </div>
              </div>

              {/* Win Rate Trend Chart */}
              <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl border-2 border-emerald-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Win Rate Trend (Last 6 Months)</h3>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 500 256" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={i} x1="0" y1={i * 64} x2="500" y2={i * 64} stroke="#e5e7eb" strokeWidth="1" />
                    ))}
                    
                    {/* Shaded area */}
                    <defs>
                      <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 108 L 100 102 L 200 99 L 300 97 L 400 94 L 500 92 L 500 256 L 0 256 Z"
                      fill="url(#winRateGradient)"
                    />
                    
                    {/* Line */}
                    <path
                      d="M 0 108 L 100 102 L 200 99 L 300 97 L 400 94 L 500 92"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {[
                      { x: 0, y: 108, rate: 58 },
                      { x: 100, y: 102, rate: 60 },
                      { x: 200, y: 99, rate: 61 },
                      { x: 300, y: 97, rate: 62 },
                      { x: 400, y: 94, rate: 63 },
                      { x: 500, y: 92, rate: 64 }
                    ].map((point, idx) => (
                      <g key={idx}>
                        <circle cx={point.x} cy={point.y} r="6" fill="#10b981" stroke="white" strokeWidth="2" />
                        <text x={point.x} y={point.y - 15} textAnchor="middle" fill="#047857" fontSize="14" fontWeight="bold">
                          {point.rate}%
                        </text>
                      </g>
                    ))}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-4">
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((label, idx) => (
                      <span key={idx} className="text-sm text-gray-700 font-semibold">{label}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                    ↑ +6pp improvement • Above 60% target
                  </div>
                </div>
              </div>

              {/* Win Rate by Product */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Win Rate by Product Family</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Product</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Total Opps</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Won</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Lost</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Win Rate</th>
                        <th className="text-right py-4 px-4 font-bold text-gray-700">Won ARR</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Avg Days to Close</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { product: 'Duo', total: 15, won: 11, lost: 4, rate: 73, arr: '$2.1M', days: 42 },
                        { product: 'Umbrella', total: 12, won: 8, lost: 4, rate: 67, arr: '$1.8M', days: 38 },
                        { product: 'Meraki', total: 10, won: 6, lost: 4, rate: 60, arr: '$1.5M', days: 51 },
                        { product: 'ThousandEyes', total: 8, won: 5, lost: 3, rate: 63, arr: '$1.2M', days: 45 },
                        { product: 'Splunk', total: 5, won: 2, lost: 3, rate: 40, arr: '$600K', days: 68 }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold">{row.product}</td>
                          <td className="py-4 px-4 text-center">{row.total}</td>
                          <td className="py-4 px-4 text-center text-green-600 font-bold">{row.won}</td>
                          <td className="py-4 px-4 text-center text-red-600">{row.lost}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-bold ${
                              row.rate >= 65 ? 'bg-green-100 text-green-700' : 
                              row.rate >= 55 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {row.rate}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-bold">{row.arr}</td>
                          <td className="py-4 px-4 text-center">{row.days} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Win Rate by Deal Size */}
              <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-xl border-2 border-teal-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Win Rate by Deal Size</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">&lt;$100K</div>
                    <div className="text-5xl font-bold text-green-600">78%</div>
                    <div className="text-sm text-gray-600 mt-2">14/18 won</div>
                    <div className="text-xs text-gray-600 mt-1">$1.2M total</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-6 rounded-xl border-2 border-emerald-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">$100K-$250K</div>
                    <div className="text-5xl font-bold text-emerald-600">65%</div>
                    <div className="text-sm text-gray-600 mt-2">13/20 won</div>
                    <div className="text-xs text-gray-600 mt-1">$2.8M total</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-xl border-2 border-yellow-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">$250K-$500K</div>
                    <div className="text-5xl font-bold text-yellow-600">50%</div>
                    <div className="text-sm text-gray-600 mt-2">4/8 won</div>
                    <div className="text-xs text-gray-600 mt-1">$1.8M total</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-6 rounded-xl border-2 border-orange-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">&gt;$500K</div>
                    <div className="text-5xl font-bold text-orange-600">25%</div>
                    <div className="text-sm text-gray-600 mt-2">1/4 won</div>
                    <div className="text-xs text-gray-600 mt-1">$1.4M total</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {level === 3 && (
            <div className="space-y-6">
              {/* Recent Wins */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Wins (Last 30 Days)</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'TechCorp Industries', product: 'Duo', arr: '$280K', close_date: '2025-10-05', days: 38, rep: 'Sarah Johnson' },
                    { customer: 'Global Financial Partners', product: 'Umbrella', arr: '$195K', close_date: '2025-10-12', days: 42, rep: 'Michael Chen' },
                    { customer: 'InnovateTech Solutions', product: 'Meraki', arr: '$320K', close_date: '2025-10-18', days: 51, rep: 'Sarah Johnson' }
                  ].map((win, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-green-50 rounded-lg border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setSelectedAccount(win.customer)}
                    >
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900">{win.customer}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {win.product} • Closed: {win.close_date} • {win.days} days • Rep: {win.rep}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{win.arr}</div>
                        <div className="text-xs text-gray-600 mt-1">Won</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Losses */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Losses (Last 30 Days)</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'Enterprise Corp', product: 'Splunk', arr: '$450K', close_date: '2025-10-08', reason: 'Price', competitor: 'Datadog' },
                    { customer: 'Tech Startup Inc', product: 'ThousandEyes', arr: '$180K', close_date: '2025-10-15', reason: 'Timeline', competitor: 'None' }
                  ].map((loss, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-red-50 rounded-lg border-l-4 border-red-500 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setSelectedAccount(loss.customer)}
                    >
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900">{loss.customer}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {loss.product} • Lost: {loss.close_date} • Reason: {loss.reason} • Competitor: {loss.competitor}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">{loss.arr}</div>
                        <div className="text-xs text-gray-600 mt-1">Lost</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
};
