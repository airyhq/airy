import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';

import {User} from 'model';
import {listConversations} from '../../actions/conversations';
import {listChannels} from '../../actions/channel';
import {StateModel} from '../../reducers';

import Messenger from './Messenger';
import {setPageTitle} from '../../services/pageTitle';

import {allConversations} from '../../selectors/conversations';

export type ConversationRouteProps = RouteComponentProps<{conversationId: string}>;

interface InboxProps {
  user: User;
}

const mapStateToProps = (state: StateModel) => {
  return {
    user: state.data.user,
    conversations: allConversations(state),
  };
};

const mapDispatchToProps = {
  listConversations,
  listChannels,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationContainer = (props: InboxProps & ConnectedProps<typeof connector>) => {
  const {conversations, listChannels, listConversations} = props;

  useEffect(() => {
    listConversations();
    listChannels();
  }, []);

  useEffect(() => {
    setPageTitle(`Inbox (${conversations.length})`);
  }, [conversations]);

  return <Messenger />;
};

export default connector(ConversationContainer);
