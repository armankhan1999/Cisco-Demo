'use client';

import { useState, useEffect } from 'react';
import { Q2CCycleDrillDownService, type Q2CLevel4RootCause } from '@/services/q2cDrillDownService';
import { 
  ArrowLeft, Building, DollarSign, Calendar, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, Clock, Phone, Mail, FileText, Users,
  CreditCard, Activity, Target, Zap, MessageSquare, ExternalLink
} from '@/utils/iconMapping';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Q2CLevel4RootCauseAnalysisProps {
  customerId: string;
  onBack: () => void;
}

export default function Q2CLevel4RootCauseAnalysis({ customerId, onBack }: Q2CLevel4RootCauseAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<Q2CLevel4RootCause | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'utilization' | 'actions'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = Q2CCycleDrillDownService.getLevel4RootCauseAnalysis(customerId);
        setAnalysisData(data);
      } catch (error) {
        console.error('Error fetching Q2C Level 4 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available for this customer</div>
      </div>
    );
  }

  // Prepare utilization chart data
  const utilizationData = Object.entries(analysisData.utilizationSignal).map(([product, data]) => ({
    name: product,
    utilization: data.utilization,
    color: data.status === 'good' ? '#10B981' : data.status === 'warning' ? '#F59E0B' : '#EF4444'
  }));

  // Prepare timeline data for chart
  const timelineChartData = analysisData.timeline.map((item, index) => ({
    stage: item.stage,
    date: item.date,
    status: item.status,
    order: index + 1
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{analysisData.customerName} - Root Cause Analysis</h1>
            <p className="text-gray-600">Why is this customer delayed?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Phone className="h-4 w-4" />
            Contact Customer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Mail className="h-4 w-4" />
            Send Email
          </button>
        </div>
      </div>

      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="font-medium text-gray-700">ARR</span>
          </div>
          <p className="text-2xl font-bold text-green-600">${Math.round(analysisData.customerContext.arr / 1000)}K</p>
          <p className="text-sm text-gray-600">{analysisData.customerContext.tier}</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-700">Tenure</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{analysisData.customerContext.tenure}</p>
          <p className="text-sm text-gray-600">months</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-gray-700">Health Score</span>
          </div>
          <p className={`text-2xl font-bold ${
            analysisData.customerContext.healthScore >= 80 ? 'text-green-600' :
            analysisData.customerContext.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {analysisData.customerContext.healthScore}
          </p>
          <p className="text-sm text-gray-600">out of 100</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="font-medium text-gray-700">Avg Payment</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{analysisData.financialPattern.avgPaymentDays}</p>
          <p className="text-sm text-gray-600">days</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: Building },
              { id: 'timeline', name: 'Timeline', icon: Clock },
              { id: 'utilization', name: 'Utilization', icon: Activity },
              { id: 'actions', name: 'Actions', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Context */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Context</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium">{analysisData.customerContext.products.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Support Tickets:</span>
                      <span className="font-medium">{analysisData.customerContext.supportTickets} open</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{analysisData.financialPattern.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Terms:</span>
                      <span className="font-medium">{analysisData.financialPattern.creditTerms}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Risk Factors</h3>
                  <div className="space-y-2">
                    {analysisData.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-red-700 text-sm">{risk}</span>
                      </div>
                    ))}
                    {analysisData.riskFactors.length === 0 && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-700 text-sm">No major risk factors identified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Target className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-900 font-medium">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Timeline</h3>
              
              {/* Timeline Visualization */}
              <div className="space-y-4">
                {analysisData.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{item.stage}</p>
                        <span className="text-sm text-gray-600">{item.date}</span>
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Utilization Tab */}
          {activeTab === 'utilization' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Utilization</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Utilization Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={utilizationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="utilization"
                        label={({ name, utilization }) => `${name}: ${utilization}%`}
                      >
                        {utilizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Utilization Details */}
                <div className="space-y-4">
                  {Object.entries(analysisData.utilizationSignal).map(([product, data]) => (
                    <div key={product} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{product}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          data.status === 'good' ? 'bg-green-100 text-green-800' :
                          data.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              data.status === 'good' ? 'bg-green-500' :
                              data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${data.utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{data.utilization}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Immediate Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Immediate Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Contact Finance Team</div>
                        <div className="text-sm text-gray-600">Call customer finance directly</div>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Send Payment Reminder</div>
                        <div className="text-sm text-gray-600">Automated payment reminder email</div>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-900">Review Credit Terms</div>
                        <div className="text-sm text-gray-600">Assess payment terms adjustment</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Escalation Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Escalation Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <Users className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-900">Escalate to CSM</div>
                        <div className="text-sm text-gray-600">Involve customer success manager</div>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <CreditCard className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-medium text-gray-900">Collections Process</div>
                        <div className="text-sm text-gray-600">Initiate formal collections</div>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">View AR Details</div>
                        <div className="text-sm text-gray-600">Open full AR management system</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
