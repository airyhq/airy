import React from 'react';
import {WhatsAppMediaType} from '../../../MetaModel';
import {ImageWithFallback, Video, File} from '../../../../../components';
import {AudioClip} from 'components';
import styles from './index.module.scss';

interface WhatsAppMediaProps {
  mediaType: WhatsAppMediaType;
  link: string;
  caption?: string;
}

const defaultText = 'N/A';

export const WhatsAppMedia = ({mediaType, link, caption}: WhatsAppMediaProps) => {
  return (
    <div className={styles.mediaWrapper}>
      <WhatsAppMediaContent mediaType={mediaType} link={link} caption={caption} />
    </div>
  );
};

export const WhatsAppMediaContent = ({mediaType, link, caption}: WhatsAppMediaProps) => {
  let mediaContent = <p>{defaultText}</p>;

  if (mediaType === 'image' || mediaType === 'sticker') {
    mediaContent = (
      <>
        <ImageWithFallback src={link} />{' '}
        {caption && mediaType === 'image' ? <p className={styles.caption}>{caption}</p> : null}
      </>
    );
  }

  if (mediaType === WhatsAppMediaType.video) {
    mediaContent = (
      <>
        <Video videoUrl={link} />
        {caption ? <p className={styles.caption}>{caption}</p> : null}{' '}
      </>
    );
  }

  if (mediaType === WhatsAppMediaType.document) {
    mediaContent = (
      <>
        <File fileUrl={link} />
        {caption ? <p className={styles.caption}>{caption}</p> : null}{' '}
      </>
    );
  }

  if (mediaType === WhatsAppMediaType.audio) {
    mediaContent = (
      <>
        <AudioClip audioUrl={link} />
        {caption ? <p className={styles.caption}>{caption}</p> : null}{' '}
      </>
    );
  }

  return <>{mediaContent}</>;
};
