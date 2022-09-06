import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Input} from 'components';
import {ConfigureConnector} from '../../ConfigureConnector';
import {useTranslation} from 'react-i18next';
import styles from './WhatsappBusinessCloudConnect.module.scss';
import {ComponentName, ConnectorName} from 'model';

interface ConnectParams {
  [key: string]: string;
}

type WhatsappBusinessCloudConnectProps = {
  createNewConnection: (configValues: ConnectParams) => void;
  isEnabled: boolean;
  isConfigured: boolean;
  isPending: boolean;
};

export const WhatsappBusinessCloudConnect = ({
  createNewConnection,
  isEnabled,
  isConfigured,
  isPending,
}: WhatsappBusinessCloudConnectProps) => {
  const componentInfo = useSelector(
    (state: StateModel) => state.data.connector[ConnectorName.sourcesWhatsappBusinessCloud]
  );
  const [appId, setAppId] = useState(componentInfo?.appId || '');
  const [appSecret, setAppSecret] = useState(componentInfo?.appSecret || '');
  const [phoneNumber, setPhoneNumber] = useState(componentInfo?.phoneNumber || '');
  const [name, setName] = useState(componentInfo?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(componentInfo?.avatarUrl || '');
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
    createNewConnection({appId, appSecret, phoneNumber, name, avatarUrl});
  };

  return (
    <ConfigureConnector
      componentName={ComponentName.sourcesWhatsappBusinessCloud}
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      disabled={appId === '' || appSecret === '' || phoneNumber === ''}
      isConfigured={isConfigured}
      updateConfig={updateConfig}
      isPending={isPending}
    >
      <div className={styles.formRow}>
        <Input
          type="text"
          name="appId"
          value={appId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppId(e.target.value)}
          label="App ID"
          placeholder={t('whatsappBusinessCloudAppIdPlaceholder')}
          showLabelIcon
          tooltipText={t('whatsappBusinessCloudAppIdTooltip')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          name="appSecret"
          value={appSecret}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppSecret(e.target.value)}
          label="App Secret"
          placeholder={t('whatsappBusinessCloudAppSecretPlaceholder')}
          showLabelIcon
          tooltipText={t('whatsappBusinessCloudAppSecretToolTip')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          label="Phone Number"
          placeholder={t('whatsappBusinessCloudPhoneNumberPlaceholder')}
          showLabelIcon
          tooltipText={t('whatsappBusinessCloudPhoneNumberTooltip')}
          required
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          name="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          label="Name"
          placeholder={t('name')}
          showLabelIcon
          tooltipText={t('optional')}
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={styles.formRow}>
        <Input
          type="text"
          name="avatarUrl"
          value={avatarUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarUrl(e.target.value)}
          label="Avatar Url"
          placeholder="Avatar Url"
          showLabelIcon
          tooltipText={t('optional')}
          height={32}
          fontClass="font-base"
        />
      </div>
    </ConfigureConnector>
  );
};
