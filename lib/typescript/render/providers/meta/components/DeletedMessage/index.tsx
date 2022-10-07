import React from 'react';
import styles from './index.module.scss';

interface DeletedMessageProps {
  fromContact?: boolean;
}

export function DeletedMessage({fromContact}: DeletedMessageProps) {
  return (
    <div className={`${fromContact ? styles.contactContent : styles.memberContent}`}>
      <span className={styles.deletedMessageText}> Message deleted </span>
    </div>
  );
}
