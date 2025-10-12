'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight, HelpCircle, Target, BarChart3, AlertTriangle, TrendingUp, Users, BookOpen, Sparkles } from 'lucide-react';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['persona', 'questions']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const businessQuestions = [
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      question: "What is the health status of our customer portfolio?",
      description: "Monitor overall portfolio health metrics and trends"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      question: "Which accounts are at risk of churn?",
      description: "Identify and prioritize at-risk accounts for intervention"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      question: "How are customers adopting and engaging with our products?",
      description: "Track product adoption rates and engagement patterns"
    },
    {
      icon: <Target className="w-5 h-5 text-purple-600" />,
      question: "What is our renewal pipeline and confidence level?",
      description: "Assess renewal pipeline health and confidence metrics"
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      question: "Where are opportunities to improve customer health and expand?",
      description: "Identify expansion and improvement opportunities"
    }
  ];

  const kpis = [
    {
      name: "Gross Revenue Retention (GRR)",
      definition: "% of ARR retained (excluding expansions)",
      target: "≥ 95%",
      category: "Retention"
    },
    {
      name: "Portfolio Health Score",
      definition: "Weighted avg health score across accounts",
      target: "≥ 75",
      category: "Health"
    },
    {
      name: "At-Risk ARR",
      definition: "Total ARR from accounts with health <60",
      target: "Minimize",
      category: "Risk"
    },
    {
      name: "Renewal Rate",
      definition: "% of contracts renewed (by count and $)",
      target: "≥ 92%",
      category: "Retention"
    },
    {
      name: "Churn Rate",
      definition: "% of ARR lost to non-renewals",
      target: "≤ 5%",
      category: "Risk"
    },
    {
      name: "Average Utilization Rate",
      definition: "Avg % of licenses actively used",
      target: "≥ 75%",
      category: "Adoption"
    },
    {
      name: "Feature Adoption Rate",
      definition: "% of customers using advanced features",
      target: "≥ 60%",
      category: "Adoption"
    },
    {
      name: "Customer Engagement Score",
      definition: "Composite of touch frequency + QBR + NPS",
      target: "≥ 70",
      category: "Engagement"
    },
    {
      name: "Time to Value (TTV)",
      definition: "Days from purchase to productive use",
      target: "≤ 60 days",
      category: "Value"
    },
    {
      name: "QBR Completion Rate",
      definition: "% of accounts with QBR in last 120 days",
      target: "≥ 85%",
      category: "Engagement"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Retention': 'bg-green-100 text-green-800 border-green-200',
      'Health': 'bg-blue-100 text-blue-800 border-blue-200',
      'Risk': 'bg-red-100 text-red-800 border-red-200',
      'Adoption': 'bg-purple-100 text-purple-800 border-purple-200',
      'Engagement': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Value': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Dashboard Guide</h2>
                <p className="text-blue-100 text-sm">Customer Success Leader</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-50 text-sm">
            Everything you need to know about this dashboard and its metrics
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Persona & Objectives */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('persona')}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Persona & Objectives</h3>
              </div>
              {expandedSections.includes('persona') ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {expandedSections.includes('persona') && (
              <div className="p-6 bg-white space-y-4 animate-in slide-in-from-top duration-200">
                <div className="rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
                  <h4 className="font-semibold text-gray-900 mb-2">Primary Responsibility</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Maximize customer retention, drive product adoption, ensure value realization,
                    and manage renewal pipeline health
                  </p>
                </div>
                <div className="rounded-lg p-4 border-l-4 border-blue-500" style={{ backgroundColor: '#F3F3F3' }}>
                  <p className="text-sm text-gray-600 italic">
                    "Focus on delivering exceptional customer experiences and ensuring long-term success"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Key Business Questions */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('questions')}
              className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Key Business Questions</h3>
              </div>
              {expandedSections.includes('questions') ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {expandedSections.includes('questions') && (
              <div className="p-6 bg-white space-y-4 animate-in slide-in-from-top duration-200">
                {businessQuestions.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100"
                    style={{ backgroundColor: '#F3F3F3' }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="mt-0.5">{item.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {item.question}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How to Use This Dashboard */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('howto')}
              className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">How to Use This Dashboard</h3>
              </div>
              {expandedSections.includes('howto') ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {expandedSections.includes('howto') && (
              <div className="p-6 bg-white space-y-4 animate-in slide-in-from-top duration-200">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Monitor KPI Cards</h4>
                      <p className="text-sm text-gray-600">View real-time metrics and trend indicators at a glance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Click to Drill Down</h4>
                      <p className="text-sm text-gray-600">Click any KPI card to explore detailed analytics and insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Take Action</h4>
                      <p className="text-sm text-gray-600">Use action buttons to address critical issues and opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Review Alerts</h4>
                      <p className="text-sm text-gray-600">Check exception alerts for urgent items requiring attention</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KPI Definitions */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('kpis')}
              className="w-full p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">KPI Definitions</h3>
                <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs font-semibold rounded-full">10 Metrics</span>
              </div>
              {expandedSections.includes('kpis') ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {expandedSections.includes('kpis') && (
              <div className="p-6 bg-white space-y-3 animate-in slide-in-from-top duration-200">
                {kpis.map((kpi, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    style={{ backgroundColor: '#F3F3F3' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 flex-1">{kpi.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(kpi.category)}`}>
                        {kpi.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{kpi.definition}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Target:</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        {kpi.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dashboard Info */}
          <div className="rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Dashboard Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dashboard Name:</span>
                <span className="font-medium text-gray-900">Customer Success Portfolio</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="font-medium text-gray-900">Strategic View (Level 1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total KPIs:</span>
                <span className="font-medium text-gray-900">10 Primary Metrics</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Persona:</span>
                <span className="font-medium text-gray-900">Customer Success Leader</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Need more help? Contact your system administrator or visit the documentation portal.
          </p>
        </div>
      </div>
    </>
  );
}
