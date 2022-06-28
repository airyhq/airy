import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {StateModel} from '../../../../reducers';
import {getConnectorsConfiguration} from '../../../../actions';
import {Button, Input} from 'components';
import styles from './ConnectNewDialogflow.module.scss';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';

type ConnectNewDialogflowProps = {
  createNewConnection: (
    projectId: string,
    appCredentials: string,
    suggestionConfidenceLevel: string,
    replyConfidenceLevel: string
  ) => void;
  isEnabled: boolean;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  getConnectorsConfiguration,
};

const connector = connect(null, mapDispatchToProps);

const ConnectNewDialogflow = ({
  createNewConnection,
  isEnabled,
  getConnectorsConfiguration,
}: ConnectNewDialogflowProps) => {
  const componentInfo = useSelector((state: StateModel) => state.data.connector['enterprise-dialogflow-connector']);
  const [projectID, setProjectID] = useState(componentInfo?.project_id || '');
  const [appCredentials, setAppCredentials] = useState(componentInfo?.dialogflow_credentials || '');
  const [suggestionConfidenceLevel, setSuggestionConfidenceLevel] = useState(componentInfo?.suggestion_confidence_level || '');
  const [replyConfidenceLevel, setReplyConfidenceLevel] = useState(componentInfo?.reply_confidence_level || '');
  const {t} = useTranslation();

  // useEffect(() => {
  //   if(componentInfo){
  //     if(!projectID)setProjectID(componentInfo.project_id);
  //     if(!appCredentials) setAppCredentials(componentInfo.dialogflow_credentials);
  //     if(!suggestionConfidenceLevel) setSuggestionConfidenceLevel(componentInfo.suggestion_confidence_level);
  //     if(!replyConfidenceLevel) setReplyConfidenceLevel(componentInfo.reply_confidence_level );
  //   } 

  // }, [componentInfo, projectID,appCredentials,suggestionConfidenceLevel,replyConfidenceLevel ])

  const submitConfigData = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      createNewConnection(projectID, appCredentials, suggestionConfidenceLevel, replyConfidenceLevel);
    }

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
              type='button'
              disabled={!projectID || !appCredentials || !suggestionConfidenceLevel || !replyConfidenceLevel}
              style={{padding: '20px 60px'}}
              onClick={(e) => submitConfigData(e)}
            >
              {isEnabled ? t('Update') : t('toConfigure')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default connector(ConnectNewDialogflow);
