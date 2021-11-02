import React from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';

import {env} from '../../../../../env';
import {StateModel} from '../../../../../reducers';
import {allChannels} from '../../../../../selectors/channels';
import {connectChatPlugin, updateChannel, disconnectChannel} from '../../../../../actions/channel';

import {Button, LinkButton, InfoButton} from 'components';
import {Channel} from 'model';

import {ConnectNewChatPlugin} from './sections/ConnectNewChatPlugin';
import {EditChatPlugin} from './sections/EditChatPlugin';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/arrow-left-2.svg';

import styles from './ChatPluginConnect.module.scss';

import {CHANNELS_CHAT_PLUGIN_ROUTE, CHANNELS_CONNECTED_ROUTE} from '../../../../../routes/routes';

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

interface ChatPluginRouterProps {
  channelId?: string;
}

type ChatPluginProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<ChatPluginRouterProps>;

const ChatPluginConnect = (props: ChatPluginProps) => {
  const channelId = props.match.params.channelId;

  const createNewConnection = (displayName: string, imageUrl?: string) => {
    props
      .connectChatPlugin({
        name: displayName,
        ...(imageUrl.length > 0 && {
          imageUrl: imageUrl,
        }),
      })
      .then(() => {
        props.history.replace(CHANNELS_CONNECTED_ROUTE + '/chatplugin');
      });
  };

  const updateConnection = (displayName: string, imageUrl?: string) => {
    props.updateChannel({channelId: channelId, name: displayName, imageUrl: imageUrl}).then(() => {
      props.history.replace(CHANNELS_CONNECTED_ROUTE + '/chatplugin');
    });
  };

  const disconnectChannel = (channel: Channel) => {
    if (window.confirm('Do you really want to delete this channel?')) {
      props.disconnectChannel({source: 'chatplugin', channelId: channel.id});
    }
  };

  const openNewPage = () => {
    props.history.push(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
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
              <Link className={styles.listButtonEdit} to={`${CHANNELS_CHAT_PLUGIN_ROUTE}/${channel.id}`}>
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
      return <EditChatPlugin channel={channel} host={env.API_HOST} updateConnection={updateConnection} />;
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
        <LinkButton onClick={props.history.goBack} type="button">
          <ArrowLeftIcon className={styles.backIcon} />
          Back
        </LinkButton>
      </div>
      <PageContent />
    </div>
  );
};

export default connector(withRouter(ChatPluginConnect));
