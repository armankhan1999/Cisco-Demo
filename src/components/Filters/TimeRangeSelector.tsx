'use client';

import { TimeRange } from '@/contexts/FilterContext';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (timeRange: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const options: { value: TimeRange; label: string }[] = [
    { value: '30d', label: '30 Days' },
    { value: '60d', label: '60 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 font-medium">Time Range:</span>
      <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-3 py-1.5 text-xs font-medium transition-colors
              ${value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
              ${option.value !== 'all' ? 'border-r border-gray-200' : ''}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
