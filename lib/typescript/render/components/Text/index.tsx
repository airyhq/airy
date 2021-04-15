import React from 'react';
import styles from './index.module.scss';
import {DefaultRenderingProps} from '../../props';

type TextRenderProps = DefaultRenderingProps & {
  text: string;
};

export const Text = ({text, fromContact}: TextRenderProps) => (
  <div className={`${styles.textMessage} ${fromContact ? styles.contactContent : styles.memberContent}`}>{text}</div>
);
