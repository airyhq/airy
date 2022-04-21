import React from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';

import {CATALOG_ROUTE, CHANNELS_ROUTE, COMPONENTS_ROUTE} from '../../routes/routes';
import {ReactComponent as ConnectorsIcon} from 'assets/images/icons/gitMerge.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';
import {ReactComponent as ComponentsIcon} from 'assets/images/icons/componentsIcon.svg';

import styles from './index.module.scss';
import {StateModel} from '../../reducers';
import {connect, ConnectedProps} from 'react-redux';

type SideBarProps = {} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  version: state.data.config.clusterVersion,
});

const connector = connect(mapStateToProps);

const Sidebar = (props: SideBarProps) => {
  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.linkSection}>
        <div className={`${styles.align} ${isActive(COMPONENTS_ROUTE) ? styles.active : ''}`}>
          <Link to={COMPONENTS_ROUTE} className={`${styles.link} ${isActive(COMPONENTS_ROUTE) ? styles.active : ''}`}>
            <ComponentsIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Components</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
          <Link to={CHANNELS_ROUTE} className={`${styles.link} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
            <ConnectorsIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Connectors</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
          <Link to={CATALOG_ROUTE} className={`${styles.link} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
            <CatalogIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Catalog</span>
          </Link>
        </div>
      </div>
      <span className={styles.version}>Version {props.version}</span>
    </nav>
  );
};

export default connector(Sidebar);
