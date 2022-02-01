import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

import {fetchConversations} from '../../actions/conversations';
import {listChannels} from '../../actions/channel';
import {StateModel} from '../../reducers';

import Messenger from './Messenger';
import {setPageTitle} from '../../services/pageTitle';
import {formatConversationCount} from '../../services/format/numbers';

const mapStateToProps = (state: StateModel) => ({
  totalConversations: state.data.conversations.all.paginationData.total || 0,
  filteredPaginationData: state.data.conversations.filtered.paginationData,
});

const mapDispatchToProps = {
  listConversations: fetchConversations,
  listChannels,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationContainer = (props: ConnectedProps<typeof connector>) => {
  const {totalConversations, filteredPaginationData, listChannels, listConversations} = props;

  useEffect(() => {
    listConversations();
    listChannels();
  }, []);

  useEffect(() => {
    setPageTitle(
      `Inbox (${
        filteredPaginationData.total === null
          ? formatConversationCount(totalConversations)
          : formatConversationCount(filteredPaginationData.total)
      })`
    );
  }, [totalConversations, filteredPaginationData.total]);

  return <Messenger />;
};

export default connector(ConversationContainer);
