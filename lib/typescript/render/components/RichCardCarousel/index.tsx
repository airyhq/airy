import React from 'react';
import styles from './index.module.scss';
import {Media, MediaRenderProps} from '../Media';
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

export type RichCardCarouselRenderProps = DefaultMessageRenderingProps & {
  cardWidth: string;
  cardContents: [
    {
      title?: string;
      description?: string;
      media: MediaRenderProps;
      suggestions: Suggestions;
    }
  ];
};

export const RichCardCarousel = (props: RichCardCarouselRenderProps) => {
  const {cardContents, cardWidth} = props;

  return (
    <div className={styles.richCardCarouselContainer}>
      <div className={styles.mediaContainer}>
        {cardContents.map(card => {
          <Media {...card.media} />;
        })}
      </div>
      <div className={styles.textContainer}>
        {cardContents.map(card => {
          {
            card.title && <h1 className={styles.title}>{card.title}</h1>;
          }
          {
            card.description && <span className={styles.description}>{card.description}</span>;
          }
        })}
      </div>
      <div className={styles.suggestionsContainer}>
        {cardContents.map(card => {
          {
            card.suggestions.map(({reply: {text, postbackData}}) => {
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
            });
          }
        })}
      </div>
    </div>
  );
};
