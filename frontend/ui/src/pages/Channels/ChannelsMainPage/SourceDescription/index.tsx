import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as AddIcon} from 'assets/images/icons/plus-circle.svg';

type SourceDescriptionProps = {
  image: JSX.Element;
  title: string;
  text: string;
  displayButton: boolean;
  id: string;
  dataCyAddChannelButton?: string;
  onAddChannelClick?: () => void;
};

const SourceDescription = (props: SourceDescriptionProps) => {
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
          <button
            type="button"
            className={styles.addChannelButton}
            onClick={props.onAddChannelClick}
            data-cy={props.dataCyAddChannelButton}>
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
