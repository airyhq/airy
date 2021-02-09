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

const Box = ({icon, title, description, link, cutomizedBackgroundColor, cutomizedHoverColor, history}) => {
  const {isDarkTheme} = useThemeContext();

  if (cutomizedBackgroundColor) {
    cutomizedBackgroundColor = isDarkTheme ? adjust(cutomizedBackgroundColor, -100) : cutomizedBackgroundColor;
  }

  if (cutomizedHoverColor) {
    cutomizedHoverColor = isDarkTheme ? adjust(cutomizedHoverColor, -100) : cutomizedHoverColor;
  }

  return (
    <div
      className={`${isDarkTheme ? styles.containerDark : styles.containerLight}`}
      style={{backgroundColor: cutomizedBackgroundColor, boxShadow: `0px 0px 0px 4px ${cutomizedHoverColor}`}}
      onClick={() => history.push(link)}>
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
