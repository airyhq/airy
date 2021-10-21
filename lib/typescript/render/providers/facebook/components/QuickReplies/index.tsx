import React from 'react';

import {Text} from '../../../../components/Text';
import {Video} from '../../../../components/Video';
import {Image} from '../../../../components/Image';
import {QuickReply, AttachmentUnion} from '../../facebookModel';
import {ImageWithFallback} from 'render/components/ImageWithFallback';

import styles from './index.module.scss';

export type QuickRepliesRenderProps = {
  text?: string;
  attachment?: AttachmentUnion;
  fromContact?: boolean;
  quickReplies: QuickReply[];
};

export const QuickReplies = ({quickReplies, fromContact, text, attachment}: QuickRepliesRenderProps) => (
  <div className={styles.wrapper}>
    {text && <Text text={text} fromContact={fromContact} />}

    {attachment && 'text' in attachment && <Text text={attachment.text} fromContact={fromContact} />}

    {attachment && 'imageUrl' in attachment && <Image imageUrl={attachment.imageUrl} />}

    {attachment && 'videoUrl' in attachment && <Video videoUrl={attachment.videoUrl} />}

    <div className={styles.container}>
      {quickReplies.map(({title, image_url: imageUrl}) => (
        <button type="button" key={title} className={styles.replyButton}>
          {imageUrl && <ImageWithFallback className={styles.quickReplyImage} alt={title} src={imageUrl} isTemplate />}
          <h1 key={title} className={styles.title}>
            {title}
          </h1>
        </button>
      ))}
    </div>
  </div>
);
