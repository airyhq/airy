import _, {SyntheticEvent} from 'react';

export const fallbackImage = (event: SyntheticEvent<HTMLImageElement, Event>, source: string) => {
  event.currentTarget.src =
    source === 'mediaImage'
      ? `https://s3.amazonaws.com/assets.airy.co/fallbackMediaImage.svg`
      : `https://s3.amazonaws.com/assets.airy.co/${source}_avatar.svg`;

  if (source === 'mediaImage') {
    event.currentTarget.style.objectFit = 'contain';
  }

  event.currentTarget.alt = 'fallback image';
};
