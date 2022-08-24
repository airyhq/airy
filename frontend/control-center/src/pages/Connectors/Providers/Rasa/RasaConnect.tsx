import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Input} from 'components';
import {ConfigureConnector} from '../../ConfigureConnector';
import {useTranslation} from 'react-i18next';
import styles from './RasaConnect.module.scss';
import {ComponentName, ConnectorName} from 'model';

type RasaConnectProps = {
  createNewConnection: (url: string, username: string, password: string) => void;
  isEnabled: boolean;
  isConfigured: boolean;
};

export const RasaConnect = ({createNewConnection, isEnabled, isConfigured}: RasaConnectProps) => {
  const componentInfo = useSelector((state: StateModel) => state.data.connector[ConnectorName.rasaConnector]);
  const [webhookUrl, setWebhookUrl] = useState(componentInfo?.webhookUrl || '');
  const [apiHost, setApiHost] = useState(componentInfo?.apiHost || '');
  const [token, setToken] = useState(componentInfo?.token || '');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const {t} = useTranslation();
  const isUrlValid = webhookUrl && (webhookUrl.startsWith('https') || webhookUrl.startsWith('http'));

  const updateConfig = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEnabled) {
      setIsUpdateModalVisible(true);
    } else {
      enableSubmitConfigData();
    }
  };

  const enableSubmitConfigData = () => {
    createNewConnection(webhookUrl, apiHost, token);
  };

  return (
    <ConfigureConnector
      componentName={ComponentName.rasaConnector}
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      disabled={!isUrlValid}
      isConfigured={isConfigured}
      updateConfig={updateConfig}
    >
      <div className={styles.formRow}>
        <Input
          type="url"
          name="webhook"
          value={webhookUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebhookUrl(e.target.value)}
          label="Rasa Webhook"
          placeholder={t('rasaWebhookPlaceholder')}
          showLabelIcon
          tooltipText={t('rasaWebhookTooltip')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>

      <div className={styles.formRow}>
        <Input
          type="text"
          name="apiHost"
          value={apiHost}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiHost(e.target.value)}
          label="Api Host"
          placeholder={t('rasaApihostPlaceholder')}
          showLabelIcon
          tooltipText={t('rasaApihostTooltip')}
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          name="token"
          value={token}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
          label="Token"
          placeholder={t('rasaTokenPlaceholder')}
          showLabelIcon
          tooltipText={t('rasaTokenTooltip')}
          height={32}
          fontClass="font-base"
        />
      </div>
    </ConfigureConnector>
  );
};
