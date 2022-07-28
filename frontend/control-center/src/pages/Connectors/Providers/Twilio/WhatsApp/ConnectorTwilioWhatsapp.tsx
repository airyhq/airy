import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../../ConnectorConfig';

const ConnectorTwilioWhatsapp = () => {
  return <ConnectorConfig connector={Source.twilioWhatsApp} />;
};

export default ConnectorTwilioWhatsapp;
