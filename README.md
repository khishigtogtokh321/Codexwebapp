# Dental Treatment Management System - Modern UI

A modern, clean web application for dental treatment management built with Vue 3 and Tailwind CSS.

## 📋 Features

- **Patient Management**: View patient information with quick stats
- **Interactive Tooth Chart**: Visual tooth selection with status indicators
- **Treatment Planning**: Select tooth surfaces, set status, and choose diagnoses
- **Treatment History**: Comprehensive table with search and filter capabilities
- **Responsive Design**: Optimized for 1080p+ clinic monitors



## 🚀 Quick Start

### Option 1: Demo (index.html)
Simply open `index.html` in a modern browser to see the working demo.

### Option 2: Vue Project Setup

1. **Install dependencies:**
```bash
npm create vue@latest dental-app
cd dental-app
npm install
```

2. **Install Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Configure Tailwind (tailwind.config.js):**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dental-primary': '#2563EB',
        'dental-secondary': '#10B981',
      },
    },
  },
  plugins: [],
}
```

4. **Add Tailwind directives to CSS (src/assets/main.css):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Copy component files:**
   - Copy all `.vue` files to `src/components/`
   - Import `TreatmentPage.vue` in your router or main App

6. **Run development server:**
```bash
npm run dev
```

## 🎨 Design System

### Color Palette

- **Primary (Blue)**: `#2563EB` - Actions, selections, primary buttons
- **Success (Green)**: `#10B981` - Completed treatments, success states
- **Warning (Amber)**: `#F59E0B` - Planned treatments, warnings
- **Danger (Red)**: `#EF4444` - Problem teeth, errors
- **Background**: `#F9FAFB` - Main canvas
- **Surface**: `#FFFFFF` - Cards, panels

### Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: font-semibold, tracking-tight
- **Body**: font-normal, leading-relaxed
- **Labels**: text-sm, font-medium

### Tooth Status Colors

| Status | Background | Border | Badge |
|--------|-----------|--------|-------|
| Healthy | White | Gray-300 | - |
| Treated | Blue-50 | Blue-300 | Blue-500 |
| Problem | Red-50 | Red-300 | Red-500 |
| Planned | Amber-50 | Amber-300 | Amber-500 |
| Missing | Gray-100 | Gray-400 | - |

## 📱 Component Usage

### TreatmentPage.vue

Main parent component that orchestrates all child components.

```vue
<template>
  <TreatmentPage />
</template>

<script setup>
import TreatmentPage from './TreatmentPage.vue'
</script>
```

### ToothChart.vue

Interactive tooth chart with click selection.

**Props:**
- `selectedTooth`: Currently selected tooth number (String)
- `toothStatuses`: Object mapping tooth numbers to status strings

**Events:**
- `@tooth-select`: Emitted when a tooth is clicked

### TreatmentSidebar.vue

Treatment configuration sidebar.

**Props:**
- `selectedTooth`: Selected tooth number
- `selectedSurfaces`: Array of selected surfaces
- `selectedStatus`: Treatment status ('planned' | 'done')
- `selectedDiagnoses`: Array of diagnosis codes
- `selectedTreatmentType`: Treatment type ID

**Events:**
- `@surface-toggle`: Toggle tooth surface selection
- `@status-change`: Change treatment status
- `@diagnosis-toggle`: Toggle diagnosis selection
- `@treatment-select`: Select treatment type
- `@add-treatment`: Add new treatment
- `@cancel`: Cancel current selection

## 🔧 Customization

### Adding New Diagnoses

Edit the `diagnoses` array in `TreatmentSidebar.vue`:

```javascript
const diagnoses = [
  { code: 'K02', name: 'Шүдний цоорлого' },
  { code: 'K04', name: 'Periodontitis' },
  // Add more...
]
```

### Adding Treatment Types

Edit the `treatmentTypes` array in `TreatmentSidebar.vue`:

```javascript
const treatmentTypes = [
  { id: 'base', label: 'Base' },
  { id: 'exam', label: 'Үзлэг' },
  // Add more...
]
```

### Modifying Tooth Numbering

The system uses FDI World Dental Federation notation:
- Upper right: 11-18
- Upper left: 21-28
- Lower left: 31-38
- Lower right: 41-48

To use a different system, modify the `upperTeeth` and `lowerTeeth` arrays in `ToothChart.vue`.

## 📊 Data Structure

### Patient Object
```javascript
{
  id: '2024-00123',
  name: 'Б. Батбаяр',
  age: 32,
  avatar: 'BB'
}
```

### Treatment Object
```javascript
{
  id: 1,
  date: '2024-11-24',
  tooth: '#21',
  surface: 'M, O',
  diagnosis: 'Pulpitis',
  doctor: 'Б. Болд',
  price: '45,000₮',
  status: 'done' // or 'planned'
}
```

### Tooth Status
```javascript
{
  '21': 'treated',
  '22': 'problem',
  '16': 'planned',
  '26': 'missing'
}
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📝 Future Enhancements

- [ ] Virtual scrolling for large diagnosis lists
- [ ] Advanced filtering in history table
- [ ] Export history to PDF/Excel
- [ ] Treatment templates
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Drag and drop file uploads
- [ ] Real-time collaboration

## 🤝 Contributing

This is a demo project for UI/UX redesign. For production use:

1. Add proper state management (Pinia)
2. Implement API integration
3. Add form validation
4. Implement authentication
5. Add comprehensive error handling
6. Add unit and integration tests
7. Optimize performance (lazy loading, code splitting)

## 📄 License

MIT License - Feel free to use this design in your dental software projects.

## 👥 Credits

- Original UI: AshidSoft Windows Application
- Redesign: Modern web standards with Vue 3 + Tailwind CSS
- Icons: Emoji (can be replaced with Heroicons or Lucide)
- Font: System default (recommend Inter or IBM Plex Sans)

## 📞 Support

For questions or suggestions about the UI/UX design, please open an issue.

---

**Note**: This is a frontend demo with dummy data. For production use, integrate with your backend API and add proper authentication, validation, and error handling.
