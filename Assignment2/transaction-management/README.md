# Multi-Tenant Transaction Management System

Academic Next.js application demonstrating Prisma/PostgreSQL, Better Auth, RBAC, protected APIs, Server Actions, audit logging, Faker seeding, React Email, and Resend webhooks.

## Setup

```powershell
npm install
Copy-Item .env.example .env
# Set DATABASE_URL and BETTER_AUTH_SECRET in .env
npx prisma db push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. Register at `/signup`; new accounts start as `MEMBER`. Promote a registered account explicitly:

```powershell
npm run db:make-admin -- your-email@example.com
```

## Commands

- `npm run db:generate` generates Prisma Client.
- `npm run db:migrate` creates/applies a development migration.
- `npm run db:reset` resets the database and runs the configured seed.
- `npm run db:seed` populates users, transactions, audit logs, and email events.
- `npm run lint` checks ESLint rules.
- `npm run build` runs the production build and TypeScript check.

## Routes

- `/dashboard` shows scoped transaction totals and recent activity.
- `/transactions` lists transactions and lets members/admins create them.
- `/admin` is admin-only and shows user, transaction, audit, and email totals.
- `GET/POST /api/transactions` are protected transaction endpoints.
- `GET/PATCH /api/admin/users` and `GET /api/admin/audit-logs` are admin-only.
- `/api/webhooks/resend` verifies signed Resend events and stores `EmailEvent` rows.

## Security

Better Auth owns credential hashing and sessions. Authorization is repeated in middleware, route handlers, pages, and Server Actions. Transaction ownership comes from the session. Email errors are non-fatal after a successful database commit. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Evidence

Use [docs/EVIDENCE_CHECKLIST.md](docs/EVIDENCE_CHECKLIST.md) to capture assignment evidence. Configure Resend variables only when demonstrating email delivery; never commit real secrets.
