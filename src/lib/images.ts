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
};

export const imageBaseName = (src: string) => src.split('/').at(-1)?.replace(/\.[^.]+$/, '') ?? '';

export const imageDimensions = (src: string) => dimensions[imageBaseName(src)] ?? [720, 900] as const;

export const optimizedImageSet = (src: string) => {
  const name = imageBaseName(src);
  if (!dimensions[name]) return undefined;
  return `/images/food/w720/${name}.webp 720w, /images/food/w1440/${name}.webp 1440w`;
};
