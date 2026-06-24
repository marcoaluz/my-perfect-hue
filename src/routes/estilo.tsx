import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sparkles, ArrowLeft, ArrowRight, RefreshCw, Heart,
  PartyPopper, Briefcase, Coffee, Heart as HeartIcon,
  Sun, Activity, Check, Trash2,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  sugerirPenteados,
  sugerirMaquiagem,
  sugerirJoias,
} from "@/lib/style-suggester";
import {
  FormatoRosto,
  CabeloComprimento,
  CabeloTextura,
  Ocasiao,
  PENTEADOS,
} from "@/lib/hairstyle-catalog";
import { sugerirLook, type Peca } from "@/lib/look-suggester";

export const Route = createFileRoute("/estilo")({
  component: Estilo,
  head: () => ({ meta: [{ title: "Estilo — Meu Tom Perfeito" }] }),
});

type Etapa = "ocasiao" | "rosto" | "cabelo" | "loading" | "resultado";

const OCASIOES: { id: Ocasiao; label: string; icon: typeof PartyPopper; cor: string }[] = [
  { id: "festa", label: "Festa", icon: PartyPopper, cor: "from-purple-200 to-pink-200" },
  { id: "casual", label: "Casual", icon: Coffee, cor: "from-amber-100 to-orange-200" },
  { id: "trabalho", label: "Trabalho", icon: Briefcase, cor: "from-slate-200 to-stone-300" },
  { id: "encontro", label: "Encontro", icon: HeartIcon, cor: "from-rose-200 to-red-200" },
  { id: "praia", label: "Praia", icon: Sun, cor: "from-sky-200 to-cyan-200" },
  { id: "esporte", label: "Esporte", icon: Activity, cor: "from-green-200 to-emerald-200" },
];

const FORMATOS: { id: FormatoRosto; label: string; desc: string }[] = [
  { id: "oval", label: "Oval", desc: "Queixo levemente mais estreito que a testa" },
  { id: "redondo", label: "Redondo", desc: "Largura e altura parecidas, bochechas marcadas" },
  { id: "quadrado", label: "Quadrado", desc: "Mandíbula e testa em linha reta" },
  { id: "coracao", label: "Coração", desc: "Testa larga, queixo afilado" },
  { id: "alongado", label: "Alongado", desc: "Mais comprido que largo" },
];

const COMPRIMENTOS: { id: CabeloComprimento; label: string }[] = [
  { id: "curto", label: "Curto" },
  { id: "medio", label: "Médio (ombro)" },
  { id: "longo", label: "Longo" },
];

const TEXTURAS: { id: CabeloTextura; label: string }[] = [
  { id: "liso", label: "Liso" },
  { id: "ondulado", label: "Ondulado" },
  { id: "cacheado", label: "Cacheado" },
  { id: "crespo", label: "Crespo" },
];

