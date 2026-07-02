# Karachi Pizza & Fast Food — Internal POS System

An internal ordering, billing, and sales-tracking web app for **Karachi Pizza & Fast Food**. Built as a static site — no backend, no database setup, no hosting cost. Runs entirely in the browser and works great on **GitHub Pages**.

🔗 **Live demo (after you deploy):** `https://<your-username>.github.io/<repo-name>/`

---

## ✨ Features

- **PIN-protected login** — simple staff access control (default PIN: `1234`, changeable in Settings)
- **New Order screen** — full menu with categories, search, size selection (Small/Medium/Large where applicable), quantity picker, item notes, discounts, and payment method
- **Printable receipts** — clean bill layout, print-ready
- **Bills / Orders log** — search and filter every order ever placed, export to CSV
- **Daily Sales dashboard** — total sales, order count, average order value, items sold, sales-by-category chart, top-selling items, full order list for the day
- **Monthly Sales dashboard** — monthly totals, daily breakdown chart, best day, category breakdown, top items
- **Menu Manager** — add, edit, or delete menu items and prices directly from the UI (no code editing needed)
- **Settings** — restaurant info, change staff PIN, export/import full backup (JSON), reset data
- **Fully responsive** — works on desktop, tablet, and mobile (for staff using phones at the counter)
- **All menu items from your physical menu board are pre-loaded** (BBQ, Karahi, Handi, Pizza, Shakes & Ice Cream, Burgers, Biryani & Pulao, Rolls & Shawarma, French Fries — 64 items total)

---

## 📦 How data is stored

This app stores all data **locally in the browser** using `localStorage`:
- Menu items & categories
- Every order/bill placed
- Restaurant settings & PIN

**Important:** Because it's browser-local storage, data does **not** sync between different computers/devices automatically. If you run this on multiple counter devices, each device keeps its own order history. Use **Settings → Export All Data** regularly to back up, and **Import Data** to restore or transfer data to another device.

> For a shared/synced database across multiple devices, you'd need to add a backend (e.g. Firebase, Supabase, or a small Node/Express API). This version is intentionally backend-free so it's simple to deploy for free on GitHub Pages. Ask if you'd like a version with real-time multi-device sync.

---

## 🚀 Deploy to GitHub Pages (step-by-step)

1. **Create a new repository** on GitHub (e.g. `karachi-pizza-pos`). Keep it **Public** (required for free GitHub Pages) or use Pages with a Pro/Team plan if private.
2. **Upload these files** to the repo root:
   - `index.html`
   - `style.css`
   - `app.js`
   - `menu-data.js`
   - `README.md`
   
   Either drag-and-drop them in the GitHub web UI ("Add file → Upload files"), or via git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Karachi Pizza POS system"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under "Build and deployment", set **Source** to `Deploy from a branch`
   - Set **Branch** to `main` and folder to `/ (root)`
   - Click **Save**
4. Wait ~1 minute, then visit `https://<your-username>.github.io/<repo-name>/`

That's it — no build step, no npm install, nothing else required.

---

## 🖥️ Running locally (optional, for testing before upload)

Since it's plain HTML/CSS/JS, you can just open `index.html` directly in a browser — but for full functionality (some browsers restrict local file access), it's better to serve it:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then open `http://localhost:8080`.

---

## 🔐 Default login

**PIN:** `1234`

Change it immediately after first login via **Settings → Change PIN**.

> Note: This PIN is a basic deterrent for internal staff use, not strong security — it's stored in the browser and not encrypted. Don't use this system for anything requiring real security (e.g. don't expose sensitive financial data beyond your own team).

---

## 🍕 Editing the menu

Two ways:
1. **In the app:** Go to **Manage Menu** → Add/Edit/Delete items directly. Changes save instantly.
2. **In code:** Edit `menu-data.js` — this is the default menu loaded the first time the app runs (or after a data reset). Each item looks like:
   ```js
   { id: uid("m"), category: "Pizza", name: "Tikka Pizza", small: 499, medium: 999, large: 1499 }
   ```
   Use `null` for sizes that don't apply (e.g. burgers only have one price, so `medium` and `large` are `null`).

---

## 🎨 Customizing branding

- Restaurant name, address, and WhatsApp numbers: **Settings** tab (in-app) — this updates the printed receipt header.
- Colors/fonts: edit the CSS variables at the top of `style.css` (`:root { ... }`).
- Logo: replace the "KP" monogram in `index.html` (`.brand-mark` divs) with an `<img>` tag if you have a logo file.

---

## 📁 File structure

```
karachi-pizza-pos/
├── index.html       # App structure (all views/screens)
├── style.css        # All styling
├── app.js           # All application logic (orders, sales, menu management)
├── menu-data.js      # Default menu data (edit here to change starting menu)
└── README.md         # This file
```

---

## 🛠️ Built with

Plain HTML, CSS, and vanilla JavaScript — no frameworks, no build tools, no dependencies. Fonts loaded from Google Fonts (Bebas Neue, Manrope, JetBrains Mono).

---

## 📄 License

Free to use and modify for Karachi Pizza & Fast Food's internal operations.
