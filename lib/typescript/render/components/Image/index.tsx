import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../index';

type ImageRenderProps = DefaultMessageRenderingProps & {
  imageUrl: string;
  altText?: string;
};

export const Image = ({fromContact, imageUrl, altText}: ImageRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.messageListItem}>
      {!fromContact ? (
        <div className={styles.messageListItemMember}>
          <div className={styles.messageListItemMemberImage}>
            <img className={styles.messageListItemImageBlock} src={imageUrl} alt={altText ?? null} />
          </div>
        </div>
      ) : (
        <div className={styles.messageListUserContainer}>
          <div className={styles.messageListItemUser}>
            <div className={styles.messageListItemUserImage}>
              <img className={styles.messageListItemImageBlock} src={imageUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
