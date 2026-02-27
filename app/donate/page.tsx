"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AnimateIn, { StaggerContainer, StaggerItem, ScaleIn } from "@/components/AnimateIn";

export default function DonatePage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    category: "General",
    amount: "",
    currency: "USD",
    txHash: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);

  const walletAddress = "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Donation record submitted successfully! Thank you for your generosity.");
    setForm({ fullName: "", email: "", category: "General", amount: "", currency: "USD", txHash: "", message: "" });
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <AnimateIn className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Your Generosity <span className="gradient-text">Changes Lives</span>
            </h1>
            <p className="text-[var(--muted)] max-w-2xl mx-auto text-lg">
              Every contribution makes a meaningful impact. Support causes that matter and help build
              a better future for communities worldwide.
            </p>
          </AnimateIn>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Wallet Address */}
            <div>
              <AnimateIn direction="left">
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Donation Wallet Address</h2>
                  <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg p-4 mb-4">
                    <p className="text-sm text-[var(--muted)] font-mono break-all">{walletAddress}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="btn-primary text-white px-6 py-2 rounded-lg text-sm font-medium w-full"
                  >
                    {copied ? "Copied!" : "Copy Address"}
                  </button>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["BTC", "ETH", "USDT", "BNB"].map((c) => (
                      <span key={c} className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>
              </AnimateIn>

              {/* Stats */}
              <StaggerContainer className="grid grid-cols-3 gap-4">
                {[
                  { value: "2,400+", label: "Donations Logged" },
                  { value: "45+", label: "Countries Reached" },
                  { value: "18K+", label: "Lives Impacted" },
                ].map((stat) => (
                  <StaggerItem key={stat.label}>
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 text-center">
                      <div className="text-xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-xs text-[var(--muted)] mt-1">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Donation Form */}
            <ScaleIn delay={0.2}>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Log Your Donation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {["General", "Education", "Health", "Environment", "Women Empowerment", "Community Development"].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Amount</label>
                      <input
                        type="number"
                        required
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Currency</label>
                      <select
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                        className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        {["USD", "EUR", "GBP", "BTC", "ETH", "USDT", "BNB"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Transaction Hash <span className="text-[var(--muted)]">(optional)</span></label>
                    <input
                      type="text"
                      value={form.txHash}
                      onChange={(e) => setForm({ ...form, txHash: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                      placeholder="0x..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message <span className="text-[var(--muted)]">(optional)</span></label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Leave a message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary text-white py-3 rounded-lg text-sm font-medium"
                  >
                    Submit Donation Record
                  </button>
                </form>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
