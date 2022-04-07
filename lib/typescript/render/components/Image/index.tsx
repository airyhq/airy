import React from 'react';
import {ImageWithFallback} from '../ImageWithFallback';
import {ImageContent} from '../../providers/facebook/facebookModel';
import {Text} from '../../components/Text';
import styles from './index.module.scss';

type ImageRenderProps = {
  imageUrl?: string;
  images?: ImageContent[];
  altText?: string;
  text?: string;
  fromContact?: boolean;
};

export const Image = ({imageUrl, altText, images, text, fromContact}: ImageRenderProps) => (
  <>
    <div className={styles.wrapper}>
      {images ? (
        <div className={styles.imagesContainer}>
          {images.map((image, index) => (
            <ImageWithFallback
              className={`${styles.messageListItemImageBlock} ${styles.images}`}
              src={image.imageUrl}
              key={image.imageUrl + index}
            />
          ))}
        </div>
      ) : (
        <ImageWithFallback className={styles.messageListItemImageBlock} src={imageUrl} alt={altText} />
      )}
    </div>

    {text && <Text text={text} fromContact={fromContact} />}
  </>
);
