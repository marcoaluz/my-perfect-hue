import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro")({
  component: Cadastro,
  head: () => ({ meta: [{ title: "Cadastro — Meu Tom Perfeito" }] }),
});

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: { nome },
      },
    });
    if (signUpError) {
      setLoading(false);
      const msg = signUpError.message?.toLowerCase() ?? "";
      if (
        msg.includes("already registered") ||
        msg.includes("already exists") ||
        msg.includes("user already")
      ) {
        toast.error("Esse email já está cadastrado. Tente fazer login.");
      } else {
        toast.error(signUpError.message);
      }
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setLoading(false);
    if (signInError) {
      toast.error(signInError.message);
      return;
    }
    toast.success("Bem-vinda! Vamos começar ✨");
    navigate({ to: "/onboarding" });
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
        <h1 className="relative font-serif text-3xl leading-tight">Crie sua conta</h1>
        <p className="relative text-sm text-muted-foreground mt-3">
          Comece sua transformação de estilo ✨
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className="rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" className="rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" className="rounded-xl mt-1.5" />
        </div>
        <Button type="submit" disabled={loading} size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft mt-2">
          {loading ? "Criando..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
        Ao continuar, você concorda com nossos{" "}
        <Link to="/termos" className="text-terracotta font-medium">Termos de Uso</Link>{" "}
        e{" "}
        <Link to="/privacidade" className="text-terracotta font-medium">Política de Privacidade</Link>.
      </p>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="text-terracotta font-medium">Entrar</Link>
      </p>
    </div>
  );
}
