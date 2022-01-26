import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {Outlet} from 'react-router-dom';

import {listChannels} from '../../actions';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';

const mapDispatchToProps = {
  listChannels,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannelsConnected(state)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const Channels = (props: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    if (props.channels.length == 0) {
      props.listChannels();
    }
    setPageTitle('Channels');
  }, [props.channels]);

  return <Outlet />;
};

export default connector(Channels);
