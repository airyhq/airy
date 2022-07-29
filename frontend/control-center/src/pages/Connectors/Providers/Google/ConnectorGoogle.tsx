import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const ConnectorGoogle = () => {
  return <ConnectorConfig connector={Source.google} />;
};

export default ConnectorGoogle;
