// app/dashboard/page.tsx
// Role-aware dashboard. Authorization is re-validated here, independently of
// the proxy/middleware layer.

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreditCard, Receipt, ShieldCheck, Users } from "lucide-react";
import { requireAuth, isAuthorizationError } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your transaction overview",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  let user;
  try {
    user = await requireAuth();
  } catch (error) {
    if (isAuthorizationError(error)) redirect("/login?callbackUrl=/dashboard");
    throw error;
  }

  const { error } = await searchParams;
  const isAdmin = user.role === "ADMIN";
  const isGuest = user.role === "GUEST";

  // ── GUEST: limited view, no transaction data ───────────────
  if (isGuest) {
    return (
      <DashboardShell user={user}>
        {error === "forbidden" ? (
          <Alert variant="warning" className="mb-6">
            You do not have permission to view that page.
          </Alert>
        ) : null}

        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}</h1>
        <p className="mt-1 text-muted-foreground">
          Your account has guest access.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Basic details for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Name: </span>
                {user.name}
              </p>
              <p>
                <span className="text-muted-foreground">Email: </span>
                {user.email}
              </p>
              <p>
                <span className="text-muted-foreground">Role: </span>GUEST
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guest access</CardTitle>
              <CardDescription>What you can do today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Guests can view this page only. Creating and viewing transactions
                requires the MEMBER role, and the admin console requires ADMIN.
              </p>
              <p>Ask an administrator to upgrade your role to get started.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  // ── ADMIN / MEMBER ─────────────────────────────────────────
  const scope = isAdmin ? {} : { userId: user.id };

  const [transactionCount, completedSum, recentTransactions, userCount] =
    await Promise.all([
      prisma.transaction.count({ where: scope }),
      prisma.transaction.aggregate({
        where: { ...scope, status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: scope,
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          reference: true,
          title: true,
          description: true,
          amount: true,
          type: true,
          status: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
      isAdmin ? prisma.user.count() : Promise.resolve(0),
    ]);

  return (
    <DashboardShell user={user}>
      {error === "forbidden" ? (
        <Alert variant="warning" className="mb-6">
          You do not have permission to view that page.
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isAdmin
              ? "Organisation-wide overview of users and transactions."
              : "An overview of your own transactions."}
          </p>
        </div>
        <Button asChild>
          <Link href="/transactions">Go to transactions</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total transactions"
          value={transactionCount}
          icon={<Receipt className="h-5 w-5" aria-hidden />}
        />
        <StatCard
          label="Completed value"
          value={formatCurrency(Number(completedSum._sum.amount ?? 0))}
          icon={<CreditCard className="h-5 w-5" aria-hidden />}
        />
        {isAdmin ? (
          <StatCard
            label="Total users"
            value={userCount}
            icon={<Users className="h-5 w-5" aria-hidden />}
          />
        ) : (
          <StatCard
            label="Your role"
            value={user.role}
            hint="Members can create transactions"
            icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
          />
        )}
        <StatCard
          label="Recent activity"
          value={recentTransactions.length}
          hint="Most recent transactions"
          icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>
              {isAdmin ? "Across all accounts" : "Your latest activity"}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/transactions">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TransactionTable
            showOwner={isAdmin}
            transactions={recentTransactions.map((t) => ({
              id: t.id,
              reference: t.reference,
              title: t.title,
              description: t.description,
              amount: t.amount.toString(),
              type: t.type,
              status: t.status,
              createdAt: t.createdAt,
              owner: t.user.name,
            }))}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
