"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateIn, { StaggerContainer, StaggerItem, ScaleIn } from "@/components/AnimateIn";

const team = [
  { initials: "AC", name: "Alexander Chen", title: "CEO & Founder", bio: "Former VP at Goldman Sachs with 15+ years in digital banking innovation." },
  { initials: "MW", name: "Maria Williams", title: "CTO", bio: "Ex-Google engineer. Led development of secure financial platforms serving millions." },
  { initials: "SO", name: "Samuel Okonkwo", title: "COO", bio: "Operations expert with a decade of experience scaling fintech companies across Africa." },
  { initials: "DK", name: "Diana Kim", title: "Head of Security", bio: "Cybersecurity specialist. Former NSA consultant with expertise in financial systems." },
  { initials: "PP", name: "Priya Patel", title: "Head of Grants", bio: "Development finance expert. Previously managed $500M+ grant portfolio at World Bank." },
  { initials: "JR", name: "James Rodriguez", title: "Head of Design", bio: "Award-winning UX designer focused on accessible and intuitive banking experiences." },
];

const values = [
  {
    title: "Transparency",
    desc: "Complete financial visibility. Every transaction, every fee, every detail is clear and accessible.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  },
  {
    title: "Security",
    desc: "Bank-grade encryption protocols protecting every aspect of your financial data and transactions.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "Inclusivity",
    desc: "Financial services designed for all demographics, breaking barriers and creating equal opportunities.",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    title: "Innovation",
    desc: "Continuous technological advancement to deliver cutting-edge solutions for modern banking needs.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const techStack = [
  "Next.js",
  "React Framework",
  "MongoDB",
  "TailwindCSS",
  "TypeScript",
  "Framer Motion",
  "JWT Authentication",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <AnimateIn className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Building Trust Through <span className="gradient-text">Technology</span>
          </h1>
          <p className="text-[var(--muted)] max-w-2xl mx-auto text-lg">
            Octa City Bank combines cutting-edge technology with an unwavering commitment to
            security and accessibility, making banking truly borderless.
          </p>
        </AnimateIn>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-[var(--section-alt)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <AnimateIn direction="left">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-8 h-full">
              <h2 className="text-2xl font-bold mb-4 gradient-text">Our Mission</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                We are committed to democratizing access to banking and financial opportunities
                worldwide. Our platform removes barriers that have traditionally excluded underserved
                populations from accessing quality financial services, grants, and investment opportunities.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn direction="right">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-8 h-full">
              <h2 className="text-2xl font-bold mb-4 gradient-text">Our Vision</h2>
              <p className="text-[var(--muted)] leading-relaxed">
                We envision a world where everyone has access to financial empowerment. By 2030, we
                aim to serve over 1 million users across 150+ countries, distributing significant
                grants and processing billions in transaction volume to create lasting economic impact.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Our Core <span className="gradient-text">Values</span>
            </h2>
          </AnimateIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                  <p className="text-[var(--muted)] text-sm">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-[var(--section-alt)]">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
          </AnimateIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg font-bold">{member.initials}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-blue-400 text-sm mb-3">{member.title}</p>
                  <p className="text-[var(--muted)] text-sm">{member.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-3xl font-bold mb-8">
              Technology <span className="gradient-text">Stack</span>
            </h2>
          </AnimateIn>
          <ScaleIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-5 py-2 text-sm text-[var(--muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </ScaleIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
