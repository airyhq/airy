import React from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';

import {ReactComponent as PlugIcon} from 'assets/images/icons/gitMerge.svg';

import {CONNECTORS_ROUTE} from '../../routes/routes';

import styles from './index.module.scss';

export const Sidebar = () => {
  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.linkSection}>
        <div className={styles.align}>
          <Link to={CONNECTORS_ROUTE} className={`${styles.link} ${isActive(CONNECTORS_ROUTE) ? styles.active : ''}`}>
            <PlugIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Connectors</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
