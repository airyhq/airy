import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';
import {Link} from 'react-router-dom';
import {CATALOG_ROUTE} from '../../../routes/routes';
import {useTranslation} from 'react-i18next';

export const EmptyStateConnectors = () => {
  const {t} = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.searchIconContainer}>
        <SearchIcon height={48} width={48} color="#1578D4" />
      </div>
      <h1>{t('noConnectorsFound')}</h1>
      <p>{t('noConnectorsFoundTerm')}</p>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Link to={CATALOG_ROUTE} className={styles.linkContainer}>
          <CatalogIcon height={18} width={18} color="#1578D4" />
          Catalog
        </Link>
        <p>{t('noConnectorsFoundMore')}</p>
      </div>
    </div>
  );
};
