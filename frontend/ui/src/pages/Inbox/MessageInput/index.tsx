import React, {useState, useEffect, useRef, KeyboardEvent} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useParams} from 'react-router-dom';
import styles from './index.module.scss';
import {sendMessages} from '../../../actions/messages';
import {ReactComponent as Paperplane} from 'assets/images/icons/paperplane.svg';
import {StateModel} from '../../../reducers';
import {getTextMessagePayload} from 'httpclient';

const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: StateModel) => {
  return {
    messages: state.data.messages.all,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type MessageInputProps = {channelSource: string};

const MessageInput = (props: MessageInputProps & ConnectedProps<typeof connector>) => {
  const {channelSource} = props;
  const [input, setInput] = useState('');
  const textAreaRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  useEffect(() => {
    textAreaRef.current.style.height = '0px';
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height = scrollHeight + 'px';
  }, [input]);

  const conversationIdParams = useParams();
  const currentConversationId: string = conversationIdParams[Object.keys(conversationIdParams)[0]];

  const sendMessage = () => {
    props.sendMessages(getTextMessagePayload(channelSource, currentConversationId, input)).then(() => setInput(''));
  };

  const handleClick = () => {
    sendMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.metaKey && event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <form className={`${styles.container} ${styles.flexWrap}`}>
      <div className={`${styles.messageWrap} ${styles.flexWrap}`}>
        <div className={styles.inputWrap}>
          <textarea
            className={styles.messageTextArea}
            ref={textAreaRef}
            rows={1}
            name="inputBar"
            placeholder="Enter a message..."
            autoFocus={true}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className={styles.sendDiv}>
        <button
          type="button"
          className={`${styles.sendButton} ${input && styles.sendButtonActive}`}
          onClick={handleClick}
          disabled={input.trim().length == 0}>
          <div className={styles.sendButtonText}>
            <Paperplane />
          </div>
        </button>
      </div>
    </form>
  );
};

export default connector(MessageInput);
