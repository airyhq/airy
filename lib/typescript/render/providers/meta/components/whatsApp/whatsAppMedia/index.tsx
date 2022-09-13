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

//translate this
const defaultText = 'Media is not available';

export const WhatsAppMedia = ({mediaType, link, caption}: WhatsAppMediaProps) => {
    console.log('WA media - mediaType', mediaType);
    console.log('WA media - link', link);
    console.log('WA media - caption', caption);

  return (
    <div className={styles.mediaWrapper}>
        <WhatsAppMediaContent mediaType={mediaType} link={link} caption={caption} />
    </div>
  );
};

export const WhatsAppMediaContent = ({mediaType, link, caption}: WhatsAppMediaProps) => {
  let mediaContent = <p>{defaultText}</p>;

  console.log('mediaType', mediaType);
  console.log('link', link);
  console.log('caption', caption);

  if (mediaType === 'image' || mediaType === 'sticker') {
    mediaContent = (
      <>
        <ImageWithFallback src={link} /> {caption ? <p className={styles.caption}>{caption}</p> : null}{' '}
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
