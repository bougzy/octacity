"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AnimateIn, { StaggerContainer, StaggerItem, ScaleIn } from "@/components/AnimateIn";

const faqCategories = [
  {
    category: "Account & Registration",
    questions: [
      { q: "How do I register for an Octa City Bank account?", a: "Click the 'Get Started' button on the homepage and fill out the registration form with your personal details. You'll receive a verification email to confirm your account." },
      { q: "What is an OTP and how does it work?", a: "OTP (One-Time Password) is a temporary code sent to your registered phone number or email for identity verification during sensitive operations like login or transactions." },
      { q: "How do I log in after registration?", a: "Navigate to the Sign In page, enter your registered email and password, and click Sign In. You may be asked to verify via OTP for added security." },
      { q: "What should I do if I forget my password?", a: "Click the 'Forgot Password?' link on the login page. Enter your registered email address and follow the instructions to reset your password." },
      { q: "Can I change my registered email address?", a: "Yes, you can update your email from the account settings in your dashboard. A verification email will be sent to confirm the change." },
    ],
  },
  {
    category: "Balance & Transactions",
    questions: [
      { q: "Why can't I deposit or withdraw directly?", a: "For security and compliance, all deposits and withdrawals are managed through our admin team. Contact support to initiate a transaction." },
      { q: "How is my balance updated?", a: "Your balance is updated in real-time by our admin team after transaction verification. You'll receive a notification for every balance change." },
      { q: "What currencies are supported?", a: "We support 30+ currencies including USD, EUR, GBP, BTC, ETH, USDT, BNB, and many more." },
      { q: "How can I view my transaction history?", a: "Your complete transaction history is available in the dashboard under the 'Transactions' section, with filters for date range and type." },
    ],
  },
  {
    category: "Grants",
    questions: [
      { q: "How do I apply for a grant?", a: "Visit the Grants page to browse available categories. Contact our admin team via the chat assistant to begin your application." },
      { q: "What documents do I need for a grant application?", a: "Requirements vary by grant type but typically include ID verification, project proposal, and financial statements." },
      { q: "How long does grant approval take?", a: "Grant applications are reviewed within 5-10 business days. You'll be notified of the decision via email and in-app notification." },
      { q: "What grant categories are available?", a: "We offer Business, Individual, Office Capital, General, School, and Women Empowerment grants with funding up to $250,000." },
    ],
  },
  {
    category: "Donations",
    questions: [
      { q: "How do I make a donation?", a: "Visit the Donate page, fill in your details, select a category and amount, and submit your donation. All transactions are securely processed." },
      { q: "Is my donation secure?", a: "Yes, all donations are processed with bank-grade encryption and are fully traceable on our platform." },
      { q: "Can I donate anonymously?", a: "Yes, you can choose to make anonymous donations. Your personal details won't be shared with the recipient." },
    ],
  },
  {
    category: "Technical",
    questions: [
      { q: "What languages is the app available in?", a: "Octa City Bank is available in 6+ languages including English, Spanish, French, German, Portuguese, and Arabic." },
      { q: "How do I switch between dark and light mode?", a: "The app automatically follows your system theme preference. You can override this in your account settings." },
      { q: "What happens during chat inactivity?", a: "Chat sessions automatically close after 10 minutes of inactivity. Your conversation history is saved and accessible later." },
      { q: "What browsers are supported?", a: "We support all modern browsers including Chrome, Firefox, Safari, Edge, and Brave. For the best experience, keep your browser up to date." },
      { q: "Is Octa City Bank available on mobile devices?", a: "Yes, our platform is fully responsive and works on all mobile devices. A dedicated mobile app is coming soon." },
    ],
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--card-border)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-[var(--muted)] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 text-sm text-[var(--muted)] leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimateIn className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-[var(--muted)] text-lg">
              Find answers to common questions about Octa City Bank. Can&apos;t find what you&apos;re looking for? Chat with our support team.
            </p>
          </AnimateIn>

          <StaggerContainer className="space-y-8" staggerDelay={0.15}>
            {faqCategories.map((cat) => (
              <StaggerItem key={cat.category}>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4 gradient-text">{cat.category}</h2>
                  <div>
                    {cat.questions.map((item) => (
                      <AccordionItem key={item.q} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScaleIn delay={0.2}>
            <div className="text-center mt-12 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-3">Still have questions?</h2>
              <p className="text-[var(--muted)] text-sm mb-6">
                Our support team is available 24/7 to help you with any questions.
              </p>
              <a href="#" className="btn-primary text-white px-6 py-3 rounded-lg text-sm font-medium inline-block">
                Chat with Support
              </a>
            </div>
          </ScaleIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
