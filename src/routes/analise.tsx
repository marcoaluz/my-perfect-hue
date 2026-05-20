import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ImageIcon, Sparkles, Sun, ArrowRight, Check } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SkinPicker } from "@/components/SkinPicker";
import { analyzeRegion, type SubtomResult } from "@/lib/skin-analyzer";

function LoadingScan() {
  const [stage, setStage] = useState(0);
  const stages = [
    "Analisando pele",
    "Detectando subtom",
    "Avaliando contraste",
    "Montando paleta",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s < stages.length - 1 ? s + 1 : s));
    }, 600);
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-8 h-32 w-32">
        <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-primary opacity-40 blur-2xl animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-gradient-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-primary-foreground" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-terracotta/40 animate-ping"
          style={{ animationDuration: "1.8s" }}
        />
        <div
          aria-hidden
          className="absolute -inset-2 rounded-full border border-terracotta/30 animate-ping"
          style={{ animationDuration: "2.4s" }}
        />
      </div>

      <h2 className="font-serif text-xl mb-6">Analisando suas cores...</h2>

      <ul className="space-y-2.5 text-left">
        {stages.map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span className="flex h-6 w-6 items-center justify-center shrink-0">
              {i < stage ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage/30 text-sage">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              ) : i === stage ? (
                <span className="h-3 w-3 rounded-full bg-terracotta animate-pulse" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
              )}
            </span>
            <span
              className={
                i < stage
                  ? "text-foreground"
                  : i === stage
                  ? "text-terracotta font-medium"
                  : "text-muted-foreground"
              }
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Route = createFileRoute("/analise")({
  component: Analise,
  head: () => ({ meta: [{ title: "Análise — Meu Tom Perfeito" }] }),
});

type Step = "intro" | "picker" | "loading" | "result";

