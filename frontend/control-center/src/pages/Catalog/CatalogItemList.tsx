import React from 'react';
import InfoCard, {InfoCardStyle} from '../../components/InfoCard';
import CatalogCard from './CatalogCard';
import {useNavigate} from 'react-router-dom';
import {SourceInfo} from '../../components/SourceInfo';
import {SimpleLoader} from 'components';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

interface CatalogItemListProps {
  list: SourceInfo[];
  installedConnectors: boolean;
  setDisplayDialogFromSource: React.Dispatch<React.SetStateAction<string>>;
  updateItemList: (installed: boolean, componentName: string) => void;
  setIsInstalledToggled: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const CatalogItemList = (props: CatalogItemListProps) => {
  const {list, installedConnectors, updateItemList, setIsInstalledToggled, loading} = props;
  const {t} = useTranslation();

  const navigate = useNavigate();

  return (
    <section className={styles.connectorContainer}>
      {loading && <SimpleLoader />}

      <div className={styles.connectorList}>
        {list.map(infoItem => (
          <CatalogCard
            updateItemList={updateItemList}
            installed={installedConnectors}
            style={InfoCardStyle.normal}
            key={infoItem.type}
            sourceInfo={infoItem}
            setIsInstalledToggled={setIsInstalledToggled}
            addChannelAction={() =>
              installedConnectors ? navigate(infoItem.channelsListRoute) : navigate(infoItem.newChannelRoute)
            }
          />
        ))}
      </div>
    </section>
  );
};
