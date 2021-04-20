import React, {useEffect, useState, useRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import styles from './index.module.scss';
import {getCurrentConversation} from '../../../../selectors/conversations';
//import {conversationState} from '../../../../actions/conversations';

const mapStateToProps = (state, ownProps) => {
  return {
    conversation: getCurrentConversation(state, ownProps),
  };
};

// const mapDispatchToProps = {
//   conversationState,
// };

const connector = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof connector> & RouteComponentProps<{id: string}>;

function usePrevious(value: string) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function ConversationStatus(props: Props) {
  const {conversation} = props;
  const currentConversationState = conversation.metadata.state || 'OPEN';
  const [conversationState, setConversationState] = useState(currentConversationState);
  const prevConversationId = usePrevious(conversation && conversation.id);

  useEffect(() => {
    if (conversation.id !== prevConversationId) setConversationState(currentConversationState);
  }, [conversation]);

  //onClick={() => conversationState(conversation.id, 'CLOSED')

  return (
    <div className={`${styles.conversationStatus} ${conversationState === 'CLOSED' ? styles.closed : styles.open}`}>
      <div className={styles.closedButtonWrapper}>
        <div className={styles.closedButton} onClick={() => setConversationState('CLOSED')}>
          Closed
        </div>
      </div>
      <div className={styles.openButtonWrapper}>
        <div className={styles.openButton} onClick={() => setConversationState('OPEN')}>
          Open
        </div>
      </div>
    </div>
  );
}

export default withRouter(connector(ConversationStatus));
