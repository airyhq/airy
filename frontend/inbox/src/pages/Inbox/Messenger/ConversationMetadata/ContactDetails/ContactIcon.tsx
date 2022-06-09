import React from 'react';
import {ReactComponent as EmailIcon} from 'assets/images/icons/email.svg';
import {ReactComponent as PhoneIcon} from 'assets/images/icons/phone.svg';
import {ReactComponent as PencilIcon} from 'assets/images/icons/pencil.svg';
import {ReactComponent as HomeIcon} from 'assets/images/icons/home.svg';
import {ReactComponent as SuitcaseIcon} from 'assets/images/icons/suitcase.svg';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

export const ContactIcon = (infoName: string): JSX.Element => {
  const {t} = useTranslation();

  switch (infoName) {
    case t('email'):
      return <EmailIcon className={styles.infoIcon} />;
    case t('phone'):
      return <PhoneIcon className={styles.infoIcon} />;
    case t('title'):
      return <PencilIcon className={styles.infoIcon} />;
    case t('address'):
    case t('city'):
      return <HomeIcon className={styles.infoIcon} />;
    case t('organization'):
      return <SuitcaseIcon className={styles.infoIcon} />;
    default:
      return null;
  }
};
