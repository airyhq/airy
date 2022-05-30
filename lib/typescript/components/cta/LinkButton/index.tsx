import React, {MouseEventHandler} from 'react';

import styles from './style.module.scss';

type Props = {
  children: JSX.Element | JSX.Element[];
  href?: string;
  type?: 'submit' | 'reset' | 'button';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  dataCy?: string;
};

export const LinkButton = ({children, onClick, type, dataCy}: Props) => (
  <button type={type} className={styles.button} onClick={onClick} data-cy={dataCy}>
    {children}
  </button>
);
