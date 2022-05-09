import React from 'react';
import styles from './style.module.scss';

type ToggleType = {
  value: boolean;
  text?: string;
  updateValue: (value: boolean) => void;
  variant?: 'blue' | 'green'; //default is blue
  size?: 'big' | 'small'; //default is big
};

export const Toggle = ({value, text, updateValue, variant, size}: ToggleType) => {
  const onCheckboxChange = event => {
    updateValue(event.target.checked);
  };
  return (
    <label className={styles.toggleLabel}>
      <span className={`${styles.switch} ${size === 'small' ? styles.small : styles.big}`}>
        <input type="checkbox" onChange={onCheckboxChange} checked={value} />
        <span
          className={`${styles.slider} ${variant === 'green' ? styles.sliderGreen : styles.sliderBlue} ${
            size === 'small' ? styles.sliderSmall : styles.sliderBig
          }`}
        >☀️</span>
      </span>
      {text && <span>{text}</span>}
    </label>
  );
};
