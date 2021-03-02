import React, {useState} from 'react';
import {SettingsModal, SimpleLoader, Button} from '@airyhq/components';
import {ReactComponent as FacebookIcon} from 'assets/images/icons/messengerBubble.svg';
import {ReactComponent as GoogleIcon} from 'assets/images/icons/google-messages.svg';
import {ReactComponent as SmsIcon} from 'assets/images/icons/sms-icon.svg';
import {ReactComponent as WhatsappIcon} from 'assets/images/icons/whatsapp-icon.svg';
import {ReactComponent as CheckMark} from 'assets/images/icons/checkmark.svg';
import styles from './ChannelItem.module.scss';

type ChannelItemProps = {
  channel: {
    name: string;
    source: string;
    loading: boolean;
  };
  isConnected: boolean;
  isLastItem: boolean;
};

const ChannelItem = (props: ChannelItemProps) => {
  const {name, source, loading = false} = props.channel;
  const {isConnected, isLastItem} = props;

  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const SOURCE_DATA = {
    FACEBOOK: {
      style: styles.pageIconFacebook,
      image: FacebookIcon,
    },
    GOOGLE: {
      style: styles.pageIconGoogle,
      image: GoogleIcon,
    },
    SMS_TWILIO: {
      style: styles.pageIconSMS,
      image: SmsIcon,
    },
    WHATSAPP_TWILIO: {
      style: styles.pageIconWhatsApp,
      image: WhatsappIcon,
    },
    SELF: {
      style: styles.pageIconFacebook,
      image: FacebookIcon,
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
      <div
        className={`${styles.connectedPage} ${isConnected ? '' : styles.entryFade} ${
          isLastItem ? '' : styles.addDivider
        }`}>
        <div className={`${styles.pageIcon} ${source ? SOURCE_DATA[source].style : styles.pageIconFacebook}`}>
          <FacebookIcon />
          {/* <AccessibleSVG title={name} src={source ? SOURCE_DATA[source].image : fbIcon} /> */}
        </div>
        <div className={styles.channelDetails}>
          <div className={styles.channelName}>
            {name}
            {isConnected && (
              <div className={styles.connectedHint}>
                Connected <CheckMark />
              </div>
            )}
          </div>
          {source !== 'FACEBOOK' && source !== undefined ? (
            <div className={styles.channelConnect}>{renderDisabledDisconnect()}</div>
          ) : (
            <div className={styles.channelConnect}>{!loading ? renderButton() : <SimpleLoader />}</div>
          )}
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
