import React, {Component, Fragment} from 'react';
import {Route, withRouter, Redirect, RouteComponentProps} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import ConversationList from '../ConversationList';

import './index.scss';
import {StateModel} from '../../../reducers';
import {AllConversationsState} from '../../../reducers/data/conversations';

const mapStateToProps = (state: StateModel) => {
  return {
    loading: state.data.conversations.all.metadata.loading,
    conversations: state.data.conversations.all,
  };
};

const connector = connect(mapStateToProps);

class Messenger extends Component<ConnectedProps<typeof connector> & RouteComponentProps, null> {
  waitForContentAndRedirect(conversations: AllConversationsState) {
    const conversationId = conversations[0].id;
    const targetPath = `/inbox/conversations/${conversationId}`;
    if (targetPath !== window.location.pathname) {
      return <Redirect to={targetPath} />;
    }
  }

  render() {
    const {conversations, loading, match} = this.props;
    if (match.isExact && conversations.items.length) {
      return this.waitForContentAndRedirect(conversations);
    }

    console.log(!!conversations.items);

    return (
      <section className="Messenger-Container">
        {!!conversations.items && (
          <section className="Messenger-ContainerMiddlePanel">
            <ConversationList />
          </section>
        )}

        <Route
          path={[`${match.url}/conversations/:conversationId`, `${match.url}`]}
          render={props => <Fragment></Fragment>}
        />
      </section>
    );
  }
}

export default withRouter(connector(Messenger));
