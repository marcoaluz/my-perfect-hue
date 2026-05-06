import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/cadastro")({
  component: Cadastro,
  head: () => ({ meta: [{ title: "Cadastro — Meu Tom Perfeito" }] }),
});

function Cadastro() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl">Crie sua conta</h1>
        <p className="text-sm text-muted-foreground mt-1">Leva menos de um minuto ✨</p>
      </div>

      <form className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" placeholder="Seu nome" className="rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@email.com" className="rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" placeholder="••••••••" className="rounded-xl mt-1.5" />
        </div>
        <Button asChild size="lg" className="w-full rounded-full bg-gradient-primary shadow-soft mt-2">
          <Link to="/onboarding">Criar conta</Link>
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="text-terracotta font-medium">Entrar</Link>
      </p>
    </div>
  );
}
