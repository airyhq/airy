import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const SalesforceConnector = () => {
  return <ConnectorConfig connector={Source.dialogflow} />;
};

export default SalesforceConnector;
