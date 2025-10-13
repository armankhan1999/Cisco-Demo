# 🔴 How to Remove Dummy Data and Integrate Real Data

## Quick Reference Guide

This guide explains how to remove the dummy data and integrate your real data sources.

---

## Step 1: Identify Dummy Data Usage

The dummy data is centralized in **one file**:
```
src/data/dummyData.ts
```

This file is imported in:
- `src/components/Sidebar/Sidebar.tsx`
- `src/components/Dashboard/Dashboard.tsx`
- `src/components/Dashboard/PersonaDropdowns.tsx`
- `src/components/Dashboard/DashboardStats.tsx`
- `src/app/page.tsx`

---

## Step 2: Create Your Real Data Service

Create a new file for your API/data service:

```typescript
// src/services/dataService.ts

export type Persona = 'CSM' | 'CO' | 'SE';

// Replace with your actual API calls
export async function getPersonaData(persona: Persona) {
  const response = await fetch(`/api/${persona.toLowerCase()}/data`);
  return response.json();
}

export function getPersonaName(persona: Persona): string {
  const names = {
    CSM: 'Customer Success Management',
    CO: 'Commercial Operations',
    SE: 'Sales Expansion',
  };
  return names[persona];
}

export function getPersonaDescription(persona: Persona): string {
  const descriptions = {
    CSM: 'Monitor customer health, engagement, and product adoption',
    CO: 'Track quotes, orders, invoices, and revenue operations',
    SE: 'Identify expansion opportunities and manage sales pipeline',
  };
  return descriptions[persona];
}

// Add more data fetching functions as needed
export async function getAccounts() {
  const response = await fetch('/api/accounts');
  return response.json();
}

export async function getProducts() {
  const response = await fetch('/api/products');
  return response.json();
}

// ... etc
```

---

## Step 3: Update Component Imports

### Before (with dummy data):
```typescript
import { Persona, getPersonaData, getPersonaName } from '@/data/dummyData';
```

### After (with real data):
```typescript
import { Persona, getPersonaData, getPersonaName } from '@/services/dataService';
```

---

## Step 4: Update Components to Use Async Data

### Example: PersonaDropdowns.tsx

**Before (synchronous dummy data):**
```typescript
export default function PersonaDropdowns({ persona }: PersonaDropdownsProps) {
  const data = getPersonaData(persona) as any;
  // ...
}
```

**After (asynchronous real data):**
```typescript
import { useEffect, useState } from 'react';

export default function PersonaDropdowns({ persona }: PersonaDropdownsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getPersonaData(persona);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [persona]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  // ... rest of component
}
```

---

## Step 5: Delete Dummy Data File

Once all components are updated:

```bash
# Delete the dummy data file
rm src/data/dummyData.ts

# Or on Windows
del src\data\dummyData.ts
```

---

## Step 6: Update Type Definitions

Create proper TypeScript interfaces for your data:

```typescript
// src/types/index.ts

export type Persona = 'CSM' | 'CO' | 'SE';

export interface Account {
  id: string;
  name: string;
  tier: 'Strategic' | 'Enterprise' | 'Commercial' | 'SMB';
  arr: number;
  healthScore: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  penetration: number;
}

export interface Quote {
  id: string;
  customer: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  date: string;
}

export interface Opportunity {
  id: string;
  customer: string;
  product: string;
  arr: number;
  stage: string;
  probability: number;
}

// ... add more interfaces as needed
```

---

## Step 7: Update Components with Proper Types

```typescript
// Before
const data = getPersonaData(persona) as any;

// After
import { Account, Product } from '@/types';

interface CSMData {
  accounts: Account[];
  products: Product[];
  // ... other fields
}

const [data, setData] = useState<CSMData | null>(null);
```

---

## Step 8: Add Loading and Error States

```typescript
export default function Dashboard({ persona }: DashboardProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await getPersonaData(persona);
        setData(result);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [persona]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // ... rest of component
}
```

---

## Step 9: Test Thoroughly

1. **Check all personas**: CSM, CO, SE
2. **Test all dropdowns**: Ensure options load correctly
3. **Verify data display**: Stats cards and tables show real data
4. **Test error cases**: What happens if API fails?
5. **Check loading states**: Spinners appear during data fetch

---

## Step 10: Clean Up

Remove any remaining references to dummy data:

```bash
# Search for dummy data references
grep -r "dummyData" src/

# Or on Windows
findstr /s "dummyData" src\*
```

---

## Example: Complete Migration for One Component

### Before: `DashboardStats.tsx` (with dummy data)

```typescript
import { Persona, getPersonaData } from '@/data/dummyData';

export default function DashboardStats({ persona }: DashboardStatsProps) {
  const data = getPersonaData(persona);
  
  return (
    <div>
      {data.accounts.map(account => (
        <div key={account.id}>{account.name}</div>
      ))}
    </div>
  );
}
```

### After: `DashboardStats.tsx` (with real data)

```typescript
import { useEffect, useState } from 'react';
import { Persona } from '@/types';
import { getPersonaData } from '@/services/dataService';

export default function DashboardStats({ persona }: DashboardStatsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getPersonaData(persona);
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [persona]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  
  return (
    <div>
      {data.accounts?.map((account: any) => (
        <div key={account.id}>{account.name}</div>
      ))}
    </div>
  );
}
```

---

## Checklist

- [ ] Created `src/services/dataService.ts` with API calls
- [ ] Created `src/types/index.ts` with TypeScript interfaces
- [ ] Updated all component imports
- [ ] Added `useEffect` hooks for data fetching
- [ ] Added loading states
- [ ] Added error handling
- [ ] Tested all personas (CSM, CO, SE)
- [ ] Tested all dropdowns
- [ ] Verified data displays correctly
- [ ] Deleted `src/data/dummyData.ts`
- [ ] Searched for remaining references
- [ ] Committed changes to git

---

## Need Help?

If you encounter issues during migration:

1. **Check console**: Look for error messages
2. **Verify API endpoints**: Ensure they return correct data structure
3. **Test incrementally**: Migrate one component at a time
4. **Keep dummy data**: Don't delete until everything works

---

**Good luck with your data integration! 🚀**
