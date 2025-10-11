import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

interface ShareWalletDrillDownProps {
  level: number;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

export const ShareWalletDrillDown: React.FC<ShareWalletDrillDownProps> = ({ level, onClose, onLevelChange }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Share-of-Wallet Analysis</h2>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => onLevelChange(2)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 2
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Tier & Industry
              </button>
              <button
                onClick={() => onLevelChange(3)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 3
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Low Share Accounts
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
                <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border-2 border-violet-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Average Share</div>
                  <div className="text-4xl font-bold text-violet-600">34%</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">↑ +2% QoQ</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">High Share (&gt;50%)</div>
                  <div className="text-4xl font-bold text-green-600">12</div>
                  <div className="text-xs text-gray-600 mt-1">24% of accounts</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Medium (25-50%)</div>
                  <div className="text-4xl font-bold text-blue-600">28</div>
                  <div className="text-xs text-gray-600 mt-1">56% of accounts</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Low (&lt;25%)</div>
                  <div className="text-4xl font-bold text-orange-600">10</div>
                  <div className="text-xs text-gray-600 mt-1">20% of accounts</div>
                </div>
              </div>

              {/* Share-of-Wallet Distribution Chart */}
              <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-xl border-2 border-violet-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Share-of-Wallet Distribution</h3>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 700 256" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={i} x1="0" y1={i * 64} x2="700" y2={i * 64} stroke="#e5e7eb" strokeWidth="1" />
                    ))}
                    
                    {/* Shaded area */}
                    <defs>
                      <linearGradient id="walletGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 218 L 100 166 L 200 77 L 300 13 L 400 102 L 500 128 L 600 179 L 600 256 L 0 256 Z"
                      fill="url(#walletGradient)"
                    />
                    
                    {/* Line */}
                    <path
                      d="M 0 218 L 100 166 L 200 77 L 300 13 L 400 102 L 500 128 L 600 179"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {[
                      { x: 0, y: 218, count: 2 },
                      { x: 100, y: 166, count: 5 },
                      { x: 200, y: 77, count: 12 },
                      { x: 300, y: 13, count: 16 },
                      { x: 400, y: 102, count: 10 },
                      { x: 500, y: 128, count: 8 },
                      { x: 600, y: 179, count: 4 }
                    ].map((point, idx) => (
                      <g key={idx}>
                        <circle cx={point.x} cy={point.y} r="6" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                        <text x={point.x} y={point.y - 15} textAnchor="middle" fill="#5b21b6" fontSize="14" fontWeight="bold">
                          {point.count}
                        </text>
                      </g>
                    ))}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-4">
                    {['0-10%', '11-20%', '21-30%', '31-40%', '41-50%', '51-60%', '61%+'].map((label, idx) => (
                      <span key={idx} className="text-xs text-gray-700 font-semibold">{label}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold">
                    Most accounts in 31-40% range • 66% expansion potential
                  </div>
                </div>
              </div>

              {/* Share-of-Wallet by Customer Tier */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border-2 border-purple-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Share-of-Wallet by Customer Tier</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl border-2 border-purple-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Strategic</div>
                    <div className="text-5xl font-bold text-purple-600">58%</div>
                    <div className="text-sm text-gray-600 mt-2">8 accounts</div>
                    <div className="text-xs font-semibold mt-1 text-green-600">↑ +24pp vs avg</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl border-2 border-blue-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Enterprise</div>
                    <div className="text-5xl font-bold text-blue-600">42%</div>
                    <div className="text-sm text-gray-600 mt-2">19 accounts</div>
                    <div className="text-xs font-semibold mt-1 text-green-600">↑ +8pp vs avg</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Commercial</div>
                    <div className="text-5xl font-bold text-green-600">28%</div>
                    <div className="text-sm text-gray-600 mt-2">10 accounts</div>
                    <div className="text-xs font-semibold mt-1 text-orange-600">↓ 6pp vs avg</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-6 rounded-xl border-2 border-gray-300 shadow-md hover:shadow-lg transition-all">
                    <div className="text-sm text-gray-700 font-semibold mb-2">SMB</div>
                    <div className="text-5xl font-bold text-gray-600">18%</div>
                    <div className="text-sm text-gray-600 mt-2">3 accounts</div>
                    <div className="text-xs font-semibold mt-1 text-red-600">↓ 16pp vs avg</div>
                  </div>
                </div>
              </div>

              {/* Share-of-Wallet by Industry */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Share-of-Wallet by Industry</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Industry</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Avg Share</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Accounts</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Current ARR</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Potential ARR</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Expansion Opp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { industry: 'Financial Services', share: 45, accounts: 12, arr: '$12.8M', potential: '$28.4M', opp: '$15.6M' },
                        { industry: 'Healthcare', share: 38, accounts: 8, arr: '$8.2M', potential: '$21.6M', opp: '$13.4M' },
                        { industry: 'Technology', share: 35, accounts: 10, arr: '$9.5M', potential: '$27.1M', opp: '$17.6M' },
                        { industry: 'Manufacturing', share: 28, accounts: 7, arr: '$5.4M', potential: '$19.3M', opp: '$13.9M' },
                        { industry: 'Retail', share: 22, accounts: 5, arr: '$3.8M', potential: '$17.3M', opp: '$13.5M' }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold">{row.industry}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-bold ${
                              row.share >= 40 ? 'bg-green-100 text-green-700' :
                              row.share >= 30 ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {row.share}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">{row.accounts}</td>
                          <td className="py-4 px-4 text-center font-bold">{row.arr}</td>
                          <td className="py-4 px-4 text-center text-gray-600">{row.potential}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full font-bold">
                              {row.opp}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {level === 3 && (
            <div className="space-y-6">
              {/* Low Share-of-Wallet Accounts - High Expansion Potential */}
              <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-xl border-2 border-violet-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Low Share-of-Wallet Accounts (&lt;25%) - High Expansion Potential</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'Global Financial Partners', share: 18, arr: '$804K', potential: '$4.5M', products: ['Umbrella'], missing: ['Duo', 'Meraki', 'ThousandEyes'], tier: 'Enterprise', health: 85 },
                    { customer: 'MedSecure Systems', share: 22, arr: '$3.6M', potential: '$16.4M', products: ['Duo', 'Umbrella'], missing: ['Meraki', 'ThousandEyes', 'Splunk'], tier: 'Strategic', health: 92 },
                    { customer: 'Advanced Manufacturing Co', share: 15, arr: '$141K', potential: '$940K', products: ['Meraki'], missing: ['Duo', 'Umbrella'], tier: 'Commercial', health: 78 },
                    { customer: 'RetailChain Corp', share: 12, arr: '$280K', potential: '$2.3M', products: ['Duo'], missing: ['Umbrella', 'Meraki', 'ThousandEyes'], tier: 'Enterprise', health: 88 },
                    { customer: 'HealthTech Solutions', share: 20, arr: '$620K', potential: '$3.1M', products: ['ThousandEyes'], missing: ['Duo', 'Umbrella', 'Meraki'], tier: 'Enterprise', health: 90 }
                  ].map((account, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-white rounded-lg hover:shadow-md transition-all border-l-4 border-violet-500 shadow-sm cursor-pointer"
                      onClick={() => setSelectedAccount(account.customer)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="text-lg font-bold text-gray-900">{account.customer}</div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                            {account.share}% Share
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            account.health >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Health: {account.health}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {account.tier} • Current ARR: <span className="font-semibold">{account.arr}</span> • Potential: <span className="font-semibold text-violet-600">{account.potential}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Current: </span>
                            {account.products.map((p, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold mr-1">{p}</span>
                            ))}
                          </div>
                          <div>
                            <span className="text-gray-600">Missing: </span>
                            {account.missing.map((p, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mr-1">{p}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-violet-600 mb-2">
                          {((parseFloat(account.potential.replace(/[$MK]/g, '')) - parseFloat(account.arr.replace(/[$MK]/g, ''))) * (account.potential.includes('M') ? 1000 : 1)).toFixed(1)}K
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Expansion Opp</div>
                        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-semibold">
                          Build Strategy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitive Threat - Share Loss Risk */}
              <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl border-2 border-red-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Competitive Threat - Share Loss Risk</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'TechCorp Industries', share: 38, trend: -5, arr: '$1.5M', competitor: 'Palo Alto', risk: 'High', tier: 'Enterprise' },
                    { customer: 'InnovateTech Solutions', share: 42, trend: -3, arr: '$1.0M', competitor: 'Fortinet', risk: 'Medium', tier: 'Enterprise' },
                    { customer: 'DataSystems Inc', share: 35, trend: -4, arr: '$720K', competitor: 'Zscaler', risk: 'High', tier: 'Commercial' }
                  ].map((account, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-white rounded-lg border-l-4 border-red-500 shadow-md cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedAccount(account.customer)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="text-lg font-bold text-gray-900">{account.customer}</div>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                            {account.risk} Risk
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {account.tier} • Current Share: <span className="font-semibold">{account.share}%</span> • ARR: <span className="font-semibold">{account.arr}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                            ↓ {account.trend}pp QoQ
                          </span>
                          <span className="text-gray-600">Competitor: <span className="font-semibold text-red-600">{account.competitor}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                          Defensive Strategy
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
