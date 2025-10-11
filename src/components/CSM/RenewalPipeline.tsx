'use client';

import React from 'react';
import { RenewalPipeline as RenewalPipelineType } from '@/lib/kpis/csmKPICalculations';

interface RenewalPipelineProps {
  data: RenewalPipelineType[];
  onClick?: (period: RenewalPipelineType) => void;
}

export function RenewalPipeline({ data, onClick }: RenewalPipelineProps) {
  const formatCurrency = (value: number): string => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };
  
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🎯 Renewal Pipeline (Next 180 Days)
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Period
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Count
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                ARR
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Confidence
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                At-Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((period, index) => (
              <tr
                key={index}
                className={`
                  border-b border-gray-100 hover:bg-gray-50 transition-colors
                  ${onClick ? 'cursor-pointer' : ''}
                  ${period.atRisk > 5 ? 'bg-red-50/30' : ''}
                `}
                onClick={() => onClick && onClick(period)}
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {period.period}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-700">
                  {period.count}
                </td>
                <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                  {formatCurrency(period.arr)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getConfidenceColor(period.confidence)}`}>
                    {period.confidence}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  {period.atRisk > 0 ? (
                    <span className="text-red-600 font-semibold">
                      {period.atRisk} ⚠
                    </span>
                  ) : (
                    <span className="text-gray-500">{period.atRisk}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

