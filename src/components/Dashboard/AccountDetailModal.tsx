import React from 'react';
import { accountDataService } from '@/services/accountDataService';

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
    <div className="fixed inset-0 bg-white z-[60] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{accountName}</h2>
              <p className="text-blue-100 mt-1 text-sm">{account.id} • {account.tier} Tier</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Annual ARR</div>
              <div className="text-xl font-bold text-green-600">{account.arr}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Health Score</div>
              <div className="text-xl font-bold text-blue-600">{account.health}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Employees</div>
              <div className="text-xl font-bold text-gray-900">{account.employees.toLocaleString()}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Renewal Date</div>
              <div className="text-base font-bold text-gray-900">{account.renewalDate}</div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Industry</div>
                <div className="text-base font-semibold text-gray-900">{account.industry}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="text-base font-semibold text-gray-900">{account.location}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Customer Success Manager</div>
                <div className="text-base font-semibold text-gray-900">{account.csm}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tier</div>
                <div className="text-base font-semibold text-gray-900">{account.tier}</div>
              </div>
            </div>
          </div>

          {/* Products & Licenses */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Products & License Utilization</h3>
            <div className="space-y-3">
              {account.products.map((product, idx) => {
                const license = account.licenses[product as keyof typeof account.licenses] || 'N/A';
                const [used, total] = typeof license === 'string' ? license.split('/').map((n: string) => parseInt(n) || 0) : [0, 0];
                const utilization = total > 0 ? Math.round((used / total) * 100) : 0;
                
                return (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{product}</div>
                      <div className="text-sm text-gray-600">Licenses: {license}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
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

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { date: '2025-10-08', event: 'QBR Completed', type: 'success' },
                { date: '2025-10-05', event: 'Support Ticket Resolved', type: 'info' },
                { date: '2025-10-01', event: 'License Expansion Opportunity Identified', type: 'warning' },
                { date: '2025-09-28', event: 'Executive Engagement Meeting', type: 'success' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{activity.event}</div>
                    <div className="text-sm text-gray-600">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              View Full Account Details
            </button>
            <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Create Expansion Opportunity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
