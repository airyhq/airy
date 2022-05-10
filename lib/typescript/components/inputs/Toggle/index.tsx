import React, {useState} from 'react';
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
  const [emoji, setEmoji] = useState(emojiBefore);

  const onCheckboxChange = event => {
    updateValue(event.target.checked);
    emoji && emoji === emojiBefore ? setEmoji(emojiAfter) : setEmoji(emojiBefore);
  };

  return (
    <label className={styles.toggleLabel}>
      <span className={`${styles.switch} ${size === 'small' ? styles.small : styles.big}`}>
        <input type="checkbox" onChange={onCheckboxChange} checked={value} />
        <span
          className={`${styles.slider} ${variant === 'green' ? styles.sliderGreen : styles.sliderBlue} ${
            size === 'small' ? styles.sliderSmall : styles.sliderBig
          } ${emoji === emojiAfter ? styles.emojiBefore : styles.emojiAfter}`}>
          {emoji ?? ''}
        </span>
      </span>
      {text && <span>{text}</span>}
    </label>
  );
};
