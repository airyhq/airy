import React from 'react';
import {ImageWithFallback} from '../ImageWithFallback';
import styles from './index.module.scss';

type ImageRenderProps = {
  imageUrl: string;
  altText?: string;
};

export const Image = ({imageUrl, altText}: ImageRenderProps) => (
  <div className={styles.wrapper}>
    <ImageWithFallback className={styles.messageListItemImageBlock} src={imageUrl} alt={altText} />
  </div>
);
