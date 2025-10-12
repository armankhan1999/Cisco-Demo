'use client';

import { AlertTriangle, FileText, DollarSign, Users, ChevronRight } from 'lucide-react';
import { ExceptionAlert } from '@/services/commercialOpsService';

interface ExceptionAlertsPanelProps {
  alerts: ExceptionAlert[];
}

export default function ExceptionAlertsPanel({ alerts }: ExceptionAlertsPanelProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'quotes':
        return <FileText className="h-5 w-5" />;
      case 'invoices':
        return <DollarSign className="h-5 w-5" />;
      case 'accounts':
        return <Users className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-800'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800'
        };
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  };

  return (
    <div className="rounded-xl shadow-sm border border-gray-200 p-6 mb-8" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">Exception Alerts</h2>
        <span className="text-sm text-gray-500 ml-2">(Requires Action)</span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const colors = getSeverityColor(alert.severity);
          
          return (
            <div
              key={alert.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${colors.icon} p-2 bg-white rounded-lg shadow-sm`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-semibold text-gray-900">
                        {alert.count}
                      </span>
                      <span className={`${colors.text} font-medium`}>
                        {alert.message}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge} uppercase`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Total Impact: {formatAmount(alert.amount * 1000)}</span>
                      <span>•</span>
                      <span className="capitalize">{alert.type} requiring attention</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>

              {/* Progress Bar for Impact */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Impact Level</span>
                  <span>{alert.severity === 'high' ? '85%' : alert.severity === 'medium' ? '60%' : '35%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: alert.severity === 'high' ? '85%' : alert.severity === 'medium' ? '60%' : '35%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter(a => a.severity === 'medium').length}
            </div>
            <div className="text-sm text-gray-600">Medium Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatAmount(alerts.reduce((sum, alert) => sum + (alert.amount * 1000), 0))}
            </div>
            <div className="text-sm text-gray-600">Total Impact</div>
          </div>
        </div>
      </div>
    </div>
  );
}
