import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useMatch} from 'react-router';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../reducers';
import {useCurrentComponentForSource} from '../../selectors';
import {InstallationStatus, Source} from 'model';
import {
  CATALOG_ROUTE,
  CONNECTORS_ROUTE,
  APPS_ROUTE,
  INBOX_ROUTE,
  STATUS_ROUTE,
  WEBHOOKS_ROUTE,
  STREAMS_ROUTE,
  TOPICS_ROUTE,
} from '../../routes/routes';

import {ReactComponent as ConnectorsIcon} from 'assets/images/icons/gitMerge.svg';
import {ReactComponent as AppsIcon} from 'assets/images/icons/add-item-alt.svg';
import {ReactComponent as CatalogIcon} from 'assets/images/icons/catalogIcon.svg';
import {ReactComponent as WebhooksIcon} from 'assets/images/icons/webhooksIcon.svg';
import {ReactComponent as StatusIcon} from 'assets/images/icons/statusIcon.svg';
import {ReactComponent as InboxIcon} from 'assets/images/icons/inboxIcon.svg';
import {ReactComponent as StreamsIcon} from 'assets/images/icons/kafkaLogo.svg';
import styles from './index.module.scss';

type SideBarProps = {} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  version: state.data.config.clusterVersion,
  components: state.data.config.components,
});

const connector = connect(mapStateToProps);

const Sidebar = (props: SideBarProps) => {
  const {version, components} = props;
  const componentInfo = useCurrentComponentForSource(Source.airyWebhooks);

  const webhooksEnabled = componentInfo.installationStatus === InstallationStatus.installed;
  const inboxEnabled = components[Source.frontendInbox]?.enabled || false;
  const showLine = inboxEnabled || webhooksEnabled;

  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  const href = window.location.href;
  const [kafkaSectionOpen, setKafkaSectionOpen] = useState<boolean>(
    href.includes(TOPICS_ROUTE) || href.includes(STREAMS_ROUTE)
  );

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
        <div className={`${styles.align} ${isActive(APPS_ROUTE) ? styles.active : ''}`}>
          <Link to={APPS_ROUTE} className={`${styles.link} ${isActive(APPS_ROUTE) ? styles.active : ''}`}>
            <AppsIcon width={20} height={20} />
            <span className={styles.iconText}>Apps</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
          <Link to={CATALOG_ROUTE} className={`${styles.link} ${isActive(CATALOG_ROUTE) ? styles.active : ''}`}>
            <CatalogIcon width={18} height={18} />
            <span className={styles.iconText}>Catalog</span>
          </Link>
        </div>
        <div className={styles.align} onClick={() => setKafkaSectionOpen(!kafkaSectionOpen)}>
          <div
            className={`${styles.link} ${isActive(TOPICS_ROUTE) ? styles.active : ''} ${
              isActive(STREAMS_ROUTE) ? styles.active : ''
            }`}
          >
            <StreamsIcon width={18} height={18} />
            <span className={styles.iconText}>Kafka</span>
          </div>
        </div>
        <div
          className={`${styles.subalign} ${isActive(TOPICS_ROUTE) ? styles.active : ''} ${
            !kafkaSectionOpen ? styles.viewClosed : ''
          }`}
        >
          <Link to={TOPICS_ROUTE} className={`${styles.sublink} ${isActive(TOPICS_ROUTE) ? styles.active : ''}`}>
            <span className={styles.iconText}>Topics</span>
          </Link>
        </div>
        <div
          className={`${styles.subalign} ${isActive(STREAMS_ROUTE) ? styles.active : ''} ${
            !kafkaSectionOpen ? styles.viewClosed : ''
          }`}
        >
          <Link to={STREAMS_ROUTE} className={`${styles.sublink} ${isActive(STREAMS_ROUTE) ? styles.active : ''}`}>
            <span className={styles.iconText}>Streams</span>
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
