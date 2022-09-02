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

type DialogflowConnectProps = {
  createNewConnection: (configValues: ConnectParams) => void;
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
  
  const componentInfo = useCurrentConnectorForSource(Source.dialogflow);
  const componentName = useCurrentComponentForSource(Source.dialogflow)?.name

  console.log('connectorInfo', componentInfo);
  console.log('componentName', componentName);

  const [projectId, setProjectID] = useState(componentInfo?.projectId);
  const [dialogflowCredentials, setDialogflowCredentials] = useState(componentInfo?.dialogflowCredentials || '');
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
    const payload = {
      projectId,
      dialogflowCredentials,
      suggestionConfidenceLevel,
      replyConfidenceLevel,
      processorWaitingTime,
      processorCheckPeriod,
      defaultLanguage,
    };

    createNewConnection(payload);
  };

  return (
    <ConfigureConnector
      componentName={componentName}
      isUpdateModalVisible={isUpdateModalVisible}
      setIsUpdateModalVisible={setIsUpdateModalVisible}
      enableSubmitConfigData={enableSubmitConfigData}
      isPending={isPending}
      disabled={
        !projectId ||
        !dialogflowCredentials ||
        !suggestionConfidenceLevel ||
        !replyConfidenceLevel ||
        !processorWaitingTime ||
        !processorCheckPeriod ||
        !defaultLanguage ||
        (componentInfo?.projectId === projectId &&
          componentInfo?.dialogflowCredentials === dialogflowCredentials &&
          componentInfo?.suggestionConfidenceLevel === suggestionConfidenceLevel &&
          componentInfo?.replyConfidenceLevel === replyConfidenceLevel &&
          (componentInfo?.connectorStoreMessagesProcessorMaxWaitMillis || '5000') === processorWaitingTime &&
          (componentInfo?.connectorStoreMessagesProcessorCheckPeriodMillis || '2500') === processorCheckPeriod &&
          (componentInfo?.connectorDefaultLanguage || 'en') === defaultLanguage)
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
              value={projectId}
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
              value={dialogflowCredentials}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDialogflowCredentials(e.target.value)}
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
