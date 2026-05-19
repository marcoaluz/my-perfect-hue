import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/redefinir-senha")({
  component: RedefinirSenha,
  head: () => ({ meta: [{ title: "Redefinir senha — Meu Tom Perfeito" }] }),
});

function RedefinirSenha() {
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < 6) {
      toast.error("A senha precisa ter ao menos 6 caracteres");
      return;
    }
    if (senha !== confirma) {
      toast.error("As senhas não coincidem");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Senha alterada com sucesso ✨");
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-card">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="font-serif text-3xl">Nova senha</h1>
        <p className="text-sm text-muted-foreground mt-2">Defina uma senha forte</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="senha">Nova senha</Label>
          <Input
            id="senha"
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="rounded-xl mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="confirma">Confirmar senha</Label>
          <Input
            id="confirma"
            type="password"
            required
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            className="rounded-xl mt-1.5"
          />
        </div>
        <Button type="submit" disabled={loading} size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft">
          {loading ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}
