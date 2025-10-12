import React from 'react';

interface UserActivityProps {
  totalLicenses: number;
  activeUsers: number;
  users: any[];
}

export default function UserActivityBreakdown({ totalLicenses, activeUsers, users }: UserActivityProps) {
  // Calculate from real user data
  const highActivityUsers = users.filter(u => u.activity_level === 'High').length;
  const mediumActivityUsers = users.filter(u => u.activity_level === 'Medium').length;
  const lowActivityUsers = users.filter(u => u.activity_level === 'Low').length;
  
  // Active = High + Medium activity
  const realActiveUsers = highActivityUsers + mediumActivityUsers;
  // Dormant = Low activity
  const dormantUsers = lowActivityUsers;
  // Never logged in = licenses not assigned to users
  const neverLoggedIn = Math.max(0, totalLicenses - users.length);
  
  const segments = [
    { 
      label: 'Active (High/Medium)', 
      count: realActiveUsers, 
      pct: totalLicenses > 0 ? (realActiveUsers / totalLicenses * 100) : 0, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Dormant (Low Activity)', 
      count: dormantUsers, 
      pct: totalLicenses > 0 ? (dormantUsers / totalLicenses * 100) : 0, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Never Logged In', 
      count: neverLoggedIn, 
      pct: totalLicenses > 0 ? (neverLoggedIn / totalLicenses * 100) : 0, 
      color: 'bg-red-500', 
      alert: neverLoggedIn > 0 
    }
  ];
  
  // Get top active users by features_used
  const topUsers = [...users]
    .sort((a, b) => (b.features_used || 0) - (a.features_used || 0))
    .slice(0, 3);
  
  // Calculate average engagement metrics
  const avgFeaturesUsed = users.length > 0 ? 
    users.reduce((sum, u) => sum + (u.features_used || 0), 0) / users.length : 0;
  
  const lastActivityDate = users.length > 0 ? 
    new Date(Math.max(...users.map(u => new Date(u.last_login || u.created_date || Date.now()).getTime()))) : new Date();

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
          <div className="text-sm font-medium text-gray-700 mb-2">Engagement Metrics:</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Total Users:</div>
              <div className="font-bold text-gray-900">{users.length} users</div>
            </div>
            <div>
              <div className="text-gray-600">Avg Features Used:</div>
              <div className="font-bold text-gray-900">{avgFeaturesUsed.toFixed(1)} features</div>
            </div>
            <div>
              <div className="text-gray-600">Last Activity:</div>
              <div className="font-bold text-gray-900">
                {Math.ceil((Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
              </div>
            </div>
          </div>
        </div>

        {topUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Top Active Users:</div>
            <div className="space-y-1 text-sm text-gray-700">
              {topUsers.map((user, idx) => (
                <div key={user.id}>
                  {idx + 1}. {user.email} - {user.features_used || 0} features used ({user.role})
                </div>
              ))}
            </div>
          </div>
        )}

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
