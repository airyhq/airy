import React from 'react';
import {ReactComponent as EmailIcon} from 'assets/images/icons/email.svg';
import {ReactComponent as PhoneIcon} from 'assets/images/icons/phone.svg';
import {ReactComponent as PencilIcon} from 'assets/images/icons/pencil.svg';
import {ReactComponent as HomeIcon} from 'assets/images/icons/home.svg';
import {ReactComponent as SuitcaseIcon} from 'assets/images/icons/suitcase.svg';
import styles from './index.module.scss';

export const ContactIcon = (infoName: string): JSX.Element => {
  switch (infoName) {
    case 'email':
      return <EmailIcon className={styles.infoIcon} />;
    case 'phone':
      return <PhoneIcon className={styles.infoIcon} />;
    case 'title':
      return <PencilIcon className={styles.infoIcon} />;
    case 'address':
    case 'city':
      return <HomeIcon className={styles.infoIcon} />;
    case 'organization':
      return <SuitcaseIcon className={styles.infoIcon} />;
    default:
      return null;
  }
};
