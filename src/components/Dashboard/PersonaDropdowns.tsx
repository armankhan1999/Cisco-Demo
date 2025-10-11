'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { colors, personaColors } from '@/config/theme';
import { Persona, getPersonaData } from '@/data/dummyData';

interface PersonaDropdownsProps {
  persona: Persona;
}

export default function PersonaDropdowns({ persona }: PersonaDropdownsProps) {
  const data = getPersonaData(persona) as any; // Type assertion for dummy data
  const personaColor = personaColors[persona];

  // State for each dropdown (DUMMY - will be replaced with real data)
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('');

  const renderCSMDropdowns = () => (
    <>
      <DropdownField
        label="Customer Account"
        value={selectedAccount}
        onChange={setSelectedAccount}
        options={data.accounts?.map((acc: any) => ({ value: acc.id, label: `${acc.name} (${acc.tier})` })) || []}
        placeholder="Select account..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Product"
        value={selectedProduct}
        onChange={setSelectedProduct}
        options={data.products?.map((prod: any) => ({ value: prod.id, label: `${prod.name} - ${prod.category}` })) || []}
        placeholder="Select product..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Time Range"
        value={selectedTimeRange}
        onChange={setSelectedTimeRange}
        options={data.timeRanges || []}
        placeholder="Select range..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Health Status"
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={data.healthCategories?.map((cat: any) => ({ value: cat.value, label: cat.label })) || []}
        placeholder="All statuses..."
        color={personaColor.primary}
      />
    </>
  );

  const renderCODropdowns = () => (
    <>
      <DropdownField
        label="Quote Status"
        value={selectedAccount}
        onChange={setSelectedAccount}
        options={[
          { value: 'all', label: 'All Quotes' },
          { value: 'draft', label: 'Draft' },
          { value: 'sent', label: 'Sent' },
          { value: 'accepted', label: 'Accepted' },
          { value: 'rejected', label: 'Rejected' },
        ]}
        placeholder="Select status..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Revenue Type"
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={data.revenueCategories?.map((cat: any) => ({ value: cat.value, label: cat.label })) || []}
        placeholder="Select type..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Fiscal Period"
        value={selectedTimeRange}
        onChange={setSelectedTimeRange}
        options={data.fiscalPeriods || []}
        placeholder="Select period..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Subscription Status"
        value={selectedProduct}
        onChange={setSelectedProduct}
        options={[
          { value: 'all', label: 'All Subscriptions' },
          { value: 'active', label: 'Active' },
          { value: 'pending_renewal', label: 'Pending Renewal' },
          { value: 'expired', label: 'Expired' },
        ]}
        placeholder="Select status..."
        color={personaColor.primary}
      />
    </>
  );

  const renderSEDropdowns = () => (
    <>
      <DropdownField
        label="Opportunity Stage"
        value={selectedAccount}
        onChange={setSelectedAccount}
        options={data.stages?.map((stage: any) => ({ value: stage.value, label: `${stage.label} (${stage.count})` })) || []}
        placeholder="Select stage..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Expansion Type"
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={data.expansionTypes?.map((type: any) => ({ value: type.value, label: `${type.label} (${type.count})` })) || []}
        placeholder="Select type..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Quarter"
        value={selectedTimeRange}
        onChange={setSelectedTimeRange}
        options={data.quarters?.map((q: any) => ({ value: q.value, label: q.label })) || []}
        placeholder="Select quarter..."
        color={personaColor.primary}
      />
      <DropdownField
        label="Competitor"
        value={selectedProduct}
        onChange={setSelectedProduct}
        options={data.competitors?.map((comp: any) => ({ value: comp.name, label: `${comp.name} (${comp.marketShare}%)` })) || []}
        placeholder="Select competitor..."
        color={personaColor.primary}
      />
    </>
  );

  return (
    <div>
      {persona !== 'SE' ? (
        <>
          <h3 className="text-sm font-semibold mb-4" style={{ color: colors.text.secondary }}>
            Filter & View Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {persona === 'CSM' && renderCSMDropdowns()}
            {persona === 'CO' && renderCODropdowns()}
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm" style={{ color: colors.text.muted }}>
            No filters available - Sales Expansion data pending configuration
          </p>
        </div>
      )}
    </div>
  );
}

// Reusable Dropdown Component
interface DropdownFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  color: string;
}

function DropdownField({ label, value, onChange, options, placeholder, color }: DropdownFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium mb-2" style={{ color: colors.text.secondary }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        style={{
          borderColor: value ? colors.primary.DEFAULT : colors.neutral[300],
          color: colors.text.primary,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
