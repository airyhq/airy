import {SyntheticEvent} from 'react';

export const fallbackImage = (event: SyntheticEvent<HTMLImageElement, Event>, source: string) => {
  event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/${source}_avatar.svg`;

  event.currentTarget.alt = 'fallback image';
};
