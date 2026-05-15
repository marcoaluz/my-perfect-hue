import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Camera, Heart } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { sugerirLook, avaliarClosetParaLook, type Peca } from "@/lib/look-suggester";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Início — Meu Tom Perfeito" },
      { name: "description", content: "Seu painel personalizado de cores, looks e descobertas." },
    ],
  }),
});

const fallbackPalette = ["#C97B63", "#E8B4B8", "#D4AF8C", "#A8B5A0", "#F5E6E0"];

function Dashboard() {
  const { user, loading } = useRequireAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: ultimaAnalise } = useQuery({
    queryKey: ["ultima-analise", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("analises")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  if (loading || !user) return null;

  const nome = profile?.nome || user.email?.split("@")[0] || "você";
  const paletaCores = (ultimaAnalise?.paleta as { cores?: string[] } | null)?.cores ?? fallbackPalette;
  const temAnalise = !!ultimaAnalise;

  return (
    <>
      <MobileShell>
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Bom dia,</p>
            <h1 className="font-serif text-2xl">{nome} ✨</h1>
          </div>
          <div className="h-11 w-11 rounded-full bg-gradient-primary shadow-soft" />
        </header>

        <Card className="bg-gradient-primary border-0 text-primary-foreground p-6 rounded-3xl shadow-card mb-5">
          <p className="text-xs uppercase tracking-[0.18em] opacity-90 mb-2">Sua análise</p>
          <h2 className="font-serif text-2xl leading-tight mb-4">
            {temAnalise ? `Subtom: ${ultimaAnalise!.subtom_detectado}` : "Descubra suas cores em 30 segundos"}
          </h2>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/analise">
              <Camera className="h-4 w-4" /> {temAnalise ? "Refazer análise" : "Fazer minha análise"}
            </Link>
          </Button>
        </Card>

        <Card className="rounded-3xl p-5 mb-5 border-border/60 shadow-soft">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-terracotta/80">Look do dia</p>
              <h3 className="font-serif text-xl mt-1">Tons quentes & terracota</h3>
            </div>
            <Heart className="h-5 w-5 text-rose-dust" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {paletaCores.slice(0, 3).map((c, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl" style={{ background: c }} />
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl p-5 mb-5 border-border/60 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg">Sua paleta</h3>
            <span className="text-xs text-muted-foreground">{profile?.paleta_sazonal || "—"}</span>
          </div>
          <div className="flex gap-2">
            {paletaCores.map((c) => (
              <div key={c} className="flex-1 aspect-square rounded-2xl shadow-sm" style={{ background: c }} />
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl p-5 border-border/60 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-terracotta" /> Descobertas
            </h3>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Em breve, sugestões personalizadas para você.</p>
        </Card>
      </MobileShell>
      <BottomNav />
    </>
  );
}
