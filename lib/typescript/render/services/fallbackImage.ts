import _, {SyntheticEvent} from 'react';

export const fallbackImage = (event: SyntheticEvent<HTMLImageElement, Event>, source?: string) => {
  if (source === 'avatar') {
    event.currentTarget.src = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';
  } else {
    event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/fallbackMediaImage.svg`;
    event.currentTarget.style.objectFit = 'contain';
  }

  event.currentTarget.alt = 'fallback image';
};
