"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  _id?: string;
  role: "user" | "bot";
  text: string;
  time?: string;
}

interface ApiMessage {
  _id: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

const botResponses: Record<string, string> = {
  hello: "Hello! Welcome to Octa City Bank. How can I help you today?",
  hi: "Hi there! Welcome to Octa City Bank. What can I assist you with?",
  help: "I can help you with:\n- Account information\n- Grant applications\n- Donations\n- Technical support\n\nWhat would you like to know more about?",
  grant: "We offer 6 types of grants: Business ($250K), Individual ($50K), Office Capital ($150K), General ($100K), School ($200K), and Women Empowerment ($175K). Visit our Grants page or sign in to chat with our team!",
  grants: "We offer 6 types of grants: Business ($250K), Individual ($50K), Office Capital ($150K), General ($100K), School ($200K), and Women Empowerment ($175K). Visit our Grants page or sign in to chat with our team!",
  donate: "You can make donations through our Donate page. We accept USD, EUR, BTC, ETH, and more.",
  balance: "To check your balance, please sign in to your dashboard. For balance inquiries, contact support via the Messages tab in your dashboard.",
  account: "To create an account, click 'Get Started'. Already have one? Click 'Sign In' to access your dashboard.",
  security: "We use 256-bit AES encryption, biometric auth, and real-time fraud detection.",
  support: "Our support team is available 24/7. Sign in to your dashboard and use the Messages tab for real-time support!",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return "Thank you for your message! For personalized support, please sign in to your dashboard and use the Messages tab to chat with our team directly.";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check auth status
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => { if (r.ok) return r.json(); throw new Error(); })
      .then(() => setIsLoggedIn(true))
      .catch(() => {
        setIsLoggedIn(false);
        setMessages([{ role: "bot", text: "Hello! Welcome to Octa City Bank. How can I help you today?" }]);
      });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!isLoggedIn) return;
    const res = await fetch("/api/messages");
    if (res.ok) {
      const d = await res.json();
      const apiMsgs: Message[] = (d.messages || []).map((m: ApiMessage) => ({
        _id: m._id,
        role: m.senderRole === "admin" ? "bot" as const : "user" as const,
        text: m.content,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setMessages(apiMsgs.length > 0 ? apiMsgs : [{ role: "bot", text: "Welcome! You're connected to Octa City Bank support. How can we help?" }]);
      const unread = (d.messages || []).filter((m: ApiMessage) => m.senderRole === "admin").length;
      setUnreadCount(unread > 0 && !open ? 1 : 0);
    }
  }, [isLoggedIn, open]);

  useEffect(() => {
    if (isLoggedIn) fetchMessages();
  }, [isLoggedIn, fetchMessages]);

  // Poll for new messages when chat is open and logged in
  useEffect(() => {
    if (!open || !isLoggedIn) return;
    const iv = setInterval(fetchMessages, 4000);
    return () => clearInterval(iv);
  }, [open, isLoggedIn, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    if (isLoggedIn) {
      // Send real message to API
      setMessages(prev => [...prev, { role: "user", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      // Refresh to get server-side message
      setTimeout(fetchMessages, 500);
    } else {
      // Offline bot mode
      setMessages(prev => [...prev, { role: "user", text }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", text: getBotResponse(text) }]);
      }, 600);
    }
  };

  return (
    <>
      <button
        onClick={() => { setOpen(!open); if (!open) setUnreadCount(0); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
        )}
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "500px" }}>
          <div className="bg-gradient-to-r from-blue-500 to-emerald-500 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><span className="text-white font-bold text-sm">OC</span></div>
              <div>
                <p className="text-white font-semibold text-sm">Octa City Bank Support</p>
                <p className="text-white/70 text-xs">{isLoggedIn ? "Connected — Live chat" : "Online — Auto responses"}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "320px" }}>
            {messages.map((msg, i) => (
              <div key={msg._id || i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] rounded-bl-md"
                }`}>
                  {msg.role === "bot" && isLoggedIn && <p className="text-xs text-blue-400 font-medium mb-1">Support</p>}
                  {msg.text}
                  {msg.time && <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-[var(--muted)]"}`}>{msg.time}</p>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[var(--card-border)] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder={isLoggedIn ? "Message support..." : "Type a message..."}
                className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-full px-4 py-2 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
              />
              <button onClick={handleSend} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
