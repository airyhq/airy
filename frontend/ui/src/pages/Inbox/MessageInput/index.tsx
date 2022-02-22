import React, {useState, useEffect, useRef, KeyboardEvent, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {sendMessages} from '../../../actions/messages';
import {Button, SimpleLoader} from 'components';
import {cyMessageSendButton, cyMessageTextArea, cySuggestionsButton} from 'handles';
import {getOutboundMapper} from 'render';
import {Message, SuggestedReply, Suggestions, Template, Source} from 'model';
import {isEmpty} from 'lodash-es';

import {ReactComponent as PaperPlane} from 'assets/images/icons/paperplane.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevronDown.svg';

import {isComponentHealthy, StateModel} from '../../../reducers';
import {listTemplates} from '../../../actions/templates';
import {useCurrentConversation, useCurrentMessages} from '../../../selectors/conversations';
import {isTextMessage} from '../../../services/types/messageTypes';
import SuggestedReplySelector from '../SuggestedReplySelector';
import {InputOptions} from './InputOptions';
import {HttpClientInstance} from '../../../httpClient';
import {InputSelector} from './InputSelector';
import {getAttachmentType} from 'render';
import {usePrevious} from '../../../services/hooks/usePrevious';
import {getAllSupportedAttachmentsForSource} from '../../../services/types/attachmentsTypes';
import {AudioRecording} from './AudioRecording';
import styles from './index.module.scss';

const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: StateModel) => ({
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

export interface SelectedSuggestedReply {
  message: SuggestedReply;
}

const contentResizedHeight = 120;
const sourcesWithAttachments = ['facebook', 'instagram', 'chatplugin', 'twilio.whatsapp'];

const MessageInput = (props: Props) => {
  const {
    source,
    suggestions,
    showSuggestedReplies,
    hideSuggestedReplies,
    sendMessages,
    draggedAndDroppedFile,
    setDraggedAndDroppedFile,
    setDragAndDropDisabled,
    config,
  } = props;

  const conversation = useCurrentConversation();
  const messages = useCurrentMessages();
  const outboundMapper: any = getOutboundMapper(source);
  const channelConnected = conversation.channel.connected;

  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  const [selectedSuggestedReply, setSelectedSuggestedReply] = useState<SelectedSuggestedReply | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [fileUploadErrorPopUp, setFileUploadErrorPopUp] = useState<string>('');
  const [loadingSelector, setLoadingSelector] = useState(false);
  const [blockSpam, setBlockSpam] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);

  //audio stuff
  const [audioStream, setAudioStream] = useState<null | MediaStream>(null);
  const prevConversationId = usePrevious(conversation.id);

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);

  const focusInput = () => textAreaRef?.current?.focus();

  const canSendMedia = isComponentHealthy(config, 'media-resolver') && sourcesWithAttachments.indexOf(source) !== -1;

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
    if (draggedAndDroppedFile && !loadingSelector) {
      uploadFile(draggedAndDroppedFile);
    }
  }, [draggedAndDroppedFile]);

  useEffect(() => {
    if (fileToUpload) {
      setLoadingSelector(true);
      setDragAndDropDisabled(true);
    }
  }, [fileToUpload]);

  useEffect(() => {
    if (prevConversationId !== conversation.id) {
      setInput('');
      removeElementFromInput();
      focusInput();
      setFileToUpload(null);
      setSelectedTemplate(null);
      setSelectedSuggestedReply(null);
      setUploadedFileUrl(null);
      setDraggedAndDroppedFile(null);
      setFileUploadErrorPopUp('');
      setLoadingSelector(false);
    }
  }, [conversation.id]);

  useEffect(() => {
    if (isElementSelected()) {
      setDragAndDropDisabled(true);
    } else if (canSendMedia) {
      setDragAndDropDisabled(false);
    }
  }, [selectedTemplate, selectedSuggestedReply, uploadedFileUrl, canSendMedia]);

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
    if (file) {
      const fileSizeInMB = file.size / Math.pow(1024, 2);
      const maxFileSizeAllowed =
        source === 'instagram'
          ? 8
          : source === 'twilio.whatsapp' || source === 'google'
          ? 5
          : 15 || (source === 'chatplugin' ? 5 : 15);

      //size limit error
      if (fileSizeInMB >= maxFileSizeAllowed) {
        return setFileUploadErrorPopUp(
          `Failed to upload the file.
        The maximum file size allowed for this source is ${maxFileSizeAllowed}MB.`
        );
      }

      //unsupported file error
      if (!getAttachmentType(file.name, source)) {
        const supportedFilesForSource = getAllSupportedAttachmentsForSource(source);

        const errorMessage = `This file type is not supported by this source. 
      Supported files: ${supportedFilesForSource}`;

        return setFileUploadErrorPopUp(errorMessage);
      }

      setFileToUpload(file);
    }
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedSuggestedReply) setSelectedSuggestedReply(null);
    if (selectedTemplate) setSelectedTemplate(null);
    if (uploadedFileUrl) setUploadedFileUrl(null);

    setIsFileLoaded(true);
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
      setBlockSpam(true);

      const message = {
        conversationId: conversation.id,
        message: {},
      };

      switch (source) {
        case Source.facebook:
        case Source.google:
        case Source.twilioWhatsApp:
        case Source.instagram:
        case Source.chatPlugin:
          if (selectedTemplate || selectedSuggestedReply) {
            if (input.length > 0) {
              sendMessages({
                conversationId: conversation.id,
                message: selectedTemplate?.message.content || selectedSuggestedReply?.message.content,
              }),
                (message.message = outboundMapper.getTextPayload(input));
            } else {
              message.message = selectedTemplate?.message.content || selectedSuggestedReply?.message.content;
            }
          }
          if (uploadedFileUrl && input.length == 0) {
            message.message = outboundMapper.getAttachmentPayload(uploadedFileUrl);
          }
          if (!uploadedFileUrl && input.length > 0) {
            message.message = outboundMapper.getTextPayload(input);
          }
          if (uploadedFileUrl && input.length > 0) {
            sendMessages({
              conversationId: conversation.id,
              message: outboundMapper.getAttachmentPayload(uploadedFileUrl),
            });
            message.message = outboundMapper.getTextPayload(input);
          }
          break;
        case Source.twilioSMS:
          message.message = outboundMapper.getTextPayload(input);
          break;
        case Source.viber:
          message.message = outboundMapper.getTextPayload(input);
          break;
      }

      sendMessages(message).then(() => {
        setInput('');
        setBlockSpam(false);
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
      if ((input.trim().length > 0 || isElementSelected()) && !blockSpam) {
        sendMessage();
      }
    }
  };

  const getLastMessageWithSuggestedReplies = useCallback(() => {
    const lastMessages = messages
      ?.filter((message: Message) => message.fromContact)
      .slice(messages.length - 5)
      .reverse();
    return lastMessages?.find(
      (message: Message) => message.metadata?.suggestions && Object.keys(message.metadata.suggestions).length > 0
    );
  }, [messages]);

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
      setIsFileLoaded(false);
    }

    if (setDraggedAndDroppedFile) {
      setDraggedAndDroppedFile(null);
    }
  };

  const closeFileErrorPopUp = () => {
    setFileUploadErrorPopUp('');
    setDraggedAndDroppedFile(null);
  };

  const getAudioStream = (stream: MediaStream) => {
    setAudioStream(stream);
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
            {!audioStream && (
              <div className={styles.contentInput}>
                {loadingSelector && (
                  <div className={styles.selectorLoader}>
                    <SimpleLoader />
                    <span>loading file... </span>
                  </div>
                )}
                {isElementSelected() && (
                  <div className={styles.imagesContainer}>
                    <InputSelector
                      message={
                        selectedTemplate?.message ??
                        selectedSuggestedReply?.message ??
                        outboundMapper?.getAttachmentPayload(uploadedFileUrl)
                      }
                      source={source}
                      messageType={
                        selectedTemplate ? 'template' : selectedSuggestedReply ? 'suggestedReplies' : 'message'
                      }
                      removeElementFromInput={removeElementFromInput}
                      contentResizedHeight={selectTemplate ? 60 : contentResizedHeight}
                    />
                  </div>
                )}

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
                  disabled={!channelConnected || fileUploadErrorPopUp ? true : false}
                />
              </div>
            )}

            {audioStream && <AudioRecording audio={audioStream} />}

            <InputOptions
              source={source}
              inputDisabled={!channelConnected}
              input={input}
              setInput={setInput}
              selectTemplate={selectTemplate}
              focusInput={focusInput}
              sendMessages={sendMessages}
              selectFile={selectFile}
              isFileLoaded={isFileLoaded}
              canSendMedia={canSendMedia}
              fileUploadErrorPopUp={fileUploadErrorPopUp}
              closeFileErrorPopUp={closeFileErrorPopUp}
              loadingSelector={loadingSelector}
              getAudioStream={getAudioStream}
            />
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
            disabled={(input.trim().length == 0 && !canSendMessage()) || blockSpam}
            data-cy={cyMessageSendButton}
          >
            <div className={styles.sendButtonText}>
              <PaperPlane />
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

export default connector(MessageInput);
