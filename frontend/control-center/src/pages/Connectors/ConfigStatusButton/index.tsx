import React from 'react';
import {Button} from 'components';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {ComponentStatus} from '..';

interface ConfigStatusButtonProps {
  enabled: ComponentStatus;
  customStyle?: string;
}

export const ConfigStatusButton = (props: ConfigStatusButtonProps) => {
  const {enabled, customStyle} = props;
  const {t} = useTranslation();

  return (
    <Button
      styleVariant="extra-small"
      className={`${styles.installationButton} ${customStyle ?? ''} ${
        enabled === ComponentStatus.enabled
          ? styles.buttonEnabled
          : enabled === ComponentStatus.notConfigured
          ? styles.buttonNotConfigured
          : styles.buttonDisabled
      }`}
    >
      {t(`${enabled}`)}
    </Button>
  );
};
