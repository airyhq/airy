import {Button} from 'components/cta/Button';
import React, {useState} from 'react';
import styles from './index.module.scss';

type NewSubscriptionProps = {
  name?: string;
  url?: string;
  events?: string[];
  headers: {
    'X-Custom-Header': string;
  };
  signatureKey: string;
  messageCreated?: boolean;
  messageUpdated?: boolean;
  conversationCreated?: boolean;
  conversationUpdated?: boolean;
  newWebhook: boolean;
  setNewWebook: (newWebook: boolean) => void;
  setUpdateWebhook: (
    update: boolean,
    url: string,
    name?: string,
    events?: string[],
    headers?: {},
    signatureKey?: string
  ) => void;
  setSubscribeWebhook: (url: string, name?: string, events?: string[], headers?: {}, signatureKey?: string) => void;
};

const NewSubscription = (props: NewSubscriptionProps) => {
  const {
    name,
    url,
    events,
    headers,
    signatureKey,
    messageCreated,
    messageUpdated,
    conversationCreated,
    conversationUpdated,
    newWebhook,
    setNewWebook,
    setUpdateWebhook,
    setSubscribeWebhook,
  } = props;
  const [newUrl, setNewUrl] = useState(newWebhook ? '' : url);
  const [newName, setNewName] = useState(name || '');
  const [newEvents, setNewEvents] = useState(events || []);
  const [newHeaders, setNewHeaders] = useState(headers || '');
  const [newSignatureKey, setNewSignatureKey] = useState(signatureKey || '');
  const [messageCreatedChecked, setMessageCreatedChecked] = useState(messageCreated);
  const [messageUpdatedChecked, setMessageUpdatedChecked] = useState(messageUpdated);
  const [conversationCreatedChecked, setConversationCreatedChecked] = useState(conversationCreated);
  const [conversationUpdatedChecked, setConversationUpdatedChecked] = useState(conversationUpdated);

  const handleChecked = (event: string) => {
    switch (event) {
      case 'message.created': {
        // setMessageCreatedChecked(!messageCreatedChecked);
        !newEvents.includes(event)
          ? (setNewEvents([...newEvents, 'message.created']), console.log('new one'))
          : (setNewEvents(newEvents.filter(item => item !== event)), console.log('removed one'));
        break;
      }
      case 'message.updated': {
        setMessageUpdatedChecked(!messageUpdatedChecked);
        !newEvents.includes(event)
          ? (setNewEvents([...newEvents, 'message.updated']), console.log('new one'))
          : (setNewEvents(newEvents.filter(item => item !== event)), console.log('removed one'));
        break;
      }
      case 'conversation.created': {
        setConversationCreatedChecked(!conversationCreatedChecked);
        !newEvents.includes(event)
          ? (setNewEvents([...newEvents, 'conversation.created']), console.log('new one'))
          : (setNewEvents(newEvents.filter(item => item !== event)), console.log('removed one'));
        break;
      }
      case 'conversation.updated': {
        setConversationUpdatedChecked(!conversationUpdatedChecked);
        !newEvents.includes(event)
          ? (setNewEvents([...newEvents, 'conversation.updated']), console.log('new one'))
          : (setNewEvents(newEvents.filter(item => item !== event)), console.log('removed one'));
        break;
      }
    }

    console.log('EVENTS: ', newEvents);

    return newEvents;
  };

  const updateWebhook = () => {
    setUpdateWebhook(true, newUrl, newName, newEvents, newHeaders, newSignatureKey);
  };

  const subscribeToNewWebhook = () => {
    setSubscribeWebhook(newUrl, newName, newEvents, newHeaders, newSignatureKey);
    setNewWebook(false);
  };

  return (
    <form className={styles.formContainer}>
      <div className={styles.container}>
        <h1>WEBHOOK</h1>
        <div className={styles.inputContainer}>
          <input placeholder={name || 'Name'} value={newName} onChange={event => setNewName(event.target.value)} />
          <input
            placeholder={newWebhook ? 'URL' : url}
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            required={true}
          />
        </div>
        <h1>ALL EVENTS</h1>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="message.created"
            name="message.created"
            checked={messageCreatedChecked}
            onChange={() => handleChecked('message.created')}
          />
          <label htmlFor="message.created">
            <span>Message.Created</span>
          </label>
          <input
            type="checkbox"
            id="message.updated"
            name="message.updated"
            checked={messageUpdatedChecked}
            onChange={() => handleChecked('message.updated')}
          />
          <label htmlFor="message.updated">
            <span>Message.Updated</span>
          </label>
          <input
            type="checkbox"
            id="conversation.created"
            name="conversation.created"
            checked={conversationCreatedChecked}
            onChange={() => handleChecked('conversation.created')}
          />
          <label htmlFor="conversation.created">
            <span>Conversation.Created</span>
          </label>
          <input
            type="checkbox"
            id="conversation.updated"
            name="conversation.updated"
            checked={conversationUpdatedChecked}
            onChange={() => handleChecked('conversation.updated')}
          />
          <label htmlFor="conversation.updated">
            <span>Conversation.Updated</span>
          </label>
        </div>
        <div className={styles.headerKeyContainer}>
          <div className={styles.headerKeyItem}>
            <span>(Customer Header)*</span>
            <input
              // value={newHeaders['X-Custom-Header']}
              onChange={event => setNewEvents['X-Custom-Header'](event.target.value)}
              placeholder="Lorem Ipsum is simply dummy textgggg of the printing and typesetting industry. Lorem Ipsum has been the
              industrys standard dummy text ever since the 1500s"></input>
          </div>
          <div className={styles.headerKeyItem}>
            <span>*Sign key</span>
            <input value={newSignatureKey} onChange={event => setNewSignatureKey(event.target.value)} />
          </div>
        </div>
      </div>
      <Button
        onClick={newWebhook ? subscribeToNewWebhook : updateWebhook}
        style={{alignSelf: 'center', width: '213px', height: '48px', borderRadius: '10px'}}
        disabled={newUrl === ''}
        type="button">
        {newWebhook ? 'Confirm' : 'Update'}
      </Button>
    </form>
  );
};

export default NewSubscription;
