import React from 'react';
import styles from './index.module.scss';
import {MediaHeight} from '../../providers/chatplugin/chatPluginModel';

export type MediaRenderProps = {
  height?: MediaHeight;
  altText: string;
  fileUrl: string;
  isRichCard: boolean;
};

const isImagePng = url => url.split('.').includes('png');
const isImageJpg = url => url.split('.').includes('jpg');
const isVideo = url => url.split('.').includes('mp4');

export const Media = ({height, altText, fileUrl, isRichCard}: MediaRenderProps) => {
  if (isImagePng(fileUrl) || isImageJpg(fileUrl)) {
    return (
      <img
        src={fileUrl}
        alt={altText}
        className={`${isRichCard ? styles.richCardImage : styles.mediaImage} ${
          height === MediaHeight.tall ? styles.tall : height === MediaHeight.short ? styles.short : styles.medium
        }`}
      />
    );
  }

  if (isVideo(fileUrl)) {
    return (
      <video className={styles.video}>
        <source src={fileUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};
