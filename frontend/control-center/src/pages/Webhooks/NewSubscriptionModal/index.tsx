import {Button} from 'components/cta/Button';
import React, {useState} from 'react';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
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
  conversationUpdated?: boolean;
  channelUpdated?: boolean;
  newWebhook: boolean;
  setNewWebook: (newWebook: boolean) => void;
  isLoading: boolean;
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
    conversationUpdated,
    channelUpdated,
    newWebhook,
    setNewWebook,
    isLoading,
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
  const [conversationUpdatedChecked, setConversationUpdatedChecked] = useState(conversationUpdated);
  const [channelUpdatedChecked, setChannelUpdatedChecked] = useState(channelUpdated);

  const handleChecked = (event: string) => {
    switch (event) {
      case 'message.created': {
        !messageCreatedChecked
          ? setNewEvents([...newEvents, 'message.created'])
          : setNewEvents(newEvents.filter(item => item !== event));
        setMessageCreatedChecked(!messageCreatedChecked);
        console.log('ABC');

        break;
      }
      case 'message.updated': {
        !messageUpdatedChecked
          ? setNewEvents([...newEvents, 'message.updated'])
          : setNewEvents(newEvents.filter(item => item !== event));
        setMessageUpdatedChecked(!messageUpdatedChecked);
        break;
      }
      case 'conversation.updated': {
        !conversationUpdatedChecked
          ? setNewEvents([...newEvents, 'conversation.updated'])
          : setNewEvents(newEvents.filter(item => item !== event));
        setConversationUpdatedChecked(!conversationUpdatedChecked);
        break;
      }
      case 'channel.updated': {
        !channelUpdatedChecked
          ? setNewEvents([...newEvents, 'channel.updated'])
          : setNewEvents(newEvents.filter(item => item !== event));
        setChannelUpdatedChecked(!channelUpdatedChecked);
        break;
      }
    }
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
            id="conversation.updated"
            name="conversation.updated"
            checked={conversationUpdatedChecked}
            onChange={() => handleChecked('conversation.updated')}
          />
          <label htmlFor="conversation.updated">
            <span>Conversation.Updated</span>
          </label>
          <input
            type="checkbox"
            id="channel.updated"
            name="channel.updated"
            checked={channelUpdatedChecked}
            onChange={() => handleChecked('channel.updated')}
          />
          <label htmlFor="channel.updated">
            <span>Channel.Updated</span>
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
      <div className={isLoading ? styles.spinAnimation : ''} style={{display: 'flex', alignSelf: 'center'}}>
        <Button
          onClick={newWebhook ? subscribeToNewWebhook : updateWebhook}
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
            width: '213px',
            height: '48px',
            borderRadius: '10px',
          }}
          disabled={newUrl === '' || isLoading}
          type="button">
          {isLoading && <RefreshIcon height={24} width={24} />}
          {isLoading ? (newWebhook ? 'Subscribing...' : 'Updating...') : newWebhook ? 'Confirm' : 'Update'}
        </Button>
      </div>
    </form>
  );
};

export default NewSubscription;
