import React from 'react';
import styles from './index.module.scss';

export enum MediaHeight {
  short = 'SHORT',
  medium = 'MEDIUM',
  tall = 'TALL',
}

export type MediaRenderProps = {
  contentInfo: {
    altText: string;
    fileUrl: string;
    forceRefresh: boolean;
    height: MediaHeight;
  };
};

export const Media = ({contentInfo: {altText, fileUrl}}: MediaRenderProps) => (
  <img src={fileUrl} alt={altText} className={styles.mediaImage} />
);

// `${styles.mediaImage}, ${height === 'SHORT' ?
// styles.heightShort : height === 'TALL' ? styles.heightTall : styles.heightMedium}`
