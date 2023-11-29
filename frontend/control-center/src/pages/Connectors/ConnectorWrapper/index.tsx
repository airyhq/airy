import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Link, useParams} from 'react-router-dom';
import {Button, NotificationComponent, SettingsModal, SmartButton} from 'components';
import {StateModel} from '../../../reducers';
import {enableDisableComponent, getConnectorsConfiguration, listComponents} from '../../../actions';
import {LinkButton, InfoButton} from 'components';
import {NotificationModel, Source, ComponentInfo, Channel} from 'model';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {getComponentStatus} from '../../../services';
import {DescriptionComponent, getDescriptionSourceName, getChannelAvatar} from '../../../components';
import {CONNECTORS_ROUTE} from '../../../routes/routes';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import styles from './index.module.scss';
import {allChannelsConnected} from '../../../selectors';

const mapDispatchToProps = {
  enableDisableComponent,
  getConnectorsConfiguration,
  listComponents,
};

const mapStateToProps = (state: StateModel) => ({
  config: state.data.config,
  components: state.data.config.components,
  catalog: state.data.catalog,
  connectors: state.data.connector,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectorWrapperProps = {
  Outlet: React.ReactElement | null;
} & ConnectedProps<typeof connector>;

const ConnectorWrapper = (props: ConnectorWrapperProps) => {
  const {
    components,
    catalog,
    connectors,
    enableDisableComponent,
    getConnectorsConfiguration,
    listComponents,
    config,
    Outlet,
  } = props;

  const [connectorInfo, setConnectorInfo] = useState<ComponentInfo | null>(null);
  const componentName = connectorInfo?.name;
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel?.source === Source);
  const [configurationModal, setConfigurationModal] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(components[connectorInfo && componentName]?.enabled);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(components[connectorInfo && componentName]?.healthy);
  const [isPending, setIsPending] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [backTitle, setBackTitle] = useState('Connectors');
  const [backRoute, setBackRoute] = useState('');

  const {t} = useTranslation();

  const params = useParams();
  const {channelId, source} = params;
  const newChannel = params['*'] === 'new';

  const isInstalled = true;
  const isAiryInternalConnector = source === Source.chatPlugin;
  const isCatalogList = Object.entries(catalog).length > 0;
  const CONNECTOR_CONNECTED_ROUTE = `${CONNECTORS_ROUTE}/${source}/connected`;

  useEffect(() => {
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

      const connectorSourceInfo: [string, ComponentInfo][] = Object.entries(catalog).filter(
        item => item[1].source === source
      );

      const connectorSourceInfoArr: [string, ComponentInfo] = connectorSourceInfo[0];
      const connectorSourceInfoFormatted = connectorSourceInfoArr && {
        name: connectorSourceInfoArr[0],
        ...connectorSourceInfoArr[1],
      };

      const connectorHasChannels = connectorSourceInfoFormatted?.isChannel;

      determineBackRoute(channelId, newChannel, connectorHasChannels);

      setConnectorInfo(connectorSourceInfoFormatted);
    }
  }, [params, source, channelId, isCatalogList]);

  useEffect(() => {
    if (config && connectorInfo) {
      setIsEnabled(config?.components[componentName]?.enabled);
      setIsHealthy(config?.components[componentName]?.healthy);
    }
  }, [config, connectorInfo, components]);

  const determineBackRoute = (channelId: string, newChannel: boolean, connectorHasChannels: string | undefined) => {
    const channelRoute =
      (channelId || newChannel) && connectorHasChannels && channelsBySource(connectorInfo?.source).length > 0;

    if (channelRoute) {
      setBackRoute(CONNECTOR_CONNECTED_ROUTE);
      setBackTitle(t('back'));
    } else {
      setBackRoute(CONNECTORS_ROUTE);
      setBackTitle(t('Connectors'));
    }
  };

  const enableDisableComponentToggle = () => {
    setConfigurationModal(false);
    setIsPending(true);
    enableDisableComponent({components: [{name: componentName, enabled: !isEnabled}]})
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

  const closeConfigurationModal = () => setConfigurationModal(false);

  const openConfigurationModal = () => setConfigurationModal(true);

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
              <div className={styles.connectorIcon}>
                {connectorInfo && getChannelAvatar(connectorInfo?.displayName)}
              </div>

              <div className={styles.textContainer}>
                <div className={styles.componentTitle}>
                  <h1 className={styles.headlineText}>{connectorInfo && connectorInfo?.displayName}</h1>
                  <ConfigStatusButton
                    // REMOVE THIS. TEMPORARY FIX FOR LLM CONNECTOR
                    componentStatus={
                      connectorInfo?.name === 'llm-connector'
                        ? getComponentStatus(isHealthy, isInstalled, isConfigured, isEnabled)
                        : getComponentStatus(true, true, true, true)
                    }
                    customStyle={styles.configStatusButton}
                  />
                </div>

                <div className={styles.textInfo}>
                  <div className={styles.descriptionDocs}>
                    {connectorInfo && (
                      <p>
                        <DescriptionComponent source={getDescriptionSourceName(connectorInfo.source)} />
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
                      // REMOVE THIS. TEMPORARY FIX FOR LLM CONNECTOR
                      title={
                        connectorInfo?.name !== 'llm-connector'
                          ? t('disableComponent')
                          : isEnabled
                          ? t('disableComponent')
                          : t('enableComponent')
                      }
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

      {notification?.show && (
        <NotificationComponent
          type="sticky"
          show={notification.show}
          successful={notification.successful}
          text={notification.text}
          setShowFalse={setNotification}
        />
      )}

      <div className={styles.wrapper}>{Outlet}</div>

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

export default connector(ConnectorWrapper);
