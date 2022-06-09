import React from 'react';
import styles from './style.module.scss';

type ToggleType = {
  value: boolean;
  text?: string;
  updateValue: (value: boolean) => void;
  variant?: 'blue' | 'green'; //default is blue
  size?: 'big' | 'small'; //default is big
  emojiBefore?: string;
  emojiAfter?: string;
};

export const Toggle = ({value, text, updateValue, variant, size, emojiBefore, emojiAfter}: ToggleType) => {
  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => updateValue(event.target.checked);

  return (
    <label className={styles.toggleLabel}>
      <span className={`${styles.switch} ${size === 'small' ? styles.small : styles.big}`}>
        <input type="checkbox" onChange={onCheckboxChange} checked={value} />
        <span
          className={`${styles.slider} ${variant === 'green' ? styles.sliderGreen : styles.sliderBlue} ${
            size === 'small' ? styles.sliderSmall : styles.sliderBig
          } ${value ? styles.emojiAfter : styles.emojiBefore}`}
          data-testid="toggle-emoji"
        >
          {value ? emojiAfter : emojiBefore}
        </span>
      </span>
      {text && <span className={styles.toggleText}>{text}</span>}
    </label>
  );
};
