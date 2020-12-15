import React from 'react';

import styles from './index.module.scss';

const Wrapper = (props: React.PropsWithChildren<{}>) => (
  <div className={styles.App}>
    <div className={styles.Content}>{props.children}</div>
  </div>
);

export default Wrapper;
