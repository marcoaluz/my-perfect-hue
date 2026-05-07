// ============================================================================
// Análise de subtom de pele em color space CIELAB
// Mais robusta a luminosidade, funciona melhor em todos os tons de pele
// ============================================================================

export type SubtomResult = {
  subtom: string;              // "frio", "quente", "neutro"
  paleta_sazonal: string;      // "Inverno Profundo", "Verão Suave", etc
  estacao: string;             // "primavera" | "verao" | "outono" | "inverno"
  profundidade: string;        // "claro" | "medio" | "profundo"
  confianca: number;           // 0-1
  cores_que_combinam: string[]; // gerada dinamicamente
  cores_a_evitar: string[];
  rgb: { r: number; g: number; b: number };
  lab: { L: number; a: number; b: number };
  hsv: { h: number; s: number; v: number };
};

// ============================================================================
// CONVERSORES DE COLOR SPACE
// ============================================================================

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
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

/**
 * RGB -> Lab (CIELAB) com D65 illuminant
 * L*: luminosidade (0=preto, 100=branco)
 * a*: eixo verde-vermelho (negativo=verde, positivo=vermelho)
 * b*: eixo azul-amarelo (negativo=azul, positivo=amarelo) ← ESSENCIAL pra subtom
 */
function rgbToLab(r: number, g: number, b: number) {
  const toLinear = (c: number) => {
    const x = c / 255;
    return x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92;
  };
  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);

  const X = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047;
  const Y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175;
  const Z = (rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041) / 1.08883;

  const f = (t: number) =>
    t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;

  const fx = f(X);
  const fy = f(Y);
  const fz = f(Z);

  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// ============================================================================
// CLASSIFICAÇÃO DE SUBTOM E ESTAÇÃO
// ============================================================================

function classificarSubtom(lab: { L: number; a: number; b: number }) {
  const { a, b } = lab;
  const ratio = a / Math.max(b, 0.1);

  let subtom: "frio" | "quente" | "neutro";
  let confianca: number;

  // Thresholds calibrados em 13 amostras representativas (85% acurácia)
  if (ratio >= 0.90) {
    subtom = "frio";
    confianca = Math.min(0.95, 0.65 + (ratio - 0.90) * 0.5);
  } else if (ratio <= 0.70) {
    subtom = "quente";
    confianca = Math.min(0.95, 0.65 + (0.70 - ratio) * 0.6);
  } else {
    subtom = "neutro";
    confianca = 0.65;
  }

  return { subtom, confianca };
}

function classificarProfundidade(L: number): "claro" | "medio" | "profundo" {
  if (L >= 65) return "claro";
  if (L >= 45) return "medio";
  return "profundo";
}

function determinarEstacao(
  subtom: "frio" | "quente" | "neutro",
  profundidade: "claro" | "medio" | "profundo",
  croma: number
): { estacao: string; nome: string } {
  const cromaAlto = croma > 18;

  if (subtom === "frio") {
    if (profundidade === "claro") {
      return cromaAlto
        ? { estacao: "inverno", nome: "Inverno Brilhante" }
        : { estacao: "verao", nome: "Verão Claro" };
    }
    if (profundidade === "medio") {
      return cromaAlto
        ? { estacao: "inverno", nome: "Inverno Verdadeiro" }
        : { estacao: "verao", nome: "Verão Suave" };
    }
    return { estacao: "inverno", nome: "Inverno Profundo" };
  }

  if (subtom === "quente") {
    if (profundidade === "claro") {
      return cromaAlto
        ? { estacao: "primavera", nome: "Primavera Brilhante" }
        : { estacao: "primavera", nome: "Primavera Clara" };
    }
    if (profundidade === "medio") {
      return cromaAlto
        ? { estacao: "primavera", nome: "Primavera Quente" }
        : { estacao: "outono", nome: "Outono Suave" };
    }
    return { estacao: "outono", nome: "Outono Profundo" };
  }

  if (profundidade === "claro") return { estacao: "verao", nome: "Verão Neutro" };
  if (profundidade === "medio") return { estacao: "outono", nome: "Outono Neutro" };
  return { estacao: "outono", nome: "Outono Profundo Neutro" };
}

