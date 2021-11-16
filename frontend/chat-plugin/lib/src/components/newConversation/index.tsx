import React from 'react';
import style from './index.module.scss';
import {cyChatPluginStartNewConversation} from 'chat-plugin-handles';
import {useTranslation} from 'react-i18next';

type newConversationProps = {
  reAuthenticate: () => void;
  startNewConversationText: string;
};

const NewConversation = (props: newConversationProps) => {
  const {t} = useTranslation();

  return (
    <div>
      <div className={style.paragraphWrapper}>
        <p className={style.newConversation}>{t('conversationEnded')}</p>
      </div>

      <div className={style.startConversationContainer}>
        <button className={style.newConversationButton}>
          <a
            href=""
            onClick={props.reAuthenticate}
            data-cy={cyChatPluginStartNewConversation}
            className={style.newConversationLink}
          >
            {props.startNewConversationText || 'Start a new Conversation'}
          </a>
        </button>
      </div>
    </div>
  );
};

export default NewConversation;
