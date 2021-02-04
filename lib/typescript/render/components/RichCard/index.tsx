import React from 'react';
import styles from './index.module.scss';
import {Media, MediaRenderProps} from '../Media';

interface Suggestion {
  reply: {
    text: string;
    postbackData: string;
  };
}

type Suggestions = [Suggestion, Suggestion];

export type RichCardRenderProps = MediaRenderProps & {
  title: string;
  description: string;
  suggestions: Suggestions;
  media: MediaRenderProps;
};

export const RichCardComponent = ({title, description, suggestions, media}: RichCardRenderProps) => (
  <div className={styles.richCardWrapper}>
    <div className={styles.imageContainer}>
      <Media {...media} />
    </div>
    <div className={styles.richCardText}>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.description}>{description}</span>
      <div className={styles.suggestionsContainer}>
        {suggestions.map(({reply: {text}}) => (
          <button className={styles.suggestionButton}>{text}</button>
        ))}
      </div>
    </div>
  </div>
);
