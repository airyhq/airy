import React from 'react';

import {MediaHeight} from '../../../chatPluginModel';
import {ImageWithFallback} from 'render/components/ImageWithFallback';

import styles from './index.module.scss';

export type MediaRenderProps = {
  height: MediaHeight;
  contentInfo: {
    altText?: string;
    fileUrl: string;
    forceRefresh: boolean;
  };
};

const getHeight = (height: MediaHeight): string => {
  switch (height) {
    case MediaHeight.short:
      return styles.short;
    case MediaHeight.medium:
      return styles.medium;
    case MediaHeight.tall:
      return styles.tall;
    default:
      return styles.medium;
  }
};

export const Media = ({height, contentInfo: {altText, fileUrl}}: MediaRenderProps) => (
  <ImageWithFallback src={fileUrl} alt={altText} className={`${styles.mediaImage} ${getHeight(height)}`} isTemplate />
);
