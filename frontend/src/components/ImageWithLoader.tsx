import { useState, useEffect, useRef } from "react";
import { ImageIcon } from "lucide-react";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

const ImageWithLoader = ({
  src,
  alt,
  className,
  containerClassName,
}: ImageWithLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-lg bg-gray-100">
          <ImageIcon className="h-10 w-10 text-gray-400" />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 rounded-lg ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </div>
  );
};

export default ImageWithLoader;