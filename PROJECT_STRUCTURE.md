# Analytics Hub - Project Structure & Documentation

## 📋 Overview

Professional React/Next.js application with persona-driven sidebar navigation for three business domains:
- **CSM** (Customer Success Management)
- **CO** (Commercial Operations)
- **SE** (Sales Expansion)

## 🎨 Design Features

- **Color Palette**: Professional blue/teal theme (inspired by enterprise design)
- **Sidebar-Only Navigation**: No navbar, clean sidebar with persona panels
- **Responsive Layout**: Collapsible sidebar, fluid content area
- **Modular Architecture**: Easy team collaboration and component expansion

---

## 📁 Project Structure

```
cisco/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx             # Main page with sidebar + dashboard
│   │   └── globals.css          # Global styles
│   │
│   ├── components/
│   │   ├── Sidebar/
│   │   │   └── Sidebar.tsx      # Persona-driven sidebar navigation
│   │   │
│   │   └── Dashboard/
│   │       ├── Dashboard.tsx           # Main dashboard container
│   │       ├── PersonaDropdowns.tsx    # Persona-specific filter dropdowns
│   │       └── DashboardStats.tsx      # Stats cards and data tables
│   │
│   ├── config/
│   │   └── theme.ts             # Color palette, typography, spacing
│   │
│   └── data/
│       └── dummyData.ts         # 🔴 DUMMY DATA - Remove when integrating real data
│
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Key Components

### 1. **Sidebar Component** (`components/Sidebar/Sidebar.tsx`)

**Features:**
- Three persona panels: CSM, CO, SE
- Collapsible sidebar (280px → 80px)
- Active state highlighting with accent colors
- Smooth animations and transitions

**Props:**
```typescript
interface SidebarProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}
```

**Usage:**
```tsx
<Sidebar 
  currentPersona={currentPersona} 
  onPersonaChange={setCurrentPersona} 
/>
```

---

### 2. **Dashboard Component** (`components/Dashboard/Dashboard.tsx`)

**Features:**
- Persona-specific header with gradient background
- Filter dropdowns section
- Main content area with stats and tables

**Props:**
```typescript
interface DashboardProps {
  persona: Persona;
}
```

---

### 3. **PersonaDropdowns Component** (`components/Dashboard/PersonaDropdowns.tsx`)

**Features:**
- 4 dropdowns per persona (customized for each)
- CSM: Account, Product, Time Range, Health Status
- CO: Quote Status, Revenue Type, Fiscal Period, Subscription Status
- SE: Opportunity Stage, Expansion Type, Quarter, Competitor

**State Management:**
```typescript
const [selectedAccount, setSelectedAccount] = useState('');
const [selectedProduct, setSelectedProduct] = useState('');
const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
const [selectedCategory, setSelectedCategory] = useState('');
```

---

### 4. **DashboardStats Component** (`components/Dashboard/DashboardStats.tsx`)

**Features:**
- 4 stat cards with icons and progress bars
- Data table with persona-specific columns
- Hover effects and responsive grid layout

---

## 🎨 Theme Configuration (`config/theme.ts`)

### Color Palette

```typescript
colors = {
  primary: {
    DEFAULT: '#049FD9',  // Blue
    dark: '#0D274D',     // Dark Blue
    light: '#00BCEB',    // Light Blue
    hover: '#0385B5',    // Hover state
  },
  secondary: {
    teal: '#6CC04A',     // Teal/Green
    purple: '#7B5EA7',   // Purple
    orange: '#F58220',   // Orange
    red: '#ED1C24',      // Red
  },
  // ... neutral, semantic, background, text colors
}
```

### Persona Colors

```typescript
personaColors = {
  CSM: { primary: '#049FD9', accent: '#6CC04A' },
  CO:  { primary: '#7B5EA7', accent: '#00BCEB' },
  SE:  { primary: '#F58220', accent: '#049FD9' },
}
```

### Spacing

```typescript
spacing = {
  sidebar: { width: '280px', collapsedWidth: '80px' },
  header: { height: '64px' },
  content: { padding: '24px' },
}
```

---

## 🔴 DUMMY DATA (`data/dummyData.ts`)

### ⚠️ IMPORTANT: Removing Dummy Data

**This file contains static dummy data for development only.**

**To integrate real data:**

1. **Delete** `src/data/dummyData.ts`
2. **Update imports** in components:
   ```typescript
   // Before
   import { getPersonaData } from '@/data/dummyData';
   
   // After
   import { getPersonaData } from '@/services/api'; // Your real data source
   ```
3. **Replace** `getPersonaData()` with your API calls or data fetching logic

### Dummy Data Structure

```typescript
// CSM Data
csmDummyData = {
  accounts: [...],      // 5 sample accounts
  products: [...],      // 5 products
  csms: [...],          // 3 CSMs
  healthCategories: [...],
  timeRanges: [...],
}

