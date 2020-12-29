import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { StateModel } from '../../../../reducers';
import conversations from '../../../../reducers/data/conversations';
import MessageList from '../MessageList';
import { Conversation } from '../../../../model/Conversation';
import {ReactComponent as EmptyStateImage} from '../../../../assets/images/empty-state/inbox-empty-state.svg';
import styles from './index.module.scss';
import { RouteComponentProps } from 'react-router-dom';

const mapStateToProps = (state: StateModel) => {
    return {
        conversations: state.data.conversations.all.items,
    };
};

const mapDispatchToProps = {

};

const connector = connect(mapStateToProps, mapDispatchToProps);

type MessengerContainerProps = {
} & ConnectedProps<typeof connector>

const MessengerContainer = (props: MessengerContainerProps) => {
    const {conversations} = props;

    return (
        <div className={styles.messengerContainer}>
            {!conversations ? (
                <div className={styles.emptyState}>
                    <h1>Your conversations will appear here as soon as a contact messages you.</h1>
                    <p>Airy Messenger only shows new conversations from the moment you connect your Facebook Pages.</p>
                    <EmptyStateImage />
                </div>
            ) : (
                <MessageList />
            )}
        </div>
    );
};

export default connector(MessengerContainer);