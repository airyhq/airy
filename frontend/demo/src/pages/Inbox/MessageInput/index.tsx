import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import styles from './index.module.scss';
import {sendMessages} from '../../../actions/messages';
import {ReactComponent as Paperplane} from '../../../assets/images/icons/paperplane.svg';

type MessageInputProps = {
  sendMessages: (currentConversationId: string, sendMessagesRequestPayload: any) => Promise<boolean>;
};

const mapDispatchToProps = {sendMessages};

const MessageInput = (props: MessageInputProps) => {
  const [input, setInput] = useState('');
  const textAreaAdjust = useRef(null);

  const handleChange = event => {
    setInput(event.target.value);
  };

  useEffect(() => {
    textAreaAdjust.current.style.height = '0px';
    const scrollHeight = textAreaAdjust.current.scrollHeight;
    textAreaAdjust.current.style.height = scrollHeight + 'px';
  }, [input]);

  const conversationIdParams = useParams();
  const currentConversationId: string = conversationIdParams[Object.keys(conversationIdParams)[0]];

  return (
    <form className={styles.container}>
      <textarea
        className={styles.textArea}
        ref={textAreaAdjust}
        name="inputBar"
        placeholder="Enter a message..."
        autoFocus={true}
        value={input}
        onChange={handleChange}
      />
      <span className={styles.buttonSubmit}>
        <button
          type="submit"
          onClick={e => {
            e.preventDefault();
            props.sendMessages(currentConversationId, {text: input, type: 'text'}).then(() => setInput(''));
          }}>
          <div className={styles.sendButtonText}>
            <Paperplane />
          </div>{' '}
        </button>
      </span>
    </form>
  );
};
export default connect(null, mapDispatchToProps)(MessageInput);
