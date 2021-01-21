import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import styles from './index.module.scss';
import {sendMessages} from '../../../actions/messages';
import {ReactComponent as Paperplane} from '../../../assets/images/icons/paperplane.svg';

const InputBar = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleChange = event => {
    setInput(event.target.value);
  };

  useEffect(() => {
    textareaRef.current.style.height = '0px';
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + 'px';
  }, [input]);

  const conversationIdParams = useParams();
  const currentConversationId: string = conversationIdParams[Object.keys(conversationIdParams)[0]];

  return (
    <form className={styles.container}>
      <textarea
        className={styles.textArea}
        ref={textareaRef}
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
            sendMessages(currentConversationId, {text: input, type: 'text'});
          }}>
          <div className={styles.sendButtonText}>
            <Paperplane />
          </div>{' '}
        </button>
      </span>
    </form>
  );
};
export default InputBar;
