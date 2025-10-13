'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, UserX, Calendar, DollarSign } from 'lucide-react';
import championDepartureData from '@/source_data/csm-data/champion_departure_alerts.json';

export default function ChampionDepartureAlertsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    try {
      const allAlerts = championDepartureData as any[];
      
      // Sort by priority (impact_score descending, then days_to_renewal ascending)
      const sortedAlerts = [...allAlerts].sort((a, b) => {
        if (b.impact_score !== a.impact_score) {
          return b.impact_score - a.impact_score;
        }
        return a.days_to_renewal - b.days_to_renewal;
      });
      
      setAlerts(sortedAlerts);
      
      // Calculate statistics
      const totalARR = allAlerts.reduce((sum, a) => sum + a.arr_at_risk, 0);
      const critical = allAlerts.filter(a => a.impact_score > 80 && a.days_to_renewal < 90);
      const high = allAlerts.filter(a => (a.impact_score > 70 && a.impact_score <= 80) || 
        (a.impact_score > 80 && a.days_to_renewal >= 90));
      
      setStats({
        total: allAlerts.length,
        critical: critical.length,
        high: high.length,
        totalARR
      });
    } catch (error) {
      console.error('Error loading champion departure alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading champion departure alerts...</div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      OPEN: 'bg-red-600 text-white',
      'IN PROGRESS': 'bg-yellow-600 text-white',
      RESOLVED: 'bg-green-600 text-white'
    };
    return badges[status] || badges.OPEN;
  };

  const criticalAlerts = alerts.filter(a => a.impact_score > 80 && a.days_to_renewal < 90);
  const highAlerts = alerts.filter(a => !criticalAlerts.includes(a));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <button
            onClick={() => router.push('/csm/kpi/predicted-churn-risk')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Churn Risk Overview</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserX className="w-8 h-8 text-red-600" />
              🚨 Champion Departure Alerts
            </h1>
            <p className="text-gray-600 mt-2">
              Active alerts for champion departures requiring immediate action
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Active Alerts</div>
            <div className="text-4xl font-bold text-gray-900">{stats.total}</div>
          </div>
          
          <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6 shadow-sm">
            <div className="text-sm text-red-700 mb-1">Critical Priority</div>
            <div className="text-4xl font-bold text-red-600">{stats.critical}</div>
            <div className="text-xs text-red-600 mt-1">Impact &gt;80, Days &lt;90</div>
          </div>
          
          <div className="bg-orange-50 rounded-xl border-2 border-orange-200 p-6 shadow-sm">
            <div className="text-sm text-orange-700 mb-1">High Priority</div>
            <div className="text-4xl font-bold text-orange-600">{stats.high}</div>
          </div>
          
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6 shadow-sm">
            <div className="text-sm text-blue-700 mb-1">Total ARR at Risk</div>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalARR)}</div>
          </div>
        </div>

        {/* Critical Priority Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-red-600 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-2">
                🔴 CRITICAL PRIORITY (Impact Score &gt;80, Days to Renewal &lt;90)
              </h3>
            </div>
            <div className="bg-white rounded-b-xl border-2 border-red-200 divide-y divide-gray-200">
              {criticalAlerts.map((alert, idx) => (
                <div key={idx} className="p-6 hover:bg-red-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-900">{alert.account_name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <span className="font-semibold">Departed Champion:</span> {alert.departed_contact?.name || 'Unknown'} ({alert.departed_contact?.role || 'Unknown Role'})
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Departed</div>
                      <div className="text-sm font-bold text-gray-900">
                        {new Date(alert.departure_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">({getDaysAgo(alert.departure_date)} days ago)</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Detected</div>
                      <div className="text-sm font-bold text-gray-900">{alert.detection_lag_days} days lag</div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-xs text-red-700 mb-1">Impact Score</div>
                      <div className="text-2xl font-bold text-red-600">{alert.impact_score}</div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-xs text-orange-700 mb-1">ARR at Risk</div>
                      <div className="text-xl font-bold text-orange-600">{formatCurrency(alert.arr_at_risk)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <div className="text-xs text-yellow-700 mb-1 font-semibold">Days to Renewal</div>
                      <div className="text-2xl font-bold text-yellow-900">{alert.days_to_renewal} days</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Risk Factors</div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-700">
                          <span className="font-semibold">Multi-threading gap:</span> {(alert.risk_factors.multi_threading_gap * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-700">
                          <span className="font-semibold">Historical churn:</span> {(alert.risk_factors.historical_churn_probability * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Immediate Actions:</h5>
                    <div className="space-y-2">
                      {alert.recommended_actions.map((action: any, aidx: number) => (
                        <div key={aidx} className="flex items-start gap-3">
                          <input type="checkbox" className="mt-1" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-800">{action.action}</div>
                            <div className="text-xs text-gray-500">
                              Priority: {action.priority} | 
                              Owner: {action.owner || 'Unassigned'} | 
                              SLA: {action.sla_days ? `${action.sla_days} days` : 'Pending'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => router.push(`/csm/kpi/predicted-churn-risk/account/${alert.account_id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Full Alert Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Priority Alerts */}
        {highAlerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-orange-500 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-2">
                ⚠️ HIGH PRIORITY - {highAlerts.length} Alerts
              </h3>
            </div>
            <div className="bg-white rounded-b-xl border-2 border-orange-200 divide-y divide-gray-200">
              {highAlerts.slice(0, 3).map((alert, idx) => (
                <div key={idx} className="p-5 hover:bg-orange-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{alert.account_name}</h4>
                        {alert.departed_contact?.role && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{alert.departed_contact.role}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-700">
                        <span>
                          <span className="font-semibold">Departed:</span> {getDaysAgo(alert.departure_date)} days ago
                        </span>
                        <span>
                          <span className="font-semibold">Impact:</span> {alert.impact_score}
                        </span>
                        <span>
                          <span className="font-semibold">ARR:</span> {formatCurrency(alert.arr_at_risk)}
                        </span>
                        <span>
                          <span className="font-semibold">Renewal in:</span> {alert.days_to_renewal} days
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/csm/kpi/predicted-churn-risk/account/${alert.account_id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {highAlerts.length > 3 && (
                <div className="p-4 text-center text-sm text-gray-600">
                  {highAlerts.length - 3} more high-priority alerts...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/csm/kpi/predicted-churn-risk/at-risk-accounts')}
            className="flex-1 bg-blue-600 text-white rounded-xl p-4 hover:bg-blue-700 transition-colors font-semibold"
          >
            View All At-Risk Accounts →
          </button>
          <button
            onClick={() => {
              const csv = alerts.map(a => 
                `${a.account_name},${a.departed_contact?.name || 'Unknown'},${a.departed_contact?.role || 'Unknown Role'},${a.departure_date},${a.impact_score},${a.arr_at_risk},${a.days_to_renewal},${a.status}`
              ).join('\n');
              const blob = new Blob([`Account,Contact,Role,Departure Date,Impact Score,ARR at Risk,Days to Renewal,Status\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'champion-departure-alerts.csv';
              link.click();
            }}
            className="flex-1 bg-gray-600 text-white rounded-xl p-4 hover:bg-gray-700 transition-colors font-semibold"
          >
            Export Alert Report (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
