import React from 'react';
import ConnectorConfigWrapper from './ConnectorConfigWrapper';
import {Outlet} from 'react-router-dom';

const ConnectorsOutlet = () => {
  return (
    <>
      <ConnectorConfigWrapper Outlet={<Outlet />} />
    </>
  );
};

export default ConnectorsOutlet;
