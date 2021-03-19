import React from 'react';
import styles from './index.module.scss';
import {MediaHeight} from '../../../providers/chatplugin/chatPluginModel';
import {fallbackImage} from '../../../services/fallbackImage';

export type MediaRenderProps = {
  height: MediaHeight;
  contentInfo: {
    altText?: string;
    fileUrl: string;
    forceRefresh: boolean;
  };
};

export const Media = ({height, contentInfo: {altText, fileUrl}}: MediaRenderProps) => (
  <img
    src={fileUrl}
    alt={altText}
    className={`${styles.mediaImage} ${
      height === MediaHeight.tall ? styles.tall : height === MediaHeight.medium ? styles.medium : styles.short
    }`}
    onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => fallbackImage(event)}
  />
);
