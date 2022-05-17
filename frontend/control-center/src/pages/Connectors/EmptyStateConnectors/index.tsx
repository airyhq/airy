import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';
import {Link} from 'react-router-dom';
import {CATALOG_ROUTE} from '../../../routes/routes';

export const EmptyStateConnectors = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchIconContainer}>
        <SearchIcon height={48} width={48} color="#1578D4" />
      </div>
      <h1>No Connectors Found</h1>
      <p>You don&apos;t have any connectors installed, please open the</p>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Link to={CATALOG_ROUTE} className={styles.linkContainer}>
          <CatalogIcon height={18} width={18} color="#1578D4" />
          Catalog
        </Link>
        <p>and explore more.</p>
      </div>
    </div>
  );
};
