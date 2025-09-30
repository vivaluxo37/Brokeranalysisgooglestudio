# Design System Quick Reference Guide

## 🎨 Color Palette

### Primary Blue (Brand Color)
```css
bg-blue-50   /* #eff6ff - Very light background */
bg-blue-100  /* #dbeafe - Light background */
bg-blue-200  /* #bfdbfe - Light borders */
bg-blue-500  /* #3b82f6 - Default primary */
bg-blue-600  /* #2563eb - PRIMARY BUTTONS ✅ */
bg-blue-700  /* #1d4ed8 - Button hover states */
bg-blue-800  /* #1e40af - Dark blue for emphasis */
```

### Gray Scale
```css
bg-gray-50   /* #f9fafb - Page backgrounds */
bg-gray-100  /* #f3f4f6 - Card backgrounds */
bg-gray-200  /* #e5e7eb - Borders */
text-gray-600 /* #4b5563 - Body text */
text-gray-900 /* #111827 - Headings */
```

### Semantic Colors
```css
/* Success */
bg-green-100 text-green-800  /* Badges */
bg-green-600  /* #10b981 - Primary success */

/* Warning */
bg-yellow-100 text-yellow-800
bg-yellow-600  /* #f59e0b */

/* Error */
bg-red-100 text-red-800
bg-red-600  /* #ef4444 */
```

### Dark Mode
```css
dark:bg-slate-800   /* #1e293b - Card background */
dark:bg-slate-900   /* #0f172a - Page background */
dark:text-white     /* #ffffff - Heading text */
dark:text-gray-300  /* #d1d5db - Body text */
dark:border-slate-700 /* #334155 - Borders */
```

---

## 🔘 Buttons

### Primary Button (Main CTAs)
```tsx
className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
```

### Secondary Button
```tsx
className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all duration-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
```

### Outline Button
```tsx
className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 font-semibold px-6 py-3 rounded-lg transition-all duration-200 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950"
```

### Small Button
```tsx
className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
```

---

## 📦 Cards

### Standard Card
```tsx
className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all p-6"
```

### Interactive Card (with hover)
```tsx
className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 p-6 cursor-pointer"
```

### Broker Card
```tsx
className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 p-6"
```

---

## 📝 Typography

### Headings
```tsx
// H1 - Page Title
className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"

// H2 - Section Title
className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"

// H3 - Subsection
className="text-2xl font-bold text-gray-900 dark:text-white mb-3"

// H4 - Card Title
className="text-lg font-semibold text-gray-900 dark:text-white"
```

### Body Text
```tsx
// Large paragraph
className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"

// Regular paragraph
className="text-base text-gray-600 dark:text-gray-300 leading-normal"

// Small text
className="text-sm text-gray-500 dark:text-gray-400"

// Extra small (captions)
className="text-xs text-gray-500 dark:text-gray-400"
```

---

## 🎭 Hero Sections

### Standard Hero
```tsx
<section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Your Title Here
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
        Your subtitle or description here
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* CTA Buttons */}
      </div>
    </div>
  </div>
</section>
```

---

## 🏷️ Badges

### Success Badge
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
```

### Info Badge
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
```

### Warning Badge
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
```

### Neutral Badge
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
```

---

## 📥 Form Inputs

### Text Input
```tsx
className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all"
```

### Select Dropdown
```tsx
className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all"
```

### Checkbox
```tsx
className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
```

---

## 📏 Spacing & Layout

### Section Spacing
```tsx
// Standard section
className="py-16"  // 64px vertical

// Large section
className="py-20"  // 80px vertical

// Small section
className="py-12"  // 48px vertical
```

### Container
```tsx
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

### Grid Layouts
```tsx
// 2 columns
className="grid grid-cols-1 md:grid-cols-2 gap-6"

// 3 columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// 4 columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
```

---

## 🎞️ Animations & Transitions

### Standard Transition
```tsx
className="transition-all duration-200 ease-in-out"
```

### Hover Effects
```tsx
className="hover:scale-105 hover:shadow-lg transition-transform duration-200"
```

### Focus Ring
```tsx
className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

---

## 📱 Responsive Breakpoints

```tsx
// Mobile first
className="text-base"

// Tablet (640px+)
className="sm:text-lg"

// Desktop (768px+)
className="md:text-xl"

// Large desktop (1024px+)
className="lg:text-2xl"

// Extra large (1280px+)
className="xl:text-3xl"
```

---

## 🌓 Dark Mode Best Practices

### Always include dark mode for:
- Backgrounds: `dark:bg-slate-800`
- Text: `dark:text-white` or `dark:text-gray-300`
- Borders: `dark:border-slate-700`
- Buttons: `dark:bg-blue-600 dark:hover:bg-blue-500`

### Example Complete Component
```tsx
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Title
  </h3>
  <p className="text-base text-gray-600 dark:text-gray-300">
    Description text
  </p>
  <button className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
    Action
  </button>
</div>
```

---

## ✅ Quick Checklist

When creating a new component, ensure:

- [ ] Uses `bg-blue-600` for primary buttons
- [ ] Includes dark mode styles (`dark:` prefixes)
- [ ] Uses consistent spacing (`py-16` for sections)
- [ ] Applies proper shadows (`shadow-sm`, `hover:shadow-md`)
- [ ] Includes transitions (`transition-all duration-200`)
- [ ] Uses rounded corners (`rounded-lg` or `rounded-xl`)
- [ ] Proper text colors for readability
- [ ] Responsive breakpoints where needed
- [ ] Accessible focus states

---

## 🚀 Common Patterns

### Hero + CTA
```tsx
<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
  <div className="max-w-4xl mx-auto text-center px-4">
    <h1 className="text-5xl font-bold mb-6">Headline</h1>
    <p className="text-xl text-blue-100 mb-8">Subheadline</p>
    <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
      Get Started
    </button>
  </div>
</div>
```

### Feature Card
```tsx
<div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Feature Title</h3>
  <p className="text-gray-600 dark:text-gray-300">Feature description goes here.</p>
</div>
```

### Stat Card
```tsx
<div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">42</div>
  <div className="text-sm text-gray-600 dark:text-gray-300">Countries Covered</div>
</div>
```

---

**Version:** 1.0  
**Last Updated:** 2025-01-30  
**Maintained by:** BrokerAnalysis Team