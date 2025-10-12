import React from 'react';

interface UserActivityProps {
  totalLicenses: number;
  activeUsers: number;
}

export default function UserActivityBreakdown({ totalLicenses, activeUsers }: UserActivityProps) {
  const dormantUsers = Math.floor(totalLicenses * 0.24);
  const neverLoggedIn = totalLicenses - activeUsers - dormantUsers;
  
  const segments = [
    { 
      label: 'Active (Last 30d)', 
      count: activeUsers, 
      pct: (activeUsers / totalLicenses * 100), 
      color: 'bg-green-500' 
    },
    { 
      label: 'Dormant (30-90d)', 
      count: dormantUsers, 
      pct: 24, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Never Logged In', 
      count: neverLoggedIn, 
      pct: (neverLoggedIn / totalLicenses * 100), 
      color: 'bg-red-500', 
      alert: true 
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        👥 USER ACTIVITY BREAKDOWN
      </h2>
      
      <div className="mb-4">
        <div className="mb-3">
          <span className="font-medium">Total Provisioned Users:</span>
          <span className="ml-2 text-lg font-bold">{totalLicenses}</span>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-2">User Segmentation:</div>
          {segments.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-48 text-sm">• {segment.label}:</span>
              <span className="w-20 text-sm font-bold">{segment.count} users</span>
              <span className="w-16 text-sm text-gray-600">({segment.pct.toFixed(0)}%)</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-full ${segment.color}`}
                  style={{ width: `${segment.pct}%` }}
                ></div>
              </div>
              {segment.alert && <span>🔴</span>}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Engagement Metrics (Active Users Only):</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Avg Sessions per User (30d):</div>
              <div className="font-bold text-gray-900">8.2 sessions</div>
            </div>
            <div>
              <div className="text-gray-600">Avg Session Duration:</div>
              <div className="font-bold text-gray-900">12 minutes</div>
            </div>
            <div>
              <div className="text-gray-600">Last Activity:</div>
              <div className="font-bold text-yellow-600">12 days ago ⚠️</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Top Active Users:</div>
          <div className="space-y-1 text-sm text-gray-700">
            <div>1. john.smith@acmecorp.com - 45 sessions (Primary champion until Aug)</div>
            <div>2. mary.johnson@acmecorp.com - 28 sessions (IT Manager)</div>
            <div>3. bob.williams@acmecorp.com - 18 sessions (Network Admin)</div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            👤 View All Users
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            📧 Send Activation Reminders to {neverLoggedIn} Never-Logged-In Users
          </button>
        </div>
      </div>
    </div>
  );
}
