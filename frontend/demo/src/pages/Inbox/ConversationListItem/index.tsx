import React, {CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import IconChannel from '../../../components/IconChannel';

import {formatTimeOfMessage} from '../../../services/format/date';

import {Conversation} from '../../../model/Conversation';
import {Message} from '../../../model/Message';
import {StateModel} from '../../../reducers';
import {MESSENGER_CONVERSATIONS_ROUTE} from '../../../routes/routes';

import styles from './index.module.scss';

interface FormattedMessageProps {
  message: Message;
}

const FormattedMessage = ({message}: FormattedMessageProps) => {
  if (message && message.content) {
    return <>{message.content.text}</>;
  }
  return <div />;
};

type ConversationListItemProps = {
  conversation: Conversation;
  active: boolean;
  style: CSSProperties;
} & ConnectedProps<typeof connector>;

const ConversationListItem = (props: ConversationListItemProps) => {
  
  const {conversation, active, style} = props;

  const participant = {
    avatar_url: 'https://lh3.googleusercontent.com/fRQ5i4a5A0ETKJU9acF2zV5REvGD0DXltaRO5uduFnnAeYYzX_Xr0XlWi8tTJq2DGdQ',
    first_name: 'Random',
    last_name: 'User',
    display_name: 'Random User',
    info: {},
  };

  const unread = conversation.unreadMessageCount > 0;

  console.log(conversation);

  return (
    <div className={styles.clickableListItem} style={style}>
      <Link to={`${MESSENGER_CONVERSATIONS_ROUTE}/${conversation.id}`}>
        <div
          className={`${active ? styles.containerListItemActive : styles.containerListItem} ${
            unread ? styles.unread : ''
          }`}>
          <div
            className={styles.profileImage}
            style={{backgroundImage: `url(${participant && participant.avatar_url})`}}
          />
          <div className={styles.contactDetails}>
            <div className={styles.topRow}>
              <div className={`${styles.profileName} ${unread ? styles.unread : ''}`}>
                {participant && participant.display_name}
              </div>
            </div>
            <div className={`${styles.contactLastMessage} ${unread ? styles.unread : ''}`}>
              <FormattedMessage message={conversation.lastMessage} />
            </div>
            <div className={styles.bottomRow}>
              <div className={styles.source}>
                <IconChannel channel={conversation.channel} avatar={true} name={true} />
              </div>
              <div className={styles.contactLastMessageDate}>{formatTimeOfMessage(conversation.lastMessage)}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );  
}

const mapStateToProps = (state: StateModel) => {
  return {
    channels: state.data.channels,
  };
};

const connector = connect(mapStateToProps, null);

export default connector(ConversationListItem);
