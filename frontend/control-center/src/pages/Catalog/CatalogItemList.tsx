import React from 'react';
import InfoCard, {InfoCardStyle} from '../Connectors/InfoCard';
import {StateModel} from '../../reducers';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {SourceInfo} from '../../components/SourceInfo';
import {Source} from 'model';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

interface CatalogItemListProps {
  list: SourceInfo[];
  installedConnectors: boolean;
  setDisplayDialogFromSource: React.Dispatch<React.SetStateAction<string>>;
  updateItemList: (installed: boolean, type: Source) => void;
}

export const CatalogItemList = (props: CatalogItemListProps) => {
  const {list, installedConnectors, setDisplayDialogFromSource, updateItemList} = props;
  const config = useSelector((state: StateModel) => state.data.config);
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
            addChannelAction={() => {
              const componentConfigKey =
                infoItem.repository === 'enterprise' ? 'enterprise-' + infoItem.configKey : infoItem.configKey;
              if (config.components[componentConfigKey] && config.components[componentConfigKey].enabled) {
                installedConnectors ? navigate(infoItem.channelsListRoute) : navigate(infoItem.newChannelRoute);
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
