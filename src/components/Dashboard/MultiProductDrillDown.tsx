'use client';
import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

export const MultiProductLevel2: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  return (
  <>
  <div className="space-y-8">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">43</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Multi-Product Customers</div>
          <div className="text-xs text-gray-600">86% of total</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-orange-600 mb-2">7</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Single Product</div>
          <div className="text-xs text-gray-600">14% opportunity</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">2.8</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Avg Products</div>
          <div className="text-xs text-gray-600">per customer</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">$16.9M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Cross-Sell Value</div>
          <div className="text-xs text-gray-600">from 7 accounts</div>
        </div>
      </div>
    </div>

    {/* Product Penetration Matrix */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Product Penetration Matrix</h4>
      <p className="text-sm text-gray-600 mb-6">Heatmap showing product combinations across customer base</p>
      
      <div className="grid grid-cols-6 gap-2">
        {/* Header Row */}
        <div className="text-xs font-bold text-gray-700"></div>
        <div className="text-xs font-bold text-gray-700 text-center">Duo</div>
        <div className="text-xs font-bold text-gray-700 text-center">Meraki</div>
        <div className="text-xs font-bold text-gray-700 text-center">Umbrella</div>
        <div className="text-xs font-bold text-gray-700 text-center">ThousandEyes</div>
        <div className="text-xs font-bold text-gray-700 text-center">Splunk</div>
        
        {/* Duo Row */}
        <div className="text-xs font-bold text-gray-700">Duo</div>
        <div className="bg-purple-600 text-white text-center py-3 rounded font-bold text-sm">50</div>
        <div className="bg-purple-400 text-white text-center py-3 rounded font-bold text-sm">38</div>
        <div className="bg-purple-300 text-white text-center py-3 rounded font-bold text-sm">32</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">18</div>
        <div className="bg-purple-100 text-gray-700 text-center py-3 rounded font-bold text-sm">12</div>
        
        {/* Meraki Row */}
        <div className="text-xs font-bold text-gray-700">Meraki</div>
        <div className="bg-purple-400 text-white text-center py-3 rounded font-bold text-sm">38</div>
        <div className="bg-purple-600 text-white text-center py-3 rounded font-bold text-sm">50</div>
        <div className="bg-purple-400 text-white text-center py-3 rounded font-bold text-sm">35</div>
        <div className="bg-purple-300 text-white text-center py-3 rounded font-bold text-sm">22</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">15</div>
        
        {/* Umbrella Row */}
        <div className="text-xs font-bold text-gray-700">Umbrella</div>
        <div className="bg-purple-300 text-white text-center py-3 rounded font-bold text-sm">32</div>
        <div className="bg-purple-400 text-white text-center py-3 rounded font-bold text-sm">35</div>
        <div className="bg-purple-600 text-white text-center py-3 rounded font-bold text-sm">50</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">20</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">14</div>
        
        {/* ThousandEyes Row */}
        <div className="text-xs font-bold text-gray-700">ThousandEyes</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">18</div>
        <div className="bg-purple-300 text-white text-center py-3 rounded font-bold text-sm">22</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">20</div>
        <div className="bg-purple-600 text-white text-center py-3 rounded font-bold text-sm">50</div>
        <div className="bg-purple-100 text-gray-700 text-center py-3 rounded font-bold text-sm">10</div>
        
        {/* Splunk Row */}
        <div className="text-xs font-bold text-gray-700">Splunk</div>
        <div className="bg-purple-100 text-gray-700 text-center py-3 rounded font-bold text-sm">12</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">15</div>
        <div className="bg-purple-200 text-gray-700 text-center py-3 rounded font-bold text-sm">14</div>
        <div className="bg-purple-100 text-gray-700 text-center py-3 rounded font-bold text-sm">10</div>
        <div className="bg-purple-600 text-white text-center py-3 rounded font-bold text-sm">50</div>
      </div>
      
      <div className="mt-6 flex items-center gap-6">
        <div className="text-xs font-semibold text-gray-700">Legend:</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span className="text-xs text-gray-600">All Customers (50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-400 rounded"></div>
          <span className="text-xs text-gray-600">High (30-40)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-200 rounded"></div>
          <span className="text-xs text-gray-600">Medium (15-25)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 rounded"></div>
          <span className="text-xs text-gray-600">Low (&lt;15)</span>
        </div>
      </div>
    </div>

    {/* Penetration by Tier */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Multi-Product Penetration by Customer Tier</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total Customers</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">1 Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">2 Products</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">3+ Products</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Multi-Product %</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-purple-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Strategic</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">0</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">2</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">6</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">100%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Excellent</span>
              </td>
            </tr>
            <tr className="hover:bg-purple-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Enterprise</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">2</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">89%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Good</span>
              </td>
            </tr>
            <tr className="hover:bg-purple-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Commercial</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">16</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">4</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">4</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">75%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Good</span>
              </td>
            </tr>
            <tr className="hover:bg-purple-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">SMB</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">4</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">3</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">1</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <span className="text-base font-bold text-yellow-600">50%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Opportunity</span>
              </td>
            </tr>
          </tbody>
        </table>
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

export const MultiProductLevel3: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  return (
  <>
  <div className="space-y-8">
    {/* Single-Product Accounts List */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Single-Product Accounts (Cross-Sell Opportunities)</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Current Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Recommended Add-On</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Est. ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Readiness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => setSelectedAccount('CloudFirst Solutions')}
            >
              <td className="px-6 py-4 text-base font-bold text-gray-900">CloudFirst Solutions</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Duo</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$285K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Commercial</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Meraki</td>
              <td className="px-6 py-4 text-lg font-bold text-green-600">$420K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">High</span>
              </td>
            </tr>
            <tr 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => setSelectedAccount('SecureNet Corp')}
            >
              <td className="px-6 py-4 text-base font-bold text-gray-900">SecureNet Corp</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Umbrella</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$195K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Commercial</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Duo</td>
              <td className="px-6 py-4 text-lg font-bold text-green-600">$325K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">High</span>
              </td>
            </tr>
            <tr 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => setSelectedAccount('DataFlow Systems')}
            >
              <td className="px-6 py-4 text-base font-bold text-gray-900">DataFlow Systems</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Meraki</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$380K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Enterprise</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Umbrella</td>
              <td className="px-6 py-4 text-lg font-bold text-green-600">$450K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Medium</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Recommended Actions */}
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
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">High Readiness</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$420K Opportunity</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Bundle Proposal</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>SecureNet Corp</strong> - Present Duo + Umbrella security bundle with 15% discount
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Bundle Ready</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$325K Opportunity</span>
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
export const renderMultiProductLevel2 = () => <MultiProductLevel2 />;
export const renderMultiProductLevel3 = () => <MultiProductLevel3 />;
