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
  dragAndDroppedFile: any;
} & ConnectedProps<typeof connector>;

export interface SelectedTemplate {
  messageType: 'template';
  message: Template;
  source: Source;
}

export interface SelectedSuggestedReply {
  messageType: 'suggestedReplies';
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
    dragAndDroppedFile,
  } = props;

  const contentResizedHeight = 200;

  const outboundMapper = getOutboundMapper(source);
  const fileOutboundMapper = getOutboundMapper('facebook') as FacebookMapper;
  const channelConnected = conversation.channel.connected;

  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  const [selectedSuggestedReply, setSelectedSuggestedReply] = useState<SelectedSuggestedReply | null>(null);
  const [maxFileSizeErrorPopUp, setMaxFileSizeErrorPopUp] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');

  const textAreaRef = useRef(null);
  const sendButtonRef = useRef(null);

  const focusInput = () => textAreaRef?.current?.focus();

  useEffect(() => {
    if (dragAndDroppedFile) {
      uploadFile(dragAndDroppedFile);
    }
  }, [dragAndDroppedFile]);

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

  const uploadFile = (file: any) => {
    const fileSizeInMB = file.size / Math.pow(1024, 2);

    if (fileSizeInMB >= 25) {
      setMaxFileSizeErrorPopUp(true);
      return;
    }

    setMediaUrl('https://airy-media-test.s3.amazonaws.com/test-media/dcd9a978-2ebb-5a44-ae63-c0215f118d13.rtf');

    //image: https://airy-media-test.s3.amazonaws.com/test-media/1fd60daa-3cb8-5c22-b86d-6f33b588d78a.jpeg
    //video: https://airy-media-test.s3.amazonaws.com/test-media/438ad3bf-24fe-5937-885f-fa101ed06cdb.mp4
    //audio: https://airy-media-test.s3.amazonaws.com/test-media/ed60ea33-0f41-5546-bb6f-d4e4256de87c.mp3
    //file: https://airy-media-test.s3.amazonaws.com/test-media/dcd9a978-2ebb-5a44-ae63-c0215f118d13.rtf

    // const formData = new FormData();
    // formData.append('file', file);

    // console.log('formData - uploadFile', formData)

    // return HttpClientInstance.uploadFile({file: formData}).then((response: any) => {
    // setMediaUrl(response.mediaUrl);
    // });
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    return uploadFile(file);
  };

  const canSendMessage = () => {
    return !(
      (!selectedTemplate && !selectedSuggestedReply && !input && !mediaUrl && !dragAndDroppedFile) ||
      !channelConnected
    );
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
          : mediaUrl
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

    console.log('selectTemplate', template);

    if (selectedTemplate) setSelectedTemplate(null);

    if (input) setInput('');

    if (selectedSuggestedReply) setSelectedSuggestedReply(null);

    if (isTextMessage(template)) {
      setInput(jsonTemplate.text);
    } else {
      setSelectedTemplate({messageType: 'template', message: template, source: template.source});
    }

    console.log('selectedTEmplate', selectedTemplate);

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
      setSelectedSuggestedReply({messageType: 'suggestedReplies', message: reply});
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

    if (mediaUrl) {
      setMediaUrl(null);
    }
  };

  const closeFileErrorPopUp = () => {
    setMaxFileSizeErrorPopUp(false);
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
            {!selectedTemplate && !selectedSuggestedReply && !mediaUrl && (
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
                  mediaComponentConfig={props.config.components['media-resolver']}
                  selectFile={selectFile}
                  maxFileSizeErrorPopUp={maxFileSizeErrorPopUp}
                  closeFileErrorPopUp={closeFileErrorPopUp}
                />
              </>
            )}

            {(selectedSuggestedReply || selectedTemplate || mediaUrl) && (
              <>
                <InputSelector
                  message={
                    selectedTemplate?.message ??
                    selectedSuggestedReply?.message ??
                    fileOutboundMapper.getAttachmentPayload(mediaUrl)
                  }
                  source={source}
                  messageType={selectedTemplate?.messageType ?? selectedSuggestedReply?.messageType ?? 'message'}
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
