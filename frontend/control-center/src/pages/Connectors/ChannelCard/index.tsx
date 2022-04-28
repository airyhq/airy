import React from 'react';
import {SourceInfo} from '../../../components/SourceInfo';
import styles from './index.module.scss';

type SourceDescriptionCardProps = {
  sourceInfo: SourceInfo;
  addChannelAction: () => void;
  installed: boolean;
};

const ChannelCard = (props: SourceDescriptionCardProps) => {
  const {sourceInfo, addChannelAction, installed} = props;

  return (
    <div
      className={`${styles.channelCard} ${installed ? styles.installed : styles.notInstalled}`}
      onClick={addChannelAction}
    >
      <div
        className={`${styles.channelLogoTitleContainer} ${
          installed ? styles.channelLogoTitleContainerInstalled : styles.channelLogoTitleContainerNotInstalled
        }`}
      >
        <div className={styles.channelLogo}>{sourceInfo.image}</div>
        <div className={styles.textDetails}>
          <h1>{sourceInfo.title}</h1>
          {!installed && <p>{sourceInfo.description}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
