import {h} from 'preact';
import linkifyString from 'linkifyjs/string';

import style from './index.module.scss';

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
    className: `${isInbound ? style.messageLinkRight : style.messageLinkLeft}`,
  });

  return (
    <div className={`${isInbound ? style.containerRight : style.containerLeft}`}>
      <div className={`${isInbound ? style.bubbleRight : style.bubbleLeft}`}>
        <div dangerouslySetInnerHTML={{__html: messageDisplay}} />
      </div>
    </div>
  );
};

export default AiryMessage;
