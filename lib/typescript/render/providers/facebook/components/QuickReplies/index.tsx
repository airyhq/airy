import React from 'react';
import styles from './index.module.scss';
import {DefaultRenderingProps} from '../../../../components/index';
import {Text} from '../../../../components/Text';
import {Video} from '../../../../components/Video';
import {Image} from '../../../../components/Image';
import {QuickReply, AttachmentUnion} from '../../facebookModel';

export type QuickRepliesRenderProps = DefaultRenderingProps & {
  text?: string;
  attachment?: AttachmentUnion;
  quickReplies: QuickReply[];
};

export const QuickReplies = ({quickReplies, fromContact, text, attachment}: QuickRepliesRenderProps) => (
  <div className={styles.wrapper}>
    {text && <Text text={text} fromContact={fromContact} />}

    {attachment && 'text' in attachment && <Text text={attachment.text} fromContact={fromContact} />}

    {attachment && 'imageUrl' in attachment && <Image imageUrl={attachment.imageUrl} />}

    {attachment && 'videoUrl' in attachment && <Video videoUrl={attachment.videoUrl} />}

    <div className={styles.container}>
      {quickReplies.map(({title, image_url}) => (
        <button key={title} className={styles.replyButton}>
          {image_url && <img className={styles.quickReplyImage} alt={title} src={image_url} />}
          <h1 key={title} className={styles.title}>
            {title}
          </h1>
        </button>
      ))}
    </div>
  </div>
);
