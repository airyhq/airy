import React, {SetStateAction} from 'react';
import RestartPopUp from '../RestartPopUp';
import {SmartButton} from 'components';
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
  isPending: boolean;
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
  isPending,
}: ConfigureConnectorProps) => {
  const {t} = useTranslation();

  console.log('sdis; ', disabled);

  return (
    <section className={styles.formWrapper}>
      <div className={styles.settings}>
        <form>
          {children}
          <SmartButton
            height={40}
            width={260}
            title={isConfigured ? t('Update') : t('configure')}
            pending={isPending}
            styleVariant="small"
            type="button"
            disabled={disabled}
            onClick={(e: React.FormEvent) => updateConfig(e)}
            dataCy={cyConnectorAddButton}
          />
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
