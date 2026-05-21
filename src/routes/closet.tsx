import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, X, Camera, Trash2, Shirt } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { corCombinaComSubtom } from "@/lib/color-matcher";
import { extractDominantColor, resizeImage } from "@/lib/color-extractor";

export const Route = createFileRoute("/closet")({
  component: Closet,
  head: () => ({ meta: [{ title: "Closet — Meu Tom Perfeito" }] }),
});

const filters = ["Todas", "Combina", "Não combina"] as const;
const cats = ["Todas", "Blusas", "Calças", "Vestidos", "Sapatos", "Acessórios"];

function Closet() {
  const { user, profile, loading } = useRequireAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [cat, setCat] = useState("Todas");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ categoria: "Blusas", cor_hex: "#C97B63" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectingColor, setDetectingColor] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clickedUpload, setClickedUpload] = useState(false);
  const [pecaParaDeletar, setPecaParaDeletar] = useState<string | null>(null);

  const deletarPeca = async () => {
    if (!pecaParaDeletar) return;
    const peca = items.find((p) => p.id === pecaParaDeletar);

    const { error } = await supabase
      .from("pecas_roupa")
      .delete()
      .eq("id", pecaParaDeletar);

    if (error) {
      toast.error("Não consegui deletar: " + error.message);
      setPecaParaDeletar(null);
      return;
    }

    if (peca?.foto_url) {
      try {
        const url = new URL(peca.foto_url);
        const pathMatch = url.pathname.match(/\/fotos\/(.+)$/);
        if (pathMatch) {
          await supabase.storage.from("fotos").remove([pathMatch[1]]);
        }
      } catch {
        // ignora — peça já foi removida do banco
      }
    }

    toast.success("Peça removida ✨");
    setPecaParaDeletar(null);
    qc.invalidateQueries({ queryKey: ["pecas"] });
  };

  const { data: items = [] } = useQuery({
    queryKey: ["pecas", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pecas_roupa")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = items.filter((i) => {
    if (filter === "Combina" && !i.combina_com_subtom) return false;
    if (filter === "Não combina" && i.combina_com_subtom) return false;
    if (cat !== "Todas" && i.categoria !== cat) return false;
    return true;
  });

  const resetForm = () => {
    setPreviewUrl(null);
    setForm({ categoria: "Blusas", cor_hex: "#C97B63" });
    setDetectingColor(false);
    setUploadProgress("idle");
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDetectingColor(true);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    try {
      const result = await extractDominantColor(objectUrl);
      setForm((f) => ({ ...f, cor_hex: result.hex }));
      toast.success(`Cor detectada: ${result.hex}`);
    } catch {
      toast.error("Não consegui detectar a cor. Ajuste manualmente.");
    } finally {
      setDetectingColor(false);
    }
  };

  const adicionar = async () => {
    if (!user) return;
    setUploadProgress("uploading");
    let foto_url: string | null = null;

    if (previewUrl) {
      try {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        const file = new File([blob], "peca.jpg", { type: "image/jpeg" });
        const resized = await resizeImage(file, 800, 0.85);
        const fileName = `${user.id}/${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("fotos")
          .upload(fileName, resized, { contentType: "image/jpeg", upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("fotos").getPublicUrl(fileName);
        foto_url = urlData.publicUrl;
      } catch (err: any) {
        toast.error("Erro ao salvar foto: " + err.message);
        setUploadProgress("idle");
        return;
      }
    }

    const match = corCombinaComSubtom(form.cor_hex, profile?.subtom, profile?.paleta_sazonal);

    const { error } = await supabase.from("pecas_roupa").insert({
      user_id: user.id,
      categoria: form.categoria,
      cor_hex: form.cor_hex,
      foto_url,
      combina_com_subtom: match.combina,
    });

    setUploadProgress("idle");
    if (error) return toast.error(error.message);

    toast.success(
      match.combina
        ? `Peça adicionada — ${match.motivo} ✨`
        : `Peça adicionada — ${match.motivo}`,
    );

    setOpen(false);
    resetForm();
    qc.invalidateQueries({ queryKey: ["pecas"] });
  };

  if (loading || !user) return null;

  return (
    <>
      <MobileShell>
        <PageHeader eyebrow="Guarda-roupa" title="Meu closet" subtitle={`${filtered.length} peças`} />

        <div className="flex gap-2 mb-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-all ${
                filter === f ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition-all ${
                cat === c ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-primary opacity-30 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary shadow-card">
                <Shirt className="h-9 w-9 text-primary-foreground" strokeWidth={1.6} />
              </div>
            </div>
            <h2 className="font-serif text-xl mb-2">Monte seu closet inteligente ✨</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Adicione peças e descubra quais realmente valorizam seu tom natural.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="mt-5 rounded-full bg-gradient-primary shadow-soft"
            >
              <Plus className="h-4 w-4" /> Adicionar minha primeira peça
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            Nenhuma peça com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((i) => (
              <Card key={i.id} className="relative rounded-2xl p-3 border-border/60 shadow-soft hover:scale-[1.02] transition-transform group">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPecaParaDeletar(i.id);
                  }}
                  className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center opacity-60 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label="Remover peça"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="relative aspect-square rounded-xl mb-3 overflow-hidden">
                  {i.foto_url ? (
                    <img src={i.foto_url} alt={i.categoria || "peça"} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: i.cor_hex || "#E8B4B8" }} />
                  )}
                  <span
                    className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-2 border-white shadow-sm"
                    style={{ background: i.cor_hex || "#E8B4B8" }}
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium leading-tight">{i.categoria}</p>
                    <p className="text-xs text-muted-foreground">{i.cor_hex}</p>
                  </div>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${i.combina_com_subtom ? "bg-sage/30 text-sage" : "bg-destructive/15 text-destructive"}`}>
                    {i.combina_com_subtom ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </MobileShell>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button size="icon" className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-gradient-primary shadow-card">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Nova peça</DialogTitle>
          </DialogHeader>

          {!profile?.subtom && (
            <div className="rounded-2xl bg-secondary/60 border border-border/40 p-3 text-xs text-muted-foreground leading-relaxed">
              💡 Faça sua análise de subtom em "Análise" para que possamos avaliar se as peças combinam com você.
            </div>
          )}

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={onFileSelected}
            />

            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square rounded-2xl border-2 border-dashed border-border bg-secondary/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-secondary/50 transition-colors"
              >
                <Camera className="h-8 w-8" />
                <p className="text-sm font-medium">Toque para tirar foto</p>
                <p className="text-xs">ou escolher da galeria</p>
              </button>
            ) : (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
                <img src={previewUrl} alt="preview" className="absolute inset-0 h-full w-full object-cover" />
                {detectingColor && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Detectando cor...</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm"
                  aria-label="Remover foto"
                >
                  ✕
                </button>
              </div>
            )}

            <div>
              <Label>Categoria</Label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {cats.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <Label>Cor detectada</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="color"
                  value={form.cor_hex}
                  onChange={(e) => setForm({ ...form, cor_hex: e.target.value })}
                  className="h-12 w-16 rounded-xl cursor-pointer border border-input bg-transparent"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium uppercase">{form.cor_hex}</p>
                  <p className="text-xs text-muted-foreground">Toque para ajustar manualmente</p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={adicionar}
              disabled={uploadProgress === "uploading" || detectingColor}
              className="w-full rounded-full bg-gradient-primary"
            >
              {uploadProgress === "uploading" ? "Salvando..." : "Adicionar peça"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pecaParaDeletar}
        onOpenChange={(v) => !v && setPecaParaDeletar(null)}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Remover peça?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa peça será removida do seu closet. Looks favoritos que usam ela podem ficar incompletos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletarPeca}
              className="rounded-full bg-destructive hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </>
  );
}
