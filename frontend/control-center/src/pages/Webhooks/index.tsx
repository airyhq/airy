import {SettingsModal} from 'components/alerts/SettingsModal';
import {Button} from 'components/cta/Button';
import {Webhook} from 'model/Webhook';
import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {listWebhooks} from '../../actions/webhook';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
import NewSubscription from './NewSubscriptionModal';
import WebhooksListItem from './WebhooksListItem';

type WebhooksProps = {} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  webhooks: Object.values(state.data.webhooks),
});

const mapDispatchToProps = {
  listWebhooks,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Webhooks = (props: WebhooksProps) => {
  const {listWebhooks, webhooks} = props;
  const [newWebhook, setNewWebhook] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    setPageTitle('Webhooks');
  }, []);

  useEffect(() => {
    webhooks.length === 0 && listWebhooks();
  }, [webhooks]);

  const handleNewWebhook = (newWebhook: boolean) => {
    setNewWebhook(newWebhook);
  };

  const handleSuccessful = (successful: boolean) => {
    setShowSuccessNotification(successful);
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
          background: '#0da36b',
          borderRadius: '10px',
        }}
      >
        <span className={styles.successfullySubscribed}>Successfully Subscribed!</span>
      </div>
    );
  };

  return (
    <>
      {showSuccessNotification && <SuccessfulSubscribed />}
      {/* {newWebhook && (
        <SettingsModal close={() => setNewWebhook(false)} title="Subscribe Webhook" className={styles.subscribePopup}>
          <NewSubscription
            newWebhook={true}
            name={''}
            url={''}
            signatureKey={''}
            setSubscribeWebhook={}
            // isLoading={isLoading}
            // error={errorOccurred}
          />
        </SettingsModal>
      )} */}
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
                status={webhook.status}
                switchId={`${index}`}
                key={index}
                newWebhook={newWebhook}
                setNewWebhook={handleNewWebhook}
                setSuccessful={handleSuccessful}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default connector(Webhooks);
