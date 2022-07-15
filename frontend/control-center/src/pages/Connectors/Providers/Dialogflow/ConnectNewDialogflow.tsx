import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {Button, Input} from 'components';
import {ConnectNewForm} from '../../ConnectNewForm';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

type ConnectNewDialogflowProps = {
  createNewConnection: (
    projectId: string,
    appCredentials: string,
    suggestionConfidenceLevel: string,
    replyConfidenceLevel: string
  ) => void;
  isEnabled: boolean;
};

export const ConnectNewDialogflow = ({createNewConnection, isEnabled}: ConnectNewDialogflowProps) => {
  const componentInfo = useSelector((state: StateModel) => state.data.connector['dialogflow-connector']);
  const [projectID, setProjectID] = useState(componentInfo?.projectId || '');
  const [appCredentials, setAppCredentials] = useState(componentInfo?.dialogflowCredentials || '');
  const [suggestionConfidenceLevel, setSuggestionConfidenceLevel] = useState(
    componentInfo?.suggestionConfidenceLevel || ''
  );
  const [replyConfidenceLevel, setReplyConfidenceLevel] = useState(componentInfo?.replyConfidenceLevel || '');
  const {t} = useTranslation();

  const submitConfigData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNewConnection(projectID, appCredentials, suggestionConfidenceLevel, replyConfidenceLevel);
  };

  return (
    <ConnectNewForm>
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
      <Button
        styleVariant="small"
        type="button"
        disabled={!projectID || !appCredentials || !suggestionConfidenceLevel || !replyConfidenceLevel}
        style={{padding: '20px 60px'}}
        onClick={e => submitConfigData(e)}
      >
        {isEnabled ? t('Update') : t('configure')}
      </Button>
    </ConnectNewForm>
  );
};
