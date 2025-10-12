import React from 'react';

interface HealthTrend {
  month: string;
  score: number;
}

interface HealthRiskProps {
  healthScore: number;
  churnRisk: number;
  npsScore: number;
  healthTrend: HealthTrend[];
}

export default function HealthRiskAssessment({ healthScore, churnRisk, npsScore, healthTrend }: HealthRiskProps) {
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-700';
    if (score >= 75) return 'text-blue-700';
    if (score >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 90) return 'Thriving';
    if (score >= 75) return 'Healthy';
    if (score >= 60) return 'Needs Attention';
    return 'At Risk';
  };

  const components = [
    { name: 'Product Adoption', score: 45, note: 'Primary risk driver' },
    { name: 'User Engagement', score: 38, note: 'Declining activity' },
    { name: 'Support Satisfaction', score: 72, note: 'Adequate' },
    { name: 'Value Realization', score: 42, note: 'Not achieving ROI' },
    { name: 'Relationship Strength', score: 68, note: 'Champion departed Aug 2025' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🎯 HEALTH & RISK ASSESSMENT
      </h2>
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-lg font-medium">Overall Health Score:</span>
          <span className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
            {healthScore}/100 🔴 {getHealthLabel(healthScore)}
          </span>
        </div>
        
        {/* Health Trend Chart */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="font-medium text-gray-700 mb-2">
            Health Trend (Last 6 Months): {healthTrend.map(h => h.score > 0 ? h.score : 'N/A').join(' → ')}
          </div>
          <div className="flex items-end gap-2 h-32">
            {healthTrend.map((point, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">
                  {point.score > 0 ? point.score : 'N/A'}
                </div>
                <div 
                  className={`w-full rounded-t ${
                    point.score === 0 ? 'bg-gray-300' : 
                    point.score >= 70 ? 'bg-green-500' : 
                    point.score >= 60 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ height: point.score === 0 ? '10%' : `${point.score}%` }}
                  title={point.score === 0 ? 'No data available' : `Health Score: ${point.score}`}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{point.month}</div>
              </div>
            ))}
          </div>
          {healthTrend.filter(h => h.score > 0).length > 1 && (
            <div className={`text-sm mt-2 font-medium ${
              healthTrend.filter(h => h.score > 0).slice(-1)[0].score < healthTrend.filter(h => h.score > 0)[0].score 
                ? 'text-red-600' : 'text-green-600'
            }`}>
              {healthTrend.filter(h => h.score > 0).slice(-1)[0].score < healthTrend.filter(h => h.score > 0)[0].score 
                ? '↓ Declining trend' : '↑ Improving trend'}
            </div>
          )}
          {healthTrend.filter(h => h.score > 0).length === 0 && (
            <div className="text-sm text-gray-500 mt-2">No health data available for the last 6 months</div>
          )}
        </div>

        {/* Component Scores */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Component Scores:</div>
          {components.map((component, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2">
              <span className="w-48 text-sm text-gray-700">• {component.name}:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-full flex items-center justify-end pr-2 text-xs font-bold text-white ${
                    component.score >= 70 ? 'bg-green-500' : 
                    component.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${component.score}%` }}
                >
                  {component.score}/100
                </div>
              </div>
              <span className="text-sm text-gray-600 w-64">({component.note})</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Churn Risk Score:</span>
            <span className={`font-bold text-lg ${
              churnRisk === 0 ? 'text-gray-500' :
              churnRisk >= 70 ? 'text-red-700' :
              churnRisk >= 40 ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              {churnRisk}/100 
              {churnRisk === 0 ? ' N/A' :
               churnRisk >= 70 ? ' 🔴 HIGH' :
               churnRisk >= 40 ? ' 🟡 MEDIUM' :
               ' 🟢 LOW'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">NPS Score:</span>
            <span className={`font-bold ${
              npsScore >= 9 ? 'text-green-700' :
              npsScore >= 7 ? 'text-blue-700' :
              'text-red-700'
            }`}>
              {npsScore} ({npsScore >= 9 ? 'Promoter' : npsScore >= 7 ? 'Passive' : 'Detractor'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