function Analise() {
  const { user, loading } = useRequireAuth();
  const qc = useQueryClient();
  const [step, setStep] = useState<Step>("intro");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [region, setRegion] = useState<{ canvas: HTMLCanvasElement; cx: number; cy: number; radius: number } | null>(null);
  const [result, setResult] = useState<SubtomResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File | null) => {
    if (!f) return;
    setImageFile(f);
    setImageUrl(URL.createObjectURL(f));
    setStep("picker");
  };

  const analisar = async () => {
    if (!region || !user) return;
    setStep("loading");
    try {
      // pequeno delay para a animação
      await new Promise((r) => setTimeout(r, 900));
      const r = analyzeRegion(region.canvas, region.cx, region.cy, region.radius);
      setResult(r);

      // upload opcional da foto
      let foto_url: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("fotos").upload(path, imageFile, { upsert: true });
        if (!upErr) foto_url = path;
      }

      const { error } = await supabase.from("analises").insert({
        user_id: user.id,
        foto_url,
        subtom_detectado: r.subtom,
        paleta: {
          sazonal: r.paleta_sazonal,
          estacao: r.estacao,
          profundidade: r.profundidade,
          cores: r.cores_que_combinam,
          evitar: r.cores_a_evitar,
          rgb: r.rgb,
          lab: r.lab,
          hsv: r.hsv,
        },
        confianca: r.confianca,
      });
      if (error) throw error;

      await supabase
        .from("profiles")
        .update({ subtom: r.subtom, paleta_sazonal: r.paleta_sazonal })
        .eq("id", user.id);

      qc.invalidateQueries();
      setStep("result");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível concluir a análise.");
      setStep("picker");
    }
  };

  const reset = () => {
    setStep("intro");
    setImageUrl(null);
    setImageFile(null);
    setRegion(null);
    setResult(null);
  };

  if (loading || !user) return null;

  return (
    <>
      <MobileShell>
        <PageHeader eyebrow="IA local" title="Análise de subtom" subtitle="100% no seu dispositivo, sem enviar dados" />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />

        {step === "intro" && (
          <>
            <Card className="rounded-3xl p-6 mb-5 border-border/60 shadow-soft bg-gradient-soft">
              <div className="flex items-start gap-3 mb-4">
                <Sun className="h-5 w-5 text-terracotta mt-0.5" />
                <div>
                  <p className="font-medium">Como tirar a foto perfeita</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Foto do pulso ou bochecha em luz natural, sem maquiagem ou filtros.
                  </p>
                </div>
              </div>
              <div className="aspect-video rounded-2xl bg-gradient-primary opacity-90 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary-foreground" strokeWidth={1.4} />
              </div>
            </Card>

            <div className="space-y-3">
              <Button size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft" onClick={() => fileRef.current?.click()}>
                <Camera className="h-4 w-4" /> Tirar foto
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full" onClick={() => fileRef.current?.click()}>
                <ImageIcon className="h-4 w-4" /> Escolher da galeria
              </Button>
            </div>
          </>
        )}

        {step === "picker" && imageUrl && (
          <>
            <Card className="rounded-3xl p-4 mb-4 border-border/60 shadow-soft">
              <p className="text-sm text-muted-foreground mb-3">
                Arraste o círculo até a área da pele e ajuste o tamanho.
              </p>
              <SkinPicker imageUrl={imageUrl} onChange={setRegion} />
            </Card>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-full" onClick={reset}>Trocar foto</Button>
              <Button className="flex-1 rounded-full bg-gradient-primary shadow-soft" onClick={analisar}>
                Analisar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="h-32 w-32 rounded-full bg-gradient-primary animate-pulse" />
              <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-primary-foreground" />
            </div>
            <p className="font-serif text-xl">Analisando suas cores...</p>
            <p className="text-sm text-muted-foreground mt-2">Identificando subtom e paleta ✨</p>
          </div>
        )}

        {step === "result" && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="rounded-3xl p-6 mb-5 bg-gradient-primary border-0 text-primary-foreground shadow-card">
              <p className="text-xs uppercase tracking-[0.2em] opacity-90">Seu subtom</p>
              <h2 className="font-serif text-3xl mt-1">{result.paleta_sazonal}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1 text-xs capitalize">
                  Profundidade: {result.profundidade}
                </span>
                <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1 text-xs capitalize">
                  {result.estacao}
                </span>
              </div>
              <p className="text-sm opacity-90 mt-3 capitalize">
                {result.subtom.replace("_", " · ")} — confiança {Math.round(result.confianca * 100)}%
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs opacity-90">
                <span className="h-6 w-6 rounded-full border border-white/40" style={{ background: `rgb(${result.rgb.r},${result.rgb.g},${result.rgb.b})` }} />
                Tom médio detectado na pele
              </div>
              <p className="text-xs opacity-75 mt-2">
                L*={result.lab.L} · a*={result.lab.a} · b*={result.lab.b}
              </p>
            </Card>

            <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
              <p className="font-serif text-lg mb-3">Cores que te valorizam</p>
              <div className="flex gap-2">
                {result.cores_que_combinam.map((c) => (
                  <div key={c} className="flex-1 aspect-square rounded-2xl shadow-sm" style={{ background: c }} />
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
              <p className="font-serif text-lg mb-3">Cores para evitar</p>
              <div className="flex gap-2">
                {result.cores_a_evitar.map((c) => (
                  <div key={c} className="flex-1 aspect-square rounded-2xl shadow-sm opacity-70" style={{ background: c }} />
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl p-5 mb-4 bg-secondary/40 border-border/40">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 Esta é uma análise por algoritmo de visão computacional. A iluminação do ambiente influencia o resultado — para máxima precisão, refaça em luz natural. Para análise ainda mais detalhada, em breve teremos o plano Premium com IA avançada.
              </p>
            </Card>

            <Button className="w-full rounded-full" variant="outline" onClick={reset}>
              Refazer análise
            </Button>
          </div>
        )}
      </MobileShell>
      <BottomNav />
    </>
  );
}
