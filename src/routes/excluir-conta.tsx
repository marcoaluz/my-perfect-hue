import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/excluir-conta")({
  component: ExcluirConta,
  head: () => ({ meta: [{ title: "Excluir conta — Meu Tom Perfeito" }] }),
});

function ExcluirConta() {
  const { user, loading } = useRequireAuth();
  const navigate = useNavigate();
  const [confirmacao, setConfirmacao] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  const excluir = async () => {
    if (confirmacao !== "EXCLUIR") {
      toast.error("Digite EXCLUIR para confirmar");
      return;
    }

    setExcluindo(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão não encontrada");

      const { data, error } = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await supabase.auth.signOut();
      toast.success("Conta excluída. Até a próxima ✨");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error("Erro: " + (err.message || "tente novamente"));
      setExcluindo(false);
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <MobileShell>
        <Link to="/configuracoes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <Card className="rounded-3xl p-5 mb-4 border-destructive/30 shadow-soft">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h1 className="font-serif text-2xl">Excluir conta</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Esta ação é permanente e não pode ser desfeita.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
          <h2 className="font-serif text-base mb-3">O que será excluído:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Seu perfil ({user.email})</li>
            <li>• Todas as suas análises de subtom</li>
            <li>• Todas as peças do seu closet</li>
            <li>• Todos os looks salvos</li>
            <li>• Todas as fotos enviadas</li>
          </ul>
        </Card>

        <Card className="rounded-3xl p-5 mb-4 border-border/60 shadow-soft">
          <Label htmlFor="confirmacao">Digite EXCLUIR para confirmar:</Label>
          <Input
            id="confirmacao"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            placeholder="EXCLUIR"
            className="rounded-xl mt-1.5"
          />
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/configuracoes" })}
            className="flex-1 rounded-full"
          >
            Cancelar
          </Button>
          <Button
            onClick={excluir}
            disabled={excluindo || confirmacao !== "EXCLUIR"}
            className="flex-1 rounded-full bg-destructive hover:bg-destructive/90"
          >
            {excluindo ? "Excluindo..." : "Excluir conta"}
          </Button>
        </div>
      </MobileShell>
    </>
  );
}
