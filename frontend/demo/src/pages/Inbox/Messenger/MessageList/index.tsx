import React, {useEffect} from 'react';
import {RouteComponentProps, useParams} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import _redux from 'redux';
import {StateModel} from '../../../../reducers';
import styles from './index.module.scss';
import MessageListItem from '../MessengerListItem';
import { Message } from '../../../../model/Message';
import { fetchMessages } from '../../../../actions/messages';
import { allConversationSelector } from '../../../../selectors/conversations';


type MessageListProps = {
} & ConnectedProps<typeof connector> & RouteComponentProps<{conversationId: string}>

const mapStateToProps = (state: StateModel, ownProps: any) => {
    return {
        conversations: allConversationSelector(state),
        messages: state.data.messages.all,
    }
}

const mapDispatchToProps = {
    fetchMessages
}

const connector = connect(mapStateToProps, mapDispatchToProps);



const MessageList = (props: MessageListProps) => {
    const {fetchMessages, messages} = props;
    const conversationIdParams = useParams();
    const currentConversationId = conversationIdParams[Object.keys(conversationIdParams)[0]];

    useEffect(() => {
        currentConversationId && fetchMessages(currentConversationId);
    },[currentConversationId]);    

    return (
        <div className={styles.messageList}>
            {messages.map((message: Message) => {
                return (
                    <MessageListItem 
                    key={message.id}
                    message={message.content[0].text}
                    messageSenderType={message.senderType}
                    messageDate={message.sentAt}
                />
                )
            })}
        </div>
    )
};


export default connector(MessageList);