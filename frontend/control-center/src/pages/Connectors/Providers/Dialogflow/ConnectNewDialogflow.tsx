import React, {useState} from 'react';
import {Button, Input} from 'components';
import styles from './ConnectNewDialogflow.module.scss';
import {useTranslation} from 'react-i18next';

interface ConnectNewDialogflowProps {
  createNewConnection: (
    projectId: string,
    appCredentials: string,
    suggestionConfidenceLevel: string,
    replyConfidenceLevel: string
  ) => void;
}

export const ConnectNewDialogflow = ({createNewConnection}: ConnectNewDialogflowProps) => {
  const [projectID, setProjectID] = useState('');
  const [appCredentials, setAppCredentials] = useState('');
  const [suggestionConfidenceLevel, setSuggestionConfidenceLevel] = useState('');
  const [replyConfidenceLevel, setReplyConfidenceLevel] = useState('');
  const {t} = useTranslation();

  return (
    <div>
      <div className={styles.formWrapper}>
        <div className={styles.settings}>
          <form>
            <div className={styles.formRow}>
              <Input
                type="text"
                name="projectID"
                value={projectID}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectID(e.target.value)}
                label={t('projectID')}
                placeholder={t('AddProjectId')}
                showLabelIcon
                tooltipText={'project ID from the Cloud Console'}
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
                tooltipText={t('credentials from the Cloud Console')}
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
                tooltipText={'amount for suggestions'}
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
                tooltipText={'amount for replies'}
                required
                height={32}
                fontClass="font-base"
              />
            </div>
            <Button
              type="submit"
              styleVariant="small"
              disabled={!projectID || !appCredentials || !suggestionConfidenceLevel || !replyConfidenceLevel}
              onClick={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                createNewConnection(projectID, appCredentials, suggestionConfidenceLevel, replyConfidenceLevel);
              }}
              style={{padding: '20px 60px'}}>
              {t('configure')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
