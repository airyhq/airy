import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import ConversationList from '../ConversationList';

import {StateModel} from '../../../reducers';

import styles from './index.module.scss';
import MessengerContainer from './MessengerContainer';
import {allConversations} from '../../../selectors/conversations';
import {usePrevious} from '../../../services/hooks/usePrevious';

const mapStateToProps = (state: StateModel) => ({
  loading: state.data.conversations.all.paginationData.loading,
  conversations: allConversations(state),
});

const connector = connect(mapStateToProps);

const Messenger = (props: ConnectedProps<typeof connector>) => {
  const {conversations} = props;
  const {conversationId} = useParams();
  const prevConversations = usePrevious(conversations);
  const navigate = useNavigate();

  useEffect(() => {
    if (conversations?.length > 0 && (!prevConversations || prevConversations?.length === 0) && !conversationId) {
      const conversationId = conversations[0].id;
      const targetPath = `/inbox/conversations/${conversationId}`;
      navigate(targetPath);
    }
  }, [conversations, prevConversations]);

  return (
    <section className={styles.wrapper}>
      {!!conversations && (
        <section className={styles.leftPanel}>
          <ConversationList />
        </section>
      )}

      <MessengerContainer {...props} />
    </section>
  );
};

export default connector(Messenger);
