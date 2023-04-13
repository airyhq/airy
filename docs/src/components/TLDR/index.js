import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';

const TLDR = ({children}) => {
  const {isDarkTheme} = useColorMode();

  const color = isDarkTheme ? '#4BB3FD' : '#F1FAFF';
  const leftBarColor = isDarkTheme ? '#1578D4' : '#4BB3FD';

  return (
    <blockquote
      style={{
        backgroundColor: color,
        borderLeft: `6px solid ${leftBarColor}`,
        paddingTop: '16px',
        paddingBottom: '16px',
      }}
    >
      {children}
    </blockquote>
  );
};

export default TLDR;
