import React, {useState, useEffect, useRef, KeyboardEvent, createRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useParams} from 'react-router-dom';
import styles from './index.module.scss';
import {sendMessages} from '../../../actions/messages';
import TemplateSelector from '../TemplateSelector';
import 'emoji-mart/css/emoji-mart.css';
import {Picker} from 'emoji-mart';

import {ReactComponent as Paperplane} from 'assets/images/icons/paperplane.svg';
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as TemplateAlt} from 'assets/images/icons/template-alt.svg';

import {StateModel} from '../../../reducers';
import {getTextMessagePayload} from 'httpclient';
import {listTemplates} from '../../../actions/templates';

const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: StateModel) => {
  return {
    messages: state.data.messages.all,
    listTemplates,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type MessageInputProps = {channelSource: string};

const MessageInput = (props: MessageInputProps & ConnectedProps<typeof connector>) => {
  const {channelSource} = props;

  const [input, setInput] = useState('');
  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [isShowingTemplateModal, setIsShowingTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(false);

  console.log('isShowingEmojiDrawer', isShowingEmojiDrawer);

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);
  let emojiDiv = useRef<HTMLDivElement>(null);

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

  const InputOptions = () => {
    const handleEmojiDrawer = () => {
      if (!isShowingEmojiDrawer) {
        addListeners();
      } else {
        removeListeners();
        textAreaRef.current && textAreaRef.current.focus();
      }
      setIsShowingEmojiDrawer(!isShowingEmojiDrawer);
    };

    const handleEmojiKeyEvent = e => {
      console.log(e.key);
      if (e.key === 'Escape') {
        handleEmojiDrawer();
      }
    };

    const handleEmojiOutsideClick = e => {
      if (emojiDiv.current === null || emojiDiv.current.contains(e.target)) {
        return;
      }

      handleEmojiDrawer();
    };

    const addListeners = () => {
      document.addEventListener('keydown', handleEmojiKeyEvent);
      document.addEventListener('click', handleEmojiOutsideClick);
    };

    const removeListeners = () => {
      document.removeEventListener('keydown', handleEmojiKeyEvent);
      document.removeEventListener('click', handleEmojiOutsideClick);
    };

    //to do: refactor with one toggle function
    const handleClickTemplates = () => {
      setIsShowingTemplateModal(true);
    };

    const handleCloseTemplates = () => {
      setIsShowingTemplateModal(false);
    };

    const templateSelected = template => {
      const json = JSON.parse(template.content) as any;
      if (json.blueprint === 'text') {
        setIsShowingTemplateModal(false);
        setInput(json.payload);
      } else {
        setIsShowingTemplateModal(false);
        setSelectedTemplate(template);
      }
      sendButtonRef.current.focus();
    };

    const addEmoji = emoji => {
      console.log('add emoji', emoji);

      let emojiMessage = emoji.native;

      const message = input + ' ' + emojiMessage;

      setInput(message);

      handleEmojiDrawer();
    };

    return (
      <div className={styles.messageActionsContainer}>
        <>
          {isShowingTemplateModal && (
            <TemplateSelector onClose={handleCloseTemplates} selectTemplate={templateSelected} />
          )}
          {isShowingEmojiDrawer && (
            <div ref={emojiDiv} className={styles.emojiDrawer}>
              <Picker showPreview={false} onSelect={addEmoji} title="Emoji" />
            </div>
          )}
          <button
            className={`${styles.iconButton} ${styles.templateButton} ${isShowingEmojiDrawer ? styles.active : ''}`}
            type="button"
            onClick={() => handleEmojiDrawer()}>
            <div className={styles.actionToolTip}>Emojis</div>
            <Smiley aria-hidden />
          </button>
          <button
            className={`${styles.iconButton} ${styles.templateButton} ${isShowingTemplateModal ? styles.active : ''}`}
            type="button"
            onClick={() => handleClickTemplates()}>
            <div className={styles.actionToolTip}>Templates</div>
            <TemplateAlt aria-hidden />
          </button>
        </>
      </div>
    );
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
        <InputOptions />
      </div>
      <div className={styles.sendDiv}>
        <button
          type="button"
          className={`${styles.sendButton} ${input && styles.sendButtonActive}`}
          onClick={handleClick}
          disabled={input.trim().length == 0}>
          <div className={styles.sendButtonText} ref={sendButtonRef}>
            <Paperplane />
          </div>
        </button>
      </div>
    </form>
  );
};

export default connector(MessageInput);
