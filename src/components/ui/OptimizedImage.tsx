import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  placeholderSrc,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    // Sukuriame naują paveikslėlį
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    return () => {
      // Išvalome event listener
      img.onload = null;
    };
  }, [src]);

  return (
    <div className="relative overflow-hidden">
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0',
          className
        )}
        loading="lazy"
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
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