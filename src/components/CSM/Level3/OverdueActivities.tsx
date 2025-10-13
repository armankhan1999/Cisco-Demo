'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { getOverdueActivities, OverdueActivity } from '@/lib/kpis/overdueActivities';

export function OverdueActivities() {
  const [activities, setActivities] = useState<OverdueActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getOverdueActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading overdue activities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading overdue activities...</div>
      </div>
    );
  }

  const formatARR = (arr: number) => {
    if (arr >= 1000000) return `$${(arr / 1000000).toFixed(1)}M`;
    if (arr >= 1000) return `$${(arr / 1000).toFixed(0)}K`;
    return `$${arr.toFixed(0)}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'QBR':
        return '📅';
      case 'Success Plan Review':
        return '📋';
      case 'Onboarding Milestone':
        return '🚀';
      case 'Health Check':
        return '🏥';
      default:
        return '📝';
    }
  };

  return (
    <div className="rounded-xl shadow-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            Overdue Success Activities
          </h2>
          <p className="text-sm text-gray-600 mt-1">Activities requiring immediate attention</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600">{activities.length}</div>
          <div className="text-xs text-gray-500">Overdue Items</div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-green-600 text-lg font-medium">✓ All activities up to date</div>
          <div className="text-sm text-gray-500 mt-2">No overdue success activities</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg p-4 border border-red-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-red-700 mb-1">High Priority</div>
              <div className="text-2xl font-bold text-red-900">
                {activities.filter(a => a.priority === 'High').length}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-yellow-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-yellow-700 mb-1">Medium Priority</div>
              <div className="text-2xl font-bold text-yellow-900">
                {activities.filter(a => a.priority === 'Medium').length}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-orange-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-orange-700 mb-1">Avg Days Overdue</div>
              <div className="text-2xl font-bold text-orange-900">
                {Math.round(activities.reduce((sum, a) => sum + a.daysOverdue, 0) / activities.length)}
              </div>
            </div>
          </div>

          {/* Activities Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Activity Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Account</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Days Overdue</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Impact</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">CSM</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, idx) => (
                  <tr 
                    key={`${activity.accountId}-${activity.activityType}`}
                    className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${
                      idx === activities.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getActivityIcon(activity.activityType)}</span>
                        <span className="font-medium text-gray-900">{activity.activityType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{activity.accountName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className={`${
                          activity.healthScore < 60 ? 'text-red-600' : 'text-yellow-600'
                        } font-semibold`}>
                          Health: {activity.healthScore}
                        </span>
                        <span>•</span>
                        <span>{formatARR(activity.arr)}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                        activity.daysOverdue > 45 ? 'bg-red-100 text-red-800' :
                        activity.daysOverdue > 30 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        <span className="text-xs">⏰</span>
                        <span className="font-bold">{activity.daysOverdue}d</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">{activity.impact}</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-1 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{activity.csm}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-blue-600">{activity.action}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Breakdown by Activity Type */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Activity Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['QBR', 'Success Plan Review', 'Onboarding Milestone'].map(type => {
                const typeActivities = activities.filter(a => a.activityType === type);
                if (typeActivities.length === 0) return null;
                
                return (
                  <div key={type} className="rounded-lg p-4 border border-gray-200" style={{ backgroundColor: '#F3F3F3' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getActivityIcon(type)}</span>
                        <span className="font-medium text-gray-900 text-sm">{type}</span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">{typeActivities.length}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">{typeActivities.filter(a => a.priority === 'High').length}</span> high priority
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
            <div className="space-y-2 text-sm text-gray-700">
              {activities.filter(a => a.priority === 'High' && a.activityType === 'QBR').length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">🔴</span>
                  <span>
                    <span className="font-semibold">
                      {activities.filter(a => a.priority === 'High' && a.activityType === 'QBR').length} overdue QBRs
                    </span> - Schedule within next week, prioritize accounts with declining health
                  </span>
                </div>
              )}
              {activities.filter(a => a.activityType === 'Success Plan Review').length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">📋</span>
                  <span>
                    <span className="font-semibold">Success plans need updating</span> - Review and align with current business objectives
                  </span>
                </div>
              )}
              {activities.filter(a => a.activityType === 'Onboarding Milestone').length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">🚀</span>
                  <span>
                    <span className="font-semibold">Stalled onboarding detected</span> - Accelerate implementation support and training
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Send automated reminders to CSMs for activities overdue &gt; 30 days</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                📧 Notify CSMs
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                📅 Bulk Schedule
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                📊 Export Report
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
