'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, AlertTriangle, TrendingDown, Users, Package } from 'lucide-react';
import { getAccountChurnPrediction, ChurnPrediction } from '@/lib/kpis/predictedChurnRisk';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<ChurnPrediction | null>(null);
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    try {
      const pred = getAccountChurnPrediction(accountId);
      const accounts = getActiveAccounts();
      const account = accounts.find(a => a.account.id === accountId);
      
      setPrediction(pred);
      setAccountData(account);
    } catch (error) {
      console.error('Error loading account details:', error);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading account details...</div>
      </div>
    );
  }

  if (!prediction || !accountData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Account not found</div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, string> = {
      Critical: 'bg-red-600 text-white',
      High: 'bg-orange-500 text-white',
      Medium: 'bg-yellow-500 text-white',
      Low: 'bg-green-500 text-white'
    };
    return badges[severity] || badges.Medium;
  };

  const getRiskColor = (probability: number) => {
    if (probability >= 0.7) return 'text-red-600';
    if (probability >= 0.4) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <button
            onClick={() => router.push('/csm/kpi/predicted-churn-risk/at-risk-accounts')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to At-Risk Accounts</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Account Risk Profile: {prediction.account_name}
            </h1>
            <p className="text-gray-600 mt-2">
              Detailed churn risk analysis and recommended interventions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto">
        
        {/* Risk Overview Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Risk Overview */}
          <div className="bg-white rounded-xl border-2 border-red-200 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              RISK OVERVIEW
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Churn Probability</div>
                <div className={`text-5xl font-bold ${getRiskColor(prediction.churn_probability)}`}>
                  {(prediction.churn_probability * 100).toFixed(0)}% 🔴
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Days to Churn</div>
                  <div className="text-2xl font-bold text-gray-900">{prediction.estimated_days_to_churn} days</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Health Score</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {prediction.current_health_score} 
                    <span className="text-sm text-red-600 ml-2">
                      (↓{Math.abs(prediction.velocity_metrics.health_velocity).toFixed(1)})
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Intervention</div>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  prediction.intervention_urgency === 'Critical' ? 'bg-red-600 text-white' :
                  prediction.intervention_urgency === 'High' ? 'bg-orange-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}>
                  {prediction.intervention_urgency.toUpperCase()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Confidence</div>
                <div className="text-lg font-bold text-gray-900">
                  {prediction.confidence_level} ({(prediction.confidence_score * 100).toFixed(0)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ACCOUNT DETAILS</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer ID:</span>
                <span className="text-sm font-bold text-gray-900">{prediction.account_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tier:</span>
                <span className="text-sm font-bold text-gray-900">{accountData.account.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ARR at Risk:</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(prediction.arr_at_risk)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Contract End:</span>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(prediction.contract_end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days to Renewal:</span>
                <span className="text-sm font-bold text-gray-900">{prediction.days_to_renewal} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Model Version:</span>
                <span className="text-xs text-gray-500">{prediction.model_type} ({prediction.model_version})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            🚨 TOP RISK FACTORS (Contributing to {(prediction.churn_probability * 100).toFixed(0)}% Churn Probability)
          </h3>
          
          <div className="space-y-4">
            {prediction.risk_factors.map((factor, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-lg p-5 hover:border-orange-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">{idx + 1}. {factor.severity === 'Critical' ? '❌' : factor.severity === 'High' ? '📉' : '🔕'} {factor.severity.toUpperCase()}: {factor.factor}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{factor.description}</div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-600">
                        <span className="font-semibold">Impact:</span> {(factor.contribution_to_risk * 100).toFixed(0)}% contribution to risk
                      </span>
                      <span className="text-gray-600">
                        <span className="font-semibold">Severity:</span> {factor.severity}
                      </span>
                      <span className={`font-semibold ${
                        factor.trend_direction === 'Worsening' ? 'text-red-600' :
                        factor.trend_direction === 'Improving' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        <span className="text-gray-600">Trend:</span> {factor.trend_direction}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadge(factor.severity)}`}>
                    {factor.severity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Velocity Metrics */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Velocity Metrics</h3>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Health Velocity</div>
              <div className={`text-2xl font-bold ${
                prediction.velocity_metrics.health_velocity < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {prediction.velocity_metrics.health_velocity.toFixed(2)} pts/day
              </div>
              <div className="text-xs text-gray-500 mt-1">Trend: {prediction.velocity_metrics.health_trend}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Usage Velocity</div>
              <div className={`text-2xl font-bold ${
                prediction.velocity_metrics.usage_velocity < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {prediction.velocity_metrics.usage_velocity.toFixed(2)}%/day
              </div>
              <div className="text-xs text-gray-500 mt-1">Trend: {prediction.velocity_metrics.usage_trend}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Engagement Velocity</div>
              <div className={`text-2xl font-bold ${
                prediction.velocity_metrics.engagement_velocity < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {prediction.velocity_metrics.engagement_velocity.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Trend: {prediction.velocity_metrics.engagement_trend}</div>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            ✅ RECOMMENDED IMMEDIATE ACTIONS
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-red-600 mb-3">Priority 1 (Next 48 Hours):</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Executive Business Review with C-level stakeholder</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Deep-dive usage analysis to identify adoption blockers</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Review contract terms for early renewal incentives</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-orange-600 mb-3">Priority 2 (Next 7 Days):</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Technical health check across all products</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Identify and engage additional champions</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Create value realization plan with measurable outcomes</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-yellow-600 mb-3">Priority 3 (Next 30 Days):</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Increase executive touch points (target: 2 per month)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Product training sessions to drive utilization</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Quarterly business review preparation</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
