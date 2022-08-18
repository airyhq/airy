import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../../ConnectorConfig';

const ConnectorTwilioSms = () => {
  return <ConnectorConfig connector={Source.twilioSMS} />;
};

export default ConnectorTwilioSms;
