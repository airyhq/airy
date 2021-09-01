import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as PlayCircleIcon} from 'assets/images/icons/play-circle.svg';
import Linkify from 'linkifyjs/react';
import {timeElapsedInHours} from 'dates';

type InstagramRepliesProps = {
  url: string;
  text: string;
  sentAt: Date;
  fromContact: boolean;
};

export const StoryReplies = ({url, text, sentAt, fromContact}: InstagramRepliesProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.storyReply}>
        <span className={styles.storyResponse}>In response to a&nbsp;</span>
        {timeElapsedInHours(sentAt) <= 24 ? (
          <div className={styles.storyLink}>
            <a className={styles.activeStory} href={url} target="_blank" rel="noopener noreferrer">
              <PlayCircleIcon className={styles.icon} />
              story
            </a>
          </div>
        ) : (
          <span className={styles.expiredStory}> story (expired)</span>
        )}
      </div>
      <Linkify
        tagName="div"
        className={`${fromContact ? styles.contactContent : styles.memberContent}`}
        options={{
          defaultProtocol: 'https',
          className: `${styles.messageLink} ${fromContact ? styles.contactContent : styles.memberContent}`,
        }}>
        {text}
      </Linkify>
    </div>
  );
};
