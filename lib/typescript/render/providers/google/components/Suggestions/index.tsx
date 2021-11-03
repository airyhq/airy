import React from 'react';

import {SuggestionsUnion} from '../../googleModel';
import {Image} from '../../../../components/Image';
import {Text} from '../../../../components/Text';

import linkIcon from 'assets/images/icons/link.svg';
import phoneIcon from 'assets/images/icons/phone.svg';

import styles from './index.module.scss';

type SuggestionsRendererProps = {
  text?: string;
  fallback?: string;
  fromContact?: boolean;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions: SuggestionsUnion[];
};

export const Suggestions = ({text, fallback, image, suggestions, fromContact}: SuggestionsRendererProps) => (
  <div className={styles.suggestionsWrapper}>
    {image && <Image imageUrl={image.fileUrl} altText={image.altText} />}

    {(text || fallback) && <Text text={text ?? fallback} fromContact={fromContact} />}

    <div className={styles.suggestionsContainer}>
      {(suggestions as SuggestionsUnion[]).map(elem => {
        if ('reply' in elem) {
          return (
            <button type="button" key={elem.reply.text} className={styles.replyButton}>
              <h1 key={elem.reply.text} className={styles.title}>
                {elem.reply.text}
              </h1>
            </button>
          );
        }

        if ('action' in elem) {
          return (
            <button type="button" key={elem.action.text} className={styles.replyButton}>
              <img
                className={styles.actionImage}
                alt={elem.action.openUrlAction ? 'link icon' : 'phone icon'}
                src={elem.action.openUrlAction ? linkIcon : phoneIcon}
              />
              <h1 key={elem.action.text} className={styles.title}>
                <a
                  key={elem.action.text}
                  className={styles.title}
                  href={
                    elem.action.openUrlAction && elem.action.openUrlAction.url
                      ? elem.action.openUrlAction.url
                      : `tel: ${elem.action.dialAction?.phoneNumber}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {elem.action.text}
                </a>
              </h1>
            </button>
          );
        }

        if ('authenticationRequest' in elem) {
          return (
            <button type="button" key={elem.authenticationRequest.oauth.clientId} className={styles.replyButton}>
              <h1 key={elem.authenticationRequest.oauth.clientId} className={styles.title}>
                Authenticate with Google
              </h1>
            </button>
          );
        }

        if ('liveAgentRequest' in elem) {
          return (
            <button type="button" key={Math.floor(Math.random() * 50)} className={styles.replyButton}>
              <h1 key={Math.floor(Math.random() * 50)} className={styles.title}>
                Message a live agent on Google&apos;s Business Messages
              </h1>
            </button>
          );
        }
      })}
      {suggestions &&
        suggestions[0] &&
        (('action' in suggestions[0] && !('openUrlAction' in suggestions[0].action)) ||
          'reply' in suggestions[0] ||
          'authenticationRequest' in suggestions[0] ||
          'liveAgentRequest' in suggestions[0]) && (
          <div className={styles.hoverTextContainer}>
            <span className={styles.hoverText}> action cannot be triggered</span>
          </div>
        )}
    </div>
  </div>
);
