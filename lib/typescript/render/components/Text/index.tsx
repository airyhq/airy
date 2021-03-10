import React from 'react';
import styles from './index.module.scss';
import {DefaultMessageRenderingProps} from '../index';

type TextRenderProps = DefaultMessageRenderingProps & {
  text: string;
};

export const Text = ({text, fromContact}: TextRenderProps) => (
  <div className={`${styles.textMessage} ${fromContact ? styles.contactContent : styles.memberContent}`}>{text}</div>
);
