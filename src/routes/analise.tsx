import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ImageIcon, Sparkles, Sun } from "lucide-react";

export const Route = createFileRoute("/analise")({
  component: Analise,
  head: () => ({ meta: [{ title: "Análise — Meu Tom Perfeito" }] }),
});

type State = "intro" | "loading" | "result";

const matches = ["#C97B63", "#E8B4B8", "#D4AF8C", "#A8B5A0", "#8B5A3C"];
const avoids = ["#FF00FF", "#000080", "#C0C0C0", "#FFFF00", "#00FF00"];

function Analise() {
  const [state, setState] = useState<State>("intro");

  const start = () => {
    setState("loading");
    setTimeout(() => setState("result"), 2200);
  };

  return (
    <>
      <MobileShell>
        <PageHeader eyebrow="IA" title="Análise de subtom" subtitle="Sua paleta personalizada em segundos" />

        {state === "intro" && (
          <>
            <Card className="rounded-3xl p-6 mb-5 border-border/60 shadow-soft bg-gradient-soft">
              <div className="flex items-start gap-3 mb-4">
                <Sun className="h-5 w-5 text-terracotta mt-0.5" />
                <div>
                  <p className="font-medium">Como tirar a foto perfeita</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tire foto do seu pulso em local com luz natural, sem maquiagem ou filtros.
                  </p>
                </div>
              </div>
              <div className="aspect-video rounded-2xl bg-gradient-primary opacity-90 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary-foreground" strokeWidth={1.4} />
              </div>
            </Card>

            <div className="space-y-3">
              <Button size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft" onClick={start}>
                <Camera className="h-4 w-4" /> Tirar foto
              </Button>
              <Button size="lg" variant="outline" className="w-full rounded-full" onClick={start}>
                <ImageIcon className="h-4 w-4" /> Escolher da galeria
              </Button>
            </div>
          </>
        )}

        {state === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="h-32 w-32 rounded-full bg-gradient-primary animate-pulse" />
              <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-primary-foreground" />
            </div>
            <p className="font-serif text-xl">Analisando suas cores...</p>
            <p className="text-sm text-muted-foreground mt-2">Identificando subtom e paleta ✨</p>
          </div>
        )}

        {state === "result" && (
          <>
            <Card className="rounded-3xl p-6 mb-5 bg-gradient-primary border-0 text-primary-foreground shadow-card">
              <p className="text-xs uppercase tracking-[0.2em] opacity-90">Seu subtom</p>
              <h2 className="font-serif text-3xl mt-1">Quente · Outono</h2>
              <p className="text-sm opacity-90 mt-2">
                Tons terrosos, dourados e aconchegantes harmonizam com sua pele.
              </p>
            </Card>

            <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
              <p className="font-serif text-lg mb-3">Cores que te valorizam</p>
              <div className="flex gap-2">
                {matches.map((c) => (
                  <div key={c} className="flex-1 aspect-square rounded-2xl shadow-sm" style={{ background: c }} />
                ))}
              </div>
            </Card>

            <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
              <p className="font-serif text-lg mb-3">Cores para evitar</p>
              <div className="flex gap-2">
                {avoids.map((c) => (
                  <div key={c} className="flex-1 aspect-square rounded-2xl shadow-sm opacity-70" style={{ background: c }} />
                ))}
              </div>
            </Card>

            <Button className="w-full rounded-full" variant="outline" onClick={() => setState("intro")}>
              Refazer análise
            </Button>
          </>
        )}
      </MobileShell>
      <BottomNav />
    </>
  );
}
