import { PENTEADOS, type Penteado, type FormatoRosto, type CabeloComprimento, type CabeloTextura, type Ocasiao } from "./hairstyle-catalog";

// ============================================================================
// HAIRSTYLE SUGGESTER
// ============================================================================

export function sugerirPenteados(
  formato: FormatoRosto | null,
  comprimento: CabeloComprimento | null,
  textura: CabeloTextura | null,
  ocasiao: Ocasiao,
  limit = 3
): Penteado[] {
  let candidatos = PENTEADOS.filter(p => p.ocasioes.includes(ocasiao));

  if (formato) candidatos = candidatos.filter(p => p.formatos.includes(formato));
  if (comprimento) candidatos = candidatos.filter(p => p.comprimentos.includes(comprimento));
  if (textura) candidatos = candidatos.filter(p => p.texturas.includes(textura));

  if (candidatos.length === 0 && textura) {
    candidatos = PENTEADOS.filter(p =>
      p.ocasioes.includes(ocasiao) &&
      (!comprimento || p.comprimentos.includes(comprimento))
    );
  }
  if (candidatos.length === 0) {
    candidatos = PENTEADOS.filter(p => p.ocasioes.includes(ocasiao));
  }

  const shuffled = [...candidatos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// ============================================================================
// MAKEUP SUGGESTER
// ============================================================================

export type SugestaoMaquiagem = {
  batom: { cor: string; descricao: string; nome_produto: string };
  sombra: { cores: string[]; descricao: string; nome_produto: string };
  blush: { cor: string; descricao: string; nome_produto: string };
};

function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function sugerirMaquiagem(
  subtom: string | null | undefined,
  paletaSazonal: string | null | undefined,
  _cores: string[],
  ocasiao: Ocasiao
): SugestaoMaquiagem {
  const tom = subtom || "neutro";
  const estacaoLower = (paletaSazonal || "").toLowerCase();
  const eVibrante = estacaoLower.includes("inverno") || estacaoLower.includes("primavera");
  const noturna = ocasiao === "festa" || ocasiao === "encontro";

  let batomHue: number, batomSat: number, batomLum: number;
  let batomDesc: string, batomNome: string;

  if (tom === "frio") {
    batomHue = noturna ? 350 : 340;
    batomSat = noturna ? 75 : 55;
    batomLum = noturna ? 35 : 50;
    batomDesc = noturna ? "Rosa-vinho intenso" : "Rosa frio suave";
    batomNome = noturna ? "Ruby Rose Honey Berry" : "Vult Rosa Sublime";
  } else if (tom === "quente") {
    batomHue = noturna ? 15 : 10;
    batomSat = noturna ? 80 : 65;
    batomLum = noturna ? 38 : 50;
    batomDesc = noturna ? "Vermelho coral profundo" : "Pêssego dourado";
    batomNome = noturna ? "Eudora Ruby Coral" : "Avon Nude Pêssego";
  } else {
    batomHue = noturna ? 355 : 345;
    batomSat = noturna ? 60 : 50;
    batomLum = noturna ? 42 : 55;
    batomDesc = noturna ? "Rosa-malva equilibrado" : "Nude rosado";
    batomNome = noturna ? "MAC Brick" : "Quem Disse Berenice Nude";
  }
  if (eVibrante) batomSat = Math.min(95, batomSat + 10);

  let sombraCores: string[];
  let sombraDesc: string, sombraNome: string;
  if (tom === "frio") {
    sombraCores = [hslToHex(280, 30, 75), hslToHex(260, 45, 50), hslToHex(220, 20, 25)];
    sombraDesc = "Paleta fria: lilás, roxo e cinza-azulado";
    sombraNome = "Ruby Rose Feels - Paleta Frio";
  } else if (tom === "quente") {
    sombraCores = [hslToHex(35, 55, 75), hslToHex(20, 65, 50), hslToHex(15, 70, 28)];
    sombraDesc = "Paleta quente: dourado, terracota e marrom";
    sombraNome = "Vult Quarteto Sombras Nude";
  } else {
    sombraCores = [hslToHex(30, 25, 75), hslToHex(20, 35, 45), hslToHex(0, 0, 22)];
    sombraDesc = "Paleta neutra: bege, marrom e grafite";
    sombraNome = "Quem Disse Berenice Nude Trio";
  }

  let blushHue: number, blushSat: number, blushLum: number;
  let blushDesc: string, blushNome: string;

  if (tom === "frio") {
    blushHue = 350; blushSat = 35; blushLum = 72;
    blushDesc = "Rosa frio levemente acinzentado";
    blushNome = "Vult Blush Rosa Frio";
  } else if (tom === "quente") {
    blushHue = 15; blushSat = 50; blushLum = 70;
    blushDesc = "Coral pêssego natural";
    blushNome = "Ruby Rose Coral";
  } else {
    blushHue = 5; blushSat = 40; blushLum = 70;
    blushDesc = "Rosa-pêssego suave universal";
    blushNome = "Eudora Rosa Mundo";
  }

  return {
    batom: { cor: hslToHex(batomHue, batomSat, batomLum), descricao: batomDesc, nome_produto: batomNome },
    sombra: { cores: sombraCores, descricao: sombraDesc, nome_produto: sombraNome },
    blush: { cor: hslToHex(blushHue, blushSat, blushLum), descricao: blushDesc, nome_produto: blushNome },
  };
}

// ============================================================================
// JEWELRY SUGGESTER
// ============================================================================

export type SugestaoJoia = {
  metal: string;
  metal_hex: string;
  pedras: string[];
  estilo: string;
  exemplo: string;
};

export function sugerirJoias(
  subtom: string | null | undefined,
  ocasiao: Ocasiao
): SugestaoJoia {
  const tom = subtom || "neutro";
  const formal = ocasiao === "trabalho" || ocasiao === "festa" || ocasiao === "encontro";

  if (tom === "frio") {
    return {
      metal: "Prata",
      metal_hex: "#C0C0C0",
      pedras: ["Safira", "Pérola branca", "Topázio azul", "Diamante"],
      estilo: formal ? "Peças delicadas e brilhantes" : "Acessórios prateados despojados",
      exemplo: formal ? "Brincos de pérola + colar fino de prata" : "Argolas pequenas prateadas + pulseiras finas"
    };
  } else if (tom === "quente") {
    return {
      metal: "Dourado / Ouro rosê",
      metal_hex: "#D4AF8C",
      pedras: ["Âmbar", "Citrino", "Pérola dourada", "Topázio amarelo"],
      estilo: formal ? "Peças elegantes em ouro" : "Acessórios dourados com toque boho",
      exemplo: formal ? "Brincos dourados + colar em camadas" : "Argolas grandes douradas + maxi colar"
    };
  } else {
    return {
      metal: "Prata ou dourado (versátil)",
      metal_hex: "#B8A48E",
      pedras: ["Pérola", "Quartzo rosa", "Cristal", "Madrepérola"],
      estilo: formal ? "Peças clássicas neutras" : "Mix de metais com moderação",
      exemplo: formal ? "Brincos discretos + um pingente delicado" : "Pulseiras mistas + brincos pequenos"
    };
  }
}
