'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { ArrowLeft, Target, TrendingUp, DollarSign, BarChart3, Clock, FileCheck } from 'lucide-react';

export default function CommercialOpsOverviewPage() {
  const { isCollapsed } = useSidebar();
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Detect if page is loaded in iframe
    setIsInIframe(window.self !== window.top);
  }, []);

  const businessQuestions = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      question: "Are we achieving quote-to-cash cycle time targets?",
      description: "Monitor Q2C process efficiency and cycle time metrics"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-red-600" />,
      question: "Where are bottlenecks causing deal delays?",
      description: "Identify process bottlenecks and inefficiencies"
    },
    {
      icon: <FileCheck className="w-6 h-6 text-green-600" />,
      question: "What is our quote accuracy and approval efficiency?",
      description: "Track quote approval velocity and accuracy rates"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-purple-600" />,
      question: "How effectively are we recognizing and realizing revenue?",
      description: "Monitor revenue recognition accuracy and timing"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      question: "What is our cash collection performance?",
      description: "Assess DSO and cash collection effectiveness"
    }
  ];

  const kpis = [
    {
      name: "Quote-to-Cash Cycle Time",
      definition: "Average days from quote creation to payment received",
      target: "≤ 45 days",
      dataSource: "quote_to_cash_tracking",
      category: "Process Efficiency"
    },
    {
      name: "Quote Approval Velocity",
      definition: "Average days from quote submission to approval",
      target: "≤ 3 days",
      dataSource: "quotes.approval_date - quotes.quote_date",
      category: "Process Efficiency"
    },
    {
      name: "Invoice Accuracy Rate",
      definition: "% of invoices without billing errors",
      target: "≥ 98%",
      dataSource: "invoices.error_count = 0",
      category: "Quality"
    },
    {
      name: "Days Sales Outstanding (DSO)",
      definition: "Average days to collect payment after invoice",
      target: "≤ 30 days",
      dataSource: "accounts_receivable.avg_days_outstanding",
      category: "Cash Management"
    },
    {
      name: "Revenue Recognition Accuracy",
      definition: "Variance between expected and actual recognition",
      target: "≤ 2%",
      dataSource: "revenue_recognition_schedule.variance",
      category: "Revenue"
    },
    {
      name: "Deferred Revenue Balance",
      definition: "Total unearned revenue for future periods",
      target: "Trend",
      dataSource: "revenue_recognition_schedule.total_deferred_balance",
      category: "Revenue"
    },
    {
      name: "Quote Win Rate",
      definition: "% of quotes accepted vs. declined",
      target: "≥ 65%",
      dataSource: "quotes.win_rate",
      category: "Sales Effectiveness"
    },
    {
      name: "Renewal Quote Velocity",
      definition: "Time from renewal trigger to quote delivery",
      target: "≤ 14 days",
      dataSource: "quotes (renewal type)",
      category: "Process Efficiency"
    },
    {
      name: "Overdue Invoices Amount",
      definition: "Total AR balance past due date",
      target: "Minimize",
      dataSource: "invoices.amount_outstanding WHERE overdue",
      category: "Cash Management"
    },
    {
      name: "Expansion ARR Contribution",
      definition: "% of ARR from expansions vs. new business",
      target: "20-30%",
      dataSource: "revenue_movements (expansion type)",
      category: "Growth"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Process Efficiency': 'bg-blue-100 text-blue-800',
      'Quality': 'bg-green-100 text-green-800',
      'Cash Management': 'bg-orange-100 text-orange-800',
      'Revenue': 'bg-purple-100 text-purple-800',
      'Sales Effectiveness': 'bg-indigo-100 text-indigo-800',
      'Growth': 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Hide when in iframe */}
      {!isInIframe && (
        <Sidebar
          currentPersona="CO"
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
                Commercial Operations Leader Overview
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Quote-to-cash process efficiency, pricing accuracy, revenue realization,
                and commercial operations SLA compliance
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
                  Commercial Operations Command Center
                </h3>
                <p className="text-gray-600">
                  Primary KPIs (10) - Strategic metrics for commercial operations management
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
                {['Process Efficiency', 'Quality', 'Cash Management', 'Revenue', 'Sales Effectiveness', 'Growth'].map((category) => {
                  const count = kpis.filter(kpi => kpi.category === category).length;
                  return (
                    <div key={category} className="text-center p-4 rounded-lg bg-white border border-gray-200">
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
            <p>Commercial Operations Leader Overview | Strategic Dashboard</p>
            <p className="mt-2">
              Powered by Next.js 15 | Data from ComOPs_Tab.md | Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
