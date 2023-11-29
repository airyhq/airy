import React, {useEffect, useState} from 'react';
import {Input, NotificationComponent} from 'components';
import {SettingsModal} from 'components/alerts/SettingsModal';
import {Button} from 'components/cta/Button';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {setPageTitle} from '../../services/pageTitle';
import {NotificationModel} from 'model';
import {AiryLoader} from 'components/loaders/AiryLoader';
import styles from './index.module.scss';
import {EmptyState} from './EmptyState';
import {HttpClientInstance} from '../../httpClient';
import {LLMConsumerItem} from './LLMConsumerItem';

type LLMConsumersProps = {} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {};

const connector = connect(null, mapDispatchToProps);

const LLMConsumers = (props: LLMConsumersProps) => {
  const [consumers, setConsumers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('');
  const [textfield, setTextfield] = useState('');
  const [metadataFields, setMetadataFields] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('LLM Consumers');
  }, []);

  useEffect(() => {
    HttpClientInstance.listLLMConsumers()
      .then((response: any) => {
        setConsumers(response);
        setDataFetched(true);
        setIsLoading(false);
      })
      .catch(() => {
        handleNotification(true);
      });
  }, []);

  const handleNotification = (show: boolean) => {
    setNotification({show: show, successful: false, text: t('errorOccurred')});
  };

  const toggleCreateView = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const createNewLLM = () => {
    const metadataFieldsArray = metadataFields.replace(' ', '').split(',');
    HttpClientInstance.createLLMConsumer({
      name: name.trim(),
      topic: topic.trim(),
      textField: textfield.trim(),
      metadataFields: metadataFieldsArray,
    })
      .then(() => {
        setNotification({show: true, successful: true, text: t('llmConsumerCreatedSuccessfully')});
        toggleCreateView();
        setName('');
        setTopic('');
        setTextfield('');
        setMetadataFields('');
        setType('');
      })
      .catch(() => {
        handleNotification(true);
      });
  };

  return (
    <>
      {' '}
      {showSettingsModal && (
        <SettingsModal title="Create LLM Consumer" close={toggleCreateView}>
          <div className={styles.llmCreateContainer}>
            <Input
              id="name"
              label={t('name')}
              placeholder="e.g., llm-consumer-1, llm-consumer-2, etc."
              showLabelIcon
              tooltipText={t('llmConsumerNameExplanation')}
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
              minLength={6}
              required={true}
              height={32}
              fontClass="font-base"
            />
            <Input
              id="topic"
              label={t('topic')}
              placeholder="e.g., llm-topic-1, llm-topic-2, etc."
              showLabelIcon
              tooltipText={t('llmConsumerTopicNameExplanation')}
              value={topic}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTopic(event.target.value)}
              minLength={6}
              required={true}
              height={32}
              fontClass="font-base"
            />
            <Input
              id="type"
              label="Type of serialization"
              placeholder="e.g., avro, json, etc."
              showLabelIcon
              tooltipText={t('llmConsumerTypeExplanation')}
              value={type}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setType(event.target.value)}
              minLength={2}
              required={true}
              height={32}
              fontClass="font-base"
            />
            <Input
              id="textfield"
              label="Text Field"
              placeholder="e.g., text, message, etc."
              showLabelIcon
              tooltipText={t('llmConsumerTextFieldExplanation')}
              value={textfield}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTextfield(event.target.value)}
              minLength={2}
              required={true}
              height={32}
              fontClass="font-base"
            />
            <Input
              id="metadataFields"
              label="Metadata Fields"
              placeholder="e.g., name, date, etc."
              showLabelIcon
              tooltipText={t('llmConsumerMetadataFieldsExplanation')}
              value={metadataFields}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMetadataFields(event.target.value)}
              minLength={6}
              required={true}
              height={32}
              fontClass="font-base"
            />
            <Button styleVariant="normal" type="submit" onClick={() => createNewLLM()}>
              {t('create')}
            </Button>
          </div>
        </SettingsModal>
      )}
      <div className={styles.llmsWrapper}>
        <div className={styles.llmsHeadline}>
          <div className={styles.headlineContainer}>
            <h1 className={styles.llmsHeadlineText}>LLM Consumers</h1>
          </div>
          <div className={styles.buttonContainer}>
            <Button className={styles.createWebhookButton} onClick={() => toggleCreateView()}>
              {t('create')}
            </Button>
          </div>
        </div>
        {consumers?.length === 0 && dataFetched ? (
          <AiryLoader height={240} width={240} position="relative" />
        ) : consumers?.length === 0 ? (
          <EmptyState createNewLLM={() => toggleCreateView()} />
        ) : (
          <>
            <div className={styles.listHeader}>
              <h2>Name</h2>
              <h2>Topic</h2>
              <h2>Status</h2>
              <h2>Lag</h2>
            </div>
            <div>
              {consumers &&
                consumers.map((consumer: any) => <LLMConsumerItem item={consumer} setNotification={setNotification} />)}
            </div>
            {notification?.show && (
              <NotificationComponent
                show={notification.show}
                successful={notification.successful}
                text={notification.text}
                setShowFalse={setNotification}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default connector(LLMConsumers);
