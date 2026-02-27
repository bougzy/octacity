"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import AnimateIn, { StaggerContainer, StaggerItem, ScaleIn } from "@/components/AnimateIn";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              Banking Without{" "}
              <span className="gradient-text">Boundaries</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.15}>
            <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
              Secure, smart, and seamless banking for the modern world. Manage your finances,
              access grants, and make global donations — all in one place.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register" className="btn-primary text-white px-8 py-3 rounded-lg text-lg font-medium w-full sm:w-auto">
                Get Started
              </Link>
              <Link href="/login" className="btn-outline text-white px-8 py-3 rounded-lg text-lg font-medium w-full sm:w-auto">
                Sign In
              </Link>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.45}>
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">$2.5B+</div>
                <div className="text-xs sm:text-sm text-[var(--muted)]">Managed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">50K+</div>
                <div className="text-xs sm:text-sm text-[var(--muted)]">Users</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">120</div>
                <div className="text-xs sm:text-sm text-[var(--muted)]">Countries</div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 sm:py-28 bg-[var(--section-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Octa City Bank</span>?
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Experience next-generation banking with features designed for the way you live and work.
            </p>
          </AnimateIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaggerItem>
              <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Bank-Grade Security</h3>
                <p className="text-[var(--muted)] text-sm">256-bit AES encryption, biometric authentication, and real-time fraud detection to keep your money safe.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Dashboard</h3>
                <p className="text-[var(--muted)] text-sm">Real-time balance tracking, spending analytics, and AI-powered insights to manage your finances smarter.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Grant Access</h3>
                <p className="text-[var(--muted)] text-sm">Unlock funding opportunities across business, education, and development sectors worldwide.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Global Donations</h3>
                <p className="text-[var(--muted)] text-sm">Make transparent, trackable charitable donations to causes and communities around the world.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-Language</h3>
                <p className="text-[var(--muted)] text-sm">Available in 6+ languages with fully localized experiences for users around the globe.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-[var(--muted)] text-sm">Round-the-clock assistance via live chat, email, and phone — whenever you need help.</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Grants Section */}
      <section id="grants" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Unlock <span className="gradient-text">Funding Opportunities</span>
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Explore a wide range of grants tailored to individuals, businesses, and communities.
            </p>
          </AnimateIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "blue", title: "Business Grants", desc: "Fuel your startup or scale your enterprise with targeted business funding." },
              { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "emerald", title: "Individual Grants", desc: "Personal development and emergency support grants for qualifying individuals." },
              { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", color: "purple", title: "Office Capital", desc: "Secure funding for office infrastructure, equipment, and workspace expansion." },
              { icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", color: "amber", title: "General Grants", desc: "Flexible funding for a variety of projects and initiatives across all sectors." },
              { icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", color: "cyan", title: "School Grants", desc: "Educational funding for institutions, students, and academic programs." },
              { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "pink", title: "Women Empowerment", desc: "Dedicated grants supporting women-led businesses and leadership programs." },
            ].map((grant) => (
              <StaggerItem key={grant.title}>
                <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                  <div className={`w-12 h-12 rounded-lg bg-${grant.color}-500/10 flex items-center justify-center mb-4`}>
                    <svg className={`w-6 h-6 text-${grant.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={grant.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{grant.title}</h3>
                  <p className="text-[var(--muted)] text-sm">{grant.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <AnimateIn className="text-center">
            <Link href="/grants" className="btn-primary text-white px-8 py-3 rounded-lg text-lg font-medium inline-block">
              Explore Grants
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Donations Section */}
      <section className="py-20 sm:py-28 bg-[var(--section-alt)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Make a <span className="gradient-text">Difference Today</span>
            </h2>
            <p className="text-[var(--muted)] text-lg mb-8">
              Support communities and causes that matter. Every donation through Octa City Bank
              is transparent, trackable, and makes a real impact on lives around the world.
            </p>
            <Link href="/donate" className="btn-primary text-white px-8 py-3 rounded-lg text-lg font-medium inline-block">
              Donate Now
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "$12M+", label: "Grants Distributed" },
              { value: "30+", label: "Currencies Supported" },
              { value: "6+", label: "Languages Available" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-[var(--muted)] text-sm">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-28 bg-[var(--section-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              See what our users have to say about their experience with Octa City Bank.
            </p>
          </AnimateIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "Octa City Bank transformed how I manage my business finances. The grant access feature alone has been a game-changer for my startup.",
                name: "Sarah Chen",
                title: "Entrepreneur, San Francisco",
              },
              {
                quote: "The security and ease of use are unmatched. I can manage international transactions seamlessly while knowing my funds are protected.",
                name: "Marcus Okonkwo",
                title: "CEO, Lagos Tech Hub",
              },
              {
                quote: "As an investment advisor, I recommend Octa City Bank to all my clients. The smart dashboard and analytics are truly next-level.",
                name: "Elena Vasquez",
                title: "Investment Advisor, Madrid",
              },
            ].map((testimonial) => (
              <StaggerItem key={testimonial.name}>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{testimonial.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{testimonial.name}</div>
                      <div className="text-xs text-[var(--muted)]">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <ScaleIn className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to <span className="gradient-text">Get Started</span>?
          </h2>
          <p className="text-[var(--muted)] text-lg mb-8">
            Join thousands of users who trust Octa City Bank for secure, smart banking.
            Create your free account today and experience banking without boundaries.
          </p>
          <Link href="/register" className="btn-primary text-white px-8 py-4 rounded-lg text-lg font-medium inline-block">
            Create Free Account
          </Link>
        </ScaleIn>
      </section>

      <Footer />
    </div>
  );
}
