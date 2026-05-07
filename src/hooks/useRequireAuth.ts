import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

const PUBLIC_ONBOARDING_PATHS = ["/onboarding", "/login", "/cadastro"];

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed, subtom, paleta_sazonal, nome, plano")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (
      profile &&
      profile.onboarding_completed === false &&
      !PUBLIC_ONBOARDING_PATHS.includes(location.pathname)
    ) {
      navigate({ to: "/onboarding" });
    }
  }, [user, loading, profile, location.pathname, navigate]);

  return { user, loading, profile };
}
