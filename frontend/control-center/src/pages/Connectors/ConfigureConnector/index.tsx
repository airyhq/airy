import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import RestartPopUp from '../RestartPopUp';
import {SmartButton} from 'components';
import {cyConnectorAddButton} from 'handles';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import {SetConfigInputs} from './SetConfigInputs/SetConfigInputs';
import {updateConnectorConfiguration} from '../../../actions';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';
import {NotificationModel} from 'model';

const mapStateToProps = (state: StateModel) => {
  return {
    config: state.data.connector,
  };
};

const mapDispatchToProps = {
  updateConnectorConfiguration,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConfigureConnectorProps = {
  componentName: string;
  isEnabled: boolean;
  isConfigured: boolean;
  configValues: {[key: string]: string};
  source: string;
  setNotification: Dispatch<SetStateAction<NotificationModel>>;
} & ConnectedProps<typeof connector>;

const ConfigureConnector = (props: ConfigureConnectorProps) => {
  const {componentName, isConfigured, configValues, isEnabled, updateConnectorConfiguration, source} = props;
  const {t} = useTranslation();
  const [config, setConfig] = useState(configValues);
  const [isPending, setIsPending] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [configurationButtonDisabled, setConfigurationButtonDisabled] = useState(true);

  useEffect(() => {
    Object.keys(config).length > 0 &&
      Object.values(config).map(item => {
        item !== 'string' && item !== '' ? setConfigurationButtonDisabled(false) : setConfigurationButtonDisabled(true);
      });
  }, [config]);

  const updateConfig = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEnabled) {
      setIsUpdateModalVisible(true);
    } else {
      enableSubmitConfigData();
    }
  };

  const enableSubmitConfigData = () => {
    config && createNewConnection(config);
  };

  const createNewConnection = (configurationValues: {}) => {
    setIsPending(true);

    const payload: UpdateComponentConfigurationRequestPayload = {
      components: [
        {
          name: componentName,
          enabled: true,
          data: configurationValues,
        },
      ],
    };

    updateConnectorConfiguration(payload)
      .then(() => {
        props.setNotification({
          show: true,
          text: isConfigured ? t('updateSuccessfulConfiguration') : t('successfulConfiguration'),
          successful: true,
        });
      })
      .catch((error: Error) => {
        console.error(error);
        props.setNotification({
          show: true,
          text: isConfigured ? t('updateFailedConfiguration') : t('failedConfiguration'),
          successful: false,
        });
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <section className={styles.formWrapper}>
      <SetConfigInputs
        configurationValues={configValues}
        storedConfig={props.config[componentName]}
        setConfig={setConfig}
        source={source}
      />
      <SmartButton
        height={40}
        width={220}
        title={isConfigured ? t('Update') : t('configure')}
        pending={isPending}
        styleVariant="small"
        type="button"
        disabled={configurationButtonDisabled}
        onClick={e => updateConfig(e)}
        dataCy={cyConnectorAddButton}
      />
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

export default connector(ConfigureConnector);
