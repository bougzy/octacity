"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  balance: number;
  currency: string;
  isVerified: boolean;
  createdAt: string;
}

interface Transaction {
  _id: string;
  userId: { _id: string; fullName: string; email: string } | string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  senderName?: string;
  receiverName?: string;
  transactionDate?: string;
  createdAt: string;
}

interface ChatConversation {
  _id: string;
  lastMessage: string;
  lastDate: string;
  senderName: string;
  unreadCount: number;
  user?: { fullName: string; email: string };
}

interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  senderRole: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const defaultTxForm = {
  type: "deposit",
  amount: "",
  currency: "USD",
  senderName: "",
  receiverName: "",
  transactionDate: "",
  description: "",
  status: "completed",
  updateBalance: true,
};

function txDisplayDate(tx: Transaction) {
  const d = tx.transactionDate || tx.createdAt;
  return new Date(d).toLocaleString();
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Balance modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAction, setBalanceAction] = useState<"set" | "deposit" | "withdraw">("deposit");
  const [txDescription, setTxDescription] = useState("");

  // Transaction History modal
  const [showTxModal, setShowTxModal] = useState(false);
  const [txModalUser, setTxModalUser] = useState<User | null>(null);
  const [txForm, setTxForm] = useState({ ...defaultTxForm });

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Per-user transactions (for the history modal preview)
  const [userTxHistory, setUserTxHistory] = useState<Transaction[]>([]);
  const [viewingUserHistory, setViewingUserHistory] = useState<User | null>(null);

  // Chat
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [chatUser, setChatUser] = useState<ChatConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    if (res.ok) { const d = await res.json(); setUsers(d.users || []); }
  }, []);

  const fetchTransactions = useCallback(async () => {
    const res = await fetch("/api/transactions");
    if (res.ok) { const d = await res.json(); setTransactions(d.transactions || []); }
  }, []);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/messages");
    if (res.ok) { const d = await res.json(); setConversations(d.messages || []); }
  }, []);

  const fetchUserHistory = useCallback(async (userId: string) => {
    const res = await fetch(`/api/transactions?userId=${userId}`);
    if (res.ok) { const d = await res.json(); setUserTxHistory(d.transactions || []); }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => r.json()),
      fetch("/api/users").then(r => r.json()),
      fetch("/api/transactions").then(r => r.json()),
      fetch("/api/messages").then(r => r.json()),
    ])
      .then(([me, u, tx, msg]) => {
        if (me.user?.role !== "admin") { router.push("/dashboard"); return; }
        setAdmin(me.user);
        setUsers(u.users || []);
        setTransactions(tx.transactions || []);
        setConversations(msg.messages || []);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (activeTab !== "messages") return;
    const iv = setInterval(fetchConversations, 5000);
    return () => clearInterval(iv);
  }, [activeTab, fetchConversations]);

  useEffect(() => {
    if (!chatUser) return;
    const fetchChat = async () => {
      const res = await fetch(`/api/messages?userId=${chatUser._id}`);
      if (res.ok) { const d = await res.json(); setChatMessages(d.messages || []); }
    };
    fetchChat();
    const iv = setInterval(fetchChat, 3000);
    return () => clearInterval(iv);
  }, [chatUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const updateUser = async (userId: string, updates: Record<string, unknown>) => {
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...updates }),
    });
    if (res.ok) await fetchUsers();
  };

  const handleBalanceUpdate = async () => {
    if (!selectedUser || !editBalance) return;
    const amount = parseFloat(editBalance);
    if (isNaN(amount) || amount <= 0) return;

    if (balanceAction === "set") {
      await updateUser(selectedUser._id, { balance: amount });
    } else {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser._id,
          type: balanceAction === "deposit" ? "deposit" : "withdrawal",
          amount,
          description: txDescription || `Admin ${balanceAction}`,
          status: "completed",
          updateBalance: true,
        }),
      });
      await fetchUsers();
      await fetchTransactions();
    }
    setShowBalanceModal(false);
    setEditBalance("");
    setTxDescription("");
    setSelectedUser(null);
  };

  const openTxModal = (user: User) => {
    setTxModalUser(user);
    setTxForm({ ...defaultTxForm });
    fetchUserHistory(user._id);
    setShowTxModal(true);
  };

  const openUserHistory = (user: User) => {
    setViewingUserHistory(user);
    fetchUserHistory(user._id);
  };

  const handleAddTransaction = async () => {
    if (!txModalUser || !txForm.amount) return;
    const amount = parseFloat(txForm.amount);
    if (isNaN(amount) || amount <= 0) return;

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: txModalUser._id,
        type: txForm.type,
        amount,
        currency: txForm.currency,
        senderName: txForm.senderName,
        receiverName: txForm.receiverName,
        transactionDate: txForm.transactionDate || undefined,
        description: txForm.description,
        status: txForm.status,
        updateBalance: txForm.updateBalance,
      }),
    });

    await fetchUsers();
    await fetchTransactions();
    await fetchUserHistory(txModalUser._id);
    // Reset form but keep modal open so admin can add more
    setTxForm({ ...defaultTxForm });
  };

  const sendAdminMessage = async () => {
    if (!chatInput.trim() || !chatUser) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: chatInput.trim(), receiverId: chatUser._id }),
    });
    setChatInput("");
    const res = await fetch(`/api/messages?userId=${chatUser._id}`);
    if (res.ok) { const d = await res.json(); setChatMessages(d.messages || []); }
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: chatUser._id }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }
  if (!admin) return null;

  const totalBalance = users.reduce((s, u) => s + u.balance, 0);
  const verifiedUsers = users.filter(u => u.isVerified).length;
  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", badge: 0 },
    { id: "users", label: "Manage Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", badge: 0 },
    { id: "transactions", label: "Transactions", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", badge: 0 },
    { id: "messages", label: "Messages", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge: totalUnread },
  ];

  const showSenderField = ["deposit", "transfer", "grant"].includes(txForm.type);
  const showReceiverField = ["withdrawal", "transfer", "donation"].includes(txForm.type);

  return (
    <div className="min-h-screen bg-[var(--background)] font-[family-name:var(--font-geist-sans)]">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center"><span className="text-white font-bold text-sm">OC</span></div>
            <span className="text-lg font-bold gradient-text">Octa City Bank</span>
          </Link>
          <p className="text-xs text-red-400 font-medium mb-8 ml-10">Admin Panel</p>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
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
          <p className="text-xs text-[var(--muted)] mb-3">Signed in as <span className="text-white">{admin.fullName}</span></p>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 pt-16 lg:pt-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-[var(--muted)] text-sm">Manage users, balances, transactions, and messages</p>
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (<>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold gradient-text">{users.length}</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Verified</p>
              <p className="text-3xl font-bold text-emerald-400">{verifiedUsers}</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Total Managed</p>
              <p className="text-3xl font-bold gradient-text">${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <p className="text-[var(--muted)] text-sm mb-1">Unread Messages</p>
              <p className="text-3xl font-bold text-amber-400">{totalUnread}</p>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Users</h2>
              <button onClick={() => setActiveTab("users")} className="text-blue-400 text-sm hover:underline">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[var(--muted)] border-b border-[var(--card-border)]">
                  <th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Email</th><th className="pb-3 font-medium">Balance</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Joined</th>
                </tr></thead>
                <tbody>
                  {users.slice(0, 5).map(u => (
                    <tr key={u._id} className="border-b border-[var(--card-border)] last:border-0">
                      <td className="py-3 font-medium">{u.fullName}</td>
                      <td className="py-3 text-[var(--muted)]">{u.email}</td>
                      <td className="py-3 font-medium">${u.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${u.isVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{u.isVerified ? "Verified" : "Pending"}</span></td>
                      <td className="py-3 text-[var(--muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center py-8 text-[var(--muted)]">No users yet</p>}
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <button onClick={() => setActiveTab("transactions")} className="text-blue-400 text-sm hover:underline">View All →</button>
            </div>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead><tr className="text-left text-[var(--muted)] border-b border-[var(--card-border)]">
                  <th className="pb-3 font-medium">User</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Sender / Receiver</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Date</th>
                </tr></thead>
                <tbody>{transactions.slice(0, 5).map(tx => (
                  <tr key={tx._id} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="py-3">{typeof tx.userId === "object" ? tx.userId.fullName : "—"}</td>
                    <td className="py-3 capitalize">{tx.type}</td>
                    <td className={`py-3 font-medium ${tx.type === "withdrawal" ? "text-red-400" : "text-emerald-400"}`}>{tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString()}</td>
                    <td className="py-3 text-[var(--muted)] text-xs">{tx.senderName || tx.receiverName || "—"}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${tx.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : tx.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{tx.status}</span></td>
                    <td className="py-3 text-[var(--muted)]">{txDisplayDate(tx)}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            ) : <p className="text-center py-8 text-[var(--muted)]">No transactions yet</p>}
          </div>
        </>)}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* User history panel */}
            {viewingUserHistory && (
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Transaction History — {viewingUserHistory.fullName}</h2>
                    <p className="text-xs text-[var(--muted)]">{viewingUserHistory.email} · Current balance: <span className="text-white font-medium">${viewingUserHistory.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></p>
                  </div>
                  <button onClick={() => { setViewingUserHistory(null); setUserTxHistory([]); }} className="text-[var(--muted)] hover:text-white text-sm">Close ×</button>
                </div>
                {userTxHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-[var(--muted)] border-b border-[var(--card-border)]">
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Sender / Receiver</th>
                        <th className="pb-3 font-medium">Description</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr></thead>
                      <tbody>{userTxHistory.map(tx => (
                        <tr key={tx._id} className="border-b border-[var(--card-border)] last:border-0">
                          <td className="py-3 capitalize font-medium">{tx.type}</td>
                          <td className={`py-3 font-bold ${tx.type === "withdrawal" || tx.type === "donation" ? "text-red-400" : "text-emerald-400"}`}>
                            {tx.type === "withdrawal" || tx.type === "donation" ? "-" : "+"}${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {tx.currency}
                          </td>
                          <td className="py-3 text-[var(--muted)]">
                            {tx.senderName && <span className="block text-xs">From: {tx.senderName}</span>}
                            {tx.receiverName && <span className="block text-xs">To: {tx.receiverName}</span>}
                            {!tx.senderName && !tx.receiverName && "—"}
                          </td>
                          <td className="py-3 text-[var(--muted)] text-xs">{tx.description || "—"}</td>
                          <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${tx.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : tx.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{tx.status}</span></td>
                          <td className="py-3 text-[var(--muted)] text-xs">{txDisplayDate(tx)}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                ) : <p className="text-center py-6 text-[var(--muted)] text-sm">No transaction history for this user yet.</p>}
              </div>
            )}

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">All Users ({users.length})</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead><tr className="text-left text-[var(--muted)] border-b border-[var(--card-border)]">
                  <th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Email</th><th className="pb-3 font-medium">Balance</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Role</th><th className="pb-3 font-medium">Actions</th>
                </tr></thead>
                <tbody>{users.map(u => (
                  <tr key={u._id} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="py-3"><p className="font-medium">{u.fullName}</p><p className="text-xs text-[var(--muted)]">{u.phone}</p></td>
                    <td className="py-3 text-[var(--muted)]">{u.email}</td>
                    <td className="py-3 font-medium">${u.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${u.isVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{u.isVerified ? "Verified" : "Pending"}</span></td>
                    <td className="py-3 capitalize text-[var(--muted)]">{u.role}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => { setSelectedUser(u); setShowBalanceModal(true); setEditBalance(""); setTxDescription(""); }}
                          className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/20">Update Balance</button>
                        <button onClick={() => openTxModal(u)}
                          className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg hover:bg-emerald-500/20">+ Add History</button>
                        <button onClick={() => openUserHistory(u)}
                          className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg hover:bg-purple-500/20">View History</button>
                        <button onClick={() => updateUser(u._id, { isVerified: !u.isVerified })}
                          className={`text-xs px-3 py-1 rounded-lg ${u.isVerified ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"}`}>{u.isVerified ? "Unverify" : "Verify"}</button>
                        {u.role !== "admin" && <button onClick={() => updateUser(u._id, { role: "admin" })} className="text-xs bg-pink-500/10 text-pink-400 px-3 py-1 rounded-lg hover:bg-pink-500/20">Make Admin</button>}
                        <button onClick={() => { setChatUser({ _id: u._id, lastMessage: "", lastDate: "", senderName: u.fullName, unreadCount: 0, user: { fullName: u.fullName, email: u.email } }); setActiveTab("messages"); }}
                          className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg hover:bg-cyan-500/20">Message</button>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table></div>
              {users.length === 0 && <p className="text-center py-8 text-[var(--muted)]">No users yet</p>}
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Transactions ({transactions.length})</h2>
              <button onClick={() => { setTxModalUser(null); setTxForm({ ...defaultTxForm }); setShowTxModal(true); }}
                className="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Transaction</button>
            </div>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead><tr className="text-left text-[var(--muted)] border-b border-[var(--card-border)]">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Currency</th>
                  <th className="pb-3 font-medium">Sender / Receiver</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr></thead>
                <tbody>{transactions.map(tx => (
                  <tr key={tx._id} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="py-3">{typeof tx.userId === "object" ? tx.userId.fullName : "—"}</td>
                    <td className="py-3 capitalize">{tx.type}</td>
                    <td className={`py-3 font-medium ${tx.type === "withdrawal" || tx.type === "donation" ? "text-red-400" : "text-emerald-400"}`}>
                      {tx.type === "withdrawal" || tx.type === "donation" ? "-" : "+"}${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-[var(--muted)]">{tx.currency}</td>
                    <td className="py-3 text-[var(--muted)] text-xs">
                      {tx.senderName && <span className="block">From: {tx.senderName}</span>}
                      {tx.receiverName && <span className="block">To: {tx.receiverName}</span>}
                      {!tx.senderName && !tx.receiverName && "—"}
                    </td>
                    <td className="py-3 text-[var(--muted)]">{tx.description || "—"}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${tx.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : tx.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{tx.status}</span></td>
                    <td className="py-3 text-[var(--muted)]">{txDisplayDate(tx)}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            ) : <p className="text-center py-12 text-[var(--muted)]">No transactions yet. Click &quot;+ Add Transaction&quot; to add transaction history for a user.</p>}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: "calc(100vh - 140px)" }}>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[var(--card-border)]"><h2 className="text-sm font-semibold">Conversations</h2></div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                  <button key={conv._id.toString()} onClick={() => { setChatUser(conv); fetch("/api/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: conv._id }) }); }}
                    className={`w-full text-left p-4 border-b border-[var(--card-border)] hover:bg-[var(--background)] transition-colors ${chatUser?._id === conv._id.toString() ? "bg-[var(--background)]" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{conv.user?.fullName || conv.senderName}</span>
                      {conv.unreadCount > 0 && <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conv.unreadCount}</span>}
                    </div>
                    <p className="text-xs text-[var(--muted)] truncate">{conv.lastMessage}</p>
                  </button>
                ))}
                {users.filter(u => u.role !== "admin" && !conversations.find(c => c._id.toString() === u._id)).length > 0 && (<>
                  <div className="p-3 border-b border-[var(--card-border)]"><p className="text-xs text-[var(--muted)] font-medium">All Users</p></div>
                  {users.filter(u => u.role !== "admin" && !conversations.find(c => c._id.toString() === u._id)).map(u => (
                    <button key={u._id} onClick={() => setChatUser({ _id: u._id, lastMessage: "", lastDate: "", senderName: u.fullName, unreadCount: 0, user: { fullName: u.fullName, email: u.email } })}
                      className={`w-full text-left p-4 border-b border-[var(--card-border)] hover:bg-[var(--background)] transition-colors ${chatUser?._id === u._id ? "bg-[var(--background)]" : ""}`}>
                      <span className="text-sm font-medium">{u.fullName}</span>
                      <p className="text-xs text-[var(--muted)]">{u.email}</p>
                    </button>
                  ))}
                </>)}
                {conversations.length === 0 && users.filter(u => u.role !== "admin").length === 0 && <p className="text-center py-8 text-[var(--muted)] text-sm">No users yet</p>}
              </div>
            </div>

            <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden flex flex-col">
              {chatUser ? (<>
                <div className="p-4 border-b border-[var(--card-border)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{(chatUser.user?.fullName || chatUser.senderName).split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div><p className="text-sm font-semibold">{chatUser.user?.fullName || chatUser.senderName}</p><p className="text-xs text-[var(--muted)]">{chatUser.user?.email || ""}</p></div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 340px)" }}>
                  {chatMessages.map(msg => (
                    <div key={msg._id} className={`flex ${msg.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${msg.senderRole === "admin" ? "bg-blue-500 text-white rounded-br-md" : "bg-[var(--background)] border border-[var(--card-border)] rounded-bl-md"}`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderRole === "admin" ? "text-blue-200" : "text-[var(--muted)]"}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  ))}
                  {chatMessages.length === 0 && <p className="text-center text-[var(--muted)] text-sm py-8">No messages yet. Start the conversation.</p>}
                </div>
                <div className="border-t border-[var(--card-border)] p-4">
                  <div className="flex gap-2">
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAdminMessage()} placeholder="Type a message..."
                      className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500" />
                    <button onClick={sendAdminMessage} className="btn-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium">Send</button>
                  </div>
                </div>
              </>) : (
                <div className="flex-1 flex items-center justify-center text-[var(--muted)]">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Balance Modal */}
      {showBalanceModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Update Balance</h3>
              <button onClick={() => { setShowBalanceModal(false); setSelectedUser(null); }} className="text-[var(--muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="mb-4 p-3 bg-[var(--background)] rounded-lg">
              <p className="text-sm font-medium">{selectedUser.fullName}</p>
              <p className="text-xs text-[var(--muted)]">{selectedUser.email}</p>
              <p className="text-lg font-bold gradient-text mt-1">Current: ${selectedUser.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["deposit", "withdraw", "set"] as const).map(a => (
                    <button key={a} onClick={() => setBalanceAction(a)}
                      className={`py-2 rounded-lg text-sm font-medium capitalize ${balanceAction === a ? "bg-blue-500 text-white" : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--muted)] hover:text-white"}`}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{balanceAction === "set" ? "New Balance" : "Amount"} (USD)</label>
                <input type="number" value={editBalance} onChange={e => setEditBalance(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500" placeholder="0.00" step="0.01" min="0" />
              </div>
              {balanceAction !== "set" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <input type="text" value={txDescription} onChange={e => setTxDescription(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500" placeholder={`e.g. ${balanceAction === "deposit" ? "Wire transfer received" : "Withdrawal processed"}`} />
                </div>
              )}
              {editBalance && (
                <div className="p-3 bg-[var(--background)] rounded-lg">
                  <p className="text-xs text-[var(--muted)]">New balance will be:</p>
                  <p className="text-lg font-bold gradient-text">
                    ${(balanceAction === "set" ? parseFloat(editBalance) : balanceAction === "deposit" ? selectedUser.balance + parseFloat(editBalance) : selectedUser.balance - parseFloat(editBalance)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setShowBalanceModal(false); setSelectedUser(null); }} className="flex-1 btn-outline text-white py-2.5 rounded-lg text-sm font-medium">Cancel</button>
                <button onClick={handleBalanceUpdate} disabled={!editBalance || parseFloat(editBalance) <= 0} className="flex-1 btn-primary text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {showTxModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Add Transaction History</h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">Create a backdated or custom transaction entry for a user</p>
              </div>
              <button onClick={() => { setShowTxModal(false); setTxModalUser(null); setUserTxHistory([]); }} className="text-[var(--muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Form */}
              <div className="space-y-4">
                {/* User selector */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Select User</label>
                  <select
                    value={txModalUser?._id || ""}
                    onChange={e => {
                      const u = users.find(u => u._id === e.target.value) || null;
                      setTxModalUser(u);
                      if (u) fetchUserHistory(u._id);
                    }}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">— Select a user —</option>
                    {users.filter(u => u.role !== "admin").map(u => (
                      <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>
                    ))}
                  </select>
                  {txModalUser && (
                    <p className="text-xs text-[var(--muted)] mt-1">Current balance: <span className="text-white font-medium">${txModalUser.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Transaction Type</label>
                  <select
                    value={txForm.type}
                    onChange={e => setTxForm({ ...txForm, type: e.target.value, senderName: "", receiverName: "" })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="transfer">Transfer</option>
                    <option value="grant">Grant</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>

                {/* Amount & Currency */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Amount</label>
                    <input
                      type="number"
                      value={txForm.amount}
                      onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Currency</label>
                    <select
                      value={txForm.currency}
                      onChange={e => setTxForm({ ...txForm, currency: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {["USD", "EUR", "GBP", "BTC", "ETH", "USDT", "BNB", "NGN"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sender name */}
                {showSenderField && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Sender Name <span className="text-[var(--muted)]">(who sent the money)</span>
                    </label>
                    <input
                      type="text"
                      value={txForm.senderName}
                      onChange={e => setTxForm({ ...txForm, senderName: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Bank of America, John Smith, PayPal Inc."
                    />
                  </div>
                )}

                {/* Receiver name */}
                {showReceiverField && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Receiver Name <span className="text-[var(--muted)]">(who received the money)</span>
                    </label>
                    <input
                      type="text"
                      value={txForm.receiverName}
                      onChange={e => setTxForm({ ...txForm, receiverName: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Amazon LLC, Jane Doe, Crypto Exchange"
                    />
                  </div>
                )}

                {/* Transaction Date (backdating) */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Transaction Date & Time <span className="text-[var(--muted)]">(leave empty for now)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={txForm.transactionDate}
                    onChange={e => setTxForm({ ...txForm, transactionDate: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description / Memo</label>
                  <input
                    type="text"
                    value={txForm.description}
                    onChange={e => setTxForm({ ...txForm, description: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Monthly salary, Wire transfer, Grant disbursement..."
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["completed", "pending", "failed"] as const).map(s => (
                      <button key={s} onClick={() => setTxForm({ ...txForm, status: s })}
                        className={`py-2 rounded-lg text-sm font-medium capitalize ${txForm.status === s ? (s === "completed" ? "bg-emerald-500 text-white" : s === "pending" ? "bg-amber-500 text-white" : "bg-red-500 text-white") : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--muted)] hover:text-white"}`}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Update balance toggle */}
                <div className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Update User Balance</p>
                    <p className="text-xs text-[var(--muted)]">Adjust balance based on this transaction</p>
                  </div>
                  <button
                    onClick={() => setTxForm({ ...txForm, updateBalance: !txForm.updateBalance })}
                    className={`w-12 h-6 rounded-full relative transition-colors ${txForm.updateBalance ? "bg-blue-500" : "bg-[var(--card-border)]"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${txForm.updateBalance ? "right-1" : "left-1"}`}></div>
                  </button>
                </div>

                {/* Preview */}
                {txModalUser && txForm.amount && parseFloat(txForm.amount) > 0 && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-400 font-medium mb-1">Preview</p>
                    <p className="text-sm">
                      <span className="font-medium">{txModalUser.fullName}</span> — {txForm.type} of{" "}
                      <span className={`font-bold ${txForm.type === "withdrawal" || txForm.type === "donation" ? "text-red-400" : "text-emerald-400"}`}>
                        {txForm.type === "withdrawal" || txForm.type === "donation" ? "-" : "+"}${parseFloat(txForm.amount).toLocaleString()} {txForm.currency}
                      </span>
                    </p>
                    {txForm.senderName && <p className="text-xs text-[var(--muted)] mt-1">From: {txForm.senderName}</p>}
                    {txForm.receiverName && <p className="text-xs text-[var(--muted)] mt-1">To: {txForm.receiverName}</p>}
                    {txForm.transactionDate && <p className="text-xs text-[var(--muted)] mt-1">Date: {new Date(txForm.transactionDate).toLocaleString()}</p>}
                    {txForm.updateBalance && txForm.status === "completed" && (
                      <p className="text-xs text-[var(--muted)] mt-1">
                        New balance: <span className="text-white font-medium">
                          ${(txForm.type === "withdrawal" || txForm.type === "donation"
                            ? txModalUser.balance - parseFloat(txForm.amount)
                            : txModalUser.balance + parseFloat(txForm.amount)
                          ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => { setShowTxModal(false); setTxModalUser(null); setUserTxHistory([]); }} className="flex-1 btn-outline text-white py-2.5 rounded-lg text-sm font-medium">Close</button>
                  <button
                    onClick={handleAddTransaction}
                    disabled={!txModalUser || !txForm.amount || parseFloat(txForm.amount) <= 0}
                    className="flex-1 btn-primary text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Add Transaction
                  </button>
                </div>
              </div>

              {/* Right: User's existing history */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-[var(--muted)]">
                  {txModalUser ? `${txModalUser.fullName}'s History (${userTxHistory.length})` : "Select a user to see their history"}
                </h4>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {userTxHistory.length > 0 ? userTxHistory.map(tx => (
                    <div key={tx._id} className="p-3 bg-[var(--background)] border border-[var(--card-border)] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${tx.type === "withdrawal" || tx.type === "donation" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>{tx.type}</span>
                        <span className={`text-sm font-bold ${tx.type === "withdrawal" || tx.type === "donation" ? "text-red-400" : "text-emerald-400"}`}>
                          {tx.type === "withdrawal" || tx.type === "donation" ? "-" : "+"}${tx.amount.toLocaleString()} {tx.currency}
                        </span>
                      </div>
                      {tx.senderName && <p className="text-xs text-[var(--muted)]">From: {tx.senderName}</p>}
                      {tx.receiverName && <p className="text-xs text-[var(--muted)]">To: {tx.receiverName}</p>}
                      {tx.description && <p className="text-xs text-[var(--muted)]">{tx.description}</p>}
                      <p className="text-xs text-[var(--muted)] mt-1">{txDisplayDate(tx)}</p>
                    </div>
                  )) : txModalUser ? (
                    <p className="text-xs text-[var(--muted)] py-4 text-center">No history yet. Add the first transaction above.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
