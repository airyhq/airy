import React, {useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {fallbackImage} from 'sharedServices/fallbackImage';

import {disconnectChannel} from '../../../../actions/channel';

import {SettingsModal, Button} from '@airyhq/components';
import {Channel, SourceType} from 'httpclient';

import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsAppAvatarIcon} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airy_avatar.svg';
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

  const getSourceLogo = (channel: Channel) => {
    switch (channel.source) {
      case SourceType.facebook:
        return <MessengerAvatarIcon />;
      case SourceType.google:
        return <GoogleAvatarIcon />;
      case SourceType.twilioSMS:
        return <SMSAvatarIcon />;
      case SourceType.twilioWhatsapp:
        return <WhatsAppAvatarIcon />;
      default:
        return <AiryAvatarIcon />;
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
          <div className={styles.channelLogo}>
            <ChannelIcon channel={channel} />
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
