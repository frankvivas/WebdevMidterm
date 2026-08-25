# Budget Tracker

A multi-page personal budget tracker built with React and Vite. Budget Tracker lets users record income and expenses, filter transactions, edit or delete entries, review category-level spending, and switch between light and dark themes.

## Features

- Dashboard with current balance, income, expenses, search, type filters, and category filters
- Add-transaction form with required-field validation
- Individual transaction URLs with editing and deletion
- Spending summary by category
- App-wide light and dark theme through React Context
- Transaction persistence through a reusable custom local-storage hook
- Memoized transaction rows and derived totals to avoid unnecessary rendering
- Responsive layout for desktop, tablet, and mobile

## Routes

- `/` — Dashboard
- `/add` — Add Transaction
- `/transaction/:id` — Transaction Detail
- `/summary` — Spending Summary

## Local setup

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.
