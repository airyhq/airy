import _, {SyntheticEvent} from 'react';

export const fallbackImage = (event: SyntheticEvent<HTMLImageElement, Event>, channelSource: string) => {
  event.currentTarget.src = `https://s3.amazonaws.com/assets.airy.co/${channelSource}_avatar.svg`;
  event.currentTarget.alt = 'fallback image';
};
