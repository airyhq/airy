import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const ConnectorDialogflow = () => {
  return <ConnectorConfig connector={Source.dialogflow} />;
};

export default ConnectorDialogflow;
