import React, {useState, useEffect, useRef, KeyboardEvent, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {resendMessages, sendMessages} from '../../../actions/messages';
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
import {uploadMedia} from '../../../services/mediaUploader';
import {InputSelector} from './InputSelector';
import {getAttachmentType} from 'render';
import {usePrevious} from '../../../services/hooks/usePrevious';
import {getAllSupportedAttachmentsForSource} from '../../../services/types/attachmentsTypes';
import {AudioRecording} from './AudioRecording';
import styles from './index.module.scss';

const mapDispatchToProps = {sendMessages, resendMessages};

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
  resendFailedMessage: boolean;
  failedMessageId: string;
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
    resendFailedMessage,
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
  const [errorPopUp, setErrorPopUp] = useState('');
  const [loadingSelector, setLoadingSelector] = useState(false);
  const [blockSpam, setBlockSpam] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);

  const [audioRecordingStarted, setAudioRecordingStarted] = useState(false);
  const [audioRecordingMediaRecorder, setAudioRecordingMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioRecordingPaused, setAudioRecordingPaused] = useState(false);
  const [audioRecordingPreviewLoading, setAudioRecordingPreviewLoading] = useState(false);
  const [audioRecordingFileUploaded, setAudioRecordingFileUploaded] = useState<string | null>(null);
  const [audioRecordingResumed, setAudioRecordingResumed] = useState(false);
  const [audioRecordingCanceled, setAudioRecordingCanceled] = useState(true);
  const [audioRecordingSent, setAudioRecordingSent] = useState(false);

  const prevConversationId = usePrevious(conversation.id);

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);

  const focusInput = () => textAreaRef?.current?.focus();

  const canSendMedia = isComponentHealthy(config, 'media-resolver') && sourcesWithAttachments.indexOf(source) !== -1;

  useEffect(() => {
    if (loadingSelector && fileToUpload) {
      let isRequestAborted = false;

      if (!isRequestAborted) {
        uploadMedia(fileToUpload)
          .then((response: {mediaUrl: string}) => {
            setUploadedFileUrl(response.mediaUrl);
            setLoadingSelector(false);
          })
          .catch(() => {
            setLoadingSelector(false);
            setErrorPopUp('Failed to upload the file. Please try again later.');
          });
      }

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
      setErrorPopUp('');
      setLoadingSelector(false);
      resetAudioRecordingStatus();
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

  useEffect(() => {
    resendFailedMessage && resendMessages({messageId: props.failedMessageId});
  }, [resendFailedMessage]);

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
        return setErrorPopUp(
          `Failed to upload the file.
        The maximum file size allowed for this source is ${maxFileSizeAllowed}MB.`
        );
      }

      //unsupported file error
      if (!getAttachmentType(file.name, source)) {
        const supportedFilesForSource = getAllSupportedAttachmentsForSource(source);

        const errorMessage = `This file type is not supported by this source. 
      Supported files: ${supportedFilesForSource}`;

        return setErrorPopUp(errorMessage);
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
    return !(
      (!selectedTemplate && !selectedSuggestedReply && !input && !uploadedFileUrl && !audioRecordingFileUploaded) ||
      !channelConnected
    );
  };

  const isElementSelected = () => {
    return selectedTemplate || selectedSuggestedReply || uploadedFileUrl;
  };

  const sendMessage = () => {
    if (canSendMessage()) {
      setSelectedSuggestedReply(null);
      setSelectedTemplate(null);
      setBlockSpam(true);
      setAudioRecordingSent(true);

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
          if (audioRecordingFileUploaded) {
            message.message = outboundMapper.getAttachmentPayload(audioRecordingFileUploaded);
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
        setAudioRecordingSent(false);
        setAudioRecordingPaused(false);
        setAudioRecordingFileUploaded(null);
        setAudioRecordingCanceled(true);

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
    setErrorPopUp('');
    setDraggedAndDroppedFile(null);
  };

  const startAudioRecording = () => {
    setAudioRecordingStarted(true);
    setAudioRecordingCanceled(false);
  };

  const fetchMediaRecorder = (mediaRecorder: MediaRecorder) => {
    setAudioRecordingMediaRecorder(mediaRecorder);
  };

  const getUploadedAudioRecordingFile = (fileUrl: string) => {
    setAudioRecordingFileUploaded(fileUrl);
  };

  const isAudioRecordingPaused = (isPaused: boolean) => {
    if (isPaused) {
      setAudioRecordingPaused(true);
      setAudioRecordingStarted(false);
    } else {
      setAudioRecordingPaused(false);
    }
  };

  const resumeVoiceRecording = () => {
    setAudioRecordingResumed(true);
    setAudioRecordingFileUploaded(null);
    setAudioRecordingPaused(false);
  };

  const audioRecordingCanceledUpdate = (isCanceled: boolean) => {
    if (isCanceled) {
      setAudioRecordingCanceled(true);
      setAudioRecordingFileUploaded(null);
      setAudioRecordingPaused(false);
      setAudioRecordingStarted(false);
      setAudioRecordingResumed(false);
    } else {
      setAudioRecordingCanceled(false);
    }
  };

  const resetAudioRecordingStatus = () => {
    if (audioRecordingMediaRecorder) {
      audioRecordingMediaRecorder.stop();
      audioRecordingMediaRecorder.stream.getTracks()[0].stop();
    }

    setAudioRecordingCanceled(true);
    setAudioRecordingStarted(false);
    setAudioRecordingPaused(false);
    setAudioRecordingFileUploaded(null);
    setAudioRecordingPreviewLoading(false);
    setAudioRecordingResumed(false);
    setAudioRecordingSent(false);
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
      <form className={`${styles.inputForm} ${audioRecordingFileUploaded ? styles.centerSendButton : ''}`}>
        <div className={styles.messageWrap}>
          <div className={styles.inputWrap}>
            {audioRecordingCanceled && (
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
                  disabled={!channelConnected || errorPopUp ? true : false}
                />
              </div>
            )}

            {!audioRecordingCanceled && (
              <AudioRecording
                fetchMediaRecorder={fetchMediaRecorder}
                isAudioRecordingPaused={isAudioRecordingPaused}
                setAudioRecordingPreviewLoading={setAudioRecordingPreviewLoading}
                getUploadedAudioRecordingFile={getUploadedAudioRecordingFile}
                audioRecordingResumed={audioRecordingResumed}
                setAudioRecordingResumed={setAudioRecordingResumed}
                audioRecordingSent={audioRecordingSent}
                audioRecordingCanceledUpdate={audioRecordingCanceledUpdate}
                setErrorPopUp={setErrorPopUp}
              />
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
              isFileLoaded={isFileLoaded}
              canSendMedia={canSendMedia}
              errorPopUp={errorPopUp}
              closeFileErrorPopUp={closeFileErrorPopUp}
              loadingSelector={loadingSelector}
              audioRecordingStarted={audioRecordingStarted}
              startAudioRecording={startAudioRecording}
              audioRecordingPaused={audioRecordingPaused}
              audioRecordingPreviewLoading={audioRecordingPreviewLoading}
              resumeVoiceRecording={resumeVoiceRecording}
              audioRecordingResumed={audioRecordingResumed}
              isAudioRecordingPaused={isAudioRecordingPaused}
              audioRecordingCanceled={audioRecordingCanceled}
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
            data-cy={cyMessageSendButton}>
            <div className={styles.sendButtonText}>
              <PaperPlane />
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

export default connector(MessageInput);
