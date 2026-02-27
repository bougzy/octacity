"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  balance: number;
  currency: string;
  phone: string;
  address: string;
  isVerified: boolean;
  createdAt: string;
}

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
}

interface ChatMessage {
  _id: string;
  senderId: string;
  senderRole: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUser = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const d = await res.json();
      setUser(d.user);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    const res = await fetch("/api/transactions");
    if (res.ok) {
      const d = await res.json();
      setTransactions(d.transactions || []);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/messages");
    if (res.ok) {
      const d = await res.json();
      setMessages(d.messages || []);
      const unread = (d.messages || []).filter((m: ChatMessage) => m.senderRole === "admin" && !m.isRead).length;
      setUnreadCount(unread);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/transactions").then(r => r.json()),
      fetch("/api/messages").then(r => r.json()),
    ])
      .then(([me, tx, msg]) => {
        if (me.user.role === "admin") { router.push("/admin"); return; }
        setUser(me.user);
        setTransactions(tx.transactions || []);
        setMessages(msg.messages || []);
        const unread = (msg.messages || []).filter((m: ChatMessage) => m.senderRole === "admin" && !m.isRead).length;
        setUnreadCount(unread);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Poll for updates
  useEffect(() => {
    const iv = setInterval(() => {
      fetchUser();
      fetchTransactions();
      fetchMessages();
    }, 10000);
    return () => clearInterval(iv);
  }, [fetchUser, fetchTransactions, fetchMessages]);

  // Poll chat faster when on messages tab
  useEffect(() => {
    if (activeTab !== "messages") return;
    const iv = setInterval(fetchMessages, 3000);
    return () => clearInterval(iv);
  }, [activeTab, fetchMessages]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: chatInput.trim() }),
    });
    setChatInput("");
    await fetchMessages();
  };

  const markMessagesRead = async () => {
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setUnreadCount(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }
  if (!user) return null;

  const totalDeposits = transactions.filter(t => t.type === "deposit" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === "withdrawal" && t.status === "completed").reduce((s, t) => s + t.amount, 0);

  const navItems = [
    { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", badge: 0 },
    { id: "transactions", label: "Transactions", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", badge: 0 },
    { id: "messages", label: "Messages", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge: unreadCount },
    { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", badge: 0 },
    { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", badge: 0 },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] font-[family-name:var(--font-geist-sans)]">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center"><span className="text-white font-bold text-sm">OC</span></div>
            <span className="text-lg font-bold gradient-text">Octa City Bank</span>
          </Link>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); if (item.id === "messages") markMessagesRead(); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${activeTab === item.id ? "bg-blue-500/10 text-blue-400" : "text-[var(--muted)] hover:text-white hover:bg-[var(--background)]"}`}>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                  {item.label}
                </div>
                {item.badge > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[var(--card-border)]">
          <p className="text-xs text-[var(--muted)] mb-3">{user.fullName}</p>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 pt-16 lg:pt-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {user.fullName.split(" ")[0]}</h1>
          <p className="text-[var(--muted)] text-sm">Here&apos;s your financial overview</p>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (<>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold gradient-text">${user.balance.toLocaleString("en-US",{minimumFractionDigits:2})}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{user.currency}</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Total Deposits</p>
              <p className="text-2xl font-bold text-emerald-400">${totalDeposits.toLocaleString("en-US",{minimumFractionDigits:2})}</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-400">${totalWithdrawals.toLocaleString("en-US",{minimumFractionDigits:2})}</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Account Status</p>
              <p className={`text-lg font-semibold ${user.isVerified ? "text-emerald-400" : "text-amber-400"}`}>{user.isVerified ? "Verified" : "Pending"}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Member since {new Date(user.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Grants", href: "/grants", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Donate", href: "/donate", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
                { label: "Support", href: "#", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
                { label: "FAQ", href: "/faq", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map(a => (
                <Link key={a.label} href={a.href} onClick={a.label === "Support" ? (e) => { e.preventDefault(); setActiveTab("messages"); } : undefined}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--card-border)] hover:bg-[var(--background)] transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg>
                  <span className="text-sm">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              {transactions.length > 0 && <button onClick={() => setActiveTab("transactions")} className="text-blue-400 text-sm hover:underline">View All →</button>}
            </div>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0,5).map(tx => (
                  <div key={tx._id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--card-border)]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "withdrawal" ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                        <svg className={`w-5 h-5 ${tx.type === "withdrawal" ? "text-red-400" : "text-emerald-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tx.type === "withdrawal" ? "M17 13l-5 5m0 0l-5-5m5 5V6" : "M7 11l5-5m0 0l5 5m-5-5v12"} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{tx.type}</p>
                        <p className="text-xs text-[var(--muted)]">{tx.description || new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.type === "withdrawal" ? "text-red-400" : "text-emerald-400"}`}>
                        {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString("en-US",{minimumFractionDigits:2})}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : tx.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--muted)]">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <p className="text-sm">No transactions yet</p>
                <p className="text-xs mt-1">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </>)}

        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Transaction History ({transactions.length})</h2>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map(tx => (
                  <div key={tx._id} className="flex items-center justify-between p-4 rounded-lg border border-[var(--card-border)]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "withdrawal" ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                        <svg className={`w-5 h-5 ${tx.type === "withdrawal" ? "text-red-400" : "text-emerald-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tx.type === "withdrawal" ? "M17 13l-5 5m0 0l-5-5m5 5V6" : "M7 11l5-5m0 0l5 5m-5-5v12"} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{tx.type}</p>
                        <p className="text-xs text-[var(--muted)]">{tx.description || "—"}</p>
                        <p className="text-xs text-[var(--muted)]">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.type === "withdrawal" ? "text-red-400" : "text-emerald-400"}`}>
                        {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString("en-US",{minimumFractionDigits:2})}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{tx.currency}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : tx.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--muted)]">
                <p>No transactions yet</p>
                <p className="text-sm mt-1">All your deposits, withdrawals, and transfers will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
            <div className="p-4 border-b border-[var(--card-border)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">OC</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Octa City Bank Support</p>
                <p className="text-xs text-[var(--muted)]">Chat with our team</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[var(--muted)] text-sm">Welcome to Octa City Bank support chat!</p>
                  <p className="text-[var(--muted)] text-xs mt-1">Send a message to get started. Our team typically responds quickly.</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg._id} className={`flex ${msg.senderRole === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.senderRole === "user"
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-[var(--background)] border border-[var(--card-border)] rounded-bl-md"
                  }`}>
                    {msg.senderRole === "admin" && <p className="text-xs text-blue-400 font-medium mb-1">Support Team</p>}
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.senderRole === "user" ? "text-blue-200" : "text-[var(--muted)]"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--card-border)] p-4">
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Type a message to support..."
                  className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500" />
                <button onClick={sendMessage} className="btn-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium">Send</button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
            <div className="flex items-center gap-4 mb-8 p-4 bg-[var(--background)] rounded-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{user.fullName.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div>
                <p className="text-lg font-semibold">{user.fullName}</p>
                <p className="text-sm text-[var(--muted)]">{user.email}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{user.isVerified ? "Verified Account" : "Pending Verification"}</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: user.fullName },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
                { label: "Address", value: user.address },
                { label: "Account Type", value: user.role, capitalize: true },
                { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString() },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-[var(--muted)]">{f.label}</label>
                  <p className={`text-sm font-medium mt-1 ${f.capitalize ? "capitalize" : ""}`}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6">Account Settings</h2>
            <div className="space-y-4">
              {[
                { title: "Email Notifications", desc: "Receive updates about your account activity", toggle: true },
                { title: "Transaction Alerts", desc: "Get notified for every balance change", toggle: true },
                { title: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", action: "Enable" },
                { title: "Change Password", desc: "Update your account password", action: "Change" },
                { title: "Export Data", desc: "Download your transaction history as CSV", action: "Export" },
              ].map(s => (
                <div key={s.title} className="flex items-center justify-between p-4 rounded-lg border border-[var(--card-border)]">
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-[var(--muted)]">{s.desc}</p>
                  </div>
                  {s.toggle ? (
                    <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div></div>
                  ) : (
                    <button className="btn-outline text-white px-4 py-1.5 rounded-lg text-xs">{s.action}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
