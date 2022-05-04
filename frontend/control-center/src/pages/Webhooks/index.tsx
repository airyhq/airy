import {SettingsModal} from 'components/alerts/SettingsModal';
import {Button} from 'components/cta/Button';
import {Webhook} from 'model/Webhook';
import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {listWebhooks, subscribeWebhook} from '../../actions/webhook';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Webhooks = (props: WebhooksProps) => {
  const {listWebhooks, webhooks} = props;
  const [newWebhook, setNewWebhook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationText, setNotificatioNText] = useState('');
  const [notifcationColor, setNotifcationColor] = useState('');

  useEffect(() => {
    setPageTitle('Webhooks');
  }, []);

  useEffect(() => {
    webhooks.length === 0 && listWebhooks();
  }, [webhooks]);

  const handleNotification = (show: boolean, error: boolean) => {
    error
      ? (setNotificatioNText('Error occurred'), setNotifcationColor('#d51548'))
      : (setNotificatioNText('Successfully Subscribed!'), setNotifcationColor('#0da36b'));
    setShowSuccessNotification(show);
  };

  const subscribeWebhookConfirm = (
    url: string,
    name?: string,
    events?: string[],
    signatureKey?: string,
    headers?: {'X-Custom-Header': string}
  ) => {
    setErrorOccurred(false);
    setIsLoading(true);
    props
      .subscribeWebhook({url: url, name: name, events: events, signatureKey: signatureKey, headers: headers})
      .then(() => {
        setIsLoading(false);
        setNewWebhook(false);
      })
      .catch((error: Error) => {
        console.error(error);
        setErrorOccurred(true);
        setIsLoading(false);
      });
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
        }}>
        <span className={styles.successfullySubscribed}>{notificationText}</span>
      </div>
    );
  };

  return (
    <>
      {showSuccessNotification && <SuccessfulSubscribed />}
      {newWebhook && (
        <SettingsModal close={() => setNewWebhook(false)} title="Subscribe Webhook" style={{fontSize: '40px'}}>
          <SubscriptionModal
            newWebhook={true}
            name={''}
            url={''}
            signatureKey={''}
            headers={{'X-Custom-Header': ''}}
            setSubscribeWebhook={subscribeWebhookConfirm}
            isLoading={isLoading}
            error={errorOccurred}
          />
        </SettingsModal>
      )}
      <div className={styles.webhooksWrapper}>
        <div className={styles.webhooksHeadline}>
          <div className={styles.headlineContainer}>
            <h1 className={styles.webhooksHeadlineText}>Webhooks</h1>
            <Button onClick={() => setNewWebhook(true)} style={{fontSize: 13, width: '176px', height: '40px'}}>
              Subscribe Webhook
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
                id={webhook.id}
                url={webhook.url}
                name={webhook.name}
                events={webhook.events}
                headers={webhook.headers}
                signatureKey={webhook.signatureKey}
                status={webhook.status}
                switchId={`${index}`}
                key={index}
                setShowNotification={handleNotification}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default connector(Webhooks);
