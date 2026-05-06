import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Camera, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Início — Meu Tom Perfeito" },
      { name: "description", content: "Seu painel personalizado de cores, looks e descobertas." },
    ],
  }),
});

const palette = ["#C97B63", "#E8B4B8", "#D4AF8C", "#A8B5A0", "#F5E6E0"];
const products = [
  { name: "Blusa de seda terracota", brand: "Animale" },
  { name: "Batom nude rosé", brand: "Natura" },
  { name: "Lenço champagne", brand: "Farm" },
];

function Dashboard() {
  const name = "Marina";
  return (
    <>
      <MobileShell>
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Bom dia,</p>
            <h1 className="font-serif text-2xl">{name} ✨</h1>
          </div>
          <div className="h-11 w-11 rounded-full bg-gradient-primary shadow-soft" />
        </header>

        <Card className="bg-gradient-primary border-0 text-primary-foreground p-6 rounded-3xl shadow-card mb-5">
          <p className="text-xs uppercase tracking-[0.18em] opacity-90 mb-2">Sua análise</p>
          <h2 className="font-serif text-2xl leading-tight mb-4">
            Descubra suas cores em 30 segundos
          </h2>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/analise">
              <Camera className="h-4 w-4" /> Fazer minha análise
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
            {["from-[#C97B63] to-[#E8B4B8]", "from-[#D4AF8C] to-[#F5E6E0]", "from-[#A8B5A0] to-[#F5E6E0]"].map((g, i) => (
              <div key={i} className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${g}`} />
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl p-5 mb-5 border-border/60 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg">Sua paleta</h3>
            <span className="text-xs text-muted-foreground">Outono quente</span>
          </div>
          <div className="flex gap-2">
            {palette.map((c) => (
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
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-soft border border-border" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.brand}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </MobileShell>
      <BottomNav />
    </>
  );
}
