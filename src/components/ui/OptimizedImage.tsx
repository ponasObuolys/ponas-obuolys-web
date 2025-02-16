import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({ src, alt, className = '', width, height }: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if the image is a YouTube thumbnail
    const isYouTubeThumbnail = src.includes('i.ytimg.com');
    
    if (isYouTubeThumbnail) {
      // For YouTube thumbnails, use them directly without WebP conversion
      setImageSrc(src);
      setLoading(false);
      return;
    }

    // For other images, attempt WebP conversion
    const convertToWebP = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              setImageSrc(src);
              setLoading(false);
              return;
            }
            
            ctx.drawImage(img, 0, 0);
            
            if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
              const webpDataUrl = canvas.toDataURL('image/webp', 0.9);
              setImageSrc(webpDataUrl);
            } else {
              setImageSrc(src);
            }
          } catch (e) {
            console.warn('WebP conversion failed, using original image:', e);
            setImageSrc(src);
          } finally {
            setLoading(false);
          }
        };

        img.onerror = () => {
          console.warn('Image loading failed, using original source');
          setImageSrc(src);
          setLoading(false);
          setError(true);
        };

        img.src = src;
      } catch (error) {
        console.error('Error in image processing:', error);
        setImageSrc(src);
        setLoading(false);
        setError(true);
      }
    };

    convertToWebP();
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        loading ? 'opacity-0' : 'opacity-100',
        error ? 'grayscale' : '',
        className
      )}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}

// Pavyzdys kaip naudoti:
/*
<OptimizedImage
  src="/large-image.jpg"
  placeholderSrc="/small-blur-image.jpg"
  alt="Aprašymas"
  className="w-full h-64 object-cover"
/>
*/ 