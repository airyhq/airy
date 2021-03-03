import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {disconnectChannel} from '../../../actions/channel';
import {SettingsModal, Button} from '@airyhq/components';
import {Channel, ChannelSource} from 'httpclient';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as CheckMark} from 'assets/images/icons/checkmark.svg';
import styles from './ChannelListItem.module.scss';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {CHANNELS_FACEBOOK_ROUTE} from '../../../routes/routes';

type ChannelItemProps = {
  channel: Channel;
} & ConnectedProps<typeof connector> &
  RouteComponentProps<{channelId: string}>;

const mapDispatchToProps = {
  disconnectChannel,
};

const connector = connect(null, mapDispatchToProps);

const ChannelItem = (props: ChannelItemProps) => {
  const {channel} = props;
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const disconnectChannelRequestPayload = {
    channelId: channel.id,
  };

  useEffect(() => {
    console.log('render');
  }, [channel]);

  const channelIcon = (channel: Channel) => {
    switch (channel.source) {
      case ChannelSource.facebook:
        if (channel.metadata.imageUrl) {
          return <img className={styles.facebookPageLogo} src={channel.metadata.imageUrl} />;
        } else {
          return <FacebookLogo />;
        }
      case ChannelSource.google:
        return <GoogleLogo />;
      case ChannelSource.twilioSMS:
        return <SMSLogo />;
      case ChannelSource.twilioWhatsapp:
        return <WhatsappLogo />;
      case ChannelSource.chatPlugin:
        return <AiryLogo />;
      default:
        return <AiryLogo />;
    }
  };

  const editChannel = () => {
    switch (channel.source) {
      case ChannelSource.facebook:
        return {pathname: CHANNELS_FACEBOOK_ROUTE + `/${channel.id}`, state: {channel: channel}};
      case ChannelSource.google:

      case ChannelSource.twilioSMS:

      case ChannelSource.twilioWhatsapp:

      case ChannelSource.chatPlugin:
    }
  };

  const disconnectChannel = () => {
    props.disconnectChannel(channel.source, disconnectChannelRequestPayload);
    setDeletePopupVisible(false);
  };

  return (
    <>
      <div>
        <div className={styles.channelItem}>
          <div className={styles.channelLogo}>{channelIcon(channel)}</div>
          <div className={styles.channelNameButton}>
            <div className={styles.channelName}>
              {channel.metadata.name}
              {channel.connected && (
                <div className={styles.connectedHint}>
                  Connected <CheckMark />
                </div>
              )}
            </div>
            <Button styleVariant="link" type="button" onClick={() => props.history.push(editChannel())}>
              Edit
            </Button>
            <Button styleVariant="link" type="button" onClick={() => setDeletePopupVisible(true)}>
              Disconnect
            </Button>
          </div>
        </div>
      </div>
      {deletePopupVisible && (
        <SettingsModal
          style={{maxWidth: '420px'}}
          title="Confirm Channel Disconnection"
          close={() => setDeletePopupVisible(false)}>
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
              <Button styleVariant="link" type="button" onClick={() => setDeletePopupVisible(false)}>
                Cancel
              </Button>
              <Button styleVariant="warning" type="submit" onClick={() => disconnectChannel()}>
                Disconnect Channel
              </Button>
            </div>
          </div>
        </SettingsModal>
      )}
    </>
  );
};

export default withRouter(connector(ChannelItem));
