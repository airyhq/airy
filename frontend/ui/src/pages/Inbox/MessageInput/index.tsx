import React, {useState, useEffect, useRef, KeyboardEvent} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useParams} from 'react-router-dom';
import styles from './index.module.scss';
import {sendMessages} from '../../../actions/messages';
import TemplateSelector from '../TemplateSelector';
import 'emoji-mart/css/emoji-mart.css';
import {Picker} from 'emoji-mart';
import {SourceMessage} from 'render';

import {ReactComponent as Paperplane} from 'assets/images/icons/paperplane.svg';
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as TemplateAlt} from 'assets/images/icons/template-alt.svg';
import {ReactComponent as Close} from 'assets/images/icons/close.svg';

import {StateModel} from '../../../reducers';
import {getTextMessagePayload, RenderedContentUnion, Template} from 'httpclient';
import {listTemplates} from '../../../actions/templates';
import {cyMessageSendButton, cyMessageTextArea} from 'handles';

const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: StateModel) => {
  return {
    messages: state.data.messages.all,
    listTemplates,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type MessageInputProps = {channelSource: string};

interface SelectedTemplate {
  message: RenderedContentUnion;
  source: string;
}

const MessageInput = (props: MessageInputProps & ConnectedProps<typeof connector>) => {
  const {channelSource} = props;

  const [input, setInput] = useState('');
  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [isShowingTemplateModal, setIsShowingTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);
  const emojiDiv = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (input) {
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + 'px';
    }
  }, [input]);

  const conversationIdParams = useParams();
  const currentConversationId: string = conversationIdParams[Object.keys(conversationIdParams)[0]];

  const sendMessage = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null);
      props
        .sendMessages({conversationId: currentConversationId, message: selectedTemplate.message.content})
        .then(() => setInput(''));
      return;
    }

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
      if (isShowingTemplateModal) {
        setIsShowingTemplateModal(false);
      }
      if (isShowingEmojiDrawer) {
        textAreaRef.current && textAreaRef.current.focus();
      }

      setIsShowingEmojiDrawer(!isShowingEmojiDrawer);
    };

    const handleEmojiKeyEvent = e => {
      if (e.key === 'Escape') {
        handleEmojiDrawer();
      }
    };

    const handleEmojiClickedOutside = e => {
      if (emojiDiv.current === null || emojiDiv.current.contains(e.target)) {
        return;
      }

      handleEmojiDrawer();
    };

    useEffect(() => {
      if (isShowingEmojiDrawer) {
        document.addEventListener('keydown', handleEmojiKeyEvent);
        document.addEventListener('click', handleEmojiClickedOutside);

        return () => {
          document.removeEventListener('keydown', handleEmojiKeyEvent);
          document.removeEventListener('click', handleEmojiClickedOutside);
        };
      }
    }, [isShowingEmojiDrawer]);

    const toggleTemplateModal = () => {
      if (isShowingEmojiDrawer) {
        setIsShowingEmojiDrawer(false);
      }
      setIsShowingTemplateModal(!isShowingTemplateModal);
    };

    const selectTemplate = (template: Template) => {
      const jsonTemplate = template.content;

      if (
        jsonTemplate.message.text &&
        !jsonTemplate.message.suggestions &&
        !jsonTemplate.message.quick_replies &&
        !jsonTemplate.message.containsRichText
      ) {
        setInput(jsonTemplate.message.text);
        setIsShowingTemplateModal(false);
      } else {
        setInput('');
        setIsShowingTemplateModal(false);
        setSelectedTemplate({message: template, source: template.source});
      }
      sendButtonRef.current.focus();
    };

    const addEmoji = emoji => {
      const emojiMessage = emoji.native;

      const message = input + ' ' + emojiMessage;

      setInput(message);

      handleEmojiDrawer();
    };

    return (
      <div className={styles.messageActionsContainer}>
        <>
          {isShowingTemplateModal && (
            <TemplateSelector
              onClose={toggleTemplateModal}
              selectTemplate={selectTemplate}
              channelSource={channelSource}
            />
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
            onClick={() => toggleTemplateModal()}>
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
          {!selectedTemplate && (
            <>
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
                data-cy={cyMessageTextArea}
              />
              <InputOptions />
            </>
          )}

          {selectedTemplate && (
            <div className={styles.templateSelector}>
              <button className={styles.removeTemplateButton} onClick={() => setSelectedTemplate(null)}>
                <Close />
              </button>
              <SourceMessage
                renderedContent={selectedTemplate.message}
                source={selectedTemplate.source}
                contentType="template"
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.sendDiv}>
        <button
          type="button"
          ref={sendButtonRef}
          className={`${styles.sendButton} ${(input || selectedTemplate) && styles.sendButtonActive}`}
          onClick={handleClick}
          disabled={input.trim().length == 0 && !selectedTemplate}
          data-cy={cyMessageSendButton}>
          <div className={styles.sendButtonText}>
            <Paperplane />
          </div>
        </button>
      </div>
    </form>
  );
};

export default connector(MessageInput);
