import React from 'react';
import Linkify from 'linkify-react';
import styles from './index.module.scss';

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
  customFont?: string;
};

export const Text = ({text, fromContact, customFont}: TextRenderProps) => (
  <Linkify
    tagName="div"
    className={`${fromContact ? styles.contactContent : styles.memberContent}`}
    style={{fontFamily: customFont}}
    options={{
      defaultProtocol: 'https',
      className: `${styles.messageLink} ${fromContact ? styles.contactContent : styles.memberContent}`,
    }}
  >
    {text}
  </Linkify>
);
