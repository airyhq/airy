import React, {useState} from 'react';
import RestartPopUp from '../RestartPopUp';
import {SmartButton} from 'components';
import {cyConnectorAddButton} from 'handles';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import {SetConfigInputs} from './SetConfigInputs/SetConfigInputs';
import {removePrefix} from '../../../services';
import {updateConnectorConfiguration} from '../../../actions';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';

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
} & ConnectedProps<typeof connector>;

const ConfigureConnector = (props: ConfigureConnectorProps) => {
  const {componentName, isConfigured, configValues, isEnabled, updateConnectorConfiguration, source} = props;
  const {t} = useTranslation();
  const displayName = componentName && removePrefix(componentName);
  const [config, setConfig] = useState(configValues);
  const [isPending, setIsPending] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

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
          name: componentName && removePrefix(componentName),
          enabled: true,
          data: configurationValues,
        },
      ],
    };

    updateConnectorConfiguration(payload)
      .catch((error: Error) => {
        console.error(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <section className={styles.formWrapper}>
      <div className={styles.settings}>
        <form>
          <div className={styles.formRow}>
            <SetConfigInputs
              configurationValues={configValues}
              storedConfig={props.config[displayName]}
              setConfig={setConfig}
              source={source}
            />
            <SmartButton
              height={40}
              width={260}
              title={isConfigured ? t('Update') : t('configure')}
              pending={isPending}
              styleVariant="small"
              type="button"
              disabled={false}
              onClick={e => updateConfig(e)}
              dataCy={cyConnectorAddButton}
            />
          </div>
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

export default connector(ConfigureConnector);