function ConsultasSalvas({
  userId,
  onAbrir,
}: {
  userId: string;
  onAbrir: (f: any) => void;
}) {
  const qc = useQueryClient();
  const { data: consultas = [] } = useQuery({
    queryKey: ["consultas_salvas", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultas_salvas")
        .select("*")
        .eq("user_id", userId)
        .eq("favorito", true)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const excluir = async (id: string) => {
    const { error } = await supabase.from("consultas_salvas").delete().eq("id", id);
    if (error) return toast.error("Erro ao excluir");
    toast.success("Removido dos favoritos");
    qc.invalidateQueries({ queryKey: ["consultas_salvas"] });
  };

  if (consultas.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/60">
          <Heart className="h-7 w-7 text-muted-foreground" strokeWidth={1.6} />
        </div>
        <p className="font-serif text-lg mb-1">Nenhuma consulta salva ainda</p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Toque no ❤️ ao finalizar uma consulta pra salvá-la aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {consultas.map((c) => {
        const m = c.maquiagem as { batom?: { cor?: string }; blush?: { cor?: string }; sombra?: { cores?: string[] } } | null;
        const j = c.joias as { metal_hex?: string } | null;
        return (
          <Card key={c.id} className="rounded-2xl p-4 border-border/60 flex items-center gap-3">
            <button
              onClick={() => onAbrir(c)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
            >
              <div className="flex -space-x-1 shrink-0">
                {m?.batom?.cor && (
                  <div className="h-8 w-8 rounded-full border-2 border-background shadow-sm" style={{ background: m.batom.cor }} />
                )}
                {m?.blush?.cor && (
                  <div className="h-8 w-8 rounded-full border-2 border-background shadow-sm" style={{ background: m.blush.cor }} />
                )}
                {j?.metal_hex && (
                  <div className="h-8 w-8 rounded-full border-2 border-background shadow-sm" style={{ background: j.metal_hex }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium capitalize text-sm">{c.ocasiao}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(c.created_at!).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  {c.pecas_look?.length ? ` · ${c.pecas_look.length} peças` : ""}
                </p>
              </div>
            </button>
            <button
              onClick={() => excluir(c.id)}
              className="p-2 text-muted-foreground hover:text-destructive"
              aria-label="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        );
      })}
    </div>
  );
}

function getJoiaSVG(metal: string): string {
  const m = (metal || "").toLowerCase();
  // PRATA / FRIO: Brinco argola com pérola
  if (m.includes("prata") || m.includes("branco") || m.includes("platina")) {
    return `<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="80" r="44" fill="none" stroke="#B8C4CC" stroke-width="10"/>
      <circle cx="60" cy="80" r="28" fill="#F0F4F7"/>
      <line x1="60" y1="126" x2="60" y2="142" stroke="#A0B0BC" stroke-width="2"/>
      <circle cx="60" cy="158" r="16" fill="#DDE6EE" stroke="#B8CAD6" stroke-width="1.5"/>
      <ellipse cx="54" cy="152" rx="5" ry="4" fill="white" opacity="0.7"/>
      <rect x="52" y="32" width="16" height="8" rx="3" fill="#A0B0BC"/>
    </svg>`;
  }
  // ROSÊ: Brinco gota
  if (m.includes("ros") || m.includes("rosê")) {
    return `<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 36 Q82 36 82 58 Q82 74 60 76 Q38 74 38 58 Q38 36 60 36Z"
            fill="none" stroke="#C89080" stroke-width="6"/>
      <line x1="60" y1="76" x2="60" y2="90" stroke="#C08878" stroke-width="2.5"/>
      <path d="M60 90 Q40 112 40 132 Q40 156 60 160 Q80 156 80 132 Q80 112 60 90Z"
            fill="#E0A090" stroke="#C08878" stroke-width="1.5"/>
      <ellipse cx="53" cy="114" rx="7" ry="10" fill="white" opacity="0.30"/>
    </svg>`;
  }
  // DOURADO / QUENTE: Colar com pingente hexagonal
  return `<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 70 Q60 48 104 70" fill="none" stroke="#C09840" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="16" cy="70" rx="7" ry="5" fill="none" stroke="#C09840" stroke-width="2"/>
    <ellipse cx="104" cy="70" rx="7" ry="5" fill="none" stroke="#C09840" stroke-width="2"/>
    <line x1="60" y1="48" x2="60" y2="86" stroke="#C09840" stroke-width="2.5"/>
    <polygon points="60,88 76,98 76,118 60,128 44,118 44,98"
             fill="#D4A840" stroke="#A88030" stroke-width="1.5"/>
    <polygon points="60,96 70,102 70,114 60,120 50,114 50,102"
             fill="#E8C060"/>
    <ellipse cx="55" cy="100" rx="4" ry="5" fill="white" opacity="0.28"/>
  </svg>`;
}

function Estilo() {

  const { user, loading, profile } = useRequireAuth();
  const qc = useQueryClient();

  const [etapa, setEtapa] = useState<Etapa>("ocasiao");
  const [ocasiao, setOcasiao] = useState<Ocasiao | null>(null);
  const [formato, setFormato] = useState<FormatoRosto | null>(null);
  const [comprimento, setComprimento] = useState<CabeloComprimento | null>(null);
  const [textura, setTextura] = useState<CabeloTextura | null>(null);
  const [penteadoEscolhido, setPenteadoEscolhido] = useState<string | null>(null);
  const [refreshIdx, setRefreshIdx] = useState(0);
  const [favoritoAtivo, setFavoritoAtivo] = useState<any>(null);
  const [ultimaOcasiao, setUltimaOcasiao] = useState<Ocasiao | null>(null);

  const { data: profileFull } = useQuery({
    queryKey: ["profile-estilo", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
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

  const [tab, setTab] = useState<"novo" | "salvos">("novo");




  useEffect(() => {
    if (profileFull) {
      if (profileFull.formato_rosto) setFormato(profileFull.formato_rosto as FormatoRosto);
      if (profileFull.cabelo_comprimento) setComprimento(profileFull.cabelo_comprimento as CabeloComprimento);
      if (profileFull.cabelo_textura) setTextura(profileFull.cabelo_textura as CabeloTextura);
    }
    const saved = localStorage.getItem("mtp_ultima_ocasiao") as Ocasiao | null;
    if (saved) setUltimaOcasiao(saved);
  }, [profileFull]);

  const temPreferencias = !!profileFull?.formato_rosto && !!profileFull?.cabelo_comprimento && !!profileFull?.cabelo_textura;

  const penteados = useMemo(() => {
    if (!ocasiao) return [];
    if (favoritoAtivo?.penteado_id) {
      const pinned = PENTEADOS.find((p) => p.id === favoritoAtivo.penteado_id);
      const rest = sugerirPenteados(formato, comprimento, textura, ocasiao, 3)
        .filter((p) => p.id !== favoritoAtivo.penteado_id);
      return pinned ? [pinned, ...rest].slice(0, 3) : rest;
    }
    return sugerirPenteados(formato, comprimento, textura, ocasiao, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocasiao, formato, comprimento, textura, refreshIdx, favoritoAtivo]);

  const maquiagem = useMemo(() => {
    if (favoritoAtivo?.maquiagem) return favoritoAtivo.maquiagem;
    if (!ocasiao) return null;
    return sugerirMaquiagem(profile?.subtom, profile?.paleta_sazonal, [], ocasiao);
  }, [ocasiao, profile, favoritoAtivo]);

  const joias = useMemo(() => {
    if (favoritoAtivo?.joias) return favoritoAtivo.joias;
    if (!ocasiao) return null;
    return sugerirJoias(profile?.subtom, ocasiao);
  }, [ocasiao, profile, favoritoAtivo]);

  const lookDoCloset = useMemo(() => {
    if (!ocasiao || pecas.length === 0) return null;
    if (favoritoAtivo?.pecas_look?.length) {
      const ids = new Set<string>(favoritoAtivo.pecas_look);
      const pecasSalvas = pecas.filter((p) => ids.has(p.id));
      if (pecasSalvas.length) return { pecas: pecasSalvas };
    }
    const seed = `${user?.id}_estilo_${ocasiao}_v${refreshIdx}`;
    return sugerirLook(pecas, seed);
  }, [ocasiao, pecas, user, refreshIdx, favoritoAtivo]);

  const escolherOcasiao = (o: Ocasiao) => {
    setOcasiao(o);
    setUltimaOcasiao(o);
    localStorage.setItem("mtp_ultima_ocasiao", o);
    if (temPreferencias) {
      setEtapa("loading");
      setTimeout(() => setEtapa("resultado"), 800);
    } else {
      setEtapa("rosto");
    }
  };

  const confirmarRosto = (f: FormatoRosto | null) => {
    setFormato(f);
    setEtapa("cabelo");
  };

  const confirmarCabelo = async () => {
    if (user && (formato || comprimento || textura)) {
      await supabase
        .from("profiles")
        .update({
          formato_rosto: formato,
          cabelo_comprimento: comprimento,
          cabelo_textura: textura,
        })
        .eq("id", user.id);
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["profile-estilo"] });
    }
    setEtapa("loading");
    setTimeout(() => setEtapa("resultado"), 1200);
  };

  const reiniciar = () => {
    setEtapa("ocasiao");
    setOcasiao(null);
    setPenteadoEscolhido(null);
    setRefreshIdx(0);
    setFavoritoAtivo(null);
  };

  const novasSugestoes = () => {
    setFavoritoAtivo(null);
    setRefreshIdx((i) => i + 1);
    setPenteadoEscolhido(null);
  };

  const abrirFavorito = (f: any) => {
    setFavoritoAtivo(f);
    setOcasiao(f.ocasiao as Ocasiao);
    if (f.formato_rosto) setFormato(f.formato_rosto as FormatoRosto);
    if (f.cabelo_comprimento) setComprimento(f.cabelo_comprimento as CabeloComprimento);
    if (f.cabelo_textura) setTextura(f.cabelo_textura as CabeloTextura);
    if (f.penteado_id) setPenteadoEscolhido(f.penteado_id);
    setEtapa("resultado");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const salvarConsulta = async () => {
    if (!user || !ocasiao) return;
    const { error } = await supabase.from("consultas_salvas").insert({
      user_id: user.id,
      ocasiao,
      formato_rosto: formato,
      cabelo_comprimento: comprimento,
      cabelo_textura: textura,
      penteado_id: penteadoEscolhido,
      pecas_look: lookDoCloset?.pecas.map((p) => p.id) || null,
      maquiagem: maquiagem as never,
      joias: joias as never,
      favorito: true,
    });
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Consulta salva nos favoritos ❤️");
    qc.invalidateQueries({ queryKey: ["consultas_salvas"] });
  };

  if (loading || !user) return null;

  return (
    <>
      <MobileShell>
        {(etapa === "rosto" || etapa === "cabelo") && (
          <button
            onClick={() => {
              if (etapa === "rosto") setEtapa("ocasiao");
              else if (etapa === "cabelo") setEtapa("rosto");
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
        )}

        {etapa === "ocasiao" && (
          <Tabs value={tab} onValueChange={(v) => setTab(v as "novo" | "salvos")}>
            <TabsList className="grid grid-cols-2 mb-4 rounded-full bg-secondary/60 w-full">
              <TabsTrigger value="novo" className="rounded-full">Nova consulta</TabsTrigger>
              <TabsTrigger value="salvos" className="rounded-full">Salvos</TabsTrigger>
            </TabsList>

            <TabsContent value="novo">
              <PageHeader
                eyebrow="Consultoria"
                title="Qual a ocasião?"
                subtitle="Vou montar um look completo pra você"
              />
              <div className="grid grid-cols-2 gap-3">
                {ultimaOcasiao && (
                  <button
                    onClick={() => escolherOcasiao(ultimaOcasiao)}
                    className="col-span-2 mb-1"
                  >
                    <Card className="rounded-2xl p-4 border-terracotta/40 bg-terracotta/5 border-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-terracotta" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Repetir última consulta</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {ultimaOcasiao} · toque pra usar de novo
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-terracotta" />
                    </Card>
                  </button>
                )}
                {OCASIOES.map(({ id, label, icon: Icon, cor }) => (
                  <button
                    key={id}
                    onClick={() => escolherOcasiao(id)}
                    className="group"
                  >
                    <Card className={`rounded-3xl p-5 bg-gradient-to-br ${cor} border-0 shadow-soft transition-transform group-hover:scale-[1.02] group-active:scale-95`}>
                      <Icon className="h-7 w-7 text-foreground/80 mb-2" />
                      <p className="font-medium text-foreground">{label}</p>
                    </Card>
                  </button>
                ))}
              </div>

              {!profile?.subtom && (
                <Card className="mt-5 rounded-2xl p-4 bg-secondary/40 border-border/60">
                  <p className="text-xs text-muted-foreground">
                    💡 Faça sua análise de subtom em "Análise" para sugestões ainda
                    mais personalizadas de maquiagem e joias.
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="salvos">
              <ConsultasSalvas userId={user.id} onAbrir={abrirFavorito} />
            </TabsContent>
          </Tabs>
        )}

        {etapa === "rosto" && (
          <>
            <PageHeader
              eyebrow="1/2"
              title="Formato do rosto"
              subtitle="Pra eu acertar no penteado"
            />
            <div className="space-y-2">
              {FORMATOS.map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => confirmarRosto(id)}
                  className="w-full text-left"
                >
                  <Card className={`rounded-2xl p-4 border-2 transition-colors ${
                    formato === id ? "border-terracotta bg-terracotta/5" : "border-border/60"
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                      {formato === id && <Check className="h-5 w-5 text-terracotta shrink-0" />}
                    </div>
                  </Card>
                </button>
              ))}
              <button
                onClick={() => confirmarRosto(null)}
                className="w-full text-center text-sm text-muted-foreground py-3"
              >
                Não sei meu formato — escolher por mim
              </button>
            </div>
          </>
        )}

        {etapa === "cabelo" && (
          <>
            <PageHeader eyebrow="2/2" title="Seu cabelo" />

            <div className="mb-5">
              <p className="text-sm font-medium mb-2">Comprimento</p>
              <div className="grid grid-cols-3 gap-2">
                {COMPRIMENTOS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setComprimento(id)}
                    className={`rounded-2xl p-3 text-sm border-2 transition-colors ${
                      comprimento === id
                        ? "border-terracotta bg-terracotta/10 font-medium"
                        : "border-border/60 bg-secondary/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Textura</p>
              <div className="grid grid-cols-2 gap-2">
                {TEXTURAS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTextura(id)}
                    className={`rounded-2xl p-3 text-sm border-2 transition-colors ${
                      textura === id
                        ? "border-terracotta bg-terracotta/10 font-medium"
                        : "border-border/60 bg-secondary/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full rounded-full"
              onClick={confirmarCabelo}
              disabled={!comprimento || !textura}
            >
              Ver minha consultoria ✨
            </Button>
          </>
        )}

        {etapa === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <Sparkles className="h-12 w-12 text-terracotta animate-pulse" />
            </div>
            <h2 className="font-serif text-xl mb-2">Criando seu look...</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Combinando sua paleta, formato de rosto e tipo de cabelo ✨
            </p>
          </div>
        )}

        {etapa === "resultado" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-terracotta/80">Look completo</p>
                <h1 className="font-serif text-2xl capitalize">{ocasiao}</h1>
              </div>
              <Button variant="ghost" size="sm" onClick={reiniciar}>
                Mudar
              </Button>
            </div>

            {/* LOOK */}
            <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg">👗 Roupa</h3>
                {lookDoCloset && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Do seu closet
                  </span>
                )}
              </div>

              {lookDoCloset ? (
                <div className="grid grid-cols-3 gap-2">
                  {lookDoCloset.pecas.map((p) => (
                    <div key={p.id}>
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                        {p.foto_url ? (
                          <img src={p.foto_url} alt={p.categoria} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: p.cor_hex || "#E8B4B8" }} />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 text-center">{p.categoria}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Pra {ocasiao}: aposte em peças da sua paleta{" "}
                    {profile?.paleta_sazonal || "personalizada"}.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    💡 Adicione peças no seu closet pra eu montar looks reais com elas.
                  </p>
                </div>
              )}
            </Card>

            {/* PENTEADO */}
            <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg">💇 Penteado</h3>
                <button
                  onClick={novasSugestoes}
                  className="flex items-center gap-1 text-xs text-terracotta"
                >
                  <RefreshCw className="h-3 w-3" /> Outras
                </button>
              </div>

              {penteados.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sem sugestões pra esses parâmetros. Tente "Outras".
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {penteados.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPenteadoEscolhido(p.id)}
                      className={`rounded-2xl p-3 border-2 transition-all ${
                        penteadoEscolhido === p.id
                          ? "border-terracotta bg-terracotta/5"
                          : "border-border/60 bg-secondary/20"
                      }`}
                    >
                      <div
                        className="aspect-[3/4] mb-2 text-terracotta flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: p.svg }}
                      />

                      <p className="text-[11px] mt-1 text-center leading-tight">{p.nome}</p>
                    </button>
                  ))}
                </div>
              )}

              {penteadoEscolhido && (
                <p className="text-xs text-muted-foreground mt-3 italic">
                  {penteados.find((p) => p.id === penteadoEscolhido)?.descricao}
                </p>
              )}
            </Card>

            {/* MAQUIAGEM */}
            {maquiagem && (
              <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
                <h3 className="font-serif text-lg mb-3">💄 Maquiagem</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full shadow-sm shrink-0"
                      style={{ background: maquiagem.batom.cor }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Batom · {maquiagem.batom.descricao}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Ex: {maquiagem.batom.nome_produto}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 shrink-0">
                      {maquiagem.sombra.cores.map((c: string, i: number) => (
                        <div
                          key={i}
                          className="h-10 w-5 rounded-md shadow-sm"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Sombra</p>
                      <p className="text-xs text-muted-foreground">{maquiagem.sombra.descricao}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full shadow-sm shrink-0"
                      style={{ background: maquiagem.blush.cor }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Blush · {maquiagem.blush.descricao}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Ex: {maquiagem.blush.nome_produto}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* JOIAS */}
            {joias && (
              <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
                <h3 className="font-serif text-lg mb-3">💎 Joias e acessórios</h3>
                <div className="flex items-start gap-3">
                  <div
                    className="h-20 w-20 rounded-2xl shrink-0 flex items-center justify-center"
                    style={{ background: joias.metal_hex + "22" }}
                    dangerouslySetInnerHTML={{ __html: getJoiaSVG(joias.metal) }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{joias.metal}</p>
                    <p className="text-xs text-muted-foreground">{joias.estilo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Pedras: </span>
                      {joias.pedras.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="font-medium">Ex: </span>
                      {joias.exemplo}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-2 mt-6">
              <Button variant="outline" className="rounded-full" onClick={novasSugestoes}>
                <RefreshCw className="h-4 w-4" /> Outras sugestões
              </Button>
              <Button className="rounded-full" onClick={salvarConsulta}>
                <Heart className="h-4 w-4" /> Salvar
              </Button>
            </div>
          </>
        )}
      </MobileShell>
      <BottomNav />
    </>
  );
}
