import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Palette, Shirt, User } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

type FormatoOpt = "oval" | "redondo" | "quadrado" | "coracao" | "alongado";
type ComprimentoOpt = "curto" | "medio" | "longo";
type TexturaOpt = "liso" | "ondulado" | "cacheado" | "crespo";

const slides = [
  {
    icon: Palette,
    title: "Descubra suas cores perfeitas",
    text: "Em apenas 30 segundos identificamos seu subtom de pele com inteligência artificial.",
    isForm: false,
  },
  {
    icon: Shirt,
    title: "Seu guarda-roupa virtual",
    text: "Monte um closet com peças que realmente valorizam seu tom natural.",
    isForm: false,
  },
  {
    icon: Sparkles,
    title: "Looks todos os dias",
    text: "Receba sugestões personalizadas combinando suas peças favoritas.",
    isForm: false,
  },
  {
    icon: User,
    title: "Sobre você",
    text: "Responda rápido pra deixar tudo personalizado",
    isForm: true,
  },
];

const FORMATOS: { label: string; value: FormatoOpt | null }[] = [
  { label: "Oval", value: "oval" },
  { label: "Redondo", value: "redondo" },
  { label: "Quadrado", value: "quadrado" },
  { label: "Coração", value: "coracao" },
  { label: "Alongado", value: "alongado" },
  { label: "Não sei", value: null },
];

const COMPRIMENTOS: { label: string; value: ComprimentoOpt }[] = [
  { label: "Curto", value: "curto" },
  { label: "Médio", value: "medio" },
  { label: "Longo", value: "longo" },
];

const TEXTURAS: { label: string; value: TexturaOpt }[] = [
  { label: "Liso", value: "liso" },
  { label: "Ondulado", value: "ondulado" },
  { label: "Cacheado", value: "cacheado" },
  { label: "Crespo", value: "crespo" },
];

function Onboarding() {
  const { user } = useRequireAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formatoRosto, setFormatoRosto] = useState<FormatoOpt | null>(null);
  const [cabeloComprimento, setCabeloComprimento] = useState<ComprimentoOpt | null>(null);
  const [cabeloTextura, setCabeloTextura] = useState<TexturaOpt | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  const completeOnboarding = async (to: "/analise" | "/", includePrefs = false) => {
    if (!user) return;
    setSaving(true);
    const payload = includePrefs
      ? {
          onboarding_completed: true,
          formato_rosto: formatoRosto,
          cabelo_comprimento: cabeloComprimento,
          cabelo_textura: cabeloTextura,
        }
      : { onboarding_completed: true };
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Não foi possível concluir o onboarding.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    navigate({ to });
  };

  const podeAvancar = slide.isForm ? !!cabeloComprimento && !!cabeloTextura : true;

  const onPrimary = () => {
    if (isLast) completeOnboarding("/analise", true);
    else setStep(step + 1);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-10">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => completeOnboarding("/")}
          disabled={saving}
          className="text-sm text-muted-foreground"
        >
          Pular
        </button>
      </div>

      {slide.isForm ? (
        <div className="flex flex-1 flex-col justify-center py-6 space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-card">
              <Icon className="h-7 w-7 text-primary-foreground" strokeWidth={1.4} />
            </div>
            <h1 className="font-serif text-2xl leading-tight mb-1">{slide.title}</h1>
            <p className="text-sm text-muted-foreground">{slide.text}</p>
          </div>

          <div>
            <Label className="mb-2 block">Formato do seu rosto</Label>
            <div className="grid grid-cols-3 gap-2">
              {FORMATOS.map((f) => {
                const active =
                  formatoRosto === f.value || (f.value === null && !formatoRosto);
                return (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setFormatoRosto(f.value)}
                    className={`rounded-xl p-3 text-sm border-2 transition-colors ${
                      active
                        ? "border-terracotta bg-terracotta/10 font-medium"
                        : "border-border/60 bg-secondary/30"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Comprimento do cabelo</Label>
            <div className="grid grid-cols-3 gap-2">
              {COMPRIMENTOS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCabeloComprimento(c.value)}
                  className={`rounded-xl p-3 text-sm border-2 transition-colors ${
                    cabeloComprimento === c.value
                      ? "border-terracotta bg-terracotta/10 font-medium"
                      : "border-border/60 bg-secondary/30"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Textura do cabelo</Label>
            <div className="grid grid-cols-2 gap-2">
              {TEXTURAS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setCabeloTextura(t.value)}
                  className={`rounded-xl p-3 text-sm border-2 transition-colors ${
                    cabeloTextura === t.value
                      ? "border-terracotta bg-terracotta/10 font-medium"
                      : "border-border/60 bg-secondary/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-10 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-primary shadow-card">
            <Icon className="h-16 w-16 text-primary-foreground" strokeWidth={1.4} />
          </div>
          <h1 className="font-serif text-3xl leading-tight mb-3">{slide.title}</h1>
          <p className="text-muted-foreground max-w-xs">{slide.text}</p>
        </div>
      )}

      <div className="my-6 flex justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-terracotta" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
      <Button
        size="lg"
        disabled={saving || !podeAvancar}
        className="rounded-full bg-gradient-primary shadow-soft"
        onClick={onPrimary}
      >
        {isLast ? (saving ? "Salvando..." : "Começar análise") : "Continuar"}
      </Button>
    </div>
  );
}
