'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CSMKPIWrapper from '@/components/CSM/CSMKPIWrapper';
import { CriticalHealthAccounts } from '@/components/CSM/Level3/CriticalHealthAccounts';
import { AtRiskRenewals } from '@/components/CSM/Level3/AtRiskRenewals';
import { UsageAnomalyAlerts } from '@/components/CSM/Level3/UsageAnomalyAlerts';
import { OverdueActivities } from '@/components/CSM/Level3/OverdueActivities';

type TabView = 'critical' | 'renewals' | 'anomalies' | 'overdue';

export default function CSMActionCenterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabView>('critical');

  const tabs = [
    { id: 'critical' as TabView, label: 'Critical Health Accounts', icon: '🚨' },
    { id: 'renewals' as TabView, label: 'At-Risk Renewals', icon: '📉' },
    { id: 'anomalies' as TabView, label: 'Usage Anomaly Alerts', icon: '⚡' },
    { id: 'overdue' as TabView, label: 'Overdue Activities', icon: '⏰' }
  ];

  return (
    <CSMKPIWrapper 
      title="CSM Action Center"
      subtitle="Critical actions and alerts requiring immediate attention"
      showBackButton={false}
    >
      <div className="space-y-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Portfolio Dashboard</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Customer Success Action Center
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Level 3: Operational dashboard with exception reports and actionable alerts
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Real-time synthetic data from source_data | Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
                📧 Send Alert Digest
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg"
              >
                🔄 Refresh Alerts
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {activeTab === 'critical' && <CriticalHealthAccounts />}
          {activeTab === 'renewals' && <AtRiskRenewals />}
          {activeTab === 'anomalies' && <UsageAnomalyAlerts />}
          {activeTab === 'overdue' && <OverdueActivities />}
        </div>
      </div>
    </CSMKPIWrapper>
  );
}
