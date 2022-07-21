import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const SalesforceConnector = () => {
  return <ConnectorConfig connector={Source.salesforce} />;
};

export default SalesforceConnector;
