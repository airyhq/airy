import React from 'react';
import styles from './index.module.scss';

type NotificationProps = {
  show?: boolean;
  successful?: boolean;
  text?: string;
};

export const Notification = (props: NotificationProps) => {
  const {show, successful, text} = props;

  return (
    <div
      className={`${styles.notificationContainer} ${show && styles.translateYAnimIn}`}
      style={{
        background: successful ? '#0da36b' : '#d51548',
      }}
    >
      <span className={styles.notificationText}>{text}</span>
    </div>
  );
};
