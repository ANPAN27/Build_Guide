"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { ApiError } from "@/lib/api";

export default function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();

  useEffect(() => { if (isLoggedIn) router.replace("/"); }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h1 className="mb-2">Sign In</h1>
            <p className="text-text-secondary">Sign in to your Build Guide account</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-border rounded-xl min-h-[52px]" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? "Signing in..." : "Sign In"}</button>
            </form>
            <div className="mt-4 text-sm text-center text-text-secondary">
              <Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </div>
          </div>

          <div className="card mt-4 text-center">
            <Link href="/provider/login" className="text-primary font-semibold hover:underline text-sm">Are you a Service Provider? Sign In Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
