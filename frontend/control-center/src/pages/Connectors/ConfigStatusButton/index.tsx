import React from 'react';
import {Button} from 'components';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {ComponentStatus} from '..';
import {useNavigate} from 'react-router-dom';
import {STATUS_ROUTE} from '../../../routes/routes';

interface ConfigStatusButtonProps {
  componentStatus: ComponentStatus;
  customStyle?: string;
  configurationRoute?: string;
}

export const ConfigStatusButton = (props: ConfigStatusButtonProps) => {
  const {componentStatus, customStyle, configurationRoute} = props;
  const {t} = useTranslation();
  const navigate = useNavigate();

  const handleNavigation = (componentStatus: ComponentStatus, event: Event) => {
    switch (componentStatus) {
      case ComponentStatus.notHealthy:
        event.stopPropagation();
        navigate(STATUS_ROUTE);
        break;
      case ComponentStatus.notConfigured:
        event.stopPropagation();
        configurationRoute && navigate(configurationRoute, {state: {from: 'connectors'}});
        break;
      default:
        break;
    }
  };

  return (
    <Button
      onClick={event => {
        handleNavigation(componentStatus, event);
      }}
      styleVariant="extra-small"
      className={`${styles.installationButton} ${customStyle ?? ''} ${
        componentStatus === ComponentStatus.notConfigured
          ? styles.buttonNotConfigured
          : componentStatus === ComponentStatus.notHealthy
          ? styles.buttonNotHealthy
          : componentStatus === ComponentStatus.enabled
          ? styles.buttonEnabled
          : styles.buttonDisabled
      }`}
    >
      {t(`${componentStatus}`)}
    </Button>
  );
};
