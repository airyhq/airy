import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {StateModel} from '../../reducers';
import {useSelector} from 'react-redux';
import {allChannelsConnected} from '../../selectors/channels';
import {FacebookMessengerRequirementsDialog} from '../Connectors/Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {GoogleBusinessMessagesRequirementsDialog} from '../Connectors/Providers/Google/GoogleBusinessMessagesRequirementsDialog';
import {TwilioRequirementsDialog} from '../Connectors/Providers/Twilio/TwilioRequirementsDialog';
import {InstagramRequirementsDialog} from '../Connectors/Providers/Instagram/InstagramRequirementsDialog';
import {setPageTitle} from '../../services/pageTitle';
import {CatalogItemList} from './CatalogItemList';
import {Channel, Source, getSourceForComponent} from 'model';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';

const Catalog = () => {
  const connectors = useSelector((state: StateModel) => state.data.config.components);
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');
  const [notInstalledConnectors, setNotInstalledConnectors] = useState([]);
  const [installedConnectors, setInstalledConnectors] = useState([]);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const pageTitle = 'Catalog';

  console.log('connectors', connectors);

  useEffect(() => {
    setPageTitle(pageTitle);
    setSourcesInfo(getSourcesInfo(pageTitle));
  }, []);

  useEffect(() => {
    console.log('sourcesInfo', sourcesInfo);
  }, [sourcesInfo])

  useEffect(() => {
    console.log('installedConnectors', installedConnectors);
  }, [installedConnectors])

  useEffect(() => {
    console.log('notInstalledConnectors', notInstalledConnectors);
  }, [notInstalledConnectors])


  useEffect(() => {
    if(sourcesInfo.length > 0){
      console.log('entries',Object.entries(connectors))

      const installedList = []
  
      let nonInstalledComponents = [...sourcesInfo];
      console.log('before', nonInstalledComponents);
  
      const getInstalledComponents = () => {
       Object.entries(connectors).filter(elem => {
        if(getSourceForComponent(elem[0])){
            const index = nonInstalledComponents.findIndex(obj => obj.type === getSourceForComponent(elem[0]));
            //console.log('index', index, getSourceForComponent(elem[0]));
            if(index !== -1){
              nonInstalledComponents.splice(index)
              installedList.push(nonInstalledComponents[index])
            } 

            
        }
        return getSourceForComponent(elem[0])
      });

      setInstalledConnectors(installedList)
    }

    getInstalledComponents()

    setNotInstalledConnectors(nonInstalledComponents)
  
    }
  }, [connectors, sourcesInfo]);

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

  //const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);

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
