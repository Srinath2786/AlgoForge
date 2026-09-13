import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  BookOpen,
  Camera,
  Github,
  Globe,
  Link2,
  Loader2,
  Linkedin,
  MapPin,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/store/auth-store";

const socialLinks = [
  { key: "website", label: "Website", href: "website", icon: Globe },
  { key: "github", label: "GitHub", href: "github", icon: Github },
  { key: "linkedIn", label: "LinkedIn", href: "linkedIn", icon: Linkedin },
] as const;

export default function ProfilePage() {
  const { username } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: ["me", "profile"],
    queryFn: () => authService.getCurrentUser(),
  });

  const statsQuery = useQuery({
    queryKey: ["me", "dashboard-stats"],
    queryFn: () => authService.getDashboardStats(),
  });

  const profile = profileQuery.data;
  const stats = statsQuery.data;
  const displayName = profile?.fullName || profile?.username || username || "User";
  const initials = displayName.trim().slice(0, 2).toUpperCase() || "AF";
  const hasAvatar = Boolean(profile?.avatarUrl?.trim());
  const bannerStyle = {
    background: `linear-gradient(135deg, rgba(255,122,61,0.18), rgba(69,217,199,0.12), rgba(140,123,255,0.18))`,
  } as const;

  if (profileQuery.isLoading || statsQuery.isLoading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-forge" size={28} />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <header className="overflow-hidden rounded-[28px] border border-hairline p-6 shadow-glass sm:p-7" style={bannerStyle}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                {hasAvatar && profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="h-20 w-20 rounded-full border border-forge/25 object-cover shadow-[0_16px_30px_rgba(255,122,61,0.2)]"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-forge/25 bg-gradient-to-br from-forge/20 to-cyan/10 text-xl font-bold text-forge">
                    {initials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-surface bg-surface text-forge shadow-lg">
                  <Camera size={14} />
                </div>
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-forge/20 bg-forge/10 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-forge">
                  <Sparkles size={11} /> Profile
                </div>
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{displayName}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <AtSign size={14} /> {profile?.username || username || "user"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Shield size={14} /> {profile?.role || "USER"}
                  </span>
                  {profile?.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} /> {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Link to="/settings">
                <Button variant="forge" size="sm">Edit profile</Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-[10px] tracking-[0.16em] text-ink-faint">Solved</p>
            <p className="mt-3 font-display text-3xl font-semibold text-cyan">{stats?.solvedProblems ?? 0}</p>
          </Card>
          <Card className="p-5">
            <p className="text-[10px] tracking-[0.16em] text-ink-faint">Current rank</p>
            <p className="mt-3 font-display text-3xl font-semibold text-forge">{stats?.rank ? `#${stats.rank}` : "—"}</p>
          </Card>
          <Card className="p-5">
            <p className="text-[10px] tracking-[0.16em] text-ink-faint">Acceptance</p>
            <p className="mt-3 font-display text-3xl font-semibold text-amber">{stats?.acceptanceRate ?? 0}%</p>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-cyan" size={18} />
              <h2 className="font-display text-xl font-semibold">About</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              {profile?.bio || "This user is still shaping their story. Add a bio in settings to share what they’re building and solving."}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-surface/65 p-4">
                <p className="text-[10px] tracking-[0.16em] text-ink-faint">Email</p>
                <p className="mt-2 text-sm font-medium text-ink">{profile?.email || "Not provided"}</p>
              </div>
              <div className="rounded-2xl border border-hairline bg-surface/65 p-4">
                <p className="text-[10px] tracking-[0.16em] text-ink-faint">Location</p>
                <p className="mt-2 text-sm font-medium text-ink">{profile?.location || "Not specified"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Link2 className="text-forge" size={18} />
              <h2 className="font-display text-xl font-semibold">Links</h2>
            </div>

            <div className="mt-5 space-y-3">
              {socialLinks.map(({ key, label, href, icon: Icon }) => {
                const value = profile?.[key as keyof typeof profile] as string | null | undefined;
                return (
                  <a
                    key={key}
                    href={value || "#"}
                    target={value ? "_blank" : undefined}
                    rel={value ? "noreferrer" : undefined}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-3 transition-colors ${
                      value ? "border-hairline bg-surface/65 hover:border-forge/30 hover:text-forge" : "border-dashed border-hairline bg-surface/35 text-ink-faint"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <Icon size={15} /> {label}
                    </span>
                    <span className="max-w-[120px] truncate text-right text-[11px] font-medium">
                      {value || "Not set"}
                    </span>
                  </a>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-violet" size={18} />
            <h2 className="font-display text-xl font-semibold">Practice summary</h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-hairline bg-surface/65 p-4">
              <p className="text-[10px] tracking-[0.16em] text-ink-faint">Total submissions</p>
              <p className="mt-2 font-display text-2xl font-semibold">{stats?.totalSubmissions ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-surface/65 p-4">
              <p className="text-[10px] tracking-[0.16em] text-ink-faint">Easy</p>
              <p className="mt-2 font-display text-2xl font-semibold text-cyan">{stats?.easySolved ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-surface/65 p-4">
              <p className="text-[10px] tracking-[0.16em] text-ink-faint">Hard</p>
              <p className="mt-2 font-display text-2xl font-semibold text-violet">{stats?.hardSolved ?? 0}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/problems">
              <Button variant="forge" size="sm" className="gap-2">
                Solve more <ArrowRight size={15} />
              </Button>
            </Link>
            <Link to="/submissions">
              <Button variant="outline" size="sm">View submissions</Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
