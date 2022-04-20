import React, {useEffect} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';

const Webhooks = () => {
  useEffect(() => {
    setPageTitle('Webhooks');
  }, []);

  return (
    <div className={styles.webhooksWrapper}>
      <div className={styles.webhooksHeadline}>
        <div>
          <h1 className={styles.webhooksHeadlineText}>Webhooks</h1>
        </div>
      </div>
    </div>
  );
};

export default Webhooks;
