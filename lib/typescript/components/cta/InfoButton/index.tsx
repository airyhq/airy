import React, {CSSProperties} from 'react';
import {ReactComponent as InfoCircle} from 'assets/images/icons/infoCircle.svg';

import styles from './style.module.scss';

type Props = {
  text: string;
  link: string;
  color?: 'blue' | 'grey';
  dataCy?: string;
  style?: CSSProperties;
};

export const InfoButton = ({text, link, color, dataCy, style}: Props) => (
  <button
    className={`${styles.button} ${color === 'blue' ? styles.blueButton : styles.greyButton}`}
    style={style}
    data-cy={dataCy}
  >
    <InfoCircle className={`${styles.circleIcon} ${color === 'blue' ? styles.blueIcon : styles.greyIcon}`} />
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
