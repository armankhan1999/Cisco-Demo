import React from 'react';

interface Alert {
  id: number;
  severity: 'high' | 'medium' | 'low';
  title: string;
  triggered: string;
  details: string;
  impact: string;
  action: string;
  status: string;
}

interface AlertsProps {
  alerts: Alert[];
  potentialARR: number;
}

export default function AlertsRecommendations({ alerts, potentialARR }: AlertsProps) {
  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-50 border-red-300';
    if (severity === 'medium') return 'bg-yellow-50 border-yellow-300';
    return 'bg-blue-50 border-blue-300';
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'high') return '🔴';
    if (severity === 'medium') return '🟡';
    return '🔵';
  };

  return (
    <div className="rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: '#F3F3F3' }}>
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        ⚠️ ACTIVE ALERTS & RECOMMENDATIONS
      </h2>
      
      <div className="mb-4">
        <div className="mb-3">
          <span className="font-medium">Open Alerts:</span>
          <span className="ml-2 text-lg font-bold">{alerts.length}</span>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border-2 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-1">
                    ALERT #{alert.id}: {alert.title} (Severity: {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)})
                  </div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div><strong>Triggered:</strong> {alert.triggered}</div>
                    <div><strong>Current:</strong> {alert.details}</div>
                    <div><strong>Impact:</strong> {alert.impact}</div>
                    <div><strong>Recommended Action:</strong> {alert.action}</div>
                    <div><strong>Status:</strong> {alert.status}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-2 border-red-400 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="text-lg font-bold text-red-800">
            Potential ARR Impact: ${potentialARR.toLocaleString()} (100% of account ARR at risk)
          </div>
        </div>
      </div>
    </div>
  );
}
