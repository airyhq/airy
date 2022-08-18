import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../../ConnectorConfig';

const ConnectorFacebook = () => {
  return <ConnectorConfig connector={Source.facebook} />;
};

export default ConnectorFacebook;
