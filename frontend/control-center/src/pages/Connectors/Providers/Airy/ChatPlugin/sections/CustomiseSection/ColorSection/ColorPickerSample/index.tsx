import React from 'react';
import styles from './index.module.scss';

type ColorPickerSampleProps = {
  value: string;
  toggle: () => void;
};

export const ColorPickerSample = (props: ColorPickerSampleProps) => {
  const {value, toggle} = props;

  return <div className={styles.colorPickerSample} style={{backgroundColor: value}} onClick={toggle} />;
};
