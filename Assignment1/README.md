# Smart Expense Dashboard

A production-quality Next.js application built for an academic assignment, demonstrating modern React patterns, Server Components, client state management, and type-safe server mutations.

## 🚀 Features

- **Next.js App Router Architecture**: Clear separation of Server and Client Components.
- **Accessible UI**: Built with `shadcn/ui` and Radix primitives.
- **Theming**: Dark, Light, and System modes using `next-themes` (free of hydration errors).
- **Persistent State**: Client-side filtering and sorting managed by `Zustand` with `sessionStorage` persistence.
- **Type-Safe Validation**: End-to-end validation using `Zod` and `React Hook Form`.
- **Server Actions**: Native Next.js data mutations with optimistic UI feedback via `Sonner` toasts.
- **Loading States**: Integrated React Suspense with skeleton loaders.

## 🛠 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Client State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

## 📂 Folder Structure

```
├── app/                  # Next.js App Router routes and layout
│   ├── actions/          # Next.js Server Actions (data mutations)
│   ├── dashboard/        # Dashboard view (Server Component)
│   ├── expenses/         # Expenses view (Server Component)
│   ├── globals.css       # Global styles and Tailwind directives
│   └── layout.tsx        # Root layout with ThemeProvider
├── components/           # React components
│   ├── dashboard/        # Dashboard specific components
│   ├── expenses/         # Expense list and filter components
│   ├── forms/            # React Hook Form components
│   ├── layout/           # Sidebar, Header, Navigation
│   ├── theme/            # Theme toggling and provider
│   └── ui/               # Reusable shadcn/ui primitives
├── lib/                  # Utilities and mock database
│   ├── validations/      # Zod schemas (shared client/server)
│   ├── db.ts             # Simulated server-side database
│   └── utils.ts          # Tailwind merge utilities
├── store/                # Zustand stores
│   └── expense-filter-store.ts
├── types/                # Shared TypeScript definitions
└── docs/                 # Technical documentation
```

## 🧠 Architecture Highlights

### Server Components vs Client Components
- **Server Components** (`app/dashboard/page.tsx`) are used for fetching data directly from the mock database without exposing the fetching logic or data endpoints to the client.
- **Client Components** (`components/expenses/expense-filter.tsx`) are used where user interactivity (`useState`, `onChange`) or browser APIs are required.

### Zustand Architecture
- A centralized store (`store/expense-filter-store.ts`) manages filtering and sorting preferences.
- Components utilize **selector-based subscriptions** (e.g., `useExpenseFilterStore(state => state.searchQuery)`) to prevent unnecessary re-renders across the dashboard when unrelated state changes.

### Zod Validation
- A single schema (`lib/validations/expense-schema.ts`) dictates the shape of an `Expense`.
- It is used by React Hook Form for instant client-side validation and by Server Actions to strictly validate the incoming `FormData` payload on the server.

### Server Action Flow
1. User submits the Add Expense form.
2. `createExpenseAction` receives the `FormData`.
3. Server validates data against the Zod schema.
4. If valid, the mock database is updated and `revalidatePath` is triggered to clear the cache.
5. The Client Component receives the success response and triggers a toast notification, resetting the form.

## ⚙️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Production Build

To test the optimized production build and verify there are no hydration or accessibility issues:

```bash
npm run build
npm run start
```

## 📊 Lighthouse Audit Instructions

To collect the required Core Web Vitals metrics for the technical report:
1. Run the production build (`npm run build && npm run start`).
2. Open the application in Google Chrome Incognito mode.
3. Open Developer Tools (F12) -> Lighthouse tab.
4. Select "Navigation", "Desktop", and check "Performance" and "Accessibility".
5. Click "Analyze page load".
6. Record the generated LCP, CLS, INP, and overall scores into `docs/TECHNICAL_REPORT.md`.

## 📸 Screenshots

*(Placeholders for future assignment submission screenshots)*

- `Dashboard Overview`
- `Dark Mode Toggle`
- `Add Expense Validation`
- `Expense Filtering`
