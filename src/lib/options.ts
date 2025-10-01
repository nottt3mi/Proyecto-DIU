export const COMUNAS: string[] = [
  "Santiago Centro",
  "Providencia",
  "Las Condes",
  "Ñuñoa",
  "La Florida",
  "Puente Alto",
  "Maipú",
  "Vitacura",
  "Lo Barnechea",
  "Independencia",
];

export const AREAS: string[] = [
  "Jardinería",
  "Reparaciones",
  "Limpieza",
  "Pintura",
  "Mudanzas",
  "Mantenimiento",
];

export const TRABAJOS_POR_AREA: Record<string, string[]> = {
  "Jardinería": [
    "Corte de pasto",
    "Poda de árboles",
    "Riego",
    "Diseño de jardines",
    "Mantención de áreas verdes",
  ],
  "Reparaciones": [
    "Plomería",
    "Electricidad",
    "Carpintería",
    "Gasfitería",
    "Cerrajería",
  ],
  "Limpieza": [
    "Limpieza general",
    "Limpieza profunda",
    "Lavado de alfombras",
    "Organización de espacios",
  ],
  "Pintura": [
    "Pintura interior",
    "Pintura exterior",
    "Empaste y lijado",
    "Reparación de muros",
  ],
  "Mudanzas": [
    "Empaque",
    "Transporte",
    "Armado de muebles",
    "Desarme de muebles",
  ],
  "Mantenimiento": [
    "Mantención preventiva",
    "Instalación de artefactos",
    "Sellos y siliconas",
  ],
};
