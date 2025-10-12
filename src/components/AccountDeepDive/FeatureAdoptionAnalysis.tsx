import React from 'react';

interface Feature {
  name: string;
  status: 'adopted' | 'partial' | 'not-used';
  users: string;
  intensity: string;
  lastUsed: string;
  utilization: number;
  adoptionStage: string;
}

interface FeatureAdoptionProps {
  products: any[];
  users: any[];
}

export default function FeatureAdoptionAnalysis({ products, users }: FeatureAdoptionProps) {
  // Calculate features from real product data
  const features: Feature[] = products.map(product => {
    const util = product.utilization || 0;
    const totalUsers = users.length;
    const activeUsersForProduct = Math.round((util / 100) * product.licenses);
    
    // Determine status based on utilization
    let status: 'adopted' | 'partial' | 'not-used' = 'not-used';
    if (util >= 70) status = 'adopted';
    else if (util >= 30) status = 'partial';
    
    // Determine intensity
    let intensity = 'None';
    if (util >= 80) intensity = 'High (Daily)';
    else if (util >= 60) intensity = 'Medium (Weekly)';
    else if (util >= 30) intensity = 'Low (Monthly)';
    
    // Calculate last used based on implementation date
    const implDate = new Date(product.implementation_date || Date.now());
    const daysSinceImpl = Math.floor((Date.now() - implDate.getTime()) / (1000 * 60 * 60 * 24));
    const lastUsed = util > 0 ? `${Math.max(1, Math.min(daysSinceImpl, 30))} days ago` : 'Never';
    
    return {
      name: product.family,
      status,
      users: `${activeUsersForProduct}/${product.licenses}`,
      intensity,
      lastUsed,
      utilization: util,
      adoptionStage: product.adoption_stage || 'Unknown'
    };
  });
  
  // If no products, show empty state
  if (features.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📈 FEATURE ADOPTION ANALYSIS
        </h2>
        <p className="text-gray-600">No product data available</p>
      </div>
    );
  }
  
  // Calculate adoption metrics
  const adoptedFeatures = features.filter(f => f.status === 'adopted').length;
  const totalFeatures = features.length;
  const featureUsageRate = totalFeatures > 0 ? (adoptedFeatures / totalFeatures * 100) : 0;
  
  // Determine overall adoption stage
  const avgUtilization = features.reduce((sum, f) => sum + f.utilization, 0) / features.length;
  let overallStage = 'Early';
  let stageColor = 'text-red-600';
  if (avgUtilization >= 70) {
    overallStage = 'Mature';
    stageColor = 'text-green-600';
  } else if (avgUtilization >= 50) {
    overallStage = 'Advanced';
    stageColor = 'text-blue-600';
  } else if (avgUtilization >= 30) {
    overallStage = 'Developing';
    stageColor = 'text-yellow-600';
  }

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
          <span className={`ml-2 text-lg font-bold ${stageColor}`}>
            {overallStage} {overallStage === 'Early' ? '🔴' : overallStage === 'Developing' ? '⚠️' : '✅'}
          </span>
          <span className="ml-2 text-sm text-gray-600">(Avg Utilization: {avgUtilization.toFixed(0)}%)</span>
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
                  <td className="px-4 py-3 border-r">
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-xs text-gray-500">{feature.adoptionStage}</div>
                  </td>
                  <td className="px-4 py-3 border-r">
                    <span className={`inline-flex items-center gap-1 ${
                      feature.status === 'adopted' ? 'text-green-700' :
                      feature.status === 'partial' ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {getFeatureStatusIcon(feature.status)} {getFeatureStatusText(feature.status)}
                    </span>
                    <div className="text-xs text-gray-500">{feature.utilization}%</div>
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
            <span className="font-medium">Products Enabled:</span>
            <span className="ml-2 font-bold">{totalFeatures}</span>
          </div>
          <div className={`p-3 rounded ${featureUsageRate >= 70 ? 'bg-green-50' : featureUsageRate >= 50 ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <span className="font-medium">Products Fully Adopted:</span>
            <span className={`ml-2 font-bold ${featureUsageRate >= 70 ? 'text-green-700' : featureUsageRate >= 50 ? 'text-yellow-700' : 'text-red-700'}`}>
              {adoptedFeatures} ({featureUsageRate.toFixed(0)}% adoption rate) {featureUsageRate < 50 ? '🔴' : featureUsageRate < 70 ? '⚠️' : '✅'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Product Utilization:</div>
          <div className="space-y-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-32 text-sm font-medium">{feature.name}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className={`h-full flex items-center px-2 text-white text-xs font-bold ${
                      feature.utilization >= 70 ? 'bg-green-500' :
                      feature.utilization >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${feature.utilization}%` }}
                  >
                    {feature.utilization}%
                  </div>
                </div>
                <span className="text-xs text-gray-600 w-24">{feature.adoptionStage}</span>
              </div>
            ))}
          </div>
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
