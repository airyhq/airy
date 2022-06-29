import {SettingsModal} from 'components/alerts/SettingsModal';
import {Button} from 'components/cta/Button';
import {Webhook} from 'model/Webhook';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {listWebhooks, subscribeWebhook, updateWebhook} from '../../actions/webhook';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
import {EmptyState} from './EmptyState';
import styles from './index.module.scss';
import SubscriptionModal from './SubscriptionModal';
import WebhooksListItem from './WebhooksListItem';

type WebhooksProps = {} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  webhooks: Object.values(state.data.webhooks),
});

const mapDispatchToProps = {
  listWebhooks,
  subscribeWebhook,
  updateWebhook,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Webhooks = (props: WebhooksProps) => {
  const {listWebhooks, webhooks} = props;
  const [newWebhook, setNewWebhook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [notifcationColor, setNotifcationColor] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('Webhooks');
  }, []);

  useEffect(() => {
    webhooks.length === 0 && listWebhooks();
  }, [webhooks]);

  const handleNotification = (show: boolean, error: boolean) => {
    error
      ? (setNotificationText(t('errorOccurred')), setNotifcationColor('#d51548'))
      : (setNotificationText(t('successfullySubscribed')), setNotifcationColor('#0da36b'));
    setShowSuccessNotification(show);
  };

  const upsertWebhook = (
    isNew: boolean,
    webhook: Webhook,
    onCall?: () => void,
    onResponse?: () => void,
    onError?: (error: Error) => void
  ) => {
    onCall();
    if (isNew) {
      props
        .subscribeWebhook({...webhook})
        .then(() => onResponse())
        .catch((error: Error) => {
          onError(error);
        });
    } else {
      props
        .updateWebhook({...webhook, id: webhook.id})
        .then(() => onResponse())
        .catch((error: Error) => {
          onError(error);
        });
    }
  };

  const subscribeWebhookConfirm = (isNew: boolean, webhook: Webhook) => {
    upsertWebhook(
      isNew,
      webhook,
      () => {
        setErrorOccurred(false);
        setIsLoading(true);
      },
      () => {
        setIsLoading(false);
        setNewWebhook(false);
      },
      (error: Error) => {
        console.error(error);
        setErrorOccurred(true);
        setIsLoading(false);
      }
    );
  };

  const SuccessfulSubscribed = () => {
    return (
      <div
        className={showSuccessNotification && styles.translateYAnimIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '50%',
          marginLeft: '-120px',
          height: '40px',
          width: '240px',
          zIndex: 9999,
          background: notifcationColor,
          borderRadius: '10px',
        }}
      >
        <span className={styles.successfullySubscribed}>{notificationText}</span>
      </div>
    );
  };

  const handleNewWebhook = (openModal: boolean) => {
    setNewWebhook(openModal);
  };

  return (
    <>
      {newWebhook && (
        <SettingsModal close={() => setNewWebhook(false)} title={t('subscribeWebhook')} style={{fontSize: '40px'}}>
          <SubscriptionModal
            newWebhook={true}
            webhook={{id: '', url: '', signatureKey: '', events: [], headers: {'X-Custom-Header': ''}}}
            setUpsertWebhook={subscribeWebhookConfirm}
            isLoading={isLoading}
            error={errorOccurred}
          />
        </SettingsModal>
      )}
      {webhooks.length === 0 ? (
        <EmptyState setNewWebhook={handleNewWebhook} />
      ) : (
        <>
          {showSuccessNotification && <SuccessfulSubscribed />}
          <div className={styles.webhooksWrapper}>
            <div className={styles.webhooksHeadline}>
              <div className={styles.headlineContainer}>
                <h1 className={styles.webhooksHeadlineText}>Webhooks</h1>
                <Button onClick={() => setNewWebhook(true)} style={{fontSize: 16, minWidth: '176px', height: '40px'}}>
                  {t('subscribeWebhook')}
                </Button>
              </div>
            </div>
            <div className={styles.listHeader}>
              <h2>URL</h2>
              <h2>Name</h2>
              <h2>Events</h2>
              <h2>Status</h2>
            </div>
            <div>
              {webhooks &&
                webhooks.map((webhook: Webhook, index) => (
                  <WebhooksListItem
                    webhook={webhook}
                    switchId={`${index}`}
                    key={index}
                    upsertWebhook={upsertWebhook}
                    setShowNotification={handleNotification}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default connector(Webhooks);
