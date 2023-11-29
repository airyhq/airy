import React from 'react';
import {ReactComponent as TrashIcon} from 'assets/images/icons/trash.svg';
import {useTranslation} from 'react-i18next';
import {HttpClientInstance} from '../../../httpClient';
import styles from './index.module.scss';
import {NotificationModel} from 'model';
import {set} from 'lodash-es';

type EmptyStateProps = {
  item: {name: string; topic: string; status: string; lag: number};
  setNotification: (object: NotificationModel) => void;
};

export const LLMConsumerItem = (props: EmptyStateProps) => {
  const {item, setNotification} = props;
  const {t} = useTranslation();

  const deleteConsumer = () => {
    HttpClientInstance.deleteLLMConsumer({name: item.name})
      .then(() => {
        setNotification({show: true, successful: true, text: 'Consumer Deleted'});
      })
      .catch(() => {
        setNotification({show: true, successful: false, text: t('errorOccurred')});
      });
  };

  return (
    <div className={styles.container}>
      <p>{item.name}</p>
      <p>{item.topic}</p>
      <p>{item.status}</p>
      <p>{item.lag}</p>
      <button type="button" className={styles.actionButton} onClick={deleteConsumer}>
        <TrashIcon className={styles.actionSVG} title={t('delete')} />
      </button>
    </div>
  );
};
