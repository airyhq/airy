import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Button, Input} from 'components';
import {ConnectNewForm} from '../../ConnectNewForm';
import {cyChannelsZendeskAddButton} from 'handles';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

type ConnectNewDialogflowProps = {
  createNewConnection: (domain: string, token: string, username: string) => void;
  isEnabled: boolean;
};

export const ConnectNewZendesk = ({createNewConnection, isEnabled}: ConnectNewDialogflowProps) => {
  const componentInfo = useSelector((state: StateModel) => state.data.connector['zendesk-connector']);
  const [domain, setDomain] = useState(componentInfo?.domain || '');
  const [username, setUsername] = useState(componentInfo?.username || '');
  const [token, setToken] = useState(componentInfo?.token || '');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const {t} = useTranslation();

  const submitConfigData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNewConnection(domain, token, username);
    if (isEnabled) setIsUpdateModalVisible(true);
  };

  return (
    <ConnectNewForm
      componentName="enterprise-zendesk-connector"
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
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
      <Button
        styleVariant="small"
        type="button"
        disabled={!domain || !username || !token}
        style={{padding: '20px 60px'}}
        onClick={e => submitConfigData(e)}
        dataCy={cyChannelsZendeskAddButton}
      >
        {isEnabled ? t('Update') : t('configure')}
      </Button>
    </ConnectNewForm>
  );
};