// CO Data
coDummyData = {
  quotes: [...],        // 4 quotes
  orders: [...],        // 3 orders
  invoices: [...],      // 3 invoices
  subscriptions: [...], // 4 subscriptions
  revenueCategories: [...],
  fiscalPeriods: [...],
}

// SE Data
seDummyData = {
  opportunities: [...], // 5 opportunities
  triggers: [...],      // 4 triggers
  competitors: [...],   // 5 competitors
  expansionTypes: [...],
  stages: [...],
  quarters: [...],
}
```

---

## 🔧 Customization Guide

### Adding a New Persona

1. **Update Type** (`data/dummyData.ts`):
   ```typescript
   export type Persona = 'CSM' | 'CO' | 'SE' | 'NEW_PERSONA';
   ```

2. **Add Color Scheme** (`config/theme.ts`):
   ```typescript
   personaColors = {
     // ... existing
     NEW_PERSONA: {
       primary: '#YOUR_COLOR',
       accent: '#YOUR_ACCENT',
       gradient: 'from-[#COLOR1] to-[#COLOR2]',
     },
   }
   ```

3. **Add Sidebar Icon** (`components/Sidebar/Sidebar.tsx`):
   ```typescript
   const getPersonaIcon = (persona: Persona) => {
     const icons = {
       // ... existing
       NEW_PERSONA: <svg>...</svg>,
     };
   }
   ```

4. **Add Dropdowns** (`components/Dashboard/PersonaDropdowns.tsx`):
   ```typescript
   const renderNewPersonaDropdowns = () => (
     <>
       <DropdownField ... />
       {/* Add 4 dropdowns */}
     </>
   );
   ```

5. **Add Stats** (`components/Dashboard/DashboardStats.tsx`):
   ```typescript
   const renderNewPersonaStats = () => (
     <div className="grid ...">
       <StatCard ... />
       {/* Add 4 stat cards */}
     </div>
   );
   ```

---

### Modifying Colors

Edit `src/config/theme.ts`:

```typescript
export const colors = {
  primary: {
    DEFAULT: '#YOUR_PRIMARY_COLOR',
    dark: '#YOUR_DARK_COLOR',
    // ...
  },
  // ...
}
```

---

### Adding New Dropdown Options

Edit `src/data/dummyData.ts`:

```typescript
export const csmDummyData = {
  // ... existing
  newDropdownOptions: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ],
}
```

Then add the dropdown in `PersonaDropdowns.tsx`:

```typescript
<DropdownField
  label="New Dropdown"
  value={selectedNew}
  onChange={setSelectedNew}
  options={data.newDropdownOptions || []}
  placeholder="Select..."
  color={personaColor.primary}
/>
```

---

## 👥 Team Collaboration

### Component Ownership

| Component | Purpose | Owner |
|-----------|---------|-------|
| `Sidebar.tsx` | Navigation | Team Member A |
| `Dashboard.tsx` | Layout | Team Member B |
| `PersonaDropdowns.tsx` | Filters | Team Member C |
| `DashboardStats.tsx` | Data Display | Team Member D |

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Use Prettier (if configured)
- **Naming**: PascalCase for components, camelCase for functions
- **Comments**: Document complex logic

---

## 🐛 Troubleshooting

### TypeScript Errors

If you see module import errors, restart the TypeScript server:
- VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

### Tailwind Not Working

Ensure `tailwind.config.js` includes all source paths:
```javascript
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
],
```

### Sidebar Not Showing

Check that `layout.tsx` doesn't have conflicting styles.

---

## 📦 Dependencies

```json
{
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "next": "15.5.4",
  "typescript": "^5",
  "tailwindcss": "^4"
}
```

---

## 🚀 Next Steps

1. **Remove Dummy Data**: Replace `dummyData.ts` with real API integration
2. **Add Authentication**: Implement user login and role-based access
3. **Connect to Backend**: Integrate with your data sources
4. **Add Charts**: Use libraries like Recharts or Chart.js
5. **Implement Filters**: Make dropdowns functional with real filtering logic
6. **Add Loading States**: Show spinners while data loads
7. **Error Handling**: Add error boundaries and user-friendly messages

---

## 📝 License

Internal project - All rights reserved.

---

## 👨‍💻 Support

For questions or issues, contact the development team.

**Happy Coding! 🎉**
