# 🚀 Quick Start Guide

## Get Up and Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## ✨ What You'll See

### Sidebar (Left)
- **Three Persona Panels**: CSM, CO, SE
- **Collapsible**: Click the arrow icon to collapse/expand
- **Active State**: Selected persona is highlighted with accent color

### Dashboard (Right)
- **Header**: Shows current persona name and description
- **Dropdowns**: 4 filter dropdowns with dummy data
- **Stats Cards**: 4 metric cards with icons and progress bars
- **Data Table**: Sample data for the selected persona

---

## 🎯 Try These Actions

1. **Switch Personas**: Click on CSM, CO, or SE in the sidebar
2. **Collapse Sidebar**: Click the arrow icon in the sidebar header
3. **Use Dropdowns**: Select options from the filter dropdowns
4. **View Data**: Scroll through the stats cards and data table

---

## 🎨 Color Scheme

- **CSM**: Blue (#049FD9) + Teal (#6CC04A)
- **CO**: Purple (#7B5EA7) + Light Blue (#00BCEB)
- **SE**: Orange (#F58220) + Blue (#049FD9)

---

## 📦 What's Included

### Components
- ✅ Sidebar with 3 persona panels
- ✅ Dashboard with header, dropdowns, stats, and tables
- ✅ 12 dropdowns total (4 per persona)
- ✅ Dummy data for all dropdowns
- ✅ Responsive layout

### Features
- ✅ Persona switching
- ✅ Collapsible sidebar
- ✅ Color-coded personas
- ✅ Smooth animations
- ✅ TypeScript support
- ✅ Tailwind CSS styling

---

## 🔴 Important: Dummy Data

All dropdown data is **static dummy data** located in:
```
src/data/dummyData.ts
```

**To remove dummy data and use real data:**
1. Read `REMOVE_DUMMY_DATA.md`
2. Create your API service
3. Update component imports
4. Delete `dummyData.ts`

---

## 📚 Documentation

- **`PROJECT_STRUCTURE.md`**: Complete project documentation
- **`REMOVE_DUMMY_DATA.md`**: Guide to integrate real data
- **`README.md`**: Next.js default documentation

---

## 🛠️ Customization

### Change Colors
Edit `src/config/theme.ts`:
```typescript
export const colors = {
  primary: {
    DEFAULT: '#YOUR_COLOR',
    // ...
  }
}
```

### Add New Persona
1. Update `Persona` type in `dummyData.ts`
2. Add color scheme in `theme.ts`
3. Add icon in `Sidebar.tsx`
4. Add dropdowns in `PersonaDropdowns.tsx`
5. Add stats in `DashboardStats.tsx`

### Modify Dropdowns
Edit `src/data/dummyData.ts` to add/remove options

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### TypeScript Errors
Restart TypeScript server in VS Code:
- `Cmd/Ctrl + Shift + P`
- Type "TypeScript: Restart TS Server"

### Styles Not Applying
Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

---

## 🎓 Next Steps

1. **Explore the Code**: Check out the component files
2. **Read Documentation**: Review `PROJECT_STRUCTURE.md`
3. **Customize**: Change colors, add features
4. **Integrate Data**: Follow `REMOVE_DUMMY_DATA.md`
5. **Build**: Create your dashboards!

---

## 📞 Need Help?

- Check `PROJECT_STRUCTURE.md` for detailed docs
- Review component code for examples
- Contact the development team

---

**Happy Coding! 🎉**

Built with ❤️ using Next.js 15, React 19, TypeScript, and Tailwind CSS
