'use client';

import { useState, useEffect } from 'react';
import { enhancedDrillDownService, QuoteToCashDrillDown, type Level4RootCauseAnalysis } from '@/services/enhancedDrillDownService';
import { 
  ArrowLeft, Building, DollarSign, Calendar, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Phone, Mail, FileText, Users,
  CreditCard, Activity, Target, Zap, MessageSquare, ExternalLink
} from '@/utils/iconMapping';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Level4RootCauseAnalysisProps {
  kpiId: string;
  context: any;
  onBack: () => void;
}

export default function Level4RootCauseAnalysis({ kpiId, context, onBack }: Level4RootCauseAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<Level4RootCauseAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'utilization' | 'actions'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: Level4RootCauseAnalysis | null = null;
        
        if (kpiId === 'quote-to-cash-cycle') {
          data = QuoteToCashDrillDown.getLevel4RootCauseAnalysis(context?.transactionId || '');
        }
        
        setAnalysisData(data);
      } catch (error) {
        console.error('Error fetching Level 4 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kpiId, context]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 85) return 'text-green-600';
    if (utilization >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization >= 85) return 'bg-green-100';
    if (utilization >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Create utilization chart data
  const createUtilizationData = () => {
    if (!analysisData) return [];
    
    return Object.entries(analysisData.utilizationSignal).map(([product, data]) => ({
      product,
      utilization: data.utilization,
      fill: data.utilization >= 85 ? '#10B981' : data.utilization >= 60 ? '#F59E0B' : '#EF4444'
    }));
  };

  // Create timeline chart data
  const createTimelineData = () => {
    if (!analysisData) return [];
    
    return analysisData.timeline.map((event, index) => ({
      step: index + 1,
      event: event.event,
      date: event.date,
      status: event.status,
      days: index * 3 // Simulated days progression
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading root cause analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Analysis not available</p>
          <p className="text-gray-500">Unable to load detailed analysis for this transaction</p>
          <button 
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Transaction Details
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Root Cause Analysis</h1>
                <p className="text-gray-600">Why is {analysisData.customer} experiencing payment delays?</p>
              </div>
            </div>
            
            {/* Customer Quick Info */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="text-lg font-bold text-gray-900">{analysisData.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">ARR</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(analysisData.context.arr)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Health Score</p>
                <p className={`text-lg font-bold ${analysisData.context.healthScore >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {analysisData.context.healthScore}/100
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: <Building className="h-4 w-4" /> },
              { id: 'timeline', name: 'Timeline', icon: <Clock className="h-4 w-4" /> },
              { id: 'utilization', name: 'Utilization', icon: <Activity className="h-4 w-4" /> },
              { id: 'actions', name: 'Actions', icon: <Target className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Customer Context Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Profile */}
              <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Context</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ARR</span>
                    <span className="font-medium text-gray-900">{formatCurrency(analysisData.context.arr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenure</span>
                    <span className="font-medium text-gray-900">{analysisData.context.tenure} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products</span>
                    <span className="font-medium text-gray-900">{analysisData.context.products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Score</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${analysisData.context.healthScore >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {analysisData.context.healthScore}/100
                      </span>
                      {analysisData.context.healthScore >= 70 ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      }
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Support Tickets</span>
                    <span className="font-medium text-gray-900">{analysisData.context.supportTickets} open</span>
                  </div>
                </div>
              </div>

              {/* Financial Pattern */}
              <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Financial Pattern</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Payment Days</span>
                    <span className={`font-medium ${analysisData.financialPattern.avgPaymentDays > 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {analysisData.financialPattern.avgPaymentDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">{analysisData.financialPattern.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Terms</span>
                    <span className="font-medium text-gray-900">{analysisData.financialPattern.creditTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Attempts</span>
                    <span className="font-medium text-gray-900">{analysisData.financialPattern.collectionAttempts}</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Risk Factors</h3>
                </div>
                
                <div className="space-y-3">
                  {analysisData.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Utilization Overview */}
            <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Utilization Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analysisData.utilizationSignal).map(([product, data]) => (
                  <div key={product} className={`p-4 rounded-lg border-2 ${getUtilizationBgColor(data.utilization)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{product}</span>
                      {getTrendIcon(data.trend)}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-2xl font-bold ${getUtilizationColor(data.utilization)}`}>
                        {data.utilization}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Last login: {data.lastLogin}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'timeline' && (
          <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Transaction Timeline</h3>
            
            <div className="space-y-6">
              {analysisData.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {event.status === 'completed' ? 
                      <CheckCircle className="h-5 w-5 text-green-600" /> :
                      <Clock className="h-5 w-5 text-yellow-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.event}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm ${event.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {event.status === 'completed' ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'utilization' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Utilization Chart */}
            <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Utilization</h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={createUtilizationData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="utilization"
                      label={({ product, utilization }) => `${product}: ${utilization}%`}
                    >
                      {createUtilizationData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Utilization Details */}
            <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Utilization Details</h3>
              
              <div className="space-y-4">
                {Object.entries(analysisData.utilizationSignal).map(([product, data]) => (
                  <div key={product} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{product}</span>
                      <span className={`text-lg font-bold ${getUtilizationColor(data.utilization)}`}>
                        {data.utilization}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${data.utilization >= 85 ? 'bg-green-500' : data.utilization >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${data.utilization}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(data.trend)}
                        <span>{data.trend}</span>
                      </div>
                      <span>Last login: {data.lastLogin}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Actions */}
            <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h3>
              
              <div className="space-y-4">
                {analysisData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Schedule Collection Call</p>
                    <p className="text-sm text-gray-600">Contact customer finance team</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Send Payment Reminder</p>
                    <p className="text-sm text-gray-600">Automated payment reminder email</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Escalate to CSM</p>
                    <p className="text-sm text-gray-600">Involve customer success manager</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Update Payment Terms</p>
                    <p className="text-sm text-gray-600">Modify contract payment terms</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <ExternalLink className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">View Full Customer 360</p>
                    <p className="text-sm text-gray-600">Complete customer profile</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
