import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Heart, Shirt, Sparkles } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  sugerirLook,
  avaliarClosetParaLook,
  type Peca,
} from "@/lib/look-suggester";

export const Route = createFileRoute("/looks")({
  component: Looks,
  head: () => ({ meta: [{ title: "Looks — Meu Tom Perfeito" }] }),
});

function Looks() {
  const { user, loading } = useRequireAuth();
  const qc = useQueryClient();
  const [refreshIdx, setRefreshIdx] = useState(0);

  const { data: pecas = [] } = useQuery({
    queryKey: ["pecas", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pecas_roupa")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data as Peca[];
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ["looks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("looks")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const dayIndex = Math.floor(Date.now() / 86400000);
  const seed = `${user?.id || "anon"}_day${dayIndex}_v${refreshIdx}`;

  const avaliacao = useMemo(() => avaliarClosetParaLook(pecas), [pecas]);
  const sugestao = useMemo(() => {
    if (!avaliacao.ok) return null;
    return sugerirLook(pecas, seed);
  }, [pecas, seed, avaliacao]);

  const novaSugestao = () => setRefreshIdx((i) => i + 1);

  const salvar = async (favorito: boolean) => {
    if (!sugestao || !user) return;
    const { error } = await supabase.from("looks").insert({
      user_id: user.id,
      pecas: sugestao.pecas.map((p) => p.id),
      ocasiao: "Sugestão do dia",
      favorito,
    });
    if (error) return toast.error(error.message);
    toast.success(favorito ? "Salvo nos favoritos ❤️" : "Look registrado ✨");
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
            <TabsTrigger value="hoje" className="flex-1 rounded-full">
              Hoje
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="flex-1 rounded-full">
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hoje">
            {!avaliacao.ok ? (
              <Card className="rounded-3xl p-8 text-center border-border/60 shadow-soft">
                <Shirt className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-serif text-xl mb-2">Closet incompleto</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {avaliacao.motivo}
                </p>
                <p className="text-sm text-muted-foreground mb-5">
                  {avaliacao.sugestao}
                </p>
                <Button
                  asChild
                  className="rounded-full bg-gradient-primary"
                >
                  <Link to="/closet">Ir pro closet</Link>
                </Button>
              </Card>
            ) : sugestao ? (
              <>
                <Card className="rounded-3xl p-6 mb-4 border-border/60 shadow-card bg-gradient-soft">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-terracotta/80 capitalize">
                        {new Date().toLocaleDateString("pt-BR", {
                          weekday: "long",
                        })}
                      </p>
                      <h2 className="font-serif text-2xl mt-1">
                        Combinação selecionada
                      </h2>
                    </div>
                    <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-foreground/70">
                      ✨ {Math.round(sugestao.score * 100)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {sugestao.pecas.map((p) => (
                      <div key={p.id} className="space-y-1.5">
                        <div className="aspect-[3/4] rounded-2xl shadow-sm overflow-hidden relative">
                          {p.foto_url ? (
                            <img
                              src={p.foto_url}
                              alt={p.categoria}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full"
                              style={{ background: p.cor_hex || "#E8B4B8" }}
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {p.categoria}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={novaSugestao}
                      className="flex-1 rounded-full bg-gradient-primary"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Outra sugestão
                    </Button>
                    <Button
                      onClick={() => salvar(true)}
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                <Card className="rounded-3xl p-5 bg-secondary/40 border-border/40">
                  <p className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-terracotta" />
                    Esta combinação foi escolhida pra valorizar seu subtom.
                    Toque em "Outra sugestão" pra ver outras opções.
                  </p>
                </Card>
              </>
            ) : (
              <p className="text-center py-12 text-sm text-muted-foreground">
                Sem looks possíveis no momento.
              </p>
            )}
          </TabsContent>

          <TabsContent value="favoritos">
            {favoritos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <Heart className="h-8 w-8 mx-auto mb-3 opacity-40" />
                Você ainda não tem looks favoritos. Toque no ❤️ pra salvar!
              </div>
            ) : (
              <div className="space-y-3">
                {favoritos.map((look) => (
                  <Card
                    key={look.id}
                    className="rounded-2xl p-4 flex items-center gap-4 border-border/60 shadow-soft"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {look.ocasiao || "Look"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(look.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
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
