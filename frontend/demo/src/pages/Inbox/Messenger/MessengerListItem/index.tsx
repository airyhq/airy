import React from 'react';
import _redux from 'redux';
import _, {connect, ConnectedProps} from 'react-redux';
import { Message, MessageAlignment } from '../../../../model/Message';
import { StateModel } from '../../../../reducers';

import styles from './index.module.scss';

type MessengerListItemProps = {
    message: string,
    messageAlignment?: string,
} & ConnectedProps <typeof connector>

const mapStateToProps = (state: StateModel) => {
    return {
        
    }
}

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);

const MessengerListItem = ({message, messageAlignment}: MessengerListItemProps) => {

    const isMember = messageAlignment !== MessageAlignment.left;

    console.log(messageAlignment)
    console.log(isMember);

    return (
        <div className={styles.messageListItemContainer}>
            <div className={styles.messageListItem}>
                {isMember ? (
                    <div className={styles.messageListItemMember}>
                        <p>{message}</p>
                    </div>
                ) : (
                    <div className={styles.messageListItemUser}>
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default connector(MessengerListItem);