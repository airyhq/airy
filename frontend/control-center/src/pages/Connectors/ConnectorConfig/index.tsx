import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {getSourcesInfo, SourceInfo} from '../../../components/SourceInfo';
import {Button, SettingsModal} from 'components';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {StateModel} from '../../../reducers';
import {
  connectChatPlugin,
  updateChannel,
  disconnectChannel,
  updateConnectorConfiguration,
  enableDisableComponent,
} from '../../../actions';
import {LinkButton, InfoButton} from 'components';
import {Source} from 'model';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {useTranslation} from 'react-i18next';
import {ConnectNewDialogflow} from '../Providers/Dialogflow/ConnectNewDialogflow';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';
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
};

const mapStateToProps = (state: StateModel) => ({
  config: state.data.config,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectorConfigProps = {
  connector: Source;
} & ConnectedProps<typeof connector>;

const ConnectorConfig = (props: ConnectorConfigProps) => {
  const {connector, enableDisableComponent, updateConnectorConfiguration, config} = props;
  const {channelId} = useParams();
  const [connectorInfo, setConnectorInfo] = useState<SourceInfo | null>(null);
  const [currentPage] = useState(Pages.createUpdate);
  const [configurationModal, setConfigurationModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  const {t} = useTranslation();

  useEffect(() => {
    const sourceInfoArr = getSourcesInfo();
    const connectorSourceInfo = sourceInfoArr.filter(item => item.type === connector);
    setConnectorInfo({...connectorSourceInfo[0]});
  }, []);

  useEffect(() => {
    if (config && connectorInfo) {
      setIsEnabled(config?.components[connectorInfo?.configKey]?.enabled);
    }
  }, [config, connectorInfo]);

  //the component is customizable: return in this function the connection for each connector
  const createNewConnection = (...args: string[]) => {
    if (connector === Source.dialogflow) {
      const [projectId, appCredentials, suggestionConfidenceLevel, replyConfidenceLevel] = args;

      const payload: UpdateComponentConfigurationRequestPayload = {
        components: [
          {
            name: connectorInfo && connectorInfo?.configKey,
            enabled: true,
            data: {
              project_id: projectId,
              dialogflow_credentials: appCredentials,
              suggestion_confidence_level: suggestionConfidenceLevel,
              reply_confidence_level: replyConfidenceLevel,
            },
          },
        ],
      };

      updateConnectorConfiguration(payload).then(() => {
        if (!isEnabled) {
          setConfigurationModal(true);
        }
      });
    }
  };

  //the component is customizable: return in this function the connect form of each connector
  const PageContent = () => {
    if (connector === Source.dialogflow) {
      return <ConnectNewDialogflow createNewConnection={createNewConnection} isEnabled={isEnabled} />;
    }
  };

  const enableDisableComponentToggle = () => {
    setConfigurationModal(false);
    setIsEnabled(!isEnabled);
    enableDisableComponent({components: [{name: connectorInfo && connectorInfo?.configKey, enabled: !isEnabled}]});
  };

  const closeConfigurationModal = () => {
    setConfigurationModal(false);
    if (!isEnabled) {
      enableDisableComponent({components: [{name: connectorInfo && connectorInfo?.configKey, enabled: true}]});
      setIsEnabled(true);
    }
  };

  const openModal = () => {
    setConfigurationModal(true);
  };

  return (
    <div className={styles.container}>
      <section className={styles.headlineContainer}>
        <div className={styles.backButtonContainer}>
          <Link to="/connectors">
            <LinkButton type="button">
              <div className={styles.linkButtonContainer}>
                <ArrowLeftIcon className={styles.backIcon} />
                {t('Connectors')}
              </div>
            </LinkButton>
          </Link>
        </div>

        <section className={styles.connectorDetails}>
          <div className={styles.titleIconDetails}>
            <div className={styles.textIconContainer}>
              <div className={styles.connectorIcon}>{connectorInfo && connectorInfo?.image}</div>

              <div className={styles.textContainer}>
                <h1 className={styles.headlineText}>{connectorInfo && connectorInfo?.title}</h1>

                <div className={styles.textInfo}>
                  <div className={styles.descriptionDocs}>
                    {connectorInfo && connectorInfo?.description}{' '}
                    <InfoButton
                      borderOff={true}
                      color="blue"
                      link={connectorInfo && connectorInfo?.docs}
                      text={t('infoButtonText')}
                    />
                  </div>
                  <Button
                    styleVariant="small"
                    type="button"
                    onClick={openModal}
                    style={{padding: '20px 40px', marginTop: '-12px'}}
                  >
                    {isEnabled ? t('disableComponent') : t('Enable')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <div className={styles.wrapper}>
        <div className={styles.channelsLineContainer}>
          <div className={styles.channelsLineItems}>
            <span className={currentPage === Pages.createUpdate ? styles.activeItem : styles.inactiveItem}>
              {channelId === 'new' ? t('Enable') : t('Configuration')}
            </span>
          </div>
          <div className={styles.line} />
        </div>
        <div style={{paddingTop: '28px', paddingLeft: '32px'}}>
          <PageContent />
        </div>
      </div>

      {configurationModal && (
        <SettingsModal
          Icon={!isEnabled ? (CheckmarkIcon as React.ElementType) : null}
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
