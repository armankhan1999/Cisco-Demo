'use client';
import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

export const WhiteSpaceLevel2: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  return (
  <>
  <div className="space-y-8">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-orange-600 mb-2">$8.2M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Total White Space</div>
          <div className="text-xs text-gray-600">Identified opportunities</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">127</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Opportunities</div>
          <div className="text-xs text-gray-600">Cross-sell potential</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">$64K</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Avg Opportunity</div>
          <div className="text-xs text-gray-600">Per account</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">82%</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Readiness Score</div>
          <div className="text-xs text-gray-600">Avg across accounts</div>
        </div>
      </div>
    </div>

    {/* Product Gap Analysis Matrix */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Product Gap Analysis Matrix</h4>
      <p className="text-sm text-gray-600 mb-6">Shows customers missing each product (white space opportunities)</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 border-2 border-gray-300">Product</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Have It</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Missing It</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">White Space %</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Opportunity ARR</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <span>Duo</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">38</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">12</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <span className="text-base font-bold text-orange-600">24%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$1.8M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">High</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span>Meraki</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">35</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">15</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-base font-bold text-orange-600">30%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$2.4M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">High</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <span>Umbrella</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">32</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">18</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                  <span className="text-base font-bold text-orange-600">36%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$2.1M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Medium</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TE</span>
                  </div>
                  <span>ThousandEyes</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">22</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">28</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                  </div>
                  <span className="text-base font-bold text-red-600">56%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$1.2M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Medium</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span>Splunk</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">15</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">35</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-base font-bold text-red-600">70%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$700K</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Low</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* White Space by Customer Tier */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 White Space by Customer Tier</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customers</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Opportunities</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Avg per Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Readiness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Strategic</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$3.2M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$400K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">92</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Enterprise</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">42</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$3.1M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$172K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">85</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Commercial</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">16</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">48</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$1.5M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$94K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-base font-bold text-yellow-600">78</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">SMB</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">19</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$400K</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$50K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-base font-bold text-yellow-600">65</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Lookalike Analysis */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🔍 Lookalike Analysis - Top Cross-Sell Patterns</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-gray-900">Duo → Meraki</h5>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">85% Match</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            <strong>12 customers</strong> with Duo showing high similarity to Meraki adopters
          </p>
          <div className="text-lg font-bold text-blue-600">$1.9M Opportunity</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-gray-900">Umbrella → Duo</h5>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">82% Match</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            <strong>15 customers</strong> with Umbrella matching Duo adoption profiles
          </p>
          <div className="text-lg font-bold text-green-600">$2.3M Opportunity</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-gray-900">Meraki → Umbrella</h5>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">78% Match</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            <strong>18 customers</strong> with Meraki showing Umbrella adoption potential
          </p>
          <div className="text-lg font-bold text-purple-600">$2.1M Opportunity</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-gray-900">Multi → ThousandEyes</h5>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">76% Match</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            <strong>28 customers</strong> with 2+ products ready for ThousandEyes
          </p>
          <div className="text-lg font-bold text-orange-600">$1.2M Opportunity</div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Account Detail Modal */}
  {selectedAccount && (
    <AccountDetailModal
      accountName={selectedAccount}
      onClose={() => setSelectedAccount(null)}
    />
  )}
  </>
  );
};

export const WhiteSpaceLevel3: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  return (
  <>
  <div className="space-y-8">
    {/* Top Opportunity Accounts */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Top White Space Opportunities</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Current Products</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Missing Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Est. ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Readiness</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Match Score</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">TechCorp Industries</div>
                <div className="text-xs text-gray-600">Enterprise | Technology</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo, Meraki, Umbrella</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Splunk</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$223K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">93</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">76%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">POC kickoff</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">MedSecure Systems</div>
                <div className="text-xs text-gray-600">Strategic | Healthcare</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo, Umbrella, ThousandEyes</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Meraki</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$385K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">89</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">82%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Schedule QBR</td>
            </tr>
            <tr 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => setSelectedAccount('Global Financial Partners')}
            >
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">Global Financial Partners</div>
                <div className="text-xs text-gray-600">Enterprise | Financial Services</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Meraki, Umbrella</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Duo</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$295K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">87</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">85%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Security review</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">InnovateTech Solutions</div>
                <div className="text-xs text-gray-600">Enterprise | Technology</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo, Meraki</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">ThousandEyes</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$185K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">78</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">76%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Demo setup</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">CloudFirst Solutions</div>
                <div className="text-xs text-gray-600">Commercial | Technology</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Meraki</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$420K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">91</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">85%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Bundle proposal</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Recommended Next Actions */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">⚡ Recommended Next Actions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">High-Priority Outreach</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>CloudFirst Solutions</strong> - Schedule QBR to discuss Meraki network security integration
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">91 Readiness</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$420K</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Strategic Account Expansion</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>MedSecure Systems</strong> - Present Meraki healthcare security bundle with compliance focus
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Strategic Tier</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$385K</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Security Bundle Opportunity</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>Global Financial Partners</strong> - Duo + existing products security bundle with 15% discount
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">85% Match</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$295K</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">4</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Lookalike Campaign</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>12 Duo customers</strong> - Launch targeted Meraki campaign based on successful patterns
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Campaign Ready</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$1.9M</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Account Detail Modal */}
  {selectedAccount && (
    <AccountDetailModal
      accountName={selectedAccount}
      onClose={() => setSelectedAccount(null)}
    />
  )}
  </>
  );
};

// Legacy exports for backward compatibility
export const renderWhiteSpaceLevel2 = () => <WhiteSpaceLevel2 />;
export const renderWhiteSpaceLevel3 = () => <WhiteSpaceLevel3 />;
