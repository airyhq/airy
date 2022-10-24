import React from 'react';

import {Text} from '../../../../components/Text';
import {Video} from '../../../../components/Video';
import {Image} from '../../../../components/Image';
import {ImageWithFallback} from 'render/components/ImageWithFallback';
import {QuickReply, AttachmentUnion} from 'render/providers/chatplugin/chatPluginModel';
import {CommandUnion} from 'render/props';

import styles from './index.module.scss';

export type QuickRepliesRenderProps = {
  text?: string;
  attachment?: AttachmentUnion;
  fromContact?: boolean;
  quickReplies: QuickReply[];
  commandCallback?: (command: CommandUnion) => void;
};

export const QuickReplies = ({
  quickReplies,
  fromContact,
  text,
  attachment,
  commandCallback,
}: QuickRepliesRenderProps) => {
  const clickPostback = (reply: QuickReply) => {
    commandCallback &&
      commandCallback({
        type: 'quickReplies',
        payload: {text: reply.payload.text, postbackData: reply.payload.postbackData},
      });
  };

  return (
    <div className={styles.wrapper}>
      {text && <Text text={text} fromContact={fromContact} />}

      {attachment && 'text' in attachment && <Text text={attachment.text} fromContact={fromContact} />}

      {attachment && 'imageUrl' in attachment && <Image imageUrl={attachment.imageUrl} />}

      {attachment && 'videoUrl' in attachment && <Video videoUrl={attachment.videoUrl} />}

      <div className={styles.container}>
        {quickReplies.map((reply: QuickReply) => (
          <button type="button" key={reply.title} className={styles.replyButton} onClick={() => clickPostback(reply)}>
            {(reply?.image_url ?? reply?.imageUrl) && (
              <ImageWithFallback
                className={styles.quickReplyImage}
                alt={reply.title}
                src={reply?.image_url ?? reply?.imageUrl}
                isTemplate
              />
            )}
            <h1 key={reply.title} className={styles.title}>
              {reply.title}
            </h1>
          </button>
        ))}
      </div>
    </div>
  );
};
