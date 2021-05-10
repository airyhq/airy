import React from 'react';
import Linkify from 'linkifyjs/react';
import styles from './index.module.scss';

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
};

export const Text = ({text, fromContact}: TextRenderProps) => (
  <Linkify
    tagName="div"
    className={`${styles.textMessage} ${fromContact ? styles.contactContent : styles.memberContent}`}
    options={{
      defaultProtocol: 'https',
      className: `${styles.messageLink} ${fromContact ? styles.contactContent : styles.memberContent}`,
    }}>
    {text}
  </Linkify>
);
