import React, {useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {disconnectChannel} from '../../../../actions/channel';
import {SettingsModal, Button} from '@airyhq/components';
import {Channel} from 'httpclient';
import SourceLogo from '../../../../components/SourceLogo';
import {ReactComponent as CheckMarkIcon} from 'assets/images/icons/checkmark.svg';

import styles from './index.module.scss';

type ChannelListItemProps = {
  channel: Channel;
} & ConnectedProps<typeof connector> &
  RouteComponentProps<{channelId: string}>;

const mapDispatchToProps = {
  disconnectChannel,
};

const connector = connect(null, mapDispatchToProps);

const ChannelListItem = (props: ChannelListItemProps) => {
  const {channel} = props;
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

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
          <SourceLogo channel={channel} imageWidth={40} imageHeight={40} marginRight={8} />
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
                props.history.push({
                  pathname: `/channels/${channel.source}/${channel.id}`,
                  state: {channel: channel},
                })
              }>
              Edit
            </Button>
            <Button styleVariant="link" type="button" onClick={togglePopupVisibility}>
              Disconnect
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

export default withRouter(connector(ChannelListItem));
