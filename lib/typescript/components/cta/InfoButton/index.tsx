import React, {CSSProperties} from 'react';
import {ReactComponent as InfoCircle} from 'assets/images/icons/infoCircle.svg';

import styles from './style.module.scss';

type Props = {
  text: string;
  link: string;
  color?: 'blue' | 'grey';
  dataCy?: string;
  style?: CSSProperties;
  borderOff?: boolean;
};

export const InfoButton = ({text, link, color, dataCy, style, borderOff}: Props) => {
  return (
    <button
      className={`${styles.button} ${
        color === 'blue' && !borderOff ? styles.blueButton : !borderOff ? styles.greyButton : ''
      }`}
      style={style}
      data-cy={dataCy}
    >
      <div className={styles.circleIcon} ><InfoCircle className={`${color === 'blue' ? styles.blueIcon : styles.greyIcon}`} /></div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.link} ${color === 'blue' ? styles.blueLink : styles.greyLink}`}
      >
        {text}
      </a>
    </button>
  );
};
