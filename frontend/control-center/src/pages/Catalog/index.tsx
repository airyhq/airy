import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {FacebookMessengerRequirementsDialog} from '../Connectors/Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {GoogleBusinessMessagesRequirementsDialog} from '../Connectors/Providers/Google/GoogleBusinessMessagesRequirementsDialog';
import {TwilioRequirementsDialog} from '../Connectors/Providers/Twilio/TwilioRequirementsDialog';
import {InstagramRequirementsDialog} from '../Connectors/Providers/Instagram/InstagramRequirementsDialog';
import {CatalogItemList} from './CatalogItemList';
import {NotificationModel, Source} from 'model';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';
import {SimpleLoader} from 'components';
import {listComponents} from '../../actions/catalog';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services';
import {ComponentInfo, getSourceForComponent} from 'model';
import CatalogCard from './CatalogCard';
import styles from './index.module.scss';
import {Notification} from 'components';

const mapDispatchToProps = {
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {listComponents} = props;
  const [orderedCatalogList, setOrderedCatalogList] = useState([]);
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const {t} = useTranslation();
  const catalogPageTitle = t('Catalog');
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');
  const [notInstalledConnectors, setNotInstalledConnectors] = useState([]);
  const [installedConnectors, setInstalledConnectors] = useState([]);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isInstallToggled, setIsInstalledToggled] = useState(false);
  const pageTitle = 'Catalog';

  useEffect(() => {
    listComponents();
    setPageTitle(catalogPageTitle);
  }, []);

  useEffect(() => {
    setOrderedCatalogList(Object.values(catalogList).sort(sortByInstall));
  }, [catalogList]);

  const sortByInstall = (a: ComponentInfo) => {
    if (a.installed) return 1;
    return -1;
  };

  return (
    <section className={styles.catalogWrapper}>
      <h1 className={styles.catalogHeadlineText}>{catalogPageTitle}</h1>

      <section className={styles.catalogListContainer}>
        {orderedCatalogList &&
          orderedCatalogList.map((infoItem: ComponentInfo) => {
            if (infoItem?.name && !infoItem.name.includes('viber') && getSourceForComponent(infoItem.name)) {
              return <CatalogCard componentInfo={infoItem} key={infoItem.displayName} />;
            }
          })}
      </section>
    </section>
  );
};

export default connector(Catalog);
