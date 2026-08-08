# HHGoa'26 Builder Pass — ID Card Generator

A React + Vite + Tailwind app that generates a downloadable **HHGoa'26 Builder Pass**
ID card on an HTML `<canvas>`. Enter your name, handle, role and builder ID, upload a
photo, and download the result as a PNG. The preview updates live.

## Tech Stack
- React 19 (Vite)
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- HTML Canvas 2D API for rendering + PNG export

## Quickstart
```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
```

Open the printed local URL. If port 5173 is busy, Vite will pick the next free port.

## Build & Preview
```bash
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

## Project Structure
- `src/HHGoaCardGenerator.jsx` — the ID card generator component (form + canvas)
- `src/App.jsx` — renders the generator
- `src/index.css` — Tailwind entry (`@import "tailwindcss";`)
- `postcss.config.js` — Tailwind v4 PostCSS plugin config

## Usage
1. Upload a photo (rendered inside the circular avatar).
2. Fill in Full Name, X/Twitter handle, Role/Tech Track and Builder ID.
3. Click **Download Card Image (.PNG)** to save your pass.
