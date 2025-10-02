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

export const REGIONES: string[] = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana de Santiago",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén del General Carlos Ibáñez del Campo",
  "Región de Magallanes y de la Antártica Chilena",
];

export const COMUNAS_POR_REGION: Record<string, string[]> = {
  "Región Metropolitana de Santiago": [
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
  ],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Región del Biobío": ["Concepción", "Chillán", "Los Ángeles"],
};
