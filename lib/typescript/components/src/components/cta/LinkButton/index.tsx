import React from 'react';

import styles from './style.module.scss';

export const LinkButton = ({children, onClick, type, dataCy}) => (
  <button type={type} className={styles.button} onClick={onClick} data-cy={dataCy}>
    {children}
  </button>
);
