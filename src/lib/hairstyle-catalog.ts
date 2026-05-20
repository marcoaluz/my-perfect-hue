export type FormatoRosto = "oval" | "redondo" | "quadrado" | "coracao" | "alongado";
export type CabeloComprimento = "curto" | "medio" | "longo";
export type CabeloTextura = "liso" | "ondulado" | "cacheado" | "crespo";
export type Ocasiao = "festa" | "casual" | "trabalho" | "encontro" | "praia" | "esporte";

export type Penteado = {
  id: string;
  nome: string;
  descricao: string;
  svg: string;
  formatos: FormatoRosto[];
  comprimentos: CabeloComprimento[];
  texturas: CabeloTextura[];
  ocasioes: Ocasiao[];
};

const SVG_BASE_STYLE = 'viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"';

export const PENTEADOS: Penteado[] = [
  {
    id: "coque-baixo-desfiado",
    nome: "Coque baixo desfiado",
    descricao: "Elegante e moderno, perfeito pra valorizar o pescoço",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><ellipse cx="50" cy="85" rx="12" ry="10" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["festa", "trabalho", "encontro"]
  },
  {
    id: "coque-alto-bagunçado",
    nome: "Coque alto",
    descricao: "Sofisticado e jovem, alonga o pescoço",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="65" rx="20" ry="25" fill="currentColor" opacity="0.15"/><circle cx="50" cy="65" r="14" fill="currentColor" opacity="0.4"/><ellipse cx="50" cy="30" rx="13" ry="11" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["redondo", "quadrado", "oval"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "esporte", "praia"]
  },
  {
    id: "rabo-de-cavalo-baixo",
    nome: "Rabo de cavalo baixo",
    descricao: "Clássico, prático, combina com tudo",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><path d="M50 85 Q47 100 50 115 Q53 100 50 85" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "coracao", "redondo"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "esporte"]
  },
  {
    id: "rabo-de-cavalo-alto",
    nome: "Rabo de cavalo alto",
    descricao: "Energético, levanta o rosto",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="62" rx="20" ry="25" fill="currentColor" opacity="0.15"/><circle cx="50" cy="62" r="14" fill="currentColor" opacity="0.4"/><path d="M50 37 Q40 25 35 10 Q45 30 50 37" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["redondo", "quadrado", "oval"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["esporte", "casual", "festa"]
  },
  {
    id: "trança-lateral",
    nome: "Trança lateral",
    descricao: "Romântica e delicada",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><path d="M65 70 Q75 80 78 95 Q72 90 68 85 Q75 95 72 105" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "redondo"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "encontro", "casual"]
  },
  {
    id: "trança-embutida",
    nome: "Trança embutida",
    descricao: "Sofisticada, ideal pra eventos",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><path d="M30 45 Q35 50 30 55 Q35 60 30 65 Q35 70 30 75" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "coracao", "alongado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["festa", "encontro"]
  },
  {
    id: "ondas-soltas",
    nome: "Ondas soltas",
    descricao: "Romântico e despojado ao mesmo tempo",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M30 50 Q35 55 30 60 Q35 65 30 70 Q35 75 30 80 Q35 85 30 95" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/><path d="M70 50 Q65 55 70 60 Q65 65 70 70 Q65 75 70 80 Q65 85 70 95" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "quadrado", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["ondulado", "cacheado"],
    ocasioes: ["encontro", "festa", "casual", "praia"]
  },
  {
    id: "liso-solto",
    nome: "Liso solto",
    descricao: "Clean, minimalista, sempre elegante",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><rect x="28" y="50" width="44" height="55" rx="3" fill="currentColor" opacity="0.5"/></svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso"],
    ocasioes: ["trabalho", "encontro", "festa", "casual"]
  },
  {
    id: "meio-preso",
    nome: "Meio preso",
    descricao: "Equilíbrio entre solto e arrumado",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><circle cx="50" cy="40" r="4" fill="currentColor" opacity="0.7"/><path d="M28 60 L28 100 M72 60 L72 100" stroke="currentColor" stroke-width="3" opacity="0.5"/></svg>`,
    formatos: ["oval", "quadrado", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "trabalho", "encontro"]
  },
  {
    id: "bob-curto",
    nome: "Bob curto",
    descricao: "Moderno, marcante, valoriza o rosto",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M25 50 L25 75 L75 75 L75 50 Q75 35 50 35 Q25 35 25 50" fill="currentColor" opacity="0.55"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["curto"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["trabalho", "casual", "festa"]
  },
  {
    id: "pixie",
    nome: "Pixie cut",
    descricao: "Ousado, jovem, prático",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M28 40 Q35 30 50 30 Q65 30 72 40 L70 55 L60 50 L50 55 L40 50 L30 55 Z" fill="currentColor" opacity="0.6"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["curto"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "esporte"]
  },
  {
    id: "long-bob",
    nome: "Long bob (lob)",
    descricao: "Versátil, moderno, fica bem em tudo",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M25 50 L25 85 L75 85 L75 50 Q75 35 50 35 Q25 35 25 50" fill="currentColor" opacity="0.55"/></svg>`,
    formatos: ["oval", "redondo", "quadrado", "alongado", "coracao"],
    comprimentos: ["medio"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["trabalho", "casual", "encontro", "festa"]
  },
  {
    id: "franja-reta",
    nome: "Franja reta",
    descricao: "Marcante, alonga o olhar",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><rect x="28" y="38" width="44" height="10" fill="currentColor" opacity="0.65"/><rect x="28" y="50" width="44" height="55" rx="3" fill="currentColor" opacity="0.45"/></svg>`,
    formatos: ["oval", "alongado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso"],
    ocasioes: ["trabalho", "casual", "encontro"]
  },
  {
    id: "franja-lateral",
    nome: "Franja lateral",
    descricao: "Suaviza o rosto, versátil",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M28 38 Q40 35 65 45 L72 40 L72 50 L28 50 Z" fill="currentColor" opacity="0.65"/><rect x="28" y="50" width="44" height="55" rx="3" fill="currentColor" opacity="0.45"/></svg>`,
    formatos: ["redondo", "quadrado", "coracao"],
    comprimentos: ["curto", "medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "encontro"]
  },
  {
    id: "cachos-definidos",
    nome: "Cachos definidos",
    descricao: "Volume natural valorizado",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="26" ry="32" fill="currentColor" opacity="0.15"/><circle cx="32" cy="48" r="4" fill="currentColor" opacity="0.6"/><circle cx="38" cy="60" r="4" fill="currentColor" opacity="0.6"/><circle cx="32" cy="72" r="4" fill="currentColor" opacity="0.6"/><circle cx="68" cy="48" r="4" fill="currentColor" opacity="0.6"/><circle cx="62" cy="60" r="4" fill="currentColor" opacity="0.6"/><circle cx="68" cy="72" r="4" fill="currentColor" opacity="0.6"/><circle cx="50" cy="80" r="4" fill="currentColor" opacity="0.6"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["casual", "festa", "encontro", "praia"]
  },
  {
    id: "puff-natural",
    nome: "Puff alto",
    descricao: "Realça o cabelo natural, marcante",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="40" rx="28" ry="22" fill="currentColor" opacity="0.5"/><circle cx="50" cy="65" r="13" fill="currentColor" opacity="0.4"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["curto", "medio", "longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["festa", "trabalho", "encontro"]
  },
  {
    id: "tranças-box",
    nome: "Box braids",
    descricao: "Estilo afro com tranças finas e longas",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="50" rx="22" ry="24" fill="currentColor" opacity="0.2"/><line x1="32" y1="50" x2="32" y2="115" stroke="currentColor" stroke-width="2" opacity="0.6"/><line x1="40" y1="50" x2="40" y2="115" stroke="currentColor" stroke-width="2" opacity="0.6"/><line x1="48" y1="50" x2="48" y2="115" stroke="currentColor" stroke-width="2" opacity="0.6"/><line x1="56" y1="50" x2="56" y2="115" stroke="currentColor" stroke-width="2" opacity="0.6"/><line x1="64" y1="50" x2="64" y2="115" stroke="currentColor" stroke-width="2" opacity="0.6"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao", "quadrado"],
    comprimentos: ["longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["casual", "festa", "praia", "trabalho", "esporte", "encontro"]
  },
  {
    id: "twist-natural",
    nome: "Twist out",
    descricao: "Definição natural, volumoso e leve",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="50" rx="25" ry="28" fill="currentColor" opacity="0.2"/><path d="M30 45 Q35 55 30 65 Q35 75 30 85" stroke="currentColor" stroke-width="3" fill="none" opacity="0.6"/><path d="M45 42 Q50 52 45 62 Q50 72 45 85" stroke="currentColor" stroke-width="3" fill="none" opacity="0.6"/><path d="M60 45 Q65 55 60 65 Q65 75 60 85" stroke="currentColor" stroke-width="3" fill="none" opacity="0.6"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["casual", "festa", "trabalho", "encontro"]
  },
  {
    id: "espace-coque",
    nome: "Space buns",
    descricao: "Divertido e jovial, com dois coques altos",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="20" ry="25" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="13" fill="currentColor" opacity="0.4"/><circle cx="32" cy="32" r="9" fill="currentColor" opacity="0.7"/><circle cx="68" cy="32" r="9" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "praia", "festa"]
  },
  {
    id: "rabo-baixo-volumoso",
    nome: "Rabo baixo volumoso",
    descricao: "Sofisticação com toque romântico",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="24" ry="29" fill="currentColor" opacity="0.18"/><circle cx="50" cy="55" r="16" fill="currentColor" opacity="0.4"/><ellipse cx="50" cy="95" rx="8" ry="18" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "trabalho", "encontro"]
  },
  {
    id: "trança-coroa",
    nome: "Trança coroa",
    descricao: "Romântica, ideal pra noivas e festas",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M28 45 Q40 35 50 38 Q60 35 72 45" stroke="currentColor" stroke-width="4" fill="none" opacity="0.7"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "encontro"]
  },
  {
    id: "molhado-praia",
    nome: "Wet hair",
    descricao: "Efeito molhado pra praia ou festa",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.2"/><path d="M28 50 L28 95 L72 95 L72 50" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao", "quadrado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["praia", "festa"]
  },
  {
    id: "coque-bailarina",
    nome: "Coque bailarina",
    descricao: "Clássico, limpo, elegante",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><circle cx="50" cy="35" r="10" fill="currentColor" opacity="0.75"/></svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["trabalho", "festa", "encontro"]
  },
  {
    id: "ondas-anos-50",
    nome: "Ondas vintage",
    descricao: "Hollywood waves, retrô e sofisticado",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M28 50 Q40 45 50 50 Q60 55 72 50" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/><path d="M28 65 Q40 60 50 65 Q60 70 72 65" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/><path d="M28 80 Q40 75 50 80 Q60 85 72 80" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["festa", "encontro"]
  },
  {
    id: "rabo-baixo-com-lenco",
    nome: "Rabo com lenço",
    descricao: "Charme casual com um toque de estilo",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><rect x="42" y="78" width="16" height="6" fill="currentColor" opacity="0.85"/><path d="M50 85 Q47 100 50 115" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao", "quadrado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "praia", "encontro"]
  },
  {
    id: "shag-cut",
    nome: "Shag cut",
    descricao: "Moderno, desestruturado, jovem",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M28 40 L30 50 L26 60 L30 70 L26 85 L74 85 L70 70 L74 60 L70 50 L72 40 Q60 30 50 30 Q40 30 28 40" fill="currentColor" opacity="0.55"/></svg>`,
    formatos: ["oval", "quadrado", "alongado"],
    comprimentos: ["curto", "medio"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "festa", "encontro"]
  },
  {
    id: "twist-meio-preso",
    nome: "Meio preso torcido",
    descricao: "Detalhe charmoso e descomplicado",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><circle cx="50" cy="55" r="15" fill="currentColor" opacity="0.4"/><path d="M30 50 Q40 48 50 42 Q60 48 70 50" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/><path d="M28 60 L28 100 M72 60 L72 100" stroke="currentColor" stroke-width="3" opacity="0.5"/></svg>`,
    formatos: ["oval", "redondo", "quadrado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "encontro"]
  },
  {
    id: "topete-curto",
    nome: "Topete moderno",
    descricao: "Atitude, ousadia, marcante",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><path d="M40 30 Q50 18 60 30 L60 50 L40 50 Z" fill="currentColor" opacity="0.75"/><path d="M28 50 L28 90 L72 90 L72 50" fill="currentColor" opacity="0.5"/></svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["curto"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "trabalho", "casual"]
  },
  {
    id: "cabelo-com-acessorio",
    nome: "Tiara delicada",
    descricao: "Acessório que transforma qualquer look",
    svg: `<svg ${SVG_BASE_STYLE}><ellipse cx="50" cy="55" rx="22" ry="28" fill="currentColor" opacity="0.15"/><rect x="28" y="50" width="44" height="55" rx="3" fill="currentColor" opacity="0.45"/><path d="M28 42 Q50 35 72 42" stroke="currentColor" stroke-width="3" fill="none" opacity="0.85"/></svg>`,
    formatos: ["oval", "redondo", "quadrado", "coracao", "alongado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "encontro", "casual"]
  }
];
