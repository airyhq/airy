import React from 'react';
import {Link, useMatch} from 'react-router-dom';

import {ReactComponent as InboxIcon} from 'assets/images/icons/inbox.svg';
import {ReactComponent as TagIcon} from 'assets/images/icons/priceTag.svg';
import {ReactComponent as ContactIcon} from 'assets/images/icons/contactIcon.svg';

import {CONTACTS_ROUTE, INBOX_ROUTE, TAGS_ROUTE} from '../../routes/routes';

import styles from './index.module.scss';

export const Sidebar = () => {
  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.linkSection}>
        <div className={`${styles.align} ${isActive(INBOX_ROUTE) ? styles.active : ''}`}>
          <Link to={INBOX_ROUTE} className={`${styles.link} ${isActive(INBOX_ROUTE) ? styles.active : ''}`}>
            <InboxIcon width={'24px'} />
            <span className={styles.iconText}>Inbox</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(TAGS_ROUTE) ? styles.active : ''}`}>
          <Link to={TAGS_ROUTE} className={`${styles.link} ${isActive(TAGS_ROUTE) ? styles.active : ''}`}>
            <TagIcon width={'24px'} />
            <span className={styles.iconText}>Tags</span>
          </Link>
        </div>
        <div className={`${styles.align} ${isActive(CONTACTS_ROUTE) ? styles.active : ''}`}>
          <Link to={CONTACTS_ROUTE} className={`${styles.link} ${isActive(CONTACTS_ROUTE) ? styles.active : ''}`}>
            <ContactIcon width={'18px'} />
            <span className={styles.iconText}>Contacts</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
