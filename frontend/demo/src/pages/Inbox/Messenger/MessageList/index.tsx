import React, {useEffect, useState, createRef, useRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';
import {debounce} from 'lodash-es';

import {Message, SenderType, Conversation} from 'httpclient';
import RenderLibrary from 'render';

import {StateModel} from '../../../../reducers';

import {listMessages, listPreviousMessages} from '../../../../actions/messages';

import styles from './index.module.scss';
import {formatDateOfMessage} from '../../../../services/format/date';

type MessageListProps = {conversation: Conversation} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel, ownProps: {conversation: Conversation}) => {
  return {
    messages: state.data.messages.all[ownProps.conversation && ownProps.conversation.id],
    item: state.data.conversations.all.items[ownProps.conversation && ownProps.conversation.id],
  };
};

const mapDispatchToProps = {
  listMessages,
  listPreviousMessages,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

function usePrevious(value: [] | string) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MessageList = (props: MessageListProps) => {
  const {listMessages, listPreviousMessages, messages, item, conversation} = props;
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
  }, [item]);

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

  const isContact = (message: Message) => message.senderType !== SenderType.appUser;

  const hasDateChanged = (prevMessage: Message, message: Message) => {
    if (prevMessage == null) {
      return true;
    }

    return !isSameDay(prevMessage.sentAt, message.sentAt);
  };

  const isSameDay = (firstDate: Date, secondDate: Date) => {
    return new Date(firstDate).setHours(0, 0, 0, 0) === new Date(secondDate).setHours(0, 0, 0, 0);
  };

  const isLoadingConversation = () => {
    return item && item.metadata && item.metadata.loading;
  };

  const hasPreviousMessages = () => {
    return !!(item && item.metadata && item.metadata.next_cursor);
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
      if (messageListRef) {
        if (hasPreviousMessages() && messageListRef.current.scrollTop === 0 && !isLoadingConversation()) {
          debouncedListPreviousMessages(conversation.id);
        }

        const entireHeightScrolled =
          messageListRef.current.scrollHeight - 1 <=
          messageListRef.current.clientHeight + messageListRef.current.scrollTop;

        if (stickBottom !== entireHeightScrolled) {
          setStickBottom(entireHeightScrolled);
        }
      }
    },
    100,
    {leading: true}
  );

  return (
    <div className={styles.messageList} ref={messageListRef} onScroll={handleScroll}>
      {messages &&
        messages.map((message: Message, index: number) => {
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];
          const prevWasContact = prevMessage ? isContact(prevMessage) : false;
          const nextIsSameUser = nextMessage ? isContact(message) == isContact(nextMessage) : false;

          console.log(item.channel.source);

          return (
            <div key={message.id}>
              {hasDateChanged(prevMessage, message) && (
                <div key={`date-${message.id}`} className={styles.dateHeader}>
                  {formatDateOfMessage(message)}
                </div>
              )}
              <RenderLibrary
                message={message}
                source={item.channel.source}
                currentConversation={item}
                prevWasContact={prevWasContact}
                nextIsSameUser={nextIsSameUser}
                isContact={isContact(message)}
              />
            </div>
          );
        })}
    </div>
  );
};

export default connector(MessageList);
