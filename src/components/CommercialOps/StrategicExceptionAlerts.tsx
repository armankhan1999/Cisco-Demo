'use client';

import { AlertTriangle, FileText, DollarSign, Users, ChevronRight, Clock } from 'lucide-react';
import { ExceptionAlert } from '@/services/commercialOpsService';

interface StrategicExceptionAlertsProps {
  alerts: ExceptionAlert[];
}

export default function StrategicExceptionAlerts({ alerts }: StrategicExceptionAlertsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'quotes':
        return <FileText className="h-6 w-6" />;
      case 'invoices':
        return <DollarSign className="h-6 w-6" />;
      case 'accounts':
        return <Users className="h-6 w-6" />;
      default:
        return <AlertTriangle className="h-6 w-6" />;
    }
  };

  const getSeverityConfig = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-red-100',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          badge: 'bg-red-500 text-white',
          pulse: 'animate-pulse'
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-500 text-white',
          pulse: ''
        };
      case 'low':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          badge: 'bg-blue-500 text-white',
          pulse: ''
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
    <div className="rounded-xl shadow-sm border border-gray-200 p-8" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Exception Alerts</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Requires Action</span>
      </div>

      <div className="space-y-6">
        {alerts.map((alert) => {
          const config = getSeverityConfig(alert.severity);
          
          return (
            <div
              key={alert.id}
              className={`${config.bg} ${config.border} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group ${config.pulse}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`${config.icon} p-3 bg-white rounded-xl shadow-sm`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {alert.count}
                      </span>
                      <span className={`${config.text} font-semibold text-lg`}>
                        {alert.message}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.badge} uppercase tracking-wide`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Total Impact: <span className="font-semibold">{formatAmount(alert.amount * 1000)}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="capitalize">{alert.type} requiring attention</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                    View Details
                  </button>
                  <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>

              {/* Impact Visualization */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Business Impact Level</span>
                  <span>{alert.severity === 'high' ? '90%' : alert.severity === 'medium' ? '65%' : '40%'}</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: alert.severity === 'high' ? '90%' : alert.severity === 'medium' ? '65%' : '40%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Dashboard */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-sm font-medium text-red-700">High Priority</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {alerts.filter(a => a.severity === 'medium').length}
            </div>
            <div className="text-sm font-medium text-yellow-700">Medium Priority</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {alerts.filter(a => a.severity === 'low').length}
            </div>
            <div className="text-sm font-medium text-blue-700">Low Priority</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatAmount(alerts.reduce((sum, alert) => sum + (alert.amount * 1000), 0))}
            </div>
            <div className="text-sm font-medium text-gray-700">Total Impact</div>
          </div>
        </div>
      </div>
    </div>
  );
}
