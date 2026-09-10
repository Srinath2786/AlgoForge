import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuthStore } from "@/store/auth-store";

/** Renders children only once auth has hydrated and a token exists; otherwise redirects to /login. */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { ready } = useRequireAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <Loader2 className="animate-spin text-forge" size={26} />
      </div>
    );
  }

  return <>{children}</>;
}

/** Renders children only for ADMIN users; redirects everyone else to /dashboard. */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { ready } = useRequireAuth();
  const { role } = useAuthStore();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <Loader2 className="animate-spin text-forge" size={26} />
      </div>
    );
  }

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/** Keeps already-authenticated users off public-only pages like /login and /register. */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { hydrated, hydrate, token } = useAuthStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <Loader2 className="animate-spin text-forge" size={26} />
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
