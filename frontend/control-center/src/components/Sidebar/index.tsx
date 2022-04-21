import React from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';

import {CATALOG_ROUTE, CHANNELS_ROUTE, COMPONENTS_ROUTE, WEBHOOKS_ROUTE} from '../../routes/routes';
import {ReactComponent as ConnectorsIcon} from 'assets/images/icons/gitMerge.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';
<<<<<<< HEAD
import {ReactComponent as ComponentsIcon} from 'assets/images/icons/componentsIcon.svg';
import {ReactComponent as WebhooksIcon} from 'assets/images/icons/webhooksIcon.svg';
=======
import {ReactComponent as StatusIcon} from 'assets/images/icons/statusIcon.svg';
>>>>>>> c5eba2a8 (finalized version)

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
            <StatusIcon width={'20px'} height={'20px'} />
            <span className={styles.iconText}>Status</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
          <Link to={CHANNELS_ROUTE} className={`${styles.link} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
            <ConnectorsIcon width={'20px'} height={'20px'} />
            <span className={styles.iconText}>Connectors</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
          <Link to={CATALOG_ROUTE} className={`${styles.link} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
<<<<<<< HEAD
            <CatalogIcon width={'20px'} height={'20px'} />
=======
            <CatalogIcon width={'18px'} height={'18px'} />
>>>>>>> c5eba2a8 (finalized version)
            <span className={styles.iconText}>Catalog</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(WEBHOOKS_ROUTE) ? styles.active : ''}`}>
          <Link to={WEBHOOKS_ROUTE} className={`${styles.link} ${isActive(WEBHOOKS_ROUTE) ? styles.active : ''}`}>
            <WebhooksIcon width={'24px'} height={'24px'} />
            <span className={styles.iconText}>Webhooks</span>
          </Link>
        </div>
      </div>
      <span className={styles.version}>Version {props.version}</span>
    </nav>
  );
};

export default connector(Sidebar);
