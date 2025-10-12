'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';

export default function CSMHomePage() {
  const { isCollapsed } = useSidebar();
  const dashboards = [
    {
      id: 'overview',
      name: 'CSM Overview & Strategy',
      description: 'Complete strategic overview with persona definition, business questions, and 10 primary KPIs with definitions',
      category: 'Overview',
      icon: '📋',
      href: '/csm/overview',
      kpis: [
        'Persona Definition & Responsibilities',
        '5 Key Business Questions',
        '10 Strategic KPIs with Targets',
        'Data Source Mapping',
        'Category Classification'
      ],
      status: 'active'
    },
    {
      id: 'portfolio',
      name: 'Customer Success Portfolio Dashboard',
      description: 'Strategic overview with 10 primary KPIs, portfolio health metrics, and renewal pipeline insights',
      category: 'Strategic',
      icon: '📊',
      href: '/csm/portfolio',
      kpis: [
        'Gross Revenue Retention (GRR)',
        'Portfolio Health Score',
        'At-Risk ARR',
        'Renewal Rate',
        'Churn Rate',
        'Average Utilization Rate',
        'Feature Adoption Rate',
        'Customer Engagement Score',
        'Time to Value (TTV)',
        'QBR Completion Rate'
      ],
      status: 'active'
    },
    {
      id: 'deep-dive',
      name: 'Customer Success Deep Dive Analytics',
      description: 'Detailed tactical analysis including health decomposition, adoption trends, and churn risk assessment',
      category: 'Tactical',
      icon: '🔍',
      href: '/csm/deep-dive',
      kpis: [
        'Health Score Decomposition (Usage, Engagement, Support, Business Outcome)',
        'Adoption & Utilization Trends by Product',
        'Churn Risk Analysis by Segment',
        'Customer Journey Stage Analysis'
      ],
      status: 'active'
    },
    {
      id: 'action-center',
      name: 'Customer Success Action Center',
      description: 'Operational dashboard with exception reports, at-risk account alerts, and usage anomaly detection',
      category: 'Operational',
      icon: '🎯',
      href: '/csm/action-center',
      kpis: [
        'Critical Health Accounts (Health ≤ 45)',
        'At-Risk Renewals (Next 90 Days)',
        'Usage Anomaly Alerts',
        'Overdue Success Activities (QBR, Plans, Onboarding)'
      ],
      status: 'active'
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Customer Success Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Maximize customer retention, drive product adoption, ensure value realization, 
            and manage renewal pipeline health with comprehensive analytics
          </p>
        </div>

        {/* Key Focus Areas */}
        <div className="rounded-lg shadow-md p-6 mb-8" style={{ backgroundColor: '#F3F3F3' }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📈</span>
              <div>
                <h3 className="font-semibold text-gray-800">Portfolio Health</h3>
                <p className="text-sm text-gray-600">Monitor health status across all customer accounts</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🔄</span>
              <div>
                <h3 className="font-semibold text-gray-800">Renewal Pipeline</h3>
                <p className="text-sm text-gray-600">Track renewal confidence and at-risk accounts</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-semibold text-gray-800">Churn Prevention</h3>
                <p className="text-sm text-gray-600">Identify and mitigate churn risks proactively</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboards Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Dashboards</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <div
              key={dashboard.id}
              className="rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              style={{ backgroundColor: '#F3F3F3' }}
            >
              {/* Status Badge */}
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{dashboard.icon}</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-white/20 rounded">
                    {dashboard.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{dashboard.name}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  {dashboard.description}
                </p>

                {dashboard.kpis.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Primary KPIs ({dashboard.kpis.length}):</h4>
                    <div className="space-y-1">
                      {dashboard.kpis.slice(0, 5).map((kpi, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{kpi}</span>
                        </div>
                      ))}
                      {dashboard.kpis.length > 5 && (
                        <div className="text-xs text-gray-500 italic">
                          + {dashboard.kpis.length - 5} more KPIs
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {dashboard.status === 'active' ? (
                  <Link
                    href={dashboard.href}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Open Dashboard →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Info */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📊 Real-Time Synthetic Data
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            All dashboards use real-time synthetic data from <code className="bg-white px-2 py-1 rounded text-xs">/src/source_data/</code>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold text-blue-700">150+</div>
              <div className="text-gray-600">Active Accounts</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700">4,000+</div>
              <div className="text-gray-600">Subscriptions</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700">2,700+</div>
              <div className="text-gray-600">Licenses</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700">450+</div>
              <div className="text-gray-600">Revenue Movements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-sm text-gray-500">
        <p>Customer Success Management Dashboard System v1.0</p>
        <p className="mt-2">
          Powered by Next.js 15 | Data from source_data folder | Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
        </div>
      </div>
    </div>
  );
}

