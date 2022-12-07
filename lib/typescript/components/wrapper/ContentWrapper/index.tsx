import React from 'react';
import styles from './index.module.scss';

type ContentWrapperProps = {
  transparent: boolean;
  content: React.ReactNode;
  header?: React.ReactNode;
  bar?: React.ReactNode;
  variantHeight?: 'medium' | 'big' | 'large';
  isSideColumn?: boolean;
  sideColumnContent?: React.ReactNode;
};

export const ContentWrapper = (props: ContentWrapperProps) => {
  const {transparent, content, header, bar, variantHeight, isSideColumn, sideColumnContent} = props;

  return (
    <>
      {transparent ? (
        <div className={styles.transparent}>
          <div
            className={`${styles.transparentHeader} ${
              variantHeight === 'medium'
                ? styles.headerMedium
                : variantHeight === 'big'
                ? styles.headerBig
                : variantHeight === 'large'
                ? styles.headerBig
                : {}
            }`}
          >
            {header}
          </div>
          {bar}
          <section className={styles.sideColumn}>{sideColumnContent}</section>
          <div className={`${styles.transparentContent} ${isSideColumn ? styles.leftOffset : ''}`}>{content}</div>
        </div>
      ) : (
        <div className={styles.colored}>{content}</div>
      )}
    </>
  );
};
