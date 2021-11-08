import React, {useState, useEffect, useRef, KeyboardEvent, useCallback} from 'react';
import {withRouter} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';
import {sendMessages} from '../../../actions/messages';
import {Button, SimpleLoader} from 'components';
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
import {HttpClientInstance} from '../../../httpClient';
import {FacebookMapper} from 'render/outbound/facebook';
import {InputSelector} from './InputSelector';
import {usePrevious} from '../../../services/hooks/usePrevious';
import {getAttachmentType, mediaAttachmentsExtensions} from 'render';

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
  setDragAndDropDisabled: React.Dispatch<React.SetStateAction<boolean>>;
} & ConnectedProps<typeof connector>;

interface SelectedTemplate {
  message: Template;
  source: Source;
}

export interface FileInfo {
  size: number;
  type: string;
}

export interface SelectedSuggestedReply {
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
    setDragAndDropDisabled,
    config,
  } = props;

  const contentResizedHeight = 200;

  const outboundMapper = getOutboundMapper(source);
  const fileOutboundMapper = getOutboundMapper('facebook') as FacebookMapper;
  const channelConnected = conversation.channel.connected;

  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  const [selectedSuggestedReply, setSelectedSuggestedReply] = useState<SelectedSuggestedReply | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [fileUploadErrorPopUp, setFileUploadErrorPopUp] = useState<string>('');
  const [loadingSelector, setLoadingSelector] = useState(false);
  const [fileInfo, setFileInfo] = useState<null | {size: number; type: string}>(null);
  const prevConversationId = usePrevious(conversation.id);

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);

  const focusInput = () => textAreaRef?.current?.focus();

  useEffect(() => {
    if (draggedAndDroppedFile && !loadingSelector) {
      uploadFile(draggedAndDroppedFile);
    }
  }, [draggedAndDroppedFile]);

  useEffect(() => {
    if (prevConversationId !== conversation.id) {
      setInput('');
      removeElementFromInput();
      focusInput();
      setFileToUpload(null);
      setUploadedFileUrl(null);
      setFileUploadErrorPopUp('');
      setLoadingSelector(false);
    }
  }, [conversation.id]);

  useEffect(() => {
    if (loadingSelector && fileToUpload) {
      let isRequestAborted = false;

      const fetchMediaUrl = async () => {
        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
          const uploadFileResponse: any = await HttpClientInstance.uploadFile({file: formData});

          if (!isRequestAborted) {
            setUploadedFileUrl(uploadFileResponse.mediaUrl);
            setLoadingSelector(false);
          }
        } catch {
          setLoadingSelector(false);
          setFileUploadErrorPopUp('Failed to upload the file. Please try again later.');
        }
      };

      fetchMediaUrl();

      return () => {
        isRequestAborted = true;
      };
    }
  }, [loadingSelector, fileToUpload]);

  useEffect(() => {
    if (fileToUpload) {
      setLoadingSelector(true);
      setDragAndDropDisabled(true);
    }
  }, [fileToUpload]);

  useEffect(() => {
    if (isElementSelected()) {
      setDragAndDropDisabled(true);
    } else if (config.components['media-resolver'].enabled && (source === 'facebook' || source === 'instagram')) {
      setDragAndDropDisabled(false);
    }
  }, [selectedTemplate, selectedSuggestedReply, uploadedFileUrl]);

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
    const maxFileSizeAllowed = source === 'instagram' ? 8 : 15;

    const imageFiles = mediaAttachmentsExtensions[source + 'ImageExtensions'];
    const videoFiles = mediaAttachmentsExtensions[source + 'VideoExtensions'];
    const audioFiles = mediaAttachmentsExtensions[source + 'AudioExtensions'];
    const docsFiles = mediaAttachmentsExtensions[source + 'FileExtensions'];

    //size limit error
    if (fileSizeInMB >= maxFileSizeAllowed) {
      return setFileUploadErrorPopUp(
        `Failed to upload the file. The maximum file size allowed is ${maxFileSizeAllowed}MB.`
      );
    }

    //unsupported file error
    if (!getAttachmentType(file.name, source)) {
      const capitalizedSourceName = source.charAt(0).toUpperCase() + source.slice(1);

      const supportedDocsFiles = docsFiles ? ',' + docsFiles.join(', ') : '';
      const supportedAudioFiles = audioFiles ? ',' + audioFiles.join(', ') : '';
      const supportedVideoFiles = videoFiles ? ',' + videoFiles.join(', ') : '';
      const supportedImageFiles = imageFiles ? imageFiles.join(', ') : '';

      const errorMessage = `This file type is not supported as a sending attachment by ${capitalizedSourceName} Messenger. Supported files: 
      ${supportedImageFiles} ${supportedVideoFiles} ${supportedAudioFiles} ${supportedDocsFiles}`;

      return setFileUploadErrorPopUp(errorMessage);
    }

    setFileInfo({size: fileSizeInMB, type: getAttachmentType(file.name, source)});
    setFileToUpload(file);
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedSuggestedReply) setSelectedSuggestedReply(null);
    if (input) setInput('');
    if (selectedTemplate) setSelectedTemplate(null);
    if (uploadedFileUrl) setUploadedFileUrl(null);

    const file = event.target.files[0];
    return uploadFile(file);
  };

  const canSendMessage = () => {
    return !((!selectedTemplate && !selectedSuggestedReply && !input && !uploadedFileUrl) || !channelConnected);
  };

  const isElementSelected = () => {
    return selectedTemplate || selectedSuggestedReply || uploadedFileUrl;
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
          : uploadedFileUrl
          ? {
              conversationId: conversation.id,
              message: fileOutboundMapper.getAttachmentPayload(uploadedFileUrl),
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

    if (uploadedFileUrl) setUploadedFileUrl(null);

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

    if (uploadedFileUrl) setUploadedFileUrl(null);

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

    if (uploadedFileUrl) {
      setUploadedFileUrl(null);
    }

    if (setDraggedAndDroppedFile) {
      setDraggedAndDroppedFile(null);
    }
  };

  const closeFileErrorPopUp = () => {
    setFileUploadErrorPopUp('');
    setDraggedAndDroppedFile(null);
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
            dataCy={cySuggestionsButton}
          >
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
                  placeholder={channelConnected && !loadingSelector ? 'Enter a message...' : ''}
                  autoFocus={channelConnected}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-cy={cyMessageTextArea}
                  disabled={!channelConnected || loadingSelector || fileUploadErrorPopUp ? true : false}
                />
                {loadingSelector && (
                  <div className={styles.selectorLoader}>
                    <SimpleLoader />
                    <span>loading file... </span>
                  </div>
                )}

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
                  mediaResolverComponentsConfig={config.components['media-resolver']}
                  closeFileErrorPopUp={closeFileErrorPopUp}
                  loadingSelector={loadingSelector}
                />
              </>
            )}

            {isElementSelected() && (
              <>
                <InputSelector
                  message={
                    selectedTemplate?.message ??
                    selectedSuggestedReply?.message ??
                    fileOutboundMapper.getAttachmentPayload(uploadedFileUrl)
                  }
                  source={source}
                  messageType={selectedTemplate ? 'template' : selectedSuggestedReply ? 'suggestedReplies' : 'message'}
                  removeElementFromInput={removeElementFromInput}
                  contentResizedHeight={contentResizedHeight}
                  fileInfo={fileInfo}
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
            data-cy={cyMessageSendButton}
          >
            <div className={styles.sendButtonText}>
              <Paperplane />
            </div>
          </button>
        </div>
      </form>
      <div
        className={styles.linebreakHint}
        style={textAreaRef?.current?.value?.length > 0 ? {visibility: 'visible'} : {visibility: 'hidden'}}
      >
        {'Shift + Enter to add line'}
      </div>
    </div>
  );
};

export default withRouter(connector(MessageInput));
