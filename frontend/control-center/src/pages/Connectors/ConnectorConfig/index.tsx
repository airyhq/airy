import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {getSourcesInfo, SourceInfo} from '../../../components/SourceInfo';
import {Button, NotificationComponent, SettingsModal} from 'components';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {StateModel} from '../../../reducers';
import {
  connectChatPlugin,
  updateChannel,
  disconnectChannel,
  updateConnectorConfiguration,
  enableDisableComponent,
  getConnectorsConfiguration,
} from '../../../actions';
import {LinkButton, InfoButton} from 'components';
import {NotificationModel, Source} from 'model';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {useTranslation} from 'react-i18next';
import {ConnectNewDialogflow} from '../Providers/Dialogflow/ConnectNewDialogflow';
import {ConnectNewZendesk} from '../Providers/Zendesk/ConnectNewZendesk';
import {ConnectNewSalesforce} from '../Providers/Salesforce/ConnectNewSalesforce';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';
import styles from './index.module.scss';
import ConnectedChannelsList from '../ConnectedChannelsList';
import ChatPluginConnect from '../Providers/Airy/ChatPlugin/ChatPluginConnect';
import {CONNECTORS_CONNECTED_ROUTE} from '../../../routes/routes';
import FacebookConnect from '../Providers/Facebook/Messenger/FacebookConnect';
import InstagramConnect from '../Providers/Instagram/InstagramConnect';
import GoogleConnect from '../Providers/Google/GoogleConnect';
import TwilioSmsConnect from '../Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from '../Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import {getComponentStatus} from '../../../services/getComponentStatus';

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
};

