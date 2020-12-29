import { type } from 'os';
import React from 'react';
import _redux from 'redux';
import _, {connect, ConnectedProps} from 'react-redux';
import { Message } from '../../../../model/Message';
import { StateModel } from '../../../../reducers';

import styles from '/index.module.scss';

type MessengerListItemProps = {
    message: Message,
} & ConnectedProps <typeof connector>

const mapStateToProps = (state: StateModel) => {
    return {

    }
}

const mapDispatchToProps = {

}

const connector = connect(mapStateToProps, mapDispatchToProps);

const MessengerListItem = ({message}: MessengerListItemProps) => {

    return (
        <div>
            <p></p>
        </div>
    );
};

export default connector(MessengerListItem);