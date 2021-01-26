import React, {useState, useEffect, useRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useParams} from 'react-router-dom';
import styles from './index.module.scss';
import {sendMessages} from '../../../actions/messages';
import {ReactComponent as Paperplane} from '../../../assets/images/icons/paperplane.svg';
import {RootState} from '../../../reducers';
const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: RootState) => {
  return {
    messages: state.data.messages.all,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type MessageInputProps = ConnectedProps<typeof connector>;

const MessageInput = (props: MessageInputProps) => {
  const [input, setInput] = useState('');
  const textAreaAdjust = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
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
      <div className={styles.buttonSubmit}>
        <button
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            props.sendMessages(currentConversationId, {text: input, type: 'text'}).then(() => setInput(''));
          }}>
          <div className={styles.sendButtonText}>
            <Paperplane />
          </div>{' '}
        </button>
      </div>
    </form>
  );
};

export default connector(MessageInput);
