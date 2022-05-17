import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {disconnectChannel} from '../../../../actions/channel';

import {SettingsModal, Button} from 'components';
import {Channel} from 'model';

import {ReactComponent as CheckMarkFilledIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as PencilIcon} from 'assets/images/icons/pencil.svg';
import {ReactComponent as DisconnectIcon} from 'assets/images/icons/disconnectIcon.svg';

import styles from './index.module.scss';
import {useNavigate} from 'react-router-dom';

type ChannelListItemProps = {
  channel: Channel;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  disconnectChannel,
};

const connector = connect(null, mapDispatchToProps);

const ChannelListItem = (props: ChannelListItemProps) => {
  const {channel} = props;
  const navigate = useNavigate();
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const path = location.pathname.includes('connectors') ? 'connectors' : 'catalog';

  const togglePopupVisibility = () => {
    setDeletePopupVisible(!deletePopupVisible);
  };

  const isPhoneNumberSource = () => {
    return channel.source === 'twilio.sms' || channel.source === 'twilio.whatsapp';
  };

  const disconnectChannel = () => {
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
          {channel.connected && <CheckMarkFilledIcon height={20} width={20} />}
          <div className={styles.channelName}>{channel.metadata?.name}</div>
          {isPhoneNumberSource() && <div className={styles.channelId}>{channel.sourceChannelId}</div>}
          <div className={styles.listButtons}>
            <Button
              styleVariant="link"
              style={{marginRight: '0px', padding: '0px'}}
              type="button"
              onClick={() =>
                navigate(`/${path}/${channel.source}/${channel.id}`, {
                  state: {channel: channel},
                })
              }
            >
              <PencilIcon height={16} width={16} />
            </Button>
            <Button
              style={{marginLeft: '16px', padding: '0px'}}
              styleVariant="link"
              type="button"
              onClick={togglePopupVisibility}
            >
              <DisconnectIcon height={18} width={18} />
            </Button>
          </div>
        </div>
      </div>

      {deletePopupVisible && (
        <SettingsModal style={{maxWidth: '420px'}} title="Confirm Channel Disconnection" close={togglePopupVisibility}>
          <div className={styles.disconnectModal}>
            <p>
              You are about to disconnect a channel. You will not receive any new messages in Airy or be able to send
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
              <Button styleVariant="warning" type="submit" onClick={disconnectChannel}>
                Disconnect Channel
              </Button>
            </div>
          </div>
        </SettingsModal>
      )}
    </>
  );
};

export default connector(ChannelListItem);
