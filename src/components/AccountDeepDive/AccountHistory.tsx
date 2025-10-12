import React from 'react';

export default function AccountHistory() {
  const milestones = [
    { date: 'Jan 15, 2023', event: 'Contract Start (50 Meraki licenses, 36-month term, $180K ARR)' },
    { date: 'Jan 22, 2023', event: 'First user login (9 days after activation) ✓' },
    { date: 'Feb 12, 2023', event: 'Onboarding complete for first cohort (10 users)' },
    { date: 'Mar 2023', event: 'Peak utilization achieved (32%) during initial rollout' },
    { date: 'Jul 2023', event: 'QBR #1 - Health Score: 85, Champion: John Smith identified' },
    { date: 'Jan 2024', event: 'QBR #2 - Health Score: 82, Utilization stable at 28%' },
    { date: 'Jul 2024', event: 'QBR #3 - Health Score: 78, First signs of declining engagement' },
    { date: 'Aug 15, 2025', event: '⚠️ Champion John Smith departs company', isWarning: true },
    { date: 'Sept 2025', event: 'Utilization drops to 18%, Health Score declines to 54', isWarning: true },
    { date: 'Oct 1, 2025', event: '🔴 Low Utilization Alert triggered', isAlert: true },
    { date: 'Oct 10, 2025', event: 'Emergency intervention plan activated', isAlert: true },
    { date: 'Nov 27, 2025', event: 'Renewal date (48 days from today)', isFuture: true }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📜 ACCOUNT HISTORY & MILESTONES
      </h2>
      
      <div className="space-y-3">
        {milestones.map((milestone, idx) => (
          <div 
            key={idx} 
            className={`flex gap-4 pb-3 ${idx < milestones.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="w-32 text-sm font-medium text-gray-600 flex-shrink-0">
              {milestone.date}:
            </div>
            <div className={`text-sm flex-1 ${
              milestone.isAlert ? 'text-red-700 font-medium' :
              milestone.isWarning ? 'text-yellow-700 font-medium' :
              milestone.isFuture ? 'text-blue-700 font-medium' :
              'text-gray-700'
            }`}>
              {milestone.event}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
