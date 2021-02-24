import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {listChannels} from '../../actions/channel';
import {StateModel} from '../../reducers/index';
import styles from './index.module.scss';

import {allChannels} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';

import ChannelsMainPage from './ChannelsMainPage';

const mapDispatchToProps = {
  listChannels,
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
      <ChannelsMainPage channels={props.channels} />
    </div>
  );
};

export default connector(Channels);
