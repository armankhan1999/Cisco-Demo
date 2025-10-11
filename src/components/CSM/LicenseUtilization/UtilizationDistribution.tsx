'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateUtilizationDistribution, type UtilizationDistribution } from '../../../lib/kpis/licenseUtilizationKPIs';

interface UtilizationDistributionProps {
  onBucketClick?: (bucket: string) => void;
}

export function UtilizationDistribution({ onBucketClick }: UtilizationDistributionProps) {
  const router = useRouter();
  const [distribution, setDistribution] = useState<UtilizationDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const calculatedDistribution = calculateUtilizationDistribution();
      setDistribution(calculatedDistribution);
      setLoading(false);
    } catch (error) {
      console.error('Error loading Utilization Distribution:', error);
      setLoading(false);
    }
  }, []);

  const getBucketIcon = (status: string) => {
    switch (status) {
      case 'critical': return '🔴';
      case 'high-risk': return '🔴';
      case 'moderate': return '🟡';
      case 'healthy': return '🟢';
      case 'optimal': return '🟢';
      case 'overage': return '🟠';
      default: return '⚪';
    }
  };

  const getBucketColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high-risk': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-orange-500 text-white';
      case 'healthy': return 'bg-green-500 text-white';
      case 'optimal': return 'bg-green-600 text-white';
      case 'overage': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const getMaxAccounts = () => {
    return Math.max(...distribution.map(d => d.accounts));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Table with proper structure */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Utilization Range
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                Accounts
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                ARR
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                % of Portfolio
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {distribution.map((bucket, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition-colors ${onBucketClick ? 'cursor-pointer' : ''}`}
                onClick={() => onBucketClick?.(bucket.range)}
                title={onBucketClick ? `Click to view accounts in ${bucket.range} range` : ''}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getBucketIcon(bucket.status)}</span>
                    <div>
                      <div className="font-medium text-gray-900">{bucket.range}</div>
                      <div className="text-gray-500">Avg: {bucket.avgUtilization.toFixed(0)}%</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/csm/kpi/license-details?focus=range&range=${encodeURIComponent(bucket.range)}`);
                    }}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    title={`View ${bucket.accounts} accounts in ${bucket.range} range`}
                  >
                    {bucket.accounts}
                  </button>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(bucket.arr)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-gray-900">
                  {bucket.percentage.toFixed(1)}%
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${getBucketColor(bucket.status)}`}>
                    {bucket.status.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Click on any row to view detailed accounts in that utilization range
      </div>
    </div>
  );
}
