import React from 'react';
import Linkify from 'linkifyjs/react';
import styles from './index.module.scss';

// className={`${styles.textMessage} ${fromContact ? styles.contactContent : styles.memberContent}`}

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
  isTwilioConversationListItem?: boolean;
};

export const Text = ({text, fromContact, isTwilioConversationListItem}: TextRenderProps) => (
  <Linkify
    tagName="div"
    className={`${
      isTwilioConversationListItem
        ? styles.conversationListItemText
        : fromContact
        ? styles.contactContent
        : styles.memberContent
    }`}
    options={{
      defaultProtocol: 'https',
      className: `${styles.messageLink} ${fromContact ? styles.contactContent : styles.memberContent}`,
    }}>
    {text}
  </Linkify>
);
