import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {getSourcesInfo, SourceInfo} from '../../../components/SourceInfo';

import {apiHostUrl} from '../../../httpClient';
import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';
import {connectChatPlugin, updateChannel, disconnectChannel} from '../../../actions';

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
  const {connector} = props;
  const {channelId} = useParams();
  const currentChannel = props.channels.find((channel: Channel) => channel.id === channelId);
  const [chatpluginConfig, setChatpluginConfig] = useState<ChatpluginConfig>(DefaultConfig);
  const [currentPage, setCurrentPage] = useState(Pages.createUpdate);
  const [connectorInfo, setConnectorInfo] = useState<SourceInfo | null>(null);

  const navigate = useNavigate();
  const {t} = useTranslation();
  const CHAT_PLUGIN_ROUTE = location.pathname.includes('connectors')
    ? CONNECTORS_CHAT_PLUGIN_ROUTE
    : CATALOG_CHAT_PLUGIN_ROUTE;

  //Pages.createUpdate:

  useEffect(() => {
    console.log('connectorInfo', connectorInfo);
  }, [connectorInfo]);

  useEffect(() => {
    const sourceInfoArr = getSourcesInfo('Connectors');

    const connectorSourceInfo = sourceInfoArr.filter(item => item.type === connector);

    setConnectorInfo({...connectorSourceInfo[0]});
  }, []);

  const createNewConnection = (displayName: string, imageUrl?: string) => {
    props
      .connectChatPlugin({
        name: displayName,
        ...(imageUrl.length > 0 && {
          imageUrl: imageUrl,
        }),
      })
      .then((id: string) => {
        navigate(`${CHAT_PLUGIN_ROUTE}/${id}`);
      });
  };

  //here switch with source to make it custimizable
  const PageContent = () => {
    return <ConnectNewChatPlugin createNewConnection={createNewConnection} />;
  };

  //change LinkButton component to remove border + customize color

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
            <div className={styles.connectorIcon}>{connectorInfo && connectorInfo?.image}</div>
            <h1 className={styles.headlineText}>{connectorInfo && connectorInfo?.title}</h1>

            <p>
            {connectorInfo && connectorInfo?.description}{' '}
            <InfoButton link={connectorInfo && connectorInfo?.docs} text={t('infoButtonText')} />
          </p>
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
        <div
          style={
            currentPage === Pages.customization
              ? {paddingTop: '0px', paddingLeft: '32px'}
              : {paddingTop: '36px', paddingLeft: '32px'}
          }>
          <PageContent />
        </div>
      </div>
    </div>
  );
};

export default connector(ConnectorConfig);
