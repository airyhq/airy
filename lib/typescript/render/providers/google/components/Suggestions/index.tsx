import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../../../../components/index';
import {
  SuggestedReplies,
  SuggestedActions,
  AuthenticationRequestSuggestion,
  LiveAgentRequestSuggestion,
} from '../../GoogleModel';
import {Image} from '../../../../components/Image';
import {Text} from '../../../../components/Text';

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
      {!fromContact ? (
        <div className={styles.itemMember}>
          {text && <Text contact={contact} fromContact={fromContact} text={text} />}

          {!text && fallback && <Text contact={contact} fromContact={fromContact} text={fallback} />}

          {image && (
            <Image contact={contact} fromContact={fromContact} imageUrl={image.fileUrl} altText={image.altText} />
          )}

          <div className={styles.itemMemberSuggestions}>
            {(suggestions as (
              | SuggestedReplies
              | SuggestedActions
              | AuthenticationRequestSuggestion
              | LiveAgentRequestSuggestion
            )[]).map(elem => {
              {
                'reply' in elem && (
                  <button key={elem.reply.text} className={styles.replyButton}>
                    <h1 key={elem.reply.text} className={styles.title}>
                      {elem.reply.text}
                    </h1>
                  </button>
                );
              }

              {
                'action' in elem && (
                  <>
                    <button key={elem.action.text} className={styles.replyButton}>
                      <h1 key={elem.action.text} className={styles.title}>
                        <a
                          key={elem.action.text}
                          href={
                            elem.action.openUrlAction && elem.action.openUrlAction.url
                              ? elem.action.openUrlAction.url
                              : elem.action.dialAction && elem.action.dialAction.phoneNumber
                          }>
                          {elem.action.text}
                        </a>
                      </h1>
                    </button>
                  </>
                );
              }

              {
                'authenticationRequest' in elem && (
                  <>
                    <button key={Math.floor(Math.random() * 10)} className={styles.replyButton}>
                      <h1 key={Math.floor(Math.random() * 10)} className={styles.title}>
                        Sign in
                      </h1>
                    </button>
                  </>
                );
              }

              {
                'liveAgentRequest' in elem && (
                  <>
                    <button key={Math.floor(Math.random() * 10)} className={styles.replyButton}>
                      <h1 key={Math.floor(Math.random() * 10)} className={styles.title}>
                        Message a live agent
                      </h1>
                    </button>
                  </>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          {text && <Text contact={contact} fromContact={fromContact} text={text} />}

          {!text && fallback && <Text contact={contact} fromContact={fromContact} text={fallback} />}

          {image && (
            <Image contact={contact} fromContact={fromContact} imageUrl={image.fileUrl} altText={image.altText} />
          )}

          <div className={styles.itemUser}>
            <div className={styles.itemUserSuggestions}>
              {(suggestions as (
                | SuggestedReplies
                | SuggestedActions
                | AuthenticationRequestSuggestion
                | LiveAgentRequestSuggestion
              )[]).map(elem => {
                {
                  'reply' in elem && (
                    <button key={elem.reply.text} className={styles.replyButton}>
                      <h1 key={elem.reply.text} className={styles.title}>
                        {elem.reply.text}
                      </h1>
                    </button>
                  );
                }

                {
                  'action' in elem && (
                    <>
                      <button key={elem.action.text} className={styles.replyButton}>
                        <h1 key={elem.action.text} className={styles.title}>
                          <a
                            key={elem.action.text}
                            href={
                              elem.action.openUrlAction && elem.action.openUrlAction.url
                                ? elem.action.openUrlAction.url
                                : elem.action.dialAction && elem.action.dialAction.phoneNumber
                            }>
                            {elem.action.text}
                          </a>
                        </h1>
                      </button>
                    </>
                  );
                }

                {
                  'authenticationRequest' in elem && (
                    <>
                      <button key={Math.floor(Math.random() * 10)} className={styles.replyButton}>
                        <h1 key={Math.floor(Math.random() * 10)} className={styles.title}>
                          Sign in
                        </h1>
                      </button>
                    </>
                  );
                }

                {
                  'liveAgentRequest' in elem && (
                    <>
                      <button key={Math.floor(Math.random() * 10)} className={styles.replyButton}>
                        <h1 key={Math.floor(Math.random() * 10)} className={styles.title}>
                          Message a live agent
                        </h1>
                      </button>
                    </>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
