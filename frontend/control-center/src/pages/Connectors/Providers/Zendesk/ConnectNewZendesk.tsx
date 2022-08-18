import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Input} from 'components';
import {ConnectNewForm} from '../../ConnectNewForm';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

type ConnectNewDialogflowProps = {
  createNewConnection: (domain: string, token: string, username: string) => void;
  isEnabled: boolean;
  isConfigured: boolean;
};

export const ConnectNewZendesk = ({createNewConnection, isEnabled, isConfigured}: ConnectNewDialogflowProps) => {
  const componentInfo = useSelector((state: StateModel) => state.data.connector['zendesk-connector']);
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
    createNewConnection(domain, token, username);
  };

  return (
    <ConnectNewForm
      componentName="enterprise-zendesk-connector"
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      disabled={!domain || !username || !token}
      isConfigured={isConfigured}
      updateConfig={updateConfig}
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
    </ConnectNewForm>
  );
};
