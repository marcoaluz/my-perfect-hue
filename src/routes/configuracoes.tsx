import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  component: Configuracoes,
  head: () => ({ meta: [{ title: "Configurações — Meu Tom Perfeito" }] }),
});

function Configuracoes() {
  const { user, loading } = useRequireAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
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

  useEffect(() => {
    if (profile?.nome) setNome(profile.nome);
  }, [profile]);

  const salvar = async () => {
    if (!user) return;
    if (!nome.trim()) {
      toast.error("O nome não pode ficar vazio");
      return;
    }
    setSalvando(true);
    const { error } = await supabase
      .from("profiles")
      .update({ nome: nome.trim() })
      .eq("id", user.id);
    setSalvando(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Nome atualizado ✨");
    qc.invalidateQueries({ queryKey: ["profile"] });
  };

  if (loading || !user) return null;

  return (
    <>
      <MobileShell>
        <Link to="/perfil" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Perfil
        </Link>

        <h1 className="font-serif text-3xl mb-6">Configurações</h1>

        <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
          <h2 className="font-serif text-lg mb-4">Dados pessoais</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="rounded-xl mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={user.email || ""} disabled className="rounded-xl mt-1.5 opacity-60" />
              <p className="text-xs text-muted-foreground mt-1.5">O e-mail não pode ser alterado.</p>
            </div>
            <Button onClick={salvar} disabled={salvando} className="w-full rounded-full bg-gradient-primary">
              {salvando ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </Card>

        <Card className="rounded-3xl p-5 border-destructive/30 shadow-soft">
          <h2 className="font-serif text-lg mb-3 text-destructive">Zona de perigo</h2>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Ao excluir sua conta, todos os seus dados (análises, peças, looks) serão removidos permanentemente.
            Esta ação não pode ser desfeita.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/excluir-conta" })}
            className="w-full rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            Excluir minha conta
          </Button>
        </Card>
      </MobileShell>
      <BottomNav />
    </>
  );
}
