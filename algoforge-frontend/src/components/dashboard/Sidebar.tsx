import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Code2, Flame, History, LayoutDashboard, ListChecks, LogOut, Settings, ShieldCheck, Trophy, UserRound, Zap } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/problems", label: "Problems", icon: Code2 },
  { href: "/challenges", label: "Challenges", icon: CalendarDays },
  { href: "/submissions", label: "Submissions", icon: History },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV = [
  { href: "/admin", label: "Admin dashboard", icon: ShieldCheck },
  { href: "/admin/problems", label: "Problem management", icon: ListChecks },
  { href: "/admin/challenges", label: "Challenge schedule", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { username, role, logout } = useAuthStore();
  const isAdmin = role === "ADMIN";
  const initials = username?.slice(0, 2).toUpperCase() || "AF";

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] flex-col border-r border-hairline bg-surface lg:flex">
      <div className="border-b border-hairline px-5 py-5">
        <Link to="/dashboard" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-forge/30 bg-forge/10 text-forge transition-transform group-hover:scale-105">
            <Flame size={18} strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(255,122,61,0.14)]" />
          </span>
          <div>
            <p className="font-display text-[15px] font-semibold tracking-tight">Algo<span className="text-forge">Forge</span></p>
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-ink-faint">Code. Practice. Master.</p>
          </div>
        </Link>
      </div>

      <div className="px-4 pt-5">
        <p className="px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">Workspace</p>
        <nav className="mt-2 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "border-forge/20 bg-forge/10 text-ink shadow-[inset_3px_0_0_#ff7a3d]"
                    : "border-transparent text-ink-muted hover:border-hairline hover:bg-elevated hover:text-ink"
                )}
              >
                <item.icon size={17} className={cn(active ? "text-forge" : "text-ink-faint group-hover:text-ink-muted")} />
                <span className="flex-1">{item.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-forge shadow-[0_0_8px_rgba(255,122,61,0.8)]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {isAdmin && (
        <div className="px-4 pt-5">
          <p className="px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">Admin</p>
          <nav className="mt-2 space-y-1">
            {ADMIN_NAV.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "border-forge/20 bg-forge/10 text-ink shadow-[inset_3px_0_0_#ff7a3d]"
                      : "border-transparent text-ink-muted hover:border-hairline hover:bg-elevated hover:text-ink"
                  )}
                >
                  <item.icon size={17} className={cn(active ? "text-forge" : "text-ink-faint group-hover:text-ink-muted")} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <div className="mx-4 mt-6 rounded-2xl border border-forge/15 bg-gradient-to-br from-forge/10 to-transparent p-4">
        <div className="flex items-center gap-2 text-xs font-semibold"><Zap size={14} className="text-forge" /> Daily practice</div>
        <p className="mt-1.5 text-[11px] leading-5 text-ink-faint">One problem today keeps your momentum moving.</p>
        <Link to="/problems" className="mt-3 inline-flex text-[11px] font-semibold text-forge hover:text-forge-hot">Find a problem →</Link>
      </div>

      <div className="mt-auto border-t border-hairline p-4">
        <div className="flex items-center gap-3 rounded-xl border border-hairline bg-elevated/50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forge/20 bg-forge/10 text-[11px] font-bold text-forge">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{username || "AlgoForge user"}</p>
            <Link to="/settings" className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-faint hover:text-ink-muted"><UserRound size={10} /> Account settings</Link>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-ink-faint transition-colors hover:bg-danger/10 hover:text-danger"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
