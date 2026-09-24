const dimensions: Record<string, [number, number]> = {
  'atmosfera-lunare': [1440, 1800],
  'combinado-caixas': [1440, 1800],
  'embalagem-lunare': [1440, 1760],
  'experiencia-lunar': [1440, 1440],
  'hossomaki-detalhe': [1170, 1147],
  'hot-dourado': [1440, 1800],
  'hot-roll': [1440, 1800],
  'niguiri-especial': [1440, 1800],
  'sashimi-flor': [1440, 1800],
  'category-entradas': [300, 300],
  'category-combinados': [300, 683],
  'category-hossomaki': [300, 533],
  'category-uramaki': [300, 533],
  'category-hot-roll': [300, 533],
  'category-jyo': [300, 272],
  'category-sashimi': [300, 300],
  'category-niguiri': [300, 300],
  'category-temaki': [300, 295],
  'category-bebidas': [300, 533],
  'sashimi-lemon': [300, 533],
  'ceviche-salmao': [300, 533],
  sunomono: [300, 300],
  'saturno-60': [300, 650],
  'mercurio-jv-16': [300, 650],
  'urano-10': [300, 347],
  'sol-20': [300, 394],
  'jupiter-28': [300, 385],
  'marte-24': [300, 305],
  'hosso-philadelphia': [300, 533],
  'hosso-tartare-lemon': [300, 533],
  'uramaki-philadelphia': [300, 533],
  'uramaki-grelhado': [300, 533],
  'uramaki-tartare': [300, 533],
  'uramaki-especial': [300, 300],
  'hot-philadelphia': [300, 294],
  'hot-grelhado': [300, 301],
  'hot-biquinho': [300, 334],
  'hot-especial': [300, 304],
  'jyo-philadelphia': [300, 272],
  'jyo-macaricado': [300, 369],
  'sashimi-salmao': [300, 300],
  'sashimi-macaricado': [300, 288],
  'niguiri-salmao': [300, 534],
  'temaki-philadelphia': [300, 295],
  'temaki-grelhado': [300, 264],
  agua: [300, 533],
  refrigerante: [300, 533],
};

export const imageBaseName = (src: string) => src.split('/').at(-1)?.replace(/\.[^.]+$/, '') ?? '';

export const imageDimensions = (src: string) => dimensions[imageBaseName(src)] ?? [720, 900] as const;

export const optimizedImageSet = (src: string) => {
  const name = imageBaseName(src);
  if (!src.startsWith('/media/') || !dimensions[name]) return undefined;
  return `/images/food/w720/${name}.webp 720w, /images/food/w1440/${name}.webp 1440w`;
};
