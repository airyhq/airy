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
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  subscribeWebhook,
  unsubscribeWebhook,
  updateWebhook,
};

const connector = connect(null, mapDispatchToProps);

const WebhooksListItem = (props: WebhooksListItemProps) => {
  const {
    id,
    name,
    url,
    events,
    headers,
    status,
    signatureKey,
    switchId,
    subscribeWebhook,
    unsubscribeWebhook,
    updateWebhook,
    newWebhook,
  } = props;
  const [subscribed, setSubscribed] = useState(status || 'Subscribed');
  // const [subscribed, setSubscribed] = useState(status || 'Unsubscribed');
  const [editModeOn, setEditModeOn] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [messageCreated, setMessageCreated] = useState(false);
  const [messageUpdated, setMessageUpdated] = useState(false);
  const [conversationCreated, setConversationCreated] = useState(false);
  const [conversationUpdated, setConversationUpdated] = useState(false);
  const [webhookUnsubscribe, setWebhookUnsubscribe] = useState(false);
  const [webhookUpdate, setWebhookUpdate] = useState(false);
  const [isNewWebhook, setIsNewWebhook] = useState(newWebhook || false);

  useEffect(() => {
    checkEvents();
    console.log('sdjadsijdsiaojdasoidjas', isNewWebhook);
    newWebhook && setIsNewWebhook(true);
  }, [newWebhook]);

  // const handleToggle = () => {
  //   status === 'Subscribed'
  //     ? (unsubscribeWebhook({url}), setSubscribed('Unsubscribed'))
  //     : (subscribeWebhook({url}), setSubscribed('Subscribed'));
  // };

  const saveChanges = () => {
    // updateWebhook({url}: UpdateWebhookRequestPayload)
  };

  const cancelChanges = () => {
    setEditModeOn(false);
    setIsNewWebhook(false);
    setShowUnsubscribeModal(false);
  };

  const checkEvents = () => {
    events &&
      (events.includes('message.created') && setMessageCreated(true),
      events.includes('message.updated') && setMessageUpdated(true),
      events.includes('conversation.created') && setConversationCreated(true),
      events.includes('conversation.updated') && setConversationUpdated(true));
  };

  const handleUnsubscribe = () => {
    console.log('371289: ', subscribed);

    subscribed === 'Subscribed' ? setShowUnsubscribeModal(true) : subscribeWebhook({url: url}).then(() => {});
  };

  const unsubscribeWebhookConfirm = (unsubscribe: boolean) => {
    setWebhookUnsubscribe(unsubscribe);
    unsubscribeWebhook({url: url})
      .then(() => {
        setShowUnsubscribeModal(false);
        setSubscribed('Unsubscribed');
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  const editWebhook = () => {
    setIsNewWebhook(false);
    setEditModeOn(!editModeOn);
  };

  const updateWebhookConfirm = (update: boolean, url: string, name?: string, events?: string[]) => {
    update &&
      props
        .updateWebhook({id: id, url: url, name: name, events: events})
        .then(() => {
          console.log('UPDATED');
        })
        .catch((error: Error) => {
          console.error(error);
        });
  };

  const subscribeWebhookConfirm = (url: string, name?: string, events?: string[]) => {
    console.log('SUBSCRIBECONFIRM');

    props
      .subscribeWebhook({url: url, name: name, events: events})
      .then(() => {
        setSubscribed('Subscribed');
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  return (
    <div className={styles.container}>
      <span>{url}</span>
      <p>{name}</p>
      <div className={styles.eventsContainer}>
        <>{events && events.map((event, index) => <p key={index}>{event}</p>)}</>
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
            messageCreated={messageCreated}
            messageUpdated={messageUpdated}
            conversationCreated={conversationCreated}
            conversationUpdated={conversationUpdated}
            newWebhook={newWebhook}
            setUpdateWebhook={updateWebhookConfirm}
            setSubscribeWebhook={subscribeWebhookConfirm}
          />
        </SettingsModal>
      )}
      {showUnsubscribeModal && (
        <SettingsModal close={cancelChanges} title="" className={styles.subscribePopup}>
          <UnsubscribeModal
            setUnsubscribe={unsubscribeWebhookConfirm}
            setCancelUnsubscribe={cancelChanges}
            webhookUrl={url}
          />
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(WebhooksListItem);
