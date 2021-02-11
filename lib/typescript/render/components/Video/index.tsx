import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../index';

type VideoRenderProps = DefaultMessageRenderingProps & {
  videoUrl: string;
};

export const Video = ({fromContact, videoUrl}: VideoRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.item}>
      {!fromContact ? (
        <div className={styles.itemMember}>
          <div className={styles.itemMemberVideo}>
            <video className={styles.video} controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.itemUser}>
            <div className={styles.itemUserVideo}>
              <video className={styles.video} controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
