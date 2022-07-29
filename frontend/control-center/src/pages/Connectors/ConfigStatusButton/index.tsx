import React from 'react';
import {Button} from 'components';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {ComponentStatus} from '..';

interface ConfigStatusButtonProps {
  componentStatus: ComponentStatus;
  customStyle?: string;
}

export const ConfigStatusButton = (props: ConfigStatusButtonProps) => {
  const {componentStatus, customStyle} = props;
  const {t} = useTranslation();

  return (
    <Button
      styleVariant="extra-small"
      className={`${styles.installationButton} ${customStyle ?? ''} ${
        componentStatus === ComponentStatus.notConfigured
          ? styles.buttonNotConfigured
          : componentStatus === ComponentStatus.enabled
          ? styles.buttonEnabled
          : styles.buttonDisabled
      }`}
    >
      {/* <Button
      styleVariant="extra-small"
      className={`${styles.installationButton} ${customStyle ?? ''} ${
        componentStatus === ComponentStatus.enabled
          ? styles.buttonEnabled
          : componentStatus === ComponentStatus.notConfigured
          ? styles.buttonNotConfigured
          : styles.buttonDisabled
      }`}> */}
      {t(`${componentStatus}`)}
    </Button>
  );
};
