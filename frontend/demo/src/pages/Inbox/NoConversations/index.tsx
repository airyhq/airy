import React from 'react';
import styles from './index.module.scss';

const NoConversations = () => {
  return Object.keys({}).length === 0 ? (
    <div className={styles.component}>
      <strong>{'messenger.emptyState.headline'}</strong>
      <p>{'messenger.emptyState.description'}</p>
    </div>
  ) : (
    <div className={styles.component}>
      <strong>{'messenger.noResult.headline'}</strong>
      <p>{'messenger.noResult.description'}</p>
    </div>
  );
};

export default NoConversations;
