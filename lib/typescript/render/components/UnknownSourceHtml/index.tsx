import React from 'react';
import Linkify from 'linkify-react';
import styles from './index.module.scss';

type HtmlRenderProps = {
  html: string;
  fromContact?: boolean;
  sourceName: string;
};

export const UnknownSourceHtml = ({html, fromContact, sourceName}: HtmlRenderProps) => {
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
        }}
      >
        <div style={{overflow: 'auto', height: '100%', width: '100%'}} dangerouslySetInnerHTML={{__html: html}} />
      </Linkify>
    </div>
  );
};
