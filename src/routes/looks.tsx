import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Heart } from "lucide-react";

export const Route = createFileRoute("/looks")({
  component: Looks,
  head: () => ({ meta: [{ title: "Looks — Meu Tom Perfeito" }] }),
});

const lookSets = [
  ["#C97B63", "#F5E6E0", "#D4AF8C"],
  ["#E8B4B8", "#FAF7F5", "#A8B5A0"],
  ["#D4AF8C", "#2C2C2C", "#F5E6E0"],
];
const history = [
  { name: "Brunch de domingo", date: "Ontem", colors: ["#E8B4B8", "#F5E6E0"] },
  { name: "Reunião de trabalho", date: "3 dias", colors: ["#2C2C2C", "#D4AF8C"] },
  { name: "Passeio à tarde", date: "1 sem", colors: ["#A8B5A0", "#FAF7F5"] },
];

function Looks() {
  const [idx, setIdx] = useState(0);
  const look = lookSets[idx];

  return (
    <>
      <MobileShell>
        <PageHeader eyebrow="Inspiração" title="Seus looks" />

        <Tabs defaultValue="hoje">
          <TabsList className="w-full bg-secondary rounded-full p-1 mb-5">
            <TabsTrigger value="hoje" className="flex-1 rounded-full">Hoje</TabsTrigger>
            <TabsTrigger value="historico" className="flex-1 rounded-full">Histórico</TabsTrigger>
            <TabsTrigger value="favoritos" className="flex-1 rounded-full">Favoritos</TabsTrigger>
          </TabsList>

          <TabsContent value="hoje">
            <Card className="rounded-3xl p-6 mb-4 border-border/60 shadow-card bg-gradient-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-terracotta/80">Look do dia</p>
              <h2 className="font-serif text-2xl mt-1 mb-4">Elegância terrosa</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {look.map((c, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl shadow-sm" style={{ background: c }} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Camadas em tons quentes que valorizam seu subtom outono.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setIdx((idx + 1) % lookSets.length)} className="flex-1 rounded-full bg-gradient-primary">
                  <RefreshCw className="h-4 w-4" /> Outra sugestão
                </Button>
                <Button size="icon" variant="outline" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="historico">
            <div className="space-y-3">
              {history.map((h) => (
                <Card key={h.name} className="rounded-2xl p-4 flex items-center gap-4 border-border/60 shadow-soft">
                  <div className="flex gap-1">
                    {h.colors.map((c) => (
                      <div key={c} className="h-12 w-8 rounded-lg" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.date}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favoritos">
            <div className="text-center py-12 text-muted-foreground text-sm">
              Você ainda não favoritou nenhum look ✨
            </div>
          </TabsContent>
        </Tabs>
      </MobileShell>
      <BottomNav />
    </>
  );
}
