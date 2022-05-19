import {t} from 'i18next';
import React from 'react';
import styles from './index.module.scss';

interface NoConversationsProps {
  filterSet: boolean;
  conversations: number;
}

const NoConversations = (props: NoConversationsProps) => {
  return props.conversations === 0 && props.filterSet === false ? (
    <div className={styles.component}>
      <strong>{t('newMessagesWillAppearHere')}</strong>
      <p>{t('newMessagesWillAppearHereText')}</p>
    </div>
  ) : (
    <div className={styles.component}>
      <strong>{t('nothingFound')}</strong>
      <p>{t('noMatchingConversations')}</p>
    </div>
  );
};

export default NoConversations;
