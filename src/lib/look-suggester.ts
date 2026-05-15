/**
 * Gera sugestões de look baseadas nas peças do closet da usuária.
 */

export type Peca = {
  id: string;
  categoria: string;
  cor_hex: string | null;
  foto_url: string | null;
  combina_com_subtom: boolean;
};

export type LookSugerido = {
  pecas: Peca[];
  score: number;
  seed: string;
};

const POSICOES = {
  superior: ["Blusas", "Camisas"],
  inferior: ["Calças", "Saias", "Shorts"],
  vestido: ["Vestidos"],
  sapato: ["Sapatos"],
  acessorio: ["Acessórios"],
};

function hexToHsl(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return { h: 0, s: 0, l: 0 };
  const r = parseInt(m[0], 16) / 255;
  const g = parseInt(m[1], 16) / 255;
  const b = parseInt(m[2], 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function scoreHarmonia(corA: string, corB: string): number {
  const a = hexToHsl(corA);
  const b = hexToHsl(corB);
  if (a.s < 15 || b.s < 15) return 0.9;
  let diff = Math.abs(a.h - b.h);
  if (diff > 180) diff = 360 - diff;
  if (diff < 30) return 0.85;
  if (diff > 150) return 0.8;
  if (diff > 100 && diff < 140) return 0.75;
  return 0.5;
}

function scoreLook(pecas: Peca[]): number {
  if (pecas.length < 2) return 0;
  const comCor = pecas.filter((p) => p.cor_hex);
  if (comCor.length < 2) return 0.5;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < comCor.length; i++) {
    for (let j = i + 1; j < comCor.length; j++) {
      total += scoreHarmonia(comCor[i].cor_hex!, comCor[j].cor_hex!);
      pairs++;
    }
  }
  return total / pairs;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

export function sugerirLook(closet: Peca[], seed: string): LookSugerido | null {
  const validas = closet.filter((p) => p.combina_com_subtom);
  const sup = validas.filter((p) => POSICOES.superior.includes(p.categoria));
  const inf = validas.filter((p) => POSICOES.inferior.includes(p.categoria));
  const ves = validas.filter((p) => POSICOES.vestido.includes(p.categoria));
  const sap = validas.filter((p) => POSICOES.sapato.includes(p.categoria));
  const ace = validas.filter((p) => POSICOES.acessorio.includes(p.categoria));

  const candidatos: { pecas: Peca[]; score: number }[] = [];

  for (const v of ves) {
    const sapatos = sap.length ? sap : [null];
    const acessorios = ace.length ? ace : [null];
    for (const s of sapatos) {
      for (const a of acessorios) {
        const look = [v, s, a].filter(Boolean) as Peca[];
        candidatos.push({ pecas: look, score: scoreLook(look) });
      }
    }
  }

  for (const su of sup) {
    for (const i of inf) {
      const sapatos = sap.length ? sap : [null];
      const acessorios = ace.length ? ace : [null];
      for (const s of sapatos) {
        for (const a of acessorios) {
          const look = [su, i, s, a].filter(Boolean) as Peca[];
          candidatos.push({ pecas: look, score: scoreLook(look) });
        }
      }
    }
  }

  if (candidatos.length === 0) return null;

  const bons = candidatos.filter((c) => c.score >= 0.6);
  const pool = bons.length > 0 ? bons : candidatos;

  const rng = mulberry32(hashString(seed));
  const idx = Math.floor(rng() * pool.length);

  return { ...pool[idx], seed };
}

export function avaliarClosetParaLook(
  closet: Peca[],
):
  | { ok: true }
  | { ok: false; motivo: string; sugestao: string } {
  const validas = closet.filter((p) => p.combina_com_subtom);

  if (validas.length === 0) {
    return {
      ok: false,
      motivo: "Seu closet está vazio (ou nada combina com seu subtom).",
      sugestao: "Adicione peças no closet pra eu montar looks pra você!",
    };
  }

  const sup = validas.filter((p) => POSICOES.superior.includes(p.categoria));
  const inf = validas.filter((p) => POSICOES.inferior.includes(p.categoria));
  const ves = validas.filter((p) => POSICOES.vestido.includes(p.categoria));

  const temSuperior = sup.length > 0;
  const temInferior = inf.length > 0;
  const temVestido = ves.length > 0;

  if (!temVestido && !(temSuperior && temInferior)) {
    if (!temSuperior && !temInferior) {
      return {
        ok: false,
        motivo: "Você precisa de pelo menos um vestido OU uma combinação de blusa + calça.",
        sugestao: "Adicione um vestido ou uma blusa + uma calça no closet.",
      };
    }
    if (!temSuperior) {
      return {
        ok: false,
        motivo: "Falta uma parte de cima.",
        sugestao: "Adicione uma blusa ou camisa no closet.",
      };
    }
    if (!temInferior) {
      return {
        ok: false,
        motivo: "Falta uma parte de baixo.",
        sugestao: "Adicione uma calça, saia ou shorts no closet.",
      };
    }
  }

  return { ok: true };
}
