import {h} from 'preact';
import linkifyString from 'linkifyjs/string';

import style from './index.module.scss';

type Props = {
  message: {
    sender_type: string;
    content: {
      text: string;
    };
  };
};

const AiryMessage = ({message}: Props) => {
  const isInbound = message.sender_type === 'source_contact';
  const messageDisplay = linkifyString(message.content.text, {
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
