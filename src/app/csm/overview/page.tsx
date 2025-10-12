'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { ArrowLeft, Target, TrendingUp, Users, BarChart3, AlertTriangle } from 'lucide-react';

export default function CSMOverviewPage() {
  const { isCollapsed } = useSidebar();

  const businessQuestions = [
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      question: "What is the health status of our customer portfolio?",
      description: "Monitor overall portfolio health metrics and trends"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      question: "Which accounts are at risk of churn?",
      description: "Identify and prioritize at-risk accounts for intervention"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      question: "How are customers adopting and engaging with our products?",
      description: "Track product adoption rates and engagement patterns"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      question: "What is our renewal pipeline and confidence level?",
      description: "Assess renewal pipeline health and confidence metrics"
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      question: "Where are opportunities to improve customer health and expand?",
      description: "Identify expansion and improvement opportunities"
    }
  ];

  const kpis = [
    {
      name: "Gross Revenue Retention (GRR)",
      definition: "% of ARR retained (excluding expansions)",
      target: "≥ 95%",
      dataSource: "Prior cohort ARR - churn / prior ARR",
      category: "Retention"
    },
    {
      name: "Portfolio Health Score",
      definition: "Weighted avg health score across accounts",
      target: "≥ 75",
      dataSource: "health_scores weighted by ARR",
      category: "Health"
    },
    {
      name: "At-Risk ARR",
      definition: "Total ARR from accounts with health <60",
      target: "Minimize",
      dataSource: "accounts WHERE health_score <60",
      category: "Risk"
    },
    {
      name: "Renewal Rate",
      definition: "% of contracts renewed (by count and $)",
      target: "≥ 92%",
      dataSource: "subscriptions WHERE renewed = true",
      category: "Retention"
    },
    {
      name: "Churn Rate",
      definition: "% of ARR lost to non-renewals",
      target: "≤ 5%",
      dataSource: "Churned ARR / total ARR",
      category: "Risk"
    },
    {
      name: "Average Utilization Rate",
      definition: "Avg % of licenses actively used",
      target: "≥ 75%",
      dataSource: "licenses.utilization_percentage",
      category: "Adoption"
    },
    {
      name: "Feature Adoption Rate",
      definition: "% of customers using advanced features",
      target: "≥ 60%",
      dataSource: "Feature telemetry data",
      category: "Adoption"
    },
    {
      name: "Customer Engagement Score",
      definition: "Composite of touch frequency + QBR + NPS",
      target: "≥ 70",
      dataSource: "Engagement tracking system",
      category: "Engagement"
    },
    {
      name: "Time to Value (TTV)",
      definition: "Days from purchase to productive use",
      target: "≤ 60 days",
      dataSource: "Onboarding milestone tracking",
      category: "Value"
    },
    {
      name: "QBR Completion Rate",
      definition: "% of accounts with QBR in last 120 days",
      target: "≥ 85%",
      dataSource: "qbr_schedule completion tracking",
      category: "Engagement"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Retention': 'bg-green-100 text-green-800',
      'Health': 'bg-blue-100 text-blue-800',
      'Risk': 'bg-red-100 text-red-800',
      'Adoption': 'bg-purple-100 text-purple-800',
      'Engagement': 'bg-yellow-100 text-yellow-800',
      'Value': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center mb-6">
              <Link 
                href="/csm"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to CSM Dashboard
              </Link>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Customer Success Leader Overview
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Maximize customer retention, drive product adoption, ensure value realization, 
                and manage renewal pipeline health
              </p>
            </div>
          </div>

          {/* Focus Areas & Objectives */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-blue-600" />
                Key Business Questions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessQuestions.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      {item.icon}
                      <h3 className="text-lg font-semibold text-gray-800 ml-3 leading-tight">
                        {item.question}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic View - KPIs */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Level 1 — Strategic View
                </h2>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">
                  Customer Success Portfolio Dashboard
                </h3>
                <p className="text-gray-600">
                  Primary KPIs (10) - Strategic metrics for customer success management
                </p>
              </div>

              {/* KPI Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900 border-b">KPI</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900 border-b">Definition</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900 border-b">Target</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900 border-b">Data Source</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-900 border-b">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpis.map((kpi, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 border-b">
                          <div className="font-semibold text-gray-900">{kpi.name}</div>
                        </td>
                        <td className="py-4 px-4 border-b text-gray-700">
                          {kpi.definition}
                        </td>
                        <td className="py-4 px-4 border-b">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {kpi.target}
                          </span>
                        </td>
                        <td className="py-4 px-4 border-b text-sm text-gray-600 font-mono">
                          {kpi.dataSource}
                        </td>
                        <td className="py-4 px-4 border-b">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(kpi.category)}`}>
                            {kpi.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* KPI Categories Summary */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {['Retention', 'Health', 'Risk', 'Adoption', 'Engagement', 'Value'].map((category) => {
                  const count = kpis.filter(kpi => kpi.category === category).length;
                  return (
                    <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${getCategoryColor(category)}`}>
                        {category}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600">KPIs</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>Customer Success Leader Overview | Strategic Dashboard</p>
            <p className="mt-2">
              Powered by Next.js 15 | Data from CSM_tab1.md | Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
