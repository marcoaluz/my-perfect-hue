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

const SVG_BASE_STYLE = 'viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg"';
// Backdrop ovalado de rosto, usado nos penteados não redesenhados pra dar contexto
const FACE_BG = '<ellipse cx="60" cy="82" rx="26" ry="32" fill="currentColor" opacity="0.06"/><rect x="52" y="110" width="16" height="16" rx="4" fill="currentColor" opacity="0.04"/>';

export const PENTEADOS: Penteado[] = [
  {
    id: "coque-baixo-desfiado",
    nome: "Coque baixo desfiado",
    descricao: "Elegante e moderno, perfeito pra valorizar o pescoço",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="80" rx="26" ry="32" fill="currentColor" opacity="0.08"/>
      <rect x="52" y="108" width="16" height="16" rx="4" fill="currentColor" opacity="0.06"/>
      <path d="M34 68 Q36 42 60 40 Q84 42 86 68 L84 88 Q60 84 36 88 Z" fill="currentColor" opacity="0.55"/>
      <ellipse cx="60" cy="110" rx="14" ry="10" fill="currentColor" opacity="0.75"/>
      <path d="M36 70 Q30 80 32 92" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M84 70 Q90 80 88 92" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4"/>
    </svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["festa", "trabalho", "encontro"]
  },
  {
    id: "coque-alto-bagunçado",
    nome: "Coque alto",
    descricao: "Sofisticado e jovem, alonga o pescoço",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="85" rx="26" ry="32" fill="currentColor" opacity="0.08"/>
      <rect x="52" y="114" width="16" height="16" rx="4" fill="currentColor" opacity="0.06"/>
      <path d="M34 73 Q36 47 60 45 Q84 47 86 73 L82 92 Q60 88 38 92 Z" fill="currentColor" opacity="0.50"/>
      <ellipse cx="60" cy="38" rx="18" ry="14" fill="currentColor" opacity="0.80"/>
      <path d="M46 44 Q40 50 42 58" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.35"/>
      <path d="M74 44 Q80 50 78 58" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.35"/>
    </svg>`,
    formatos: ["redondo", "quadrado", "oval"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "esporte", "praia"]
  },
  {
    id: "rabo-de-cavalo-baixo",
    nome: "Rabo de cavalo baixo",
    descricao: "Clássico, prático, combina com tudo",
    svg: `<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="72" rx="24" ry="28" fill="currentColor" opacity="0.07"/>
      <rect x="53" y="96" width="14" height="14" rx="3" fill="currentColor" opacity="0.05"/>
      <path d="M36 60 Q38 38 60 36 Q82 38 84 60 L82 80 Q60 76 38 80 Z"
            fill="currentColor" opacity="0.58"/>
      <ellipse cx="60" cy="95" rx="10" ry="5" fill="currentColor" opacity="0.85"/>
      <path d="M52 100 Q50 118 53 138 Q58 134 60 138 Q62 134 67 138 Q70 118 68 100 Z"
            fill="currentColor" opacity="0.68"/>
    </svg>`,
    formatos: ["oval", "alongado", "coracao", "redondo"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "esporte"]
  },
  {
    id: "rabo-de-cavalo-alto",
    nome: "Rabo de cavalo alto",
    descricao: "Energético, levanta o rosto",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="24" ry="30" fill="currentColor" opacity="0.18"/><circle cx="60" cy="74" r="17" fill="currentColor" opacity="0.4"/><path d="M60 44 Q48 30 42 12 Q54 36 60 44" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["redondo", "quadrado", "oval"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["esporte", "casual", "festa"]
  },
  {
    id: "trança-lateral",
    nome: "Trança lateral",
    descricao: "Romântica e delicada",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="78" rx="26" ry="32" fill="currentColor" opacity="0.08"/>
      <rect x="52" y="106" width="16" height="16" rx="4" fill="currentColor" opacity="0.06"/>
      <path d="M34 65 Q36 42 60 40 Q84 42 86 65 L84 88 Q60 84 36 88 Z" fill="currentColor" opacity="0.50"/>
      <path d="M84 82 Q88 92 84 104 Q88 112 84 124 Q88 134 84 148" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.70"/>
      <path d="M82 88 L86 92 M82 96 L86 100 M82 108 L86 112 M82 120 L86 124 M82 132 L86 136" stroke="currentColor" stroke-width="1" opacity="0.40"/>
    </svg>`,
    formatos: ["oval", "alongado", "redondo"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "encontro", "casual"]
  },
  {
    id: "trança-embutida",
    nome: "Trança embutida",
    descricao: "Sofisticada, ideal pra eventos",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="72" rx="26" ry="32" fill="currentColor" opacity="0.18"/><circle cx="60" cy="72" r="18" fill="currentColor" opacity="0.4"/><path d="M36 58 Q42 64 36 70 Q42 76 36 82 Q42 88 36 94" stroke="currentColor" stroke-width="2.4" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "coracao", "alongado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["festa", "encontro"]
  },
  {
    id: "ondas-soltas",
    nome: "Ondas soltas",
    descricao: "Romântico e despojado ao mesmo tempo",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="78" rx="26" ry="32" fill="currentColor" opacity="0.08"/>
      <rect x="52" y="106" width="16" height="16" rx="4" fill="currentColor" opacity="0.06"/>
      <path d="M34 65 Q36 42 60 40 Q84 42 86 65 L84 85 Q60 80 36 85 Z" fill="currentColor" opacity="0.45"/>
      <path d="M34 85 Q42 92 36 102 Q44 108 38 118 Q46 124 40 138" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.50"/>
      <path d="M86 85 Q78 92 84 102 Q76 108 82 118 Q74 124 80 138" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.50"/>
    </svg>`,
    formatos: ["oval", "quadrado", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["ondulado", "cacheado"],
    ocasioes: ["encontro", "festa", "casual", "praia"]
  },
  {
    id: "liso-solto",
    nome: "Liso solto",
    descricao: "Clean, minimalista, sempre elegante",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="78" rx="26" ry="32" fill="currentColor" opacity="0.08"/>
      <rect x="52" y="106" width="16" height="16" rx="4" fill="currentColor" opacity="0.06"/>
      <path d="M34 65 Q36 40 60 38 Q84 40 86 65 L86 148 Q68 152 60 152 Q52 152 34 148 Z" fill="currentColor" opacity="0.55"/>
      <path d="M60 38 L60 152" stroke="currentColor" stroke-width="0.8" opacity="0.15" fill="none"/>
    </svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso"],
    ocasioes: ["trabalho", "encontro", "festa", "casual"]
  },
  {
    id: "meio-preso",
    nome: "Meio preso",
    descricao: "Equilíbrio entre solto e arrumado",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="78" rx="26" ry="32" fill="currentColor" opacity="0.08"/>
      <rect x="52" y="106" width="16" height="16" rx="4" fill="currentColor" opacity="0.06"/>
      <path d="M34 75 L34 148 Q52 152 60 152 Q68 152 86 148 L86 75 Q60 80 34 75Z" fill="currentColor" opacity="0.45"/>
      <path d="M38 65 Q40 42 60 40 Q80 42 82 65 Q70 70 60 68 Q50 70 38 65Z" fill="currentColor" opacity="0.65"/>
      <ellipse cx="60" cy="67" rx="8" ry="4" fill="currentColor" opacity="0.85"/>
    </svg>`,
    formatos: ["oval", "quadrado", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "trabalho", "encontro"]
  },
  {
    id: "bob-curto",
    nome: "Bob curto",
    descricao: "Moderno, marcante, valoriza o rosto",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="78" rx="26" ry="32" fill="currentColor" opacity="0.08"/>
      <rect x="52" y="106" width="16" height="16" rx="4" fill="currentColor" opacity="0.06"/>
      <path d="M34 65 Q36 40 60 38 Q84 40 86 65 L86 102 Q68 108 60 108 Q52 108 34 102 Z" fill="currentColor" opacity="0.60"/>
      <path d="M34 100 Q60 106 86 100" stroke="currentColor" stroke-width="1" fill="none" opacity="0.30"/>
    </svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["curto"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["trabalho", "casual", "festa"]
  },
  {
    id: "pixie",
    nome: "Pixie cut",
    descricao: "Ousado, jovem, prático",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="90" rx="24" ry="28" fill="currentColor" opacity="0.07"/>
      <rect x="53" y="114" width="14" height="14" rx="3" fill="currentColor" opacity="0.05"/>
      <path d="M36 54 Q40 44 52 42 Q60 40 68 42 Q80 44 84 54 L86 70 L80 64 L72 72 L64 64 L56 72 L48 64 L40 72 L34 70 Z"
            fill="currentColor" opacity="0.60"/>
      <path d="M38 62 L38 86" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.25"/>
      <path d="M82 62 L82 86" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.25"/>
      <path d="M46 52 L46 74" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.20"/>
      <path d="M74 52 L74 74" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.20"/>
    </svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["curto"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "esporte"]
  },
  {
    id: "long-bob",
    nome: "Long bob (lob)",
    descricao: "Versátil, moderno, fica bem em tudo",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="90" rx="24" ry="28" fill="currentColor" opacity="0.07"/>
      <rect x="53" y="114" width="14" height="14" rx="3" fill="currentColor" opacity="0.05"/>
      <path d="M32 72 Q34 46 60 44 Q86 46 88 72 L88 108 Q68 116 60 116 Q52 116 32 108 Z"
            fill="currentColor" opacity="0.60"/>
      <path d="M32 106 Q60 114 88 106" stroke="currentColor" stroke-width="1" fill="none" opacity="0.25"/>
    </svg>`,
    formatos: ["oval", "redondo", "quadrado", "alongado", "coracao"],
    comprimentos: ["medio"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["trabalho", "casual", "encontro", "festa"]
  },
  {
    id: "franja-reta",
    nome: "Franja reta",
    descricao: "Marcante, alonga o olhar",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><rect x="34" y="50" width="52" height="14" fill="currentColor" opacity="0.65"/><rect x="34" y="66" width="52" height="76" rx="4" fill="currentColor" opacity="0.45"/></svg>`,
    formatos: ["oval", "alongado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso"],
    ocasioes: ["trabalho", "casual", "encontro"]
  },
  {
    id: "franja-lateral",
    nome: "Franja lateral",
    descricao: "Suaviza o rosto, versátil",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><path d="M34 50 Q48 46 78 58 L86 52 L86 66 L34 66 Z" fill="currentColor" opacity="0.65"/><rect x="34" y="66" width="52" height="76" rx="4" fill="currentColor" opacity="0.45"/></svg>`,
    formatos: ["redondo", "quadrado", "coracao"],
    comprimentos: ["curto", "medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "encontro"]
  },
  {
    id: "cachos-definidos",
    nome: "Cachos definidos",
    descricao: "Volume natural valorizado",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="95" rx="24" ry="28" fill="currentColor" opacity="0.07"/>
      <rect x="53" y="118" width="14" height="14" rx="3" fill="currentColor" opacity="0.05"/>
      <ellipse cx="60" cy="72" rx="40" ry="34" fill="currentColor" opacity="0.30"/>
      <circle cx="34" cy="70" r="9" fill="currentColor" opacity="0.55"/>
      <circle cx="48" cy="84" r="9" fill="currentColor" opacity="0.55"/>
      <circle cx="34" cy="98" r="9" fill="currentColor" opacity="0.55"/>
      <circle cx="86" cy="70" r="9" fill="currentColor" opacity="0.55"/>
      <circle cx="72" cy="84" r="9" fill="currentColor" opacity="0.55"/>
      <circle cx="86" cy="98" r="9" fill="currentColor" opacity="0.55"/>
      <circle cx="60" cy="108" r="9" fill="currentColor" opacity="0.55"/>
    </svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["casual", "festa", "encontro", "praia"]
  },
  {
    id: "puff-natural",
    nome: "Puff alto",
    descricao: "Realça o cabelo natural, marcante",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="100" rx="22" ry="26" fill="currentColor" opacity="0.07"/>
      <rect x="53" y="122" width="14" height="14" rx="3" fill="currentColor" opacity="0.05"/>
      <ellipse cx="60" cy="52" rx="40" ry="32" fill="currentColor" opacity="0.65"/>
      <ellipse cx="38" cy="44" rx="14" ry="12" fill="currentColor" opacity="0.20"/>
      <ellipse cx="82" cy="44" rx="14" ry="12" fill="currentColor" opacity="0.20"/>
      <ellipse cx="60" cy="28" rx="14" ry="10" fill="currentColor" opacity="0.20"/>
      <ellipse cx="60" cy="68" rx="18" ry="8" fill="currentColor" opacity="0.30"/>
    </svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["curto", "medio", "longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["festa", "trabalho", "encontro"]
  },
  {
    id: "tranças-box",
    nome: "Box braids",
    descricao: "Estilo afro com tranças finas e longas",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="68" rx="26" ry="28" fill="currentColor" opacity="0.2"/><line x1="38" y1="68" x2="38" y2="150" stroke="currentColor" stroke-width="2.4" opacity="0.6"/><line x1="48" y1="68" x2="48" y2="150" stroke="currentColor" stroke-width="2.4" opacity="0.6"/><line x1="58" y1="68" x2="58" y2="150" stroke="currentColor" stroke-width="2.4" opacity="0.6"/><line x1="68" y1="68" x2="68" y2="150" stroke="currentColor" stroke-width="2.4" opacity="0.6"/><line x1="78" y1="68" x2="78" y2="150" stroke="currentColor" stroke-width="2.4" opacity="0.6"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao", "quadrado"],
    comprimentos: ["longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["casual", "festa", "praia", "trabalho", "esporte", "encontro"]
  },
  {
    id: "twist-natural",
    nome: "Twist out",
    descricao: "Definição natural, volumoso e leve",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="68" rx="30" ry="32" fill="currentColor" opacity="0.2"/><path d="M36 60 Q42 72 36 84 Q42 96 36 110" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.6"/><path d="M55 56 Q60 68 55 80 Q60 92 55 110" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.6"/><path d="M75 60 Q80 72 75 84 Q80 96 75 110" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.6"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["cacheado", "crespo"],
    ocasioes: ["casual", "festa", "trabalho", "encontro"]
  },
  {
    id: "espace-coque",
    nome: "Space buns",
    descricao: "Divertido e jovial, com dois coques altos",
    svg: `<svg ${SVG_BASE_STYLE}>
      <ellipse cx="60" cy="95" rx="24" ry="28" fill="currentColor" opacity="0.07"/>
      <rect x="53" y="118" width="14" height="14" rx="3" fill="currentColor" opacity="0.05"/>
      <path d="M36 80 Q38 58 60 56 Q82 58 84 80 L82 96 Q60 92 38 96 Z"
            fill="currentColor" opacity="0.45"/>
      <circle cx="36" cy="44" r="16" fill="currentColor" opacity="0.80"/>
      <circle cx="84" cy="44" r="16" fill="currentColor" opacity="0.80"/>
      <ellipse cx="30" cy="39" rx="5" ry="4" fill="white" opacity="0.20"/>
      <ellipse cx="78" cy="39" rx="5" ry="4" fill="white" opacity="0.20"/>
    </svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "praia", "festa"]
  },
  {
    id: "rabo-baixo-volumoso",
    nome: "Rabo baixo volumoso",
    descricao: "Sofisticação com toque romântico",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="28" ry="30" fill="currentColor" opacity="0.18"/><circle cx="60" cy="74" r="18" fill="currentColor" opacity="0.4"/><ellipse cx="60" cy="130" rx="10" ry="22" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "trabalho", "encontro"]
  },
  {
    id: "trança-coroa",
    nome: "Trança coroa",
    descricao: "Romântica, ideal pra noivas e festas",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><path d="M34 60 Q48 46 60 50 Q72 46 86 60" stroke="currentColor" stroke-width="5" fill="none" opacity="0.7"/><circle cx="60" cy="74" r="17" fill="currentColor" opacity="0.4"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "encontro"]
  },
  {
    id: "molhado-praia",
    nome: "Wet hair",
    descricao: "Efeito molhado pra praia ou festa",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.2"/><path d="M34 68 L34 126 L86 126 L86 68" fill="currentColor" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao", "quadrado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["praia", "festa"]
  },
  {
    id: "coque-bailarina",
    nome: "Coque bailarina",
    descricao: "Clássico, limpo, elegante",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><circle cx="60" cy="74" r="17" fill="currentColor" opacity="0.4"/><circle cx="60" cy="48" r="12" fill="currentColor" opacity="0.75"/></svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["trabalho", "festa", "encontro"]
  },
  {
    id: "ondas-anos-50",
    nome: "Ondas vintage",
    descricao: "Hollywood waves, retrô e sofisticado",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><path d="M34 68 Q48 62 60 68 Q72 74 86 68" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.7"/><path d="M34 86 Q48 80 60 86 Q72 92 86 86" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.7"/><path d="M34 104 Q48 98 60 104 Q72 110 86 104" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["festa", "encontro"]
  },
  {
    id: "rabo-baixo-com-lenco",
    nome: "Rabo com lenço",
    descricao: "Charme casual com um toque de estilo",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><circle cx="60" cy="74" r="17" fill="currentColor" opacity="0.4"/><rect x="50" y="104" width="20" height="8" fill="currentColor" opacity="0.85"/><path d="M60 114 Q56 134 60 152" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.7"/></svg>`,
    formatos: ["oval", "alongado", "redondo", "coracao", "quadrado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["casual", "praia", "encontro"]
  },
  {
    id: "shag-cut",
    nome: "Shag cut",
    descricao: "Moderno, desestruturado, jovem",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><path d="M34 54 L36 66 L32 80 L36 94 L32 114 L88 114 L84 94 L88 80 L84 66 L86 54 Q72 40 60 40 Q48 40 34 54" fill="currentColor" opacity="0.55"/></svg>`,
    formatos: ["oval", "quadrado", "alongado"],
    comprimentos: ["curto", "medio"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "festa", "encontro"]
  },
  {
    id: "twist-meio-preso",
    nome: "Meio preso torcido",
    descricao: "Detalhe charmoso e descomplicado",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><circle cx="60" cy="74" r="17" fill="currentColor" opacity="0.4"/><path d="M36 68 Q48 64 60 56 Q72 64 84 68" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.7"/><path d="M34 80 L34 134 M86 80 L86 134" stroke="currentColor" stroke-width="3.5" opacity="0.5"/></svg>`,
    formatos: ["oval", "redondo", "quadrado", "coracao"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado"],
    ocasioes: ["casual", "trabalho", "encontro"]
  },
  {
    id: "topete-curto",
    nome: "Topete moderno",
    descricao: "Atitude, ousadia, marcante",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><path d="M48 40 Q60 24 72 40 L72 66 L48 66 Z" fill="currentColor" opacity="0.75"/><path d="M34 66 L34 120 L86 120 L86 66" fill="currentColor" opacity="0.5"/></svg>`,
    formatos: ["oval", "redondo", "coracao"],
    comprimentos: ["curto"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "trabalho", "casual"]
  },
  {
    id: "cabelo-com-acessorio",
    nome: "Tiara delicada",
    descricao: "Acessório que transforma qualquer look",
    svg: `<svg ${SVG_BASE_STYLE}>${FACE_BG}<ellipse cx="60" cy="74" rx="26" ry="32" fill="currentColor" opacity="0.15"/><rect x="34" y="66" width="52" height="76" rx="4" fill="currentColor" opacity="0.45"/><path d="M34 56 Q60 46 86 56" stroke="currentColor" stroke-width="3.5" fill="none" opacity="0.85"/></svg>`,
    formatos: ["oval", "redondo", "quadrado", "coracao", "alongado"],
    comprimentos: ["medio", "longo"],
    texturas: ["liso", "ondulado", "cacheado"],
    ocasioes: ["festa", "encontro", "casual"]
  }
];
