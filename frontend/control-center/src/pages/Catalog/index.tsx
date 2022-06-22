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
import {Source, getSourceForComponent} from 'model';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';


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

      const isComponentInstalled = (elem:SourceInfo) =>
        installedList.includes(elem.type) ||
        (elem.type === Source.instagram && installedList.includes('facebook')) ||
        elem.type === Source.twilioWhatsApp ||
        (Source.twilioSMS && installedList.includes('twilio'));

      const installedComponents = sourcesInfosClone.filter((elem:SourceInfo) => isComponentInstalled(elem));
      const notInstalledComponents = sourcesInfosClone.filter((elem:SourceInfo) => !isComponentInstalled(elem));

      setInstalledConnectors(installedComponents);
      setNotInstalledConnectors(notInstalledComponents);
    }
  }, [sourcesInfo, connectors]);


  //mock of the installed / uninstalled components list update 
  const updateItemList = (installed: boolean, type: Source) => {
    if(!installed){
      const updatedInstalledList = installedConnectors.filter((elem:SourceInfo) => {
        if(elem.type === type) setNotInstalledConnectors(prevState => [...prevState, elem])
        return elem.type !== type
      });
      setInstalledConnectors(updatedInstalledList)
    }

    if(installed){
      const updatedNotInstalledList = notInstalledConnectors.filter((elem:SourceInfo) => {
        if(elem.type === type) setInstalledConnectors(prevState => [...prevState, elem])
        return elem.type !== type
      });
      setNotInstalledConnectors(updatedNotInstalledList)
    }
  }


  //should we keep this?
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
            updateItemList={updateItemList}
          />
        )}

        {installedConnectors.length > 0 && (
          <CatalogItemList
            list={installedConnectors}
            installedConnectors
            setDisplayDialogFromSource={setDisplayDialogFromSource}
            updateItemList={updateItemList}
          />
        )}
      </div>
    </div>
  );
};

export default Catalog;
