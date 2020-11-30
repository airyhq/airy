import React, {Component, Fragment} from 'react';
import {Route, withRouter, Redirect, RouteComponentProps} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import ConversationList from './ConversationList';

import './Messenger.scss';
import { StateModel } from '../../reducers';
import { AllConversationsState } from '../../reducers/data/conversations';

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
    const targetPath = `/messenger/conversations/${conversationId}`;
    if (targetPath !== window.location.pathname) {
      return <Redirect to={targetPath} />;
    }
  }

  render() {
    const {conversations, loading, match} = this.props;
    if (match.isExact && conversations.items.length) {
      return this.waitForContentAndRedirect(conversations);
    }

    return (
      <section className="Messenger-Container">
        {!!conversations.items.length && (
          <section className="Messenger-ContainerMiddlePanel">
            <ConversationList />
          </section>
        )}

        <Route
          path={[`${match.url}/conversations/:conversationId`, `${match.url}`]}
          render={props => (
            <Fragment>
              {/* <ConversationContainer conversations={!!conversations.length} loading={loading} {...props} /> */}
              {/* {!!conversations.length && <ContactDetails {...props} />} */}
            </Fragment>
          )}
        />
      </section>
    );
  }
}

export default withRouter(connector(Messenger));
