import React from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';

import {ReactComponent as ConnectorsIcon} from 'assets/images/icons/gitMerge.svg';
import {ReactComponent as ComponentsIcon} from 'assets/images/icons/componentsIcon.svg';

import {CHANNELS_ROUTE, COMPONENTS_ROUTE} from '../../routes/routes';

import styles from './index.module.scss';

export const Sidebar = () => {
  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.linkSection}>
        <div className={`${styles.align} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
          <Link to={CHANNELS_ROUTE} className={`${styles.link} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
            <ConnectorsIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Connectors</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(COMPONENTS_ROUTE) ? styles.active : ''}`}>
          <Link to={COMPONENTS_ROUTE} className={`${styles.link} ${isActive(COMPONENTS_ROUTE) ? styles.active : ''}`}>
            <ComponentsIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Components</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
