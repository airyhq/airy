import React from 'react';

import {SourceInfo} from '../MainPage';
import {ReactComponent as PlusCircleIcon} from 'assets/images/icons/plusCircle.svg';

import styles from './index.module.scss';

type SourceDescriptionCardProps = {
  sourceInfo: SourceInfo;
  displayButton: boolean;
  addChannelAction?: () => void;
};

const SourceDescriptionCard = (props: SourceDescriptionCardProps) => {
  const {sourceInfo, displayButton, addChannelAction} = props;

  return (
    <>
      <div className={styles.requirementsDialogBackground} />
      <div className={styles.channelCard}>
        <div className={`${sourceInfo.type === 'instagram' ? styles.channelLogoInstagram : styles.channelLogo}`}>
          {sourceInfo.image}
        </div>
        <div className={styles.channelTitleAndText}>
          <p className={styles.channelTitle}>{sourceInfo.title}</p>
          <p className={styles.channelText}>{sourceInfo.description}</p>
        </div>
      </div>

      {displayButton && (
        <div className={styles.channelButton}>
          <button
            type="button"
            className={styles.addChannelButton}
            onClick={addChannelAction}
            data-cy={sourceInfo.dataCyAddChannelButton}
          >
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
