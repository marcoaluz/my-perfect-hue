import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Wand2,
  Shirt,
  Camera,
  Heart,
  Zap,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/premium")({
  component: Premium,
  head: () => ({
    meta: [
      { title: "Premium — Meu Tom Perfeito" },
      {
        name: "description",
        content: "Desbloqueie análise ilimitada, closet sem limites, consultoria de estilo completa e recursos de IA generativa.",
      },
    ],
  }),
});

const BENEFICIOS_FREE = [
  "Análise de subtom ilimitada",
  "Closet até 15 peças",
  "1 consulta de estilo por semana",
  "1 look do dia",
];

const BENEFICIOS_PREMIUM = [
  "Análise de subtom ilimitada",
  "Closet ilimitado",
  "Consultas de estilo ilimitadas",
  "Looks ilimitados",
  "Catálogo de produtos com indicações",
  "Histórico completo de análises",
  "Sem anúncios",
];

const BENEFICIOS_EM_BREVE = [
  "✨ Veja como cada penteado fica em você — com sua cor de cabelo real",
  "👗 Experimente roupas virtualmente (IA)",
  "🎯 Score de harmonia do seu look",
];

const DEPOIMENTOS = [
  {
    nome: "Ana Paula, 28",
    texto:
      "Finalmente entendi por que algumas roupas me deixam mais bonita! A análise de cores mudou minha forma de me vestir.",
  },
  {
    nome: "Camila, 34",
    texto:
      "A consultoria de estilo é incrível. Recebi sugestões de penteado que nunca teria pensado e ficaram perfeitas!",
  },
  {
    nome: "Renata, 41",
    texto:
      "Uso todos os dias pra montar meu look. Economizei muito tempo e parei de errar nas compras.",
  },
];

const PREMIUM_ICONS = [Shirt, Camera, Wand2, Heart];

export default function Premium() {
  return (
    <MobileShell>
      <header className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <span className="text-xs font-medium uppercase tracking-wider text-terracotta">
          Premium
        </span>
      </header>

      <Card className="relative overflow-hidden rounded-3xl border-0 bg-gradient-primary p-6 text-primary-foreground shadow-card mb-6">
        <div
          aria-hidden
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative">
          <div className="mb-3 flex gap-2">
            {PREMIUM_ICONS.map((Icon, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
          <h1 className="font-serif text-3xl leading-tight mb-2">
            Meu Tom Premium
          </h1>
          <p className="text-sm opacity-90 mb-5">
            Desbloqueie o potencial completo da sua consultoria de estilo pessoal.
          </p>

          <Button
            disabled
            className="relative w-full rounded-full bg-white text-foreground hover:bg-white/90 disabled:opacity-80"
          >
            <Sparkles className="h-4 w-4" />
            Experimentar 7 dias grátis
          </Button>
          <p className="mt-3 text-center text-xs opacity-80">
            Depois, apenas R$ 14,90/mês ou R$ 119/ano
          </p>
          <p className="mt-1 text-center text-[11px] opacity-70">
            Cancele quando quiser · Sem burocracia
          </p>
        </div>
      </Card>

      <Card className="rounded-3xl p-5 border-border/60 shadow-soft mb-6 bg-lilac/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lilac/20">
            <Zap className="h-4 w-4 text-lilac" />
          </span>
          <p className="text-sm font-medium text-lilac">Em breve no Premium</p>
        </div>
        <h2 className="font-serif text-xl mb-2">IA Generativa</h2>
        <ul className="space-y-2">
          {BENEFICIOS_EM_BREVE.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-lilac">➜</span>
              <span className="text-muted-foreground">{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-2xl p-4 bg-lilac/10 border border-lilac/20">
          <p className="text-xs text-muted-foreground leading-relaxed">
            🪄 Nossa IA vai fotografar virtualmente o penteado escolhido
            em você, respeitando sua cor natural, textura e formato de rosto.
            Como ter uma consultora de imagem no seu bolso.
          </p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Assinantes Premium terão acesso antecipado quando lançar ✨
        </p>
      </Card>

      <div className="mb-6">
        <h2 className="font-serif text-xl mb-4">O que está incluído</h2>
        <div className="grid gap-3">
          <Card className="rounded-2xl p-5 border-border/60 shadow-soft bg-secondary/30">
            <h3 className="font-medium mb-3">Free</h3>
            <ul className="space-y-2">
              {BENEFICIOS_FREE.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-terracotta shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-2xl p-5 border-lilac/40 bg-lilac/5 shadow-card border-2">
            <h3 className="font-medium mb-3 text-lilac">Premium ✨</h3>
            <ul className="space-y-2">
              {BENEFICIOS_PREMIUM.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-terracotta shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-serif text-xl mb-4">O que dizem por aí</h2>
        <div className="space-y-3">
          {DEPOIMENTOS.map((d) => (
            <Card
              key={d.nome}
              className="rounded-2xl p-4 border-border/60 shadow-soft"
            >
              <p className="text-sm italic text-muted-foreground mb-2">
                "{d.texto}"
              </p>
              <p className="text-xs font-medium">— {d.nome}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <Button
          disabled
          className="w-full rounded-full bg-gradient-primary text-primary-foreground disabled:opacity-80"
        >
          <Sparkles className="h-4 w-4" />
          Experimentar 7 dias grátis ✨
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Pagamento em breve disponível via Pix e cartão 💳
        </p>
        <Button asChild variant="secondary" className="w-full rounded-full">
          <Link to="/">Continuar com o plano gratuito</Link>
        </Button>
      </div>

      <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        Pagamento 100% seguro · Cancele quando quiser
      </p>
    </MobileShell>
  );
}
