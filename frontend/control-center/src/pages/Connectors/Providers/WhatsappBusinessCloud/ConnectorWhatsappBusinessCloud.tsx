import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const ConnectorWhatsappBusinessCloud = () => {
  return <ConnectorConfig connector={Source.whatsapp} />;
};

export default ConnectorWhatsappBusinessCloud;
