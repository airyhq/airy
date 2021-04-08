import React from 'react';
import {Link} from 'react-router-dom';

import styles from './style.module.scss';

type Props = {
  children: React.ReactNode;
  href: string;
  dataCy?: string;
};

export const HrefButton = ({children, href, dataCy}: Props) => (
  <Link to={href} data-cy={dataCy}>
    <div className={styles.button}>
      <span className={styles.buttonLabel}>{children}</span>
    </div>
  </Link>
);
