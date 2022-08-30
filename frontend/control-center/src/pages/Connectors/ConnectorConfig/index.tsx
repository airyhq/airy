import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {StateModel} from '../../../reducers';
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
import {Source, ComponentInfo} from 'model';

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
  config: state.data.config,
  components: state.data.config.components,
  catalog: state.data.catalog,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectorConfigProps = {
  connector?: Source;
} & ConnectedProps<typeof connector>;

const ConnectorConfig = (props: ConnectorConfigProps) => {
  const {
    connector,
    components,
    catalog,
    updateConnectorConfiguration,
    getConnectorsConfiguration,
    listComponents,
    config,
  } = props;

  const connectors = useSelector((state: StateModel) => state.data.connector);
  const [connectorInfo, setConnectorInfo] = useState<ComponentInfo | null>(null);
  const componentName = connectorInfo && removePrefix(connectorInfo?.name);
  const [currentPage] = useState(Pages.createUpdate);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(components[connectorInfo && componentName]?.enabled);
  const [isPending, setIsPending] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lineTitle, setLineTitle] = useState('');

  const pageContentRef = useRef(null);
  const [offset, setOffset] = useState(pageContentRef?.current?.offsetTop);

  const {t} = useTranslation();

  const params = useParams();
  const {channelId, source} = params;
  const newChannel = params['*'] === 'new';
  const connectedParams = params['*'] === 'connected';

  const isAiryInternalConnector = source === Source.chatPlugin;
  const isCatalogList = Object.entries(catalog).length > 0;

  useLayoutEffect(() => {
    setOffset(pageContentRef?.current?.offsetTop);
    listComponents().catch((error: Error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (connectorInfo && connectors && connectors[componentName]) {
      if (Object.keys(connectors[componentName]).length > 0) {
        setIsConfigured(true);
      }
    }
  }, [connectorInfo, connectors]);

  useEffect(() => {
    getConnectorsConfiguration().catch((error: Error) => {
      console.error(error);
    });

    if (isCatalogList) {
      isAiryInternalConnector && setIsConfigured(true);

      const connectorSourceInfo = Object.entries(catalog).filter(item => item[1].source === (connector || source));

      const connectorSourceInfoArr: [string, ComponentInfo] = connectorSourceInfo[0];
      const connectorSourceInfoFormatted = {name: connectorSourceInfoArr[0], ...connectorSourceInfoArr[1]};

      const connectorHasChannels: undefined | string = connectorSourceInfoFormatted?.isChannel;

      determineLineTitle(connectorHasChannels);
      setConnectorInfo(connectorSourceInfoFormatted);
    }
  }, [source, isCatalogList, params]);

  useEffect(() => {
    if (config && connectorInfo) setIsEnabled(config?.components[componentName]?.enabled);
  }, [config, connectorInfo, components]);

  const determineLineTitle = (connectorHasChannels: undefined | string) => {
    const newAiryChatPluginPage = newChannel && connector === Source.chatPlugin;
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

  const createNewConnection = (...args: string[]) => {
    let payload: UpdateComponentConfigurationRequestPayload;
    setIsPending(true);

    if (connector === Source.dialogflow) {
      const [
        projectId,
        appCredentials,
        suggestionConfidenceLevel,
        replyConfidenceLevel,
        processorWaitingTime,
        processorCheckPeriod,
        defaultLanguage,
      ] = args;

      payload = {
        components: [
          {
            name: connectorInfo && removePrefix(connectorInfo.name),
            enabled: true,
            data: {
              projectId: projectId,
              dialogflowCredentials: appCredentials,
              suggestionConfidenceLevel: suggestionConfidenceLevel,
              replyConfidenceLevel: replyConfidenceLevel,
              connectorStoreMessagesProcessorMaxWaitMillis: processorWaitingTime,
              connectorStoreMessagesProcessorCheckPeriodMillis: processorCheckPeriod,
              connectorDefaultLanguage: defaultLanguage,
            },
          },
        ],
      };
    }

    if (connector === Source.zendesk) {
      const [domain, token, username] = args;

      payload = {
        components: [
          {
            name: connectorInfo && removePrefix(connectorInfo.name),
            enabled: true,
            data: {
              domain: domain,
              token: token,
              username: username,
            },
          },
        ],
      };
    }

    if (connector === Source.salesforce) {
      const [url, username, password, securityToken] = args;

      payload = {
        components: [
          {
            name: connectorInfo && removePrefix(connectorInfo.name),
            enabled: true,
            data: {
              url: url,
              username: username,
              password: password,
              securityToken: securityToken,
            },
          },
        ],
      };
    }

    if (connector === Source.rasa) {
      const [webhookUrl, apiHost, token] = args;

      payload = {
        components: [
          {
            name: connectorInfo && removePrefix(connectorInfo.name),
            enabled: true,
            data: {
              webhookUrl: webhookUrl,
              apiHost: apiHost,
              token: token,
            },
          },
        ],
      };
    }

    if (connector === Source.whatsapp) {
      const [appId, appSecret, phoneNumber, name, avatarUrl] = args;

      payload = {
        components: [
          {
            name: connectorInfo && removePrefix(connectorInfo.name),
            enabled: true,
            data: {
              appId: appId,
              appSecret: appSecret,
              phoneNumber: phoneNumber,
              name: name,
              avatarUrl: avatarUrl,
            },
          },
        ],
      };
    }

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
      {connector !== Source.chatPlugin && !(source === Source.chatPlugin && (newChannel || channelId)) && (
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
