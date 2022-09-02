import React, {useState} from 'react';
import {useCurrentConnectorForSource, useCurrentComponentForSource} from '../../../../selectors';
import {Input} from 'components';
import {ConfigureConnector} from '../../ConfigureConnector';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';
import {Source} from 'model';

interface ConnectParams {
  [key: string]: string;
}

type ConnectNewDialogflowProps = {
  createNewConnection: (configValues: ConnectParams) => void;
  isEnabled: boolean;
  isConfigured: boolean;
  isPending: boolean;
};

export const ConnectNewZendesk = ({
  createNewConnection,
  isEnabled,
  isConfigured,
  isPending,
}: ConnectNewDialogflowProps) => {
  const componentInfo = useCurrentConnectorForSource(Source.zendesk);
  const componentName = useCurrentComponentForSource(Source.zendesk)?.name;

  const [domain, setDomain] = useState(componentInfo?.domain || '');
  const [username, setUsername] = useState(componentInfo?.username || '');
  const [token, setToken] = useState(componentInfo?.token || '');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const {t} = useTranslation();

  const updateConfig = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEnabled) {
      setIsUpdateModalVisible(true);
    } else {
      enableSubmitConfigData();
    }
  };

  const enableSubmitConfigData = () => {
    createNewConnection({domain, token, username});
  };

  return (
    <ConfigureConnector
      componentName={componentName}
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      disabled={
        !domain ||
        !username ||
        !token ||
        (componentInfo?.domain === domain && componentInfo?.username === username && componentInfo?.token === token)
      }
      isConfigured={isConfigured}
      updateConfig={updateConfig}
      isPending={isPending}
    >
      <div className={styles.formRow}>
        <Input
          type="text"
          name="domain"
          value={domain}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
          label={t('ZendeskSubDomain')}
          placeholder={t('AddDomain')}
          showLabelIcon
          tooltipText={t('ZendeskDomain')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>

      <div className={styles.formRow}>
        <Input
          type="text"
          name="username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          label={t('username')}
          placeholder={t('AddUsername')}
          showLabelIcon
          tooltipText={t('ZendeskUsername')}
          required
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
          label={t('APIToken')}
          placeholder={t('APIToken')}
          showLabelIcon
          tooltipText={t('ZendeskToken')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>
    </ConfigureConnector>
  );
};
