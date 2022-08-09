import React from 'react';
import styles from './index.module.scss';

type ContentWrapperProps = {
  transparent: boolean;
  content: React.ReactNode;
  header?: React.ReactNode;
  variantHeight?: 'medium' | 'big' | 'large';
  leftOffset?: boolean;
  sideColumn?: React.ReactNode;
};

export const ContentWrapper = (props: ContentWrapperProps) => {
  const {transparent, content, header, variantHeight, leftOffset, sideColumn} = props;

  return (
    <>
      {transparent ? (
        <div className={styles.transparent}>
          <div
            className={`${styles.transparentHeader} ${
              variantHeight === 'medium' ? styles.headerMedium : variantHeight === 'big' ? styles.headerBig : styles.headerLarge
            }`}
          >
            {header}
          </div>
            <section className={styles.sideColumn}>{sideColumn}</section>
          <div className={`${styles.transparentContent} ${leftOffset ?  styles.leftOffset : ''}`}>{content}</div>
        </div>
      ) : (
        <div className={styles.colored}>{content}</div>
      )}
    </>
  );
};
