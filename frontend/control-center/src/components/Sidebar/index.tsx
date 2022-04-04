import React from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';

import {ReactComponent as PlugIcon} from 'assets/images/icons/gitMerge.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';

import {CATALOG_ROUTE, CHANNELS_ROUTE} from '../../routes/routes';

import styles from './index.module.scss';

export const Sidebar = () => {
  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.linkSection}>
        <div className={styles.align}>
          <Link to={CHANNELS_ROUTE} className={`${styles.link} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
            <PlugIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Connectors</span>
          </Link>
        </div>
        <div className={styles.align}>
          <Link to={CATALOG_ROUTE} className={`${styles.link} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
            <CatalogIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Catalog</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
