import React from 'react';

interface TrainingProps {
  hasTrainingData?: boolean;
}

export default function TrainingEnablement({ hasTrainingData = false }: TrainingProps) {
  // Training data would come from a training system integration
  // Currently not available in source data
  const trainingModules = [
    { name: 'Product Overview (30 min)', completed: 0, icon: '❓' },
    { name: 'Core Features Setup (45 min)', completed: 0, icon: '❓' },
    { name: 'Best Practices (30 min)', completed: 0, icon: '❓' },
    { name: 'Advanced Features (60 min)', completed: 0, icon: '❓' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🎓 TRAINING & ENABLEMENT
      </h2>
      
      <div className="mb-4">
        {!hasTrainingData ? (
          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-xl">ℹ️</span>
              <div>
                <div className="font-bold">Training Data Not Available</div>
                <div className="text-sm mt-1">Training completion data requires integration with your Learning Management System (LMS). This section will populate once training data source is connected.</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <span className="font-medium">Overall Training Completion:</span>
              <span className="ml-2 text-lg font-bold text-red-600">42% 🔴</span>
              <span className="ml-2 text-sm text-gray-600">(Below 80% target)</span>
            </div>
          </>
        )}

        {hasTrainingData && <div className="space-y-3 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Training Breakdown:</div>
          <div className="flex items-center gap-3">
            <span className="w-48 text-sm">• Onboarding Training:</span>
            <span className="w-32 text-sm font-bold">45% complete</span>
            <span className="text-sm text-gray-600">(22/50 users)</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div className="bg-yellow-500 h-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-48 text-sm">• Advanced Training:</span>
            <span className="w-32 text-sm font-bold text-red-600">18% complete</span>
            <span className="text-sm text-gray-600">(9/50 users)</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div className="bg-red-500 h-full" style={{ width: '18%' }}></div>
            </div>
            <span>🔴</span>
          </div>
        </div>}

        {hasTrainingData && <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Required Training Modules (Per User):</div>
          <div className="space-y-2 text-sm">
            {trainingModules.map((module, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span>{module.icon}</span>
                <span className="flex-1">{module.name}</span>
                <span className="font-bold">{module.completed} users completed</span>
              </div>
            ))}
          </div>
        </div>}

        {hasTrainingData && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-800 mb-2">Incomplete Training Impact:</div>
          <div className="space-y-1 text-sm text-gray-700">
            <div>• 28 users (56%) have not completed any training</div>
            <div>• Users with complete training show <strong>3.2x higher utilization</strong></div>
            <div>• Training completion correlates with <strong>78% Health Score</strong> (vs. 54% current)</div>
          </div>
        </div>}

        {hasTrainingData && <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            📧 Send Training Campaign
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            📅 Schedule Group Training Session
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            📊 View Training Analytics
          </button>
        </div>}
      </div>
    </div>
  );
}
