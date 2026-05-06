import { useEffect, useRef, useState } from "react";

type Props = {
  imageUrl: string;
  onReady?: () => void;
  onChange?: (data: { canvas: HTMLCanvasElement; cx: number; cy: number; radius: number }) => void;
};

/**
 * Canvas com seletor circular arrastável para escolher a área da pele.
 * Coordenadas (cx, cy, radius) são em pixels do canvas (espaço da imagem).
 */
export function SkinPicker({ imageUrl, onReady, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ cx: 0, cy: 0, r: 50 });
  const draggingRef = useRef(false);

  // carrega imagem
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current!;
      const overlay = overlayRef.current!;
      // limita tamanho do canvas para performance
      const maxW = 800;
      const ratio = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      canvas.width = w;
      canvas.height = h;
      overlay.width = w;
      overlay.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      const r = Math.max(30, Math.min(w, h) * 0.1);
      const next = { cx: w / 2, cy: h / 2, r };
      setPos(next);
      onReady?.();
      onChange?.({ canvas, cx: next.cx, cy: next.cy, radius: next.r });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // ajusta escala visual baseado no container
  useEffect(() => {
    const update = () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas || !canvas.width) return;
      setScale(wrap.clientWidth / canvas.width);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // desenha overlay (círculo)
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d")!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    // máscara escura
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, overlay.width, overlay.height);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.cx, pos.cy, pos.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // borda
    ctx.strokeStyle = "#FAF7F5";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pos.cx, pos.cy, pos.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(201,123,99,0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [pos]);

  const toCanvasCoords = (clientX: number, clientY: number) => {
    const rect = overlayRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    };
  };

  const start = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    move(e);
  };
  const move = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const { x, y } = toCanvasCoords(e.clientX, e.clientY);
    const canvas = canvasRef.current!;
    const cx = Math.max(pos.r, Math.min(canvas.width - pos.r, x));
    const cy = Math.max(pos.r, Math.min(canvas.height - pos.r, y));
    const next = { ...pos, cx, cy };
    setPos(next);
    onChange?.({ canvas, cx, cy, radius: pos.r });
  };
  const end = () => { draggingRef.current = false; };

  const setRadius = (r: number) => {
    const canvas = canvasRef.current!;
    const next = { ...pos, r };
    next.cx = Math.max(r, Math.min(canvas.width - r, pos.cx));
    next.cy = Math.max(r, Math.min(canvas.height - r, pos.cy));
    setPos(next);
    onChange?.({ canvas, cx: next.cx, cy: next.cy, radius: r });
  };

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden rounded-2xl bg-secondary">
      <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />
      <canvas
        ref={overlayRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className="absolute inset-0 w-full h-full cursor-grab touch-none"
      />
      <div className="absolute bottom-2 left-2 right-2 rounded-full bg-card/90 backdrop-blur px-3 py-1.5 flex items-center gap-2 shadow-soft">
        <span className="text-[10px] text-muted-foreground">Tamanho</span>
        <input
          type="range"
          min={20}
          max={120}
          value={pos.r}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="flex-1 accent-[--terracotta]"
        />
      </div>
    </div>
  );
}
