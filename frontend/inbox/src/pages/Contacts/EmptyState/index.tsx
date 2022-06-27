import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {ReactComponent as EmptyContactIcon} from 'assets/images/icons/emptyContactIcon.svg';

export const EmptyState = () => {
  const {t} = useTranslation();

  return (
    <div className={styles.wrapper}>
      <section className={styles.emptyStateSection}>
        <div className={styles.headline}>
          <div>
            <h1 className={styles.headlineText}>Contacts</h1>
          </div>
        </div>
        <div className={styles.containerHeadline}>
          <h1>{t('contactName')}</h1>
          <h1>{t('conversations')}</h1>
          <h1>{t('manage')}</h1>
        </div>
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateIconContainer}>
              <EmptyContactIcon className={styles.emptyContactIcon} />
            </div>
            <h1>{t('noContacts')}</h1>
            <span>{t('emptyContacts')}</span>
          </div>
        </div>
      </section>
      <section className={styles.contactDetailSection}>
        <div className={styles.contactDetailContentContainer}>
          <div className={styles.contactDetailIconContainer}>
            <EmptyContactIcon className={styles.contactDetailIcon} />
          </div>
          <h1>{t('contactName')}</h1>
        </div>
      </section>
    </div>
  );
};
