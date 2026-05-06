import type { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pt-8 pb-28">
      {children}
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-terracotta/80 mb-1">{eyebrow}</p>
      )}
      <h1 className="font-serif text-3xl text-foreground">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
