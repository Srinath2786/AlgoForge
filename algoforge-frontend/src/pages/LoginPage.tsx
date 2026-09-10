import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Loader2, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { isAxiosError } from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login({ ...form, email: form.email.trim().toLowerCase() });
      setAuth(res.token, res.username, res.role, res.id);
      toast.success(`Welcome back, ${res.username}`);
      navigate("/dashboard");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message || "Invalid email or password."
        : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep forging your streak."
      footer={
        <>
          New to AlgoForge?{" "}
          <Link to="/register" className="font-medium text-forge hover:text-forge-hot">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-hairline bg-surface/70 p-3">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            <Shield size={12} className="text-cyan" /> Secure workspace
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Email</label>
          <Input
            required
            autoFocus
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
        </div>

        {error && (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}

        <Button type="submit" variant="forge" className="w-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {loading ? "Logging in…" : "Log in"}
        </Button>

        <div className="flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface/60 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-ink-faint">
          <Sparkles size={12} className="text-forge" /> Ready to solve again
        </div>
      </form>
    </AuthShell>
  );
}
