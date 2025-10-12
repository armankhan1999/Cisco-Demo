import React from 'react';

interface Feature {
  name: string;
  status: 'adopted' | 'partial' | 'not-used';
  users: string;
  intensity: string;
  lastUsed: string;
}

export default function FeatureAdoptionAnalysis() {
  const features: Feature[] = [
    { name: 'Network Dashboard', status: 'adopted', users: '9/9', intensity: 'High (Daily)', lastUsed: '12 days ago' },
    { name: 'Device Monitoring', status: 'adopted', users: '7/9', intensity: 'Medium (Weekly)', lastUsed: '5 days ago' },
    { name: 'Alerts & Notifications', status: 'partial', users: '3/9', intensity: 'Low (Monthly)', lastUsed: '18 days ago' },
    { name: 'Performance Analytics', status: 'not-used', users: '0/9', intensity: 'None', lastUsed: 'Never' },
    { name: 'Firmware Management', status: 'not-used', users: '0/9', intensity: 'None', lastUsed: 'Never' },
    { name: 'Advanced Security', status: 'not-used', users: '0/9', intensity: 'None', lastUsed: 'Never' },
    { name: 'API Integration', status: 'not-used', users: '0/9', intensity: 'None', lastUsed: 'Never' },
    { name: 'Custom Reports', status: 'not-used', users: '0/9', intensity: 'None', lastUsed: 'Never' }
  ];

  const getFeatureStatusIcon = (status: string) => {
    if (status === 'adopted') return '✅';
    if (status === 'partial') return '⚠️';
    return '❌';
  };

  const getFeatureStatusText = (status: string) => {
    if (status === 'adopted') return 'Adopted';
    if (status === 'partial') return 'Partial';
    return 'Not Used';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📈 FEATURE ADOPTION ANALYSIS
      </h2>
      
      <div className="mb-4">
        <div className="mb-3">
          <span className="font-medium">Adoption Stage:</span>
          <span className="ml-2 text-lg font-bold text-red-600">Early 🔴</span>
          <span className="ml-2 text-sm text-gray-600">(Target: Mature by renewal)</span>
        </div>

        <div className="overflow-x-auto">
          <div className="text-sm font-medium text-gray-700 mb-2">Feature Adoption Heatmap:</div>
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border-r">Feature</th>
                <th className="px-4 py-2 text-left border-r">Status</th>
                <th className="px-4 py-2 text-left border-r">Users</th>
                <th className="px-4 py-2 text-left border-r">Usage Intensity</th>
                <th className="px-4 py-2 text-left">Last Used</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 border-r">{feature.name}</td>
                  <td className="px-4 py-3 border-r">
                    <span className={`inline-flex items-center gap-1 ${
                      feature.status === 'adopted' ? 'text-green-700' :
                      feature.status === 'partial' ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {getFeatureStatusIcon(feature.status)} {getFeatureStatusText(feature.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r">{feature.users}</td>
                  <td className="px-4 py-3 border-r">{feature.intensity}</td>
                  <td className="px-4 py-3">{feature.lastUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">Features Enabled:</span>
            <span className="ml-2 font-bold">12</span>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <span className="font-medium">Features Actively Used:</span>
            <span className="ml-2 font-bold text-red-700">2 (17% feature usage rate) 🔴</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Champion Status:</div>
          <div className="space-y-1 text-sm text-gray-700">
            <div>• Previous Champion: John Smith (IT Director) - <strong className="text-red-600">DEPARTED Aug 15, 2025 🔴</strong></div>
            <div>• Current Champion: <strong className="text-red-600">Not Identified ❌</strong></div>
            <div>• Executive Sponsor: Sarah Miller (CTO) - Low Engagement</div>
          </div>
        </div>

        <div className="mt-4 bg-red-50 border border-red-200 rounded p-3 text-sm">
          <strong className="text-red-700">Days Since New Feature Activation: 180+ days (No progress) 🔴</strong>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            🎯 Schedule Feature Enablement Workshop
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            👤 Identify New Champion
          </button>
        </div>
      </div>
    </div>
  );
}
