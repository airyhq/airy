import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const ConnectorInstagram = () => {
  return <ConnectorConfig connector={Source.instagram} />;
};

export default ConnectorInstagram;
