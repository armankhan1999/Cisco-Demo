'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { 
  enrichAccount, 
  getProductAdoption, 
  getUserActivity, 
  getStakeholderEngagement,
  type EnrichedAccount
} from '../../../../lib/data/accountEnricher';

export default function Account360Page({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params);
  const router = useRouter();
  
  const [enrichedData, setEnrichedData] = useState<EnrichedAccount | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [stakeholderData, setStakeholderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'stakeholders'>('overview');

  useEffect(() => {
    try {
      const enriched = enrichAccount(customerId);
      
      if (!enriched) {
        setLoading(false);
        return;
      }
      
      const products = getProductAdoption(customerId);
      const users = getUserActivity(customerId);
      const stakeholders = getStakeholderEngagement(customerId);
      
      setEnrichedData(enriched);
      setProductData(products);
      setUserData(users);
      setStakeholderData(stakeholders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading 360 view:', error);
      setLoading(false);
    }
  }, [customerId]);

  const getHealthColor = (score: number) => {
    if (score >= 75) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
    if (score >= 60) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 360° Account View...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!enrichedData) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h2>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ← Back to Accounts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const account = enrichedData.account.account || enrichedData.account;
  const healthColor = getHealthColor(account.health_score);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              ← Back to Accounts
            </button>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{account.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{account.id}</span>
                    <span>•</span>
                    <span>{account.industry}</span>
                    <span>•</span>
                    <span>{account.geography?.region || account.region}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-900">{account.tier}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${healthColor.badge}`}>
                    Health: {Math.ceil(account.health_score)}
                  </span>
                  <span className="text-2xl font-bold text-green-700">
                    {formatCurrency(enrichedData.metrics.totalARR)}
                  </span>
                  <span className="text-xs text-gray-500">Total ARR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{enrichedData.metrics.totalLicenses}</div>
              <div className="text-xs text-gray-600">Total Licenses</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-blue-700">{enrichedData.metrics.activeUsers}</div>
              <div className="text-xs text-gray-600">Active Users (30d)</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-green-700">{enrichedData.metrics.avgUtilization}%</div>
              <div className="text-xs text-gray-600">Avg Utilization</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-purple-700">{productData?.totalProducts || 0}</div>
              <div className="text-xs text-gray-600">Products</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-orange-700">{enrichedData.metrics.keyStakeholders}</div>
              <div className="text-xs text-gray-600">Key Stakeholders</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex gap-6">
                {(['overview', 'products', 'users', 'stakeholders'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Products Summary */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Products & Licenses</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-gray-900">{productData?.totalProducts || 0}</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-blue-700">{enrichedData.metrics.totalLicenses}</div>
                    <div className="text-sm text-blue-600">Total Licenses</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-green-700">{productData?.avgUtilization || 0}%</div>
                    <div className="text-sm text-green-600">Avg Utilization</div>
                  </div>
                </div>
                {productData?.products && productData.products.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Top Products:</h4>
                    {productData.products.slice(0, 3).map((product: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-900">{product.family}</div>
                          <div className="text-xs text-gray-600">{product.licenses} licenses • {product.adoptionStage}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-700">{product.utilization}%</div>
                          <div className="text-xs text-gray-500">Utilization</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Users Summary */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">👥 User Activity</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-gray-900">{userData?.totalUsers || 0}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-blue-700">{userData?.mau || 0}</div>
                    <div className="text-sm text-blue-600">MAU (30d)</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-green-700">{userData?.wau || 0}</div>
                    <div className="text-sm text-green-600">WAU (7d)</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-purple-700">{userData?.utilizationRate || 0}%</div>
                    <div className="text-sm text-purple-600">Engagement</div>
                  </div>
                </div>
                {userData?.activityBreakdown && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-bold text-green-700">{userData.activityBreakdown.High}</div>
                      <div className="text-xs text-green-600">High Activity</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="font-bold text-yellow-700">{userData.activityBreakdown.Medium}</div>
                      <div className="text-xs text-yellow-600">Medium Activity</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-bold text-gray-700">{userData.activityBreakdown.Low}</div>
                      <div className="text-xs text-gray-600">Low Activity</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stakeholders Summary */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🤝 Stakeholder Engagement</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-gray-900">{stakeholderData?.totalStakeholders || 0}</div>
                    <div className="text-sm text-gray-600">Stakeholders</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-yellow-700">{stakeholderData?.champions || 0}</div>
                    <div className="text-sm text-yellow-600">Champions</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-blue-700">{stakeholderData?.avgEngagementScore || 0}</div>
                    <div className="text-sm text-blue-600">Avg Score</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-xl font-bold text-purple-700">{stakeholderData?.influenceLevels?.High || 0}</div>
                    <div className="text-sm text-purple-600">High Influence</div>
                  </div>
                </div>
                {stakeholderData?.keyContacts && stakeholderData.keyContacts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Key Contacts:</h4>
                    {stakeholderData.keyContacts.slice(0, 3).map((contact: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-900">{contact.name}</div>
                          <div className="text-xs text-gray-600">{contact.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-blue-700">{contact.influenceLevel} Influence</div>
                          <div className="text-xs text-gray-500">Score: {contact.engagementScore}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && productData && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Product Portfolio ({productData.totalProducts} Products)</h3>
              <div className="space-y-3">
                {productData.products.map((product: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{product.family}</h4>
                        <span className="text-xs text-gray-600">Implemented: {new Date(product.implementationDate).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.utilization >= 80 ? 'bg-green-100 text-green-800' :
                        product.utilization >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.utilization}% Utilization
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Licenses</div>
                        <div className="font-semibold text-gray-900">{product.licenses}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Adoption Stage</div>
                        <div className="font-semibold text-gray-900">{product.adoptionStage}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Annual Value</div>
                        <div className="font-semibold text-green-700">{formatCurrency(product.annualValue)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Renewal Date</div>
                        <div className="font-semibold text-gray-900">{new Date(product.renewalDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && userData && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">User Base ({userData.totalUsers} Users)</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Activity Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">MAU (30 days):</span>
                      <span className="font-bold text-blue-700">{userData.mau}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">WAU (7 days):</span>
                      <span className="font-bold text-green-700">{userData.wau}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DAU (today):</span>
                      <span className="font-bold text-purple-700">{userData.dau}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Engagement Rate:</span>
                      <span className="font-bold text-orange-700">{userData.utilizationRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Activity Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">High Activity</span>
                        <span className="text-sm font-bold text-green-700">{userData.activityBreakdown.High}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(userData.activityBreakdown.High / userData.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Medium Activity</span>
                        <span className="text-sm font-bold text-yellow-700">{userData.activityBreakdown.Medium}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${(userData.activityBreakdown.Medium / userData.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Low Activity</span>
                        <span className="text-sm font-bold text-gray-700">{userData.activityBreakdown.Low}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${(userData.activityBreakdown.Low / userData.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stakeholders' && stakeholderData && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Stakeholder Network ({stakeholderData.totalStakeholders} Contacts)</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Influence Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">High Influence:</span>
                      <span className="font-bold text-purple-700">{stakeholderData.influenceLevels.High}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Medium Influence:</span>
                      <span className="font-bold text-blue-700">{stakeholderData.influenceLevels.Medium}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Low Influence:</span>
                      <span className="font-bold text-gray-700">{stakeholderData.influenceLevels.Low}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Engagement</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Champions:</span>
                      <span className="font-bold text-yellow-700">{stakeholderData.champions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Engagement Score:</span>
                      <span className="font-bold text-green-700">{stakeholderData.avgEngagementScore}/10</span>
                    </div>
                  </div>
                </div>
              </div>

              {stakeholderData.keyContacts && stakeholderData.keyContacts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Key Contacts ({stakeholderData.keyContacts.length})</h4>
                  <div className="space-y-3">
                    {stakeholderData.keyContacts.map((contact: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-gray-900">{contact.name}</h5>
                            <p className="text-sm text-gray-600">{contact.role}</p>
                            <p className="text-xs text-gray-500 mt-1">{contact.email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              contact.influenceLevel === 'High' ? 'bg-purple-100 text-purple-800' :
                              contact.influenceLevel === 'Medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {contact.influenceLevel}
                            </span>
                            <div className="text-sm mt-2">
                              <span className="text-gray-600">Score: </span>
                              <span className="font-bold text-green-700">{contact.engagementScore}/10</span>
                            </div>
                            {contact.championStrength && (
                              <div className="text-xs text-yellow-700 mt-1">
                                🏆 {contact.championStrength} Champion
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
