"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimateIn, { ScaleIn } from "@/components/AnimateIn";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <section className="pt-24 pb-16 px-4 min-h-[80vh] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <AnimateIn>
            <div className="text-center text-[var(--muted)] text-lg mb-8 tracking-widest">
              $&euro;&pound;&yen;&#8383;&#8377;&#8361;&#8355;&Xi;&#8382;&#3647;&#8372;
            </div>
          </AnimateIn>

          <ScaleIn delay={0.1}>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8">
              <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
              <p className="text-[var(--muted)] text-sm text-center mb-8">
                Sign in to your Octa City Bank account
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium">Password</label>
                    <a href="#" className="text-xs text-blue-400 hover:underline">Forgot Password?</a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-[var(--card-border)]"
                  />
                  <label className="text-sm text-[var(--muted)]">Remember me for 30 days</label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--card-border)]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[var(--card-bg)] px-4 text-[var(--muted)]">OR</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg py-3 text-sm font-medium hover:bg-[var(--card-border)] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-[var(--muted)] mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-400 hover:underline">Create one</Link>
              </p>
            </div>
          </ScaleIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
