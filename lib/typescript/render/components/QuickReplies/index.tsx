import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../index';
import {Text} from '../Text';
import {Media} from '../Media';
import {QuickReply, ImageContent, TextContent, VideoContent} from '../../providers/facebook/facebookModel';
import {MediaHeight} from '../../providers/chatplugin/chatPluginModel';

export type QuickRepliesRenderProps = DefaultMessageRenderingProps & {
  text?: string;
  attachment?: ImageContent | TextContent | VideoContent;
  quickReplies: QuickReply[];
};

export const QuickReplies = ({quickReplies, contact, fromContact, text, attachment}: QuickRepliesRenderProps) => (
  <div className={styles.wrapper}>
    {text && <Text contact={contact} fromContact={fromContact} text={text} />}

    {attachment && 'text' in attachment && <Text contact={contact} fromContact={fromContact} text={attachment.text} />}

    {attachment && 'imageUrl' in attachment && (
      <Media altText="image attachment" isRichCard={false} fileUrl={attachment.imageUrl} height={MediaHeight.short} />
    )}

    {attachment && 'videoUrl' in attachment && (
      <Media altText="video attachment" isRichCard={false} fileUrl={attachment.videoUrl} />
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
