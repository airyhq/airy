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
import {TabPanel, ContentWrapper} from 'components';
import {listComponents} from '../../actions/catalog';
import {removePrefix} from '../../services';
import styles from './index.module.scss';

const mapDispatchToProps = {
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {listComponents} = props;
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');
  const [notInstalledConnectors, setNotInstalledConnectors] = useState([]);
  const [installedConnectors, setInstalledConnectors] = useState([]);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const [isInstallToggled, setIsInstalledToggled] = useState(false);
  const pageTitle = 'Catalog';

  useEffect(() => {
    listComponents();
    setPageTitle(pageTitle);
    setSourcesInfo(getSourcesInfo());
  }, []);

  useEffect(() => {
    if (sourcesInfo.length > 0 && !isInstallToggled) {
      let installedComponents = [];
      let uninstalledComponents = [];

      Object.entries(catalogList).filter((componentElem: [string, {repository: string; installed: boolean}]) => {
        if (componentElem[1].installed === true) {
          installedComponents = installedComponents.concat(findComponent(removePrefix(componentElem[0])));
        }

        if (componentElem[1].installed === false) {
          uninstalledComponents = uninstalledComponents.concat(findComponent(removePrefix(componentElem[0])));
        }
      });

      setInstalledConnectors(installedComponents);
      setNotInstalledConnectors(uninstalledComponents);
    }
  }, [sourcesInfo, catalogList, isInstallToggled]);

  const findComponent = (name: string) => {
    return sourcesInfo.filter((elem: SourceInfo) => elem.componentName === name);
  };

  const updateItemList = (installed: boolean, componentName: string) => {
    if (!installed) {
      const updatedInstalledList = installedConnectors.filter(
        (elem: SourceInfo) => elem.componentName !== componentName
      );
      const updatedNotInstalledList = notInstalledConnectors.concat(findComponent(componentName));

      setInstalledConnectors(updatedInstalledList);
      setNotInstalledConnectors(updatedNotInstalledList);
    }

    if (installed) {
      const updatedNotInstalledList = notInstalledConnectors.filter(
        (elem: SourceInfo) => elem.componentName !== componentName
      );
      const updatedInstalledList = installedConnectors.concat(findComponent(componentName));

      setNotInstalledConnectors(updatedNotInstalledList);
      setInstalledConnectors(updatedInstalledList);
    }
  };

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

  const InstalledComponents = () => {
    return (
      <CatalogItemList
        list={installedConnectors}
        installedConnectors
        setDisplayDialogFromSource={setDisplayDialogFromSource}
        updateItemList={updateItemList}
        setIsInstalledToggled={setIsInstalledToggled}
      />
    );
  };

  const UnInstalledComponents = () => {
    return (
      <CatalogItemList
        list={notInstalledConnectors}
        installedConnectors={false}
        setDisplayDialogFromSource={setDisplayDialogFromSource}
        updateItemList={updateItemList}
        setIsInstalledToggled={setIsInstalledToggled}
      />
    );
  };

  //{notInstalledConnectors.length === 0 && installedConnectors.length === 0 && <SimpleLoader />}

  return (
    <ContentWrapper
      transparent={true}
      header={
        <div className={styles.catalogHeadline}>
            <h1 className={styles.catalogHeadlineText}>Catalog</h1>
        </div>
      }
      content={
        <div className={styles.catalogWrapper}>
          <div className={styles.listWrapper}>
            {displayDialogFromSource !== '' && <OpenRequirementsDialog source={displayDialogFromSource} />}

            <TabPanel
              pageTitleOne="Not Installed"
              pageTitleTwo="Installed"
              PageContentOne={<UnInstalledComponents />}
              PageContentTwo={InstalledComponents}
            />
          </div>
        </div>
      }></ContentWrapper>
  );
};

export default connector(Catalog);
