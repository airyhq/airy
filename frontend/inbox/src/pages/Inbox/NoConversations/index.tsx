import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';

interface NoConversationsProps {
  filterSet: boolean;
  conversations: number;
}

const NoConversations = (props: NoConversationsProps) => {
  const {t} = useTranslation();
  return props.conversations === 0 && props.filterSet === false ? (
    <div className={styles.component}>
      <strong>{t<string>('newMessagesWillAppearHere')}</strong>
      <p>{t<string>('newMessagesWillAppearHereText')}</p>
    </div>
  ) : (
    <div className={styles.component}>
      <strong>{t<string>('nothingFound')}</strong>
      <p>{t<string>('noMatchingConversations')}</p>
    </div>
  );
};

export default NoConversations;
