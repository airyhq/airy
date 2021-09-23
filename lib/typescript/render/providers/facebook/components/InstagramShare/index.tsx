import React from 'react';
import {ReactComponent as RightArrowIcon} from 'assets/images/icons/rightArrow.svg';
import styles from './index.module.scss';

export const Share = ({url, fromContact}) => {
  return (
    <div className={`${fromContact ? styles.contactContent : styles.memberContent}`}>
      <div className={styles.container}>
        <a className={styles.shareLink} href={url} target="_blank" rel="noopener noreferrer">
          Shared Post
        </a>
        <RightArrowIcon />
      </div>
    </div>
  );
};
