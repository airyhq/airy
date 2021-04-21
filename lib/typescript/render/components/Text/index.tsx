import React from 'react';
import styles from './index.module.scss';

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
};

export const Text = ({text, fromContact}: TextRenderProps) => (
  <div className={`${styles.textMessage} ${fromContact ? styles.contactContent : styles.memberContent}`}>{text}</div>
);
