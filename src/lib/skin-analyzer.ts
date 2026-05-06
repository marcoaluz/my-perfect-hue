// Análise de subtom de pele 100% no navegador via Canvas API.

export type SubtomResult = {
  subtom: string;
  paleta_sazonal: string;
  confianca: number;
  cores_que_combinam: string[];
  cores_a_evitar: string[];
  rgb: { r: number; g: number; b: number };
  hsv: { h: number; s: number; v: number };
};

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
}

const PALETAS: Record<string, { nome: string; combinam: string[]; evitar: string[] }> = {
  primavera: {
    nome: "Primavera Quente",
    combinam: ["#F4A261", "#E9C46A", "#FFB4A2", "#E76F51", "#FFD6A5"],
    evitar: ["#000080", "#4B0082", "#2F4F4F", "#708090", "#191970"],
  },
  verao: {
    nome: "Verão Suave",
    combinam: ["#A8DADC", "#B5C7E0", "#C9ADA7", "#D8B4D8", "#9FB8C9"],
    evitar: ["#FF4500", "#FFA500", "#8B4513", "#B8860B", "#A0522D"],
  },
  outono: {
    nome: "Outono Profundo",
    combinam: ["#C97B63", "#D4AF8C", "#A0522D", "#8B6F47", "#B5651D"],
    evitar: ["#FF69B4", "#00FFFF", "#FF1493", "#7FFFD4", "#FF00FF"],
  },
  inverno: {
    nome: "Inverno Frio",
    combinam: ["#1E3A8A", "#7C3AED", "#BE185D", "#0E7490", "#111827"],
    evitar: ["#F4A261", "#E9C46A", "#D2B48C", "#DEB887", "#F5DEB3"],
  },
};

/**
 * Extrai os pixels de uma região circular do canvas e calcula a média RGB.
 */
export function analyzeRegion(
  canvas: HTMLCanvasElement,
  cx: number,
  cy: number,
  radius: number
): SubtomResult {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const x = Math.max(0, Math.floor(cx - radius));
  const y = Math.max(0, Math.floor(cy - radius));
  const w = Math.min(canvas.width - x, Math.floor(radius * 2));
  const h = Math.min(canvas.height - y, Math.floor(radius * 2));
  const { data } = ctx.getImageData(x, y, w, h);

  let r = 0, g = 0, b = 0, n = 0;
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const dx = px - radius;
      const dy = py - radius;
      if (dx * dx + dy * dy > radius * radius) continue;
      const i = (py * w + px) * 4;
      const a = data[i + 3];
      if (a < 200) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
  }

  if (n === 0) throw new Error("Nenhum pixel válido na seleção");
  r = Math.round(r / n);
  g = Math.round(g / n);
  b = Math.round(b / n);

  const hsv = rgbToHsv(r, g, b);

  // Determinar temperatura: quente / frio / neutro
  let temperatura: "quente" | "frio" | "neutro";
  if ((hsv.h >= 0 && hsv.h <= 50) || hsv.h >= 330) temperatura = "quente";
  else if (hsv.h >= 180 && hsv.h <= 280) temperatura = "frio";
  else temperatura = "neutro";

  // Refinamento: para tons de pele a regra prática é R vs B
  if (temperatura === "neutro") {
    if (r - b > 18) temperatura = "quente";
    else if (b - r > 8) temperatura = "frio";
  }

  // Estação a partir de luminosidade (V) e temperatura
  let chave: keyof typeof PALETAS;
  if (temperatura === "quente") {
    chave = hsv.v >= 0.72 ? "primavera" : "outono";
  } else if (temperatura === "frio") {
    chave = hsv.v >= 0.7 ? "verao" : "inverno";
  } else {
    chave = hsv.v >= 0.7 ? "verao" : "outono";
  }

  const paleta = PALETAS[chave];

  // Confiança: quanto mais saturação e separação R-B, maior a certeza
  const tempStrength = Math.min(1, Math.abs(r - b) / 60);
  const satStrength = Math.min(1, hsv.s * 2.2);
  const confianca = Math.max(0.55, Math.min(0.97, 0.55 + tempStrength * 0.3 + satStrength * 0.15));

  return {
    subtom: `${temperatura}_${chave}`,
    paleta_sazonal: paleta.nome,
    confianca: Number(confianca.toFixed(2)),
    cores_que_combinam: paleta.combinam,
    cores_a_evitar: paleta.evitar,
    rgb: { r, g, b },
    hsv: { h: Math.round(hsv.h), s: Number(hsv.s.toFixed(2)), v: Number(hsv.v.toFixed(2)) },
  };
}
