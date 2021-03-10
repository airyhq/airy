import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {Route, RouteComponentProps, Switch} from 'react-router-dom';

import {listChannels} from '../../actions/channel';
import {getClientConfig} from '../../actions/config';
import {StateModel} from '../../reducers/index';
import styles from './index.module.scss';

import {allChannels} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';

import ChannelsMainPage from './ChannelsMainPage';
import ChatPluginConnect from './ChannelsMainPage/Sources/ChatPluginConnect';
import {CHANNELS_CHAT_PLUGIN_ROUTE} from '../../routes/routes';

const mapDispatchToProps = {
  listChannels,
  getClientConfig,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
  config: state.data.config,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ChannelsConnectProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const Channels = (props: ChannelsConnectProps) => {
  useEffect(() => {
    if (props.channels.length == 0) {
      props.listChannels();
    }
    props.getClientConfig();
    setPageTitle('Channels');
  }, []);

  const renderChannels = () => (
    <div className={styles.channelsWrapper}>
      <ChannelsMainPage channels={props.channels} config={props.config} />
    </div>
  );

  return (
    <Switch>
      <Route path={[`${CHANNELS_CHAT_PLUGIN_ROUTE}/:channelId?`]} component={ChatPluginConnect} />
      <Route path="/" render={renderChannels} />
    </Switch>
  );
};

export default connector(Channels);
