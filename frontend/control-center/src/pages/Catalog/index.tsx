import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../reducers';
import {useSelector} from 'react-redux';
import {FacebookMessengerRequirementsDialog} from '../Connectors/Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {GoogleBusinessMessagesRequirementsDialog} from '../Connectors/Providers/Google/GoogleBusinessMessagesRequirementsDialog';
import {TwilioRequirementsDialog} from '../Connectors/Providers/Twilio/TwilioRequirementsDialog';
import {InstagramRequirementsDialog} from '../Connectors/Providers/Instagram/InstagramRequirementsDialog';
import {setPageTitle} from '../../services/pageTitle';
import {CatalogItemList} from './CatalogItemList';
import {Source} from 'model';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';
import {listComponents} from '../../actions/catalog';
import {removePrefix} from '../../services';
import {useTranslation} from 'react-i18next';
import CatalogCard from './CatalogCard';
import styles from './index.module.scss';

const mapDispatchToProps = {
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

export const findSourceForComponent = (displayName: string) => {
  switch (displayName) {
    case 'Airy Chat Plugin':
      return Source.chatPlugin;
    case 'Facebook Messenger':
      return  Source.facebook;
    case 'Twilio SMS':
      return Source.twilioSMS;
    case 'Twilio WhatsApp':
      return Source.twilioWhatsApp;
    case 'Google Business Messages':
      return Source.google;
    case 'Instagram':
      return Source.instagram;
    case 'Dialogflow':
      return Source.dialogflow;
    case 'Salesforce':
      return Source.salesforce;
    case 'Zendesk':
      return Source.zendesk;
  }
}

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {listComponents} = props;
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');
  const [notInstalledConnectors, setNotInstalledConnectors] = useState([]);
  const [installedConnectors, setInstalledConnectors] = useState([]);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const [isInstallToggled, setIsInstalledToggled] = useState(false);
  const [loading, setLoading] = useState(true);
  const pageTitle = 'Catalog';
  const {t} = useTranslation();

  const catalogArrObjEntries = Object.entries(catalogList);
  const catalogArrObjKeys = Object.keys(catalogList);
  const catalogArrObjValues = Object.values(catalogList);

  // console.log('catalogArrObjEntries', catalogArrObjEntries);
  // console.log('catalogArrObjKeys', catalogArrObjKeys);
  console.log('catalogArrObjValues', catalogArrObjValues);

  useEffect(() => {
    listComponents();
    setPageTitle(pageTitle);
    setSourcesInfo(getSourcesInfo());
  }, []);

  const findComponent = (name: string) => {
    return sourcesInfo.filter((elem: SourceInfo) => elem.componentName === name);
  };

  return (
    <section className={styles.catalogWrapper}>
      <h1 className={styles.catalogHeadlineText}>Catalog</h1>

    <section className={styles.catalogListContainer}>
      {Object.values(catalogList).map((infoItem: any) => {
        if(findSourceForComponent(infoItem.displayName)){
          return (
            <CatalogCard
              componentInfo={infoItem}
            />
          );
        }
      })}
      </section>
    </section>
  );
};

export default connector(Catalog);
