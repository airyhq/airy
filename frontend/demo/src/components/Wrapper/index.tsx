import React from 'react';

import styles from './index.module.scss';

interface IProps {}

const Wrapper: React.FunctionComponent<IProps> = props => (
  <div className={styles.App}>
    <div className={styles.Content}>{props.children}</div>
  </div>
);

export default Wrapper;
