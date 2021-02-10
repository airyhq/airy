import React from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';
import styles from './styles.module.css';

const SuccessBox = ({children}) => {
  const {isDarkTheme} = useThemeContext();
  return <div className={`${isDarkTheme ? styles.successBoxDark : styles.successBoxLight}`}>{children}</div>;
};

export default SuccessBox;
