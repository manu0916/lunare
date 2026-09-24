import type { ImgHTMLAttributes, SyntheticEvent } from 'react';
import { imageDimensions, optimizedImageSet } from '../../lib/images';

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  fallbackSrc?: string;
};

export function ResponsiveImage({ src, fallbackSrc = '/media/atmosfera-lunare.jpg', sizes = '(max-width: 700px) 92vw, 33vw', width, height, onError, ...props }: ResponsiveImageProps) {
  const [naturalWidth, naturalHeight] = imageDimensions(src);
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.srcset = '';
    if (!event.currentTarget.src.endsWith(fallbackSrc)) {
      event.currentTarget.src = fallbackSrc;
      if (event.currentTarget.alt) event.currentTarget.alt = 'Imagem ilustrativa temporariamente indisponível';
    }
    onError?.(event);
  };

  return <img {...props} src={src} srcSet={optimizedImageSet(src)} sizes={sizes} width={width ?? naturalWidth} height={height ?? naturalHeight} onError={handleError} />;
}
