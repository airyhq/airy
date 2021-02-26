import React from 'react';
import styles from './index.module.scss';

type SourceDescriptionProps = {
  image: JSX.Element;
  title: string;
  text: string;
  buttonIcon: JSX.Element;
  displayButton: boolean;
};

const SourceDescription = (props: SourceDescriptionProps) => {
  return (
    <>
      <div className={styles.channelCard}>
        <div className={styles.channelLogo}>{props.image}</div>
        <div className={styles.channelTitleAndText}>
          <p className={styles.channelTitle}>{props.title}</p>
          <p className={styles.channelText}>{props.text}</p>
        </div>
      </div>

      {props.displayButton && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon} title="Add a channel">
              {props.buttonIcon}
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default SourceDescription;
