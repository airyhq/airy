import React from 'react';
import styles from './ChannelItems.module.scss';
import {ReactComponent as AiryLogo} from '../../assets/images/icons/airy_avatar.svg';
import {ReactComponent as FacebookLogo} from '../../assets/images/icons/messenger_avatar.svg';
import {ReactComponent as SMSLogo} from '../../assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappLogo} from '../../assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as GoogleLogo} from '../../assets/images/icons/google_avatar.svg';
import {ReactComponent as AddChannel} from '../../assets/images/icons/add-icon.svg';

function channelItem() {
  const handleAiryChannel = () => {
    //Enter logic here
  };
  const handleFacebookChannel = () => {
    //Enter logic here
  };
  const handleSmsChannel = () => {
    //Enter logic here
  };
  const handleWhatsappChannel = () => {
    //Enter logic here
  };
  const handleGoogleChannel = () => {
    //Enter logic here
  };

  return (
    <div className={`${styles.wrapper} ${styles.flexWrap}`}>
      <div className={`${styles.flexWrap}`}>
        <div className={styles.airyChannel}>
          <div className={styles.airyLogo}>
            <AiryLogo />
          </div>
          <div className={styles.airyTitleAndText}>
            <p className={styles.airyTitle}>Airy Live Chat</p>
            <p className={styles.airyText}>Best of class browser messenger</p>
          </div>
        </div>
        <div className={styles.channelButton}>
          <button type="button" onClick={handleAiryChannel} className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon}>
              <AddChannel />
            </div>
          </button>
        </div>
      </div>

      <div className={`${styles.flexWrap}`}>
        <div className={styles.facebookChannel}>
          <div className={styles.facebookLogo}>
            <FacebookLogo />
          </div>
          <div className={styles.facebookTitleAndText}>
            <p className={styles.facebookTitle}>Messenger</p>
            <p className={styles.facebookText}>Connect multiple Facebook pages</p>
          </div>
        </div>
        <div>
          <div className={styles.channelButton}>
            <button type="button" onClick={handleFacebookChannel} className={styles.addChannelButton}>
              <div className={styles.channelButtonIcon}>
                <AddChannel />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={`${styles.flexWrap}`}>
        <div className={styles.smsChannel}>
          <div className={styles.smsLogo}>
            <SMSLogo />
          </div>
          <div className={styles.smsTitleAndText}>
            <p className={styles.smsTitle}>SMS</p>
            <p className={styles.smsText}>Deliver SMS with ease</p>
          </div>
        </div>
        <div>
          <div className={styles.channelButton}>
            <button type="button" onClick={handleSmsChannel} className={styles.addChannelButton}>
              <div className={styles.channelButtonIcon}>
                <AddChannel />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={`${styles.flexWrap}`}>
        <div className={styles.whatsappChannel}>
          <div className={styles.whatsappLogo}>
            <WhatsappLogo />
          </div>
          <div className={styles.whatsappTitleAndText}>
            <p className={styles.whatsappTitle}>Whatsapp</p>
            <p className={styles.whatsappText}>World #1 chat app</p>
          </div>
        </div>
        <div>
          <div className={styles.channelButton}>
            <button type="button" onClick={handleWhatsappChannel} className={styles.addChannelButton}>
              <div className={styles.channelButtonIcon}>
                <AddChannel />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={`${styles.flexWrap}`}>
        <div className={styles.googleChannel}>
          <div className={styles.googleLogo}>
            <GoogleLogo />
          </div>
          <div className={styles.googleTitleAndText}>
            <p className={styles.googleTitle}>Google Business Messages</p>
            <p className={styles.googleText}>Be there when people search</p>
          </div>
        </div>
        <div>
          <div className={styles.channelButton}>
            <button type="button" onClick={handleGoogleChannel} className={styles.addChannelButton}>
              <div className={styles.channelButtonIcon}>
                <AddChannel />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default channelItem;
