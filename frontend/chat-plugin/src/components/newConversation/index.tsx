import React from 'react';
import style from './index.module.scss';
import {cyChatPluginStartNewConversation} from 'chat-plugin-handles';

type newConversationProps = {
  reAuthenticate: () => void;
  startConversationText: string;
};

const NewConversation = (props: newConversationProps) => {
  return (
    <div>
      <div className={style.paragraphWrapper}>
        <p className={style.newConversation}>Your conversation has ended.</p>
      </div>

      <div className={style.startConversationContainer}>
        <button className={style.newConversationButton}>
          <a
            href=""
            onClick={props.reAuthenticate}
            data-cy={cyChatPluginStartNewConversation}
            className={style.newConversationLink}>
            {props.startConversationText || 'Start a new Conversation'}
          </a>
        </button>
      </div>
    </div>
  );
};

export default NewConversation;
