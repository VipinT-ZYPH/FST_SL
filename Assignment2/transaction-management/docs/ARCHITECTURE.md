# Multi-Tenant Transaction Management System

## Overview

This academic application uses Next.js App Router, Better Auth, Prisma, and PostgreSQL. Users receive one of two roles: `ADMIN` or `MEMBER`.

## Request architecture

```text
Browser -> Next middleware -> Better Auth session
       -> Page / Route Handler / Server Action
       -> Central authorization -> Prisma -> PostgreSQL
```

Middleware provides early protection. Pages, handlers, and actions repeat authorization at the server boundary. User IDs come from the verified session and are never trusted from client payloads.

## Data architecture

`User` owns transactions, audit logs, and email events. `Session`, `Account`, and `Verification` support Better Auth. The seed creates parent records before child records and uses Faker for realistic values.

```text
User -> Transaction
  |       |
  +-> AuditLog (actor and generic entity reference)
  +-> EmailEvent
```

Audit `entityId` is a generic identifier because events can refer to users, transactions, or sessions; `entity` identifies its meaning.

## Authentication and authorization

Better Auth owns credential hashing and sessions. `requireAuth`, `requireRole`, `requireMember`, and `requireAdmin` are centralized in `lib/authorization.ts`. New signups start as `MEMBER`; an operator explicitly promotes a registered account with `db:make-admin`.

## Transaction and email flow

```text
Validated transaction -> DB transaction + AuditLog
                     -> Resend notification (non-fatal)
                     -> signed Resend webhook -> EmailEvent
```

Email is attempted only after the database commit. Webhook event IDs are unique to prevent duplicates.

## Operations

The project uses `middleware.ts`, which is supported by the installed Next.js version but emits a migration warning for the newer `proxy.ts` convention. Environment files are ignored and `.env.example` documents required values. See the README for setup and testing.
