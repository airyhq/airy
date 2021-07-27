import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';

import {User} from 'model';
import {fetchConversations} from '../../actions/conversations';
import {listChannels} from '../../actions/channel';
import {StateModel} from '../../reducers';

import Messenger from './Messenger';
import {setPageTitle} from '../../services/pageTitle';

export type ConversationRouteProps = RouteComponentProps<{conversationId: string}>;

interface InboxProps {
  user: User;
}

const mapStateToProps = (state: StateModel) => ({
  user: state.data.user,
  totalConversations: state.data.conversations.all.paginationData.total || 0,
});

const mapDispatchToProps = {
  listConversations: fetchConversations,
  listChannels,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationContainer = (props: InboxProps & ConnectedProps<typeof connector>) => {
  const {totalConversations, listChannels, listConversations} = props;

  useEffect(() => {
    listConversations();
    listChannels();
  }, []);

  useEffect(() => {
    setPageTitle(`Inbox (${totalConversations})`);
  }, [totalConversations]);

  return <Messenger />;
};

export default connector(ConversationContainer);
