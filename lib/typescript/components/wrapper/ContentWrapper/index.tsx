import React from 'react';
import styles from './index.module.scss';

type ContentWrapperProps = {
  transparent: boolean;
  content: React.ReactNode;
  header?: React.ReactNode;
  variantHeight?: 'medium' | 'big' | 'large';
  leftOffset?: boolean;
};

export const ContentWrapper = (props: ContentWrapperProps) => {
  const {transparent, content, header, variantHeight, leftOffset} = props;

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
          <div className={`${styles.transparentContent} ${leftOffset ?  styles.leftOffset : ''}`}>{content}</div>
        </div>
      ) : (
        <div className={styles.colored}>{content}</div>
      )}
    </>
  );
};
