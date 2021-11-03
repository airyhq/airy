import React from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';

const TLDR = ({children}) => {
  const {isDarkTheme} = useThemeContext();

  const color = isDarkTheme ? '#4BB3FD' : '#F1FAFF';
  const leftBarColor = isDarkTheme ? '#1578D4' : '#4BB3FD';

  return (
    <blockquote
      style={{
        backgroundColor: color,
        borderLeft: `6px solid ${leftBarColor}`,
      }}
    >
      {children}
    </blockquote>
  );
};

export default TLDR;
