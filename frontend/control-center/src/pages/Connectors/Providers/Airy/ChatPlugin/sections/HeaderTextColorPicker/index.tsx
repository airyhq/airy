import React, {Dispatch, SetStateAction} from 'react';
import styles from './index.module.scss';

type ColorStepPickerProps = {
  background: string;
  currentStep: number;
  colorStep: number;
  //   setColorStep: () => number;
  //   setValue: Dispatch<SetStateAction<number>>;
  setValue: any;
  //   const setActiveColorStep: (value: React.SetStateAction<number>) => void
};

export const ColorStepPicker = (props: ColorStepPickerProps) => {
  const {background, currentStep, colorStep, setValue} = props;
  return (
    <div className={styles.headerTextColors}>
      <div className={styles.inactiveColorStep} onClick={setValue} style={{background: background}}>
        {colorStep === currentStep && <div className={styles.activeColorStep} />}
      </div>
    </div>
  );
};
