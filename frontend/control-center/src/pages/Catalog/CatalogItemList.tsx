import React from 'react';
import InfoCard, {InfoCardStyle} from '../Connectors/InfoCard';
import {useNavigate} from 'react-router-dom';
import {SourceInfo} from '../../components/SourceInfo';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

interface CatalogItemListProps {
  list: SourceInfo[];
  installedConnectors: boolean;
  setDisplayDialogFromSource: React.Dispatch<React.SetStateAction<string>>;
  updateItemList: (installed: boolean, componentName: string) => void;
}

export const CatalogItemList = (props: CatalogItemListProps) => {
  const {list, installedConnectors, updateItemList} = props;
  const {t} = useTranslation();

  const navigate = useNavigate();

  return (
    <section className={styles.connectorContainer}>
      <h2>{installedConnectors ? t('installed') : t('notInstalled')}</h2>

      <div className={styles.connectorList}>
        {list.map(infoItem => (
          <InfoCard
            updateItemList={updateItemList}
            installed={installedConnectors}
            style={InfoCardStyle.normal}
            key={infoItem.type}
            sourceInfo={infoItem}
            addChannelAction={() =>
              installedConnectors ? navigate(infoItem.channelsListRoute) : navigate(infoItem.newChannelRoute)
            }
          />
        ))}
      </div>
    </section>
  );
};
