import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

export const LinkButton = ({children, onClick, type}) => (
  <button type={type} className={styles.button} onClick={onClick}>
    {children}
  </button>
);

LinkButton.propTypes = {
  /** button text */
  children: PropTypes.node.isRequired,
  /** button clicked callback */
  onClick: PropTypes.func,
  /** the button type */
  type: PropTypes.string,
};
