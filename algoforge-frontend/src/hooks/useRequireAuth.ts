import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

export function useRequireAuth() {
  const navigate = useNavigate();
  const { token, hydrated, hydrate, username } = useAuthStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    if (hydrated && !token) {
      navigate("/login", { replace: true });
    }
  }, [hydrated, token, navigate]);

  return { token, username, ready: hydrated && !!token };
}
