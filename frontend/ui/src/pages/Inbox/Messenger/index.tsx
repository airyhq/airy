import React from 'react';
import {Route, withRouter, Redirect, RouteComponentProps} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import ConversationList from '../ConversationList';

import {MergedConversation, StateModel} from '../../../reducers';

import styles from './index.module.scss';
import MessengerContainer from './MessengerContainer';
import {allConversations} from '../../../selectors/conversations';

const mapStateToProps = (state: StateModel) => {
  return {
    loading: state.data.conversations.all.paginationData.loading,
    conversations: allConversations(state),
  };
};

const connector = connect(mapStateToProps);

const Messenger = (props: ConnectedProps<typeof connector> & RouteComponentProps) => {
  const {conversations, match} = props;

  const waitForContentAndRedirect = (conversations: MergedConversation[]) => {
    const conversationId = conversations[0].id;
    const targetPath = `/inbox/conversations/${conversationId}`;
    if (targetPath !== window.location.pathname) {
      return <Redirect to={targetPath} />;
    }
  };

  if (match.isExact && conversations.length) {
    return waitForContentAndRedirect(conversations);
  }

  return (
    <section className={styles.wrapper}>
      <Route
        path={[`${match.url}/conversations/:conversationId`, `${match.url}`]}
        render={props => (
          <>
            {!!conversations && (
              <section className={styles.leftPanel}>
                <ConversationList />
              </section>
            )}

            <MessengerContainer {...props} />
          </>
        )}
      />
    </section>
  );
};

export default withRouter(connector(Messenger));
