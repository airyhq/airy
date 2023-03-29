import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import styles from './styles.module.css';

const SuccessBox = ({children}) => {
  const {isDarkTheme} = useColorMode();
  return <div className={`${isDarkTheme ? styles.successBoxDark : styles.successBoxLight}`}>{children}</div>;
};

export default SuccessBox;
