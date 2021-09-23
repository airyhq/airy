import React, {useState, useEffect, useRef, KeyboardEvent, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {sendMessages} from '../../../actions/messages';
import {withRouter} from 'react-router-dom';
import {Button} from 'components';
import {cyMessageSendButton, cyMessageTextArea, cySuggestionsButton} from 'handles';
import {getOutboundMapper} from 'render';
import {Message, SuggestedReply, Suggestions, Template, Source} from 'model';
import {isEmpty} from 'lodash-es';

import {ReactComponent as Paperplane} from 'assets/images/icons/paperplane.svg';
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
import {getAttachmentType, imageExtensions, fileExtensions, videoExtensions, audioExtensions} from 'render/attachments';
import {InputSelector} from './InputSelector';

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
  draggedAndDroppedFile: File;
  setDraggedAndDroppedFile: React.Dispatch<React.SetStateAction<File | null>>;
} & ConnectedProps<typeof connector>;

interface SelectedTemplate {
  message: Template;
  source: Source;
}

interface SelectedSuggestedReply {
  message: SuggestedReply;
}

const MessageInput = (props: Props) => {
  const {
    source,
    conversation,
    suggestions,
    showSuggestedReplies,
    hideSuggestedReplies,
    sendMessages,
    draggedAndDroppedFile,
    setDraggedAndDroppedFile,
  } = props;

  const contentResizedHeight = 200;

  const outboundMapper = getOutboundMapper(source);
  const fileOutboundMapper = getOutboundMapper('facebook') as FacebookMapper;
  const channelConnected = conversation.channel.connected;

  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  const [selectedSuggestedReply, setSelectedSuggestedReply] = useState<SelectedSuggestedReply | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [fileUploadErrorPopUp, setFileUploadErrorPopUp] = useState<string>('');

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);

  const focusInput = () => textAreaRef?.current?.focus();

  useEffect(() => {
    if (draggedAndDroppedFile) {
      uploadFile(draggedAndDroppedFile);
    }
  }, [draggedAndDroppedFile]);

  useEffect(() => {
    setInput('');
    removeElementFromInput();
    focusInput();
  }, [conversation.id]);

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = 'inherit';
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, contentResizedHeight)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      if (!conversation.channel.connected) {
        setInput('');
        textAreaRef.current.style.cursor = 'not-allowed';
      } else {
        textAreaRef.current.style.cursor = 'auto';
      }
    }
  }, [channelConnected]);

  const uploadFile = (file: File) => {
    const fileSizeInMB = file.size / Math.pow(1024, 2);

    if (fileSizeInMB >= 25) {
      setFileUploadErrorPopUp('Failed to upload the file. The maximum file size allowed is 25MB.');
      return;
    }

    if (!getAttachmentType(file.name)) {
      const message = `This file type is not supported. Supported files: ${audioExtensions.join(
        ' , '
      )} ${imageExtensions.join(' , ')} ${videoExtensions.join(' , ')} ${fileExtensions.join(' , ')}`;
      setFileUploadErrorPopUp(message);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    return HttpClientInstance.uploadFile({file: formData})
      .then((response: any) => {
        setSelectedFileUrl(response.mediaUrl);
      })
      .catch(() => {
        setFileUploadErrorPopUp('Failed to upload the file. Please try again later.');
      });
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedSuggestedReply) setSelectedSuggestedReply(null);
    if (input) setInput('');
    if (selectedTemplate) setSelectedTemplate(null);
    if (selectedFileUrl) setSelectedFileUrl(null);

    const file = event.target.files[0];

    return uploadFile(file);
  };

  const canSendMessage = () => {
    return !((!selectedTemplate && !selectedSuggestedReply && !input && !selectedFileUrl) || !channelConnected);
  };

  const isElementSelected = () => {
    return selectedTemplate || selectedSuggestedReply || selectedFileUrl;
  };

  const sendMessage = () => {
    if (canSendMessage()) {
      setSelectedSuggestedReply(null);
      setSelectedTemplate(null);

      sendMessages(
        selectedTemplate || selectedSuggestedReply
          ? {
              conversationId: conversation.id,
              message: selectedTemplate?.message.content || selectedSuggestedReply?.message.content,
            }
          : selectedFileUrl
          ? {
              conversationId: conversation.id,
              message: fileOutboundMapper.getAttachmentPayload(selectedFileUrl),
            }
          : {
              conversationId: conversation.id,
              message: outboundMapper.getTextPayload(input),
            }
      ).then(() => {
        setInput('');
        removeElementFromInput();
      });
    }
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

    if (selectedFileUrl) setSelectedFileUrl(null);

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

    if (selectedFileUrl) setSelectedFileUrl(null);

    hideSuggestedReplies();
    if (isTextMessage(reply)) {
      setInput(reply.content.text);
    } else {
      setSelectedSuggestedReply({message: reply});
    }
    sendButtonRef.current.focus();
  };

  const removeElementFromInput = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null);
    }

    if (selectedSuggestedReply) {
      setSelectedSuggestedReply(null);
    }

    if (selectedFileUrl) {
      setSelectedFileUrl(null);
    }

    if (setDraggedAndDroppedFile) {
      setDraggedAndDroppedFile(null);
    }
  };

  const closeFileErrorPopUp = () => {
    setFileUploadErrorPopUp('');
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
            {!isElementSelected() && (
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
                  selectFile={selectFile}
                  fileUploadErrorPopUp={fileUploadErrorPopUp}
                  closeFileErrorPopUp={closeFileErrorPopUp}
                />
              </>
            )}

            {isElementSelected() && (
              <>
                <InputSelector
                  message={
                    selectedTemplate?.message ??
                    selectedSuggestedReply?.message ??
                    fileOutboundMapper.getAttachmentPayload(selectedFileUrl)
                  }
                  source={source}
                  messageType={selectedTemplate ? 'template' : selectedSuggestedReply ? 'suggestedReplies' : 'message'}
                  removeElementFromInput={removeElementFromInput}
                  contentResizedHeight={contentResizedHeight}
                />
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
              (input.trim().length != 0 || canSendMessage()) && styles.sendButtonActive
            }`}
            onClick={sendMessage}
            disabled={input.trim().length == 0 && !canSendMessage()}
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
