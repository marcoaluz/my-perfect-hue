import { Link, useLocation } from "@tanstack/react-router";
import { Home, Camera, Shirt, Sparkles, Wand2, User } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/analise", label: "Análise", icon: Camera },
  { to: "/closet", label: "Closet", icon: Shirt },
  { to: "/estilo", label: "Estilo", icon: Wand2 },
  { to: "/looks", label: "Looks", icon: Sparkles },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/90 backdrop-blur-lg">
      <ul className="mx-auto flex max-w-md items-center justify-between px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 rounded-2xl py-2 transition-all ${
                  active ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-accent/40" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                </span>
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
