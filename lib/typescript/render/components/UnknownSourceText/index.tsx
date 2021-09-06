import React from 'react';
import Linkify from 'linkifyjs/react';
import styles from './index.module.scss';

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
  sourceName: string;
};

export const UnknownSourceText = ({text, fromContact, sourceName}: TextRenderProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.unknownSourceHeader}>
        <span className={styles.unknownSource}>{sourceName ?? 'Unknown'} Source</span>
      </div>
      <Linkify
        tagName="div"
        className={`${fromContact ? styles.contactContent : styles.memberContent}`}
        options={{
          defaultProtocol: 'https',
          className: `${styles.messageLink} ${fromContact ? styles.contactContent : styles.memberContent}`,
        }}>
        {text}
      </Linkify>
    </div>
  );
};
