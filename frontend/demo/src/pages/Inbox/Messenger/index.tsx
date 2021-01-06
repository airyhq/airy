import React, {Fragment} from 'react';
import {Route, withRouter, Redirect, RouteComponentProps} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import ConversationList from '../ConversationList';

import {StateModel} from '../../../reducers';
import {AllConversationsState} from '../../../reducers/data/conversations';

import './index.scss';
import MessengerContainer from './MessengerContainer';

const mapStateToProps = (state: StateModel) => {
  return {
    loading: state.data.conversations.all.metadata.loading,
    conversations: state.data.conversations.all,
  };
};

const connector = connect(mapStateToProps);

const Messenger = (props: ConnectedProps<typeof connector> & RouteComponentProps) => {
  const {conversations, match} = props;

  const waitForContentAndRedirect = (conversations: AllConversationsState) => {
    const conversationId = conversations[0].id;
    const targetPath = `/inbox/conversations/${conversationId}`;
    if (targetPath !== window.location.pathname) {
      return <Redirect to={targetPath} />;
    }
  };

  if (match.isExact && conversations.items.length) {
    return waitForContentAndRedirect(conversations);
  }

  return (
    <section className="messengerContainer">
      {!!conversations.items && (
        <section className="messengerContainerMiddlePanel">
          <ConversationList />
        </section>
      )}

      <Route
        path={[`${match.url}/conversations/:conversationId`, `${match.url}`]}
        render={props => (
          <Fragment>
            <MessengerContainer {...props} />
          </Fragment>
        )}
      />
    </section>
  );
};

export default withRouter(connector(Messenger));
