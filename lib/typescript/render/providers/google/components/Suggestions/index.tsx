import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../../../../components/index';
import {
  SuggestedReplies,
  SuggestedActions,
  AuthenticationRequestSuggestion,
  LiveAgentRequestSuggestion,
} from '../../googleModel';
import {Image} from '../../../../components/Image';
import {Text} from '../../../../components/Text';
import linkIcon from 'assets/images/icons/link.svg';
import phoneIcon from 'assets/images/icons/phone.svg';

type SuggestionsRendererProps = DefaultMessageRenderingProps & {
  text?: string;
  fallback?: string;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions:
    | SuggestedReplies[]
    | SuggestedActions[]
    | AuthenticationRequestSuggestion[]
    | LiveAgentRequestSuggestion[];
};

export const Suggestions = ({text, fallback, image, suggestions, contact, fromContact}: SuggestionsRendererProps) => (
  <div className={styles.wrapper}>
    <div className={styles.item}>
      <div className={styles.itemMember}>
        {text && <Text contact={contact} fromContact={fromContact} text={text} />}

        {image && (
          <Image contact={contact} fromContact={fromContact} imageUrl={image.fileUrl} altText={image.altText} />
        )}

        {!text && !image && fallback && <Text contact={contact} fromContact={fromContact} text={fallback} />}

        <div className={styles.itemMemberSuggestions}>
          <div className={styles.suggestionsContainer}>
            {(suggestions as (
              | SuggestedReplies
              | SuggestedActions
              | AuthenticationRequestSuggestion
              | LiveAgentRequestSuggestion
            )[]).map(elem => {
              if ('reply' in elem) {
                return (
                  <button key={elem.reply.text} className={styles.replyButton}>
                    <h1 key={elem.reply.text} className={styles.title}>
                      {elem.reply.text}
                    </h1>
                  </button>
                );
              }

              if ('action' in elem) {
                return (
                  <button key={elem.action.text} className={styles.replyButton}>
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
                            : `tel: ${elem.action.dialAction && elem.action.dialAction.phoneNumber}`
                        }
                        target="_blank"
                        rel="noopener noreferrer">
                        {elem.action.text}
                      </a>
                    </h1>
                  </button>
                );
              }

              if ('authenticationRequest' in elem) {
                return (
                  <button key={elem.authenticationRequest.oauth.clientId} className={styles.replyButton}>
                    <h1 key={elem.authenticationRequest.oauth.clientId} className={styles.title}>
                      Sign in with Google
                    </h1>
                  </button>
                );
              }

              if ('liveAgentRequest' in elem) {
                return (
                  <button key={Math.floor(Math.random() * 50)} className={styles.replyButton}>
                    <h1 key={Math.floor(Math.random() * 50)} className={styles.title}>
                      Message a live agent
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
                  <span className={styles.hoverText}>This action can only be triggered by your contact.</span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
