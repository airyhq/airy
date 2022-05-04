import React, {useState} from 'react';
import {ReactComponent as PensilIcon} from 'assets/images/icons/pencil.svg';
import styles from './index.module.scss';
import {Switch} from '../../../components/Switch';
import {connect, ConnectedProps} from 'react-redux';
import {subscribeWebhook, unsubscribeWebhook, updateWebhook} from '../../../actions/webhook';
import {SettingsModal} from 'components';
import NewSubscription from '../NewSubscriptionModal';
import {UnsubscribeModal} from '../UnsubscribeModal';

type WebhooksListItemProps = {
  id: string;
  name?: string;
  url: string;
  events?: string[];
  headers?: {
    'X-Custom-Header': string;
  };
  status?: string;
  signatureKey?: string;
  switchId?: string;
  setShowNotification?: (show: boolean, error?: boolean) => void;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  subscribeWebhook,
  unsubscribeWebhook,
  updateWebhook,
};

const connector = connect(null, mapDispatchToProps);

const WebhooksListItem = (props: WebhooksListItemProps) => {
  const {id, name, url, events, headers, status, signatureKey, switchId} = props;
  const [subscribed, setSubscribed] = useState(status || 'Subscribed');
  const [editModeOn, setEditModeOn] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const cancelChanges = () => {
    setEditModeOn(false);
    setShowUnsubscribeModal(false);
  };

  const handleSubscribeToggle = () => {
    subscribed === 'Subscribed'
      ? setShowUnsubscribeModal(true)
      : props
          .subscribeWebhook({
            id: id,
            url: url,
            name: name,
            events: events,
            headers: headers,
            signatureKey: signatureKey,
          })
          .then(() => {
            setSubscribed('Subscribed');
            props.setShowNotification(true);
            setTimeout(() => {
              props.setShowNotification(false);
            }, 4000);
          })
          .catch((error: Error) => {
            console.error(error);
            props.setShowNotification(true, true);
            setTimeout(() => {
              props.setShowNotification(false);
            }, 4000);
          });
  };

  const editWebhook = () => {
    setEditModeOn(!editModeOn);
  };

  const updateWebhookConfirm = (
    update: boolean,
    url: string,
    name?: string,
    events?: string[],
    signatureKey?: string,
    headers?: {'X-Custom-Header': string}
  ) => {
    setErrorOccurred(false);
    setIsLoading(true);
    update &&
      props
        .updateWebhook({
          id: id,
          url: url,
          name: name,
          events: events,
          signatureKey: signatureKey,
          headers: headers,
        })
        .then(() => {
          setIsLoading(false);
          setEditModeOn(false);
        })
        .catch((error: Error) => {
          console.error(error);
          setErrorOccurred(true);
          setIsLoading(false);
        });
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
      .subscribeWebhook({
        url: url,
        name: name,
        events: events,
        signatureKey: signatureKey,
        headers: headers,
      })
      .then(() => {
        setIsLoading(false);
        setSubscribed('Subscribed');
      })
      .catch((error: Error) => {
        console.error(error);
        setErrorOccurred(true);
        setIsLoading(false);
      });
  };

  const unsubscribeWebhookConfirm = () => {
    setErrorOccurred(false);
    setIsLoading(true);
    props
      .unsubscribeWebhook({id: id, url: url})
      .then(() => {
        setShowUnsubscribeModal(false);
        setSubscribed('Unsubscribed');
        setIsLoading(false);
      })
      .catch((error: Error) => {
        console.error(error);
        setErrorOccurred(true);
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <span>{url}</span>
      <p>{name}</p>
      <div className={styles.eventsContainer}>
        <>
          {events &&
            events.map((event, index) => (
              <p key={index} style={{width: '100%'}}>
                {event}
              </p>
            ))}
        </>
      </div>
      <div className={styles.statusContainer} style={{width: '10%'}}>
        <Switch
          id={switchId}
          isActive={subscribed === 'Subscribed' ? true : false}
          toggleActive={handleSubscribeToggle}
          onColor="#EFEFEF"
        />
        <div className={styles.pensilIcon} onClick={editWebhook}>
          <PensilIcon height={12} width={12} />
        </div>
      </div>

      {editModeOn && (
        <SettingsModal close={cancelChanges} title="Subscribe Webhook" className={styles.subscribePopup}>
          <NewSubscription
            name={name}
            url={url}
            headers={headers}
            signatureKey={signatureKey}
            newWebhook={false}
            setUpdateWebhook={updateWebhookConfirm}
            setSubscribeWebhook={subscribeWebhookConfirm}
            isLoading={isLoading}
            error={errorOccurred}
          />
        </SettingsModal>
      )}
      {showUnsubscribeModal && (
        <SettingsModal close={cancelChanges} title="" className={styles.subscribePopup}>
          <UnsubscribeModal
            setUnsubscribe={unsubscribeWebhookConfirm}
            setCancelUnsubscribe={cancelChanges}
            webhookUrl={url}
            isLoading={isLoading}
            error={errorOccurred}
          />
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(WebhooksListItem);
