import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--section-alt)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="text-lg font-bold gradient-text">Octa City Bank</span>
            </div>
            <p className="text-[var(--muted)] text-sm">
              Next-generation digital banking platform. Secure, smart, and seamless financial management for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Grants", href: "/grants" },
                { label: "Donate", href: "/donate" },
                { label: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[var(--muted)] hover:text-white transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[var(--muted)] hover:text-white transition-colors text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Stay Updated</h4>
            <p className="text-[var(--muted)] text-sm mb-3">Subscribe to our newsletter for updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-white placeholder-[var(--muted)] focus:outline-none focus:border-blue-500"
              />
              <button className="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--card-border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--muted)] text-sm">
            &copy; 2026 Octa City Bank. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[var(--muted)] text-xs">
            <span>Built with Next.js, MongoDB &amp; TailwindCSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
