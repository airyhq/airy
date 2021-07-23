import React from 'react';
import Linkify from 'linkifyjs/react';
import styles from './index.module.scss';

type TextRenderProps = {
  text: string;
  className?: string;
  fromContact?: boolean;
};

export const Text = ({text, fromContact, className}: TextRenderProps) => (
  <Linkify
    tagName="div"
    className={`${fromContact ? styles.contactContent : styles.memberContent} ${className || ''}`}
    options={{
      defaultProtocol: 'https',
      className: `${styles.messageLink} ${fromContact ? styles.contactContent : styles.memberContent}`,
    }}>
    {text}
  </Linkify>
);
