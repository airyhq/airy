import React from 'react';
import styles from './index.module.scss';

type ContentWrapperProps = {
  transparent: boolean;
  content: React.ReactNode;
  header?: React.ReactNode;
};

export const ContentWrapper = (props: ContentWrapperProps) => {
  const {transparent, content, header} = props;

  return (
    <>
      {transparent ? (
        <div className={styles.transparent}>
          <div className={styles.transparentHeader}>{header}</div>
          <div className={styles.transparentContent}>{content}</div>
        </div>
      ) : (
        <div className={styles.colored}>{content}</div>
      )}
    </>
  );
};
