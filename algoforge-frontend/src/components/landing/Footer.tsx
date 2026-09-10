import { Link } from "react-router-dom";
import { Flame, Github, Twitter, Linkedin, Youtube } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Problems", href: "/problems" },
      { label: "Contests", href: "#contests" },
      { label: "Leaderboard", href: "#leaderboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Roadmaps", href: "#" },
      { label: "Leaderboard", href: "#leaderboard" },
      { label: "FAQ", href: "#" },
      { label: "Docs", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-hairline bg-void">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-forge/30 bg-forge/15">
                <Flame className="text-forge" size={18} strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-semibold">
                Algo<span className="text-forge">Forge</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-muted">
              Where developers forge interview-ready skills — problems,
              a real code judge, progress tracking, and leaderboards in one place.
            </p>
            <div className="mt-6 flex gap-3">
              {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-ink-faint transition-colors hover:border-forge/40 hover:text-forge"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} AlgoForge. All rights reserved.</p>
          <p className="font-mono">Built for developers who ship.</p>
        </div>
      </div>
    </footer>
  );
}
