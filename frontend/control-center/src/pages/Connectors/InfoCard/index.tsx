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
      className={`
        ${styles.channelCard} 
        ${
          style === InfoCardStyle.expanded
            ? styles.isExpandedContainer
            : installed
            ? styles.installed
            : styles.notInstalled
        } 
      `}
      onClick={addChannelAction}
    >
      <div
        className={`
          ${styles.channelLogoTitleContainer} 
          ${
            style === InfoCardStyle.expanded
              ? styles.isExpandedContainer
              : installed
              ? styles.channelLogoTitleContainerInstalled
              : styles.channelLogoTitleContainerNotInstalled
          }          
        `}
      >
        <div
          className={`
          ${styles.channelLogo}
          ${style === InfoCardStyle.expanded && styles.isExpandedLogo}
        `}
        >
          {sourceInfo.image}
        </div>
        <div
          className={`
          ${styles.textDetails}
          ${style === InfoCardStyle.expanded && styles.isExpandedDetails}
        `}
        >
          <h1>{sourceInfo.title}</h1>
          {!installed && <p>{sourceInfo.description}</p>}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
