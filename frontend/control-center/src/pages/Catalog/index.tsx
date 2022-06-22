import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {StateModel} from '../../reducers';
import {useSelector} from 'react-redux';
import {FacebookMessengerRequirementsDialog} from '../Connectors/Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {GoogleBusinessMessagesRequirementsDialog} from '../Connectors/Providers/Google/GoogleBusinessMessagesRequirementsDialog';
import {TwilioRequirementsDialog} from '../Connectors/Providers/Twilio/TwilioRequirementsDialog';
import {InstagramRequirementsDialog} from '../Connectors/Providers/Instagram/InstagramRequirementsDialog';
import {setPageTitle} from '../../services/pageTitle';
import {CatalogItemList} from './CatalogItemList';
import {Channel, Source, getSourceForComponent} from 'model';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';

//rename SourceInfo to ComponentsInfo 

const Catalog = () => {
  const connectors = useSelector((state: StateModel) => state.data.config.components);
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');
  const [notInstalledConnectors, setNotInstalledConnectors] = useState([]);
  const [installedConnectors, setInstalledConnectors] = useState([]);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const pageTitle = 'Catalog';

  useEffect(() => {
    setPageTitle(pageTitle);
    setSourcesInfo(getSourcesInfo(pageTitle));
  }, []);

  useEffect(() => {
    if (sourcesInfo.length > 0 && Object.entries(connectors).length > 0) {
      const installedList = [];
      const sourcesInfosClone = [...sourcesInfo];

      Object.entries(connectors).map(elem => {
        if (getSourceForComponent(elem[0])) {
          installedList.push(getSourceForComponent(elem[0]));
        }
      });

      const isComponentInstalled = elem =>
        installedList.includes(elem.type) ||
        (elem.type === Source.instagram && installedList.includes('facebook')) ||
        elem.type === Source.twilioWhatsApp ||
        (Source.twilioSMS && installedList.includes('twilio'));

      const installedComponents = sourcesInfosClone.filter(elem => isComponentInstalled(elem));
      const notInstalledComponents = sourcesInfosClone.filter(elem => !isComponentInstalled(elem));

      setInstalledConnectors(installedComponents);
      setNotInstalledConnectors(notInstalledComponents);
    }
  }, [sourcesInfo, connectors]);

  const OpenRequirementsDialog = ({source}: {source: string}): JSX.Element => {
    switch (source) {
      case Source.facebook:
        return <FacebookMessengerRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.google:
        return <GoogleBusinessMessagesRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.twilioSMS:
      case Source.twilioWhatsApp:
        return <TwilioRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.instagram:
        return <InstagramRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
    }

    return null;
  };

  return (
    <div className={styles.catalogWrapper}>
      <div className={styles.catalogHeadline}>
        <div>
          <h1 className={styles.catalogHeadlineText}>Catalog</h1>
        </div>
      </div>

      <div className={styles.listWrapper}>
        {displayDialogFromSource !== '' && <OpenRequirementsDialog source={displayDialogFromSource} />}

        {notInstalledConnectors.length > 0 && (
          <CatalogItemList
            list={notInstalledConnectors}
            installedConnectors={false}
            setDisplayDialogFromSource={setDisplayDialogFromSource}
          />
        )}

        {installedConnectors.length > 0 && (
          <CatalogItemList
            list={installedConnectors}
            installedConnectors
            setDisplayDialogFromSource={setDisplayDialogFromSource}
          />
        )}
      </div>
    </div>
  );
};

export default Catalog;
