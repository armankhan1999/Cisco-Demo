'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { ArrowLeft, Target, TrendingUp, DollarSign, BarChart3, Users, Package } from 'lucide-react';

export default function SalesExpansionOverviewPage() {
  const { isCollapsed } = useSidebar();
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Detect if page is loaded in iframe
    setIsInIframe(window.self !== window.top);
  }, []);

  const businessQuestions = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      question: "Which customers have the highest expansion potential?",
      description: "Identify top accounts for cross-sell and upsell opportunities"
    },
    {
      icon: <Package className="w-6 h-6 text-purple-600" />,
      question: "What white space exists in our product portfolio coverage?",
      description: "Analyze product gaps and untapped revenue opportunities"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      question: "Which accounts are ready for cross-sell conversations?",
      description: "Assess account readiness for expansion discussions"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      question: "How are we performing on NRR and expansion ARR growth?",
      description: "Track retention and expansion revenue metrics"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
      question: "Are reps meeting expansion quota targets?",
      description: "Monitor sales team performance and quota attainment"
    }
  ];

  const kpis = [
    {
      name: "Net Revenue Retention (NRR)",
      definition: "Revenue retention + expansion from existing cohort",
      target: "≥ $46.02M (110%)",
      dataSource: "revenue_movements (expansion - churn) / prior ARR",
      category: "Retention & Growth"
    },
    {
      name: "Expansion ARR",
      definition: "Total ARR from upsell/cross-sell in period",
      target: "≥ $1.60M",
      dataSource: "revenue_movements WHERE movement_type = 'expansion'",
      category: "Revenue Growth"
    },
    {
      name: "Multi-Product Penetration",
      definition: "% of customers with 2+ products",
      target: "≥ 40%",
      dataSource: "customers with multiple licenses",
      category: "Product Adoption"
    },
    {
      name: "White Space Opportunity",
      definition: "Estimated ARR from identified product gaps",
      target: "≥ $8.00M",
      dataSource: "Derived from product coverage matrix + fit scores",
      category: "Opportunity"
    },
    {
      name: "Rep Performance Metrics",
      definition: "Average quota attainment across expansion reps",
      target: "≥ 100%",
      dataSource: "opportunities.quota_attainment BY rep",
      category: "Sales Performance"
    },
    {
      name: "Expansion-Ready Accounts",
      definition: "Accounts with high expansion readiness score",
      target: "≥ 60 accounts",
      dataSource: "Composite score (health + utilization + engagement + budget)",
      category: "Opportunity"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Retention & Growth': 'bg-blue-100 text-blue-800',
      'Revenue Growth': 'bg-green-100 text-green-800',
      'Product Adoption': 'bg-purple-100 text-purple-800',
      'Opportunity': 'bg-orange-100 text-orange-800',
      'Sales Performance': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Hide when in iframe */}
      {!isInIframe && (
        <Sidebar
          currentPersona="SE"
          onPersonaChange={() => {}}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${!isInIframe ? (isCollapsed ? 'ml-[56px]' : 'ml-[280px]') : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-8">
            {!isInIframe && (
              <div className="flex items-center mb-6">
                <Link
                  href="/"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Sales Expansion Leader Overview
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Drive cross-sell, upsell, and multi-product penetration to maximize share-of-wallet
                and ARR growth from existing customers
              </p>
            </div>
          </div>

          {/* Focus Areas & Objectives */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#F3F3F3' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-blue-600" />
                Key Business Questions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessQuestions.map((item, index) => (
                  <div key={index} className="rounded-lg p-6 hover:shadow-md transition-shadow bg-white border border-gray-200">
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
            <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Level 1 — Strategic View
                </h2>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">
                  Sales Expansion Command Center
                </h3>
                <p className="text-gray-600">
                  Primary KPIs (6) - Strategic metrics for sales expansion management
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
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {['Retention & Growth', 'Revenue Growth', 'Product Adoption', 'Opportunity', 'Sales Performance'].map((category) => {
                  const count = kpis.filter(kpi => kpi.category === category).length;
                  return (
                    <div key={category} className="text-center p-4 rounded-lg bg-white border border-gray-200">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${getCategoryColor(category)}`}>
                        {category}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600">KPI{count !== 1 ? 's' : ''}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Critical Alert Callout */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="rounded-lg shadow-md p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                🚨 Utilization-Driven Expansion Signals
              </h3>
              <p className="text-gray-700 mb-4">
                Real-time capacity alerts (&gt;85% utilization) requiring immediate action to capture expansion opportunities.
                Monitor high-utilization accounts for upsell and cross-sell readiness.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-700 font-semibold">Critical (&gt;95%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700 font-semibold">High (90-95%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700 font-semibold">Medium (85-90%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>Sales Expansion Leader Overview | Strategic Dashboard</p>
            <p className="mt-2">
              Powered by Next.js 15 | Data from Sales_Exp_tab.md | Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
