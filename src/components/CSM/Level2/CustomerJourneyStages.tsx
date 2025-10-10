'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { calculateCustomerJourneyStages, JourneyStage } from '@/lib/kpis/customerJourneyStages';

export function CustomerJourneyStages() {
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = calculateCustomerJourneyStages();
      setStages(data);
    } catch (error) {
      console.error('Error calculating journey stages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading journey analysis...</div>
      </div>
    );
  }

  const getHealthColor = (health: number) => {
    if (health >= 75) return 'text-green-600';
    if (health >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUtilizationColor = (util: number) => {
    if (util >= 75) return 'text-green-600';
    if (util >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customer Journey Stage Analysis</h2>
        <p className="text-sm text-gray-600 mt-1">Account distribution across lifecycle stages</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Journey Stage</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Accounts</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Avg Health</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Avg Utilization</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Avg Time in Stage</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Next Milestone</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, idx) => (
              <tr 
                key={stage.stage}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  idx === stages.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      stage.stage === 'Implementation' ? 'bg-blue-500' :
                      stage.stage === 'Stabilization' ? 'bg-purple-500' :
                      stage.stage === 'Optimization' ? 'bg-indigo-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{stage.stage}</div>
                      <div className="text-xs text-gray-500">{stage.stageRange}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="text-lg font-bold text-gray-900">{stage.accountCount}</div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className={`text-lg font-bold ${getHealthColor(stage.avgHealth)}`}>
                    {stage.avgHealth}
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className={`text-lg font-bold ${getUtilizationColor(stage.avgUtilization)}`}>
                    {stage.avgUtilization}%
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="flex items-center justify-center gap-1 text-gray-900">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{stage.avgTimeInStage}</span>
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                    <span>{stage.nextMilestone}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Journey Flow */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Customer Lifecycle Flow</h3>
        <div className="flex items-center justify-between gap-4">
          {stages.map((stage, idx) => (
            <div key={stage.stage} className="flex items-center flex-1">
              <div className="flex-1">
                <div className={`rounded-lg p-4 border-2 ${
                  stage.stage === 'Implementation' ? 'border-blue-500 bg-blue-50' :
                  stage.stage === 'Stabilization' ? 'border-purple-500 bg-purple-50' :
                  stage.stage === 'Optimization' ? 'border-indigo-500 bg-indigo-50' : 'border-green-500 bg-green-50'
                }`}>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-1">{stage.stage}</div>
                    <div className="text-2xl font-bold text-gray-900">{stage.accountCount}</div>
                    <div className="text-xs text-gray-600 mt-1">accounts</div>
                  </div>
                </div>
              </div>
              {idx < stages.length - 1 && (
                <div className="px-2">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          Journey Insights
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          {stages
            .filter(s => s.avgHealth < 65)
            .map(stage => (
              <div key={stage.stage} className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">⚠</span>
                <span>
                  <span className="font-semibold">{stage.stage}</span> stage shows lower health ({stage.avgHealth}) - consider additional support resources
                </span>
              </div>
            ))}
          {stages.find(s => s.stage === 'Implementation' && s.avgTimeInStage > 20) && (
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">→</span>
              <span>Implementation taking longer than target - review onboarding process</span>
            </div>
          )}
          {stages.find(s => s.stage === 'Maturity') && (
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>
                {stages.find(s => s.stage === 'Maturity')?.accountCount} mature accounts ready for expansion discussions
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
