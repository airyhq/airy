import React from 'react';
import styles from './index.module.scss';

type ColorPickerProps = {
  setColorStep: () => void;
  background: string;
  activeColorStep: number;
  colorStep: number;
};

export const ColorPicker = (props: ColorPickerProps) => {
  const {setColorStep, background, activeColorStep, colorStep} = props;
  return (
    <div className={styles.inactiveColorStep} onClick={setColorStep} style={{background: background}}>
      {activeColorStep === colorStep && <div className={styles.activeColorStep} />}
    </div>
  );
};
