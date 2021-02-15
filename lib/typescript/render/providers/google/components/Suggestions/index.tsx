import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../../../../components/index';
import {SuggestedReplies, SuggestedActions} from '../../googleModel';
import {Image} from '../../../../components/Image';
import {Text} from '../../../../components/Text';

type SuggestionsRendererProps = DefaultMessageRenderingProps & {
  text?: string;
  fallback?: string;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions: SuggestedReplies[] | SuggestedActions[];
};

export const Suggestions = ({text, fallback, image, suggestions, contact, fromContact}: SuggestionsRendererProps) => (
  <div className={styles.wrapper}>
    {text && <Text contact={contact} fromContact={fromContact} text={text} />}

    {image && <Image contact={contact} fromContact={fromContact} imageUrl={image.fileUrl} />}

    {!text && !image && fallback && <Text contact={contact} fromContact={fromContact} text={fallback} />}

    <div className={styles.container}>
      {'action' in suggestions[0] && (
        <button key={suggestions[0].action.text} className={styles.replyButton}>
          {suggestions[0].action.openUrlAction && (
            <h1 key={suggestions[0].action.text} className={styles.title}>
              <a
                href={
                  suggestions[0].action.openUrlAction && suggestions[0].action.openUrlAction.url
                    ? suggestions[0].action.openUrlAction.url
                    : suggestions[0].action.dialAction && suggestions[0].action.dialAction.phoneNumber
                }>
                {suggestions[0].action.text}
              </a>
            </h1>
          )}
        </button>
      )}

      {/* {'reply' in  suggestions[0] && (
        {suggestions.map(({reply: {text}}) => (
          <button key={text} className={styles.replyButton}>
            <h1 key={text} className={styles.title}>
              {text}
            </h1>
          </button>
        ))}
        )} */}
    </div>
  </div>
);
