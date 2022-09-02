import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {StateModel} from '../../../reducers';
import {useCurrentComponentForSource} from '../../../selectors';
import {
  connectChatPlugin,
  updateChannel,
  disconnectChannel,
  updateConnectorConfiguration,
  enableDisableComponent,
  getConnectorsConfiguration,
  listComponents,
} from '../../../actions';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';
import {Source} from 'model';

import ChatPluginConnect from '../Providers/Airy/ChatPlugin/ChatPluginConnect';
import FacebookConnect from '../Providers/Facebook/Messenger/FacebookConnect';
import InstagramConnect from '../Providers/Instagram/InstagramConnect';
import GoogleConnect from '../Providers/Google/GoogleConnect';
import TwilioSmsConnect from '../Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from '../Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import {DialogflowConnect} from '../Providers/Dialogflow/DialogflowConnect';
import {ConnectNewZendesk} from '../Providers/Zendesk/ConnectNewZendesk';
import {ConnectNewSalesforce} from '../Providers/Salesforce/ConnectNewSalesforce';
import {RasaConnect} from '../Providers/Rasa/RasaConnect';
import {WhatsappBusinessCloudConnect} from '../Providers/WhatsappBusinessCloud/WhatsappBusinessCloudConnect';

import ConnectedChannelsList from '../ConnectedChannelsList';
import {removePrefix} from '../../../services';
import styles from './index.module.scss';

export enum Pages {
  createUpdate = 'create-update',
  customization = 'customization',
  install = 'install',
}

const mapDispatchToProps = {
  connectChatPlugin,
  updateChannel,
  disconnectChannel,
  updateConnectorConfiguration,
  enableDisableComponent,
  getConnectorsConfiguration,
  listComponents,
};

const mapStateToProps = (state: StateModel) => ({
  components: state.data.config.components,
  catalog: state.data.catalog,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectorConfig = (props: ConnectedProps<typeof connector>) => {
  const {components, catalog, updateConnectorConfiguration, getConnectorsConfiguration, listComponents} = props;

  const params = useParams();
  const {channelId, source} = params;
  const newChannel = params['*'] === 'new';
  const connectedParams = params['*'] === 'connected';

  const connectors = useSelector((state: StateModel) => state.data.connector);
  const connectorInfo = useCurrentComponentForSource(source as Source);
  console.log('connectorInfo', connectorInfo);

  const [currentPage] = useState(Pages.createUpdate);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lineTitle, setLineTitle] = useState('');

  const pageContentRef = useRef(null);
  const [offset, setOffset] = useState(pageContentRef?.current?.offsetTop);

  const {t} = useTranslation();

  const isAiryInternalConnector = source === Source.chatPlugin;
  const isCatalogList = Object.entries(catalog).length > 0;

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
    if (connectorInfo) determineLineTitle(connectorInfo.isChannel);
  }, [connectorInfo]);

  useEffect(() => {
    if (connectorInfo && connectors) {
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
    if (components && connectorInfo) setIsEnabled(components[removePrefix(connectorInfo.name)]?.enabled);
  }, [connectorInfo, components]);

  const determineLineTitle = (connectorHasChannels: undefined | string) => {
    const newAiryChatPluginPage = newChannel && source === Source.chatPlugin;
    const newChannelPage = newChannel && connectorHasChannels;

    if (newAiryChatPluginPage) {
      setLineTitle(t('create'));
      return;
    }

    if (newChannelPage) {
      setLineTitle(t('addChannel'));
      return;
    }

    if (connectedParams) {
      setLineTitle(t('channelsCapital'));
      return;
    }

    setLineTitle(t('configuration'));
  };

  const createNewConnection = (configurationValues: {[key: string]: string}) => {
    setIsPending(true);

    const payload: UpdateComponentConfigurationRequestPayload = {
      components: [
        {
          name: connectorInfo && removePrefix(connectorInfo.name),
          enabled: true,
          data: configurationValues,
        },
      ],
    };

    updateConnectorConfiguration(payload)
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const PageContent = () => {
    if (newChannel || channelId) {
      if (source === Source.dialogflow) {
        return (
          <DialogflowConnect
            createNewConnection={createNewConnection}
            isEnabled={isEnabled}
            isConfigured={isConfigured}
            isPending={isPending}
          />
        );
      }

      if (source === Source.zendesk) {
        return (
          <ConnectNewZendesk
            createNewConnection={createNewConnection}
            isEnabled={isEnabled}
            isConfigured={isConfigured}
            isPending={isPending}
          />
        );
      }

      if (source === Source.salesforce) {
        return (
          <ConnectNewSalesforce
            createNewConnection={createNewConnection}
            isEnabled={isEnabled}
            isConfigured={isConfigured}
            isPending={isPending}
          />
        );
      }

      if (source === Source.rasa) {
        return (
          <RasaConnect
            createNewConnection={createNewConnection}
            isEnabled={isEnabled}
            isConfigured={isConfigured}
            isPending={isPending}
          />
        );
      }

      if (source === Source.whatsapp) {
        return (
          <WhatsappBusinessCloudConnect
            createNewConnection={createNewConnection}
            isEnabled={isEnabled}
            isConfigured={isConfigured}
            isPending={isPending}
          />
        );
      }

      if (source === Source.chatPlugin) {
        return <ChatPluginConnect />;
      }
      if (source === Source.facebook) {
        return <FacebookConnect />;
      }
      if (source === Source.instagram) {
        return <InstagramConnect />;
      }
      if (source === Source.google) {
        return <GoogleConnect />;
      }
      if (source === Source.twilioSMS) {
        return <TwilioSmsConnect />;
      }
      if (source === Source.twilioWhatsApp) {
        return <TwilioWhatsappConnect />;
      }

      if (source === Source.viber) {
        return <p>configuration page under construction - coming soon!</p>;
      }
    }

    return <ConnectedChannelsList offset={offset} />;
  };

  return (
    <>
      {!(source === Source.chatPlugin && (newChannel || channelId)) && (
        <div className={styles.channelsLineContainer}>
          <div className={styles.channelsLineItems}>
            <span className={currentPage === Pages.createUpdate ? styles.activeItem : styles.inactiveItem}>
              {lineTitle}
            </span>
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
