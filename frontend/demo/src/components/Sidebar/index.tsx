import React from 'react';
import {withRouter, Link, matchPath} from 'react-router-dom';
import {ReactSVG} from 'react-svg';

import performance from '../../assets/images/icons/performance.svg';
import plug from '../../assets/images/icons/git-merge.svg';
import members from '../../assets/images/icons/user-follow.svg';
import billing from '../../assets/images/icons/billing-nav.svg';
import airy from '../../assets/images/icons/airy-messenger-nav.svg';

import styles from './index.module.scss';
import {
  ANALYTICS_ROUTE,
  CHANNELS_ROUTE,
  MEMBERS_ROUTE,  
} from '../../routes/routes';

const Sidebar = props => {
  const isActive = route => {
    return !!matchPath(props.location.pathname, route);
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.linkSection}>
        <div className={styles.align}>
          <Link to={ANALYTICS_ROUTE} className={`${styles.link} ${isActive(ANALYTICS_ROUTE) ? styles.active : ''}`}>
            <ReactSVG src={performance} />
            <span className={styles.iconText}>Analytics</span>
          </Link>
        </div>       
        <div className={styles.align}>
          <Link to={CHANNELS_ROUTE} className={`${styles.link} ${isActive(CHANNELS_ROUTE) ? styles.active : ''}`}>
            <ReactSVG src={plug} />
            <span className={styles.iconText}>Channels</span>
          </Link>
        </div>        
        <div className={styles.align}>
          <Link to={MEMBERS_ROUTE} className={`${styles.link} ${isActive(MEMBERS_ROUTE) ? styles.active : ''}`}>
            <ReactSVG src={members} />
            <span className={styles.iconText}>Members</span>
          </Link>
        </div>        
        <div className={styles.align}>
          <a href="https://billing.airy.co" target="_blank" rel="noopener noreferrer" className={styles.linkExternal}>
            <ReactSVG src={billing} />
            <span className={styles.iconText}>Billing</span>
          </a>        
        </div>
        <div className={styles.align}>
          <a href="https://app.airy.co" target="_blank" rel="noopener noreferrer" className={styles.linkExternal}>
            <ReactSVG src={airy} />
            <span className={styles.iconText}>Airy Messenger</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Sidebar);
