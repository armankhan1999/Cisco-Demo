'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Users, Package, TrendingUp, AlertCircle, Mail, Phone, Calendar } from 'lucide-react';

interface CustomerProfileData {
  account: any;
  customer: any;
  contract: any;
  stakeholders: any[];
  users: any[];
  totalUsers: number;
  licenses: any[];
  metrics: {
    arr: number;
    activeUsers: number;
    productCount: number;
    healthScore: number;
  };
  healthTimeline: any[];
}

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/customer-profile/${resolvedParams.id}`);
      const result = await response.json();
      
      if (result.success) {
        setProfileData(result.data);
      } else {
        setError(result.error || 'Failed to load customer profile');
      }
    } catch (err) {
      setError('Failed to fetch customer profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 360° customer profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load customer profile'}</p>
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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (score >= 45) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getInfluenceColor = (level: string) => {
    if (level === 'High') return 'bg-purple-100 text-purple-800 border-purple-300';
    if (level === 'Medium') return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getChampionColor = (strength: string) => {
    if (strength === 'Strong') return 'text-green-600';
    if (strength === 'Moderate') return 'text-yellow-600';
    return 'text-gray-600';
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
            onClick={fetchProfileData}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profileData.account.name}</h1>
              <p className="text-blue-100 text-lg">360° Customer Profile</p>
            </div>
            {profileData.account.is_hero_account && (
              <span className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-full">
                🏆 HERO ACCOUNT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">ARR</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(profileData.metrics.arr)}</p>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{profileData.metrics.activeUsers.toLocaleString()}</p>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Products</h3>
            <Package className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{profileData.metrics.productCount}</p>
        </div>

        <div className={`rounded-lg shadow-sm border p-6 ${getHealthColor(profileData.metrics.healthScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Health Score</h3>
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{profileData.metrics.healthScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Account Details */}
        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tier:</span>
              <span className="font-semibold text-gray-900">{profileData.account.tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Industry:</span>
              <span className="font-semibold text-gray-900">{profileData.account.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CSM:</span>
              <span className="font-semibold text-gray-900">{profileData.account.csm_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Theater:</span>
              <span className="font-semibold text-gray-900">{profileData.account.geography.theater}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created Date:</span>
              <span className="font-semibold text-gray-900">{formatDate(profileData.account.created_date)}</span>
            </div>
          </div>
        </div>

        {/* Contract Details */}
        {profileData.contract && (
          <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contract Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Contract ID:</span>
                <span className="font-semibold text-gray-900">{profileData.contract.contract_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${profileData.contract.status === 'Active' ? 'text-green-600' : 'text-gray-900'}`}>
                  {profileData.contract.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-semibold text-gray-900">{formatDate(profileData.contract.start_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-semibold text-gray-900">{formatDate(profileData.contract.end_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Terms:</span>
                <span className="font-semibold text-gray-900">{profileData.contract.payment_terms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auto Renewal:</span>
                <span className="font-semibold text-gray-900">{profileData.contract.auto_renewal ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contract Type:</span>
                <span className="font-semibold text-gray-900">{profileData.contract.contract_type}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stakeholders Section */}
      {profileData.stakeholders.length > 0 && (
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-8" style={{ backgroundColor: '#F3F3F3' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Stakeholders ({profileData.stakeholders.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.stakeholders.map((stakeholder, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{stakeholder.name}</h3>
                    <p className="text-sm text-gray-600">{stakeholder.role}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded border ${getInfluenceColor(stakeholder.influence_level)}`}>
                    {stakeholder.influence_level}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{stakeholder.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Last Contact: {formatDate(stakeholder.last_contact)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Engagement Score:</span>
                    <span className="font-bold text-blue-600">{stakeholder.engagement_score}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Champion Strength:</span>
                    <span className={`font-bold ${getChampionColor(stakeholder.champion_strength)}`}>
                      {stakeholder.champion_strength}
                    </span>
                  </div>
                </div>
                
                {stakeholder.engagement_history && stakeholder.engagement_history.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Recent Engagement:</p>
                    {stakeholder.engagement_history.slice(0, 2).map((event: any, eventIdx: number) => (
                      <div key={eventIdx} className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">{event.type}</span> - {formatDate(event.date)} 
                        <span className={`ml-2 ${event.sentiment === 'positive' ? 'text-green-600' : event.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                          ({event.sentiment})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Licenses Section */}
      {profileData.licenses.length > 0 && (
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-8" style={{ backgroundColor: '#F3F3F3' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Product Licenses ({profileData.licenses.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">License Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilization</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Renewal Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profileData.licenses.map((license, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{license.product_family}</td>
                    <td className="px-4 py-3 text-gray-700">{license.license_type}</td>
                    <td className="px-4 py-3 text-gray-700">{license.license_count?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${license.utilization >= 80 ? 'bg-green-500' : license.utilization >= 60 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{ width: `${license.utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{license.utilization}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        license.adoption_stage === 'Mature' ? 'bg-green-100 text-green-800' :
                        license.adoption_stage === 'Growing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {license.adoption_stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(license.renewal_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Section */}
      {profileData.users.length > 0 && (
        <div className="rounded-lg shadow-sm border border-gray-200 p-6 mb-8" style={{ backgroundColor: '#F3F3F3' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Users (Showing {profileData.users.length} of {profileData.totalUsers})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profileData.users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{user.role}</td>
                    <td className="px-4 py-3 text-gray-700">{user.department}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{formatDate(user.last_login)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        user.activity_level === 'High' ? 'bg-green-100 text-green-800' :
                        user.activity_level === 'Medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.activity_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {profileData.totalUsers > 10 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing first 10 users. Total users: {profileData.totalUsers}
            </div>
          )}
        </div>
      )}

      {/* Health Timeline */}
      {profileData.healthTimeline.length > 0 && (
        <div className="rounded-lg shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Health Timeline (Last 6 Months)
          </h2>
          <div className="space-y-4">
            {profileData.healthTimeline.map((timeline, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {new Date(timeline.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                    <p className={`text-2xl font-bold ${getHealthColor(timeline.health_score)}`}>
                      Health Score: {timeline.health_score}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Usage:</span>
                    <span className="ml-2 font-semibold text-gray-900">{timeline.usage_percentage}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Support Tickets:</span>
                    <span className="ml-2 font-semibold text-gray-900">{timeline.support_tickets || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Engagement Events:</span>
                    <span className="ml-2 font-semibold text-gray-900">{timeline.engagement_events?.length || 0}</span>
                  </div>
                  {timeline.expansion_signals && (
                    <div>
                      <span className="text-gray-600">Expansion Signals:</span>
                      <span className="ml-2 font-semibold text-green-600">Yes</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
