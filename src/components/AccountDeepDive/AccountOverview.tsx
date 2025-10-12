import React from 'react';

interface AccountOverviewProps {
  account: any;
  daysToRenewal: number;
}

export default function AccountOverview({ account, daysToRenewal }: AccountOverviewProps) {
  const renewalDate = new Date(account.next_renewal_date || '2025-11-27');
  
  return (
    <div className="rounded-lg shadow-md p-6 mb-6" style={{ backgroundColor: '#F3F3F3' }}>
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📋 ACCOUNT OVERVIEW
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Industry:</span>
            <span className="text-gray-900">{account.industry || 'Manufacturing'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Theater:</span>
            <span className="text-gray-900">{account.geography?.theater || 'Americas'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Region:</span>
            <span className="text-gray-900">{account.geography?.region || account.geography?.country || 'US-West'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Tier:</span>
            <span className="text-gray-900">{account.tier || 'Enterprise'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Product:</span>
            <span className="text-gray-900">Meraki Network Management</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">ARR:</span>
            <span className="text-gray-900 font-bold">${account.arr?.toLocaleString() || '180,000'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Contract Start:</span>
            <span className="text-gray-900">{new Date(account.created_date || '2023-01-15').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Next Renewal:</span>
            <span className={`${daysToRenewal < 60 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
              {renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({daysToRenewal} days) {daysToRenewal < 60 ? '🔴' : ''}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Contract Length:</span>
            <span className="text-gray-900">36 months</span>
          </div>
        </div>
      </div>
    </div>
  );
}
