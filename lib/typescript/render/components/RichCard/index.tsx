import React from 'react';
import styles from './index.module.scss';
import {Media} from '../Media';
import {MediaHeight} from '../../providers/chatplugin/chatPluginModel';
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
  height: MediaHeight;
  altText: string;
  fileUrl: string;
};

export const RichCard = ({title, description, suggestions, height, fileUrl, altText}: RichCardRenderProps) => (
  <div className={styles.richCardContainer}>
    <div className={styles.mediaContainer}>
      <Media isRichCard={true} height={height} altText={altText} fileUrl={fileUrl} />
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
