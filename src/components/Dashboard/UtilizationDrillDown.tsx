import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

interface UtilizationDrillDownProps {
  level: number;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

export const UtilizationDrillDown: React.FC<UtilizationDrillDownProps> = ({ level, onClose, onLevelChange }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Utilization-Driven Expansion Signals</h2>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => onLevelChange(2)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 2 ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Product & Severity
              </button>
              <button
                onClick={() => onLevelChange(3)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 3 ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active Alerts
              </button>
            </div>
          </div>
          <button onClick={onClose} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors">
            ← Back to Dashboard
          </button>
        </div>

        <div className="p-8">
          {level === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Total Alerts</div>
                  <div className="text-4xl font-bold text-teal-600">18</div>
                  <div className="text-xs text-gray-600 mt-1">Active signals</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Critical (&gt;90%)</div>
                  <div className="text-4xl font-bold text-red-600">5</div>
                  <div className="text-xs text-red-600 font-semibold mt-1">Immediate action</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">High (85-90%)</div>
                  <div className="text-4xl font-bold text-orange-600">8</div>
                  <div className="text-xs text-orange-600 font-semibold mt-1">Plan expansion</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Medium (75-85%)</div>
                  <div className="text-4xl font-bold text-yellow-600">5</div>
                  <div className="text-xs text-yellow-600 font-semibold mt-1">Monitor closely</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Potential ARR</div>
                  <div className="text-4xl font-bold text-gray-900">$2.8M</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">From alerts</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-xl border-2 border-teal-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Utilization Alerts by Product</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Product</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Total Alerts</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Critical</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">High</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Avg Utilization</th>
                        <th className="text-right py-4 px-4 font-bold text-gray-700">Potential ARR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { product: 'Meraki', total: 6, critical: 2, high: 3, util: 91, arr: '$920K' },
                        { product: 'Duo', total: 5, critical: 2, high: 2, util: 89, arr: '$780K' },
                        { product: 'Umbrella', total: 4, critical: 1, high: 2, util: 87, arr: '$640K' },
                        { product: 'ThousandEyes', total: 2, critical: 0, high: 1, util: 82, arr: '$320K' },
                        { product: 'Splunk', total: 1, critical: 0, high: 0, util: 78, arr: '$140K' }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold">{row.product}</td>
                          <td className="py-4 px-4 text-center">{row.total}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-sm">
                              {row.critical}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold text-sm">
                              {row.high}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-bold ${
                              row.util >= 90 ? 'bg-red-100 text-red-700' :
                              row.util >= 85 ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {row.util}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-bold">{row.arr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl border-2 border-orange-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Alert Response Rate</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl border-2 border-green-300 shadow-md">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Converted to Opps</div>
                    <div className="text-5xl font-bold text-green-600">68%</div>
                    <div className="text-sm text-gray-600 mt-2">12/18 alerts</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl border-2 border-blue-300 shadow-md">
                    <div className="text-sm text-gray-700 font-semibold mb-2">In Progress</div>
                    <div className="text-5xl font-bold text-blue-600">22%</div>
                    <div className="text-sm text-gray-600 mt-2">4/18 alerts</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-xl border-2 border-yellow-300 shadow-md">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Pending</div>
                    <div className="text-5xl font-bold text-yellow-600">11%</div>
                    <div className="text-sm text-gray-600 mt-2">2/18 alerts</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-6 rounded-xl border-2 border-gray-300 shadow-md">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Avg Response Time</div>
                    <div className="text-5xl font-bold text-gray-600">3.2d</div>
                    <div className="text-sm text-gray-600 mt-2">From alert</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {level === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl border-2 border-red-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Critical Alerts - Immediate Action Required (&gt;90% Utilization)</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'MedSecure Systems', product: 'Meraki', util: 93.1, licenses: '2732/2935', potential: '$88K', tier: 'Strategic', status: 'acknowledged' },
                    { customer: 'TechCorp Industries', product: 'Duo', util: 92.4, licenses: '1850/2002', potential: '$65K', tier: 'Enterprise', status: 'in_progress' },
                    { customer: 'Global Financial Partners', product: 'Umbrella', util: 91.8, licenses: '1420/1547', potential: '$52K', tier: 'Enterprise', status: 'new' },
                    { customer: 'InnovateTech Solutions', product: 'Meraki', util: 90.5, licenses: '980/1083', potential: '$42K', tier: 'Enterprise', status: 'acknowledged' },
                    { customer: 'DataSystems Inc', product: 'Duo', util: 90.2, licenses: '720/798', potential: '$38K', tier: 'Commercial', status: 'new' }
                  ].map((alert, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-white rounded-lg hover:shadow-md transition-all border-l-4 border-red-500 shadow-sm cursor-pointer"
                      onClick={() => setSelectedAccount(alert.customer)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="text-lg font-bold text-gray-900">{alert.customer}</div>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                            CRITICAL: {alert.util}%
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                            alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {alert.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {alert.tier} • {alert.product} • Using {alert.licenses} licenses
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-teal-600">Recommended: </span>
                          Generate quote for additional licenses • Contact CSM immediately
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600 mb-2">{alert.potential}</div>
                        <div className="text-xs text-gray-600 mb-3">Potential ARR</div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                          Generate Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl border-2 border-orange-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">High Priority Alerts (85-90% Utilization)</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'Harber LLC', product: 'Duo', util: 88.8, licenses: '463/522', potential: '$12K', tier: 'Commercial', days: 45 },
                    { customer: 'RetailChain Corp', product: 'Umbrella', util: 87.5, licenses: '680/777', potential: '$28K', tier: 'Enterprise', days: 38 },
                    { customer: 'HealthTech Solutions', product: 'Meraki', util: 86.2, licenses: '520/603', potential: '$22K', tier: 'Enterprise', days: 52 }
                  ].map((alert, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-white rounded-lg hover:shadow-md transition-all border-l-4 border-orange-500 shadow-sm cursor-pointer"
                      onClick={() => setSelectedAccount(alert.customer)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="text-lg font-bold text-gray-900">{alert.customer}</div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                            HIGH: {alert.util}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {alert.tier} • {alert.product} • Using {alert.licenses} licenses • {alert.days} days at this level
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600 mb-2">{alert.potential}</div>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
                          Plan Expansion
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
