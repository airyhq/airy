import React, {useState} from 'react';
import {useCurrentConnectorForSource, useCurrentComponentForSource} from '../../../../selectors';
import {Input} from 'components';
import {ConfigureConnector} from '../../ConfigureConnector';
import {useTranslation} from 'react-i18next';
import {Source} from 'model';
import styles from './RasaConnect.module.scss';

interface ConnectParams {
  [key: string]: string;
}

type RasaConnectProps = {
  createNewConnection: (configValues: ConnectParams) => void;
  isEnabled: boolean;
  isConfigured: boolean;
  isPending: boolean;
};

export const RasaConnect = ({createNewConnection, isEnabled, isConfigured, isPending}: RasaConnectProps) => {
  const componentInfo = useCurrentConnectorForSource(Source.rasa);
  const componentName = useCurrentComponentForSource(Source.rasa)?.name;

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
    createNewConnection({webhookUrl, apiHost, token});
  };

  return (
    <ConfigureConnector
      componentName={componentName}
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      disabled={!isUrlValid || componentInfo?.webhookUrl === webhookUrl}
      isConfigured={isConfigured}
      updateConfig={updateConfig}
      isPending={isPending}
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
