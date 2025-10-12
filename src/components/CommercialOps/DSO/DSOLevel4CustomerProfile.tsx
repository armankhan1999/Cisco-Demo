'use client';

import { useState, useEffect } from 'react';
import { DSODrillDownService, type DSOLevel4CustomerProfile } from '@/services/dsoDrillDownService';
import { ArrowLeft, DollarSign, Clock, AlertTriangle, User, Phone, Mail, Calendar, Target, TrendingUp, CheckCircle } from '@/utils/iconMapping';

interface DSOLevel4CustomerProfileProps {
  customerId: string;
  onBack: () => void;
}

export default function DSOLevel4CustomerProfile({ 
  customerId, 
  onBack 
}: DSOLevel4CustomerProfileProps) {
  const [customerProfile, setCustomerProfile] = useState<DSOLevel4CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'payment' | 'context' | 'activity'>('payment');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = DSODrillDownService.getLevel4CustomerProfile(customerId);
        setCustomerProfile(data);
      } catch (error) {
        console.error('Error fetching DSO Level 4 data:', error);
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

  if (!customerProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Customer profile not found</p>
        </div>
      </div>
    );
  }

  // Render payment time chart
  const renderPaymentChart = (paymentTimes: number[]) => {
    const maxTime = Math.max(...paymentTimes, 60);
    return (
      <div className="flex items-end gap-1 h-16">
        {paymentTimes.map((time, index) => (
          <div
            key={index}
            className={`w-4 rounded-t ${time > 45 ? 'bg-red-500' : time > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ height: `${(time / maxTime) * 100}%`, minHeight: '8px' }}
            title={`Invoice ${index + 1}: ${time} days`}
          ></div>
        ))}
      </div>
    );
  };

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
            Back to Customers
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customerProfile.customerName} - Collections Dashboard
            </h1>
            <p className="text-gray-600">Complete payment profile and collection strategy</p>
          </div>
        </div>
      </div>

      {/* Customer Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Total AR</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${Math.round(customerProfile.totalAR / 1000)}K
          </p>
          <p className="text-sm text-blue-600">{customerProfile.invoiceDetails.length} invoices</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-700">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            ${Math.round(customerProfile.overdueAmount / 1000)}K
          </p>
          <p className="text-sm text-red-600">{customerProfile.overduePercentage}% of total</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Avg Payment</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {customerProfile.historicalPerformance.avgDaysToPay} days
          </p>
          <p className="text-sm text-green-600">Historical average</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-purple-700">On-Time Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {customerProfile.historicalPerformance.onTimeRate}%
          </p>
          <p className="text-sm text-purple-600">Last 12 invoices</p>
        </div>
      </div>

      {/* Risk Assessment Banner */}
      <div className={`p-4 rounded-xl border ${
        customerProfile.riskAssessment.collectionsRisk === 'high' ? 'bg-red-50 border-red-200' :
        customerProfile.riskAssessment.collectionsRisk === 'medium' ? 'bg-yellow-50 border-yellow-200' :
        'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-6 w-6 ${
              customerProfile.riskAssessment.collectionsRisk === 'high' ? 'text-red-500' :
              customerProfile.riskAssessment.collectionsRisk === 'medium' ? 'text-yellow-500' :
              'text-green-500'
            }`} />
            <div>
              <h3 className={`font-semibold ${
                customerProfile.riskAssessment.collectionsRisk === 'high' ? 'text-red-800' :
                customerProfile.riskAssessment.collectionsRisk === 'medium' ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                Collections Risk: {customerProfile.riskAssessment.collectionsRisk.toUpperCase()}
              </h3>
              <p className={`text-sm ${
                customerProfile.riskAssessment.collectionsRisk === 'high' ? 'text-red-600' :
                customerProfile.riskAssessment.collectionsRisk === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                Renewal Risk: {customerProfile.riskAssessment.renewalRisk} | 
                Relationship: {customerProfile.riskAssessment.relationshipStrength}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              customerProfile.riskAssessment.collectionsRisk === 'high' ? 'text-red-700' :
              customerProfile.riskAssessment.collectionsRisk === 'medium' ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              ARR: ${Math.round(customerProfile.customerContext.arr / 1000)}K | 
              Health: {customerProfile.customerContext.healthScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'payment', label: 'Payment Pattern', icon: DollarSign },
              { id: 'context', label: 'Customer Context', icon: User },
              { id: 'activity', label: 'Collection Activity', icon: Phone }
            ].map(tab => {
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
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Pattern Analysis</h3>
              
              {/* Invoice Aging */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">📊 Outstanding Invoices</h4>
                  <div className="space-y-3">
                    {customerProfile.invoiceDetails.map((invoice, index) => (
                      <div key={invoice.invoiceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-600">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${Math.round(invoice.amount / 1000)}K
                          </div>
                          <div className={`text-sm font-medium ${
                            invoice.daysOverdue > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {invoice.daysOverdue > 0 ? `${invoice.daysOverdue}d overdue` : 'Current'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">📈 Historical Performance</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Average Days to Pay</span>
                        <span className="text-lg font-bold text-blue-600">
                          {customerProfile.historicalPerformance.avgDaysToPay} days
                        </span>
                      </div>
                      <div className="text-xs text-blue-600">vs 30 day target</div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">On-Time Payment Rate</span>
                        <span className="text-lg font-bold text-green-600">
                          {customerProfile.historicalPerformance.onTimeRate}%
                        </span>
                      </div>
                      <div className="text-xs text-green-600">Last 12 invoices</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Payment Time Trend</div>
                      {renderPaymentChart(customerProfile.historicalPerformance.paymentTimes)}
                      <div className="text-xs text-gray-500 mt-1">Last 12 invoices (days to pay)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'context' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Context & Risk Profile</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Profile */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">🏢 Account Profile</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium text-gray-900">{customerProfile.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Segment:</span>
                      <span className="font-medium text-gray-900">{customerProfile.customerContext.segment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ARR:</span>
                      <span className="font-medium text-gray-900">
                        ${Math.round(customerProfile.customerContext.arr / 1000)}K
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium text-gray-900">
                        {customerProfile.customerContext.products.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Score:</span>
                      <span className={`font-medium ${
                        customerProfile.customerContext.healthScore >= 80 ? 'text-green-600' :
                        customerProfile.customerContext.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {customerProfile.customerContext.healthScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CSM:</span>
                      <span className="font-medium text-gray-900">{customerProfile.customerContext.csm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renewal Date:</span>
                      <span className="font-medium text-gray-900">
                        {customerProfile.customerContext.renewalDate} ({customerProfile.customerContext.daysToRenewal}d)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">⚠️ Risk Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Collections Risk:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customerProfile.riskAssessment.collectionsRisk === 'high' ? 'bg-red-100 text-red-800' :
                        customerProfile.riskAssessment.collectionsRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {customerProfile.riskAssessment.collectionsRisk.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Renewal Risk:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customerProfile.riskAssessment.renewalRisk === 'high' ? 'bg-red-100 text-red-800' :
                        customerProfile.riskAssessment.renewalRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {customerProfile.riskAssessment.renewalRisk.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Relationship:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customerProfile.riskAssessment.relationshipStrength === 'strong' ? 'bg-green-100 text-green-800' :
                        customerProfile.riskAssessment.relationshipStrength === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {customerProfile.riskAssessment.relationshipStrength.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">💡 Collection Strategy</h5>
                    <div className="text-xs text-gray-600 space-y-1">
                      {customerProfile.riskAssessment.collectionsRisk === 'high' && (
                        <>
                          <div>• Immediate escalation to CSM</div>
                          <div>• Consider payment plan options</div>
                          <div>• Executive engagement required</div>
                        </>
                      )}
                      {customerProfile.riskAssessment.collectionsRisk === 'medium' && (
                        <>
                          <div>• Regular follow-up cadence</div>
                          <div>• Monitor payment behavior</div>
                          <div>• CSM awareness recommended</div>
                        </>
                      )}
                      {customerProfile.riskAssessment.collectionsRisk === 'low' && (
                        <>
                          <div>• Standard collection process</div>
                          <div>• Automated reminders sufficient</div>
                          <div>• Monitor for changes</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Collection Activity & Next Steps</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Collection Attempts */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">📞 Collection Attempts</h4>
                  <div className="space-y-3">
                    {customerProfile.collectionActivity.attempts.map((attempt, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          attempt.type === 'email' ? 'bg-blue-100' :
                          attempt.type === 'phone' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {attempt.type === 'email' ? (
                            <Mail className={`h-4 w-4 ${
                              attempt.type === 'email' ? 'text-blue-600' :
                              attempt.type === 'phone' ? 'text-green-600' : 'text-red-600'
                            }`} />
                          ) : attempt.type === 'phone' ? (
                            <Phone className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 capitalize">
                              {attempt.type.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-gray-500">{attempt.date}</span>
                          </div>
                          <div className={`text-sm mt-1 ${
                            attempt.status === 'responded' ? 'text-green-600' :
                            attempt.status === 'opened' ? 'text-blue-600' :
                            attempt.status === 'no_response' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            Status: {attempt.status.replace('_', ' ')}
                          </div>
                          {attempt.notes && (
                            <div className="text-xs text-gray-600 mt-1">{attempt.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">📅 Next Steps</h4>
                  <div className="space-y-3">
                    {customerProfile.collectionActivity.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.priority === 'high' ? 'bg-red-500' :
                          step.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{step.action}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              step.priority === 'high' ? 'bg-red-100 text-red-800' :
                              step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {step.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Due: {step.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">🔗 Quick Actions</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-700">Log Call</span>
                      </button>
                      <button className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">Send Payment Link</span>
                      </button>
                      <button className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-red-700">Escalate to CSM</span>
                      </button>
                      <button className="flex items-center gap-2 p-2 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-purple-700">Payment Plan</span>
                      </button>
                    </div>
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
