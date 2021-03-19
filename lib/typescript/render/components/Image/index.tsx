import React from 'react';
import styles from './index.module.scss';
import {fallbackImage} from 'sharedServices/fallbackImage';

type ImageRenderProps = {
  imageUrl: string;
  altText?: string;
};

export const Image = ({imageUrl, altText}: ImageRenderProps) => (
  <div className={styles.wrapper}>
    <img
      className={styles.messageListItemImageBlock}
      src={imageUrl}
      alt={altText ?? null}
      onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => fallbackImage(event, 'mediaImage')}
    />
  </div>
);
