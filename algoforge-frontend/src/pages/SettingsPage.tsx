import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Camera,
  Check,
  Github,
  Globe,
  Info,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Save,
  Shield,
  Sparkles,
  Trophy,
  CheckCircle2,
  History,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/lib/services/auth";
import type { UserProfile } from "@/types/api";

interface ProfileFormState {
  fullName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  website: string;
  linkedIn: string;
  github: string;
  location: string;
}

const emptyProfile: ProfileFormState = {
  fullName: "",
  email: "",
  bio: "",
  avatarUrl: "",
  website: "",
  linkedIn: "",
  github: "",
  location: "",
};

const buildProfileForm = (profile: Partial<UserProfile> | undefined, username: string | null): ProfileFormState => ({
  fullName: profile?.fullName ?? profile?.username ?? username ?? "User",
  email: profile?.email ?? "",
  bio: profile?.bio ?? "I solve tough problems, build polished products, and keep shipping better every day.",
  avatarUrl: profile?.avatarUrl ?? "",
  website: profile?.website ?? "",
  linkedIn: profile?.linkedIn ?? "",
  github: profile?.github ?? "",
  location: profile?.location ?? "",
});

export default function SettingsPage() {
  const { username } = useAuthStore();
  const [form, setForm] = useState<ProfileFormState>(emptyProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  useEffect(() => {
    if (profile) {
      setForm(buildProfileForm(profile, username));
    } else if (username) {
      setForm(buildProfileForm(undefined, username));
    }
  }, [profile, username]);

  const handleFieldChange = (field: keyof ProfileFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await authService.updateProfile({
        fullName: form.fullName,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
        website: form.website,
        linkedIn: form.linkedIn,
        github: form.github,
        email: form.email,
        location: form.location,
      });
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (form.fullName || username || "User").trim().slice(0, 2).toUpperCase();
  const hasAvatar = Boolean(form.avatarUrl?.trim());

  return (
    <DashboardShell>
      <div className="space-y-6">
        <header className="overflow-hidden rounded-[28px] border border-hairline bg-gradient-to-br from-forge/12 via-surface to-surface p-6 shadow-glass sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-forge/25 bg-forge/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-forge">
                <Sparkles size={12} /> Profile
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Account settings</h1>
              <p className="mt-2 text-sm text-ink-muted">Edit your public profile, links, and identity.</p>
            </div>

            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Solved</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-semibold text-cyan">
                  <CheckCircle2 size={16} /> {stats?.solvedProblems ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Rank</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-semibold text-forge">
                  <Trophy size={16} /> {stats?.rank ? `#${stats.rank}` : "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline bg-elevated/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Submits</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-semibold mono-num text-amber">
                  <History size={16} /> {stats?.totalSubmissions ?? 0}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <Card className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {hasAvatar ? (
                    <img
                      src={form.avatarUrl}
                      alt={form.fullName || username || "User avatar"}
                      className="h-16 w-16 rounded-full border border-forge/25 object-cover shadow-[0_12px_28px_rgba(255,122,61,0.18)]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-forge/25 bg-gradient-to-br from-forge/20 to-cyan/10 text-lg font-bold text-forge">
                      {initials}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-surface bg-surface text-forge shadow-lg">
                    <Camera size={13} />
                  </div>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold">{form.fullName || username || "Your name"}</p>
                  <p className="text-sm text-ink-faint">{form.location || "Tell the community where you build"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleSave} disabled={isSaving} variant="forge" size="sm">
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {isSaving ? "Saving..." : "Save profile"}
                </Button>
                {saved && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                    <Check size={12} /> Saved
                  </span>
                )}
              </div>
            </div>

            <form className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Shield size={13} /> Full name
                </label>
                <Input value={form.fullName} onChange={(event) => handleFieldChange("fullName", event.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Camera size={13} /> Avatar URL
                </label>
                <Input
                  value={form.avatarUrl}
                  onChange={(event) => handleFieldChange("avatarUrl", event.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Info size={13} /> Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(event) => handleFieldChange("bio", event.target.value)}
                  rows={4}
                  className="focus-ring w-full rounded-xl border border-hairline bg-surface/85 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-all duration-200 focus:border-forge/60 focus:bg-surface"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Mail size={13} /> Email
                </label>
                <Input value={form.email} onChange={(event) => handleFieldChange("email", event.target.value)} />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <MapPin size={13} /> Location
                </label>
                <Input value={form.location} onChange={(event) => handleFieldChange("location", event.target.value)} placeholder="Bengaluru, India" />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Globe size={13} /> Website
                </label>
                <Input value={form.website} onChange={(event) => handleFieldChange("website", event.target.value)} placeholder="https://your-site.com" />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Linkedin size={13} /> LinkedIn
                </label>
                <Input value={form.linkedIn} onChange={(event) => handleFieldChange("linkedIn", event.target.value)} placeholder="https://linkedin.com/in/username" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Github size={13} /> GitHub
                </label>
                <Input value={form.github} onChange={(event) => handleFieldChange("github", event.target.value)} placeholder="https://github.com/username" />
              </div>
            </form>

            <div className="mt-6 flex gap-2 rounded-2xl border border-hairline bg-surface/80 p-3">
              <Info size={15} className="mt-0.5 shrink-0 text-ink-faint" />
              <p className="text-xs leading-relaxed text-ink-faint">
                Your changes are saved locally in the browser and can be connected to the backend profile endpoint when the API supports profile updates.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="font-display text-lg font-semibold">Profile preview</p>
            {profileQuery.isLoading || statsQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-forge" size={20} />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-hairline bg-surface/70 p-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Username</p>
                  <p className="mt-2 font-display text-lg font-semibold">{profile?.username ?? username ?? "User"}</p>
                </div>
                <div className="rounded-2xl border border-hairline bg-surface/70 p-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Bio</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{form.bio || "No bio added yet."}</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Website", href: form.website, icon: Globe },
                    { label: "LinkedIn", href: form.linkedIn, icon: Linkedin },
                    { label: "GitHub", href: form.github, icon: Github },
                  ].map(({ label, href, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl border border-hairline bg-surface/70 px-3 py-2.5">
                      <span className="flex items-center gap-2 text-sm text-ink-muted">
                        <Icon size={15} className="text-forge" /> {label}
                      </span>
                      <span className="max-w-[160px] truncate text-right text-xs font-medium text-forge">
                        {href || "Not set"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
