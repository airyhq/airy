import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {getSourcesInfo, SourceInfo} from '../../../components/SourceInfo';
import {Button, SettingsModal} from 'components';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';

import {apiHostUrl} from '../../../httpClient';
import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';
import {
  connectChatPlugin,
  updateChannel,
  disconnectChannel,
  updateComponentConfiguration,
  enableDisableComponent,
} from '../../../actions';

import {LinkButton, InfoButton} from 'components';
import {Channel, Source} from 'model';

import {ConnectNewChatPlugin} from '../Providers/Airy/ChatPlugin/sections/ConnectNewChatPlugin';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyAvatar.svg';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';

import styles from './index.module.scss';

import {CONNECTORS_CHAT_PLUGIN_ROUTE, CATALOG_CHAT_PLUGIN_ROUTE} from '../../../routes/routes';
import {useTranslation} from 'react-i18next';
import CreateUpdateSection from '../Providers/Airy/ChatPlugin/sections/CreateUpdateSection/CreateUpdateSection';
import {CustomiseSection} from '../Providers/Airy/ChatPlugin/sections/CustomiseSection/CustomiseSection';
import {InstallSection} from '../Providers/Airy/ChatPlugin/sections/InstallSection/InstallSection';
import {ConnectNewDialogflow} from '../Providers/Dialogflow/ConnectNewDialogflow';
import {ChatpluginConfig, DefaultConfig} from 'model';

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
  channels: Object.values(allChannels(state)),
  config: state.data.config,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConnectorConfigProps = {
  connector: Source;
} & ConnectedProps<typeof connector>;

const ConnectorConfig = (props: ConnectorConfigProps) => {
  const {connector, connectChatPlugin, updateComponentConfiguration, enableDisableComponent, config} = props;
  const {channelId} = useParams();
  const currentChannel = props.channels.find((channel: Channel) => channel.id === channelId);
  const [chatpluginConfig, setChatpluginConfig] = useState<ChatpluginConfig>(DefaultConfig);
  const [currentPage, setCurrentPage] = useState(Pages.createUpdate);
  const [connectorInfo, setConnectorInfo] = useState<SourceInfo | null>(null);
  const [configurationModal, setConfigurationModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  console.log('isEnabled initial', config);
  console.log(
    'config?.components[connectorInfo?.configKey]?.enabled',
    config?.components[connectorInfo?.configKey]?.enabled
  );

  const navigate = useNavigate();
  const {t} = useTranslation();
  const CHAT_PLUGIN_ROUTE = location.pathname.includes('connectors')
    ? CONNECTORS_CHAT_PLUGIN_ROUTE
    : CATALOG_CHAT_PLUGIN_ROUTE;

  //Pages.createUpdate:

  useEffect(() => {
    if (config && connectorInfo) {
      console.log('CONFIG', config?.components && config?.components[connectorInfo?.configKey]?.enabled);
      setIsEnabled(config?.components[connectorInfo?.configKey]?.enabled);
    }
  }, [config, connectorInfo]);

  useEffect(() => {
    console.log('isEnabled', isEnabled);
    isEnabled
      ? setModalTitle(t('Disable') + ' ' + connectorInfo && connectorInfo?.title)
      : setModalTitle(connectorInfo && connectorInfo?.title + ' ' + t('enabled'));
  }, [isEnabled, connectorInfo]);

  useEffect(() => {
    console.log('connectorInfo', connectorInfo);
  }, [connectorInfo]);

  useEffect(() => {
    const sourceInfoArr = getSourcesInfo('Connectors');

    const connectorSourceInfo = sourceInfoArr.filter(item => item.type === connector);

    setConnectorInfo({...connectorSourceInfo[0]});
  }, []);

  //create one for each source //
  const createNewConnection = (...args: string[]) => {
    if (connector === Source.chatPlugin) {
      const [displayName, imageUrl] = args;
      return connectChatPlugin({
        name: displayName,
        ...(imageUrl.length > 0 && {
          imageUrl: imageUrl,
        }),
      }).then((id: string) => {
        navigate(`${CHAT_PLUGIN_ROUTE}/${id}`);
      });
    }

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

      console.log('PAYLOAD', payload);

      updateComponentConfiguration(payload).then(() => {
        setIsEnabled(true);
        setConfigurationModal(true);
      });
    }
  };

  //here switch with source to make it custimizable
  const PageContent = () => {
    if (connector === Source.chatPlugin) {
      return <ConnectNewChatPlugin createNewConnection={createNewConnection} />;
    }

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
    if(!isEnabled) enableDisableComponentToggle();
    setConfigurationModal(false)
  }

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
                    style={{padding: '20px 40px'}}>
                    {isEnabled ? t('Disable') : t('Enable')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <div className={styles.wrapper} style={currentPage === Pages.customization ? {width: '60%'} : {width: '100%'}}>
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
          headerClassName={styles.headerModal}>
          {isEnabled && (
            //add translation here
            <>
              <p> Are you sure you want to disable this component? </p>

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
