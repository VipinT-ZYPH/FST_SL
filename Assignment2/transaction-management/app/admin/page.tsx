import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  await requireAdmin();
    const [users, transactions, auditLogs, emailEvents, recentUsers, recentLogs] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.auditLog.count(),
      prisma.emailEvent.count(),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, action: true, entity: true, createdAt: true, user: { select: { name: true } } } }),
    ]);

  return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-10 flex flex-wrap items-center gap-5 text-sm"><Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link><Link href="/transactions" className="text-slate-400 hover:text-white">Transactions</Link><span className="font-semibold text-blue-400">Admin</span></nav>
          <div className="mb-8"><p className="text-sm text-blue-400">Administration</p><h1 className="mt-2 text-3xl font-bold">System overview</h1><p className="mt-2 text-slate-400">Monitor users, transactions, audit activity, and email events.</p></div>
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[["Users", users], ["Transactions", transactions], ["Audit events", auditLogs], ["Email events", emailEvents]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p></div>)}</section>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-semibold">Recent users</h2><div className="mt-5 divide-y divide-slate-800">{recentUsers.map((user) => <div key={user.id} className="flex items-center justify-between gap-3 py-3 first:pt-0"><div><p className="font-medium">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div><span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">{user.role}</span></div>)}</div></section>
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-semibold">Recent audit activity</h2><div className="mt-5 divide-y divide-slate-800">{recentLogs.map((log) => <div key={log.id} className="py-3 first:pt-0"><p className="font-medium">{log.action.replaceAll("_", " ")}</p><p className="text-xs text-slate-500">{log.entity} · {log.user?.name ?? "System"} · {log.createdAt.toLocaleDateString()}</p></div>)}</div></section>
          </div>
        </div>
      </main>
  );
}
