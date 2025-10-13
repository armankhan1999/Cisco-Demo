import React from 'react';

interface AccountHeaderProps {
  accountName: string;
  accountId: string;
  csmName: string;
  onBack: () => void;
}

export default function AccountHeader({ accountName, accountId, csmName, onBack }: AccountHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-6 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">ACCOUNT DEEP DIVE: {accountName}</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          ← Back
        </button>
      </div>
      <div className="text-blue-100">
        Customer ID: {accountId} | CSM: {csmName} | Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
