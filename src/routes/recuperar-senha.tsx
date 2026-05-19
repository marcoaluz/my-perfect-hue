import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/recuperar-senha")({
  component: RecuperarSenha,
  head: () => ({ meta: [{ title: "Recuperar senha — Meu Tom Perfeito" }] }),
});

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEnviado(true);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <Link to="/login" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-card">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="font-serif text-3xl">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {enviado
            ? "Enviamos um link para seu e-mail. Cheque sua caixa de entrada ✨"
            : "Digite seu e-mail para receber o link de recuperação"}
        </p>
      </div>

      {!enviado && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="rounded-xl mt-1.5"
            />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft">
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
        </form>
      )}

      {enviado && (
        <Button asChild size="lg" variant="outline" className="w-full rounded-full">
          <Link to="/login">Voltar pro login</Link>
        </Button>
      )}
    </div>
  );
}
