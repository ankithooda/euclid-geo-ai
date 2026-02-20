# Euclid Geo AI - Development Guide

## Project Structure

```
euclid-geo-ai/
├── src/
│   ├── index.html      # HTML template
│   └── app.js          # Application logic
├── dist/               # Built output (generated)
├── package.json        # Dependencies & scripts
└── index.html          # Legacy (for quick testing)
```

## Setup

```bash
npm install
```

## Scripts

### Development
```bash
npm run watch    # Watch mode - rebuilds on changes
npm run dev      # Start dev server (requires built dist/)
npm run serve    # Build + serve (all-in-one)
```

### Production
```bash
npm run build    # Bundle and copy to dist/
```

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run serve
   ```

3. Open browser to `http://localhost:8000`

## How to Use

### Create Points
- Click "Create Point" button
- Click anywhere on the canvas

### Draw Lines
- Click "Draw Line" button
- Click on two existing points

### Draw Circles
- Click "Draw Circle" button
- Click on a point for center
- Click on another point on the circumference

### Clear All
- Click "Clear All" to remove all objects

## Building for Production

```bash
npm run build
```

This generates `dist/` folder with bundled JavaScript and HTML.

## File Separation

- **src/app.js** - Pure JavaScript logic (no HTML, no inline styles)
- **src/index.html** - HTML structure and CSS
- **package.json** - Build configuration and dependencies
