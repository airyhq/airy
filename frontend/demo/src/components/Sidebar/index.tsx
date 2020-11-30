import React from 'react';
import {withRouter, Link, matchPath, RouteProps} from 'react-router-dom';

import {ReactComponent as PlugIcon} from '../../assets/images/icons/git-merge.svg';
import {ReactComponent as InboxIcon} from '../../assets/images/icons/inbox.svg';

import {CHANNELS_ROUTE, INBOX_ROUTE} from '../../routes/routes';

import styles from './index.module.scss';

const Sidebar = (props: RouteProps) => {
  const isActive = (route: string) => {
    return !!matchPath(props.location.pathname, route);
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.linkSection}>       
        <div className={styles.align}>
          <Link to={INBOX_ROUTE} className={`${styles.link} ${isActive(INBOX_ROUTE) ? styles.active : ''}`}>
            <InboxIcon />
            <span className={styles.iconText}>Inbox</span>
          </Link>
        </div>
        <div className={styles.align}>
          <Link to={CHANNELS_ROUTE} className={`${styles.link} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
            <PlugIcon />
            <span className={styles.iconText}>Channels</span>
          </Link>
        </div>
      </div>      
    </nav>
  );
};

export default withRouter(Sidebar);
