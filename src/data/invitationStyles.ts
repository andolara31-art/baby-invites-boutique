export type InvitePalette = {
  bg1: string;
  bg2: string;
  accent: string;
  soft: string;
  ink: string;
  muted: string;
  chips: string[];
};

export type PaletteVariant = {
  id: string;
  name: string;
  bg: string;
  accent: string;
  secondary: string;
  soft: string;
  text: string;
};

export type InvitationStyle = {
  id: string;
  name: string;
  shortName: string;
  phrase: string;
  description: string;
  emotionalTone: string;
  targetMom: string;
  price: number;
  palette: InvitePalette;
  background: string;
  typographyMood: string;
  visualElements: string[];
  animationSignature: string;
  demoData: {
    babyName: string;
    date: string;
    dateInput: string;
    time: string;
    place: string;
    address: string;
    parents: string;
  };
  category: string;
  whatsappMessage: string;
};

const demoData = {
  babyName: "Baby Isabella",
  date: "Domingo 26 de mayo",
  dateInput: "2026-05-26",
  time: "14:30",
  place: "Terraza Rosé",
  address: "Heredia, Costa Rica",
  parents: "Mamá & Papá"
};

export const invitationStyles: InvitationStyle[] = [
  {
    id: "honey",
    name: "Dulce Espera",
    shortName: "Dulce",
    phrase: "Una dulce bendición está en camino.",
    description: "Honey bear con miel, osito genérico, abejitas, crema y blush.",
    emotionalTone: "Tierna, cálida, dulce y coqueta.",
    targetMom: "Para mamás que quieren una invitación acogedora y dulce.",
    price: 10,
    palette: { bg1: "#fff4dd", bg2: "#f5e1bd", accent: "#7a4f1f", soft: "#d4a574", ink: "#3d2410", muted: "#7a4f1f", chips: ["#fff4dd", "#f5e1bd", "#d4a574", "#e8a89a", "#7a4f1f"] },
    background: "Fondo crema cálido con textura de papel, miel dorada y puntos suaves.",
    typographyMood: "Serif cálida con detalles script delicados.",
    visualElements: ["osito genérico", "gotas de miel", "abejitas sutiles", "lazos blush"],
    animationSignature: "Miel cayendo suave, abejitas flotando y texto con fade cálido.",
    demoData,
    category: "Honey & Cream",
    whatsappMessage: "Hola, quiero una invitación digital estilo Dulce Espera."
  },
  {
    id: "floral",
    name: "Jardín de Amor",
    shortName: "Jardín",
    phrase: "Un nuevo amor está por florecer.",
    description: "Floral blush luxury con peonías, pétalos y champagne.",
    emotionalTone: "Romántica, femenina, boutique y delicada.",
    targetMom: "Para mamás que buscan una estética floral editorial.",
    price: 10,
    palette: { bg1: "#fff6f2", bg2: "#f5dcd5", accent: "#8a4f4f", soft: "#e8b4b0", ink: "#5c2a2a", muted: "#8a4f4f", chips: ["#fff6f2", "#f5cfc9", "#e8b4b0", "#c4a47c", "#8a4f4f"] },
    background: "Flores acuarela sobre papel fino con detalles champagne.",
    typographyMood: "Editorial romántica con serif elegante e itálica.",
    visualElements: ["peonías", "pétalos flotando", "papel fino", "líneas botánicas"],
    animationSignature: "Pétalos cayendo, flores apareciendo y reveal elegante del nombre.",
    demoData,
    category: "Floral Blush",
    whatsappMessage: "Hola, quiero una invitación digital estilo Jardín de Amor."
  },
  {
    id: "minimal",
    name: "Pequeño Milagro",
    shortName: "Milagro",
    phrase: "Lo más pequeño puede cambiarlo todo.",
    description: "Minimal chic con blanco cálido, dorado, luna y estrellas.",
    emotionalTone: "Moderna, limpia, emocional y premium.",
    targetMom: "Para mamás que prefieren algo sobrio, limpio y muy elegante.",
    price: 10,
    palette: { bg1: "#faf6f0", bg2: "#ede1cf", accent: "#a08560", soft: "#c9a876", ink: "#3a2a1a", muted: "#a08560", chips: ["#faf6f0", "#ede1cf", "#c9a876", "#f6ead8", "#3a2a1a"] },
    background: "Blanco cálido con luna fina, shimmer suave y mucho aire.",
    typographyMood: "Minimalista, respirada y sofisticada.",
    visualElements: ["luna fina", "estrellas doradas", "lazo minimal", "gris perla"],
    animationSignature: "Shimmer suave, estrellas sutiles y fade limpio.",
    demoData,
    category: "Minimal Moon",
    whatsappMessage: "Hola, quiero una invitación digital estilo Pequeño Milagro."
  },
  {
    id: "celestial",
    name: "Celestial Baby",
    shortName: "Celestial",
    phrase: "Una estrellita viene en camino.",
    description: "Luna, estrellas, nubes crema y azul noche suave.",
    emotionalTone: "Mágica, elegante, tierna y celestial.",
    targetMom: "Para una celebración soñadora con estética nocturna delicada.",
    price: 10,
    palette: { bg1: "#273047", bg2: "#111827", accent: "#d6b878", soft: "#7f8ea8", ink: "#fff9ee", muted: "#f8ead5", chips: ["#f8ead5", "#d6b878", "#7f8ea8", "#273047", "#111827"] },
    background: "Cielo nocturno suave con luna dorada, nubes crema y glow delicado.",
    typographyMood: "Serif poética con contraste nocturno refinado.",
    visualElements: ["luna dorada", "estrellas finas", "nubes crema", "glow delicado"],
    animationSignature: "Estrellas titilando, nubes flotando y reveal de luna.",
    demoData,
    category: "Soft Night",
    whatsappMessage: "Hola, quiero una invitación digital estilo Celestial Baby."
  },
  {
    id: "safari",
    name: "Safari Tierno",
    shortName: "Safari",
    phrase: "Una pequeña aventura está por comenzar.",
    description: "Animales bebé, beige, verde salvia y aventura suave.",
    emotionalTone: "Tierna, natural, alegre y aventurera.",
    targetMom: "Para baby showers naturales, neutros o con temática animalitos.",
    price: 10,
    palette: { bg1: "#f5ead8", bg2: "#d9c29d", accent: "#6d7b55", soft: "#9caf88", ink: "#4c3a28", muted: "#6d7b55", chips: ["#f5ead8", "#d9c29d", "#9caf88", "#b37a4c", "#4c3a28"] },
    background: "Papel natural con hojas salvia, animalitos y textura arena.",
    typographyMood: "Cálida, orgánica y amable.",
    visualElements: ["jirafa bebé", "elefantito genérico", "hojas suaves", "textura natural"],
    animationSignature: "Hojas moviéndose y animales flotando de forma elegante.",
    demoData,
    category: "Soft Safari",
    whatsappMessage: "Hola, quiero una invitación digital estilo Safari Tierno."
  },
  {
    id: "coquette",
    name: "Mariposa Coquette",
    shortName: "Coquette",
    phrase: "Un amor hermoso está por volar.",
    description: "Mariposas, rosa, lila, lazos y brillo suave.",
    emotionalTone: "Coqueta, femenina, delicada y llamativa.",
    targetMom: "Para mamás que quieren una invitación dulce, femenina y memorable.",
    price: 10,
    palette: { bg1: "#fff5f8", bg2: "#ead7f6", accent: "#8b557a", soft: "#d8b7ec", ink: "#6f4664", muted: "#8b557a", chips: ["#fff5f8", "#f4c8df", "#d8b7ec", "#d5b985", "#6f4664"] },
    background: "Rosa blush y lila pastel con mariposas, lazos finos y destellos pequeños.",
    typographyMood: "Romántica con brillo suave y acento editorial.",
    visualElements: ["mariposas suaves", "lazos finos", "lila pastel", "destellos champagne"],
    animationSignature: "Mariposas flotando, brillo suave y texto con entrada delicada.",
    demoData,
    category: "Butterfly Blush",
    whatsappMessage: "Hola, quiero una invitación digital estilo Mariposa Coquette."
  }
];

