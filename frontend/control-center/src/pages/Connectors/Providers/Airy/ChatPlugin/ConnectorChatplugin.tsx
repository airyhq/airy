import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../../ConnectorConfig';

const ConnectorChatplugin = () => {
  return <ConnectorConfig connector={Source.chatPlugin} />;
};

export default ConnectorChatplugin;
