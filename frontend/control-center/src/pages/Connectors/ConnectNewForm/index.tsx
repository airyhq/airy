import React from 'react';
import styles from './index.module.scss';

export const ConnectNewForm = ({children}) => {
  return (
    <section className={styles.formWrapper}>
      <div className={styles.settings}>
        <form>{children}</form>
      </div>
    </section>
  );
};