const mapStateToProps = (state: StateModel) => ({
  config: state.data.config,
  components: state.data.config.components,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectorConfigProps = {
  connector?: Source;
} & ConnectedProps<typeof connector>;

const ConnectorConfig = (props: ConnectorConfigProps) => {
  const {
    connector,
    components,
    enableDisableComponent,
    updateConnectorConfiguration,
    getConnectorsConfiguration,
    config,
  } = props;

  const {channelId, source} = useParams();
  const connectorConfiguration = useSelector((state: StateModel) => state.data.connector);
  const [connectorInfo, setConnectorInfo] = useState<SourceInfo | null>(null);
  const [currentPage] = useState(Pages.createUpdate);
  const [configurationModal, setConfigurationModal] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(components[connectorInfo?.componentName]?.enabled);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lineTitle, setLineTitle] = useState('');
  const [backTitle, setBackTitle] = useState('Connectors');
  const [backRoute, setBackRoute] = useState('');
  const {t} = useTranslation();
  const isInstalled = true;

  useEffect(() => {
    if (connectorInfo && connectorConfiguration && connectorConfiguration[connectorInfo.componentName]) {
      if (
        Object.entries(connectorConfiguration[connectorInfo.componentName]) &&
        Object.entries(connectorConfiguration[connectorInfo.componentName]).length > 0
      ) {
        setIsConfigured(true);
      }
    }
  }, [connectorInfo, connectorConfiguration]);

  useEffect(() => {
    getConnectorsConfiguration();
    (source === Source.chatPlugin || connector === Source.chatPlugin) && setIsConfigured(true);
    const sourceInfoArr = getSourcesInfo();
    const connectorSourceInfo = sourceInfoArr.filter(item => item.type === connector);

    channelId === 'new'
      ? connector === Source.chatPlugin
        ? setLineTitle(t('Create'))
        : setLineTitle(t('addChannel'))
      : setLineTitle(t('Configuration'));

    source
      ? (setConnectorInfo(sourceInfoArr.filter(item => item.type === source)[0]), setLineTitle(t('channelsCapital')))
      : setConnectorInfo(connectorSourceInfo[0]);

    channelId
      ? (setBackRoute(`${CONNECTORS_CONNECTED_ROUTE}/${connectorSourceInfo[0].type}`), setBackTitle(t('back')))
      : (setBackRoute('/connectors'), setBackTitle(t('Connectors')));
  }, [source]);

  useEffect(() => {
    if (config && connectorInfo) {
      setIsEnabled(config?.components[connectorInfo?.configKey]?.enabled);
    }
  }, [config, connectorInfo]);

  const createNewConnection = (...args: string[]) => {
    let payload: UpdateComponentConfigurationRequestPayload;

    if (connector === Source.dialogflow) {
      const [projectId, appCredentials, suggestionConfidenceLevel, replyConfidenceLevel] = args;

      payload = {
        components: [
          {
            name: connectorInfo && connectorInfo?.configKey,
            enabled: true,
            data: {
              projectId: projectId,
              dialogflowCredentials: appCredentials,
              suggestionConfidenceLevel: suggestionConfidenceLevel,
              replyConfidenceLevel: replyConfidenceLevel,
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
            name: connectorInfo && connectorInfo?.configKey,
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
            name: connectorInfo && connectorInfo?.configKey,
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

    updateConnectorConfiguration(payload).then(() => {
      if (!isEnabled) {
        setConfigurationModal(true);
      }
    });
  };

  const PageContent = () => {
    if (connector === Source.dialogflow) {
      return (
        <ConnectNewDialogflow
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
        />
      );
    }

    if (connector === Source.zendesk) {
      return (
        <ConnectNewZendesk
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
        />
      );
    }

    if (connector === Source.salesforce) {
      return (
        <ConnectNewSalesforce
          createNewConnection={createNewConnection}
          isEnabled={isEnabled}
          isConfigured={isConfigured}
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

    return <ConnectedChannelsList />;
  };

  const enableDisableComponentToggle = () => {
    setConfigurationModal(false);
    enableDisableComponent({components: [{name: connectorInfo && connectorInfo?.configKey, enabled: !isEnabled}]})
      .then(() => {
        setIsEnabled(!isEnabled);
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
      });
  };

  const closeConfigurationModal = () => {
    setConfigurationModal(false);
    if (!isEnabled) {
      enableDisableComponent({components: [{name: connectorInfo && connectorInfo?.configKey, enabled: true}]})
        .then(() => {
          setIsEnabled(true);
          setNotification({
            show: true,
            successful: true,
            text: t('successfullyEnabled'),
          });
        })
        .catch(() => {
          setNotification({
            show: true,
            successful: false,
            text: t('failedEnabled'),
          });
        });
    }
  };

  const openModal = () => {
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
                  connectorInfo && connectorInfo?.title !== 'Dialogflow' ? styles.connectorIconOffsetTop : ''
                }`}
              >
                {connectorInfo && connectorInfo?.image}
              </div>

              <div className={styles.textContainer}>
                <div className={styles.componentTitle}>
                  <h1 className={styles.headlineText}>{connectorInfo && connectorInfo?.title}</h1>
                  <ConfigStatusButton
                    componentStatus={getComponentStatus(isInstalled, isConfigured, isEnabled)}
                    customStyle={styles.configStatusButton}
                  />
                </div>

                <div className={styles.textInfo}>
                  <div className={styles.descriptionDocs}>
                    {connectorInfo && <p>{connectorInfo?.description}</p>}
                    <InfoButton
                      borderOff={true}
                      color="blue"
                      link={connectorInfo && connectorInfo?.docs}
                      text={t('infoButtonText')}
                    />
                  </div>

                  {isConfigured && (
                    <Button
                      styleVariant="small"
                      type="button"
                      onClick={openModal}
                      style={{padding: '20px 40px', marginTop: '-12px'}}
                    >
                      {isEnabled ? t('disableComponent') : t('Enable')}
                    </Button>
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
        <div className={connector !== Source.chatPlugin ? styles.pageContentContainer : ''}>
          <PageContent />
        </div>
      </div>

      {notification?.show && (
        <NotificationComponent
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
            isEnabled ? t('disableComponent') + ' ' + connectorInfo?.title : connectorInfo?.title + ' ' + t('enabled')
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
