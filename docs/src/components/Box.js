import React from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';

const adjust = (color, amount) => {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2))
  );
};

const Box = ({children, color}) => {
  const {isDarkTheme} = useThemeContext();

  if (typeof color == 'undefined') {
    color = isDarkTheme ? '#4BB3FD' : '#F1FAFF';
  } else {
    color = isDarkTheme ? adjust(color, -100) : color;
  }

  return (
    <div
      style={{
        backgroundColor: color,
        padding: '1em',
        borderRadius: 'var(--ifm-pre-padding)',
      }}>
      {children}
    </div>
  );
};

export default Box;
