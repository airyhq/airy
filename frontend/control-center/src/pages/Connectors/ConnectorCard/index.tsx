import React from 'react';
import {SourceInfo} from '..';
import styles from './index.module.scss';

type SourceDescriptionCardProps = {
  sourceInfo: SourceInfo;
  addConnectorAction: () => void;
};

const ConnectorCard = (props: SourceDescriptionCardProps) => {
  const {sourceInfo, addConnectorAction} = props;

  return (
    <div className={styles.connectorCard} onClick={addConnectorAction}>
      <div className={styles.connectorLogo}>{sourceInfo.image}</div>
      <p className={styles.connectorTitle}>{sourceInfo.title}</p>
    </div>
  );
};

export default ConnectorCard;
