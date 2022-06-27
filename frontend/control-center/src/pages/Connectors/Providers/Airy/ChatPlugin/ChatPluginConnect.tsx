import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';

import {apiHostUrl} from '../../../../../httpClient';
import {StateModel} from '../../../../../reducers';
import {allChannels} from '../../../../../selectors/channels';
import {connectChatPlugin, updateChannel, disconnectChannel} from '../../../../../actions';

import {LinkButton, InfoButton} from 'components';
import {Channel} from 'model';

import {ConnectNewChatPlugin} from './sections/ConnectNewChatPlugin';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyAvatar.svg';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';

import styles from './ChatPluginConnect.module.scss';

import {CONNECTORS_CHAT_PLUGIN_ROUTE} from '../../../../../routes/routes';
import {useTranslation} from 'react-i18next';
import CreateUpdateSection from './sections/CreateUpdateSection/CreateUpdateSection';
import {CustomiseSection} from './sections/CustomiseSection/CustomiseSection';
import {InstallSection} from './sections/InstallSection/InstallSection';
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

const ChatPluginConnect = (props: ConnectedProps<typeof connector>) => {
  const {channelId} = useParams();
  const currentChannel = props.channels.find((channel: Channel) => channel.id === channelId);
  const [chatpluginConfig, setChatpluginConfig] = useState<ChatpluginConfig>(DefaultConfig);
  const [currentPage, setCurrentPage] = useState(Pages.createUpdate);
  const displayName = currentChannel?.metadata?.name || '';
  const imageUrl = currentChannel?.metadata?.imageUrl || '';
  const navigate = useNavigate();
  const {t} = useTranslation();
  const CHAT_PLUGIN_ROUTE = CONNECTORS_CHAT_PLUGIN_ROUTE;

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

  const disconnectChannel = (channel: Channel) => {
    if (window.confirm(t('deleteChannel'))) {
      props.disconnectChannel({source: 'chatplugin', channelId: channel.id});
    }
  };

  const showCreateUpdate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(Pages.createUpdate);
  };

  const showCustomization = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(Pages.customization);
  };

  const showInstall = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(Pages.install);
  };

  const PageContent = () => {
    switch (currentPage) {
      case Pages.createUpdate:
        if (channelId === 'new') {
          return <ConnectNewChatPlugin createNewConnection={createNewConnection} />;
        }
        if (channelId?.length > 0) {
          return <CreateUpdateSection channel={currentChannel} displayName={displayName} imageUrl={imageUrl} />;
        }
        return <OverviewSection />;
      case Pages.customization:
        return <CustomiseSection channelId={channelId} host={apiHostUrl} setChatpluginConfig={setChatpluginConfig} />;
      case Pages.install:
        return (
          <div className={styles.formWrapper}>
            <InstallSection
              channelId={channelId}
              host={apiHostUrl}
              chatpluginConfig={chatpluginConfig || DefaultConfig}
            />
          </div>
        );
    }
  };

  const OverviewSection = () => (
    <div className={styles.overview}>
      <ul>
        {props.channels.map((channel: Channel) => (
          <li key={channel.id} className={styles.listItem}>
            <div className={styles.channelLogo}>
              {channel.metadata?.imageUrl ? (
                <img src={channel.metadata?.imageUrl} alt={channel.metadata?.name} className={styles.channelImage} />
              ) : (
                <div className={styles.placeholderLogo}>
                  <AiryAvatarIcon />{' '}
                </div>
              )}
            </div>

            <div className={styles.listChannelName}>{channel.metadata?.name}</div>
            <div className={styles.listButtons}>
              <Link className={styles.listButtonEdit} to={`${CONNECTORS_CHAT_PLUGIN_ROUTE}/${channel.id}`}>
                {t('edit')}
              </Link>
              <LinkButton
                type="button"
                onClick={() => {
                  disconnectChannel(channel);
                }}
              >
                {t('delete')}
              </LinkButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.headlineContainer}>
        <div className={styles.backButtonContainer}>
          <LinkButton onClick={() => navigate(-1)} type="button">
            <ArrowLeftIcon className={styles.backIcon} />
          </LinkButton>
          <h1 className={styles.headlineText}>{t('chatpluginTitle')}</h1>
        </div>
        <div className={styles.infoBox}>
          <InfoButton link="https://airy.co/docs/core/sources/chatplugin/overview" text={t('infoButtonText')} />
        </div>
      </div>
      <div className={styles.wrapper} style={currentPage === Pages.customization ? {width: '60%'} : {width: '100%'}}>
        <div className={styles.channelsLineContainer}>
          <div className={styles.channelsLineItems}>
            <span
              onClick={showCreateUpdate}
              className={currentPage === Pages.createUpdate ? styles.activeItem : styles.inactiveItem}
            >
              {channelId === 'new' ? t('create') : t('update')}
            </span>
            {channelId !== 'new' && (
              <span
                onClick={showCustomization}
                className={currentPage === Pages.customization ? styles.activeItem : styles.inactiveItem}
              >
                {t('customize')}
              </span>
            )}
            {channelId !== 'new' && (
              <span
                onClick={showInstall}
                className={currentPage === Pages.install ? styles.activeItem : styles.inactiveItem}
              >
                {t('install')}
              </span>
            )}
          </div>
          <div className={styles.line} />
        </div>
        <div
          style={
            currentPage === Pages.customization
              ? {paddingTop: '0px', paddingLeft: '32px'}
              : {paddingTop: '36px', paddingLeft: '32px'}
          }
        >
          <PageContent />
        </div>
      </div>
    </div>
  );
};

export default connector(ChatPluginConnect);
