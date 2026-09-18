// app/page.tsx
// Landing page — redirects authenticated users to dashboard

import Link from "next/link";
import { ArrowRight, Shield, Zap, BarChart3, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TxnManager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
          <Shield className="h-4 w-4 text-blue-400" />
          <span className="text-blue-400 text-sm font-medium">Enterprise-Grade Security</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight mb-6">
          Multi-Tenant{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Transaction
          </span>{" "}
          Management
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
          A production-quality system demonstrating Prisma ORM, PostgreSQL, Better Auth, 
          role-based access control, protected APIs, Server Actions, and transactional emails.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Create Account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8">
        <p className="text-center text-slate-500 text-sm">
          TxnManager — Academic Assignment Demonstration &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: "Role-Based Access Control",
    description: "ADMIN and MEMBER roles with server-side enforcement at every layer.",
  },
  {
    icon: Lock,
    title: "Better Auth Sessions",
    description: "Secure session management with cookie-based authentication and Prisma adapter.",
  },
  {
    icon: Zap,
    title: "Protected APIs & Actions",
    description: "Route handlers and Server Actions independently validate auth and roles.",
  },
  {
    icon: BarChart3,
    title: "Audit Logging & Email",
    description: "Every mutation creates an audit trail and sends a Resend transactional email.",
  },
];
