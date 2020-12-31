import React, {useState} from 'react';
import _redux from 'redux';
import _, {connect, ConnectedProps} from 'react-redux';
import { Message, MessageSenderType } from '../../../../model/Message';
import { StateModel } from '../../../../reducers';
import { dateFormat } from '../../../../services/format/date';

import styles from './index.module.scss';

type MessengerListItemProps = {
    message: string,
    messageSenderType: string,
    messageDate: Date,
} & ConnectedProps <typeof connector>

const mapStateToProps = (state: StateModel) => {
    return {
        lastMessages: state.data.conversations.all.items
    }
}

const connector = connect(mapStateToProps, null);

const MessengerListItem = (props: MessengerListItemProps) => { 
    const {message, messageSenderType, messageDate, lastMessages} = props;
    const [lastMessage, setLastMessage] = useState('');
    const isUser = messageSenderType !== MessageSenderType.appUser;

    const messageAvatar = (messageId: string) => {
        
    }

    return (
        <div className={styles.messageListItemContainer}>
            <div className={styles.messageListItem}>
                {!isUser ? (
                    <div className={styles.messageListItemMember}>
                        {message}
                    </div>
                ) : (
                    <div className={styles.messageListItemUser}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default connector(MessengerListItem);