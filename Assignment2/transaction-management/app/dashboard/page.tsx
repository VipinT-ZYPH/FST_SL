import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your TxnManager dashboard",
};

export default async function DashboardPage() {
  const user = await requireAuth();
    const where = user.role === UserRole.ADMIN ? {} : { userId: user.id };
    const [total, credits, debits, recentTransactions] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.aggregate({ where: { ...where, type: "CREDIT" }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { ...where, type: "DEBIT" }, _sum: { amount: true } }),
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { title: true, amount: true, type: true, status: true, createdAt: true },
      }),
    ]);

    const formatAmount = (amount: unknown) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount ?? 0));

  return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-blue-400">TxnManager</p>
              <h1 className="mt-2 text-3xl font-bold">Welcome, {user.name}</h1>
              <p className="mt-2 text-slate-400">{user.email} · {user.role === UserRole.ADMIN ? "All account activity" : "Your account activity"}</p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
              {user.role}
            </span>
          </div>

          <nav className="mb-8 flex flex-wrap gap-5 text-sm">
            <span className="font-semibold text-blue-400">Dashboard</span>
            <Link href="/transactions" className="text-slate-400 hover:text-white">Transactions</Link>
            {user.role === UserRole.ADMIN && <Link href="/admin" className="text-slate-400 hover:text-white">Admin</Link>}
          </nav>

          <section className="grid gap-5 md:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Transactions</p>
              <p className="mt-3 text-2xl font-semibold">{total}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Credits</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-400">{formatAmount(credits._sum.amount)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Debits</p>
              <p className="mt-3 text-2xl font-semibold text-rose-400">{formatAmount(debits._sum.amount)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Account status</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-400">Active</p>
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Recent transactions</h2>
                <p className="mt-1 text-sm text-slate-400">The latest activity for this account.</p>
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Last 5</span>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="mt-8 rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">
                No transactions yet.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-slate-800">
                {recentTransactions.map((transaction) => (
                  <div key={`${transaction.title}-${transaction.createdAt.toISOString()}`} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{transaction.status} · {transaction.createdAt.toLocaleDateString()}</p>
                    </div>
                    <p className={transaction.type === "CREDIT" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"}>
                      {transaction.type === "CREDIT" ? "+" : "-"}{formatAmount(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
  );
}
