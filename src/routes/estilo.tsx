import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowLeft, RefreshCw, Heart,
  PartyPopper, Briefcase, Coffee, Heart as HeartIcon,
  Sun, Activity, Check,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  sugerirPenteados,
  sugerirMaquiagem,
  sugerirJoias,
} from "@/lib/style-suggester";
import type {
  FormatoRosto,
  CabeloComprimento,
  CabeloTextura,
  Ocasiao,
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

  useEffect(() => {
    if (profileFull) {
      if (profileFull.formato_rosto) setFormato(profileFull.formato_rosto as FormatoRosto);
      if (profileFull.cabelo_comprimento) setComprimento(profileFull.cabelo_comprimento as CabeloComprimento);
      if (profileFull.cabelo_textura) setTextura(profileFull.cabelo_textura as CabeloTextura);
    }
  }, [profileFull]);

  const temPreferencias = !!profileFull?.formato_rosto && !!profileFull?.cabelo_comprimento && !!profileFull?.cabelo_textura;

  const penteados = useMemo(() => {
    if (!ocasiao) return [];
    return sugerirPenteados(formato, comprimento, textura, ocasiao, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocasiao, formato, comprimento, textura, refreshIdx]);

  const maquiagem = useMemo(() => {
    if (!ocasiao) return null;
    return sugerirMaquiagem(profile?.subtom, profile?.paleta_sazonal, [], ocasiao);
  }, [ocasiao, profile]);

  const joias = useMemo(() => {
    if (!ocasiao) return null;
    return sugerirJoias(profile?.subtom, ocasiao);
  }, [ocasiao, profile]);

  const lookDoCloset = useMemo(() => {
    if (!ocasiao || pecas.length === 0) return null;
    const seed = `${user?.id}_estilo_${ocasiao}_v${refreshIdx}`;
    return sugerirLook(pecas, seed);
  }, [ocasiao, pecas, user, refreshIdx]);

  const escolherOcasiao = (o: Ocasiao) => {
    setOcasiao(o);
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
  };

  const novasSugestoes = () => {
    setRefreshIdx((i) => i + 1);
    setPenteadoEscolhido(null);
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
          <>
            <PageHeader
              eyebrow="Consultoria"
              title="Qual a ocasião?"
              subtitle="Vou montar um look completo pra você"
            />
            <div className="grid grid-cols-2 gap-3">
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
          </>
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
                <div className="grid grid-cols-3 gap-2">
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
                        className="aspect-square text-terracotta flex items-center justify-center"
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
                      {maquiagem.sombra.cores.map((c, i) => (
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
                    className="h-10 w-10 rounded-full shadow-sm shrink-0"
                    style={{ background: joias.metal_hex }}
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
