import React, {useState} from 'react';
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
import {fallbackImage} from '../../../services/image/index';

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

  const isPhoneNumberSource = () => {
    return channel.source === 'twilio.sms' || channel.source === 'twilio.whatsapp';
  };

  const disconnectChannelRequestPayload = {
    source: channel.source,
    channelId: channel.id,
  };

  const getSourceLogo = (channel: Channel) => {
    switch (channel.source) {
      case ChannelSource.facebook:
        return <FacebookLogo />;
      case ChannelSource.google:
        return <GoogleLogo />;
      case ChannelSource.twilioSMS:
        return <SMSLogo />;
      case ChannelSource.twilioWhatsapp:
        return <WhatsappLogo />;
      default:
        return <AiryLogo />;
    }
  };

  const ChannelIcon = ({channel}: {channel: Channel}) => {
    if (channel?.metadata?.imageUrl) {
      return (
        <img
          onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => fallbackImage(event, channel.source)}
          className={styles.imageUrlLogo}
          src={channel.metadata.imageUrl}
        />
      );
    }
    return getSourceLogo(channel);
  };

  const editChannel = () => {
    return {pathname: `/channels/${channel.source}/${channel.id}`, state: {channel: channel}};
  };

  const disconnectChannel = () => {
    props.disconnectChannel(disconnectChannelRequestPayload);
    setDeletePopupVisible(false);
  };

  return (
    <>
      <div>
        <div className={styles.channelItem}>
          <div className={styles.channelLogo}>
            <ChannelIcon channel={channel} />
          </div>

          <div className={styles.channelName}>{channel.metadata?.name}</div>
          {isPhoneNumberSource() && <div className={styles.channelId}>{channel.sourceChannelId}</div>}
          {channel.connected && (
            <div className={styles.connectedHint}>
              Connected <CheckMark />
            </div>
          )}

          <div className={styles.listButtons}>
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
