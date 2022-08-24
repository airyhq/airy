import React, {SetStateAction} from 'react';
import RestartPopUp from '../RestartPopUp';
import {Button} from 'components';
import {cyConnectorAddButton} from 'handles';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';

interface ConfigureConnectorProps {
  children: JSX.Element[] | JSX.Element;
  componentName: string;
  isUpdateModalVisible: boolean;
  setIsUpdateModalVisible: React.Dispatch<SetStateAction<boolean>>;
  enableSubmitConfigData: () => void;
  disabled: boolean;
  isConfigured: boolean;
  updateConfig: (e: React.FormEvent) => void;
}

export const ConfigureConnector = ({
  children,
  componentName,
  isUpdateModalVisible,
  setIsUpdateModalVisible,
  enableSubmitConfigData,
  disabled,
  isConfigured,
  updateConfig,
}: ConfigureConnectorProps) => {
  const {t} = useTranslation();

  return (
    <section className={styles.formWrapper}>
      <div className={styles.settings}>
        <form>
          {children}
          <Button
            styleVariant="small"
            type="button"
            disabled={disabled}
            style={{padding: '20px 60px'}}
            onClick={(e: React.FormEvent) => updateConfig(e)}
            dataCy={cyConnectorAddButton}
          >
            {isConfigured ? t('Update') : t('configure')}
          </Button>
        </form>
      </div>
      {isUpdateModalVisible && (
        <RestartPopUp
          componentName={componentName}
          closeRestartPopUp={() => setIsUpdateModalVisible(false)}
          enableSubmitConfigData={enableSubmitConfigData}
        />
      )}
    </section>
  );
};
