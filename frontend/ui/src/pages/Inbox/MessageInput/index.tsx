import React, {useState, useEffect, useRef, KeyboardEvent, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {sendMessages} from '../../../actions/messages';
import TemplateSelector from '../TemplateSelector';
import 'emoji-mart/css/emoji-mart.css';
import {withRouter} from 'react-router-dom';
import {Button} from '@airyhq/components';
import {cyMessageSendButton, cyMessageTextArea} from 'handles';
import {Picker} from 'emoji-mart';
import {SourceMessage} from 'render';
import {getTextMessagePayload, Message, SuggestedReply, Template} from 'httpclient';
import 'emoji-mart/css/emoji-mart.css';

import {ReactComponent as Paperplane} from 'assets/images/icons/paperplane.svg';
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as TemplateAlt} from 'assets/images/icons/template-alt.svg';
import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevron-down.svg';

import {ConversationRouteProps} from '../index';
import {StateModel} from '../../../reducers';
import {Source} from 'httpclient';
import {listTemplates} from '../../../actions/templates';
import {getCurrentConversation} from '../../../selectors/conversations';
import {getCurrentMessages} from '../../../selectors/conversations';

import SuggestedReplySelector from '../SuggestedReplySelector';

const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => {
  return {
    conversation: getCurrentConversation(state, ownProps),
    messages: getCurrentMessages(state, ownProps),
    listTemplates,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type MessageInputProps = {source: Source};

interface SelectedTemplate {
  message: Template;
  source: Source;
}

const MessageInput = (props: MessageInputProps & ConnectedProps<typeof connector>) => {
  const {source, conversation} = props;

  const [input, setInput] = useState('');
  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [isShowingTemplateModal, setIsShowingTemplateModal] = useState(false);
  const [isShowingSuggestedReplies, setIsShowingSuggestedReplies] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);
  const emojiDiv = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  useEffect(() => {
    textAreaRef.current.style.height = '0px';
    const scrollHeight = Math.min(100, textAreaRef.current.scrollHeight);
    textAreaRef.current.style.height = scrollHeight + 'px';
  }, [input]);

  const sendMessage = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null);
      props
        .sendMessages({conversationId: conversation.id, message: selectedTemplate.message.content})
        .then(() => setInput(''));
      return;
    }

    props.sendMessages(getTextMessagePayload(source, conversation.id, input)).then(() => setInput(''));
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
        !jsonTemplate.message.containsRichText &&
        !jsonTemplate.message.attachments &&
        !jsonTemplate.message.attachment
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
            <TemplateSelector onClose={toggleTemplateModal} selectTemplate={selectTemplate} source={source} />
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

  const getLastMessageWithSuggestedReplies = useCallback(() => {
    const lastMessages = props.messages
      ?.filter((message: Message) => message.senderType == 'source_contact')
      .slice(props.messages.length - 5)
      .reverse();
    return lastMessages?.find(
      (message: Message) => message.metadata?.suggestions && Object.keys(message.metadata.suggestions).length > 0
    );
  }, [props.messages]);

  const toggleSuggestedReplies = () => {
    setIsShowingSuggestedReplies(!isShowingSuggestedReplies);
  };

  const selectSuggestedReply = (reply: SuggestedReply) => {
    setInput(reply.content.text);
    setIsShowingSuggestedReplies(false);
    sendButtonRef.current.focus();
  };

  return (
    <div className={styles.container}>
      {getLastMessageWithSuggestedReplies() && (
        <div className={styles.suggestionsRow}>
          {isShowingSuggestedReplies && (
            <SuggestedReplySelector
              onClose={toggleSuggestedReplies}
              suggestions={getLastMessageWithSuggestedReplies().metadata.suggestions}
              selectSuggestedReply={selectSuggestedReply}
              source={source}
            />
          )}

          <Button type="button" styleVariant="outline" onClick={toggleSuggestedReplies}>
            <div className={styles.suggestionButton}>
              Suggestions
              <ChevronDownIcon className={isShowingSuggestedReplies ? styles.chevronUp : styles.chevronDown} />
            </div>
          </Button>
        </div>
      )}
      <form className={styles.inputForm}>
        <div className={styles.messageWrap}>
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
                  content={selectedTemplate.message}
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
    </div>
  );
};

export default withRouter(connector(MessageInput));
