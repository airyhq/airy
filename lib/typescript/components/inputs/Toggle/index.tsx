import React from 'react';
import styles from './style.module.scss';

type ToggleType = {
  value: boolean;
  text: string;
  updateValue: (value: boolean) => void;
};

export const Toggle = ({value, text, updateValue}: ToggleType) => {
  const onCheckboxChange = event => {
    updateValue(event.target.checked);
  };
  return (
    <label>
      <span className={styles.switch}>
        <input type="checkbox" onChange={onCheckboxChange} checked={value} />
        <span className={styles.slider}></span>
      </span>
      <span>{text}</span>
    </label>
  );
};
