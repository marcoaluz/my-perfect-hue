import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Camera, Heart, Wand2, Shirt } from "lucide-react";
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

  const { data: pecas = [] } = useQuery({
    queryKey: ["pecas", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("pecas_roupa")
        .select("*")
        .eq("user_id", user!.id);
      return (data || []) as Peca[];
    },
  });

  if (loading || !user) return null;

  const nome = profile?.nome || user.email?.split("@")[0] || "você";
  const paletaCores = (ultimaAnalise?.paleta as { cores?: string[] } | null)?.cores ?? fallbackPalette;
  const temAnalise = !!ultimaAnalise;

  const avaliacao = avaliarClosetParaLook(pecas);
  const today = new Date().toISOString().split("T")[0];
  const lookHoje = avaliacao.ok ? sugerirLook(pecas, `${user.id}_${today}_v0`) : null;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <MobileShell>
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{saudacao},</p>
            <h1 className="font-serif text-2xl">{nome} ✨</h1>
          </div>
          <div className="h-11 w-11 rounded-full bg-gradient-primary shadow-soft" />
        </header>

        <Card className="bg-gradient-primary border-0 text-primary-foreground px-6 py-8 rounded-3xl shadow-card mb-5 relative overflow-hidden">
          <div aria-hidden className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="relative text-xs uppercase tracking-[0.18em] opacity-90 mb-2">
            {temAnalise ? "Sua paleta" : "Descubra suas cores"}
          </p>
          <h2 className="relative font-serif text-3xl leading-tight mb-1">
            {temAnalise
              ? (profile?.paleta_sazonal || `Subtom: ${ultimaAnalise!.subtom_detectado}`)
              : "Em 30 segundos"}
          </h2>
          <p className="relative text-sm opacity-90 mb-5">
            {temAnalise
              ? "Continue refinando seu estilo ✨"
              : "A análise é a porta de entrada pra tudo aqui"}
          </p>
          <Button asChild variant="secondary" className="relative rounded-full">
            <Link to="/analise">
              <Camera className="h-4 w-4" /> {temAnalise ? "Refazer análise" : "Fazer minha análise"}
            </Link>
          </Button>
        </Card>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <Link to="/closet" className="block">
            <Card className="rounded-2xl p-3 border-border/60 flex flex-col items-center gap-1.5 hover:shadow-soft transition-shadow">
              <Shirt className="h-5 w-5 text-terracotta" />
              <p className="text-xs font-medium">Closet</p>
            </Card>
          </Link>
          <Link to="/estilo" className="block">
            <Card className="rounded-2xl p-3 border-border/60 flex flex-col items-center gap-1.5 hover:shadow-soft transition-shadow">
              <Wand2 className="h-5 w-5 text-terracotta" />
              <p className="text-xs font-medium">Estilo</p>
            </Card>
          </Link>
          <Link to="/analise" className="block">
            <Card className="rounded-2xl p-3 border-border/60 flex flex-col items-center gap-1.5 hover:shadow-soft transition-shadow">
              <Camera className="h-5 w-5 text-terracotta" />
              <p className="text-xs font-medium">Refazer</p>
            </Card>
          </Link>
        </div>

        <Link to="/estilo" className="block mb-5">
          <Card className="rounded-3xl p-5 border-border/60 shadow-soft bg-gradient-to-br from-rose-dust/30 to-terracotta/10 hover:shadow-card transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-terracotta/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-terracotta" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-lg">Consultoria de Estilo</h3>
                <p className="text-xs text-muted-foreground">
                  Look completo: roupa, maquiagem, penteado e joias ✨
                </p>
              </div>
            </div>
          </Card>
        </Link>


        <Card className="rounded-3xl p-5 mb-5 border-border/60 shadow-soft">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-terracotta/80">Look do dia</p>
              <h3 className="font-serif text-xl mt-1">
                {lookHoje ? "Sua combinação de hoje" : "Monte seu closet"}
              </h3>
            </div>
            <Heart className="h-5 w-5 text-rose-dust" />
          </div>
          {lookHoje ? (
            <Link to="/looks" className="block">
              <div className="grid grid-cols-3 gap-2">
                {lookHoje.pecas.slice(0, 3).map((p) => (
                  <div key={p.id} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                    {p.foto_url ? (
                      <img src={p.foto_url} alt={p.categoria} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ background: p.cor_hex || "#E8B4B8" }} />
                    )}
                  </div>
                ))}
              </div>
            </Link>
          ) : (
            <Link to="/closet" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
              Adicione peças no closet pra ver looks aqui
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
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
