import React from 'react';
import styles from './index.module.scss';
import {MediaHeight} from '../../providers/chatplugin/chatPluginModel';

export type MediaRenderProps = {
  height?: MediaHeight;
  altText?: string;
  fileUrl: string;
  isRichCard?: boolean;
};

const imageElements = element => element === 'jpg' || element === 'png' || element === 'jpeg' || element === 'gif';

const isImage = url => url.split('.').some(imageElements);
const isVideo = url => url.split('.').some(element => element === 'mp4');

export const Media = ({height, altText, fileUrl, isRichCard}: MediaRenderProps) => {
  if (isImage(fileUrl)) {
    return (
      <img
        src={fileUrl}
        alt={altText}
        className={`${isRichCard ? styles.richCardImage : styles.image} ${
          height === MediaHeight.tall ? styles.tall : height === MediaHeight.short ? styles.short : styles.medium
        }`}
      />
    );
  }

  if (isVideo(fileUrl)) {
    return (
      <video
        className={`${isRichCard ? styles.richCardVideo : styles.video} ${
          height === MediaHeight.tall ? styles.tall : height === MediaHeight.short ? styles.short : styles.medium
        }`}
        controls>
        <source src={fileUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};
