import React from 'react';
import {SourceInfo} from '../../../components/SourceInfo';
import styles from './index.module.scss';

export enum InfoCardStyle {
  normal = 'normal',
  expanded = 'expanded',
}

type InfoCardProps = {
  sourceInfo: SourceInfo;
  addChannelAction: () => void;
  installed: boolean;
  style: InfoCardStyle;
};

const InfoCard = (props: InfoCardProps) => {
  const {sourceInfo, addChannelAction, installed, style} = props;  

  return (
    <div
      className={`${styles.channelCard} ${installed ? styles.installed : styles.notInstalled}`}
      onClick={addChannelAction}
    >
      <div
        className={`${styles.channelLogoTitleContainer} ${
          installed ? styles.channelLogoTitleContainerInstalled : styles.channelLogoTitleContainerNotInstalled
        } ${style === InfoCardStyle.expanded && styles.isExpanded}`}
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

export default InfoCard;
