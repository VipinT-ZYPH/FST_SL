import type { Metadata } from "next";
import Link from "next/link";
import { requireMember } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { TransactionForm } from "@/components/transaction-form";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage() {
  const user = await requireMember();
    const transactions = await prisma.transaction.findMany({
      where: user.role === UserRole.ADMIN ? {} : { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, title: true, amount: true, type: true, status: true, reference: true, createdAt: true, user: { select: { name: true } } },
    });
    const money = (value: unknown) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));

  return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-10 flex flex-wrap items-center gap-5 text-sm"><Link href="/dashboard" className="text-blue-400">Dashboard</Link><span className="font-semibold">Transactions</span>{user.role === UserRole.ADMIN && <Link href="/admin" className="text-slate-400 hover:text-white">Admin</Link>}</nav>
          <div className="mb-8"><p className="text-sm text-blue-400">{user.role === UserRole.ADMIN ? "All accounts" : "Your account"}</p><h1 className="mt-2 text-3xl font-bold">Transactions</h1><p className="mt-2 text-slate-400">Review and record financial activity.</p></div>
          <TransactionForm />
          <section className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-6 py-5"><h2 className="font-semibold">Transaction history</h2></div>
            {transactions.length === 0 ? <p className="px-6 py-12 text-center text-slate-400">No transactions yet.</p> : <div className="divide-y divide-slate-800">{transactions.map((transaction) => <div key={transaction.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"><div><p className="font-medium">{transaction.title}</p><p className="mt-1 text-xs text-slate-500">{transaction.reference} · {transaction.user.name} · {transaction.status}</p></div><p className={transaction.type === "CREDIT" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"}>{transaction.type === "CREDIT" ? "+" : "-"}{money(transaction.amount)}</p></div>)}</div>}
          </section>
        </div>
      </main>
  );
}
