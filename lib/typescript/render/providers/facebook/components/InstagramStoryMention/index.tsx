import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as LinkIcon} from 'assets/images/icons/external-link.svg';
import {timeElapsedInHours} from 'dates';

type StoryMentionProps = {
  url: string;
  sentAt: Date;
  fromContact: boolean;
};

export const StoryMention = ({url, sentAt, fromContact}: StoryMentionProps) => {
  return (
    <>
      <div className={`${fromContact ? styles.contactContent : styles.memberContent}`}>
        {timeElapsedInHours(sentAt) <= 24 ? (
          <>
            <div className={styles.activeStory}>
              <a className={styles.activeStoryLink} href={url} target="_blank" rel="noopener noreferrer">
                mentioned in an active Instagram story <LinkIcon />
              </a>
            </div>
          </>
        ) : (
          <span className={styles.expiredStory}> mentioned in an expired Instagram story</span>
        )}
      </div>
    </>
  );
};
