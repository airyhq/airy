import React from 'react';
import {withRouter, Link, matchPath, RouteProps} from 'react-router-dom';

import {ReactComponent as PlugIcon} from '../../assets/images/icons/git-merge.svg';

import {CHANNELS_ROUTE} from '../../routes/routes';

import styles from './index.module.scss';

const Sidebar = (props: RouteProps) => {
  const isActive = (route: string) => {
    return !!matchPath(props.location.pathname, route);
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.linkSection}>
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
