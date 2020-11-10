import React from "react";
import { withRouter, Link, matchPath, RouteProps } from "react-router-dom";

import { ReactComponent as PerformanceIcon } from "../../assets/images/icons/performance.svg";
import { ReactComponent as PlugIcon } from "../../assets/images/icons/git-merge.svg";
import { ReactComponent as MembersIcon } from "../../assets/images/icons/user-follow.svg";

import {
  ANALYTICS_ROUTE,
  CHANNELS_ROUTE,
  MEMBERS_ROUTE
} from "../../routes/routes";

import styles from "./index.module.scss";

const Sidebar = (props: RouteProps) => {
  const isActive = (route: string) => {
    return !!matchPath(props.location.pathname, route);
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.linkSection}>
        <div className={styles.align}>
          <Link
            to={ANALYTICS_ROUTE}
            className={`${styles.link} ${
              isActive(ANALYTICS_ROUTE) ? styles.active : ""
            }`}
          >
            <PerformanceIcon />
            <span className={styles.iconText}>Analytics</span>
          </Link>
        </div>
        <div className={styles.align}>
          <Link
            to={CHANNELS_ROUTE}
            className={`${styles.link} ${
              isActive(CHANNELS_ROUTE) ? styles.active : ""
            }`}
          >
            <PlugIcon />
            <span className={styles.iconText}>Channels</span>
          </Link>
        </div>
        <div className={styles.align}>
          <Link
            to={MEMBERS_ROUTE}
            className={`${styles.link} ${
              isActive(MEMBERS_ROUTE) ? styles.active : ""
            }`}
          >
            <MembersIcon />
            <span className={styles.iconText}>Members</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Sidebar);
