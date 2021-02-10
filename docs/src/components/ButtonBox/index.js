import React from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
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

const ButtonBox = ({children, icon, title, description, link, customizedBackgroundColor, customizedHoverColor}) => {
  const {isDarkTheme} = useThemeContext();

  if (customizedBackgroundColor) {
    customizedBackgroundColor = isDarkTheme ? adjust(customizedBackgroundColor, -100) : customizedBackgroundColor;
  }

  if (customizedHoverColor) {
    customizedHoverColor = isDarkTheme ? adjust(customizedHoverColor, -100) : customizedHoverColor;
  }

  return (
    <Link
      to={useBaseUrl(link)}
      className={`${isDarkTheme ? styles.containerDark : styles.containerLight}`}
      style={{backgroundColor: customizedBackgroundColor, boxShadow: `0px 0px 0px 4px ${customizedHoverColor}`}}>
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
      {children}
    </Link>
  );
};

export default withRouter(ButtonBox);
