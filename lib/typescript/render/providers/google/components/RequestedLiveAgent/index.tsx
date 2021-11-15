import React from 'react';
import styles from './index.module.scss';
import {Emoji} from 'components';

export const RequestedLiveAgent = () => (
  <span className={styles.text}>
    <Emoji symbol={'👋'} /> This user has requested to speak to a human agent.
  </span>
);
