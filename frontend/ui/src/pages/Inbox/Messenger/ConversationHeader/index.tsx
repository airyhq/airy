import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Avatar} from 'components';

import ConversationStatus from '../ConversationStatus';

import styles from './index.module.scss';
import {getConversation} from '../../../../selectors/conversations';
import IconChannel from '../../../../components/IconChannel';

const mapStateToProps = (state, ownProps) => {
  return {
    conversation: getConversation(state, ownProps),
  };
};

const ConversationHeader = ({conversation}) => {
  const participant = conversation.metadata.contact;
  const channel = conversation.channel;

  if (!conversation) {
    return null;
  }

  const participantInfo = participant ? (
    <div className={styles.participantInfo}>
      <Avatar contact={participant} />
      <span className={styles.participantName}>{participant && participant.displayName}</span>
      <div className={styles.separator}>{channel && <IconChannel channel={channel} showAvatar showName />}</div>
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
