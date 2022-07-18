import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Button, Input} from 'components';
import {ConnectNewForm} from '../../ConnectNewForm';
import {cyChannelsSalesforceAddButton} from 'handles';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';

type ConnectNewSalesforceProps = {
  createNewConnection: (url: string, username: string, password: string, securityToken: string) => void;
  isEnabled: boolean;
};

export const ConnectNewSalesforce = ({createNewConnection, isEnabled}: ConnectNewSalesforceProps) => {
  const componentInfo = useSelector((state: StateModel) => state.data.connector['salesforce-contacts-ingestion']);
  const [url, setUrl] = useState(componentInfo?.url || '');
  const [username, setUsername] = useState(componentInfo?.username || '');
  const [password, setPassword] = useState(componentInfo?.password || '');
  const [securityToken, setSecurityToken] = useState(componentInfo?.securityToken || '');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const {t} = useTranslation();

  const submitConfigData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNewConnection(url, username, password, securityToken);
    if (isEnabled) setIsUpdateModalVisible(true);
  };

  return (
    <ConnectNewForm
      componentName="enterprise-dialogflow-connector"
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
    >
      <div className={styles.formRow}>
        <Input
          type="text"
          name="url"
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          label={t('salesforceOrgUrl')}
          placeholder={t('yourSalesforceOrgUrl')}
          showLabelIcon
          tooltipText={t('salesforceOrgUrlExample')}
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
          label={t('Username')}
          placeholder={t('yourSalesforceUsername')}
          showLabelIcon
          tooltipText={t('yourSalesforceUsername')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          name="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          label={t('Password')}
          placeholder={t('yourSalesforcePassword')}
          showLabelIcon
          tooltipText={t('yourSalesforcePassword')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          name="securityToken"
          value={securityToken}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecurityToken(e.target.value)}
          label={t('securityToken')}
          placeholder={t('yourSalesforceSecurityToken')}
          showLabelIcon
          tooltipText={t('yourSalesforceSecurityToken')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>
      <Button
        styleVariant="small"
        type="button"
        disabled={!url || !username || !password || !securityToken}
        style={{padding: '20px 60px'}}
        onClick={e => submitConfigData(e)}
        dataCy={cyChannelsSalesforceAddButton}
      >
        {isEnabled ? t('Update') : t('configure')}
      </Button>
    </ConnectNewForm>
  );
};
