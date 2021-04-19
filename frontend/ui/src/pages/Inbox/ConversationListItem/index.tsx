import React, {CSSProperties, useEffect} from 'react';
import {Link, withRouter} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import IconChannel from '../../../components/IconChannel';
import {Avatar} from 'render';

import {formatTimeOfMessage} from '../../../services/format/date';

import {Message} from 'model';
import {MergedConversation, StateModel} from '../../../reducers';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import {readConversations, conversationState} from '../../../actions/conversations';

import styles from './index.module.scss';
import {ConversationRouteProps} from '../index';
import {getCurrentConversation} from '../../../selectors/conversations';
import {ReactComponent as Checkmark} from 'assets/images/icons/checkmark-circle.svg';

interface FormattedMessageProps {
  message: Message;
}

type ConversationListItemProps = {
  conversation: MergedConversation;
  active: boolean;
  style: CSSProperties;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  readConversations,
  conversationState,
};

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => {
  return {
    conversationId: getCurrentConversation(state, ownProps).id,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const FormattedMessage = ({message}: FormattedMessageProps) => {
  if (message?.content) {
    return <>{message.content.message?.text || message.content.text}</>;
  }
  return <div />;
};

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active, style, readConversations, conversationId, conversationState} = props;

  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state;  

  const eventHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const newState = currentConversationState === ('' || 'OPEN') ? 'CLOSED' : 'OPEN';
    conversationState(conversationId, newState);
    event.preventDefault();
    event.stopPropagation();
  };

  const OpenStateButton = () => {
    return (
      <div className={styles.openStateButton} title="Set to closed">
        <button onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => eventHandler(event)} />
      </div>
    );
  };

  const ClosedStateButton = () => {
    return (
      <div className={styles.closedStateButton} title="Set to open">
        <button onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => eventHandler(event)}>
          <Checkmark />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (active && unread) {
      return readConversations(conversation.id);
    }
  }, [active, conversation]);

  return (
    <div className={styles.clickableListItem} style={style} onClick={() => readConversations(conversation.id)}>
      <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversation.id}`}>
        <div
          className={`${active ? styles.containerListItemActive : styles.containerListItem} ${
            unread ? styles.unread : ''
          }`}>
          <div className={styles.profileImage}>
            <Avatar contact={participant} />
          </div>
          <div className={styles.contactDetails}>
            <div className={styles.topRow}>
              <div className={`${styles.profileName} ${unread ? styles.unread : ''}`}>
                {participant && participant.displayName}
              </div>
              {currentConversationState === 'OPEN' ? <OpenStateButton /> : <ClosedStateButton />}
            </div>
            <div className={`${styles.contactLastMessage} ${unread ? styles.unread : ''}`}>
              <FormattedMessage message={conversation.lastMessage} />
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

export default withRouter(connector(ConversationListItem));
