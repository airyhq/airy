import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {listChannels, exploreChannels, connectChannel, disconnectChannel} from '../../actions/channel';
import {StateModel} from '../../reducers/index';
import styles from './index.module.scss';

import {allChannels} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';
import ChatPluginSource from '../Channels/ChannelsSources/ChatPluginSource';
import FacebookSource from '../Channels/ChannelsSources/FacebookSource';
import TwilloSmsSource from '../Channels/ChannelsSources/TwilloSmsSource';
import WhatsappSmsSource from '../Channels/ChannelsSources/WhatsappSmsSource';
import GoogleSource from '../Channels/ChannelsSources/GoogleSource';

const mapDispatchToProps = {
  listChannels,
  exploreChannels,
  connectChannel,
  disconnectChannel,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ChannelsConnectProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const Channels = (props: ChannelsConnectProps) => {
  useEffect(() => {
    props.listChannels();
    setPageTitle('Channels');
  }, []);

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Channels</h1>
        </div>
      </div>
      <div className={styles.channelsChoice}>
        {' '}
        <p>Choose a channel you want to connect</p>
      </div>

      <div className={styles.wrapper}>
        <ChatPluginSource pluginSource={props.channels} />
        <FacebookSource facebookSource={props.channels} />
        <TwilloSmsSource twilloSmsSource={props.channels} />
        <WhatsappSmsSource whatsappSmsSource={props.channels} />
        <GoogleSource googleSource={props.channels} />
      </div>
    </div>
  );
};

export default connector(Channels);
