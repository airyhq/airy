import React from 'react';
import styles from './index.module.scss';
import {Media, MediaRenderProps} from '../Media';
import {DefaultMessageRenderingProps} from '../index';

interface Suggestion {
  reply: {
    text: string;
    postbackData: string;
  };
}

export type RichCardRenderProps = DefaultMessageRenderingProps & {
  title: string;
  description: string;
  suggestions: [Suggestion, Suggestion];
  media: MediaRenderProps;
};

export const RichCard = ({sentAt, title, description, suggestions, media}: RichCardRenderProps) => (
  <div className={styles.wrapper}>
    <div className={styles.messageListUserContainer}>
      <div className={styles.richCardWrapper}>
        <div className={styles.mediaContainer}>
          <Media {...media} />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.description}>{description}</span>
          <div className={styles.suggestionsContainer}>
            {suggestions.map(({reply: {text}}) => (
              <button key={text} className={styles.suggestionButton}>
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
      {sentAt && <div className={styles.messageTime}>{sentAt}</div>}
    </div>
  </div>
);
