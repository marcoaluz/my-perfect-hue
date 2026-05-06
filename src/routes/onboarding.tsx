import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Shirt } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const slides = [
  {
    icon: Palette,
    title: "Descubra suas cores perfeitas",
    text: "Em apenas 30 segundos identificamos seu subtom de pele com inteligência artificial.",
  },
  {
    icon: Shirt,
    title: "Seu guarda-roupa virtual",
    text: "Monte um closet com peças que realmente valorizam seu tom natural.",
  },
  {
    icon: Sparkles,
    title: "Looks todos os dias",
    text: "Receba sugestões personalizadas combinando suas peças favoritas.",
  },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <div className="flex justify-end">
        <Link to="/" className="text-sm text-muted-foreground">Pular</Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-10 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-primary shadow-card">
          <Icon className="h-16 w-16 text-primary-foreground" strokeWidth={1.4} />
        </div>
        <h1 className="font-serif text-3xl leading-tight mb-3">{slide.title}</h1>
        <p className="text-muted-foreground max-w-xs">{slide.text}</p>
      </div>
      <div className="mb-8 flex justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-terracotta" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
      <Button
        size="lg"
        className="rounded-full bg-gradient-primary shadow-soft"
        onClick={() => (isLast ? navigate({ to: "/analise" }) : setStep(step + 1))}
      >
        {isLast ? "Começar análise" : "Continuar"}
      </Button>
    </div>
  );
}
