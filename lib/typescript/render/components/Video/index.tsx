import React, {useEffect, useState} from 'react';
import {Text} from '../../components/Text';
import styles from './index.module.scss';

type VideoRenderProps = {
  videoUrl: string;
};

/**
 * This is a global list of videos that failed to load.
 * Sadly the render component is not able to fix wrong payloads in the
 * redux store and this is the only way for it to remember failed states
 * and not start flickering on every redraw of the messages
 */
const failedUrls = [];

export const Video = ({videoUrl}: VideoRenderProps) => {
  const [isVideoFailed, setVideoFailed] = useState(failedUrls.includes(videoUrl));

  useEffect(() => {
    setVideoFailed(failedUrls.includes(videoUrl));
  }, [videoUrl]);

  const loadingFailed = () => {
    failedUrls.push(videoUrl);
    setVideoFailed(true);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          {isVideoFailed ? (
            <div>Loading of video failed</div>
          ) : (
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              <video className={styles.video} controls preload="metadata" onError={loadingFailed}>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </a>
          )}
        </div>
      </div>
    </>
  );
};
