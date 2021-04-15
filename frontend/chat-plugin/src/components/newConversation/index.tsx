import React from 'react';
import style from './index.module.scss';
import {cyChatPluginStartNewConversation} from 'chat-plugin-handles';

type newConversationProps = {
  reAuthenticate: () => void;
};

const NewConversation = (props: newConversationProps) => {
  return (
    <div>
      <div className={style.paragraphWrapper}>
        <p className={style.newConversation}>Your conversation has ended. Thank you for</p>{' '}
        <p className={style.newConversationLine}>chatting with us today.</p>
      </div>

      <div>
        <a
          href=""
          onClick={props.reAuthenticate}
          className={style.newConversationLink}
          data-cy={cyChatPluginStartNewConversation}>
          Click Here To Start a New Conversation
        </a>
      </div>
    </div>
  );
};

export default NewConversation;
