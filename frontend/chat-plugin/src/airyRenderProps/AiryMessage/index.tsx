import {h} from 'preact';
import linkifyString from 'linkifyjs/string';

import styles from './index.module.scss';

type AiryMessageProps = {
  message: {
    id: string;
    sender_type: string;
    content: string;
    delivery_state: string;
    sent_at: string;
    state: string;
  };
};

interface TextMessageContext {
  text: string;
}

const AiryMessage = ({message}: AiryMessageProps) => {
  const isInbound = message.sender_type === 'source_contact';
  const content: TextMessageContext = JSON.parse(message.content);
  const messageDisplay = linkifyString(content.text, {
    className: `${isInbound ? styles.messageLinkRight : styles.messageLinkLeft}`,
  });

  return (
    <div className={`${isInbound ? styles.containerRight : styles.containerLeft}`}>
      <div className={`${isInbound ? styles.bubbleRight : styles.bubbleLeft}`}>
        <div dangerouslySetInnerHTML={{__html: messageDisplay}} />
      </div>
    </div>
  );
};

export default AiryMessage;
