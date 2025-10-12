import React from 'react';

interface CrossProductDrillDownProps {
  level: number;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

export const CrossProductDrillDown: React.FC<CrossProductDrillDownProps> = ({ level, onClose, onLevelChange }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Cross-Product Correlation Analysis</h2>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => onLevelChange(2)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 2 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Product Synergies
              </button>
              <button
                onClick={() => onLevelChange(3)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 3 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recommended Bundles
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Avg Correlation</div>
                  <div className="text-4xl font-bold text-purple-600">0.78</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">Strong synergy</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">High Synergy Pairs</div>
                  <div className="text-4xl font-bold text-green-600">8</div>
                  <div className="text-xs text-gray-600 mt-1">&gt;0.80 correlation</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Bundle Opportunities</div>
                  <div className="text-4xl font-bold text-blue-600">24</div>
                  <div className="text-xs text-gray-600 mt-1">Active accounts</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Potential ARR</div>
                  <div className="text-4xl font-bold text-gray-900">$8.4M</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">From bundles</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border-2 border-purple-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Correlation Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Product Pair</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Correlation</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Co-Adoption</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Avg ARR Lift</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Opportunities</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { pair: 'Meraki + ThousandEyes', corr: 0.92, adoption: '78%', lift: '+42%', opps: 12 },
                        { pair: 'Duo + Umbrella', corr: 0.88, adoption: '72%', lift: '+38%', opps: 15 },
                        { pair: 'Umbrella + ThousandEyes', corr: 0.85, adoption: '68%', lift: '+35%', opps: 10 },
                        { pair: 'Duo + Meraki', corr: 0.82, adoption: '65%', lift: '+32%', opps: 14 },
                        { pair: 'Meraki + Splunk', corr: 0.78, adoption: '58%', lift: '+28%', opps: 8 }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold">{row.pair}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-bold ${
                              row.corr >= 0.85 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {row.corr}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">{row.adoption}</td>
                          <td className="py-4 px-4 text-center text-green-600 font-bold">{row.lift}</td>
                          <td className="py-4 px-4 text-center">{row.opps}</td>
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
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Product Bundles</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'TechCorp Industries', current: ['Duo', 'Umbrella'], recommend: 'Meraki', score: 0.92, arr: '$420K', tier: 'Enterprise' },
                    { customer: 'Global Financial Partners', current: ['Umbrella'], recommend: 'Duo + ThousandEyes', score: 0.88, arr: '$680K', tier: 'Enterprise' },
                    { customer: 'MedSecure Systems', current: ['Duo', 'Umbrella', 'Meraki'], recommend: 'ThousandEyes', score: 0.85, arr: '$540K', tier: 'Strategic' },
                    { customer: 'InnovateTech Solutions', current: ['Duo'], recommend: 'Umbrella + Meraki', score: 0.82, arr: '$380K', tier: 'Enterprise' }
                  ].map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-white rounded-lg hover:shadow-md transition-all border-l-4 border-purple-500">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900">{rec.customer}</div>
                        <div className="text-sm text-gray-600 mt-1">{rec.tier} • Current ARR: {rec.arr}</div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Current: </span>
                            {rec.current.map((p, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold mr-1">{p}</span>
                            ))}
                          </div>
                          <span className="text-gray-600">→</span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded font-semibold">Add: {rec.recommend}</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            Synergy: {rec.score}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
                        Create Bundle Quote
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
