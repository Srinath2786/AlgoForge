import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Loader2, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const rules = [
    { label: "At least 8 characters", ok: form.password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(form.password) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.username.trim().length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }
    if (form.password.length < 8 || !/\d/.test(form.password)) {
      setError("Use at least 8 characters and include a number in your password.");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, username: form.username.trim(), email: form.email.trim().toLowerCase() };
      await authService.register(payload);
      const session = await authService.login({ email: payload.email, password: payload.password });
      setAuth(session.token, session.username, session.role, session.id);
      toast.success("Account created — let's forge your first solve.");
      navigate("/dashboard");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message || "Could not create your account. Try a different username or email."
        : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start solving in under a minute — free forever."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-forge hover:text-forge-hot">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-hairline bg-surface/70 p-3">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            <Sparkles size={12} className="text-forge" /> Join the challenge
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Username</label>
          <Input
            required
            autoFocus
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            placeholder="your_username"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Email</label>
          <Input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Password</label>
          <div className="relative">
            <Input
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.password.length > 0 && (
            <div className="mt-2 space-y-1">
              {rules.map((r) => (
                <div
                  key={r.label}
                  className={`flex items-center gap-1.5 text-xs ${
                    r.ok ? "text-cyan" : "text-ink-faint"
                  }`}
                >
                  <Check size={12} className={r.ok ? "opacity-100" : "opacity-30"} />
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}

        <Button type="submit" variant="forge" className="w-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {loading ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-[11px] text-ink-faint">
          By continuing you agree to AlgoForge&apos;s Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}
