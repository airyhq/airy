import React, {useState} from 'react';
import styles from './index.module.scss';
import {RequirementsDialog} from '../../Facebook/RequirementsDialog';
import {ChannelSource} from 'httpclient';
import {ReactComponent as AddIcon} from 'assets/images/icons/plus-circle.svg';

type SourceDescriptionProps = {
  image: JSX.Element;
  title: string;
  text: string;
  displayButton: boolean;
  id: string;
  onAddChannelClick?: () => void;
};

const SourceDescription = (props: SourceDescriptionProps) => {
  const [show, setShow] = useState(false);

  const openRequirementsDialog = (id: string): JSX.Element => {
    switch (id) {
      case ChannelSource.facebook:
        return <RequirementsDialog show={true} />;
      case ChannelSource.google:
        break;
      case ChannelSource.chatPlugin:
        break;
      case ChannelSource.twilioSMS:
        break;
      case ChannelSource.twilioWhatsapp:
        break;
    }
  };

  return (
    <>
      <div className={styles.requirementsDialogBackground}>
        {show && <div className={styles.requirementsDialog}>{openRequirementsDialog(props.id)}</div>}
      </div>
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
