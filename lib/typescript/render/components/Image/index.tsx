import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../index';

type ImageRenderProps = DefaultMessageRenderingProps & {
  imageUrl: string;
  altText?: string;
};

export const Image = ({imageUrl, altText}: ImageRenderProps) => (
  <div className={styles.wrapper}>
    <img className={styles.messageListItemImageBlock} src={imageUrl} alt={altText ?? null} />
  </div>
);
