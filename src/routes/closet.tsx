import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, X } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { corCombinaComSubtom } from "@/lib/color-matcher";

export const Route = createFileRoute("/closet")({
  component: Closet,
  head: () => ({ meta: [{ title: "Closet — Meu Tom Perfeito" }] }),
});

const filters = ["Todas", "Combina", "Não combina"] as const;
const cats = ["Todas", "Blusas", "Calças", "Vestidos", "Sapatos", "Acessórios"];

function Closet() {
  const { user, profile, loading } = useRequireAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [cat, setCat] = useState("Todas");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ categoria: "Blusas", cor_hex: "#C97B63" });

  const { data: items = [] } = useQuery({
    queryKey: ["pecas", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pecas_roupa")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = items.filter((i) => {
    if (filter === "Combina" && !i.combina_com_subtom) return false;
    if (filter === "Não combina" && i.combina_com_subtom) return false;
    if (cat !== "Todas" && i.categoria !== cat) return false;
    return true;
  });

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("pecas_roupa").insert({
      user_id: user!.id,
      categoria: form.categoria,
      cor_hex: form.cor_hex,
      combina_com_subtom: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Peça adicionada ✨");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["pecas"] });
  };

  if (loading || !user) return null;

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

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            Seu closet está vazio. Toque em + para adicionar uma peça ✨
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((i) => (
              <Card key={i.id} className="rounded-2xl p-3 border-border/60 shadow-soft hover:scale-[1.02] transition-transform">
                <div className="aspect-square rounded-xl mb-3" style={{ background: i.cor_hex || "#E8B4B8" }} />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium leading-tight">{i.categoria}</p>
                    <p className="text-xs text-muted-foreground">{i.cor_hex}</p>
                  </div>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${i.combina_com_subtom ? "bg-sage/30 text-sage" : "bg-destructive/15 text-destructive"}`}>
                    {i.combina_com_subtom ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </MobileShell>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-gradient-primary shadow-card">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Nova peça</DialogTitle>
          </DialogHeader>
          <form onSubmit={adicionar} className="space-y-4">
            <div>
              <Label>Categoria</Label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {cats.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input id="cor" type="color" value={form.cor_hex} onChange={(e) => setForm({ ...form, cor_hex: e.target.value })} className="rounded-xl mt-1.5 h-12" />
            </div>
            <Button type="submit" className="w-full rounded-full bg-gradient-primary">Adicionar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
