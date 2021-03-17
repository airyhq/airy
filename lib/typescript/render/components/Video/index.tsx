import React from 'react';
import styles from './index.module.scss';
import {DefaultRenderingProps} from '../index';

type VideoRenderProps = DefaultRenderingProps & {
  videoUrl: string;
};

export const Video = ({videoUrl}: VideoRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.item}>
      <video className={styles.video} controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
);
