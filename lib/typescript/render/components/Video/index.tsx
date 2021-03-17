import React from 'react';
import styles from './index.module.scss';
import {DefaultRenderingProps} from '../index';
import {fallbackImage} from 'sharedServices/fallbackImage';

type VideoRenderProps = DefaultRenderingProps & {
  videoUrl: string;
};

export const Video = ({videoUrl}: VideoRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.item}>
      <video
        className={styles.video}
        controls
        onError={(event: React.SyntheticEvent<HTMLVideoElement, Event>) => fallbackImage(event, 'media')}>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
);
