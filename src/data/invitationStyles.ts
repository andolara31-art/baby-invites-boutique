export type InvitationStyle = {
  id: string;
  name: string;
  shortName: string;
  phrase: string;
  description: string;
  emotionalTone: string;
  targetMom: string;
  price: number;
  palette: string[];
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

export const invitationStyles: InvitationStyle[] = [
  {
    id: "honey",
    name: "Dulce Espera",
    shortName: "Dulce",
    phrase: "Una dulce bendición está en camino.",
    description: "Honey bear, miel, osito genérico, abejitas, crema y blush.",
    emotionalTone: "Tierna, cálida, dulce y coqueta.",
    targetMom: "Para mamás que quieren una invitación acogedora y dulce.",
    price: 10,
    palette: ["#fff4dd", "#f5e1bd", "#d4a574", "#e8a89a", "#7a4f1f"],
    background: "Fondo crema cálido con textura de papel, miel dorada y puntos suaves.",
    typographyMood: "Serif cálida con detalles script delicados.",
    visualElements: ["osito genérico", "gotas de miel", "abejitas sutiles", "lazos blush"],
    animationSignature: "Miel cayendo suave, abejitas flotando y texto con fade cálido.",
    demoData: {
      babyName: "Baby Isabella",
      date: "Domingo 26 de mayo",
      dateInput: "2026-05-26",
      time: "14:30",
      place: "Terraza Rosé",
      address: "Heredia, Costa Rica",
      parents: "Mamá & Papá"
    },
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
    palette: ["#fff6f2", "#f5cfc9", "#e8b4b0", "#c4a47c", "#8a4f4f"],
    background: "Flores acuarela sobre papel fino con detalles champagne.",
    typographyMood: "Editorial romántica con serif elegante e itálica.",
    visualElements: ["peonías", "pétalos flotando", "papel fino", "líneas botánicas"],
    animationSignature: "Pétalos cayendo, flores apareciendo y reveal elegante del nombre.",
    demoData: {
      babyName: "Baby Isabella",
      date: "Domingo 26 de mayo",
      dateInput: "2026-05-26",
      time: "14:30",
      place: "Terraza Rosé",
      address: "Heredia, Costa Rica",
      parents: "Mamá & Papá"
    },
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
    palette: ["#faf6f0", "#ede1cf", "#c9a876", "#f6ead8", "#3a2a1a"],
    background: "Blanco cálido con luna fina, shimmer suave y mucho aire.",
    typographyMood: "Minimalista, respirada y sofisticada.",
    visualElements: ["luna fina", "estrellas doradas", "lazo minimal", "gris perla"],
    animationSignature: "Shimmer suave, estrellas sutiles y fade limpio.",
    demoData: {
      babyName: "Baby Isabella",
      date: "Domingo 26 de mayo",
      dateInput: "2026-05-26",
      time: "14:30",
      place: "Terraza Rosé",
      address: "Heredia, Costa Rica",
      parents: "Mamá & Papá"
    },
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
    palette: ["#f8ead5", "#d6b878", "#7f8ea8", "#273047", "#111827"],
    background: "Cielo nocturno suave con luna dorada, nubes crema y glow delicado.",
    typographyMood: "Serif poética con contraste nocturno refinado.",
    visualElements: ["luna dorada", "estrellas finas", "nubes crema", "glow delicado"],
    animationSignature: "Estrellas titilando, nubes flotando y reveal de luna.",
    demoData: {
      babyName: "Baby Isabella",
      date: "Domingo 26 de mayo",
      dateInput: "2026-05-26",
      time: "14:30",
      place: "Terraza Rosé",
      address: "Heredia, Costa Rica",
      parents: "Mamá & Papá"
    },
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
    palette: ["#f5ead8", "#d9c29d", "#9caf88", "#b37a4c", "#4c3a28"],
    background: "Papel natural con hojas salvia, animalitos y textura arena.",
    typographyMood: "Cálida, orgánica y amable.",
    visualElements: ["jirafa bebé", "elefantito genérico", "hojas suaves", "textura natural"],
    animationSignature: "Hojas moviéndose y animales flotando de forma elegante.",
    demoData: {
      babyName: "Baby Isabella",
      date: "Domingo 26 de mayo",
      dateInput: "2026-05-26",
      time: "14:30",
      place: "Terraza Rosé",
      address: "Heredia, Costa Rica",
      parents: "Mamá & Papá"
    },
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
    palette: ["#fff5f8", "#f4c8df", "#d8b7ec", "#d5b985", "#6f4664"],
    background: "Rosa blush y lila pastel con mariposas, lazos finos y destellos pequeños.",
    typographyMood: "Romántica con brillo suave y acento editorial.",
    visualElements: ["mariposas suaves", "lazos finos", "lila pastel", "destellos champagne"],
    animationSignature: "Mariposas flotando, brillo suave y texto con entrada delicada.",
    demoData: {
      babyName: "Baby Isabella",
      date: "Domingo 26 de mayo",
      dateInput: "2026-05-26",
      time: "14:30",
      place: "Terraza Rosé",
      address: "Heredia, Costa Rica",
      parents: "Mamá & Papá"
    },
    category: "Butterfly Blush",
    whatsappMessage: "Hola, quiero una invitación digital estilo Mariposa Coquette."
  }
];
