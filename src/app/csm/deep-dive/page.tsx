'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { HealthScoreDecomposition } from '@/components/CSM/Level2/HealthScoreDecomposition';
import { ProductAdoptionTrends } from '@/components/CSM/Level2/ProductAdoptionTrends';
import { ChurnRiskAnalysis } from '@/components/CSM/Level2/ChurnRiskAnalysis';
import { CustomerJourneyStages } from '@/components/CSM/Level2/CustomerJourneyStages';

type TabView = 'health' | 'adoption' | 'churn' | 'journey';

export default function CSMDeepDivePage() {
  const [activeTab, setActiveTab] = useState<TabView>('health');

  const tabs = [
    { id: 'health' as TabView, label: 'Health Score Decomposition', icon: '🏥' },
    { id: 'adoption' as TabView, label: 'Adoption & Utilization Trends', icon: '📈' },
    { id: 'churn' as TabView, label: 'Churn Risk Analysis', icon: '⚠️' },
    { id: 'journey' as TabView, label: 'Customer Journey Stages', icon: '🚀' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-slate-100">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Customer Success Deep Dive Analytics
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Level 2: Advanced tactical analysis and performance insights
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Real-time synthetic data from source_data | Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
                📊 Export Report
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                🔄 Refresh Data
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
                      ? 'border-blue-600 text-blue-600'
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
          {activeTab === 'health' && <HealthScoreDecomposition />}
          {activeTab === 'adoption' && <ProductAdoptionTrends />}
          {activeTab === 'churn' && <ChurnRiskAnalysis />}
          {activeTab === 'journey' && <CustomerJourneyStages />}
        </div>
      </div>
    </div>
  );
}

