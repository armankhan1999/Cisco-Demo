'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Calendar, TrendingUp, ExternalLink } from 'lucide-react';

interface AccountData {
  id: string;
  name: string;
  tier: string;
  industry: string;
  arr: number;
  csm_id: string;
  story_type: string;
  is_hero_account: boolean;
  created_date: string;
  geography: {
    theater: string;
    region: string;
    country: string;
    city: string;
  };
  hero_features?: string[];
  health_score: number;
  risk_level: string;
}

export default function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  const fetchAccountData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/accounts/${resolvedParams.id}`);
      const result = await response.json();
      
      if (result.success) {
        setAccount(result.data);
      } else {
        setError(result.error || 'Failed to load account');
      }
    } catch (err) {
      setError('Failed to fetch account data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load account details'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 45) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getHealthCategory = (score: number) => {
    if (score >= 90) return 'Thriving';
    if (score >= 75) return 'Healthy';
    if (score >= 60) return 'Stable';
    if (score >= 45) return 'At Risk';
    return 'Critical';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'text-green-600 bg-green-50 border-green-200';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={fetchAccountData}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
                {account.is_hero_account && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    🏆 HERO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">{account.id}</span>
                <span>•</span>
                <span>{account.industry}</span>
                <span>•</span>
                <span className="capitalize">{account.story_type.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* ARR */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">ARR</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(account.arr)}</p>
          <p className="text-xs text-gray-500 mt-1">Annual Recurring Revenue</p>
        </div>

        {/* Tier */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Tier</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{account.tier}</p>
          <p className="text-xs text-gray-500 mt-1">Customer Tier</p>
        </div>

        {/* Health Score */}
        <div className={`rounded-lg shadow-sm border p-6 ${getHealthColor(account.health_score)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Health Score</h3>
          </div>
          <p className="text-3xl font-bold">{account.health_score}</p>
          <p className="text-xs mt-1">{getHealthCategory(account.health_score)}</p>
        </div>

        {/* Risk Level */}
        <div className={`rounded-lg shadow-sm border p-6 ${getRiskColor(account.risk_level)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Risk Level</h3>
          </div>
          <p className="text-3xl font-bold">{account.risk_level}</p>
          <p className="text-xs mt-1">Renewal Risk</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tier:</span>
              <span className="font-semibold text-gray-900">{account.tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CSM ID:</span>
              <span className="font-semibold text-gray-900">{account.csm_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Theater:</span>
              <span className="font-semibold text-gray-900">{account.geography.theater}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Region:</span>
              <span className="font-semibold text-gray-900">{account.geography.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Country:</span>
              <span className="font-semibold text-gray-900">{account.geography.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-semibold text-gray-900">{account.geography.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created Date:</span>
              <span className="font-semibold text-gray-900">{formatDate(account.created_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Health Category:</span>
              <span className={`font-semibold ${account.health_score >= 75 ? 'text-green-600' : account.health_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {getHealthCategory(account.health_score)}
              </span>
            </div>
          </div>
        </div>

        {account.is_hero_account && account.hero_features && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border-2 border-yellow-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏆</span> Hero Features
            </h2>
            <ul className="space-y-2">
              {account.hero_features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span className="text-gray-700 capitalize">{feature.replace(/_/g, ' ')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push(`/customer-profile/${account.id}`)}
            className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <span className="font-semibold">View Full Customer Profile</span>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="flex items-center justify-between px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors group">
            <span className="font-semibold">Schedule Meeting</span>
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <button className="flex items-center justify-between px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors group">
            <span className="font-semibold">Review Expansion Plan</span>
            <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
