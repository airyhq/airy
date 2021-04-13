import React, {useEffect, useState, createRef, useRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';
import {debounce, isEmpty} from 'lodash-es';
import {withRouter} from 'react-router-dom';
import {cyMessageList} from 'handles';

import {Message, Suggestions, getSource, isFromContact} from 'model';
import {SourceMessage} from 'render';
import {ReactComponent as LightBulbIcon} from 'assets/images/icons/lightbulb.svg';

import {StateModel} from '../../../../reducers';

import {listMessages, listPreviousMessages} from '../../../../actions/messages';

import styles from './index.module.scss';
import {formatDateOfMessage} from '../../../../services/format/date';
import {getCurrentConversation, getCurrentMessages} from '../../../../selectors/conversations';
import {ConversationRouteProps} from '../../index';
import {MessageInfoWrapper} from 'render/components/MessageInfoWrapper';
import {formatTime, isSameDay} from 'dates';

type MessageListProps = ConnectedProps<typeof connector> & {
  showSuggestedReplies: (suggestions: Suggestions) => void;
};

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => {
  return {
    messages: getCurrentMessages(state, ownProps),
    conversation: getCurrentConversation(state, ownProps),
  };
};

const mapDispatchToProps = {
  listMessages,
  listPreviousMessages,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

function usePrevious(value: Message[] | string) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MessageList = (props: MessageListProps) => {
  const {listMessages, listPreviousMessages, showSuggestedReplies, messages, conversation} = props;
  const [stickBottom, setStickBottom] = useState(true);

  const prevMessages = usePrevious(messages);
  const prevCurrentConversationId = usePrevious(conversation && conversation.id);

  const messageListRef = createRef<HTMLDivElement>();

  useEffect(() => {  
    if (!messages || messages.length === 0) {
      conversation && listMessages(conversation.id);
      scrollBottom();
    }
  }, [conversation && conversation.id, messages]);

  useEffect(() => {
    if (stickBottom) {
      scrollBottom();
    }
  }, [stickBottom]);

  useEffect(() => {
    if (hasPreviousMessages() && !scrollbarVisible() && !isLoadingConversation()) {
      debouncedListPreviousMessages(conversation.id);
    }
  }, [conversation]);

  useEffect(() => {
    if (prevMessages && messages && prevMessages.length < messages.length) {
      if (
        conversation &&
        conversation.id &&
        prevCurrentConversationId &&
        prevCurrentConversationId === conversation.id &&
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
  }, [messages, conversation && conversation.id]);

  const scrollBottom = () => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  };

  const hasDateChanged = (prevMessage: Message, message: Message) => {
    if (prevMessage == null) {
      return true;
    }

    return !isSameDay(prevMessage.sentAt, message.sentAt);
  };

  const isLoadingConversation = () => {
    return conversation && conversation.paginationData && conversation.paginationData.loading;
  };

  const hasPreviousMessages = () => {
    return !!(conversation && conversation.paginationData && conversation.paginationData.nextCursor);
  };

  const scrollbarVisible = () => {
    return messageListRef.current.scrollHeight > messageListRef.current.clientHeight;
  };

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
        debouncedListPreviousMessages(conversation.id);
      }

      const entireHeightScrolled =
        messageListRef &&
        messageListRef.current &&
        messageListRef.current.scrollHeight - 1 <=
          messageListRef.current.clientHeight + messageListRef.current.scrollTop;

      if (stickBottom !== entireHeightScrolled) {
        setStickBottom(entireHeightScrolled);
      }
    },
    100,
    {leading: true}
  );

  const hasSuggestions = (message: Message) => !isEmpty(message.metadata?.suggestions);

  const showSuggestions = (message: Message) => {
    showSuggestedReplies(message.metadata.suggestions);
  };

  return (
    <div className={styles.messageList} ref={messageListRef} onScroll={handleScroll} data-cy={cyMessageList}>
      {messages &&
        messages.map((message: Message, index: number) => {
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];

          const lastInGroup = nextMessage ? isFromContact(message) !== isFromContact(nextMessage) : true;

          const sentAt = lastInGroup ? formatTime(message.sentAt) : null;

          const messageDecoration = hasSuggestions(message) ? (
            <button type="button" className={styles.suggestionWrapper} onClick={() => showSuggestions(message)}>
              <LightBulbIcon className={styles.suggestionIcon} title="Show suggestions" />
            </button>
          ) : null;

          return (
            <div key={message.id} id={`message-item-${message.id}`}>
              {hasDateChanged(prevMessage, message) && (
                <div key={`date-${message.id}`} className={styles.dateHeader}>
                  {formatDateOfMessage(message)}
                </div>
              )}
              <MessageInfoWrapper
                fromContact={isFromContact(message)}
                contact={conversation.metadata.contact}
                sentAt={sentAt}
                lastInGroup={lastInGroup}
                isChatPlugin={false}
                decoration={messageDecoration}>
                <SourceMessage source={getSource(conversation)} content={message} contentType="message" />
              </MessageInfoWrapper>
            </div>
          );
        })}
    </div>
  );
};

export default withRouter(connector(MessageList));
