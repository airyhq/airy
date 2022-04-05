import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';

import {apiHostUrl} from '../../../../../httpClient';
import {StateModel} from '../../../../../reducers';
import {allConnectors} from '../../../../../selectors/connectors';
import {connectChatPlugin, updateChannel, disconnectChannel} from '../../../../../actions';

import {Button, LinkButton, InfoButton} from 'components';
import {Channel} from 'model';

import {ConnectNewChatPlugin} from './sections/ConnectNewChatPlugin';
import {EditChatPlugin} from './sections/EditChatPlugin';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyAvatar.svg';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/arrowLeft.svg';

import styles from './ChatPluginConnect.module.scss';

import {CONNECTORS_CHAT_PLUGIN_ROUTE, CONNECTORS_CONNECTED_ROUTE} from '../../../../../routes/routes';

const mapDispatchToProps = {
  connectChatPlugin,
  updateChannel,
  disconnectChannel,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allConnectors(state)),
  config: state.data.config,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const ChatPluginConnect = (props: ConnectedProps<typeof connector>) => {
  const {channelId} = useParams();
  const navigate = useNavigate();

  const createNewConnection = (displayName: string, imageUrl?: string) => {
    props
      .connectChatPlugin({
        name: displayName,
        ...(imageUrl.length > 0 && {
          imageUrl: imageUrl,
        }),
      })
      .then(() => {
        navigate(CONNECTORS_CONNECTED_ROUTE + '/chatplugin', {replace: true});
      });
  };

  const updateConnection = (displayName: string, imageUrl?: string) => {
    props.updateChannel({channelId: channelId, name: displayName, imageUrl: imageUrl}).then(() => {
      navigate(CONNECTORS_CONNECTED_ROUTE + '/chatplugin', {replace: true});
    });
  };

  const disconnectChannel = (channel: Channel) => {
    if (window.confirm('Do you really want to delete this channel?')) {
      props.disconnectChannel({source: 'chatplugin', channelId: channel.id});
    }
  };

  const openNewPage = () => navigate(CONNECTORS_CHAT_PLUGIN_ROUTE + '/new');

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
                Edit
              </Link>
              <LinkButton
                type="button"
                onClick={() => {
                  disconnectChannel(channel);
                }}
              >
                Delete
              </LinkButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const PageContent = () => {
    if (channelId === 'new') {
      return <ConnectNewChatPlugin createNewConnection={createNewConnection} />;
    }
    if (channelId?.length > 0) {
      const channel = props.channels.find((channel: Channel) => channel.id === channelId);
      return <EditChatPlugin channel={channel} host={apiHostUrl} updateConnection={updateConnection} />;
    }
    return <OverviewSection />;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headline}>
        <h1 className={styles.headlineText}>Airy Live Chat</h1>
        {channelId == null && (
          <div className={styles.addButton}>
            <Button onClick={openNewPage}>
              <span title="Add channel">+</span>
            </Button>
          </div>
        )}
      </div>
      <div>
        <InfoButton
          link="https://airy.co/docs/core/sources/chatplugin/overview"
          text="more information about this source"
          color="grey"
        />
        <LinkButton onClick={() => navigate(-1)} type="button">
          <ArrowLeftIcon className={styles.backIcon} />
          Back
        </LinkButton>
      </div>
      <PageContent />
    </div>
  );
};

export default connector(ChatPluginConnect);
