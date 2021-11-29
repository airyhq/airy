import React from 'react';
import {ReactComponent as ExclamationIcon} from 'assets/images/icons/exclamation.svg';

import styles from './style.module.scss';

type NoticeProps = {
  /** Color theme for the error notice */
  theme: 'warning' | 'error' | 'info';
  /** Error text */
  children: React.ReactNode;
  icon?: boolean;
};

const NoticeComponent = ({children, theme, icon}: NoticeProps) => {
  if (typeof icon === 'undefined') icon = true;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      {icon && (
        <div className={styles.iconWrapper}>
          <ExclamationIcon aria-hidden="true" />
        </div>
      )}

      {children}
    </div>
  );
};

export const Notice = NoticeComponent;
