import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {disconnectChannel} from '../../../../actions/channel';

import {SettingsModal, Button} from 'components';
import {Channel} from 'model';

import {ReactComponent as CheckMarkIcon} from 'assets/images/icons/checkmark.svg';
import ConnectorAvatar from '../../../../components/ConnectorAvatar';

import styles from './index.module.scss';
import {useNavigate} from 'react-router-dom';

type ChannelListItemProps = {
  channel: Channel;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  disconnectChannel,
};

const connector = connect(null, mapDispatchToProps);

const ConnectorListItem = (props: ChannelListItemProps) => {
  const {channel} = props;
  const navigate = useNavigate();
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const togglePopupVisibility = () => {
    setDeletePopupVisible(!deletePopupVisible);
  };

  const isPhoneNumberSource = () => {
    return channel.source === 'twilio.sms' || channel.source === 'twilio.whatsapp';
  };

  const disconnectConnector = () => {
    props.disconnectChannel({
      source: channel.source,
      channelId: channel.id,
    });
    togglePopupVisibility();
  };

  return (
    <>
      <div>
        <div className={styles.channelItem}>
          <div className={styles.channelLogo}>
            <ConnectorAvatar channel={channel} style={{width: '40px', height: '40px'}} />
          </div>
          <div className={styles.channelName}>{channel.metadata?.name}</div>
          {isPhoneNumberSource() && <div className={styles.channelId}>{channel.sourceChannelId}</div>}
          {channel.connected && (
            <div className={styles.connectedHint}>
              Connected <CheckMarkIcon />
            </div>
          )}

          <div className={styles.listButtons}>
            <Button
              styleVariant="link"
              type="button"
              onClick={() =>
                navigate(`/connectors/${channel.source}/${channel.id}`, {
                  state: {channel: channel},
                })
              }
            >
              Edit
            </Button>
            <Button styleVariant="link" type="button" onClick={togglePopupVisibility}>
              Disconnect
            </Button>
          </div>
        </div>
      </div>

      {deletePopupVisible && (
        <SettingsModal
          style={{maxWidth: '420px'}}
          title="Confirm Connector Disconnection"
          close={togglePopupVisibility}
        >
          <div className={styles.disconnectModal}>
            <p>
              You are about to disconnect a connector. You will not receive any new messages in Airy or be able to send
              messages anymore.
            </p>
            <p>
              If you need help or experience a problem, please reach out to{' '}
              <a href="mailto:support@airy.co">support@airy.co</a>.
            </p>
            <div className={styles.modalSeparator} />
            <div className={styles.modalButtons}>
              <Button styleVariant="link" type="button" onClick={togglePopupVisibility}>
                Cancel
              </Button>
              <Button styleVariant="warning" type="submit" onClick={disconnectConnector}>
                Disconnect Connector
              </Button>
            </div>
          </div>
        </SettingsModal>
      )}
    </>
  );
};

export default connector(ConnectorListItem);
