import React from 'react';

interface MultiProductDrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
}

export default function MultiProductDrillDownModal({ level, onClose, onLevelChange }: MultiProductDrillDownModalProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Multi-Product Penetration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-5xl font-bold leading-none px-4"
          >
            ×
          </button>
        </div>
        
        <div className="px-8 py-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h4 className="text-2xl font-bold mb-6 text-gray-900">Multi-Product Analysis</h4>
            <p className="text-gray-600">Multi-product penetration analysis coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
