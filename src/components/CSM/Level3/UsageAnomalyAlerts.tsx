'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { getUsageAnomalyAlerts, UsageAnomaly } from '@/lib/kpis/usageAnomalyAlerts';

export function UsageAnomalyAlerts() {
  const [alerts, setAlerts] = useState<UsageAnomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getUsageAnomalyAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading usage anomalies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading usage anomalies...</div>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'High':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const emoji = severity === 'Critical' ? '🔴' : severity === 'High' ? '🟡' : '🟢';
    return `${emoji} ${severity}`;
  };

  return (
    <div className="rounded-xl shadow-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Usage Anomaly Alerts
          </h2>
          <p className="text-sm text-gray-600 mt-1">Automated detection of unusual usage patterns</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{alerts.length}</div>
          <div className="text-xs text-gray-500">Active Alerts</div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-green-600 text-lg font-medium">✓ No anomalies detected</div>
          <div className="text-sm text-gray-500 mt-2">All usage patterns appear normal</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg p-4 border border-red-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-red-700 mb-1">Critical Alerts</div>
              <div className="text-2xl font-bold text-red-900">
                {alerts.filter(a => a.severity === 'Critical').length}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-orange-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-orange-700 mb-1">High Priority</div>
              <div className="text-2xl font-bold text-orange-900">
                {alerts.filter(a => a.severity === 'High').length}
              </div>
            </div>
            <div className="rounded-lg p-4 border border-yellow-200" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-sm font-medium text-yellow-700 mb-1">Medium Priority</div>
              <div className="text-2xl font-bold text-yellow-900">
                {alerts.filter(a => a.severity === 'Medium').length}
              </div>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Alert ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Account</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Issue</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Severity</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Days Active</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, idx) => (
                  <tr 
                    key={alert.alertId}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      idx === alerts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs text-gray-600">{alert.alertId}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{alert.accountName}</div>
                      <div className="text-xs text-gray-500">ID: {alert.accountId.slice(-4)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900">{alert.product}</div>
                      <div className="text-xs text-gray-500">
                        {alert.change !== 0 && (
                          <span className={`flex items-center gap-1 ${alert.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {alert.change < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                            {alert.previousUtilization}% → {alert.currentUtilization}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{alert.issue}</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                        {alert.severity}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className={`font-semibold ${
                        alert.daysActive > 7 ? 'text-red-600' : alert.daysActive > 3 ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {alert.daysActive} days
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-blue-600 font-medium">{alert.recommendedAction}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actionable Insights */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Actionable Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.filter(a => a.severity === 'Critical').length > 0 && (
                <div className="border border-red-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-900">Critical Usage Drops</div>
                      <div className="text-sm text-red-800 mt-1">
                        {alerts.filter(a => a.severity === 'Critical').length} accounts with severe usage decline (&gt; 45%)
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-red-700">
                    → Immediate CSM outreach required within 24 hours
                  </div>
                </div>
              )}

              {alerts.filter(a => a.severity === 'High').length > 0 && (
                <div className="border border-orange-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-orange-900">High Priority Issues</div>
                      <div className="text-sm text-orange-800 mt-1">
                        {alerts.filter(a => a.severity === 'High').length} accounts showing concerning patterns
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-orange-700">
                    → Check with champions and verify account status
                  </div>
                </div>
              )}

              {alerts.filter(a => a.issue.includes('stalled')).length > 0 && (
                <div className="border border-yellow-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="flex items-start gap-2 mb-2">
                    <Activity className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-yellow-900">Adoption Stalls</div>
                      <div className="text-sm text-yellow-800 mt-1">
                        {alerts.filter(a => a.issue.includes('stalled')).length} accounts with stalled feature adoption
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-yellow-700">
                    → Schedule training sessions and enablement resources
                  </div>
                </div>
              )}

              {alerts.filter(a => a.daysActive > 10).length > 0 && (
                <div className="border border-blue-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-blue-900">Long-Standing Alerts</div>
                      <div className="text-sm text-blue-800 mt-1">
                        {alerts.filter(a => a.daysActive > 10).length} alerts active for 10+ days
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-700">
                    → Review CSM action plans and escalate if needed
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                📧 Send Alert Digest to CSMs
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                📊 Generate Detailed Report
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                ✓ Mark Alerts as Reviewed
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
