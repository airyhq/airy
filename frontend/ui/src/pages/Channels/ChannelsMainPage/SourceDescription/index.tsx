import React, {useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as AddIcon} from 'assets/images/icons/plus-circle.svg';
import {TwilioModal} from '../SourcesModal/TwilioModal';
import {ChannelSource} from 'httpclient';

type SourceDescriptionProps = {
  image: JSX.Element;
  title: string;
  text: string;
  displayButton: boolean;
<<<<<<< HEAD
  id: string;
=======
  id?: string;
>>>>>>> 0d3a4d38 (resolve source connect conflict)
  onAddChannelClick?: () => void;
};
console.log(ChannelSource.twilioSMS);
const SourceDescription = (props: SourceDescriptionProps) => {
  const [show, setShow] = useState(false);

  const openModal = (id: string): JSX.Element => {
    switch (id) {
      case ChannelSource.twilioSMS:
        return <TwilioModal />;
      case ChannelSource.google:
        break;
      case ChannelSource.chatPlugin:
        break;
      case ChannelSource.facebook:
        break;
      case ChannelSource.twilioWhatsapp:
        break;
    }
  };
  return (
    <>
      <div className={styles.requirementsDialogBackground}></div>
      <div className={styles.channelCard}>
        <div className={styles.channelLogo}>{props.image}</div>
        <div className={styles.channelTitleAndText}>
          <p className={styles.channelTitle}>{props.title}</p>
          <p className={styles.channelText}>{props.text}</p>
        </div>
      </div>

      {props.displayButton && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton} onClick={props.onAddChannelClick}>
            <div className={styles.channelButtonIcon} title="Add a channel">
              <AddIcon />
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default SourceDescription;
