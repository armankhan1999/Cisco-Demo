'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AccountsTable } from '@/components/AccountsTable/AccountsTable';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';

export default function AccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const healthCategory = searchParams.get('health');
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const accountsData = getActiveAccounts();
      const formattedAccounts = accountsData.map(acc => ({
        id: acc.account.id,
        name: acc.account.name,
        tier: acc.account.tier,
        arr: acc.account.arr,
        health_score: acc.account.health_score
      }));
      setAccounts(formattedAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  // Determine health filter based on category
  let healthFilter = undefined;
  let title = "All Accounts";
  
  if (healthCategory) {
    switch (healthCategory) {
      case 'Thriving':
        healthFilter = { min: 91, max: 101 };
        title = "Thriving Accounts (91-100)";
        break;
      case 'Healthy':
        healthFilter = { min: 76, max: 91 };
        title = "Healthy Accounts (76-90)";
        break;
      case 'Stable':
        healthFilter = { min: 61, max: 76 };
        title = "Stable Accounts (61-75)";
        break;
      case 'At Risk':
        healthFilter = { min: 46, max: 61 };
        title = "At Risk Accounts (46-60)";
        break;
      case 'Critical':
        healthFilter = { min: 0, max: 46 };
        title = "Critical Accounts (0-45)";
        break;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Customer Accounts</h1>
        {healthCategory && (
          <p className="text-gray-600 mt-2">
            Filtered by: <span className="font-semibold">{healthCategory}</span>
          </p>
        )}
      </div>

      <AccountsTable 
        accounts={accounts}
        title={title}
        healthFilter={healthFilter}
      />
    </div>
  );
}
