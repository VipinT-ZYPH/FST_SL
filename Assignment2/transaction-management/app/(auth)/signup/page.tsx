import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your TxnManager account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">TxnManager</span>
          </Link>
          <h1 className="text-white text-2xl font-bold mt-6 mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Start managing your transactions securely</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
