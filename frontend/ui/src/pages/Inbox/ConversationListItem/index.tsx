import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import IconChannel from '../../../components/IconChannel';
import {SourceMessagePreview} from 'render';
import {Avatar} from 'components';

import {formatTimeOfMessage} from '../../../services/format/date';

import {MergedConversation, StateModel} from '../../../reducers';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import {readConversations, conversationState} from '../../../actions/conversations';
import {setFilter} from '../../../actions/conversationsFilter';

import styles from './index.module.scss';
import {ReactComponent as Checkmark} from 'assets/images/icons/checkmark-circle.svg';
import {newestFilteredConversationFirst} from '../../../selectors/conversations';
import {cyOpenStateButton, cyClosedStateButton, cyConversationListItemInfo, cyClickableListItem} from 'handles';

type ConversationListItemProps = {
  conversation: MergedConversation;
  active: boolean;
} & ConnectedProps<typeof connector>;

type StateButtonsProps = {
  eventHandler(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
};

const mapDispatchToProps = {
  readConversations,
  conversationState,
  setFilter,
};

const mapStateToProps = (state: StateModel) => ({
  filteredConversations: newestFilteredConversationFirst(state),
  currentFilter: state.data.conversations.filtered.currentFilter,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const OpenStateButton = ({eventHandler}: StateButtonsProps) => {
  return (
    <div className={styles.openStateButton} title="Set to closed">
      <button
        onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => eventHandler(event)}
        data-cy={cyOpenStateButton}
      />
    </div>
  );
};

const ClosedStateButton = ({eventHandler}: StateButtonsProps) => {
  return (
    <div className={styles.closedStateButton} title="Set to open">
      <button
        onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => eventHandler(event)}
        data-cy={cyClosedStateButton}
      >
        <Checkmark />
      </button>
    </div>
  );
};

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active, readConversations, conversationState, currentFilter, setFilter} = props;

  const [buttonStateEnabled, setButtonStateEnabled] = useState(true);

  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';

  const eventHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (buttonStateEnabled) {
      setButtonStateEnabled(false);
      const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
      conversationState(conversation.id, newState);

      event.preventDefault();
      event.stopPropagation();

      setTimeout(() => {
        if (Object.entries(currentFilter).length !== 0) {
          setFilter(currentFilter);
        }

        setButtonStateEnabled(true);
      }, 2000);
    }
  };

  const markAsRead = () => {
    if (active && unread) {
      readConversations(conversation.id);
    }
  };

  useEffect(() => {
    markAsRead();
  }, [active, conversation, currentConversationState]);

  return (
    <div className={`${styles.clickableListItem}`} onClick={markAsRead} data-cy={cyClickableListItem}>
      <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversation.id}`}>
        <div
          className={`${active ? styles.containerListItemActive : styles.containerListItem} ${
            unread ? styles.unread : ''
          }`}
        >
          <div className={styles.profileImage}>
            <Avatar contact={participant} />
          </div>
          <div className={styles.contactDetails} data-cy={cyConversationListItemInfo}>
            <div className={styles.topRow}>
              <div className={`${styles.profileName} ${unread ? styles.unread : ''}`}>
                {participant && participant.displayName}
              </div>
              {currentConversationState === 'OPEN' ? (
                <OpenStateButton eventHandler={eventHandler} />
              ) : (
                <ClosedStateButton eventHandler={eventHandler} />
              )}
            </div>
            <div className={`${styles.contactLastMessage} ${unread ? styles.unread : ''}`}>
              <SourceMessagePreview conversation={conversation} />
            </div>
            <div className={styles.bottomRow}>
              <div className={styles.source}>
                {conversation.channel && <IconChannel channel={conversation.channel} showAvatar showName />}
              </div>
              <div className={styles.contactLastMessageDate}>{formatTimeOfMessage(conversation.lastMessage)}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default connector(ConversationListItem);
