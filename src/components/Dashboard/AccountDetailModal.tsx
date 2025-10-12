import React from 'react';
import { accountDataService } from '@/services/accountDataService';
import { X, TrendingUp, Users, Calendar } from 'lucide-react';

interface AccountDetailModalProps {
  accountName: string;
  onClose: () => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({ accountName, onClose }) => {
  // Load real account data from master data
  const accountFromService = accountDataService.getAccountByName(accountName);
  
  // Fallback data structure for accounts not in master data
  const fallbackData = {
    id: 'CUST_XXXXX',
    name: accountName,
    tier: 'Enterprise',
    arr: '$500K',
    health: 80,
    csm: 'Sarah Johnson',
    products: ['Duo'],
    licenses: { Duo: '500/600' },
    renewalDate: '2025-12-31',
    industry: 'Technology',
    employees: 1000,
    location: 'Unknown'
  };

  const account = accountFromService || fallbackData;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Premium Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{accountName}</h2>
              <div className="flex items-center gap-4 text-blue-100">
                <span className="text-sm font-medium">{account.id}</span>
                <span className="text-sm">•</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                  {account.tier} Tier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-8 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">Annual ARR</div>
                </div>
                <div className="text-2xl font-bold text-green-700">{account.arr}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Health Score</div>
                </div>
                <div className="text-2xl font-bold text-blue-700">{account.health}%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Employees</div>
                </div>
                <div className="text-2xl font-bold text-purple-700">{account.employees.toLocaleString()}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Renewal</div>
                </div>
                <div className="text-lg font-bold text-orange-700">{account.renewalDate}</div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Industry</div>
                    <div className="text-base font-bold text-gray-900 mt-1">{account.industry}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Location</div>
                    <div className="text-base font-bold text-gray-900 mt-1">{account.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Customer Success Manager</div>
                    <div className="text-base font-bold text-gray-900 mt-1">{account.csm}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Tier</div>
                    <div className="text-base font-bold text-gray-900 mt-1">{account.tier}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products & Licenses */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Products & License Utilization</h3>
              <div className="space-y-3">
                {account.products.map((product, idx) => {
                  const license = account.licenses[product as keyof typeof account.licenses] || 'N/A';
                  const [used, total] = typeof license === 'string' ? license.split('/').map((n: string) => parseInt(n) || 0) : [0, 0];
                  const utilization = total > 0 ? Math.round((used / total) * 100) : 0;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900">{product}</div>
                        <div className="text-sm text-gray-600 mt-1">Licenses: {license}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${
                          utilization >= 90 ? 'text-red-600' :
                          utilization >= 85 ? 'text-orange-600' :
                          utilization >= 75 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {utilization}%
                        </div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilization</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { date: '2025-10-08', event: 'QBR Completed', type: 'success' },
                  { date: '2025-10-05', event: 'Support Ticket Resolved', type: 'info' },
                  { date: '2025-10-01', event: 'License Expansion Opportunity Identified', type: 'warning' },
                  { date: '2025-09-28', event: 'Executive Engagement Meeting', type: 'success' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500 shadow-lg shadow-green-200' :
                      activity.type === 'warning' ? 'bg-yellow-500 shadow-lg shadow-yellow-200' :
                      'bg-blue-500 shadow-lg shadow-blue-200'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{activity.event}</div>
                      <div className="text-sm text-gray-500 mt-1">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg">
                View Full Account Details
              </button>
              <button className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg">
                Create Expansion Opportunity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
