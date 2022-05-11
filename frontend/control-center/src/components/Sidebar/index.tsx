import React from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';

import {CATALOG_ROUTE, CONNECTORS_ROUTE, STATUS_ROUTE, WEBHOOKS_ROUTE} from '../../routes/routes';
import {ReactComponent as ConnectorsIcon} from 'assets/images/icons/gitMerge.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';
import {ReactComponent as WebhooksIcon} from 'assets/images/icons/webhooksIcon.svg';
import {ReactComponent as StatusIcon} from 'assets/images/icons/statusIcon.svg';
// import {ReactComponent as InboxIcon} from 'assets/images/icons/inboxIcon.svg';

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
        <div className={`${styles.align} ${isActive(STATUS_ROUTE) ? styles.active : ''}`}>
          <Link to={STATUS_ROUTE} className={`${styles.link} ${isActive(STATUS_ROUTE) ? styles.active : ''}`}>
            <StatusIcon width={'20px'} height={'20px'} />
            <span className={styles.iconText}>Status</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CONNECTORS_ROUTE) ? styles.active : ''}`}>
          <Link to={CONNECTORS_ROUTE} className={`${styles.link} ${isActive(CONNECTORS_ROUTE) ? styles.active : ''}`}>
            <ConnectorsIcon width={'20px'} height={'20px'} />
            <span className={styles.iconText}>Connectors</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
          <Link to={CATALOG_ROUTE} className={`${styles.link} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
            <CatalogIcon width={'18px'} height={'18px'} />
            <span className={styles.iconText}>Catalog</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(WEBHOOKS_ROUTE) ? styles.active : ''}`}>
          <Link to={WEBHOOKS_ROUTE} className={`${styles.link} ${isActive(WEBHOOKS_ROUTE) ? styles.active : ''}`}>
            <WebhooksIcon width={'20px'} height={'20px'} />
            <span className={styles.iconText}>Webhooks</span>
          </Link>
        </div>
        {/* <div style={{width: '95%', background: 'rgba(115, 115, 115, 0.2)', height: '0.3px', marginTop: '11px'}}></div>
        <div className={`${styles.align} ${isActive(INBOX_ROUTE) ? styles.active : ''}`}>
          <Link to={INBOX_ROUTE} className={`${styles.link} ${isActive(INBOX_ROUTE) ? styles.active : ''}`}>
            <InboxIcon width={'20px'} height={'20px'} />
            <span className={styles.iconText}>Inbox</span>
          </Link>
        </div> */}
      </div>
      <span className={styles.version}>Version {props.version}</span>
    </nav>
  );
};

export default connector(Sidebar);
