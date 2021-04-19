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
    userData: state.data.user,
  };
};

const ConversationHeader = ({conversation, userData}) => {
  const contact = conversation.metadata.contact;
  const channel = conversation.channel;
  const isNotAiry = contact && userData.id !== contact.id;
  const connectorName = channel && channel.metadata.name;

  if (!conversation) {
    return null;
  }

  const containerContact = contact ? (
    <div className={styles.contactInfo}>
      <Avatar contact={contact} />
      <span className={styles.contactName}>
        {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.last_name}` : `${contact.displayName}`}
      </span>
      {connectorName && (
        <div className={styles.separator}>{channel && <IconChannel channel={channel} showAvatar showName />}</div>
      )}
    </div>
  ) : null;

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.details}>{isNotAiry && <div className={styles.info}>{containerContact}</div>}</div>
        <div className={styles.status}>
          <ConversationStatus />
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(ConversationHeader));
