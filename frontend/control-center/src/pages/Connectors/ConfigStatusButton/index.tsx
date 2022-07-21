import React from 'react';
import {Button} from 'components';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';

interface ConfigStatusButtonProps {
  enabled: 'Enabled' | 'Not Configured' | 'Disabled';
  customStyle?: string;
}

export const ConfigStatusButton = (props: ConfigStatusButtonProps) => {
  const {enabled, customStyle} = props;
  const {t} = useTranslation();

  return (
    <Button
      styleVariant="extra-small"
      className={`${styles.installationButton} ${customStyle ?? ''} ${
        enabled === 'Enabled'
          ? styles.buttonEnabled
          : enabled === 'Not Configured'
          ? styles.buttonNotConfigured
          : styles.buttonDisabled
      }`}
    >
      {t(`${enabled}`)}
    </Button>
  );
};
