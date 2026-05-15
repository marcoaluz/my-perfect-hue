/**
 * Extrai a cor dominante de uma imagem usando Canvas API.
 * Estratégia: redimensiona a imagem pra 100x100, coleta todos os pixels,
 * descarta os muito escuros/claros (sombras e brilhos), agrupa por bins
 * de cor e retorna o bin mais frequente.
 */

export type ExtractResult = {
  hex: string;
  rgb: { r: number; g: number; b: number };
  confidence: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function extractDominantColor(
  imageSource: HTMLImageElement | string,
): Promise<ExtractResult> {
  const img =
    typeof imageSource === "string" ? await loadImage(imageSource) : imageSource;

  const canvas = document.createElement("canvas");
  const SIZE = 100;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, SIZE, SIZE);

  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  const bins: Record<string, { count: number; r: number; g: number; b: number }> = {};
  let validPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 25 || lum > 240) continue;
    if (r > 240 && g > 240 && b > 240) continue;
    if (r < 15 && g < 15 && b < 15) continue;

    const bin = `${r >> 5}-${g >> 5}-${b >> 5}`;
    if (!bins[bin]) bins[bin] = { count: 0, r: 0, g: 0, b: 0 };
    bins[bin].count++;
    bins[bin].r += r;
    bins[bin].g += g;
    bins[bin].b += b;
    validPixels++;
  }

  if (validPixels === 0) {
    return { hex: "#888888", rgb: { r: 136, g: 136, b: 136 }, confidence: 0 };
  }

  const sorted = Object.values(bins).sort((a, b) => b.count - a.count);
  const winner = sorted[0];

  const r = Math.round(winner.r / winner.count);
  const g = Math.round(winner.g / winner.count);
  const b = Math.round(winner.b / winner.count);
  const hex =
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

  return { hex, rgb: { r, g, b }, confidence: winner.count / validPixels };
}

export async function resizeImage(
  file: File,
  maxWidth = 800,
  quality = 0.85,
): Promise<Blob> {
  const img = await loadImage(URL.createObjectURL(file));
  const scale = Math.min(1, maxWidth / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality);
  });
}
