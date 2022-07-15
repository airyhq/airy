import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const ZendeskConnector = () => {
  return <ConnectorConfig connector={Source.zendesk} />;
};

export default ZendeskConnector;
