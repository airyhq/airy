import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Input} from 'components';
import {ConfigureConnector} from '../../ConfigureConnector';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';
import {ComponentName, ConnectorName} from 'model';

type DialogflowConnectProps = {
  createNewConnection: (
    projectId: string,
    appCredentials: string,
    suggestionConfidenceLevel: string,
    replyConfidenceLevel: string,
    processorWaitingTime: string,
    processorCheckPeriod: string,
    defaultLanguage: string
  ) => void;
  isEnabled: boolean;
  isConfigured: boolean;
  isPending: boolean;
};

export const DialogflowConnect = ({
  createNewConnection,
  isEnabled,
  isConfigured,
  isPending,
}: DialogflowConnectProps) => {
  const componentInfo = useSelector(
    (state: StateModel) => state.data.connector[ConnectorName.enterpriseDialogflowConnector]
  );
  const [projectID, setProjectID] = useState(componentInfo?.projectId || '');
  const [appCredentials, setAppCredentials] = useState(componentInfo?.dialogflowCredentials || '');
  const [suggestionConfidenceLevel, setSuggestionConfidenceLevel] = useState(
    componentInfo?.suggestionConfidenceLevel || ''
  );
  const [replyConfidenceLevel, setReplyConfidenceLevel] = useState(componentInfo?.replyConfidenceLevel || '');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [processorWaitingTime, setProcessorWaitingTime] = useState(
    componentInfo?.connectorStoreMessagesProcessorMaxWaitMillis || '5000'
  );
  const [processorCheckPeriod, setProcessorCheckPeriod] = useState(
    componentInfo?.connectorStoreMessagesProcessorCheckPeriodMillis || '2500'
  );
  const [defaultLanguage, setDefaultLanguage] = useState(componentInfo?.connectorDefaultLanguage || 'en');

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
    createNewConnection(
      projectID,
      appCredentials,
      suggestionConfidenceLevel,
      replyConfidenceLevel,
      processorWaitingTime,
      processorCheckPeriod,
      defaultLanguage
    );
  };

  return (
    <ConfigureConnector
      componentName={ComponentName.enterpriseDialogflowConnector}
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      isPending={isPending}
      disabled={
        !projectID ||
        !appCredentials ||
        !suggestionConfidenceLevel ||
        !replyConfidenceLevel ||
        !processorWaitingTime ||
        !processorCheckPeriod ||
        !defaultLanguage
      }
      isConfigured={isConfigured}
      updateConfig={updateConfig}
    >
      <div className={styles.columnContainer}>
        <div className={styles.firstColumnForm}>
          <div className={styles.formRow}>
            <Input
              type="text"
              name="projectID"
              value={projectID}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectID(e.target.value)}
              label={t('projectID')}
              placeholder={t('AddProjectId')}
              showLabelIcon
              tooltipText={t('fromCloudConsole')}
              required
              height={32}
              fontClass="font-base"
            />
          </div>

          <div className={styles.formRow}>
            <Input
              type="text"
              name="GoogleApplicationCredentials"
              value={appCredentials}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppCredentials(e.target.value)}
              label={t('GoogleApplicationCredentials')}
              placeholder={t('AddGoogleApplicationCredentials')}
              showLabelIcon
              tooltipText={t('fromCloudConsole')}
              required
              height={32}
              fontClass="font-base"
            />
          </div>
          <div className={styles.formRow}>
            <Input
              type="number"
              step={0.01}
              min={0.1}
              max={0.9}
              name="SuggestionConfidenceLevel"
              value={suggestionConfidenceLevel}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSuggestionConfidenceLevel(e.target.value)}
              label={t('SuggestionConfidenceLevel')}
              placeholder={'0.1' + ' ' + t('to') + ' ' + '0.9'}
              showLabelIcon
              tooltipText={t('amountSuggestions')}
              required
              height={32}
              fontClass="font-base"
            />
          </div>
          <div className={styles.formRow}>
            <Input
              type="number"
              step={0.01}
              min={0.1}
              max={0.9}
              name="ReplyConfidenceLevel"
              value={replyConfidenceLevel}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyConfidenceLevel(e.target.value)}
              label={t('ReplyConfidenceLevel')}
              placeholder={'0.1' + ' ' + t('to') + ' ' + '0.9'}
              showLabelIcon
              tooltipText={t('amountReplies')}
              required
              height={32}
              fontClass="font-base"
            />
          </div>
        </div>
        <div className={styles.secondColumnForm}>
          <div className={styles.formRow}>
            <Input
              type="number"
              name="ProcessorWaitingTime"
              value={processorWaitingTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProcessorWaitingTime(e.target.value)}
              label={t('processorWaitingTime')}
              placeholder={t('processorWaitingTime')}
              showLabelIcon
              tooltipText={t('waitingDefault')}
              required
              height={32}
              fontClass="font-base"
            />
          </div>
          <div className={styles.formRow}>
            <Input
              type="number"
              name="processorCheckPeriod"
              value={processorCheckPeriod}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProcessorCheckPeriod(e.target.value)}
              label={t('processorCheckPeriod')}
              placeholder={t('processorCheckPeriod')}
              showLabelIcon
              tooltipText={t('checkDefault')}
              required
              height={32}
              fontClass="font-base"
            />
          </div>
          <div className={styles.formRow}>
            <Input
              type="text"
              name="DefaultLanguage"
              value={defaultLanguage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDefaultLanguage(e.target.value)}
              label={t('defaultLanguage')}
              placeholder={t('defaultLanguage')}
              showLabelIcon
              tooltipText={t('defaultLanguageTooltip')}
              required
              height={32}
              fontClass="font-base"
            />
          </div>
        </div>
      </div>
    </ConfigureConnector>
  );
};
