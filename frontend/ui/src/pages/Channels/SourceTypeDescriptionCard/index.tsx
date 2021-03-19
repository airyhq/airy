import React from 'react';

import {SourceInfo} from '../MainPage';
import {ReactComponent as PlusCircleIcon} from 'assets/images/icons/plus-circle.svg';

import styles from './index.module.scss';

type SourceDescriptionCardProps = {
  SourceInfo: SourceInfo;
  displayButton: boolean;
  addChannelAction?: () => void;
};

const SourceDescriptionCard = (props: SourceDescriptionCardProps) => {
  const {SourceInfo, displayButton, addChannelAction} = props;

  return (
    <>
      <div className={styles.requirementsDialogBackground}></div>
      <div className={styles.channelCard}>
        <div className={styles.channelLogo}>{SourceInfo.image}</div>
        <div className={styles.channelTitleAndText}>
          <p className={styles.channelTitle}>{SourceInfo.title}</p>
          <p className={styles.channelText}>{SourceInfo.description}</p>
        </div>
      </div>

      {displayButton && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton} onClick={addChannelAction}>
            <div className={styles.channelButtonIcon} title="Add a channel">
              <PlusCircleIcon />
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default SourceDescriptionCard;
