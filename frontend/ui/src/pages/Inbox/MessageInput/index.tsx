import React, {useState, useEffect, useRef, KeyboardEvent, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {sendMessages} from '../../../actions/messages';
import {withRouter} from 'react-router-dom';
import {Button} from 'components';
import {cyMessageSendButton, cyMessageTextArea, cySuggestionsButton} from 'handles';
import {SourceMessage, getOutboundMapper} from 'render';
import {Message, SuggestedReply, Suggestions, Template, Source} from 'model';
import {isEmpty} from 'lodash-es';

import {ReactComponent as Paperplane} from 'assets/images/icons/paperplane.svg';
import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevron-down.svg';

import {ConversationRouteProps} from '../index';
import {StateModel} from '../../../reducers';
import {listTemplates} from '../../../actions/templates';
import {getConversation} from '../../../selectors/conversations';
import {getCurrentMessages} from '../../../selectors/conversations';
import {isTextMessage} from '../../../services/types/messageTypes';

import SuggestedReplySelector from '../SuggestedReplySelector';
import {InputOptions} from './InputOptions';

import styles from './index.module.scss';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {FacebookMapper} from 'render/outbound/facebook';

const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => ({
  conversation: getConversation(state, ownProps),
  messages: getCurrentMessages(state, ownProps),
  config: state.data.config,
  listTemplates,
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = {
  source: Source;
  suggestions: Suggestions;
  showSuggestedReplies: (suggestions: Suggestions) => void;
  hideSuggestedReplies: () => void;
} & ConnectedProps<typeof connector>;

interface SelectedTemplate {
  message: Template;
  source: Source;
}

interface SelectedSuggestedReply {
  message: SuggestedReply;
}

const contentResizedHeight = 200;

const MessageInput = (props: Props) => {
  const {source, conversation, suggestions, showSuggestedReplies, hideSuggestedReplies, sendMessages} = props;

  const outboundMapper = getOutboundMapper(source);
  const fileOutboundMapper = getOutboundMapper('facebook') as FacebookMapper;
  const channelConnected = conversation.channel.connected;

  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  const [selectedSuggestedReply, setSelectedSuggestedReply] = useState<SelectedSuggestedReply | null>(null);
  const [closeIconWidth, setCloseIconWidth] = useState('');
  const [closeIconHeight, setCloseIconHeight] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(true);
  const [maxFileSizeErrorPopUp, setMaxFileSizeErrorPopUp] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(
    'https://airy-media-test.s3.amazonaws.com/test-media/4bd099f9-0c3b-5233-81c4-ef32f78b062d.png'
  );

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);
  const templateSelectorDiv = useRef<HTMLDivElement>(null);
  const selectedSuggestedReplyDiv = useRef<HTMLDivElement>(null);
  const fileSelectorDiv = useRef<HTMLDivElement>(null);
  const removeTemplateButton = useRef(null);
  const removeSuggestedRepliesButton = useRef(null);
  const removeFileButton = useRef(null);

  const focusInput = () => textAreaRef?.current?.focus();

  useEffect(() => {
    setInput('');
    removeTemplateFromInput();
    focusInput();
  }, [conversation.id]);

  useEffect(() => {
    textAreaRef.current.style.height = 'inherit';
    textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, contentResizedHeight)}px`;
  }, [input]);

  useEffect(() => {
    if (!conversation.channel.connected) {
      setInput('');
      textAreaRef.current.style.cursor = 'not-allowed';
    } else {
      textAreaRef.current.style.cursor = 'auto';
    }
  }, [channelConnected]);

  useEffect(() => {
    if (selectedSuggestedReply && selectedSuggestedReplyDiv?.current?.offsetHeight > contentResizedHeight) {
      const contentSelectorDivHeight = selectedSuggestedReplyDiv.current.offsetHeight;
      const scaleRatio = Math.min(contentResizedHeight / contentSelectorDivHeight);

      if (scaleRatio <= 0.7) {
        const iconSize = scaleRatio > 0.3 ? '18px' : '30px';
        const buttonSize = scaleRatio > 0.3 ? '36px' : '60px';

        setCloseIconHeight(iconSize);
        setCloseIconWidth(iconSize);

        if (removeSuggestedRepliesButton && removeSuggestedRepliesButton.current) {
          removeSuggestedRepliesButton.current.style.width = buttonSize;
          removeSuggestedRepliesButton.current.style.height = buttonSize;
        }
      }

      selectedSuggestedReplyDiv.current.style.transform = `scale(${scaleRatio})`;
      selectedSuggestedReplyDiv.current.style.transformOrigin = 'left';
    }
  }, [selectedSuggestedReply]);

  useEffect(() => {
    if (selectedTemplate && templateSelectorDiv?.current?.offsetHeight > contentResizedHeight) {
      const contentSelectorDivHeight = templateSelectorDiv.current.offsetHeight;
      const scaleRatio = Math.min(contentResizedHeight / contentSelectorDivHeight);

      if (scaleRatio <= 0.7) {
        const iconSize = scaleRatio > 0.3 ? '18px' : '30px';
        const buttonSize = scaleRatio > 0.3 ? '36px' : '60px';

        setCloseIconHeight(iconSize);
        setCloseIconWidth(iconSize);

        if (removeTemplateButton && removeTemplateButton.current) {
          removeTemplateButton.current.style.width = buttonSize;
          removeTemplateButton.current.style.height = buttonSize;
        }
      }

      templateSelectorDiv.current.style.transform = `scale(${scaleRatio})`;
      templateSelectorDiv.current.style.transformOrigin = 'left';
    }
  }, [selectedTemplate]);

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const fileSizeInMB = file.size / Math.pow(1024, 2);

    if (fileSizeInMB >= 25) {
      setMaxFileSizeErrorPopUp(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    HttpClientInstance.uploadFile({file: formData}).then((response: any) => {
      setMediaUrl(response.mediaUrl);
      setSelectedFile(true);
    });
  };

  const sendMessage = () => {
    if (!channelConnected) {
      return;
    }
    setSelectedSuggestedReply(null);
    setSelectedTemplate(null);

    sendMessages(
      selectedTemplate || selectedSuggestedReply
        ? {
            conversationId: conversation.id,
            message: selectedTemplate?.message.content || selectedSuggestedReply?.message.content,
          }
        : selectedFile && mediaUrl
        ? {
            conversationId: conversation.id,
            message: fileOutboundMapper.getAttachmentPayload(mediaUrl),
          }
        : {
            conversationId: conversation.id,
            message: outboundMapper.getTextPayload(input),
          }
    ).then(() => {
      setInput('');
      removeTemplateFromInput();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (event.metaKey && event.key === 'Enter') ||
      (!event.shiftKey && event.key === 'Enter') ||
      (event.ctrlKey && event.key === 'Enter')
    ) {
      event.preventDefault();
      if (input.trim().length > 0) {
        sendMessage();
      }
    }
  };

  const getLastMessageWithSuggestedReplies = useCallback(() => {
    const lastMessages = props.messages
      ?.filter((message: Message) => message.fromContact)
      .slice(props.messages.length - 5)
      .reverse();
    return lastMessages?.find(
      (message: Message) => message.metadata?.suggestions && Object.keys(message.metadata.suggestions).length > 0
    );
  }, [props.messages]);

  const hasSuggestions = () => !isEmpty(suggestions);

  const toggleSuggestedReplies = () => {
    if (hasSuggestions()) {
      hideSuggestedReplies();
    } else {
      showSuggestedReplies(getLastMessageWithSuggestedReplies().metadata.suggestions);
    }
  };

  const selectTemplate = (template: Template) => {
    const jsonTemplate = template.content.message;

    if (selectedTemplate) setSelectedTemplate(null);

    if (input) setInput('');

    if (selectedSuggestedReply) setSelectedSuggestedReply(null);

    if (isTextMessage(template)) {
      setInput(jsonTemplate.text);
    } else {
      setSelectedTemplate({message: template, source: template.source});
    }

    sendButtonRef.current.focus();
  };

  const selectSuggestedReply = (reply: SuggestedReply) => {
    if (selectedSuggestedReply) setSelectedSuggestedReply(null);

    if (input) setInput('');

    if (selectedTemplate) setSelectedTemplate(null);

    hideSuggestedReplies();
    if (isTextMessage(reply)) {
      setInput(reply.content.text);
    } else {
      setSelectedSuggestedReply({message: reply});
    }
    sendButtonRef.current.focus();
  };

  const removeTemplateFromInput = () => {
    setSelectedTemplate(null);
    setCloseIconWidth('');
    setCloseIconHeight('');
  };

  const removeSelectedSuggestedReply = () => {
    setSelectedSuggestedReply(null);
    setCloseIconWidth('');
    setCloseIconHeight('');
  };

  const removeFileFromInput = () => {
    setSelectedFile(null);
    setCloseIconWidth('');
    setCloseIconHeight('');
  };

  return (
    <div className={styles.container}>
      {getLastMessageWithSuggestedReplies() && (
        <div className={styles.suggestionsRow}>
          {hasSuggestions() && (
            <SuggestedReplySelector
              onClose={toggleSuggestedReplies}
              suggestions={suggestions}
              selectSuggestedReply={selectSuggestedReply}
              source={source}
            />
          )}

          <Button
            type="button"
            styleVariant="outline-big"
            onClick={toggleSuggestedReplies}
            dataCy={cySuggestionsButton}>
            <div className={styles.suggestionButton}>
              Suggestions
              <ChevronDownIcon className={hasSuggestions() ? styles.chevronUp : styles.chevronDown} />
            </div>
          </Button>
        </div>
      )}
      <form className={styles.inputForm}>
        <div className={styles.messageWrap}>
          <div className={styles.inputWrap}>
            {!selectedTemplate && !selectedSuggestedReply && (
              <>
                <textarea
                  className={styles.messageTextArea}
                  ref={textAreaRef}
                  rows={1}
                  name="inputBar"
                  placeholder={channelConnected ? 'Enter a message...' : ''}
                  autoFocus={channelConnected}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-cy={cyMessageTextArea}
                  disabled={!channelConnected}
                />
                <InputOptions
                  source={source}
                  inputDisabled={!channelConnected}
                  input={input}
                  setInput={setInput}
                  selectTemplate={selectTemplate}
                  focusInput={focusInput}
                  sendMessages={sendMessages}
                  conversationId={conversation.id}
                  mediaComponentConfig={props.config.components['media-resolver']}
                  uploadFile={uploadFile}
                />
              </>
            )}
            {selectedSuggestedReply && (
              <div className={styles.suggestionRepliesSelector} ref={selectedSuggestedReplyDiv}>
                <button
                  className={styles.removeButton}
                  onClick={removeSelectedSuggestedReply}
                  ref={removeSuggestedRepliesButton}>
                  <Close
                    style={{
                      width: closeIconWidth ?? '',
                      height: closeIconHeight ?? '',
                    }}
                  />
                </button>
                <SourceMessage
                  message={selectedSuggestedReply.message}
                  source={source}
                  contentType="suggestedReplies"
                />
              </div>
            )}

            {selectedTemplate && (
              <>
                <div className={styles.templateSelector} ref={templateSelectorDiv}>
                  <button className={styles.removeButton} onClick={removeTemplateFromInput} ref={removeTemplateButton}>
                    <Close
                      style={{
                        width: closeIconWidth ?? '',
                        height: closeIconHeight ?? '',
                      }}
                    />
                  </button>
                  <SourceMessage
                    message={selectedTemplate.message}
                    source={selectedTemplate.source}
                    contentType="template"
                  />
                </div>
              </>
            )}

            {selectedFile && (
              <>
                <div className={styles.fileSelector} ref={fileSelectorDiv}>
                  <button className={styles.removeButton} onClick={removeFileFromInput} ref={removeFileButton}>
                    <Close
                      style={{
                        width: closeIconWidth ?? '',
                        height: closeIconHeight ?? '',
                      }}
                    />
                  </button>
                  <SourceMessage
                    message={fileOutboundMapper.getAttachmentPayload(mediaUrl)}
                    source={'facebook'}
                    contentType="message"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.sendDiv}>
          {!channelConnected && (
            <div className={styles.disconnectedChannelToolTip}>
              <p>Sending messages is disabled because this channel was disconnected.</p>
            </div>
          )}
          <button
            type="button"
            ref={sendButtonRef}
            className={`${styles.sendButton} ${
              (input.trim().length != 0 || selectedTemplate || selectedSuggestedReply) &&
              channelConnected &&
              styles.sendButtonActive
            }`}
            onClick={sendMessage}
            disabled={input.trim().length == 0 && !selectedTemplate && !selectedSuggestedReply && !channelConnected}
            data-cy={cyMessageSendButton}>
            <div className={styles.sendButtonText}>
              <Paperplane />
            </div>
          </button>
        </div>
      </form>
      <div
        className={styles.linebreakHint}
        style={textAreaRef?.current?.value?.length > 0 ? {visibility: 'visible'} : {visibility: 'hidden'}}>
        {'Shift + Enter to add line'}
      </div>
    </div>
  );
};

export default withRouter(connector(MessageInput));
