'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HealthCategory } from '@/lib/kpis/csmKPICalculations';

interface HealthDistributionProps {
  data: HealthCategory[];
  onClick?: (category: HealthCategory) => void;
}

export function HealthDistribution({ data, onClick }: HealthDistributionProps) {
  const router = useRouter();
  
  const statusIcons = {
    success: '✓',
    warning: '⚠',
    danger: '🔴'
  };
  
  // Status badge colors for normal table layout
  const getCategoryColors = (categoryName: string) => {
    const colors: Record<string, { badge: string; text: string; dot: string; icon: string }> = {
      'Thriving': {
        badge: 'bg-green-100 text-green-800 border-green-300',
        text: 'text-gray-900',
        dot: 'bg-green-600',
        icon: '🌟'
      },
      'Healthy': {
        badge: 'bg-green-50 text-green-700 border-green-200',
        text: 'text-gray-900',
        dot: 'bg-green-500',
        icon: '✓'
      },
      'Stable': {
        badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        text: 'text-gray-900',
        dot: 'bg-yellow-500',
        icon: '→'
      },
      'At Risk': {
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        text: 'text-gray-900',
        dot: 'bg-orange-500',
        icon: '⚠️'
      },
      'Critical': {
        badge: 'bg-red-50 text-red-700 border-red-200',
        text: 'text-gray-900',
        dot: 'bg-red-600',
        icon: '🔴'
      }
    };
    
    return colors[categoryName] || colors['Stable'];
  };
  
  const formatCurrency = (value: number): string => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };
  
  const handleRowClick = (category: HealthCategory) => {
    if (onClick) {
      onClick(category);
    } else {
      // Default behavior: navigate to accounts page with health filter
      const categoryName = category.category.split(' ')[0]; // Extract "Thriving", "Healthy", etc.
      router.push(`/csm/accounts?health=${encodeURIComponent(categoryName)}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📈 Portfolio Health Distribution
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Health Category
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Accounts
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ARR
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                % of Total
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((category, index) => {
              const categoryName = category.category.split(' (')[0];
              const colors = getCategoryColors(categoryName);
              
              return (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(category)}
                  title="Click to view accounts in this category"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{categoryName}</div>
                        <div className="text-xs text-gray-500">{category.range}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">{category.accounts}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(category.arr)}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">{category.percentage.toFixed(0)}%</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors.badge}`}>
                      <span>{colors.icon}</span>
                      {categoryName}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        💡 Click on any row to view accounts in that health category
      </div>
    </div>
  );
}

