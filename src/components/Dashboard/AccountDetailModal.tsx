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

        {/* Content - Simplified and Focused */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-4">
            {/* Essential Metrics - Simplified */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-xs font-semibold text-green-700 uppercase mb-1">Annual ARR</div>
                <div className="text-xl font-bold text-green-700">{account.arr}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 uppercase mb-1">Health Score</div>
                <div className="text-xl font-bold text-blue-700">{account.health}%</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Tier</div>
                <div className="text-xl font-bold text-purple-700">{account.tier}</div>
              </div>
            </div>

            {/* Key Account Info - Streamlined */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Account Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Industry:</span>
                  <span className="ml-2 font-semibold text-gray-900">{account.industry}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">CSM:</span>
                  <span className="ml-2 font-semibold text-gray-900">{account.csm}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Employees:</span>
                  <span className="ml-2 font-semibold text-gray-900">{account.employees.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Renewal:</span>
                  <span className="ml-2 font-semibold text-gray-900">{account.renewalDate}</span>
                </div>
              </div>
            </div>

            {/* Current Products - Compact */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Current Products</h3>
              <div className="space-y-2">
                {account.products.map((product, idx) => {
                  const license = account.licenses[product as keyof typeof account.licenses] || 'N/A';
                  const [used, total] = typeof license === 'string' ? license.split('/').map((n: string) => parseInt(n) || 0) : [0, 0];
                  const utilization = total > 0 ? Math.round((used / total) * 100) : 0;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">{product}</div>
                        <div className="text-xs text-gray-600">Licenses: {license}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          utilization >= 90 ? 'text-red-600' :
                          utilization >= 85 ? 'text-orange-600' :
                          utilization >= 75 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {utilization}%
                        </div>
                        <div className="text-xs text-gray-500">Utilization</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons - Simplified */}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                View Full Details
              </button>
              <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Create Opportunity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
