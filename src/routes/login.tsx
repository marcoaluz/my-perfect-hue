import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Entrar — Meu Tom Perfeito" }] }),
});

function Login() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-card">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="font-serif text-3xl">Meu Tom Perfeito</h1>
        <p className="text-sm text-muted-foreground mt-2">Entre para descobrir suas cores</p>
      </div>

      <form className="space-y-4">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@email.com" className="rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" placeholder="••••••••" className="rounded-xl mt-1.5" />
        </div>
        <Button asChild size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft">
          <Link to="/">Entrar</Link>
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" size="lg" className="w-full rounded-full">
        Continuar com Google
      </Button>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" className="text-terracotta font-medium">Cadastre-se</Link>
      </p>
    </div>
  );
}
