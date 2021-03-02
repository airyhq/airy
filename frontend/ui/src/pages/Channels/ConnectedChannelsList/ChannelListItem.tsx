import React, {useState} from 'react';
import {SettingsModal, SimpleLoader, Button} from '@airyhq/components';
import {Channel, ChannelSource} from 'httpclient';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as CheckMark} from 'assets/images/icons/checkmark.svg';
import styles from './ChannelListItem.module.scss';

type ChannelItemProps = {
  channel: Channel;
  isConnected: boolean;
  isLastItem: boolean;
};

const ChannelItem = (props: ChannelItemProps) => {
  const {channel, isConnected, isLastItem} = props;

  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const channelIcon = (source: string) => {
    switch (source) {
      case ChannelSource.facebook:
          return <FacebookLogo />
        
      case ChannelSource.google:
          return <GoogleLogo />

      case ChannelSource.twilioSMS:
          return <SMSLogo />

      case ChannelSource.twilioWhatsapp:
          return <WhatsappLogo />

      case ChannelSource.chatPlugin:
          return <AiryLogo />
          default:
              return <AiryLogo />
    }
  };

  const SOURCE_DATA = {
    FACEBOOK: {
      style: styles.pageIconFacebook,
    //   image: FacebookIcon,
    },
    GOOGLE: {
      style: styles.pageIconGoogle,
    //   image: GoogleIcon,
    },
    SMS_TWILIO: {
      style: styles.pageIconSMS,
    //   image: SmsIcon,
    },
    WHATSAPP_TWILIO: {
      style: styles.pageIconWhatsApp,
    //   image: WhatsappIcon,
    },
    SELF: {
      style: styles.pageIconFacebook,
    //   image: FacebookIcon,
    },
  };

  const handleClick = (requiresConfirmation: boolean) => {
    if (!requiresConfirmation) {
      //   props.manageChannel(props.channel, props.organization_id);
      //   props.setDrawer && props.availablePages.length < 2 && props.setDrawer(false);
    } else {
      setDeletePopupVisible(true);
    }
  };

  const renderButton = () => {
    return isConnected ? (
      <Button styleVariant="link" type="button" onClick={() => handleClick(true)}>
        Disconnect
      </Button>
    ) : (
      <Button styleVariant="small" type="button" onClick={() => handleClick(false)}>
        Connect
      </Button>
    );
  };

  const renderDisabledDisconnect = () => {
    return (
      <div
        className={styles.disabledDisconnect}
        title="If you need to disconnect a channel, get in touch via support@airy.co">
        Disconnect
      </div>
    );
  };

  return (
    <>
    <div>
      {/* <div
        className={`${styles.connectedPage} ${isConnected ? '' : styles.entryFade} ${
          isLastItem ? '' : styles.addDivider
        }`}> */}
        {/* <div className={`${styles.pageIcon} ${source ? SOURCE_DATA[source].style : styles.pageIconFacebook}`}> */}
            {/* <div> */}
          {/* <FacebookIcon /> */}
          {/* <AccessibleSVG title={name} src={source ? SOURCE_DATA[source].image : fbIcon} /> */}
        {/* </div> */}
        <div className={styles.channelDetails}>
            <div className={styles.channelLogo}>
                {channelIcon(channel.source)}
            </div>
          <div className={styles.channelName}>
            {channel.metadata.name}
            {isConnected && (
              <div className={styles.connectedHint}>
                Connected <CheckMark />
              </div>
            )}
          </div>
          {/* {channel.source !== 'facebook' && channel.source !== undefined ? (
            <div className={styles.channelConnect}>{renderDisabledDisconnect()}</div>
          ) : (
            <div className={styles.channelConnect}>{!loading ? renderButton() : <SimpleLoader />}</div>
          )} */}
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
              <Button styleVariant="warning" type="submit" onClick={() => handleClick(false)}>
                Disconnect Channel
              </Button>
            </div>
          </div>
        </SettingsModal>
      )}
    </>
  );
};

export default ChannelItem;
