import React, {useEffect, useState} from 'react';
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
  events?: [string];
  headers?: {
    'X-Custom-Header': string;
  };
  status?: string;
  signatureKey?: string;
  switchId?: string;
  newWebhook: boolean;
  setNewWebhook?: (isNewWebhook: boolean) => void;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  subscribeWebhook,
  unsubscribeWebhook,
  updateWebhook,
};

const connector = connect(null, mapDispatchToProps);

const WebhooksListItem = (props: WebhooksListItemProps) => {
  const {id, name, url, events, headers, status, signatureKey, switchId, newWebhook, setNewWebhook} = props;
  const [subscribed, setSubscribed] = useState(status || 'Subscribed');
  const [editModeOn, setEditModeOn] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [messageCreated, setMessageCreated] = useState(false);
  const [messageUpdated, setMessageUpdated] = useState(false);
  const [conversationUpdated, setConversationUpdated] = useState(false);
  const [channelUpdated, setChannelUpdated] = useState(false);
  const [webhookUnsubscribe, setWebhookUnsubscribe] = useState(false);
  const [webhookUpdate, setWebhookUpdate] = useState(false);
  const [isNewWebhook, setIsNewWebhook] = useState(newWebhook);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    checkEvents();
    newWebhook && setIsNewWebhook(true);
  }, [newWebhook, isNewWebhook, setIsNewWebhook]);

  const cancelChanges = () => {
    setEditModeOn(false);
    setNewWebhook(false);
    setIsNewWebhook(false);
    setShowUnsubscribeModal(false);
  };

  const checkEvents = () => {
    events &&
      (events.includes('message.created') && setMessageCreated(true),
      events.includes('message.updated') && setMessageUpdated(true),
      events.includes('conversation.updated') && setConversationUpdated(true),
      events.includes('channel.updated') && setChannelUpdated(true));
  };

  const handleUnsubscribe = () => {
    subscribed === 'Subscribed'
      ? setShowUnsubscribeModal(true)
      : props.subscribeWebhook({
          url: url,
          name: name,
          events: events,
          headers: headers,
          signatureKey: signatureKey,
        });
  };

  const editWebhook = () => {
    setIsNewWebhook(false);
    setEditModeOn(!editModeOn);
  };

  const updateWebhookConfirm = (
    update: boolean,
    url: string,
    name?: string,
    events?: string[],
    headers?: {},
    signatureKey?: string
  ) => {
    setErrorOccurred(false);
    setIsLoading(true);
    update &&
      props
        .updateWebhook({id: id, url: url, name: name, events: events, signatureKey: signatureKey})
        .then(() => {
          setIsLoading(false);
        })
        .catch((error: Error) => {
          console.error(error);
          setErrorOccurred(true);
          setIsLoading(false);
        });
  };

  const subscribeWebhookConfirm = (url: string, name?: string, events?: string[]) => {
    setErrorOccurred(false);
    setIsLoading(true);
    props
      .subscribeWebhook({url: url, name: name, events: events})
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

  const unsubscribeWebhookConfirm = (unsubscribe: boolean) => {
    setErrorOccurred(false);
    setIsLoading(true);
    setWebhookUnsubscribe(unsubscribe);
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

  const handleSetNewWebhook = (newWebhook: boolean) => {
    setIsNewWebhook(newWebhook);
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
          toggleActive={handleUnsubscribe}
          onColor="#EFEFEF"
        />
        <div className={styles.pensilIcon} onClick={editWebhook}>
          <PensilIcon height={12} width={12} />
        </div>
      </div>

      {(editModeOn || isNewWebhook) && (
        <SettingsModal close={cancelChanges} title="Subscribe Webhook" className={styles.subscribePopup}>
          <NewSubscription
            name={name}
            url={url}
            headers={headers}
            signatureKey={signatureKey}
            messageCreated={messageCreated}
            messageUpdated={messageUpdated}
            conversationUpdated={conversationUpdated}
            channelUpdated={channelUpdated}
            newWebhook={newWebhook}
            setNewWebook={handleSetNewWebhook}
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
