import React from 'react';
import {WhatsAppMediaType} from '../../MetaModel';
import {ImageWithFallback, Video, File} from '../../../../components';
import {AudioClip} from 'components';
import styles from './index.module.scss';

interface WhatsAppMediaProps {
  mediaType: WhatsAppMediaType;
  link: string;
  caption?: string;
}

const defaultText = 'N/A';

//Caption: only use for document, image, or video media
//https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#media-object

export const WhatsAppMedia = ({mediaType, link, caption}: WhatsAppMediaProps) => {
  if (caption && mediaType !== 'audio') {
    return (
      <div className={styles.mediaWrapper}>
        <WhatsAppMediaContent mediaType={mediaType} link={link} caption={caption} />
      </div>
    );
  } else {
    return <WhatsAppMediaContent mediaType={mediaType} link={link} caption={caption} />;
  }
};

export const WhatsAppMediaContent = ({mediaType, link, caption}: WhatsAppMediaProps) => {
  let mediaContent = <p>{defaultText}</p>;

  if (mediaType === 'image' || mediaType === 'sticker') {
    const isCaptionRenderable = caption && mediaType === 'image';
    mediaContent = (
      <>
        <ImageWithFallback src={link} className={styles.imageMedia} />{' '}
        {isCaptionRenderable ? <p className={styles.caption}>{caption}</p> : null}
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
    mediaContent = <AudioClip audioUrl={link} />;
  }

  return <>{mediaContent}</>;
};
