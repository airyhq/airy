import React, {useEffect, useState} from 'react';
import {Link, useMatch} from 'react-router-dom';

import {ReactComponent as InboxIcon} from 'assets/images/icons/inbox.svg';
import {ReactComponent as TagIcon} from 'assets/images/icons/priceTag.svg';
import {ReactComponent as ContactIcon} from 'assets/images/icons/contactIcon.svg';

import {CONTACTS_ROUTE, INBOX_ROUTE, TAGS_ROUTE} from '../../routes/routes';

import styles from './index.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../reducers';
import {ComponentName} from 'model';

type SideBarProps = {} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  version: state.data.config.clusterVersion,
  components: state.data.config.components,
});

const connector = connect(mapStateToProps);

const Sidebar = (props: SideBarProps) => {
  const isActive = (route: string) => {
    return useMatch(`${route}/*`);
  };

  useEffect(() => {
    Object.entries(props.components).length > 0 &&
      setContactsEnabled(props.components[ComponentName.apiContacts]?.enabled || false);
  }, [props.components]);

  const [contactsEnabled, setContactsEnabled] = useState(props.components[ComponentName.apiContacts]?.enabled || false);

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
        <div
          className={`${styles.align} ${isActive(CONTACTS_ROUTE) ? styles.active : ''} ${
            !contactsEnabled && styles.inactive
          }`}
        >
          <Link to={CONTACTS_ROUTE} className={`${styles.link} ${isActive(CONTACTS_ROUTE) ? styles.active : ''}`}>
            <ContactIcon width={'18px'} />
            <span className={styles.iconText}>Contacts</span>
          </Link>
        </div>
      </div>
      <span className={styles.version}>Version {props.version}</span>
    </nav>
  );
};

export default connector(Sidebar);
