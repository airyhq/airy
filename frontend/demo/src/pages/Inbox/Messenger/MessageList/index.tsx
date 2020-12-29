import React from 'react';
import {Route, withRouter, Redirect, RouteComponentProps} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';
import {Conversation} from '../../../../model/Conversation';
// import {getCurrentConversation} from '../../../../selectors/conversations';

import {StateModel} from '../../../../reducers';

import styles from './index.module.scss';
import conversations, { AllConversationsState } from '../../../../reducers/data/conversations';
import MessageListItem from '../MessengerListItem';
import { Message } from '../../../../model/Message';
import {fetchMessages} from '../../../../actions/messages';


type MessageListProps = {
    conversation: Conversation;
} & ConnectedProps<typeof connector> & RouteComponentProps<{conversationId: string}>

const mapStateToProps = (state: StateModel, ownProps: any) => {
    return {
        conversations: state.data.conversations.all,
        messages: state.data.conversations.all.items
    }
}

const mapDispatchToProps = {
    fetchMessages
}

const connector = connect(mapStateToProps, mapDispatchToProps);


const MessageList = (props: MessageListProps) => {
    const {conversations, conversation, fetchMessages, messages} = props;


    return (
        <div className={styles.messageList}>
            {/* <MessageListItem message={}/> */}
        </div>
    )
};


export default connector(MessageList);