import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Heart } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/looks")({
  component: Looks,
  head: () => ({ meta: [{ title: "Looks — Meu Tom Perfeito" }] }),
});

const lookSets = [
  ["#C97B63", "#F5E6E0", "#D4AF8C"],
  ["#E8B4B8", "#FAF7F5", "#A8B5A0"],
  ["#D4AF8C", "#2C2C2C", "#F5E6E0"],
];

function Looks() {
  const { user, loading } = useRequireAuth();
  const qc = useQueryClient();
  const [idx, setIdx] = useState(0);
  const look = lookSets[idx];

  const { data: history = [] } = useQuery({
    queryKey: ["looks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("looks")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const salvar = async (favorito: boolean) => {
    const { error } = await supabase.from("looks").insert({
      user_id: user!.id,
      pecas: [],
      ocasiao: "Sugestão do dia",
      favorito,
    });
    if (error) return toast.error(error.message);
    toast.success(favorito ? "Salvo nos favoritos ❤️" : "Look registrado");
    qc.invalidateQueries({ queryKey: ["looks"] });
  };

  if (loading || !user) return null;

  const favoritos = history.filter((h) => h.favorito);

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
              <div className="flex gap-2">
                <Button onClick={() => { setIdx((idx + 1) % lookSets.length); salvar(false); }} className="flex-1 rounded-full bg-gradient-primary">
                  <RefreshCw className="h-4 w-4" /> Outra sugestão
                </Button>
                <Button onClick={() => salvar(true)} size="icon" variant="outline" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="historico">
            {history.length === 0 ? (
              <p className="text-center py-12 text-sm text-muted-foreground">Nenhum look registrado ainda.</p>
            ) : (
              <div className="space-y-3">
                {history.map((h) => (
                  <Card key={h.id} className="rounded-2xl p-4 flex items-center gap-4 border-border/60 shadow-soft">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{h.ocasiao || "Look"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(h.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    {h.favorito && <Heart className="h-4 w-4 text-rose-dust fill-current" />}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favoritos">
            {favoritos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Você ainda não favoritou nenhum look ✨
              </div>
            ) : (
              <div className="space-y-3">
                {favoritos.map((h) => (
                  <Card key={h.id} className="rounded-2xl p-4 flex items-center gap-4 border-border/60 shadow-soft">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary" />
                    <p className="flex-1 font-medium text-sm">{h.ocasiao || "Look favorito"}</p>
                    <Heart className="h-4 w-4 text-rose-dust fill-current" />
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </MobileShell>
      <BottomNav />
    </>
  );
}
