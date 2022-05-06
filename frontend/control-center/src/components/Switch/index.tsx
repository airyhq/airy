import React from 'react';
import styles from './index.module.scss';

type SwitchProps = {
  isActive: boolean;
  toggleActive: () => void;
  onColor: string;
  id: string;
};

export const Switch = (props: SwitchProps) => {
  const {isActive, toggleActive, onColor, id} = props;
  return (
    <>
      <input className={styles.switchCheckbox} id={id} type="checkbox" checked={isActive} onChange={toggleActive} />
      <label style={{background: !isActive && onColor}} className={styles.switchLabel} htmlFor={id}>
        <span className={styles.switchButton} />
      </label>
    </>
  );
};
