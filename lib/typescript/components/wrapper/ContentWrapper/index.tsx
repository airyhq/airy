import React from 'react';
import styles from './index.module.scss';

type ContentWrapperProps = {
  transparent: boolean;
  content: React.ReactNode;
  header?: React.ReactNode;
  variantHeight?:'big' | 'medium';
};

export const ContentWrapper = (props: ContentWrapperProps) => {
  let {transparent, content, header, variantHeight} = props;

  return (
    <>
      {transparent ? (
        <div className={styles.transparent}>
          <div className={`${styles.transparentHeader} ${variantHeight === 'big' ? styles.headerBig : styles.headerMedium}`}>{header}</div>
          <div className={styles.transparentContent}>{content}</div>
        </div>
      ) : (
        <div className={styles.colored}>{content}</div>
      )}
    </>
  );
};
