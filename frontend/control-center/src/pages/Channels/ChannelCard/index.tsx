import React from 'react';
import {SourceInfo} from '..';
import styles from './index.module.scss';

type SourceDescriptionCardProps = {
  sourceInfo: SourceInfo;
  addChannelAction: () => void;
};

const ChannelCard = (props: SourceDescriptionCardProps) => {
  const {sourceInfo, addChannelAction} = props;

  return (
    <div className={styles.channelCard} onClick={addChannelAction}>
      <div className={styles.channelLogo}>{sourceInfo.image}</div>
      <p className={styles.channelTitle}>{sourceInfo.title}</p>
    </div>
  );
};

export default ChannelCard;
