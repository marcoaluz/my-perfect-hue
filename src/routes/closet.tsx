import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, X } from "lucide-react";

export const Route = createFileRoute("/closet")({
  component: Closet,
  head: () => ({ meta: [{ title: "Closet — Meu Tom Perfeito" }] }),
});

const items = [
  { name: "Blusa terracota", cat: "Blusas", color: "#C97B63", match: true },
  { name: "Vestido nude", cat: "Vestidos", color: "#F5E6E0", match: true },
  { name: "Calça preta", cat: "Calças", color: "#2C2C2C", match: false },
  { name: "Saia champagne", cat: "Saias", color: "#D4AF8C", match: true },
  { name: "Camisa rosa", cat: "Blusas", color: "#E8B4B8", match: true },
  { name: "Sandália sage", cat: "Sapatos", color: "#A8B5A0", match: true },
  { name: "Jaqueta azul", cat: "Casacos", color: "#1E3A8A", match: false },
  { name: "Lenço dourado", cat: "Acessórios", color: "#D4AF8C", match: true },
];

const filters = ["Todas", "Combina", "Não combina"] as const;
const cats = ["Todas", "Blusas", "Calças", "Vestidos", "Sapatos", "Acessórios"];

function Closet() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [cat, setCat] = useState("Todas");

  const filtered = items.filter((i) => {
    if (filter === "Combina" && !i.match) return false;
    if (filter === "Não combina" && i.match) return false;
    if (cat !== "Todas" && i.cat !== cat) return false;
    return true;
  });

  return (
    <>
      <MobileShell>
        <PageHeader eyebrow="Guarda-roupa" title="Meu closet" subtitle={`${filtered.length} peças`} />

        <div className="flex gap-2 mb-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-all ${
                filter === f ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition-all ${
                cat === c ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((i) => (
            <Card key={i.name} className="rounded-2xl p-3 border-border/60 shadow-soft hover:scale-[1.02] transition-transform">
              <div className="aspect-square rounded-xl mb-3" style={{ background: i.color }} />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium leading-tight">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.cat}</p>
                </div>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${i.match ? "bg-sage/30 text-sage" : "bg-destructive/15 text-destructive"}`}>
                  {i.match ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </MobileShell>

      <Button
        size="icon"
        className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-gradient-primary shadow-card"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <BottomNav />
    </>
  );
}
