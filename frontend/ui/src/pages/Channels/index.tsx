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
import FacebookConnect from './ChannelsMainPage/Sources/FacebookConnect';
import ChannelsList from '../Channels/ConnectedChannelsList/ChannelsList';
import {CHANNELS_FACEBOOK_ROUTE} from '../../routes/routes';
import {CHANNELS_CONNECTED_ROUTE} from '../../routes/routes';

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
    props.listChannels();
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
      <Route path={[`${CHANNELS_FACEBOOK_ROUTE}/:channelId?`]} component={FacebookConnect} />
      <Route path={[`${CHANNELS_CONNECTED_ROUTE}/:source?`]} component={ChannelsList} />
      <Route path="/" render={renderChannels} />
    </Switch>
  );
};

export default connector(Channels);
