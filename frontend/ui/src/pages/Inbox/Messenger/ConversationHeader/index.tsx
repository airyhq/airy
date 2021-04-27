import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Avatar} from 'render';

import ConversationStatus from '../ConversationStatus';

import styles from './index.module.scss';
import {getCurrentConversation} from '../../../../selectors/conversations';
import IconChannel from '../../../../components/IconChannel';

const mapStateToProps = (state, ownProps) => {
  return {
    conversation: getCurrentConversation(state, ownProps),
  };
};

const ConversationHeader = ({conversation}) => {
  const participant = conversation.metadata.contact;
  const channel = conversation.channel;
  const connectorName = channel && channel.metadata.name;

  if (!conversation) {
    return null;
  }

  const participantInfo = participant ? (
    <div className={styles.participantInfo}>
      <Avatar contact={participant} />
      <span className={styles.participantName}>{participant && participant.displayName}</span>
      {connectorName && (
        <div className={styles.separator}>{channel && <IconChannel channel={channel} showAvatar showName />}</div>
      )}
    </div>
  ) : null;

  return (
    <div className={styles.conversationHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.details}>
          <div className={styles.info}>{participantInfo}</div>
        </div>
        <div className={styles.status}>
          <ConversationStatus />
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(ConversationHeader));
