import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Camera, Clock, Crown, Settings, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  component: Perfil,
  head: () => ({ meta: [{ title: "Perfil — Meu Tom Perfeito" }] }),
});

const items = [
  { icon: Camera, label: "Refazer análise", to: "/analise" as const },
  { icon: Clock, label: "Histórico" },
  { icon: Crown, label: "Plano Premium", highlight: true },
  { icon: Settings, label: "Configurações" },
  { icon: LogOut, label: "Sair", to: "/login" as const },
];

function Perfil() {
  return (
    <>
      <MobileShell>
        <Card className="rounded-3xl p-6 mb-5 border-border/60 shadow-card bg-gradient-soft text-center">
          <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-gradient-primary shadow-soft" />
          <h1 className="font-serif text-2xl">Marina Silva</h1>
          <p className="text-sm text-muted-foreground">marina@email.com</p>
          <span className="mt-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            Plano Free
          </span>
        </Card>

        <div className="space-y-2">
          {items.map(({ icon: Icon, label, to, highlight }) => {
            const content = (
              <Card
                className={`rounded-2xl p-4 flex items-center gap-3 border-border/60 shadow-soft hover:scale-[1.01] transition-transform ${
                  highlight ? "bg-gradient-primary text-primary-foreground border-0" : ""
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    highlight ? "bg-white/20" : "bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{label}</span>
                <ChevronRight className="h-4 w-4 opacity-60" />
              </Card>
            );
            return to ? (
              <Link key={label} to={to}>{content}</Link>
            ) : (
              <button key={label} className="w-full text-left">{content}</button>
            );
          })}
        </div>
      </MobileShell>
      <BottomNav />
    </>
  );
}
