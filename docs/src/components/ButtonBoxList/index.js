import React from 'react';

import styles from './styles.module.css';

const ButtonBoxList = ({children}) => {
  return (
    <ul className={styles.buttonBoxList}>
      {React.Children.map(children, c => (
        <li className={styles.buttonBoxListItem}>{c}</li>
      ))}
    </ul>
  );
};

export default ButtonBoxList;
