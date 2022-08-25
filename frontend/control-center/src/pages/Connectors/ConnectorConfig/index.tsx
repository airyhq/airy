import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Link, useParams} from 'react-router-dom';
import {Button, NotificationComponent, SettingsModal, SmartButton} from 'components';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
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
import {LinkButton, InfoButton} from 'components';
import {NotificationModel, Source, ComponentInfo} from 'model';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {ConnectNewDialogflow} from '../Providers/Dialogflow/ConnectNewDialogflow';
import {ConnectNewZendesk} from '../Providers/Zendesk/ConnectNewZendesk';
import {ConnectNewSalesforce} from '../Providers/Salesforce/ConnectNewSalesforce';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';
import ConnectedChannelsList from '../ConnectedChannelsList';
import ChatPluginConnect from '../Providers/Airy/ChatPlugin/ChatPluginConnect';
import {CONNECTORS_CONNECTED_ROUTE} from '../../../routes/routes';
import FacebookConnect from '../Providers/Facebook/Messenger/FacebookConnect';
import InstagramConnect from '../Providers/Instagram/InstagramConnect';
import GoogleConnect from '../Providers/Google/GoogleConnect';
import TwilioSmsConnect from '../Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from '../Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import {getComponentStatus, removePrefix} from '../../../services';
import {DescriptionComponent, getDescriptionSourceName, getChannelAvatar} from '../../../components';
import styles from './index.module.scss';
import {RasaConnect} from '../Providers/Rasa/RasaConnect';
import {WhatsappBusinessCloudConnect} from '../Providers/WhatsappBusinessCloud/WhatsappBusinessCloudConnect';

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
    enableDisableComponent,
    updateConnectorConfiguration,
    getConnectorsConfiguration,
    listComponents,
    config,
  } = props;

  const {channelId, source} = useParams();
  const connectorConfiguration = useSelector((state: StateModel) => state.data.connector);

  const [connectorInfo, setConnectorInfo] = useState<ComponentInfo | null>(null);
  const configKey = connectorInfo && removePrefix(connectorInfo?.name);
  const [currentPage] = useState(Pages.createUpdate);
  const [configurationModal, setConfigurationModal] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(components[connectorInfo && configKey]?.enabled);
  const [isPending, setIsPending] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [backTitle, setBackTitle] = useState('Connectors');
  const [lineTitle, setLineTitle] = useState('');
  const [backRoute, setBackRoute] = useState('');
  const pageContentRef = useRef(null);
  const [offset, setOffset] = useState(pageContentRef?.current?.offsetTop);
  const {t} = useTranslation();
  const isInstalled = true;

  useLayoutEffect(() => {
    setOffset(pageContentRef?.current?.offsetTop);
    listComponents().catch((error: Error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (connectorInfo && connectorConfiguration && connectorConfiguration[connectorInfo.name]) {
      if (
        Object.entries(connectorConfiguration[connectorInfo.name]) &&
        Object.entries(connectorConfiguration[connectorInfo.name]).length > 0
      ) {
        setIsConfigured(true);
      }
    }
  }, [connectorInfo, connectorConfiguration]);

  useEffect(() => {
    getConnectorsConfiguration().catch((error: Error) => {
      console.error(error);
    });

    if (Object.entries(catalog).length > 0) {
      (connector === Source.chatPlugin || source === Source.chatPlugin) && setIsConfigured(true);

      const connectorSourceInfo = Object.entries(catalog).filter(item => {
        if (connector) {
          return item[1].source === connector;
        } else if (source) {
          return item[1].source === source;
        }
      });

      const connectorSourceInfoArr = connectorSourceInfo[0];
      const connectorSourceInfoFormatted = {name: connectorSourceInfoArr[0], ...connectorSourceInfoArr[1]};

      channelId === 'new'
        ? connector === Source.chatPlugin
          ? setLineTitle(t('create'))
          : setLineTitle(t('addChannel'))
        : setLineTitle(t('configuration'));

      source
        ? (setConnectorInfo(connectorSourceInfoFormatted), setLineTitle(t('channelsCapital')))
        : setConnectorInfo(connectorSourceInfoFormatted);

      channelId
        ? (setBackRoute(`${CONNECTORS_CONNECTED_ROUTE}/${connectorSourceInfoFormatted.source}`),
          setBackTitle(t('back')))
        : (setBackRoute('/connectors'), setBackTitle(t('Connectors')));
    }
  }, [source, Object.entries(catalog).length > 0]);

  useEffect(() => {
    if (config && connectorInfo) {
      setIsEnabled(config?.components[configKey]?.enabled);
    }
  }, [config, connectorInfo, components]);

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
            name: connectorInfo && connectorInfo.name,
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
            name: connectorInfo && connectorInfo.name,
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
            name: connectorInfo && connectorInfo.name,
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
            name: connectorInfo && connectorInfo?.name,
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
            name: connectorInfo && connectorInfo?.name,
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
      .then(() => {
        if (!isEnabled) {
          setConfigurationModal(true);
        }
      })
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const PageContent = () => {
    if (connector === Source.dialogflow) {
      return (
        <ConnectNewDialogflow
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
          isPending={isPending}
        />
      );
    }

    if (connector === Source.zendesk) {
      return (
        <ConnectNewZendesk
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
          isPending={isPending}
        />
      );
    }

    if (connector === Source.salesforce) {
      return (
        <ConnectNewSalesforce
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
          isPending={isPending}
        />
      );
    }

    if (connector === Source.rasa) {
      return (
        <RasaConnect
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
          isPending={isPending}
        />
      );
    }

    if (connector === Source.whatsapp) {
      return (
        <WhatsappBusinessCloudConnect
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
          isPending={isPending}
        />
      );
    }

    if (connector === Source.chatPlugin) {
      return <ChatPluginConnect />;
    }
    if (connector === Source.facebook) {
      return <FacebookConnect />;
    }
    if (connector === Source.instagram) {
      return <InstagramConnect />;
    }
    if (connector === Source.google) {
      return <GoogleConnect />;
    }
    if (connector === Source.twilioSMS) {
      return <TwilioSmsConnect />;
    }
    if (connector === Source.twilioWhatsApp) {
      return <TwilioWhatsappConnect />;
    }

    return <ConnectedChannelsList offset={offset} />;
  };

  const enableDisableComponentToggle = () => {
    setConfigurationModal(false);
    setIsPending(true);
    enableDisableComponent({components: [{name: configKey, enabled: !isEnabled}]})
      .then(() => {
        setNotification({
          show: true,
          successful: true,
          text: isEnabled ? t('successfullyDisabled') : t('successfullyEnabled'),
        });
      })
      .catch(() => {
        setNotification({
          show: true,
          successful: false,
          text: isEnabled ? t('failedDisabled') : t('failedEnabled'),
        });
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const closeConfigurationModal = () => {
    setConfigurationModal(false);
  };

  const openConfigurationModal = () => {
    setConfigurationModal(true);
  };

  return (
    <div className={styles.container}>
      <section className={styles.headlineContainer}>
        <div className={styles.backButtonContainer}>
          <Link to={backRoute}>
            <LinkButton type="button">
              <div className={styles.linkButtonContainer}>
                <ArrowLeftIcon className={styles.backIcon} />
                {backTitle}
              </div>
            </LinkButton>
          </Link>
        </div>

        <section className={styles.connectorDetails}>
          <div className={styles.titleIconDetails}>
            <div className={styles.textIconContainer}>
              <div
                className={`${styles.connectorIcon} ${
                  connectorInfo && connectorInfo?.displayName !== 'Dialogflow' ? styles.connectorIconOffsetTop : ''
                }`}
              >
                {connectorInfo && getChannelAvatar(connectorInfo?.displayName)}
              </div>

              <div className={styles.textContainer}>
                <div className={styles.componentTitle}>
                  <h1 className={styles.headlineText}>{connectorInfo && connectorInfo?.displayName}</h1>
                  <ConfigStatusButton
                    componentStatus={getComponentStatus(isInstalled, isConfigured, isEnabled)}
                    customStyle={styles.configStatusButton}
                  />
                </div>

                <div className={styles.textInfo}>
                  <div className={styles.descriptionDocs}>
                    {connectorInfo && (
                      <p>
                        <DescriptionComponent
                          description={getDescriptionSourceName(connectorInfo.source) + 'Description'}
                        />
                      </p>
                    )}
                    <InfoButton
                      borderOff={true}
                      color="blue"
                      link={connectorInfo && connectorInfo?.docs}
                      text={t('infoButtonText')}
                    />
                  </div>

                  {isConfigured && (
                    <SmartButton
                      title={isEnabled ? t('disableComponent') : t('enableComponent')}
                      height={40}
                      width={132}
                      pending={isPending}
                      onClick={isEnabled ? openConfigurationModal : enableDisableComponentToggle}
                      styleVariant="small"
                      type="button"
                      disabled={isPending}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <div className={styles.wrapper}>
        {connector !== Source.chatPlugin && (
          <div className={styles.channelsLineContainer}>
            <div className={styles.channelsLineItems}>
              <span className={currentPage === Pages.createUpdate ? styles.activeItem : styles.inactiveItem}>
                {lineTitle}
              </span>
            </div>
            <div className={styles.line} />
          </div>
        )}
        <div ref={pageContentRef} className={connector !== Source.chatPlugin ? styles.pageContentContainer : ''}>
          <PageContent />
        </div>
      </div>

      {notification?.show && (
        <NotificationComponent
          type="sticky"
          show={notification.show}
          successful={notification.successful}
          text={notification.text}
          setShowFalse={setNotification}
        />
      )}

      {configurationModal && (
        <SettingsModal
          Icon={!isEnabled ? <CheckmarkIcon className={styles.checkmarkIcon} /> : null}
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={
            isEnabled
              ? t('disableComponent') + ' ' + connectorInfo?.displayName
              : connectorInfo?.displayName + ' ' + t('enabledComponent')
          }
          close={closeConfigurationModal}
          headerClassName={styles.headerModal}
        >
          {isEnabled && (
            <>
              <p> {t('disableComponentText')} </p>

              <Button styleVariant="normal" type="submit" onClick={enableDisableComponentToggle}>
                {t('disableComponent')}
              </Button>
            </>
          )}
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(ConnectorConfig);
