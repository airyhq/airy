import React, {useEffect, useState} from 'react';
import {ReactComponent as PensilIcon} from 'assets/images/icons/pencil.svg';
import styles from './index.module.scss';
import {Switch} from '../../../components/Switch';
import {connect, ConnectedProps} from 'react-redux';
import {subscribeWebhook, unsubscribeWebhook, updateWebhook} from '../../../actions/webhook';
import {SettingsModal} from 'components';
import NewSubscription from '../NewSubscription';

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
  const [subscribed, setSubscribed] = useState(status);
  const [editModeOn, setEditModeOn] = useState(false);
  const [messageCreated, setMessageCreated] = useState(false);
  const [messageUpdated, setMessageUpdated] = useState(false);
  const [conversationCreated, setConversationCreated] = useState(false);
  const [conversationUpdated, setConversationUpdated] = useState(false);

  useEffect(() => {
    checkEvents();
    newWebhook && setEditModeOn(true);
  }, [newWebhook]);

  const handleToggle = () => {
    status === 'Subscribed'
      ? (unsubscribeWebhook({url}), setSubscribed('Unsubscribed'))
      : (subscribeWebhook({url}), setSubscribed('Subscribed'));
  };

  const saveChanges = () => {
    // updateWebhook({url}: UpdateWebhookRequestPayload)
  };

  const cancelChanges = () => {
    console.log('NOW');

    setEditModeOn(false);
  };

  const checkEvents = () => {
    events &&
      (events.includes('message.created') && setMessageCreated(true),
      events.includes('message.updated') && setMessageUpdated(true),
      events.includes('conversation.created') && setConversationCreated(true),
      events.includes('conversation.updated') && setConversationUpdated(true));
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
          toggleActive={handleToggle}
          onColor="#EFEFEF"
        />
        <div
          className={styles.pensilIcon}
          onClick={() => {
            setEditModeOn(!editModeOn);
          }}>
          <PensilIcon height={12} width={12} />
        </div>
      </div>

      {editModeOn && (
        <SettingsModal close={cancelChanges} title="Subscribe Webhook" className={styles.subscribePopup}>
          <NewSubscription
            name={name}
            url={url}
            messageCreated={messageCreated}
            messageUpdated={messageUpdated}
            conversationCreated={conversationCreated}
            conversationUpdated={conversationUpdated}
          />
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(WebhooksListItem);
