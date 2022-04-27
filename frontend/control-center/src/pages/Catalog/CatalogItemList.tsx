import React from 'react';
import ChannelCard from '../Channels/ChannelCard';
import {StateModel} from '../../reducers';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {SourceInfo} from './index';
import styles from './index.module.scss';

interface CatalogItemListProps {
  list: SourceInfo[];
  installedConnectors: boolean;
  setDisplayDialogFromSource: React.Dispatch<React.SetStateAction<string>>;
}

export const CatalogItemList = (props: CatalogItemListProps) => {
  const {list, installedConnectors, setDisplayDialogFromSource} = props;
  const config = useSelector((state: StateModel) => state.data.config);
  const navigate = useNavigate();

  return (
    <section className={styles.connectorContainer}>
      <h2>{installedConnectors ? 'Installed' : 'Not Installed'}</h2>

      <div className={styles.connectorList}>
        {list.map(infoItem => (
          <ChannelCard
            installed={installedConnectors}
            key={infoItem.type}
            sourceInfo={infoItem}
            addChannelAction={() => {
              if (config.components[infoItem.configKey] && config.components[infoItem.configKey].enabled) {
                navigate(infoItem.newChannelRoute);
              } else {
                setDisplayDialogFromSource(infoItem.type);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
};