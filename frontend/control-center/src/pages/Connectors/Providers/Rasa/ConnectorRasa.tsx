import {Source} from 'model';
import React from 'react';
import ConnectorConfig from '../../ConnectorConfig';

const ConnectorRasa = () => {
  return <ConnectorConfig connector={Source.rasa} />;
};

export default ConnectorRasa;
