import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {Link} from 'react-router-dom';
import {CATALOG_ROUTE} from '../../../routes/routes';

export const EmptyStateConnectors = () => {
  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '105px',
          width: '105px',
          background: '#F7F7F7',
        }}>
        <SearchIcon height={48} width={48} color="#1578D4" />
      </div>
      <h1>No Connectors Found</h1>
      <p>You don't have any connectors installed, please open the</p>
      <Link to={CATALOG_ROUTE} style={{color: '#1578D4', textDecoration: 'none', fontSize: '20px'}}>
        Catalog
      </Link>
      <p>and explore more.</p>
    </div>
  );
};
