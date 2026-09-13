import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Flame, Menu, X, LogOut, LayoutDashboard, Sparkles, SunMedium, MoonStar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "/problems", label: "Problems" },
  { href: "/submissions", label: "Submissions" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { token, hydrated, hydrate, logout, username } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass border-b border-hairline/80" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        <Link to="/" className="flex items-center gap-2 rounded-full border border-white/6 bg-white/[0.02] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-forge/30 bg-forge/15 shadow-[0_0_18px_rgba(255,122,61,0.16)]">
            <Flame className="h-4.5 w-4.5 text-forge" size={18} strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Algo<span className="text-forge">Forge</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-elevated/70 text-ink-muted transition hover:text-ink"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          </button>
          {isLoggedIn ? (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-forge/20 bg-forge/10 px-2.5 py-1.5 text-[10px] font-semibold text-forge shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <Sparkles size={12} /> {username || "Player"}
              </div>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard size={15} /> Dashboard
                </Button>
              </Link>
              <Button
                variant="forge"
                size="sm"
                onClick={() => logout()}
                className="gap-2"
              >
                <LogOut size={15} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="forge" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="text-ink lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-hairline glass lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-elevated hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-3 px-3">
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setOpen(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-elevated/70 text-ink-muted"
                  aria-label="Toggle theme"
                >
                  {mode === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
                </button>
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <LayoutDashboard size={15} /> Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="forge"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      <LogOut size={15} /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <Button variant="forge" size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
