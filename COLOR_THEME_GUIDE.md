# Theme Color System Guide

## Overview
This project uses **CSS variables** for dynamic theming. Colors automatically switch between light and dark mode when the `dark` class is toggled on the `<body>` element.

## CSS Variables (src/index.css)

### Light Mode (default)
```css
:root {
  --color-bg: #ffffff;           /* Main background */
  --color-bg2: #f7f7f7;          /* Secondary background */
  --color-active: #f7f7f7;       /* Active/selected states */
  --color-text1: #000;           /* Primary text */
  --color-text2: gray;           /* Secondary text */
  --color-stroke: #ebebeb;       /* Borders */
  --color-stroke-hover: #d1d1d1; /* Hover borders */
  --color-hover: #fff;           /* Hover backgrounds */
  --color-blue-border: #0000cd;  /* Blue accents */
}
```

### Dark Mode
```css
.dark {
  --color-bg: #000;              /* Main background */
  --color-bg2: #070707;          /* Secondary background */
  --color-active: #181818;       /* Active/selected states */
  --color-text1: #ffffff;        /* Primary text */
  --color-text2: #9b9b96;        /* Secondary text */
  --color-stroke: #1f1f1f;       /* Borders */
  --color-stroke-hover: #444444; /* Hover borders */
  --color-hover: #181818;        /* Hover backgrounds */
  --color-blue-border: #0000cd;  /* Blue accents */
}
```

## Utility Classes

### Background Colors
- `.bg-dark-bg` → `var(--color-bg)` - Main background
- `.bg-dark-bg2` → `var(--color-bg2)` - Secondary background
- `.bg-dark-active` → `var(--color-active)` - Active/selected states

### Text Colors
- `.text-dark-text1` → `var(--color-text1)` - Primary text (headings, important text)
- `.text-dark-text2` → `var(--color-text2)` - Secondary text (labels, descriptions)

### Border Colors
- `.border-dark-stroke` → `var(--color-stroke)` - Standard borders
- `.border-dark-blue-border` → `var(--color-blue-border)` - Blue accent borders

### Hover States
- `.hover:border-dark-stroke:hover` → `var(--color-stroke-hover)` - Hover border color
- `.hover:bg-dark-hover:hover` → `var(--color-hover)` - Hover background color

## Color Replacement Guide

### Replace These Hardcoded Classes:

#### Background Colors
- `bg-black` → `bg-dark-bg`
- `bg-white` → `bg-dark-bg`
- `bg-gray-50` → `bg-dark-bg`
- `bg-gray-100` → `bg-dark-bg2`
- `bg-gray-800` → `bg-dark-bg2`
- `bg-gray-900` → `bg-dark-active`

#### Text Colors
- `text-white` → `text-dark-text1`
- `text-black` → `text-dark-text1`
- `text-gray-900` → `text-dark-text1`
- `text-gray-600` → `text-dark-text2`
- `text-gray-500` → `text-dark-text2`
- `text-gray-400` → `text-dark-text2`

#### Border Colors
- `border-gray-200` → `border-dark-stroke`
- `border-gray-300` → `border-dark-stroke`
- `border-gray-700` → `border-dark-stroke`
- `border-gray-800` → `border-dark-stroke`
- `border-[#444444]` → `border-dark-stroke`
- `border-[#1f1f1f]` → `border-dark-stroke`

#### Hover States
- `hover:text-white` → `hover:text-dark-text1`
- `hover:bg-gray-800` → `hover:bg-dark-hover`
- `hover:bg-gray-100` → `hover:bg-dark-hover`
- `hover:border-gray-400` → `hover:border-dark-stroke`

## Tailwind's Dark Mode Support

You can ALSO use Tailwind's built-in dark mode classes:
```jsx
className="bg-white dark:bg-black text-black dark:text-white"
```

This is useful when you need **different values** for light/dark mode, rather than just switching between the same semantic classes.

## Best Practices

1. **Use semantic classes** (`.bg-dark-bg`, `.text-dark-text1`) for most UI elements
2. **Use Tailwind dark:** variants for special cases (colored accents, gradients)
3. **Avoid hardcoded colors** (`#000`, `#fff`) in className strings
4. **Use CSS variables** for inline styles when needed: `style={{ backgroundColor: 'var(--color-bg)' }}`

## Examples

### ✅ Good (Theme-aware)
```jsx
<div className="bg-dark-bg border border-dark-stroke text-dark-text1">
  <h1 className="text-dark-text1">Title</h1>
  <p className="text-dark-text2">Description</p>
  <button className="bg-dark-active hover:bg-dark-hover">Click</button>
</div>
```

### ❌ Bad (Hardcoded)
```jsx
<div className="bg-white border border-gray-200 text-black">
  <h1 className="text-black">Title</h1>
  <p className="text-gray-600">Description</p>
  <button className="bg-gray-100 hover:bg-gray-200">Click</button>
</div>
```

### ✅ Also Good (Tailwind dark: variant)
```jsx
<div className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
  <span className="text-blue-500">Accent color</span>
</div>
```

## Theme Toggle

Users can switch themes via the user menu dropdown (avatar in navbar):
- Click avatar → "Theme" section at bottom
- Click "Light" or "Dark" button
- Preference is saved in cookies

## Files Updated

### ✅ Completed
- `src/index.css` - Added CSS variables and theme-aware utilities
- `src/context/UserProvider.jsx` - Fixed theme toggle logic
- `src/components/Menu.jsx` - Added footer prop for theme toggle
- `src/parts/Navbar.jsx` - Added theme toggle UI, replaced hardcoded colors
- `src/pages/Home.jsx` - Replaced all hardcoded colors with theme classes

### 🔄 Still Need Updates
- TaskBoard components (`TaskCard`, `StatusColumn`, `SubtaskItem`)
- Report components (charts and cards)
- Notes pages and components
- Modal components (`DeleteModal`, `SearchModal`, `Modal`)
- Calendar components
- AlfiaAI components
- Space components

## How to Update Remaining Files

Use find & replace:
1. `text-white` → `text-dark-text1`
2. `text-black` → `text-dark-text1`
3. `text-gray-600` → `text-dark-text2`
4. `bg-black` → `bg-dark-bg`
5. `bg-white` → `bg-dark-bg`
6. `border-[#444444]` → `border-dark-stroke`
7. `hover:text-white` → `hover:text-dark-text1`

Remember to test both light and dark modes after updating!

