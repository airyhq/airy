import React from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../../reducers';
import MessageList from '../MessageList';
import {ReactComponent as EmptyStateImage} from '../../../../assets/images/empty-state/inbox-empty-state.svg';
import styles from './index.module.scss';

const mapStateToProps = (state: StateModel) => {
  return {
    conversations: state.data.conversations.all.items,
  };
};

const connector = connect(mapStateToProps, null);

type MessengerContainerProps = {match: any} & ConnectedProps<typeof connector>;

const MessengerContainer = (props: MessengerContainerProps) => {
  const {conversations, match} = props;

  return (
    <div className={styles.messengerContainer}>
      {!conversations ? (
        <div className={styles.emptyState}>
          <h1>Your conversations will appear here as soon as a contact messages you.</h1>
          <p>Airy Messenger only shows new conversations from the moment you connect at least one channel.</p>
          <EmptyStateImage />
        </div>
      ) : (
        <MessageList conversationId={match.params.conversationId} />
      )}
    </div>
  );
};

export default connector(MessengerContainer);