export const stylePalettes: Record<string, PaletteVariant[]> = {
  honey: [
    { id: "cream", name: "Cream", bg: "#F8F1E7", accent: "#C9A77A", secondary: "#E9D8C5", soft: "#FFF7EA", text: "#2D2926" },
    { id: "blush", name: "Blush", bg: "#F8E8EC", accent: "#B98596", secondary: "#F3D4DC", soft: "#FFEFF4", text: "#3E292B" },
    { id: "caramel", name: "Caramel", bg: "#F7E1B8", accent: "#A66C32", secondary: "#E4BE7F", soft: "#FFF0D1", text: "#3D2410" }
  ],
  floral: [
    { id: "porcelain", name: "Porcelain", bg: "#FFF6F2", accent: "#8A4F4F", secondary: "#F5CFC9", soft: "#FFE6E0", text: "#4B2725" },
    { id: "champagne", name: "Champagne", bg: "#FAEBDD", accent: "#B58A5E", secondary: "#EAD1B8", soft: "#FFF5EA", text: "#4A3324" },
    { id: "mauve", name: "Mauve", bg: "#F6E8EE", accent: "#936172", secondary: "#DDBAC7", soft: "#FFF0F5", text: "#4B2D37" }
  ],
  minimal: [
    { id: "ivory", name: "Ivory", bg: "#FAF6F0", accent: "#A08560", secondary: "#EDE1CF", soft: "#FFF8EF", text: "#3A2A1A" },
    { id: "pearl", name: "Pearl", bg: "#F4F1EC", accent: "#A9A093", secondary: "#DED8CF", soft: "#FFFFFF", text: "#2F2B26" },
    { id: "gold", name: "Gold", bg: "#FFF8E9", accent: "#C9A876", secondary: "#EAD8AD", soft: "#FFF2C8", text: "#3A2A1A" }
  ],
  celestial: [
    { id: "night", name: "Night", bg: "#273047", accent: "#D6B878", secondary: "#111827", soft: "#7F8EA8", text: "#FFF9EE" },
    { id: "sky", name: "Sky", bg: "#EAF1F8", accent: "#8CA8C5", secondary: "#D8E5F0", soft: "#FFFFFF", text: "#253044" },
    { id: "moon", name: "Moon", bg: "#F8EAD5", accent: "#C8A869", secondary: "#DED1C4", soft: "#FFF7E9", text: "#2E2A24" }
  ],
  safari: [
    { id: "sage", name: "Sage", bg: "#F5EAD8", accent: "#6D7B55", secondary: "#D9C29D", soft: "#C8D2AF", text: "#4C3A28" },
    { id: "sand", name: "Sand", bg: "#F7E8D1", accent: "#B37A4C", secondary: "#D7B98B", soft: "#FFF0D8", text: "#3D2F22" },
    { id: "leaf", name: "Leaf", bg: "#EFF3E4", accent: "#7F946A", secondary: "#D1DDBF", soft: "#FFFFFF", text: "#35432C" }
  ],
  coquette: [
    { id: "rose", name: "Rose", bg: "#FFF5F8", accent: "#8B557A", secondary: "#F4C8DF", soft: "#D8B7EC", text: "#6F4664" },
    { id: "lilac", name: "Lilac", bg: "#F7EEFF", accent: "#8D6AAE", secondary: "#D8B7EC", soft: "#FFFFFF", text: "#4E375E" },
    { id: "butter", name: "Butter", bg: "#FFF7EC", accent: "#D0A76B", secondary: "#F7D9BE", soft: "#FFEFF6", text: "#6A4B30" }
  ]
};
