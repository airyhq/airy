import React from 'react';

import {Media, MediaRenderProps} from './Media';
import {CommandUnion} from '../../../../props';
import {RichCardSuggestion} from '../../chatPluginModel';

import styles from './index.module.scss';

export type RichCardRenderProps = {
  title?: string;
  description?: string;
  suggestions: RichCardSuggestion[];
  media: MediaRenderProps;
  cardWidth?: string;
  commandCallback?: (command: CommandUnion) => void;
  customFont?: string;
};

export const RichCard = ({
  title,
  description,
  suggestions,
  media,
  cardWidth,
  commandCallback,
  customFont,
}: RichCardRenderProps) => {
  const clickSuggestion = (suggestion: RichCardSuggestion) => {
    if (suggestion.reply) {
      commandCallback &&
        commandCallback({
          type: 'suggestedReply',
          payload: {text: suggestion.reply.text, postbackData: suggestion.reply.postbackData},
        });
    } else if (suggestion.action) {
      commandCallback &&
        commandCallback({
          type: 'suggestedReply',
          payload: {text: suggestion.action.text, postbackData: suggestion.action.postbackData},
        });
      if (suggestion.action.openUrlAction?.url) {
        window.open(suggestion.action.openUrlAction.url, '_blank', 'noopener');
      } else if (suggestion.action.dialAction?.phoneNumber) {
        window.open(`tel:${suggestion.action.dialAction.phoneNumber}`, '_blank', 'noopener');
      }
    }
  };

  return (
    <>
      <div className={styles.richCardContainer} style={cardWidth === 'SHORT' ? {width: '136px'} : {width: '320px'}}>
        <div className={styles.mediaContainer}>
          <Media {...media} />
        </div>
        <div className={styles.textContainer} style={{fontFamily: customFont}}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <span className={styles.description}>{description}</span>}
          <div className={styles.suggestionsContainer}>
            {suggestions.map((suggestion: RichCardSuggestion, idx: number) => (
              <button
                type="button"
                key={idx}
                className={styles.suggestionButton}
                style={{fontFamily: customFont}}
                onClick={() => {
                  clickSuggestion(suggestion);
                }}
              >
                {suggestion.reply ? suggestion.reply.text : suggestion.action.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
