import React, {useEffect, useState} from 'react';

type ImageRenderProps = {
  src: string;
  alt?: string;
  className?: string;
  isTemplate?: boolean;
};

/**
 * This is a global list of images that failed to load.
 * Sadly the render component is not able to fix wrong payloads in the
 * redux store and this is the only way for it to remember failed states
 * and not start flickering on every redraw of the messages
 */
const failedUrls = [];

export const ImageWithFallback = ({src, alt, className, isTemplate}: ImageRenderProps) => {
  const [imageFailed, setImageFailed] = useState(failedUrls.includes(src));

  useEffect(() => {
    setImageFailed(failedUrls.includes(src));
  }, [src]);

  const loadingFailed = () => {
    failedUrls.push(src);
    setImageFailed(true);
  };

  return (
    <>
      {isTemplate ? (
        <img
          className={className}
          src={imageFailed ? 'https://s3.amazonaws.com/assets.airy.co/fallbackMediaImage.svg' : src}
          alt={imageFailed ? 'The image failed to load' : alt}
          onError={() => loadingFailed()}
        />
      ) : (
        <a href={src} target="_blank" rel="noopener noreferrer">
          <img
            className={className}
            src={imageFailed ? 'https://s3.amazonaws.com/assets.airy.co/fallbackMediaImage.svg' : src}
            alt={imageFailed ? 'The image failed to load' : alt}
            onError={() => loadingFailed()}
          />
        </a>
      )}
    </>
  );
};
