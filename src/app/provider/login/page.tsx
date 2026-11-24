"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { ApiError } from "@/lib/api";

function ProviderLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/provider/dashboard";

  useEffect(() => {
    if (isLoggedIn && user?.role === "PROVIDER") router.replace(redirectTo);
  }, [isLoggedIn, user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in");
    } finally { setLoading(false); }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email Address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? "Signing in..." : "Provider Sign In"}</button>
      </form>
      <div className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Register as a Professional</Link>
      </div>
    </div>
  );
}

export default function ProviderLoginPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="mb-2">Provider Dashboard</h1>
            <p className="text-text-secondary">Sign in to manage your profile</p>
          </div>
          <Suspense fallback={<div className="card p-8 text-center text-text-secondary">Loading...</div>}>
            <ProviderLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
