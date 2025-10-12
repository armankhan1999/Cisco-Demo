'use client';

import { useState, useEffect } from 'react';
import { QuoteApprovalDrillDownService, type QuoteApprovalLevel4QuoteDetail } from '@/services/quoteApprovalDrillDownService';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, User, DollarSign, Calendar, Target, Phone, Mail } from '@/utils/iconMapping';

interface QuoteApprovalLevel4QuoteDetailProps {
  quoteId: string;
  onBack: () => void;
}

export default function QuoteApprovalLevel4QuoteDetail({ 
  quoteId, 
  onBack 
}: QuoteApprovalLevel4QuoteDetailProps) {
  const [quoteDetail, setQuoteDetail] = useState<QuoteApprovalLevel4QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'workflow' | 'context'>('timeline');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = QuoteApprovalDrillDownService.getLevel4QuoteDetail(quoteId);
        setQuoteDetail(data);
      } catch (error) {
        console.error('Error fetching Quote Approval Level 4 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quoteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quoteDetail) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Quote details not found</p>
        </div>
      </div>
    );
  }

  const currentStageIndex = quoteDetail.approvalWorkflow.approvalChain.findIndex(
    stage => stage.status === 'pending'
  );
  const pendingStage = quoteDetail.approvalWorkflow.approvalChain[currentStageIndex];

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
            Back to Queue
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quote {quoteDetail.quoteNumber} - Approval Workflow
            </h1>
            <p className="text-gray-600">{quoteDetail.customerName} - Detailed approval process analysis</p>
          </div>
        </div>
      </div>

      {/* Quote Summary Card */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Quote Details</h3>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">{quoteDetail.quoteNumber}</p>
              <p className="text-sm text-gray-600">{quoteDetail.productDetails.productFamily}</p>
              <p className="text-sm text-gray-600">{quoteDetail.productDetails.totalLicenses.toLocaleString()} licenses</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Financial Details</h3>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                ${quoteDetail.productDetails.totalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {quoteDetail.productDetails.discountPercentage}% discount
              </p>
              <p className="text-sm text-gray-600">
                Net: ${quoteDetail.productDetails.netAmount.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                {quoteDetail.approvalWorkflow.currentStage}
              </p>
              {pendingStage && (
                <>
                  <p className="text-sm text-gray-600">
                    Assigned to: {pendingStage.approver}
                  </p>
                  <p className="text-sm text-red-600">
                    {pendingStage.daysInStage} days in queue
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Context</h3>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">{quoteDetail.customerContext.segment}</p>
              <p className="text-sm text-gray-600">
                ARR: ${Math.round(quoteDetail.customerContext.arr / 1000)}K
              </p>
              <p className="text-sm text-gray-600">
                Health: {quoteDetail.customerContext.healthScore}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Chain Progress */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Chain Progress</h2>
        
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200 z-0"></div>
          
          <div className="flex items-start justify-between relative z-10">
            {quoteDetail.approvalWorkflow.approvalChain.map((stage, index) => (
              <div key={stage.stage} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Stage Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-white relative ${
                  stage.status === 'completed' ? 'bg-green-500' :
                  stage.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
                }`}>
                  {stage.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : stage.status === 'pending' ? (
                    <Clock className="h-6 w-6" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                  
                  {/* Days badge */}
                  {stage.daysInStage !== undefined && stage.daysInStage > 0 && (
                    <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow border">
                      {stage.daysInStage}d
                    </div>
                  )}
                </div>
                
                {/* Stage Info */}
                <div className="mt-3 text-center max-w-24">
                  <div className="text-xs font-semibold text-gray-900 leading-tight">
                    {stage.stage}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {stage.approver}
                  </div>
                  {stage.timestamp && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(stage.timestamp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="rounded-xl shadow-sm border border-gray-200" style={{ backgroundColor: '#F3F3F3' }}>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'workflow', label: 'Workflow Details', icon: Target },
              { id: 'context', label: 'Customer Context', icon: User }
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
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Quote Timeline</h3>
              
              <div className="space-y-4">
                {quoteDetail.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {event.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{event.stage}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.actor}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Blockers Section */}
              {quoteDetail.blockers.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">🚨 Current Blockers</h4>
                  <div className="space-y-2">
                    {quoteDetail.blockers.map((blocker, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700">{blocker}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Workflow Analysis</h3>
              
              {/* Risk Factors */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">⚠️ Risk Factors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quoteDetail.riskFactors.map((risk, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="text-sm text-yellow-700">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">💡 Recommendations</h4>
                <div className="space-y-3">
                  {quoteDetail.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm text-blue-700">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Actions */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">📞 Next Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Call Approver</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">Send Reminder</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">Escalate to VP</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                    <User className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-700">Schedule Call</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'context' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Context</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Profile */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">🏢 Account Profile</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium text-gray-900">{quoteDetail.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Segment:</span>
                      <span className="font-medium text-gray-900">{quoteDetail.customerContext.segment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ARR:</span>
                      <span className="font-medium text-gray-900">${Math.round(quoteDetail.customerContext.arr / 1000)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Score:</span>
                      <span className={`font-medium ${
                        quoteDetail.customerContext.healthScore >= 80 ? 'text-green-600' :
                        quoteDetail.customerContext.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {quoteDetail.customerContext.healthScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment History:</span>
                      <span className="font-medium text-gray-900">{quoteDetail.customerContext.paymentHistory}</span>
                    </div>
                  </div>
                </div>

                {/* Deal Context */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">💰 Deal Context</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-medium text-gray-900">{quoteDetail.productDetails.productFamily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Licenses:</span>
                      <span className="font-medium text-gray-900">{quoteDetail.productDetails.totalLicenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium text-gray-900">${quoteDetail.productDetails.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className={`font-medium ${
                        quoteDetail.productDetails.discountPercentage > 20 ? 'text-red-600' :
                        quoteDetail.productDetails.discountPercentage > 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {quoteDetail.productDetails.discountPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Amount:</span>
                      <span className="font-medium text-gray-900">${quoteDetail.productDetails.netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval History */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-3">📋 Approval History</h4>
                <div className="space-y-3">
                  {quoteDetail.approvalWorkflow.approvalChain
                    .filter(stage => stage.status === 'completed')
                    .map((stage, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                        <span className="text-sm text-gray-600">by {stage.approver}</span>
                      </div>
                      {stage.timestamp && (
                        <span className="text-sm text-gray-500">
                          {new Date(stage.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
