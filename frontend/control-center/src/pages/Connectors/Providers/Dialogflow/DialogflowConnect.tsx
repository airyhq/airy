import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const DialogflowConnector = () => {
  return <ConnectorConfig connector={Source.dialogflow} />;
};

export default DialogflowConnector;
