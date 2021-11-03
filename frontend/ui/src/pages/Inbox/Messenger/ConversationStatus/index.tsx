import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import styles from './index.module.scss';
import {conversationState} from '../../../../actions/conversations';
import {StateModel} from '../../../../reducers';
import {cyConversationStatus} from 'handles';

const mapStateToProps = (state: StateModel, ownProps) => {
  return {
    currentConversationState:
      state.data.conversations.all.items[ownProps.match.params.conversationId]?.metadata?.state || 'OPEN',
  };
};

const mapDispatchToProps = {
  conversationState,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<{conversationId: string}>;

function ConversationStatus(props: Props) {
  const {currentConversationState, conversationState} = props;

  const [buttonStateEnabled, setButtonStateEnabled] = useState(true);

  const toggleState = (id: string, state: string) => {
    if (buttonStateEnabled) {
      setButtonStateEnabled(false);
      conversationState(id, state);
      setTimeout(() => {
        setButtonStateEnabled(true);
      }, 2000);
    }
  };

  return (
    <div
      className={`${styles.conversationStatus} ${currentConversationState === 'CLOSED' ? styles.closed : styles.open}`}
      data-cy={cyConversationStatus}
    >
      <div className={styles.closedButtonWrapper}>
        <div className={styles.closedButton} onClick={() => toggleState(props.match.params.conversationId, 'CLOSED')}>
          Closed
        </div>
      </div>
      <div className={styles.openButtonWrapper}>
        <div className={styles.openButton} onClick={() => toggleState(props.match.params.conversationId, 'OPEN')}>
          Open
        </div>
      </div>
    </div>
  );
}

export default withRouter(connector(ConversationStatus));
