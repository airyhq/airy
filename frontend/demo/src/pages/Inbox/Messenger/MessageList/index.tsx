import React from 'react';
import {Route, withRouter, Redirect, RouteComponentProps, useParams} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';
import {Conversation, conversationMapper} from '../../../../model/Conversation';
// import {getCurrentConversation} from '../../../../selectors/conversations';

import {StateModel} from '../../../../reducers';

import styles from './index.module.scss';
import MessageListItem from '../MessengerListItem';
import { Message } from '../../../../model/Message';
import { fetchMessages } from '../../../../actions/messages';
import { allConversationSelector } from '../../../../selectors/conversations';
import conversations from '../../../../reducers/data/conversations';


type MessageListProps = {
    conversation: Conversation;
    message: Message;
} & ConnectedProps<typeof connector> & RouteComponentProps<{conversationId: string}>

const mapStateToProps = (state: StateModel, ownProps: any) => {
    return {
        conversations: allConversationSelector(state),
    }
}

const mapDispatchToProps = {
    fetchMessages
}

const connector = connect(mapStateToProps, mapDispatchToProps);

const MessageList = (props: MessageListProps) => {
    const {conversations, fetchMessages, message} = props;
    const conversationIdParams = useParams();
    const currentConversationId = conversationIdParams[Object.keys(conversationIdParams)[0]];
    let messageArray = [];

    const getMessages = (conversationId: string): Message[] => {
        if (conversations !== undefined) 
            {conversations.map((conversation: Conversation) => {
                if (conversationId === conversation.id) {
                    fetchMessages(currentConversationId);
                    messageArray.push(conversation.lastMessage);
                    console.log(messageArray);
                    return message;
                } 
            })
        }
        return messageArray
    }

    getMessages(currentConversationId)

    // const fetchCurrentMessages = (currentId: string) => {
    //     fetchMessages(currentId)
    //     return (
    //         <MessageListItem message={getMessages(currentConversationId)[0]}/>
    //     )
    // };


    return (
        <div className={styles.messageList}>
            {messageArray.map((message: Message) => {
                return (
                <MessageListItem 
                key={message.id}
                message={message.content[0].text}
                messageAlignment={message.alignment}
                />
                )
            })}
        </div>
    )
};


export default connector(MessageList);