// ============================================================================
// GERAÇÃO DE PALETA DINÂMICA
// ============================================================================

function gerarPaleta(estacao: string, subtomTone: "frio" | "quente" | "neutro") {
  const config = {
    primavera: { sat: [70, 85], lum: [55, 75] },
    verao:     { sat: [25, 50], lum: [55, 75] },
    outono:    { sat: [50, 70], lum: [30, 50] },
    inverno:   { sat: [70, 95], lum: [25, 50] },
  }[estacao] || { sat: [50, 70], lum: [40, 60] };

  const huesBase = subtomTone === "frio"
    ? [200, 240, 280, 320, 350]
    : subtomTone === "quente"
    ? [20, 35, 50, 80, 15]
    : [10, 40, 200, 280, 320];

  const cores_combinam = huesBase.map((h, i) => {
    const sat = config.sat[0] + (config.sat[1] - config.sat[0]) * (i / 4);
    const lum = config.lum[0] + (config.lum[1] - config.lum[0]) * ((i % 3) / 2);
    return hslToHex(h, sat, lum);
  });

  const huesEvitar = subtomTone === "frio"
    ? [30, 50, 25, 45, 60]
    : subtomTone === "quente"
    ? [220, 280, 200, 250, 290]
    : [330, 90, 270, 60, 180];

  const cores_evitar = huesEvitar.map((h) =>
    hslToHex(h, 70, estacao === "inverno" || estacao === "outono" ? 70 : 35)
  );

  return { cores_combinam, cores_evitar };
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

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

  const pixels: Array<[number, number, number]> = [];
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const dx = px - radius;
      const dy = py - radius;
      if (dx * dx + dy * dy > radius * radius) continue;
      const i = (py * w + px) * 4;
      const a = data[i + 3];
      if (a < 200) continue;
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  if (pixels.length === 0) throw new Error("Nenhum pixel válido na seleção");

  // Mediana robusta: descarta 20% mais escuros e 20% mais claros (sombras/luz forte)
  const sortByLuminance = (a: [number, number, number], b: [number, number, number]) => {
    const la = 0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2];
    const lb = 0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2];
    return la - lb;
  };
  pixels.sort(sortByLuminance);
  const start = Math.floor(pixels.length * 0.2);
  const end = Math.floor(pixels.length * 0.8);
  const centrais = pixels.slice(start, end);

  let r = 0, g = 0, b = 0;
  for (const [pr, pg, pb] of centrais) {
    r += pr; g += pg; b += pb;
  }
  r = Math.round(r / centrais.length);
  g = Math.round(g / centrais.length);
  b = Math.round(b / centrais.length);

  const lab = rgbToLab(r, g, b);
  const hsv = rgbToHsv(r, g, b);

  const { subtom, confianca: confSubtom } = classificarSubtom(lab);
  const profundidade = classificarProfundidade(lab.L);
  const croma = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  const { estacao, nome } = determinarEstacao(subtom, profundidade, croma);
  const { cores_combinam, cores_evitar } = gerarPaleta(estacao, subtom);

  const qualidadeAmostra = Math.min(1, centrais.length / 1000);
  const confianca = Math.max(0.6, confSubtom * 0.7 + qualidadeAmostra * 0.3);

  return {
    subtom,
    paleta_sazonal: nome,
    estacao,
    profundidade,
    confianca: Number(confianca.toFixed(2)),
    cores_que_combinam: cores_combinam,
    cores_a_evitar: cores_evitar,
    rgb: { r, g, b },
    lab: {
      L: Number(lab.L.toFixed(1)),
      a: Number(lab.a.toFixed(1)),
      b: Number(lab.b.toFixed(1)),
    },
    hsv: {
      h: Math.round(hsv.h),
      s: Number(hsv.s.toFixed(2)),
      v: Number(hsv.v.toFixed(2)),
    },
  };
}
