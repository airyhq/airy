import React from 'react';
import {ReactComponent as InfoCircle} from 'assets/images/icons/info-circle.svg';

import styles from './style.module.scss';

type Props = {
  text: string;
  link: string;
  color: 'blue' | 'grey';
  dataCy?: string;
};

export const InfoButton = ({text, link, color, dataCy}: Props) => (
  <button className={`${styles.button} ${color === 'blue' ? styles.blueButton : styles.greyButton}`} data-cy={dataCy}>
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
