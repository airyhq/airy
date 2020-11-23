import React from "react";
import { withRouter, Link, matchPath, RouteProps } from "react-router-dom";

import { ReactComponent as PlugIcon } from "../../assets/images/icons/git-merge.svg";
import { ReactComponent as TagIcon } from "../../assets/images/icons/price-tag.svg";

import { CHANNELS_ROUTE, TAGS_ROUTE } from "../../routes/routes";

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
            to={TAGS_ROUTE}
            className={`${styles.link} ${
              isActive(TAGS_ROUTE) ? styles.active : ""
            }`}
          >
            <TagIcon />
            <span className={styles.iconText}>Tags</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Sidebar);
