import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {listChannels} from '../../actions/channel';
import {getClientConfig} from '../../actions/config';
import {StateModel} from '../../reducers/index';
import styles from './index.module.scss';

import {allChannels} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';

import ChannelsMainPage from './ChannelsMainPage';

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

  return (
    <div className={styles.channelsWrapper}>
      <ChannelsMainPage channels={props.channels} config={props.config} />
    </div>
  );
};

export default connector(Channels);
