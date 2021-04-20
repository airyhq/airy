import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import styles from './index.module.scss';
import {getCurrentConversation} from '../../../../selectors/conversations';
import {conversationState} from '../../../../actions/conversations';

const mapStateToProps = (state, ownProps) => {
  return {
    conversation: getCurrentConversation(state, ownProps),
  };
};

const mapDispatchToProps = {
  conversationState,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<{id: string}>;

function ConversationStatus(props: Props) {
  const {conversation, conversationState} = props;
  const currentConversationState = conversation.metadata.state || 'OPEN';

  return (
    <div
      className={`${styles.conversationStatus} ${currentConversationState === 'CLOSED' ? styles.closed : styles.open}`}>
      <div className={styles.closedButtonWrapper}>
        <div className={styles.closedButton} onClick={() => conversationState(conversation.id, 'CLOSED')}>
          Closed
        </div>
      </div>
      <div className={styles.openButtonWrapper}>
        <div className={styles.openButton} onClick={() => conversationState(conversation.id, 'OPEN')}>
          Open
        </div>
      </div>
    </div>
  );
}

export default withRouter(connector(ConversationStatus));
