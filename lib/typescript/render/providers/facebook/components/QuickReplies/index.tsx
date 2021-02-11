import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../../../../components/index';
import {Text} from '../../../../components/Text';
import {Video} from '../../../../components/Video';
import {Image} from '../../../../components/Image';
import {QuickReply, AttachmentUnion} from '../../facebookModel';

export type QuickRepliesRenderProps = DefaultMessageRenderingProps & {
  text?: string;
  attachment?: AttachmentUnion;
  quickReplies: QuickReply[];
};

export const QuickReplies = ({quickReplies, contact, fromContact, text, attachment}: QuickRepliesRenderProps) => (
  <div className={styles.wrapper}>
    {text && <Text contact={contact} fromContact={fromContact} text={text} />}

    {attachment && 'text' in attachment && <Text contact={contact} fromContact={fromContact} text={attachment.text} />}

    {attachment && 'imageUrl' in attachment && (
      <Image contact={contact} fromContact={fromContact} imageUrl={attachment.imageUrl} />
    )}

    {attachment && 'videoUrl' in attachment && (
      <Video contact={contact} fromContact={fromContact} videoUrl={attachment.videoUrl} />
    )}

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
