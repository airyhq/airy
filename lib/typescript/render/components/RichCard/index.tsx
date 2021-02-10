import React from 'react';
import styles from './index.module.scss';
import {Media, MediaRenderProps} from './Media';
import {DefaultMessageRenderingProps} from '../index';

type Suggestions = [
  {
    reply: {
      text: string;
      postbackData: string;
    };
  },
  {
    reply?: {
      text: string;
      postbackData: string;
    };
  }
];

export type RichCardRenderProps = DefaultMessageRenderingProps & {
  title?: string;
  description?: string;
  suggestions: Suggestions;
  media: MediaRenderProps;
};

export const RichCard = ({title, description, suggestions, media}: RichCardRenderProps) => (
  <div className={styles.richCardContainer}>
    <div className={styles.mediaContainer}>
      <Media {...media} />
    </div>
    <div className={styles.textContainer}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {description && <span className={styles.description}>{description}</span>}
      <div className={styles.suggestionsContainer}>
        {suggestions.map(({reply: {text, postbackData}}) => {
          return (
            text &&
            postbackData && (
              <button key={text} className={styles.suggestionButton}>
                {' '}
                <a className={styles.suggestionLink} href={postbackData} target="_blank" rel="noopener noreferrer">
                  {' '}
                  {text}{' '}
                </a>{' '}
              </button>
            )
          );
        })}
      </div>
    </div>
  </div>
);
