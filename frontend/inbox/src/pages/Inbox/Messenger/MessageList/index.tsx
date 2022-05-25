import React, {useEffect, useState, createRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {debounce, isEmpty} from 'lodash-es';
import {cyMessageList, cySuggestionsButton} from 'handles';
import {Message, Suggestions, Source} from 'model';
import {MessageWrapper} from 'components';
import {listMessages, listPreviousMessages, resendMessage} from '../../../../actions/messages';
import {useCurrentConversation, useCurrentMessages} from '../../../../selectors/conversations';
import {formatDateOfMessage} from '../../../../services';
import {formatTime, isSameDay} from 'dates';
import {usePrevious} from '../../../../services/hooks/usePrevious';
import {ReactComponent as LightBulbIcon} from 'assets/images/icons/lightbulb.svg';
import {SourceMessage} from 'render';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

type MessageListProps = ConnectedProps<typeof connector> & {
  showSuggestedReplies: (suggestions: Suggestions) => void;
};

const mapDispatchToProps = {
  listMessages,
  listPreviousMessages,
  resendMessage,
};

const connector = connect(null, mapDispatchToProps);

const MessageList = (props: MessageListProps) => {
  const {listMessages, listPreviousMessages, showSuggestedReplies, resendMessage} = props;
  const [resentMessage, setResentMessage] = useState<boolean>(false);
  const {t} = useTranslation();

  const conversation = useCurrentConversation();
  const messages = useCurrentMessages();
  if (!conversation) {
    return null;
  }

  const {
    id: conversationId,
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;

  const prevMessages = usePrevious(messages);
  const prevCurrentConversationId = usePrevious(conversationId);

  const messageListRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!messages || messages.length === 0) {
      conversationId && listMessages(conversationId);
    }

    if (resentMessage && conversationId !== prevCurrentConversationId) setResentMessage(false);

    if (!resentMessage) {
      scrollBottom();
    }
  }, [conversationId, messages]);

  useEffect(() => {
    if (hasPreviousMessages() && !scrollbarVisible() && !isLoadingConversation()) {
      debouncedListPreviousMessages(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (prevMessages && messages && prevMessages.length < messages.length) {
      if (
        conversationId &&
        prevCurrentConversationId &&
        prevCurrentConversationId === conversationId &&
        messages &&
        prevMessages &&
        prevMessages[0] &&
        prevMessages[0].id !== messages[0].id
      ) {
        scrollToMessage(prevMessages[0].id);
      } else {
        scrollBottom();
      }
    }
  }, [messages, conversationId]);

  const scrollBottom = () => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  };

  const hasDateChanged = (prevMessage: Message, message: Message) => {
    if (prevMessage == null) {
      return true;
    }

    return !isSameDay(prevMessage.sentAt, message.sentAt);
  };

  const isLoadingConversation = () => paginationData && paginationData.loading;

  const hasPreviousMessages = () => !!(paginationData && paginationData.nextCursor);

  const scrollbarVisible = () => messageListRef.current.scrollHeight > messageListRef.current.clientHeight;

  const scrollToMessage = id => {
    const element = document.querySelector<HTMLElement>(`#message-item-${id}`);

    if (element && messageListRef) {
      messageListRef.current.scrollTop = element.offsetTop - messageListRef.current.offsetTop;
    }
  };

  const debouncedListPreviousMessages = debounce(currentConversationId => {
    listPreviousMessages(currentConversationId);
  }, 200);

  const handleScroll = debounce(
    () => {
      if (!messageListRef) {
        return;
      }

      if (
        hasPreviousMessages() &&
        messageListRef &&
        messageListRef.current &&
        messageListRef.current.scrollTop === 0 &&
        !isLoadingConversation()
      ) {
        debouncedListPreviousMessages(conversationId);
      }
    },
    100,
    {leading: true}
  );

  const hasSuggestions = (message: Message) => !isEmpty(message.metadata?.suggestions);

  const showSuggestions = (message: Message) => {
    showSuggestedReplies(message.metadata.suggestions);
  };

  const handleFailedMessage = (messageId: string) => {
    resendMessage({messageId});
    setResentMessage(true);
  };

  return (
    <div className={styles.messageList} ref={messageListRef} onScroll={handleScroll} data-cy={cyMessageList}>
      {messages?.map((message: Message, index: number) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];

        const lastInGroup = nextMessage ? message.fromContact !== nextMessage.fromContact : true;

        const sentAt = lastInGroup ? formatTime(message.sentAt) : null;

        const messageDecoration = hasSuggestions(message) ? (
          <button
            type="button"
            data-cy={cySuggestionsButton}
            className={styles.suggestionWrapper}
            onClick={() => showSuggestions(message)}
          >
            <LightBulbIcon className={styles.suggestionIcon} title={t('showSuggestions')} />
          </button>
        ) : null;

        return (
          <div key={message.id} id={`message-item-${message.id}`}>
            {hasDateChanged(prevMessage, message) && (
              <div key={`date-${message.id}`} className={styles.dateHeader}>
                {formatDateOfMessage(message)}
              </div>
            )}
            <MessageWrapper
              fromContact={message.fromContact}
              deliveryState={message.deliveryState}
              senderName={message?.sender?.name}
              messageId={message.id}
              lastInGroup={lastInGroup}
              sentAt={sentAt}
              contact={contact}
              handleFailedMessage={handleFailedMessage}
              isChatPlugin={false}
              decoration={messageDecoration}
              messageReaction={message?.metadata?.reaction?.emoji}
            >
              <SourceMessage source={source as Source} message={message} contentType={'message'} />
            </MessageWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default connector(MessageList);
