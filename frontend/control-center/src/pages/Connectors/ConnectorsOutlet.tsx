import React from 'react';
import ConnectorWrapper from './ConnectorWrapper';
import {Outlet} from 'react-router-dom';

const ConnectorsOutlet = () => <ConnectorWrapper Outlet={<Outlet />} />;

export default ConnectorsOutlet;
