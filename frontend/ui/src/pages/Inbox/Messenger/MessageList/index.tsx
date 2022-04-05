import React, {useEffect, createRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {debounce, isEmpty} from 'lodash-es';
import {cyMessageList} from 'handles';
import {Message, Suggestions} from 'model';
import {SourceMessage} from 'render';
import {ReactComponent as LightBulbIcon} from 'assets/images/icons/lightbulb.svg';
import {listMessages, listPreviousMessages, resendMessage} from '../../../../actions/messages';
import styles from './index.module.scss';
import {formatDateOfMessage} from '../../../../services/format/date';
import {useCurrentConversation, useCurrentMessages} from '../../../../selectors/conversations';
import {Reaction, MessageInfoWrapper} from 'components';
import {formatTime, isSameDay} from 'dates';
import {usePrevious} from '../../../../services/hooks/usePrevious';
import {MessageInfo} from './MessageInfo';
import {Avatar} from 'components';

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
    scrollBottom();
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

  const handleFailedMessage = (resend: boolean, messageId: string) => {
    resend && resendMessage({messageId});
  };

  return (
    <div className={styles.messageList} ref={messageListRef} onScroll={handleScroll} data-cy={cyMessageList}>
      {messages?.map((message: Message, index: number) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];

        const lastInGroup = nextMessage ? message.fromContact !== nextMessage.fromContact : true;

        const sentAt = lastInGroup ? formatTime(message.sentAt) : null;

        const messageDecoration = hasSuggestions(message) ? (
          <button type="button" className={styles.suggestionWrapper} onClick={() => showSuggestions(message)}>
            <LightBulbIcon className={styles.suggestionIcon} title="Show suggestions" />
          </button>
        ) : null;

        const isChatPlugin = false;

        const isContact = isChatPlugin ? !message.fromContact : message.fromContact;

        return (
          <>
            <div
              key={message.id}
              id={`message-item-${message.id}`}
              style={{
                display: isContact && sentAt ? 'flex' : '',
                marginLeft: lastInGroup === false && isChatPlugin === false ? '48px' : '',
              }}
            >
              {hasDateChanged(prevMessage, message) && (
                <div key={`date-${message.id}`} className={styles.dateHeader}>
                  {formatDateOfMessage(message)}
                </div>
              )}
              {isContact && sentAt && lastInGroup && (
                <div className={styles.avatar}>
                  <Avatar contact={contact} />
                </div>
              )}
              <MessageInfoWrapper
                fromContact={message.fromContact}
                contact={contact}
                isChatPlugin={false}
                decoration={messageDecoration}
              >
                <SourceMessage source={source} message={message} contentType="message" />
                <Reaction message={message} />
              </MessageInfoWrapper>
            </div>
            <MessageInfo
              isContact={isContact}
              sentAt={sentAt}
              deliveryState={message?.deliveryState}
              messageId={message.id}
              senderName={message?.sender?.name}
            />
          </>
        );
      })}
    </div>
  );
};

export default connector(MessageList);
