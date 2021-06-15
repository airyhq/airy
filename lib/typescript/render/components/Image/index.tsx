import React from 'react';
import {ImageWithFallback} from '../ImageWithFallback';
import {ImageContent} from '../../providers/facebook/facebookModel';
import styles from './index.module.scss';

type ImageRenderProps = {
  imageUrl?: string;
  images?: ImageContent[];
  altText?: string;
};

export const Image = ({imageUrl, altText, images}: ImageRenderProps) => (
  <div className={styles.wrapper}>
    {images ? (
      <div className={styles.imagesContainer}>
        {images.map(image => (
          <ImageWithFallback
            className={`${styles.messageListItemImageBlock} ${styles.images}`}
            src={image.imageUrl}
            key={image.imageUrl}
          />
        ))}
      </div>
    ) : (
      <ImageWithFallback className={styles.messageListItemImageBlock} src={imageUrl} alt={altText} />
    )}
  </div>
);
