import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Camera, Settings, LogOut, ChevronRight, Shield, FileText, Sparkles } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/perfil")({
  component: Perfil,
  head: () => ({ meta: [{ title: "Perfil — Meu Tom Perfeito" }] }),
});

function Perfil() {
  const { user, loading } = useRequireAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const sair = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (loading || !user) return null;

  const items = [
    { icon: Camera, label: "Refazer análise", action: () => navigate({ to: "/analise" }) },
    { icon: Sparkles, label: "Plano Premium ✨", action: () => navigate({ to: "/premium" }) },
    { icon: Settings, label: "Configurações", action: () => navigate({ to: "/configuracoes" }) },
    { icon: Shield, label: "Privacidade", action: () => navigate({ to: "/privacidade" }) },
    { icon: FileText, label: "Termos de uso", action: () => navigate({ to: "/termos" }) },
    { icon: LogOut, label: "Sair", action: sair },
  ];

  return (
    <>
      <MobileShell>
        <Card className="rounded-3xl p-6 mb-5 border-border/60 shadow-card bg-gradient-soft text-center">
          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full bg-gradient-primary shadow-soft">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-primary-foreground">
                {(profile?.nome || user.email || "?")[0].toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="font-serif text-2xl">{profile?.nome || "—"}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${profile?.plano === "premium" ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"}`}>
            {profile?.plano === "premium" ? "✨ Premium" : "Plano Free"}
          </span>
        </Card>

        <div className="space-y-2">
          {items.map(({ icon: Icon, label, action }) => (
            <button key={label} onClick={action} className="w-full text-left">
              <Card className="rounded-2xl p-4 flex items-center gap-3 border-border/60 shadow-soft hover:scale-[1.01] transition-transform">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{label}</span>
                <ChevronRight className="h-4 w-4 opacity-60" />
              </Card>
            </button>
          ))}
        </div>
      </MobileShell>
      <BottomNav />
    </>
  );
}
