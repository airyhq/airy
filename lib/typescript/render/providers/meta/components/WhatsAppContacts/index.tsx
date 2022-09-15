import React from 'react';
import styles from './index.module.scss';

interface WhatsAppContactsProps {
  formattedName: string;
}

export const WhatsAppContacts = ({formattedName}: WhatsAppContactsProps) => {
  return (
    <section className={styles.contactsWrapper}>
      <img src="https://s3.amazonaws.com/assets.airy.co/unknown.png" alt="shared contact" />
      <h1>{formattedName ?? 'N/A'}</h1>
    </section>
  );
};
