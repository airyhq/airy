import React from 'react';

import {SourceTypeInfo} from '../MainPage';
import {ReactComponent as PlusCircleIcon} from 'assets/images/icons/plus-circle.svg';

import styles from './index.module.scss';

type SourceTypeDescriptionCardProps = {
  sourceTypeInfo: SourceTypeInfo;
  displayButton: boolean;
  addChannelAction?: () => void;
};

const SourceTypeDescriptionCard = (props: SourceTypeDescriptionCardProps) => {
  const {sourceTypeInfo, displayButton, addChannelAction} = props;

  return (
    <>
      <div className={styles.requirementsDialogBackground}></div>
      <div className={styles.channelCard}>
        <div className={styles.channelLogo}>{sourceTypeInfo.image}</div>
        <div className={styles.channelTitleAndText}>
          <p className={styles.channelTitle}>{sourceTypeInfo.title}</p>
          <p className={styles.channelText}>{sourceTypeInfo.description}</p>
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

export default SourceTypeDescriptionCard;
