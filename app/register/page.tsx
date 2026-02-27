"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimateIn, { ScaleIn } from "@/components/AnimateIn";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [countryCode, setCountryCode] = useState("+1");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: `${countryCode}${form.phone}`,
          email: form.email,
          address: form.address,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <AnimateIn>
            <div className="text-center text-[var(--muted)] text-lg mb-8 tracking-widest">
              $&euro;&pound;&yen;&#8383;&#8377;&#8361;&#8355;&Xi;&#8382;&#3647;&#8372;
            </div>
          </AnimateIn>

          <ScaleIn>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8">
              <h1 className="text-2xl font-bold text-center mb-2">Create Your Account</h1>
              <p className="text-[var(--muted)] text-sm text-center mb-8">
                Join Octa City Bank — secure digital banking
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-2 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+234">+234</option>
                      <option value="+91">+91</option>
                      <option value="+86">+86</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                      <option value="+81">+81</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Address</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="123 Main St, City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 rounded border-[var(--card-border)]"
                  />
                  <label className="text-sm text-[var(--muted)]">
                    I agree to the{" "}
                    <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-[var(--muted)] mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:underline">Sign in</Link>
              </p>
            </div>
          </ScaleIn>

          <AnimateIn delay={0.3}>
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold mb-4">Bank-Grade Security</h3>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  256-bit Encryption
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                  Biometric Auth
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Real-time Alerts
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
