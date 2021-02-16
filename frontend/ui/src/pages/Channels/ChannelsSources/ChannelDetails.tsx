import React from 'react';
import styles from './ChannelDetails.module.scss';

const ChannelDetails = props => {
  return (
    <>
      <div className={styles.channelCard}>
        <div className={styles.channelLogo}>{props.image}</div>
        <div className={styles.channelTitleAndText}>
          <p className={styles.channelTitle}>{props.title}</p>
          <p className={styles.channelText}>{props.text}</p>
        </div>
      </div>

      {props.shouldDisplayButton && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon}>{props.buttonIcon}</div>
          </button>
        </div>
      )}
    </>
  );
};

export default ChannelDetails;
