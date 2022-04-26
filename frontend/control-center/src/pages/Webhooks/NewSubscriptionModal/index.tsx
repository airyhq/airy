import {Button} from 'components/cta/Button';
import React, {useEffect, useRef, useState} from 'react';
import styles from './index.module.scss';

type NewSubscriptionProps = {
  name?: string;
  url?: string;
  messageCreated?: boolean;
  messageUpdated?: boolean;
  conversationCreated?: boolean;
  conversationUpdated?: boolean;
  newWebhook: boolean;
  setUpdateWebhook: (update: boolean, url: string, name?: string, events?: string[]) => void;
  setSubscribeWebhook: (url: string, name?: string, events?: string[]) => void;
};

const NewSubscription = (props: NewSubscriptionProps) => {
  const {
    name,
    url,
    messageCreated,
    messageUpdated,
    conversationCreated,
    conversationUpdated,
    newWebhook,
    setUpdateWebhook,
    setSubscribeWebhook,
  } = props;
  const [newUrl, setNewUrl] = useState(url);
  const [newName, setNewName] = useState(name);
  let [newEvents, setNewEvents] = useState([]);
  const [messageCreatedChecked, setMessageCreatedChecked] = useState(messageCreated);
  const [messageUpdatedChecked, setMessageUpdatedChecked] = useState(messageUpdated);
  const [conversationCreatedChecked, setConversationCreatedChecked] = useState(conversationCreated);
  const [conversationUpdatedChecked, setConversationUpdatedChecked] = useState(conversationUpdated);

  const handleChecked = (event: string) => {
    switch (event) {
      case 'message.created': {
        // setMessageCreatedChecked(!messageCreatedChecked);
        !messageCreatedChecked
          ? !newEvents.includes(event) && newEvents.push(...'message.created')
          : (newEvents = newEvents.filter(item => item !== event));
        break;
      }
      case 'message.updated': {
        setMessageUpdatedChecked(!messageUpdatedChecked);
        !messageUpdatedChecked
          ? !newEvents.includes(event) && newEvents.push(...'message.updated')
          : (newEvents = newEvents.filter(item => item !== event));
        break;
      }
      case 'conversation.created': {
        setConversationCreatedChecked(!conversationCreatedChecked);
        !conversationCreatedChecked
          ? !newEvents.includes(event) && newEvents.push(...'conversation.created')
          : (newEvents = newEvents.filter(item => item !== event));
        break;
      }
      case 'conversation.updated': {
        setConversationUpdatedChecked(!conversationUpdatedChecked);
        !conversationUpdatedChecked
          ? !newEvents.includes(event) && newEvents.push(...'conversation.updated')
          : (newEvents = newEvents.filter(item => item !== event));
        break;
      }
    }

    console.log('EVENTS: ', newEvents);

    return newEvents;
  };

  const updateWebhook = () => {
    setUpdateWebhook(true, newUrl, newName, newEvents);
  };

  const subscribeToNewWebhook = () => {
    setSubscribeWebhook(newUrl, newName, newEvents);
  };
  // const updateWebhook = (url: string, name?: string, events?: string[]) => {
  //   setUpdateWebhook(true, url, name, events);
  // };

  // const subscribeToNewWebhook = (url: string, name?: string, events?: string[]) => {
  //   setSubscribeWebhook(url, name, events);
  // };

  return (
    <form className={styles.formContainer}>
      <div className={styles.container}>
        <h1>WEBHOOK</h1>
        <div className={styles.inputContainer}>
          <input placeholder={name || 'Name'} value={newName} onChange={event => setNewName(event.target.value)} />
          <input
            placeholder={newWebhook ? 'URL' : url}
            value={newWebhook ? '' : newUrl}
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
              placeholder="Lorem Ipsum is simply dummy textgggg of the printing and typesetting industry. Lorem Ipsum has been the
              industrys standard dummy text ever since the 1500s"></input>
          </div>
          <div className={styles.headerKeyItem}>
            <span>*Sign key</span>
            <p>
              Lorem Ipsum is simply duggggmmy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s
            </p>
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
