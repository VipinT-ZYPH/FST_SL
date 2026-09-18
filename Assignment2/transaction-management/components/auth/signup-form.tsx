"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/auth-client";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await signUp.email({
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      callbackURL: "/dashboard",
    });

    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "Unable to create account");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" required className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2.5 text-white outline-none focus:border-blue-400" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2.5 text-white outline-none focus:border-blue-400" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2.5 text-white outline-none focus:border-blue-400" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-blue-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-slate-400">
        Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
      </p>
    </form>
  );
}
