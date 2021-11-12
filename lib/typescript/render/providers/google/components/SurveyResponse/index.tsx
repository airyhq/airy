import React from 'react';

import styles from './index.module.scss';
import {Emoji} from 'components';

export const SurveyResponse = ({rating}) => (
  <span className={styles.text}>
    <Emoji symbol={'📝'} /> This user has responded '{rating}' to a survey.
  </span>
);
