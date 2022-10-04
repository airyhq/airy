import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {StateModel} from '../../../reducers';
import {useCurrentComponentForSource} from '../../../selectors';
import {getConnectorsConfiguration, listComponents} from '../../../actions';
import {Source} from 'model';
import ChatPluginConnect from '../Providers/Airy/ChatPlugin/ChatPluginConnect';
import FacebookConnect from '../Providers/Facebook/Messenger/FacebookConnect';
import InstagramConnect from '../Providers/Instagram/InstagramConnect';
import GoogleConnect from '../Providers/Google/GoogleConnect';
import TwilioSmsConnect from '../Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from '../Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import ConnectedChannelsList from '../ConnectedChannelsList';
import {removePrefix} from '../../../services';
import styles from './index.module.scss';
import ConfigureConnector from '../ConfigureConnector';
import {CONNECTORS_ROUTE} from '../../../routes/routes';
import WhatsappConnect from '../Providers/WhatsappBusinessCloud/WhatsappConnect';
import ViberConnect from '../Providers/Viber/ViberConnect';

const mapDispatchToProps = {
  getConnectorsConfiguration,
  listComponents,
};

const mapStateToProps = (state: StateModel) => ({
  components: state.data.config.components,
  catalog: state.data.catalog,
  connectors: state.data.connector,
});

type LocationState = {
  from: string;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectorConfig = (props: ConnectedProps<typeof connector>) => {
  const {components, catalog, connectors, getConnectorsConfiguration, listComponents} = props;

  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {channelId, source} = params;
  const newChannel = params['*'] === 'new';
  const connectedChannels = params['*'] === 'connected';
  const configurePath = params['*'] === 'configure';
  const connectorInfo = useCurrentComponentForSource(source as Source);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lineTitle, setLineTitle] = useState('');
  const [lineTitleRoute, setLineTitleRoute] = useState('');
  const configValues = connectorInfo.source === source && connectorInfo.configurationValues;
  const parsedConfigValues = configValues && JSON.parse(configValues);
  const pageContentRef = useRef(null);
  const [offset, setOffset] = useState(pageContentRef?.current?.offsetTop);
  const {t} = useTranslation();
  const isAiryInternalConnector = source === Source.chatPlugin;
  const isCatalogList = Object.entries(catalog).length > 0;
  const previousPath = (location.state as LocationState)?.from;
  const currentPath = params['*'];
  const navigateNew = `${CONNECTORS_ROUTE}/${source}/new`;
  const navigateConnected = `${CONNECTORS_ROUTE}/${source}/connected`;
  const navigateConfigure = `${CONNECTORS_ROUTE}/${source}/configure`;
  const navigateChannelId = `${CONNECTORS_ROUTE}/${source}/${channelId || previousPath}`;
  const notConfigured = previousPath === 'connectors' || previousPath === 'status' || previousPath === 'catalog';

  useLayoutEffect(() => {
    setOffset(pageContentRef?.current?.offsetTop);
    listComponents().catch((error: Error) => {
      console.error(error);
    });
    getConnectorsConfiguration().catch((error: Error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (connectorInfo) determineLineTitle();
  }, [connectorInfo]);

  useEffect(() => {
    if (connectors && connectorInfo && connectorInfo?.name) {
      const connectorName = removePrefix(connectorInfo.name);
      if (connectors[connectorName] && Object.keys(connectors[connectorName]).length > 0) {
        setIsConfigured(true);
      }
    }
  }, [connectorInfo, connectors]);

  useEffect(() => {
    if (isCatalogList) isAiryInternalConnector && setIsConfigured(true);
  }, [isCatalogList]);

  useEffect(() => {
    if (components && connectorInfo && connectorInfo?.name)
      setIsEnabled(components[removePrefix(connectorInfo.name)]?.enabled);
  }, [connectorInfo, components]);

  const determineLineTitle = () => {
    const newAiryChatPluginPage = newChannel && source === Source.chatPlugin;

    if (channelId || previousPath?.includes('-')) {
      setLineTitle(t('update'));
      setLineTitleRoute(navigateChannelId);
      return;
    }

    if (newAiryChatPluginPage) {
      setLineTitle(t('create'));
      return;
    }

    if (newChannel || previousPath === 'new') {
      setLineTitle(t('addChannel'));
      setLineTitleRoute(navigateNew);
      return;
    }

    if (connectedChannels || previousPath === 'connected') {
      setLineTitle(t('channelsCapital'));
      setLineTitleRoute(navigateConnected);
      return;
    }

    if (configurePath) {
      setLineTitle(t('configuration'));
      return;
    }
  };

  const PageContent = () => {
    if (configurePath) {
      return (
        <ConfigureConnector
          componentName={connectorInfo.name}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
          configValues={parsedConfigValues}
          source={connectorInfo.source}
        />
      );
    }

    if (channelId || newChannel) {
      if (source === Source.chatPlugin) return <ChatPluginConnect />;
      if (source === Source.facebook) return <FacebookConnect />;
      if (source === Source.instagram) return <InstagramConnect />;
      if (source === Source.google) return <GoogleConnect />;
      if (source === Source.whatsapp) return <WhatsappConnect />;
      if (source === Source.twilioSMS) return <TwilioSmsConnect />;
      if (source === Source.twilioWhatsApp) return <TwilioWhatsappConnect />;
      if (source === Source.viber) return <ViberConnect />;
    }

    return <ConnectedChannelsList offset={offset} />;
  };

  return (
    <>
      {!(source === Source.chatPlugin && (newChannel || channelId)) && (
        <div className={styles.channelsLineContainer}>
          <div className={styles.channelsLineItems}>
            {!notConfigured && (
              <span
                className={
                  connectedChannels || newChannel || channelId || (configurePath && !previousPath)
                    ? styles.activeItem
                    : styles.inactiveItem
                }
                onClick={() => previousPath && navigate(lineTitleRoute, {state: {from: currentPath}})}
              >
                {lineTitle}
              </span>
            )}
            {((source !== Source.chatPlugin && connectorInfo.isChannel) || notConfigured) && (
              <span
                className={configurePath ? styles.activeItem : styles.inactiveItem}
                onClick={() => !configurePath && navigate(navigateConfigure, {state: {from: currentPath}})}
              >
                {t('configuration')}
              </span>
            )}
          </div>
          <div className={styles.line} />
        </div>
      )}
      <div
        ref={pageContentRef}
        className={!(source == Source.chatPlugin && (newChannel || channelId)) ? styles.pageContentContainer : ''}
      >
        <PageContent />
      </div>
    </>
  );
};

export default connector(ConnectorConfig);
