import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Outlet} from 'react-router-dom';

import {listChannels} from '../../actions';
import {StateModel} from '../../reducers';
import {allConnectorsConnected} from '../../selectors/connectors';
import {setPageTitle} from '../../services/pageTitle';

const mapDispatchToProps = {
  listChannels,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allConnectorsConnected(state)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const Connectors = (props: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    if (props.channels.length === 0) {
      props.listChannels();
    }
    setPageTitle('Channels');
  }, [props.channels.length]);

  return <Outlet />;
};

export default connector(Connectors);
