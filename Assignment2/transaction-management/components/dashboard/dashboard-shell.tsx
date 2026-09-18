import Link from "next/link";
import { BarChart3 } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

interface DashboardShellProps {
  user: { name: string; email: string; role: "ADMIN" | "MEMBER" };
  children: ReactNode;
}

const ROLE_VARIANT = {
  ADMIN: "destructive",
  MEMBER: "success",
} as const;

export function DashboardShell({ user, children }: DashboardShellProps) {
  const canSeeTransactions = true;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-base font-bold">TxnManager</span>
          </Link>

          <nav aria-label="Main" className="flex items-center gap-1 text-sm">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Dashboard
            </Link>
            {canSeeTransactions ? (
              <Link
                href="/transactions"
                className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Transactions
              </Link>
            ) : null}
            {isAdmin ? (
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant={ROLE_VARIANT[user.role]}>{user.role}</Badge>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
