import React from 'react';

import styles from './index.module.scss';
import {Emoji} from 'components';

export const SurveyResponse = ({rating}) => (
  <span className={styles.text}>
    <Emoji symbol={'📝'} /> This user {rating === 'NO' ? 'negatively' : rating === 'YES' ? 'positively' : ''} rated the
    experience with the response &#39;{rating}&#39;.
  </span>
);
