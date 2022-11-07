import React from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../reducers';
import {useCurrentComponentForSource} from '../../selectors';
import {Source} from 'model';
import {CATALOG_ROUTE, CONNECTORS_ROUTE, INBOX_ROUTE, STATUS_ROUTE, WEBHOOKS_ROUTE} from '../../routes/routes';

import {ReactComponent as ConnectorsIcon} from 'assets/images/icons/gitMerge.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';
import {ReactComponent as WebhooksIcon} from 'assets/images/icons/webhooksIcon.svg';
import {ReactComponent as StatusIcon} from 'assets/images/icons/statusIcon.svg';
import {ReactComponent as InboxIcon} from 'assets/images/icons/inboxIcon.svg';
import styles from './index.module.scss';

type SideBarProps = {} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  version: state.data.config.clusterVersion,
  components: state.data.config.components,
});

const connector = connect(mapStateToProps);

const Sidebar = (props: SideBarProps) => {
  const {version, components} = props;
  const componentInfo = useCurrentComponentForSource(Source.webhooks);

  const webhooksEnabled = componentInfo.installed;
  const inboxEnabled = components[Source.frontendInbox]?.enabled || false;
  const showLine = inboxEnabled || webhooksEnabled;

  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.linkSection}>
        <div className={`${styles.align} ${isActive(STATUS_ROUTE) ? styles.active : ''}`}>
          <Link to={STATUS_ROUTE} className={`${styles.link} ${isActive(STATUS_ROUTE) ? styles.active : ''}`}>
            <StatusIcon width={20} height={20} />
            <span className={styles.iconText}>Status</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CONNECTORS_ROUTE) ? styles.active : ''}`}>
          <Link to={CONNECTORS_ROUTE} className={`${styles.link} ${isActive(CONNECTORS_ROUTE) ? styles.active : ''}`}>
            <ConnectorsIcon width={20} height={20} />
            <span className={styles.iconText}>Connectors</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
          <Link to={CATALOG_ROUTE} className={`${styles.link} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
            <CatalogIcon width={18} height={18} />
            <span className={styles.iconText}>Catalog</span>
          </Link>
        </div>
        <div className={showLine ? styles.borderActive : styles.inactive} />
        <>
          <div
            className={`${styles.align} ${isActive(INBOX_ROUTE) ? styles.active : ''} ${
              !inboxEnabled && styles.inactive
            }`}
          >
            <Link to={INBOX_ROUTE} className={`${styles.link} ${isActive(INBOX_ROUTE) ? styles.active : ''}`}>
              <InboxIcon width={20} height={20} />
              <span className={styles.iconText}>Inbox</span>
            </Link>
          </div>
        </>
        <>
          <div
            className={`${styles.align} ${isActive(WEBHOOKS_ROUTE) ? styles.active : ''} ${
              !webhooksEnabled && styles.inactive
            }`}
          >
            <Link to={WEBHOOKS_ROUTE} className={`${styles.link} ${isActive(WEBHOOKS_ROUTE) ? styles.active : ''}`}>
              <WebhooksIcon width={20} height={20} />
              <span className={styles.iconText}>Webhooks</span>
            </Link>
          </div>
        </>
      </div>
      <span className={styles.version}>Version {version}</span>
    </nav>
  );
};

export default connector(Sidebar);
