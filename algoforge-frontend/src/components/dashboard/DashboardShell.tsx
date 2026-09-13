import { useState } from "react";
import { Menu, X, Flame, SunMedium, MoonStar } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Code2, History, BarChart3, Settings, LogOut, CalendarDays, ShieldCheck, ListChecks,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/problems", label: "Problems", icon: Code2 },
  { href: "/challenges", label: "Challenges", icon: CalendarDays },
  { href: "/submissions", label: "Submissions", icon: History },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV = [
  { href: "/admin", label: "Admin dashboard", icon: ShieldCheck },
  { href: "/admin/problems", label: "Problem management", icon: ListChecks },
  { href: "/admin/challenges", label: "Challenge schedule", icon: CalendarDays },
];

function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { username, role, logout } = useAuthStore();
  const isAdmin = role === "ADMIN";

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "tween", duration: 0.25 }}
      className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-hairline bg-surface lg:hidden"
    >
      <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
        <span className="font-display text-base font-semibold">
          Algo<span className="text-forge">Forge</span>
        </span>
        <button onClick={onClose} className="text-ink-muted">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                active ? "bg-forge/10 text-forge" : "text-ink-muted hover:bg-elevated"
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
        {isAdmin &&
          ADMIN_NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  active ? "bg-forge/10 text-forge" : "text-ink-muted hover:bg-elevated"
                )}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
      </nav>
      <div className="border-t border-hairline p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forge/15 text-xs font-bold text-forge">
            {username?.slice(0, 2).toUpperCase()}
          </div>
          <p className="flex-1 truncate text-sm font-medium">{username}</p>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut size={16} className="text-ink-faint" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready } = useRequireAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleTheme } = useThemeStore();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <Loader2 className="animate-spin text-forge" size={28} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void text-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,122,61,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(69,217,199,0.09),transparent_25%),radial-gradient(circle_at_center,rgba(140,123,255,0.05),transparent_30%)]" />
      <Sidebar />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-surface/85 px-5 py-3.5 backdrop-blur-xl lg:hidden">
        <span className="flex items-center gap-2">
          <Flame className="text-forge" size={18} />
          <span className="font-display text-base font-semibold">AlgoForge</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-elevated/80 text-ink-muted transition hover:text-ink"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          </button>
          <button onClick={() => setMobileOpen(true)} className="text-ink">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <MobileNav onClose={() => setMobileOpen(false)} />
          </>
        )}
      </AnimatePresence>

      <main className="relative lg:pl-[268px]">
        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-10 lg:py-9">{children}</div>
      </main>
    </div>
  );
}
