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
  updateComponentConfiguration,
  enableDisableComponent,
} from '../../../actions';
import {LinkButton, InfoButton} from 'components';
import {Source} from 'model';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {useTranslation} from 'react-i18next';
import {ConnectNewDialogflow} from '../Providers/Dialogflow/ConnectNewDialogflow';
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
  updateComponentConfiguration,
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
  const {connector, updateComponentConfiguration, enableDisableComponent, config} = props;
  const {channelId} = useParams();
  const [connectorInfo, setConnectorInfo] = useState<SourceInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(Pages.createUpdate);
  const [configurationModal, setConfigurationModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  const {t} = useTranslation();

  useEffect(() => {
    const sourceInfoArr = getSourcesInfo('Connectors');
    const connectorSourceInfo = sourceInfoArr.filter(item => item.type === connector);
    setConnectorInfo({...connectorSourceInfo[0]});
  }, []);

  useEffect(() => {
    if (config && connectorInfo) {
      setIsEnabled(config?.components[connectorInfo?.configKey]?.enabled);
    }
  }, [config, connectorInfo]);

  useEffect(() => {
    isEnabled
      ? setModalTitle(t('Disable') + ' ' + connectorInfo && connectorInfo?.title)
      : setModalTitle(connectorInfo && connectorInfo?.title + ' ' + t('enabled'));
  }, [isEnabled, connectorInfo]);

  //here return with connector connection to make it custimizable
  const createNewConnection = (...args: string[]) => {
    if (connector === Source.dialogflow) {
      const [projectId, appCredentials, suggestionConfidenceLevel, replyConfidenceLevel] = args;

      const payload = {
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

      updateComponentConfiguration(payload).then(() => {
        setIsEnabled(true);
        setConfigurationModal(true);
      });
    }
  };

  //here return with connector connect form to make it custimizable
  const PageContent = () => {
    if (connector === Source.dialogflow) {
      return <ConnectNewDialogflow createNewConnection={createNewConnection} />;
    }
  };

  const enableDisableComponentToggle = () => {
    setConfigurationModal(false);
    setIsEnabled(!isEnabled);
    const updatedStatus = isEnabled ? false : true;
    enableDisableComponent({components: [{name: connectorInfo && connectorInfo?.configKey, enabled: updatedStatus}]});
  };

  const closeConfigurationModal = () => {
    if (!isEnabled) enableDisableComponentToggle();
    setConfigurationModal(false);
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
                  <p>
                    {connectorInfo && connectorInfo?.description}{' '}
                    <InfoButton
                      borderOff={true}
                      color="blue"
                      link={connectorInfo && connectorInfo?.docs}
                      text={t('infoButtonText')}
                    />
                  </p>
                  <Button
                    styleVariant="normal"
                    type="submit"
                    onClick={() => setConfigurationModal(true)}
                    style={{padding: '20px 40px'}}
                  >
                    {isEnabled ? t('Disable') : t('Enable')}
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
          title={modalTitle}
          close={closeConfigurationModal}
          headerClassName={styles.headerModal}
        >
          {isEnabled && (
            <>
              <p> {t('ConfirmationDisableQuestion')} </p>

              <Button styleVariant="normal" type="submit" onClick={enableDisableComponentToggle}>
                {t('Disable')}
              </Button>
            </>
          )}
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(ConnectorConfig);
