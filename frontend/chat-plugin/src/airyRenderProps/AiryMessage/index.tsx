import {h} from 'preact';
import linkifyString from 'linkifyjs/string';

import styles from './index.module.scss';

type AiryMessageProps = {
  message: {
    id: string;
    sender_type: string;
    content: {
      text: string;
      type: string;
    }[];
    delivery_state: string;
    sent_at: string;
    state: string;
  };
};

const AiryMessage = ({message}: AiryMessageProps) => {
  const isInbound = message.sender_type === 'source_contact';
  const messageDisplay = linkifyString(message.content[0].text, {
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
