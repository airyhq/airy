import React, {useState} from 'react';
import {ReactComponent as PensilIcon} from 'assets/images/icons/pencil.svg';
import styles from './index.module.scss';
import {Switch} from '../../../components/Switch';
import {SettingsModal} from 'components';
import SubscriptionModal from '../SubscriptionModal';
import {UnsubscribeModal} from '../UnsubscribeModal';
import {Webhook, WebhooksStatus} from 'model/Webhook';

type WebhooksListItemProps = {
  webhook: Webhook;
  switchId?: string;
  upsertWebhook: (
    isNew: boolean,
    webhook: Webhook,
    onCall?: () => void,
    onResponse?: () => void,
    onError?: (error: Error) => void
  ) => void;
  setShowNotification?: (show: boolean, error?: boolean) => void;
};

const WebhooksListItem = (props: WebhooksListItemProps) => {
  const {webhook, switchId, upsertWebhook} = props;
  const {name, url, events, status} = webhook;
  const [subscribed, setSubscribed] = useState(status || WebhooksStatus.subscribed);
  const [editModeOn, setEditModeOn] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const cancelChanges = () => {
    setEditModeOn(false);
    setShowUnsubscribeModal(false);
  };

  const handleSubscribeToggle = () => {
    subscribed === WebhooksStatus.subscribed
      ? setShowUnsubscribeModal(true)
      : upsertWebhook(
          false,
          {
            ...webhook,
            status: WebhooksStatus.subscribed,
          },
          () => {
            props.setShowNotification(false);
          },
          () => {
            setSubscribed(WebhooksStatus.subscribed);
            props.setShowNotification(true);
            setTimeout(() => {
              props.setShowNotification(false);
            }, 4000);
          },
          (error: Error) => {
            console.error(error);
            props.setShowNotification(true, true);
            setTimeout(() => {
              props.setShowNotification(false);
            }, 4000);
          }
        );
  };

  const editWebhook = () => {
    setEditModeOn(!editModeOn);
  };

  const upsertWebhookConfirm = (isNew: boolean, webhook: Webhook) => {
    upsertWebhook(
      isNew,
      webhook,
      () => {
        setErrorOccurred(false);
        setIsLoading(true);
      },
      () => {
        setIsLoading(false);
        setEditModeOn(false);
      },
      (error: Error) => {
        console.error(error);
        setErrorOccurred(true);
        setIsLoading(false);
      }
    );
  };

  const unsubscribeWebhookConfirm = () => {
    upsertWebhook(
      false,
      {
        ...webhook,
        status: WebhooksStatus.unsubscribed,
      },
      () => {
        setErrorOccurred(false);
        setIsLoading(true);
      },
      () => {
        setShowUnsubscribeModal(false);
        setSubscribed(WebhooksStatus.unsubscribed);
        setIsLoading(false);
      },
      (error: Error) => {
        console.error(error);
        setErrorOccurred(true);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className={styles.container}>
      <span>{url}</span>
      <p>{name}</p>
      <div className={styles.eventsContainer}>
        <>
          {events &&
            events.map((event, index) => (
              <p key={index} style={{width: '100%', textTransform: 'capitalize'}}>
                {event}
              </p>
            ))}
        </>
      </div>
      <div className={styles.statusContainer} style={{width: '10%'}}>
        <Switch
          id={switchId}
          isActive={subscribed === WebhooksStatus.subscribed ? true : false}
          toggleActive={handleSubscribeToggle}
          onColor={localStorage.getItem('theme') === 'dark' ? '#828484' : '#EFEFEF'}
        />
        <div className={styles.pensilIcon} onClick={editWebhook}>
          <PensilIcon height={12} width={12} />
        </div>
      </div>

      {editModeOn && (
        <SettingsModal close={cancelChanges} title="Update Webhook" style={{fontSize: '40px'}}>
          <SubscriptionModal
            webhook={webhook}
            newWebhook={false}
            setUpsertWebhook={upsertWebhookConfirm}
            isLoading={isLoading}
            error={errorOccurred}
          />
        </SettingsModal>
      )}
      {showUnsubscribeModal && (
        <SettingsModal close={cancelChanges} title="">
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

export default WebhooksListItem;
