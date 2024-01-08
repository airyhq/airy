import React, {useEffect, useState} from 'react';
import {NotificationComponent} from 'components';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {setPageTitle} from '../../services/pageTitle';
import {NotificationModel} from 'model';
import {AiryLoader} from 'components/loaders/AiryLoader';
import styles from './index.module.scss';
import {EmptyState} from './EmptyState';
import {HttpClientInstance} from '../../httpClient';
import {LLMSStatsPayload} from 'httpclient/src';
import {LLMInfoItem} from './LLMInfoItem';

type LLMsProps = {} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {};

const connector = connect(null, mapDispatchToProps);

const LLMs = (props: LLMsProps) => {
  const [llms, setLlms] = useState([]);
  const [embeddings, setEmbeddings] = useState(0);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('LLMs');
  }, []);

  useEffect(() => {
    HttpClientInstance.getLLMInfo()
      .then((response: any) => {
        setLlms(response);
        setDataFetched(true);
      })
      .catch(() => {
        handleNotification(true);
      });
    HttpClientInstance.getLLMStats()
      .then((response: LLMSStatsPayload) => {
        setEmbeddings(response.embeddings);
      })
      .catch(() => {
        handleNotification(true);
      });
  }, []);

  const handleNotification = (show: boolean) => {
    setNotification({show: show, successful: false, text: t('errorOccurred')});
  };

  const createNewLLM = () => {};

  return (
    <>
      <div className={styles.webhooksWrapper}>
        <div className={styles.webhooksHeadline}>
          <div className={styles.headlineContainer}>
            <h1 className={styles.webhooksHeadlineText}>LLM Controller</h1>
          </div>
        </div>
        {llms?.length === 0 && dataFetched ? (
          <AiryLoader height={240} width={240} position="relative" />
        ) : llms?.length === 0 ? (
          <EmptyState createNewLLM={() => createNewLLM()} />
        ) : (
          <>
            <div className={styles.listHeader}>
              <h2>LLM Provider</h2>
              <h2>Vector Database</h2>
              <h2>Model</h2>
            </div>
            <div>{llms && llms.map((llm: any) => <LLMInfoItem item={llm} />)}</div>
            <div className={styles.embeddingsSection}>Embeddings: {embeddings}</div>
            {notification?.show && (
              <NotificationComponent
                key={'notificationKey'}
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

export default connector(LLMs);
