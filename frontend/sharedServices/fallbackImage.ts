import _, {SyntheticEvent} from 'react';
//import fallbackMediaImage from 'assets/images/not-found/fallback-media-image.svg';

export const fallbackImage = (
  event: SyntheticEvent<HTMLImageElement, Event> | SyntheticEvent<HTMLVideoElement, Event>,
  source: string
) => {
  event.currentTarget.src =
    source === 'media'
      ? 'assets/images/not-found/fallback-media-image.svg'
      : `https://s3.amazonaws.com/assets.airy.co/${source}_avatar.svg`;

  if ('alt' in event.currentTarget) event.currentTarget.alt = 'fallback image';
};
