import React, {Component} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

import {User} from '../../model/User';
import {fetchConversations} from '../../actions/conversations';
import {StateModel} from '../../reducers';

import Messenger from './Messenger';

interface InboxProps {
  user: User;
}

class MessengerContainer extends Component<InboxProps & ConnectedProps<typeof connector>, null> {
  componentDidMount() {
    this.props.fetchConversations();
  }

  render() {
    return <Messenger />;
  }
}

const mapStateToProps = (state: StateModel) => {
  return {
    user: state.data.user,
  };
};

const mapDispatchToProps = {
  fetchConversations,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(MessengerContainer);
