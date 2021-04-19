import React, {useEffect, useState, useRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import styles from './index.module.scss';
import {getCurrentConversation} from '../../../../selectors/conversations';

const mapStateToProps = (state, ownProps) => {
  return {
    conversation: getCurrentConversation(state, ownProps),
  };
};

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
  const [conversationState, setConversationState] = useState('open');
  const prevConversationId = usePrevious(conversation && conversation.id);

  useEffect(() => {
    if (conversation.id !== prevConversationId) setConversationState('open');
  }, [conversation]);

  useEffect(() => {
    changeConversationState(conversationState, conversation.id);
  }, [conversationState]);

  const changeConversationState = (newState, conversationId) => {
    //dispatch action here
    console.log('TOGGLING CONVERSATION STATE', newState, conversationId);
  };

  return (
    <div className={`${styles.conversationStatus} ${styles[conversationState]}`}>
      <div className={styles.openButtonWrapper}>
        <div className={styles.openButton} onClick={() => setConversationState('open')}>
          Open
        </div>
      </div>
      <div className={styles.closedButtonWrapper}>
        <div className={styles.closedButton} onClick={() => setConversationState('closed')}>
          Closed
        </div>
      </div>
    </div>
  );
}

export default withRouter(connector(ConversationStatus));
