import React from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';
import {withRouter} from 'react-router-dom';

import styles from './styles.module.css';

const adjust = (color, amount) => {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2))
  );
};

const Box = ({icon, title, description, link, color, history}) => {
  const {isDarkTheme} = useThemeContext();

  if (typeof color == 'undefined') {
    color = isDarkTheme ? '#4BB3FD' : '#6198D1';
  } else {
    color = isDarkTheme ? adjust(color, -100) : color;
  }

  return (
    <div className={styles.container} style={{backgroundColor: color}} onClick={() => history.push(link)}>
      {icon && icon()}
      <div>
        <h4
          style={{
            margin: 0,
            color: 'white',
          }}>
          {title}
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: 'white',
          }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default withRouter(Box);
