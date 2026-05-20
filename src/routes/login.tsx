import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Entrar — Meu Tom Perfeito" }] }),
});

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const routeAfterLogin = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .maybeSingle();
    if (data?.onboarding_completed) navigate({ to: "/" });
    else navigate({ to: "/onboarding" });
  };

  useEffect(() => {
    if (user) routeAfterLogin(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.user) await routeAfterLogin(data.user.id);
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Erro ao entrar com Google");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <div className="relative mb-10 text-center">
        <div
          aria-hidden
          className="absolute inset-x-0 -top-8 mx-auto h-40 w-40 rounded-full bg-gradient-primary opacity-30 blur-3xl"
        />
        <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-card">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="relative font-serif text-3xl leading-tight">
          Descubra as cores que
          <br />
          <span className="italic text-terracotta">revelam sua melhor versão</span>
        </h1>
        <p className="relative text-sm text-muted-foreground mt-3">
          Entre pra continuar sua jornada de estilo ✨
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" className="rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" className="rounded-xl mt-1.5" />
        </div>
        <div className="text-right -mt-2">
          <Link to="/recuperar-senha" className="text-xs text-terracotta font-medium">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" disabled={loading} size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" size="lg" className="w-full rounded-full" onClick={onGoogle}>
        Continuar com Google
      </Button>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" className="text-terracotta font-medium">Cadastre-se</Link>
      </p>
    </div>
  );
}
