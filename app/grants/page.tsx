import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const grants = [
  {
    emoji: "💼",
    title: "Business Grants",
    desc: "Startups, Expansion, Innovation, Industry-specific initiatives",
    amount: "$250,000",
    color: "blue",
  },
  {
    emoji: "👤",
    title: "Individual Grants",
    desc: "Education, Research, Artistic pursuits, Community service",
    amount: "$50,000",
    color: "emerald",
  },
  {
    emoji: "🏢",
    title: "Office Capital Grants",
    desc: "Equipment upgrades, Technology advancements, Renovations, Relocation",
    amount: "$150,000",
    color: "purple",
  },
  {
    emoji: "🌍",
    title: "General Grants",
    desc: "Community development, Health initiatives, Environmental conservation, Cultural preservation",
    amount: "$100,000",
    color: "amber",
  },
  {
    emoji: "🎒",
    title: "School Grants",
    desc: "Infrastructure improvements, Program development, Scholarships, Teacher training",
    amount: "$200,000",
    color: "cyan",
  },
  {
    emoji: "❤️",
    title: "Women Empowerment Grants",
    desc: "Entrepreneurship programs, Education initiatives, Healthcare access, Social justice initiatives",
    amount: "$175,000",
    color: "pink",
  },
];

export default function GrantsPage() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Grants That <span className="gradient-text">Open Doors</span>
            </h1>
            <p className="text-[var(--muted)] max-w-2xl mx-auto text-lg">
              Explore our comprehensive range of funding opportunities designed to support
              businesses, individuals, and communities in achieving their goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {grants.map((grant) => (
              <div
                key={grant.title}
                className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6"
              >
                <div className="text-4xl mb-4">{grant.emoji}</div>
                <h3 className="text-xl font-semibold mb-2">{grant.title}</h3>
                <p className="text-[var(--muted)] text-sm mb-4">{grant.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Up to <span className="text-white font-semibold">{grant.amount}</span>
                  </span>
                  <a href="#" className="text-blue-400 text-sm hover:underline">Learn More →</a>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Apply?</h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-6">
              To apply for a grant, please contact our admin team via the chat assistant.
              Our team will guide you through the application process.
            </p>
            <a href="#" className="btn-primary text-white px-8 py-3 rounded-lg text-lg font-medium inline-block">
              Contact Admin
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
