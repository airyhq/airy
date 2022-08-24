import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Input} from 'components';
import {ConfigureConnector} from '../../ConfigureConnector';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {ComponentName, ConnectorName} from 'model';

type ConnectNewSalesforceProps = {
  createNewConnection: (url: string, username: string, password: string, securityToken: string) => void;
  isEnabled: boolean;
  isConfigured: boolean;
};

export const ConnectNewSalesforce = ({createNewConnection, isEnabled, isConfigured}: ConnectNewSalesforceProps) => {
  const componentInfo = useSelector(
    (state: StateModel) => state.data.connector[ConnectorName.salesforceContactsIngestion]
  );
  const [url, setUrl] = useState(componentInfo?.url || '');
  const [username, setUsername] = useState(componentInfo?.username || '');
  const [password, setPassword] = useState(componentInfo?.password || '');
  const [securityToken, setSecurityToken] = useState(componentInfo?.securityToken || '');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const {t} = useTranslation();
  const isUrlValid = url && (url.startsWith('https') || url.startsWith('http'));

  const updateConfig = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEnabled) {
      setIsUpdateModalVisible(true);
    } else {
      enableSubmitConfigData();
    }
  };

  const enableSubmitConfigData = () => {
    createNewConnection(url, username, password, securityToken);
  };

  return (
    <ConfigureConnector
      componentName={ComponentName.enterpriseSalesforceContactsIngestion}
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      disabled={!isUrlValid || !username || !password || !securityToken}
      isConfigured={isConfigured}
      updateConfig={updateConfig}
    >
      <div className={styles.formRow}>
        <Input
          type="url"
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
    </ConfigureConnector>
  );
};
