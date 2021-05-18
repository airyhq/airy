import React from 'react';
import {ReactComponent as InfoCircle} from 'assets/images/icons/info-circle.svg';

import styles from './style.module.scss';

type Props = {
  text: string;
  link: string;
  color: 'blue' | 'black';
  dataCy?: string;
};

export const InfoButton = ({text, link, color, dataCy}: Props) => (
  <button className={`${styles.button} ${color === 'blue' ? styles.blueButton : styles.blackButton}`} data-cy={dataCy}>
    <InfoCircle className={`${styles.circleIcon} ${color === 'blue' ? styles.blueIcon : ''}`} />
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.infoLink} ${color === 'blue' ? styles.blueLink : styles.blackLink}`}>
      {text}
    </a>
  </button>
);
